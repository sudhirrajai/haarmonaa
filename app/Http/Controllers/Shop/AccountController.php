<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    /**
     * Customer Account Overview Dashboard.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();

        // Query all orders placed by this customer (both linked user_id and email matched guest orders)
        $ordersQuery = Order::with('items')
            ->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhere('customer_email', $user->email);
            });

        $totalOrders = (clone $ordersQuery)->count();
        $totalSpent = (clone $ordersQuery)->whereIn('status', ['delivered', 'processing', 'shipped'])->sum('total_amount');
        $activeOrdersCount = (clone $ordersQuery)->whereIn('status', ['pending', 'processing', 'shipped'])->count();
        $recentOrders = (clone $ordersQuery)->latest()->take(3)->get();
        $latestOrder = (clone $ordersQuery)->latest()->first();

        // Default shipping address from last order
        $defaultAddress = null;
        if ($latestOrder) {
            $defaultAddress = [
                'name' => $latestOrder->customer_name,
                'phone' => $latestOrder->customer_phone,
                'address' => $latestOrder->shipping_address,
                'city' => $latestOrder->city,
                'postal_code' => $latestOrder->postal_code,
            ];
        }

        return Inertia::render('Shop/Account/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'is_verified' => (bool) $user->email_verified_at,
                'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                'created_at' => $user->created_at->toIso8601String(),
            ],
            'stats' => [
                'total_orders' => $totalOrders,
                'total_spent' => (float) $totalSpent,
                'active_orders' => $activeOrdersCount,
            ],
            'recentOrders' => $recentOrders,
            'defaultAddress' => $defaultAddress,
            'products' => Product::take(4)->get(),
        ]);
    }

    /**
     * Customer Full Orders History.
     */
    public function orders(Request $request): Response
    {
        $user = Auth::user();
        $statusFilter = $request->query('status', 'all');

        $query = Order::with('items')
            ->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhere('customer_email', $user->email);
            });

        if ($statusFilter !== 'all') {
            $query->where('status', $statusFilter);
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Shop/Account/Orders', [
            'orders' => $orders,
            'currentFilter' => $statusFilter,
            'products' => Product::take(4)->get(),
        ]);
    }

    /**
     * Customer Single Order Details & Live Timeline.
     */
    public function orderDetail(Request $request, string $order_number): Response
    {
        $user = Auth::user();

        $order = Order::with('items')
            ->where('order_number', $order_number)
            ->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhere('customer_email', $user->email);
            })
            ->firstOrFail();

        return Inertia::render('Shop/Account/OrderDetail', [
            'order' => $order,
            'products' => Product::take(4)->get(),
        ]);
    }

    /**
     * Update Profile Details (Name, Phone, Password).
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:25',
            'current_password' => 'nullable|required_with:new_password|string',
            'new_password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        if (! empty($validated['new_password'])) {
            if (! Hash::check($validated['current_password'], $user->password)) {
                return back()->withErrors(['current_password' => 'The provided current password does not match.']);
            }

            $user->password = Hash::make($validated['new_password']);
        }

        $user->name = $validated['name'];
        $user->phone = $validated['phone'] ?? null;
        $user->save();

        return back()->with('success', 'Your account details have been updated.');
    }

    /**
     * Mark Email as Verified (Instant verification action).
     */
    public function verifyEmail(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if (! $user->email_verified_at) {
            $user->email_verified_at = now();
            $user->save();

            // Link any past guest orders matching this email
            Order::where('customer_email', $user->email)
                ->whereNull('user_id')
                ->update(['user_id' => $user->id]);

            return back()->with('success', 'Your email address has been successfully verified! All your orders are synced.');
        }

        return back()->with('info', 'Your email is already verified.');
    }
}
