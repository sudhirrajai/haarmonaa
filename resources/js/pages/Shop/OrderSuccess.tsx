import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { Product } from '@/types/shop';
import { CheckCircle2, PackageCheck, Truck, ShieldCheck, ArrowRight, Printer } from 'lucide-react';

interface OrderItemData {
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
  discount_amount?: number;
  coupon_code?: string;
  tax?: number;
  shipping: number;
  total_amount: number;
  currency: string;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  items: OrderItemData[];
}

interface OrderSuccessProps {
  order: OrderData;
  products?: Product[];
}

export default function OrderSuccess({ order, products = [] }: OrderSuccessProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <GlozinLayout allProducts={products}>
      <Head title={`Order Confirmed #${order.order_number} — Haarmonaa Luxury Jewelry`} />

      <section className="py-12 sm:py-16 bg-[#fafafa]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 animate-fade-in">
            {/* Top Success Badge */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 uppercase tracking-widest px-3 py-1 rounded-full inline-block">
                Order Confirmed & Payment Received
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Thank You For Your Order!
              </h1>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                We've received your jewelry order and our master jewelers have begun preparing your package. A confirmation invoice has been sent to <strong>{order.customer_email}</strong>.
              </p>
            </div>

            {/* Order Meta Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Order Number</span>
                <span className="font-bold text-gray-900 font-mono">{order.order_number}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Date Placed</span>
                <span className="font-bold text-gray-900">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Payment Method</span>
                <span className="font-bold text-gray-900 uppercase">
                  {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online / UPI (Razorpay)'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Payment Status</span>
                <span className="font-bold text-emerald-600 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {order.payment_status}
                </span>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2">
                Purchased Jewelry Items ({order.items.length})
              </h2>

              <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-14 h-14 object-cover rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0"
                        />
                      )}
                      <div>
                        <h3 className="text-xs font-bold text-gray-900">{item.product_name}</h3>
                        <span className="text-[11px] text-gray-500">Qty: {item.quantity} × ₹{item.unit_price.toFixed(2)}</span>
                      </div>
                    </div>

                    <span className="text-xs font-extrabold text-gray-900">
                      ₹{item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-2 text-xs">
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
              <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-gray-900 uppercase">Grand Total Paid</span>
                <span className="text-xl font-extrabold text-gray-900">
                  ₹{order.total_amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Shipping & Delivery Address */}
            <div className="p-4 bg-white rounded-2xl border border-gray-200/90 text-xs space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Shipping Destination:
              </span>
              <p className="font-bold text-gray-900">{order.customer_name} ({order.customer_phone})</p>
              <p className="text-gray-600">{order.shipping_address}, {order.city} - {order.postal_code}</p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 hover:border-black text-gray-800 font-bold text-xs rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#111111] hover:bg-[#d0473e] text-white font-extrabold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </GlozinLayout>
  );
}
