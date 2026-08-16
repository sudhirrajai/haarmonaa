import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  IndianRupee,
  ShoppingBag,
  Gem,
  Users,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Eye,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
} from 'lucide-react';

interface DashboardProps {
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    revenueGrowth: string;
    ordersGrowth: string;
    customersGrowth: string;
  };
  recentOrders: Array<{
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    total_amount: number;
    currency: string;
    status: string;
    created_at: string;
    items: Array<{
      id: number;
      product_name: string;
      product_image?: string;
      quantity: number;
    }>;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    slug: string;
    category_name: string;
    price: number;
    image: string;
    rating: number;
    review_count: number;
    stock_quantity: number;
  }>;
}

export default function Dashboard({ metrics, recentOrders = [], topProducts = [] }: DashboardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <Head title="Admin Dashboard — Haarmonaa Luxury Jewelry" />

      {/* Page Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Overview Dashboard
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
            Real-time analytics, order transactions, and catalog metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-full text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* 1. Metric Stat Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              ₹{metrics.totalRevenue.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {metrics.revenueGrowth}
            </span>
          </div>
        </div>

        {/* Metric 2: Orders */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Orders Processed</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {metrics.totalOrders}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {metrics.ordersGrowth}
            </span>
          </div>
        </div>

        {/* Metric 3: Active Products */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Catalog Products</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
              <Gem className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {metrics.totalProducts}
            </span>
            <span className="text-[11px] font-bold text-gray-400">Active</span>
          </div>
        </div>

        {/* Metric 4: Total Customers */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Clients</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {metrics.totalCustomers}
            </span>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {metrics.customersGrowth}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Recent Orders (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Recent Customer Orders</h2>
                <p className="text-xs text-gray-500">Latest jewelry orders across all payment channels.</p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-gray-900 hover:text-[#d0473e] flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/70 text-gray-500 font-bold border-b border-gray-100">
                  <tr>
                    <th className="py-3 px-5">Order #</th>
                    <th className="py-3 px-5">Customer</th>
                    <th className="py-3 px-5">Items</th>
                    <th className="py-3 px-5">Total</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-5 font-bold text-gray-900">{order.order_number}</td>
                      <td className="py-4 px-5">
                        <span className="block font-bold text-gray-900">{order.customer_name}</span>
                        <span className="block text-[11px] text-gray-400">{order.customer_email}</span>
                      </td>
                      <td className="py-4 px-5 text-gray-600">{order.items?.length || 1} item(s)</td>
                      <td className="py-4 px-5 font-bold text-gray-900">₹{order.total_amount}</td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-1.5 inline-block text-gray-500 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
                          title="View Order"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Top Selling Products (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-gray-900">Featured Jewelry</h2>
              <p className="text-xs text-gray-500">Highest rated client favorites</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-gray-900 hover:text-[#d0473e] flex items-center gap-1 transition-colors"
            >
              <span>Catalog</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {topProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-gray-900 truncate">{prod.name}</h3>
                  <span className="text-[11px] text-gray-400 block">{prod.category_name}</span>
                  <span className="text-xs font-extrabold text-gray-900">₹{prod.price}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[11px] font-bold text-amber-600 block">★ {prod.rating}</span>
                  <span className="text-[10px] text-gray-400">{prod.stock_quantity} left</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
