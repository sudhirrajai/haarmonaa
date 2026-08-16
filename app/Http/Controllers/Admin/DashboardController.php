<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total_amount');
        $totalOrders = Order::count();
        $totalProducts = Product::count();
        $totalCustomers = Customer::count();

        $recentOrders = Order::with('items')->latest()->take(5)->get();
        $topProducts = Product::orderByDesc('rating')->take(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'totalRevenue' => round($totalRevenue, 2),
                'totalOrders' => $totalOrders,
                'totalProducts' => $totalProducts,
                'totalCustomers' => $totalCustomers,
                'revenueGrowth' => '+14.8%',
                'ordersGrowth' => '+22.4%',
                'customersGrowth' => '+8.2%',
            ],
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
        ]);
    }
}
