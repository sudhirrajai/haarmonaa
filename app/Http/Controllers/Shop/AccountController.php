<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
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

        if (! $user) {
            return Inertia::render('Auth/Login', [
                'products' => Product::take(6)->get(),
            ]);
        }

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

        // Customer saved addresses
        $addresses = CustomerAddress::where('user_id', $user->id)->orderByDesc('is_default')->latest()->get();

        // If no saved addresses exist yet but they placed an order, create initial default address from last order
        if ($addresses->isEmpty() && $latestOrder && ! empty($latestOrder->shipping_address)) {
            $createdAddress = CustomerAddress::create([
                'user_id' => $user->id,
                'name' => $latestOrder->customer_name,
                'phone' => $latestOrder->customer_phone,
                'address_line1' => $latestOrder->shipping_address,
                'city' => $latestOrder->city,
                'postal_code' => $latestOrder->postal_code,
                'type' => 'home',
                'is_default' => true,
            ]);
            $addresses = collect([$createdAddress]);
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
                'created_at' => $user->created_at?->toIso8601String() ?? now()->toIso8601String(),
            ],
            'stats' => [
                'total_orders' => $totalOrders,
                'total_spent' => (float) $totalSpent,
                'active_orders' => $activeOrdersCount,
            ],
            'recentOrders' => $recentOrders,
            'addresses' => $addresses,
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
     * Update Profile Details (Name, Phone, Email, Password).
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
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

        $emailChanged = strtolower(trim($validated['email'])) !== strtolower($user->email);

        $user->name = $validated['name'];
        $user->email = strtolower(trim($validated['email']));
        $user->phone = $validated['phone'] ?? null;

        if ($emailChanged) {
            $user->email_verified_at = null;
            // Sync past orders with new email
            Order::where('customer_email', $user->email)
                ->whereNull('user_id')
                ->update(['user_id' => $user->id]);
        }

        $user->save();

        $message = $emailChanged
            ? 'Your profile details have been updated. Please verify your new email address.'
            : 'Your profile details have been updated successfully.';

        return back()->with('success', $message);
    }

    /**
     * Save a New Address.
     */
    public function storeAddress(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:25',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'required|string|max:20',
            'type' => 'required|string|in:home,work,other',
            'is_default' => 'nullable|boolean',
        ]);

        $hasAddresses = CustomerAddress::where('user_id', $user->id)->exists();
        $isDefault = ! empty($validated['is_default']) || ! $hasAddresses;

        if ($isDefault) {
            CustomerAddress::where('user_id', $user->id)->update(['is_default' => false]);
        }

        CustomerAddress::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'address_line1' => $validated['address_line1'],
            'address_line2' => $validated['address_line2'] ?? null,
            'city' => $validated['city'],
            'state' => $validated['state'] ?? null,
            'postal_code' => $validated['postal_code'],
            'type' => $validated['type'],
            'is_default' => $isDefault,
        ]);

        return back()->with('success', 'New address added successfully.');
    }

    /**
     * Update an Address.
     */
    public function updateAddress(Request $request, CustomerAddress $address): RedirectResponse
    {
        $user = Auth::user();

        if ($address->user_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:25',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'required|string|max:20',
            'type' => 'required|string|in:home,work,other',
            'is_default' => 'nullable|boolean',
        ]);

        if (! empty($validated['is_default'])) {
            CustomerAddress::where('user_id', $user->id)->update(['is_default' => false]);
        }

        $address->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'address_line1' => $validated['address_line1'],
            'address_line2' => $validated['address_line2'] ?? null,
            'city' => $validated['city'],
            'state' => $validated['state'] ?? null,
            'postal_code' => $validated['postal_code'],
            'type' => $validated['type'],
            'is_default' => ! empty($validated['is_default']) ? true : $address->is_default,
        ]);

        return back()->with('success', 'Address updated successfully.');
    }

    /**
     * Delete an Address.
     */
    public function destroyAddress(Request $request, CustomerAddress $address): RedirectResponse
    {
        $user = Auth::user();

        if ($address->user_id !== $user->id) {
            abort(403);
        }

        $wasDefault = $address->is_default;
        $address->delete();

        if ($wasDefault) {
            // Set the first remaining address as default
            $nextAddress = CustomerAddress::where('user_id', $user->id)->first();
            if ($nextAddress) {
                $nextAddress->update(['is_default' => true]);
            }
        }

        return back()->with('success', 'Address removed successfully.');
    }

    /**
     * Set Default Address.
     */
    public function setDefaultAddress(Request $request, CustomerAddress $address): RedirectResponse
    {
        $user = Auth::user();

        if ($address->user_id !== $user->id) {
            abort(403);
        }

        CustomerAddress::where('user_id', $user->id)->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return back()->with('success', 'Default shipping address updated.');
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
