<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Setting;
use App\Services\CouponService;
use App\Services\RazorpayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function showCheckout(): Response
    {
        $user = Auth::user();
        $savedAddresses = $user
            ? CustomerAddress::where('user_id', $user->id)->orderByDesc('is_default')->latest()->get()
            : [];

        return Inertia::render('Shop/Checkout', [
            'products' => Product::take(6)->get(),
            'razorpayKey' => RazorpayService::getKeyId(),
            'isRazorpayConfigured' => RazorpayService::isConfigured(),
            'savedAddresses' => $savedAddresses,
        ]);
    }

    /**
     * Calculate order totals server-side (prevents client-side price tampering).
     */
    protected function calculateTotals(array $validated): array
    {
        $subtotal = 0.0;
        $itemsWithActualPrices = [];

        foreach ($validated['items'] as $item) {
            $product = Product::find($item['product_id']);
            $unitPrice = $product ? (float) $product->price : (float) $item['unit_price'];

            if (! empty($item['variant_id'])) {
                $variant = ProductVariant::find($item['variant_id']);
                if ($variant && $variant->price > 0) {
                    $unitPrice = (float) $variant->price;
                }
            }

            $qty = (int) $item['quantity'];
            $subtotal += $unitPrice * $qty;

            $itemsWithActualPrices[] = array_merge($item, [
                'unit_price' => $unitPrice,
                'subtotal' => round($unitPrice * $qty, 2),
            ]);
        }

        // Coupon Processing
        $appliedCodes = [];
        if (! empty($validated['coupon_codes'])) {
            $appliedCodes = $validated['coupon_codes'];
        } elseif (! empty($validated['coupon_code'])) {
            $appliedCodes = explode(',', $validated['coupon_code']);
        }

        $appliedCoupons = [];
        $discountAmount = 0.00;

        if (! empty($appliedCodes)) {
            $couponResult = CouponService::recalculateAll(
                $appliedCodes,
                $itemsWithActualPrices,
                $validated['email']
            );

            if ($couponResult['valid'] && ! empty($couponResult['coupons'])) {
                $appliedCoupons = $couponResult['coupons'];
                $discountAmount = (float) $couponResult['total_discount'];
            }
        }

        $taxRatePercent = (float) Setting::get('tax_rate_percent', 0);
        $freeShippingThreshold = (float) Setting::get('free_shipping_min_order', Setting::get('free_shipping_threshold', 999));
        $standardShippingFee = (float) Setting::get('shipping_fee', 49.00);
        $enableFreeShipping = (bool) Setting::get('enable_free_shipping', true);
        $currencySymbol = Setting::get('currency_symbol', '₹');

        $taxableAmount = max(0, $subtotal - $discountAmount);
        $tax = $taxRatePercent > 0 ? round($taxableAmount * ($taxRatePercent / 100), 2) : 0.00;

        // Dynamic Shipping Rule Calculation
        if (empty($itemsWithActualPrices) || $subtotal == 0) {
            $shipping = 0.00;
        } else {
            $allFreeShipping = true;
            $customFlatFee = null;
            $hasExcludeFree = false;

            foreach ($itemsWithActualPrices as $item) {
                $prod = Product::find($item['product_id'] ?? null);
                if ($prod) {
                    if ($prod->shipping_type !== 'free') {
                        $allFreeShipping = false;
                    }
                    if ($prod->shipping_type === 'flat_rate' && $prod->shipping_fee !== null) {
                        $customFlatFee = (float) $prod->shipping_fee;
                    }
                    if ($prod->shipping_type === 'exclude_free_shipping') {
                        $hasExcludeFree = true;
                    }
                } else {
                    $allFreeShipping = false;
                }
            }

            if ($allFreeShipping) {
                $shipping = 0.00;
            } elseif ($customFlatFee !== null) {
                $shipping = $customFlatFee;
            } elseif (! $hasExcludeFree && $enableFreeShipping && ($freeShippingThreshold == 0 || $subtotal >= $freeShippingThreshold)) {
                $shipping = 0.00;
            } else {
                $shipping = $standardShippingFee;
            }
        }

        $totalAmount = round($taxableAmount + $tax + $shipping, 2);

        return [
            'subtotal' => $subtotal,
            'discount_amount' => $discountAmount,
            'applied_coupons' => $appliedCoupons,
            'tax' => $tax,
            'shipping' => $shipping,
            'total_amount' => $totalAmount,
            'currency' => $currencySymbol,
            'items' => $itemsWithActualPrices,
        ];
    }

    /**
     * Create Razorpay Server-Side Order ID with cryptographic integrity.
     */
    public function createRazorpayOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:30',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'coupon_code' => 'nullable|string',
            'coupon_codes' => 'nullable|array',
            'coupon_codes.*' => 'string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.variant_id' => 'nullable|integer',
            'items.*.product_name' => 'required|string',
            'items.*.product_image' => 'nullable|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $calc = $this->calculateTotals($validated);
        $customerName = trim($validated['first_name'].' '.$validated['last_name']);
        $orderNumber = 'ORD-'.date('Y').'-'.strtoupper(Str::random(6));
        $user = Auth::user();

        // Optional address saving for authenticated customer
        if ($user && $request->boolean('save_address')) {
            $setAsDefault = $request->boolean('set_as_default');
            if ($setAsDefault) {
                CustomerAddress::where('user_id', $user->id)->update(['is_default' => false]);
            }
            $isDefault = $setAsDefault || ! CustomerAddress::where('user_id', $user->id)->exists();

            CustomerAddress::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'address_line1' => $validated['address'],
                    'city' => $validated['city'],
                    'postal_code' => $validated['postal_code'],
                ],
                [
                    'name' => $customerName,
                    'phone' => $validated['phone'],
                    'type' => 'home',
                    'is_default' => $isDefault,
                ]
            );
        }

        try {
            // 1. Create order on Razorpay API
            $razorpayOrder = RazorpayService::createOrder(
                $calc['total_amount'],
                $orderNumber,
                [
                    'order_number' => $orderNumber,
                    'customer_name' => $customerName,
                    'customer_email' => $validated['email'],
                    'customer_phone' => $validated['phone'],
                ]
            );

            // 2. Pre-create pending order in Database (fail-safe for webhook matching)
            DB::beginTransaction();

            $appliedCodesString = ! empty($calc['applied_coupons']) ? implode(', ', array_column($calc['applied_coupons'], 'code')) : null;

            $order = Order::create([
                'user_id' => $user?->id,
                'order_number' => $orderNumber,
                'customer_name' => $customerName,
                'customer_email' => $validated['email'],
                'customer_phone' => $validated['phone'],
                'shipping_address' => $validated['address'],
                'city' => $validated['city'],
                'postal_code' => $validated['postal_code'],
                'subtotal' => $calc['subtotal'],
                'coupon_code' => $appliedCodesString,
                'discount_amount' => $calc['discount_amount'],
                'tax' => $calc['tax'],
                'shipping' => $calc['shipping'],
                'total_amount' => $calc['total_amount'],
                'currency' => $calc['currency'],
                'status' => 'pending',
                'payment_method' => 'RAZORPAY',
                'payment_status' => 'pending',
                'razorpay_order_id' => $razorpayOrder['id'],
                'notes' => 'Razorpay checkout initiated.',
            ]);

            // Save order items
            foreach ($calc['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'product_image' => $item['product_image'] ?? null,
                    'unit_price' => $item['unit_price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['subtotal'],
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'key_id' => RazorpayService::getKeyId(),
                'razorpay_order_id' => $razorpayOrder['id'],
                'order_number' => $orderNumber,
                'amount' => $calc['total_amount'],
                'amount_paise' => $razorpayOrder['amount'],
                'currency' => 'INR',
                'customer' => [
                    'name' => $customerName,
                    'email' => $validated['email'],
                    'phone' => $validated['phone'],
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Razorpay Order Initialization Failed: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Unable to initialize secure payment session. Please try again or choose Cash on Delivery.',
            ], 500);
        }
    }

    /**
     * Verify payment signature from Razorpay checkout modal (HMAC-SHA256).
     */
    public function verifyRazorpay(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_number' => 'required|string|exists:orders,order_number',
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        $order = Order::where('order_number', $validated['order_number'])->firstOrFail();

        // Cryptographic Signature Verification
        $isValid = RazorpayService::verifyPaymentSignature(
            $validated['razorpay_order_id'],
            $validated['razorpay_payment_id'],
            $validated['razorpay_signature']
        );

        if (! $isValid) {
            Log::alert('Razorpay Signature Verification Failed (Potential Hijack Attempt)', [
                'order_number' => $order->order_number,
                'razorpay_order_id' => $validated['razorpay_order_id'],
                'razorpay_payment_id' => $validated['razorpay_payment_id'],
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Payment signature verification failed. If your account was debited, our team will verify your payment and confirm your order within 24 hours.',
            ], 400);
        }

        DB::beginTransaction();

        try {
            $order->update([
                'status' => 'processing',
                'payment_status' => 'paid',
                'razorpay_payment_id' => $validated['razorpay_payment_id'],
                'razorpay_signature' => $validated['razorpay_signature'],
                'notes' => trim(($order->notes ?? '')."\nPayment verified successfully via Razorpay (Payment ID: {$validated['razorpay_payment_id']})."),
            ]);

            // Decrement Stock
            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $product->decrement('stock_quantity', $item->quantity);
                }
            }

            // Record Coupon Usage
            if (! empty($order->coupon_code)) {
                $codes = explode(', ', $order->coupon_code);
                foreach ($codes as $code) {
                    $coupon = Coupon::where('code', $code)->first();
                    if ($coupon) {
                        CouponUsage::create([
                            'coupon_id' => $coupon->id,
                            'order_id' => $order->id,
                            'customer_email' => strtolower(trim($order->customer_email)),
                            'discount_amount' => $order->discount_amount,
                        ]);
                        $coupon->increment('usage_count');
                    }
                }
            }

            // Upsert Customer Profile
            $customer = Customer::firstOrNew(['email' => $order->customer_email]);
            $customer->name = $order->customer_name;
            $customer->phone = $order->customer_phone;
            $customer->city = $order->city;
            $customer->total_orders = ($customer->total_orders ?? 0) + 1;
            $customer->total_spent = ($customer->total_spent ?? 0) + $order->total_amount;
            $customer->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment verified successfully.',
                'redirect_url' => route('shop.orderSuccess', ['order_number' => $order->order_number]),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Razorpay Order Finalization Error: '.$e->getMessage());

            return response()->json([
                'success' => true,
                'message' => 'Payment received. Order is being processed.',
                'redirect_url' => route('shop.orderSuccess', ['order_number' => $order->order_number]),
            ]);
        }
    }

    /**
     * Process COD (Cash on Delivery) orders directly.
     */
    public function process(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:30',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'payment_method' => 'required|string|in:cod,razorpay',
            'coupon_code' => 'nullable|string',
            'coupon_codes' => 'nullable|array',
            'coupon_codes.*' => 'string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.variant_id' => 'nullable|integer',
            'items.*.product_name' => 'required|string',
            'items.*.product_image' => 'nullable|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $calc = $this->calculateTotals($validated);
        $customerName = trim($validated['first_name'].' '.$validated['last_name']);
        $orderNumber = 'ORD-'.date('Y').'-'.strtoupper(Str::random(6));
        $user = Auth::user();

        // Optional address saving for authenticated customer
        if ($user && $request->boolean('save_address')) {
            $setAsDefault = $request->boolean('set_as_default');
            if ($setAsDefault) {
                CustomerAddress::where('user_id', $user->id)->update(['is_default' => false]);
            }
            $isDefault = $setAsDefault || ! CustomerAddress::where('user_id', $user->id)->exists();

            CustomerAddress::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'address_line1' => $validated['address'],
                    'city' => $validated['city'],
                    'postal_code' => $validated['postal_code'],
                ],
                [
                    'name' => $customerName,
                    'phone' => $validated['phone'],
                    'type' => 'home',
                    'is_default' => $isDefault,
                ]
            );
        }

        DB::beginTransaction();

        try {
            $appliedCodesString = ! empty($calc['applied_coupons']) ? implode(', ', array_column($calc['applied_coupons'], 'code')) : null;

            $order = Order::create([
                'user_id' => $user?->id,
                'order_number' => $orderNumber,
                'customer_name' => $customerName,
                'customer_email' => $validated['email'],
                'customer_phone' => $validated['phone'],
                'shipping_address' => $validated['address'],
                'city' => $validated['city'],
                'postal_code' => $validated['postal_code'],
                'subtotal' => $calc['subtotal'],
                'coupon_code' => $appliedCodesString,
                'discount_amount' => $calc['discount_amount'],
                'tax' => $calc['tax'],
                'shipping' => $calc['shipping'],
                'total_amount' => $calc['total_amount'],
                'currency' => $calc['currency'],
                'status' => 'processing',
                'payment_method' => 'COD',
                'payment_status' => 'pending',
                'notes' => 'Cash on Delivery order placed.',
            ]);

            foreach ($calc['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'product_image' => $item['product_image'] ?? null,
                    'unit_price' => $item['unit_price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['subtotal'],
                ]);

                // Decrement Stock
                $product = Product::find($item['product_id']);
                if ($product) {
                    $product->decrement('stock_quantity', $item['quantity']);
                }
            }

            // Record Coupon Usage
            foreach ($calc['applied_coupons'] as $applied) {
                CouponUsage::create([
                    'coupon_id' => $applied['id'],
                    'order_id' => $order->id,
                    'customer_email' => strtolower(trim($validated['email'])),
                    'discount_amount' => $applied['discount'],
                ]);

                $couponModel = Coupon::find($applied['id']);
                if ($couponModel) {
                    $couponModel->increment('usage_count');
                }
            }

            // Upsert Customer
            $customer = Customer::firstOrNew(['email' => $validated['email']]);
            $customer->name = $customerName;
            $customer->phone = $validated['phone'];
            $customer->city = $validated['city'];
            $customer->total_orders = ($customer->total_orders ?? 0) + 1;
            $customer->total_spent = ($customer->total_spent ?? 0) + $calc['total_amount'];
            $customer->save();

            DB::commit();

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'order_number' => $orderNumber,
                    'redirect_url' => route('shop.orderSuccess', ['order_number' => $orderNumber]),
                ]);
            }

            return redirect()->route('shop.orderSuccess', ['order_number' => $orderNumber]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('COD Order Creation Error: '.$e->getMessage());

            if ($request->wantsJson()) {
                return response()->json(['success' => false, 'message' => 'Failed to place order.'], 500);
            }

            return back()->with('error', 'Failed to place order. Please try again.');
        }
    }

    public function orderSuccess(string $order_number): Response
    {
        $order = Order::with('items')->where('order_number', $order_number)->firstOrFail();

        return Inertia::render('Shop/OrderSuccess', [
            'order' => $order,
            'products' => Product::take(4)->get(),
        ]);
    }
}
