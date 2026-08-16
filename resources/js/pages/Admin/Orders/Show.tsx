import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect';
import { ArrowLeft, CheckCircle2, Truck, Clock, MapPin, Mail, Phone, ShoppingBag } from 'lucide-react';


interface OrderItemDetail {
  id: number;
  product_name: string;
  product_image?: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

interface OrderDetail {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total_amount: number;
  currency: string;
  status: string;
  payment_method: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  items: OrderItemDetail[];
}

interface ShowProps {
  order: OrderDetail;
}

export default function Show({ order }: ShowProps) {
  const handleStatusUpdate = (newStatus: string) => {
    router.patch(`/admin/orders/${order.id}/status`, { status: newStatus });
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

  return (
    <AdminLayout title={`Order #${order.order_number}`}>
      <Head title={`Order #${order.order_number} — Admin Haarmonaa`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 bg-white hover:bg-gray-100 rounded-full border border-gray-200 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Order #{order.order_number}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border ${getStatusBadge(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Placed on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Status Switcher Actions */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-500">Update Status:</span>
          <OrderStatusSelect currentStatus={order.status} onStatusChange={handleStatusUpdate} />
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Order Items & Pricing Breakdown (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items List */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Ordered Items ({order.items.length})</h2>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product_image || 'https://haarmonaa.vmcore.in/wp-content/uploads/2026/01/1.png'}
                      alt={item.product_name}
                      className="w-14 h-14 rounded-2xl object-cover bg-gray-100 border border-gray-100 flex-shrink-0"
                    />
                    <div>
                      <span className="font-bold text-gray-900 text-xs sm:text-sm block">{item.product_name}</span>
                      <span className="text-[11px] text-gray-400">
                        ₹{item.unit_price} × {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-extrabold text-gray-900 text-sm">₹{item.subtotal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-gray-900">Financial Summary</h2>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Taxes</span>
                <span className="font-bold text-gray-900">₹{order.tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-bold text-gray-900">
                  {order.shipping > 0 ? `₹${order.shipping}` : 'Free'}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-extrabold text-gray-900">
                <span>Total Amount Paid</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Delivery Info (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Client Details</h2>

            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm">{order.customer_name}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{order.customer_email}</span>
              </div>
              {order.customer_phone && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{order.customer_phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Delivery Address</h2>

            <div className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p>{order.shipping_address}</p>
                <p>
                  {order.city}, {order.postal_code}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-2 text-xs">
            <h2 className="text-sm font-bold text-gray-900">Payment Channel</h2>
            <p className="text-gray-700 font-medium">{order.payment_method}</p>
            <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase rounded-full">
              Status: {order.payment_status}
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
