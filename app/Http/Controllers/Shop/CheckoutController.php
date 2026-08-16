<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function showCheckout(): Response
    {
        return Inertia::render('Shop/Checkout', [
            'products' => Product::take(6)->get(),
            'razorpayKey' => config('services.razorpay.key', env('RAZORPAY_KEY', 'rzp_test_demo123456')),
        ]);
    }

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
            'payment_method' => 'required|string|in:razorpay,cod,card,upi',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.variant_id' => 'nullable|integer',
            'items.*.product_name' => 'required|string',
            'items.*.product_image' => 'nullable|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $subtotal = 0;
        foreach ($validated['items'] as $item) {
            $subtotal += $item['unit_price'] * $item['quantity'];
        }

        $tax = round($subtotal * 0.03, 2); // 3% GST on fine jewelry
        $shipping = $subtotal >= 999 ? 0.00 : 49.00;
        $totalAmount = round($subtotal + $tax + $shipping, 2);

        $customerName = trim($validated['first_name'].' '.$validated['last_name']);
        $orderNumber = 'ORD-'.date('Y').'-'.strtoupper(Str::random(6));

        $order = Order::create([
            'order_number' => $orderNumber,
            'customer_name' => $customerName,
            'customer_email' => $validated['email'],
            'customer_phone' => $validated['phone'],
            'shipping_address' => $validated['address'],
            'city' => $validated['city'],
            'postal_code' => $validated['postal_code'],
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total_amount' => $totalAmount,
            'currency' => '₹',
            'status' => $validated['payment_method'] === 'cod' ? 'processing' : 'pending',
            'payment_method' => strtoupper($validated['payment_method']),
            'payment_status' => $validated['payment_method'] === 'cod' ? 'pending' : 'pending',
            'notes' => 'Storefront online order',
        ]);

        // Insert Order Items and decrement stock
        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'product_name' => $item['product_name'],
                'product_image' => $item['product_image'] ?? null,
                'unit_price' => $item['unit_price'],
                'quantity' => $item['quantity'],
                'subtotal' => round($item['unit_price'] * $item['quantity'], 2),
            ]);

            // Decrement Stock
            $product = Product::find($item['product_id']);
            if ($product) {
                $product->decrement('stock_quantity', $item['quantity']);
            }

            if (! empty($item['variant_id'])) {
                $variant = ProductVariant::find($item['variant_id']);
                if ($variant) {
                    $variant->decrement('stock_quantity', $item['quantity']);
                }
            }
        }

        // Upsert Customer Profile
        $customer = Customer::firstOrNew(['email' => $validated['email']]);
        $customer->name = $customerName;
        $customer->phone = $validated['phone'];
        $customer->city = $validated['city'];
        $customer->total_orders = ($customer->total_orders ?? 0) + 1;
        $customer->total_spent = ($customer->total_spent ?? 0) + $totalAmount;
        $customer->save();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'order_number' => $orderNumber,
                'order_id' => $order->id,
                'amount' => $totalAmount,
                'currency' => 'INR',
                'payment_method' => $validated['payment_method'],
                'redirect_url' => route('shop.orderSuccess', ['order_number' => $orderNumber]),
            ]);
        }

        return redirect()->route('shop.orderSuccess', ['order_number' => $orderNumber]);
    }

    public function verifyRazorpay(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_number' => 'required|string|exists:orders,order_number',
            'razorpay_payment_id' => 'required|string',
            'razorpay_order_id' => 'nullable|string',
            'razorpay_signature' => 'nullable|string',
        ]);

        $order = Order::where('order_number', $validated['order_number'])->firstOrFail();
        $order->update([
            'status' => 'processing',
            'payment_status' => 'paid',
            'notes' => 'Razorpay Payment ID: '.$validated['razorpay_payment_id'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment verified successfully.',
            'redirect_url' => route('shop.orderSuccess', ['order_number' => $order->order_number]),
        ]);
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
