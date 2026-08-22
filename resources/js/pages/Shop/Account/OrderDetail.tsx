import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { Product } from '@/types/shop';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  Printer,
  ArrowLeft,
  ShoppingBag,
  MapPin,
  CreditCard,
  Building,
} from 'lucide-react';

interface OrderItem {
  id: number;
  product_name: string;
  product_image?: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

interface OrderDetailProps {
  order: {
    id: number;
    order_number: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    city: string;
    postal_code: string;
    subtotal: number;
    discount_amount?: number;
    coupon_code?: string;
    tax?: number;
    shipping: number;
    total_amount: number;
    currency: string;
    status: string;
    payment_method: string;
    payment_status: string;
    razorpay_payment_id?: string;
    notes?: string;
    created_at: string;
    items: OrderItem[];
  };
  products?: Product[];
}

export default function OrderDetail({ order, products = [] }: OrderDetailProps) {
  const handlePrint = () => {
    window.print();
  };

  const steps = [
    { title: 'Order Placed', desc: 'Received online', done: true },
    { title: 'Processing', desc: 'In workshop', done: ['processing', 'shipped', 'delivered'].includes(order.status.toLowerCase()) },
    { title: 'Shipped', desc: 'With courier', done: ['shipped', 'delivered'].includes(order.status.toLowerCase()) },
    { title: 'Delivered', desc: 'At destination', done: order.status.toLowerCase() === 'delivered' },
  ];

  return (
    <GlozinLayout allProducts={products}>
      <Head title={`Order #${order.order_number} — Haarmonaa Fine Jewelry`} />

      {/* Header Banner */}
      <section className="pt-10 pb-8 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="text-[12px] font-semibold text-gray-500 mb-3">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2 text-gray-400">•</span>
            <Link href="/account" className="hover:text-black">My Account</Link>
            <span className="mx-2 text-gray-400">•</span>
            <Link href="/account/orders" className="hover:text-black">Orders</Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">#{order.order_number}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-mono">
                  Order #{order.order_number}
                </h1>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <Link
                href="/account/orders"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-[#d0473e] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Orders</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#fafafa] py-10 min-h-[70vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Tracking Progress Timeline */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs space-y-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Live Fulfillment Status
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center relative z-10 space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                      step.done
                        ? 'bg-emerald-600 text-white shadow-emerald-200'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step.done ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </h4>
                    <span className="text-[10.5px] text-gray-400 block">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchased Pieces Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs space-y-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100">
              Purchased Jewelry Pieces ({order.items.length})
            </h2>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-2xl border border-gray-100 bg-gray-50 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                        <Package className="w-7 h-7" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900">{item.product_name}</h3>
                      <span className="text-xs text-gray-500 block mt-1">
                        Quantity: <strong>{item.quantity}</strong> × ₹{item.unit_price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <span className="text-sm sm:text-base font-extrabold text-gray-900 font-mono">
                    ₹{item.subtotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="p-5 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount_amount && order.discount_amount > 0 ? (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                  <span className="font-bold">-₹{order.discount_amount.toFixed(2)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-gray-600">
                <span>Insured Express Shipping</span>
                <span className="font-bold text-gray-900">
                  {order.shipping === 0 ? <span className="text-emerald-600 font-bold uppercase">FREE</span> : `₹${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-gray-900 uppercase">Grand Total</span>
                <span className="text-xl font-extrabold text-gray-900 font-mono">
                  ₹{order.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Delivery Destination */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-700" />
                <span>Delivery Destination</span>
              </h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-bold text-gray-900">{order.customer_name}</p>
                <p className="leading-relaxed">{order.shipping_address}</p>
                <p className="font-medium text-gray-800">{order.city} - {order.postal_code}</p>
                <p className="text-gray-500 pt-1">Phone: {order.customer_phone}</p>
                <p className="text-gray-500">Email: {order.customer_email}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-700" />
                <span>Payment & Verification</span>
              </h3>
              <div className="text-xs text-gray-600 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Payment Mode</span>
                  <span className="font-bold text-gray-900 uppercase">
                    {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online / Razorpay'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Payment Status</span>
                  <span className="font-bold text-emerald-600 uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {order.payment_status}
                  </span>
                </div>
                {order.razorpay_payment_id && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Payment Ref ID</span>
                    <span className="font-mono text-gray-700 font-bold">{order.razorpay_payment_id}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlozinLayout>
  );
}
