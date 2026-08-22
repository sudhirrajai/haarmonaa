import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { Product } from '@/types/shop';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface OrderItem {
  id: number;
  product_name: string;
  product_image?: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

interface OrderData {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  subtotal: number;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

interface OrdersProps {
  orders: {
    data: OrderData[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
  };
  currentFilter: string;
  products?: Product[];
}

export default function Orders({ orders, currentFilter = 'all', products = [] }: OrdersProps) {
  const filterTabs = [
    { label: 'All Orders', value: 'all' },
    { label: 'In Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Pending Payment', value: 'pending' },
  ];

  const handleFilterChange = (val: string) => {
    router.get('/account/orders', { status: val }, { preserveState: true });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3.5 h-3.5" />
            <span>Shipped</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Processing</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-gray-50 text-gray-700 border border-gray-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <GlozinLayout allProducts={products}>
      <Head title="My Orders & Shipments — Haarmonaa Fine Jewelry" />

      {/* Header Banner */}
      <section className="pt-10 pb-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-[12px] font-semibold text-gray-500 mb-3">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2 text-gray-400">•</span>
            <Link href="/account" className="hover:text-black">My Account</Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">Order History</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                My Orders & Shipments
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Track your active jewelry dispatches, view detailed receipts, and access lifetime order invoices.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-gray-100 mt-6 pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleFilterChange(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  currentFilter === tab.value
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-[#fafafa] py-10 min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {orders.data.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200/80 text-center space-y-4 max-w-md mx-auto shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">No orders in this category</h2>
              <p className="text-xs text-gray-500">
                You have no orders matching the "{currentFilter}" status filter.
              </p>
              <div className="pt-2">
                <Link
                  href="/account/orders"
                  className="inline-block px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl text-xs font-bold transition-all"
                >
                  View All Orders
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.data.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-200/80 hover:border-gray-300 transition-all shadow-2xs space-y-5"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                          Order Reference
                        </span>
                        <span className="text-sm font-extrabold text-gray-900 font-mono">
                          #{order.order_number}
                        </span>
                      </div>
                      <span className="text-gray-300 hidden sm:inline">•</span>
                      <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                          Date Placed
                        </span>
                        <span className="text-xs font-medium text-gray-700">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <span className="text-gray-300 hidden sm:inline">•</span>
                      <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                          Payment
                        </span>
                        <span className="text-xs font-medium text-gray-700">
                          {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online / UPI (Razorpay)'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-14 h-14 object-cover rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900">{item.product_name}</h4>
                            <span className="text-[11px] text-gray-500 block mt-0.5">
                              Qty: {item.quantity} × ₹{item.unit_price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs sm:text-sm font-extrabold text-gray-900 font-mono">
                          ₹{item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-gray-400">Delivering to: </span>
                      <strong className="text-gray-900 font-bold">{order.city} ({order.postal_code})</strong>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Grand Total</span>
                        <span className="text-base font-extrabold text-gray-900 font-mono">
                          ₹{order.total_amount.toFixed(2)}
                        </span>
                      </div>

                      <Link
                        href={`/account/orders/${order.order_number}`}
                        className="px-4 py-2 bg-black hover:bg-[#d0473e] text-white rounded-xl font-bold transition-all shadow-xs inline-flex items-center gap-1.5"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {orders.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {orders.links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.url || '#'}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    link.active
                      ? 'bg-black text-white'
                      : link.url
                      ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </GlozinLayout>
  );
}
