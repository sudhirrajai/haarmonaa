import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { Product } from '@/types/shop';
import {
  User as UserIcon,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Edit3,
  KeyRound,
  ArrowRight,
  ExternalLink,
  Sparkles,
  ShoppingBag,
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

interface AccountIndexProps {
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
    is_verified: boolean;
    email_verified_at?: string;
    created_at: string;
  };
  stats: {
    total_orders: number;
    total_spent: number;
    active_orders: number;
  };
  recentOrders: OrderData[];
  defaultAddress?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string;
  } | null;
  products?: Product[];
}

export default function AccountIndex({
  user,
  stats,
  recentOrders = [],
  defaultAddress,
  products = [],
}: AccountIndexProps) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone || '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [updating, setUpdating] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    router.put('/account/profile', formData, {
      onFinish: () => setUpdating(false),
      onSuccess: () => setEditingProfile(false),
    });
  };

  const handleVerifyEmail = () => {
    setVerifying(true);
    router.post('/account/verify-email', {}, {
      onFinish: () => setVerifying(false),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <GlozinLayout allProducts={products}>
      <Head title="My Account — Haarmonaa Fine Jewelry" />

      {/* Header Banner */}
      <section className="pt-10 pb-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#d0473e] block mb-1">
                Haarmonaa Customer Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Welcome, {user.name}
              </h1>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                <span>Member since {new Date(user.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                <span>•</span>
                <span>{user.email}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/account/orders"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Package className="w-4 h-4" />
                <span>View All Orders</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#fafafa] py-10 min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Email Verification Banner if not verified */}
          {!user.is_verified ? (
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                    Verify your email address ({user.email})
                  </h4>
                  <p className="text-[11px] sm:text-xs text-amber-700/90 mt-0.5">
                    Verifying your email ensures all previous guest purchases and delivery updates are synced securely with your account.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerifyEmail}
                disabled={verifying}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{verifying ? 'Verifying...' : 'Verify Now (1-Click)'}</span>
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl px-4 py-3 flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified Customer Account • All orders matched to <strong>{user.email}</strong> are synced live.</span>
            </div>
          )}

          {/* Quick Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Orders Placed
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-mono">
                  {stats.total_orders}
                </span>
                <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
                  <Package className="w-5 h-5" />
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Active Shipments
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
                  {stats.active_orders}
                </span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <Truck className="w-5 h-5" />
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Luxury Value
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-mono">
                  ₹{stats.total_spent.toFixed(2)}
                </span>
                <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <Sparkles className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Recent Orders List (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-700" />
                  <span>Recent Orders</span>
                </h2>
                <Link
                  href="/account/orders"
                  className="text-xs font-bold text-[#d0473e] hover:underline flex items-center gap-1"
                >
                  <span>See All ({stats.total_orders})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-gray-200/80 text-center space-y-3 shadow-2xs">
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">No orders found yet</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Explore our exquisite 18k anti-tarnish vermeil collections and place your first order.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/shop"
                      className="inline-block px-5 py-2.5 bg-black hover:bg-[#d0473e] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      Explore Catalog
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white p-5 rounded-2xl border border-gray-200/80 hover:border-gray-300 transition-all shadow-2xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-gray-100 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 font-mono">
                            #{order.order_number}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border uppercase ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Item Previews */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto py-1">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="relative group shrink-0">
                              {item.product_image ? (
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="w-12 h-12 object-cover rounded-lg border border-gray-100 bg-gray-50"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                              <span className="absolute -bottom-1 -right-1 bg-black text-white text-[9px] font-bold px-1 rounded-full">
                                ×{item.quantity}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <span className="text-[11px] font-bold text-gray-400 pl-1">
                              +{order.items.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs text-gray-400 block">Total</span>
                          <span className="text-sm font-extrabold text-gray-900 font-mono">
                            ₹{order.total_amount.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-gray-50 text-xs">
                        <span className="text-gray-500 text-[11px]">
                          {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Paid via Online / Razorpay'}
                        </span>

                        <Link
                          href={`/account/orders/${order.order_number}`}
                          className="font-bold text-[#d0473e] hover:underline inline-flex items-center gap-1"
                        >
                          <span>Track & View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Profile & Address Card (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Profile Details Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-700" />
                    <span>Personal Details</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingProfile(!editingProfile)}
                    className="text-xs font-bold text-[#d0473e] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{editingProfile ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>

                {editingProfile ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                      />
                    </div>

                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                        Change Password (Optional)
                      </span>
                      <div>
                        <input
                          type="password"
                          value={formData.current_password}
                          onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                          placeholder="Current password"
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-black mb-2"
                        />
                        <input
                          type="password"
                          value={formData.new_password}
                          onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                          placeholder="New password"
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-black mb-2"
                        />
                        <input
                          type="password"
                          value={formData.new_password_confirmation}
                          onChange={(e) => setFormData({ ...formData, new_password_confirmation: e.target.value })}
                          placeholder="Confirm new password"
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={updating}
                      className="w-full py-2.5 bg-black hover:bg-[#d0473e] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {updating ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Full Name</span>
                      <span className="font-bold text-gray-900">{user.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Email Address</span>
                      <span className="font-bold text-gray-900 font-mono">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Phone Number</span>
                      <span className="font-bold text-gray-900 font-mono">{user.phone || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Account Status</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{user.is_verified ? 'Verified Customer' : 'Unverified'}</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Default Address Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-700" />
                    <span>Default Delivery Address</span>
                  </h3>
                </div>

                {defaultAddress ? (
                  <div className="space-y-1 text-xs text-gray-600">
                    <p className="font-bold text-gray-900">{defaultAddress.name} ({defaultAddress.phone})</p>
                    <p className="leading-relaxed">{defaultAddress.address}</p>
                    <p className="font-medium text-gray-800">{defaultAddress.city} - {defaultAddress.postal_code}</p>
                    <span className="text-[10.5px] text-gray-400 pt-1 block italic">
                      Automatically synced from your most recent order.
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    No default address yet. Your address will be saved here automatically when you place your first order.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlozinLayout>
  );
}
