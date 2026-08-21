<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\CustomerBlockedMail;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'active');
        $search = $request->query('search', '');
        $perPage = (int) $request->query('per_page', 10);
        if (! in_array($perPage, [10, 15, 20, 50, 100])) {
            $perPage = 10;
        }

        if ($status === 'archived' || $status === 'trashed') {
            $query = Customer::onlyTrashed()->latest('deleted_at');
        } else {
            $query = Customer::latest();
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%");
            });
        }

        $customers = $query->paginate($perPage)->withQueryString();

        // Attach order history stats to paginated items
        $customers->getCollection()->transform(function ($customer) {
            $orders = Order::with('items')
                ->where('customer_email', $customer->email)
                ->latest()
                ->get();

            $customer->orders = $orders;
            if ($orders->isNotEmpty()) {
                $customer->total_orders = $orders->count();
                $customer->total_spent = (float) $orders->sum('total_amount');
            }

            return $customer;
        });

        $activeCount = Customer::count();
        $archivedCount = Customer::onlyTrashed()->count();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'activeCount' => $activeCount,
            'archivedCount' => $archivedCount,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:customers,email',
            'phone' => 'nullable|string|max:50',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:500',
            'status' => 'required|string|in:active,inactive,vip,blocked',
            'block_reason' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:1000',
        ]);

        Customer::create($validated);

        return back()->with('success', 'Customer profile created successfully.');
    }

    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('customers', 'email')->ignore($customer->id)],
            'phone' => 'nullable|string|max:50',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:500',
            'status' => 'required|string|in:active,inactive,vip,blocked',
            'block_reason' => 'nullable|string|max:1000',
            'send_email' => 'nullable|boolean',
            'notes' => 'nullable|string|max:1000',
        ]);

        $shouldSendEmail = $request->boolean('send_email');
        $isNowBlocked = $validated['status'] === 'blocked';
        $wasNotBlocked = $customer->status !== 'blocked';

        $customer->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'city' => $validated['city'] ?? null,
            'state' => $validated['state'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'address' => $validated['address'] ?? null,
            'status' => $validated['status'],
            'block_reason' => $isNowBlocked ? ($validated['block_reason'] ?? null) : null,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Send email if requested and customer is blocked
        if ($isNowBlocked && $shouldSendEmail) {
            try {
                Mail::to($customer->email)->send(new CustomerBlockedMail($customer, $validated['block_reason'] ?? null));
            } catch (\Throwable $e) {
                // Log or ignore mail transport errors in local dev
            }
        }

        return back()->with('success', 'Customer profile updated successfully.');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        $customer->delete();

        return back()->with('success', 'Customer has been moved to archive (soft deleted). Data is preserved.');
    }

    public function restore(int $id): RedirectResponse
    {
        $customer = Customer::onlyTrashed()->findOrFail($id);
        $customer->restore();

        return back()->with('success', 'Customer profile has been restored successfully.');
    }

    public function forceDelete(int $id): RedirectResponse
    {
        $customer = Customer::onlyTrashed()->findOrFail($id);
        $customer->forceDelete();

        return back()->with('success', 'Customer profile and records permanently deleted.');
    }
}
