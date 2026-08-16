import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Search, Eye, ShoppingBag, Clock, CheckCircle2, Truck, AlertCircle, XCircle } from 'lucide-react';

interface OrderItem {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  currency: string;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  items: Array<{
    id: number;
    product_name: string;
    product_image?: string;
    quantity: number;
  }>;
}

interface OrdersIndexProps {
  orders: OrderItem[];
  filters: {
    status: string;
    search: string;
  };
  statusCounts: {
    all: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

export default function Index({ orders = [], filters, statusCounts }: OrdersIndexProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/orders', { status: selectedStatus, search: searchTerm }, { preserveState: true });
  };

  const handleStatusTab = (st: string) => {
    setSelectedStatus(st);
    router.get('/admin/orders', { status: st, search: searchTerm }, { preserveState: true });
  };

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

  const tabs = [
    { key: 'all', label: 'All Orders', count: statusCounts.all },
    { key: 'pending', label: 'Pending', count: statusCounts.pending },
    { key: 'processing', label: 'Processing', count: statusCounts.processing },
    { key: 'shipped', label: 'Shipped', count: statusCounts.shipped },
    { key: 'delivered', label: 'Delivered', count: statusCounts.delivered },
    { key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
  ];

  return (
    <AdminLayout title="Orders Management">
      <Head title="Orders — Admin Haarmonaa" />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Customer Orders
        </h1>
        <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
          Review, dispatch, and track customer fine jewelry transactions.
        </p>
      </div>

      {/* Status Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleStatusTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedStatus === tab.key
                  ? 'bg-[#111111] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label} <span className="opacity-70 text-[10px]">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order number or client..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-9 pr-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white"
          />
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-5">Order #</th>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Items</th>
                <th className="py-3.5 px-5">Total</th>
                <th className="py-3.5 px-5">Payment</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {orders.length > 0 ? (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-extrabold text-gray-900 block">{o.order_number}</span>
                      <span className="text-[11px] text-gray-400">
                        {new Date(o.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-bold text-gray-900 block">{o.customer_name}</span>
                      <span className="text-[11px] text-gray-400">{o.customer_email}</span>
                    </td>
                    <td className="py-4 px-5 text-gray-700">
                      {o.items?.length || 1} piece(s)
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-extrabold text-gray-900 text-sm">₹{o.total_amount}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="block text-gray-800">{o.payment_method}</span>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        {o.payment_status}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadge(
                          o.status
                        )}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-black hover:text-white rounded-full text-xs font-bold text-gray-800 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
