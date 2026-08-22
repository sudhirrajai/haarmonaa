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
  Heart,
  Plus,
  Trash2,
  Lock,
  Building,
  Home,
  Check,
  X,
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

interface CustomerAddressItem {
  id: number;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state?: string | null;
  postal_code: string;
  type: string;
  is_default: boolean;
}

interface AccountIndexProps {
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
    is_verified: boolean;
    email_verified_at?: string;
    created_at: string;
  } | null;
  stats?: {
    total_orders: number;
    total_spent: number;
    active_orders: number;
  };
  recentOrders?: OrderData[];
  addresses?: CustomerAddressItem[];
  products?: Product[];
}

export default function AccountIndex({
  user,
  stats = { total_orders: 0, total_spent: 0, active_orders: 0 },
  recentOrders = [],
  addresses = [],
  products = [],
}: AccountIndexProps) {
  const safeUser = user || {
    id: 0,
    name: 'Customer',
    email: '',
    phone: '',
    role: 'customer',
    is_verified: false,
    email_verified_at: undefined,
    created_at: new Date().toISOString(),
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'addresses'>('overview');

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: safeUser.name,
    email: safeUser.email,
    phone: safeUser.phone || '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Address Modal State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    type: 'home',
    is_default: false,
  });
  const [addressSaving, setAddressSaving] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUpdating(true);
    router.put('/account/profile', profileData, {
      onFinish: () => setProfileUpdating(false),
      onSuccess: () => {
        setProfileData((prev) => ({
          ...prev,
          current_password: '',
          new_password: '',
          new_password_confirmation: '',
        }));
      },
    });
  };

  const handleVerifyEmail = () => {
    setVerifying(true);
    router.post('/account/verify-email', {}, {
      onFinish: () => setVerifying(false),
    });
  };

  const openAddAddressModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      name: safeUser.name,
      phone: safeUser.phone || '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      type: 'home',
      is_default: addresses.length === 0,
    });
    setAddressModalOpen(true);
  };

  const openEditAddressModal = (addr: CustomerAddressItem) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      name: addr.name,
      phone: addr.phone,
      address_line1: addr.address_line1,
      address_line2: addr.address_line2 || '',
      city: addr.city,
      state: addr.state || '',
      postal_code: addr.postal_code,
      type: addr.type,
      is_default: addr.is_default,
    });
    setAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSaving(true);

    if (editingAddressId) {
      router.put(`/account/addresses/${editingAddressId}`, addressForm, {
        onFinish: () => setAddressSaving(false),
        onSuccess: () => setAddressModalOpen(false),
      });
    } else {
      router.post('/account/addresses', addressForm, {
        onFinish: () => setAddressSaving(false),
        onSuccess: () => setAddressModalOpen(false),
      });
    }
  };

  const handleDeleteAddress = (id: number) => {
    if (confirm('Are you sure you want to remove this delivery address?')) {
      router.delete(`/account/addresses/${id}`);
    }
  };

  const handleSetDefaultAddress = (id: number) => {
    router.patch(`/account/addresses/${id}/default`);
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
                Welcome, {safeUser.name}
              </h1>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                <span>Member since {new Date(safeUser.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                <span>•</span>
                <span className="font-mono">{safeUser.email}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/account/orders"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Package className="w-4 h-4" />
                <span>My Orders & Shipments</span>
              </Link>
            </div>
          </div>

          {/* Account Portal Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-gray-100 mt-6 pb-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Overview & Recent Orders</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Profile & Email Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'addresses'
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Saved Addresses ({addresses.length})</span>
            </button>

            <Link
              href="/wishlist"
              className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <Heart className="w-3.5 h-3.5 text-[#d0473e]" />
              <span>My Wishlist</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-[#fafafa] py-10 min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Email Verification Banner */}
          {!safeUser.is_verified ? (
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                    Verify your email address ({safeUser.email})
                  </h4>
                  <p className="text-[11px] sm:text-xs text-amber-700/90 mt-0.5">
                    Verifying your email ensures all previous guest purchases and tracking updates stay linked securely.
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
              <span>Verified Customer Account • All orders placed with <strong>{safeUser.email}</strong> are synced live.</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
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
                    Total Jewelry Purchased
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

              {/* Recent Orders */}
              <div className="space-y-4">
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
                            <span>Track & View Invoice</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & EMAIL SETTINGS */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleUpdateProfile} className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-2xs space-y-6">
                <div className="pb-4 border-b border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-700" />
                    <span>Personal Profile & Security</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Update your full name, email address, contact phone, and account password.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Full Name */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                      Full Name <span className="text-[#d0473e]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                      Email Address <span className="text-[#d0473e]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-mono text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                    />
                    <span className="text-[10.5px] text-gray-400 mt-1 block italic">
                      Changing your email address will automatically re-link all previous orders placed with the new email.
                    </span>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-1 uppercase tracking-wider text-[11px]">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                    />
                  </div>

                  {/* Change Password */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                      Change Password (Optional)
                    </span>
                    <div>
                      <input
                        type="password"
                        value={profileData.current_password}
                        onChange={(e) => setProfileData({ ...profileData, current_password: e.target.value })}
                        placeholder="Current password"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white mb-2"
                      />
                      <input
                        type="password"
                        value={profileData.new_password}
                        onChange={(e) => setProfileData({ ...profileData, new_password: e.target.value })}
                        placeholder="New password"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white mb-2"
                      />
                      <input
                        type="password"
                        value={profileData.new_password_confirmation}
                        onChange={(e) => setProfileData({ ...profileData, new_password_confirmation: e.target.value })}
                        placeholder="Confirm new password"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileUpdating}
                    className="w-full py-3 bg-black hover:bg-[#d0473e] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {profileUpdating ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-700" />
                    <span>Manage Delivery Addresses</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Save multiple home or office addresses for effortless 1-click checkout.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openAddAddressModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-black hover:bg-[#d0473e] text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="bg-white p-10 rounded-3xl border border-gray-200/80 text-center space-y-3 shadow-2xs">
                  <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">No Saved Addresses</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Add a delivery address to speed up future checkouts.
                  </p>
                  <button
                    type="button"
                    onClick={openAddAddressModal}
                    className="inline-block px-5 py-2.5 bg-black hover:bg-[#d0473e] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Add Address Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`bg-white p-6 rounded-3xl border transition-all shadow-2xs space-y-4 relative ${
                        addr.is_default ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200/80 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase bg-gray-100 text-gray-700">
                            {addr.type}
                          </span>
                          {addr.is_default && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Default Address</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditAddressModal(addr)}
                            className="p-1.5 text-gray-400 hover:text-black rounded-lg hover:bg-gray-50 cursor-pointer"
                            title="Edit Address"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Delete Address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-gray-600 space-y-1">
                        <p className="font-bold text-gray-900 text-sm">{addr.name}</p>
                        <p className="leading-relaxed">{addr.address_line1}</p>
                        {addr.address_line2 && <p className="leading-relaxed">{addr.address_line2}</p>}
                        <p className="font-medium text-gray-800">
                          {addr.city}{addr.state ? `, ${addr.state}` : ''} - {addr.postal_code}
                        </p>
                        <p className="text-gray-500 pt-1 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{addr.phone}</span>
                        </p>
                      </div>

                      {!addr.is_default && (
                        <div className="pt-2 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Set as Default Address</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Address Modal (Add / Edit) */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-black rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.name}
                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Address Line 1 (Street/Flat/Building) *</label>
                <input
                  type="text"
                  required
                  value={addressForm.address_line1}
                  onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                  placeholder="e.g. Flat 402, Royal Palms Apartment"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Address Line 2 (Area/Landmark)</label>
                <input
                  type="text"
                  value={addressForm.address_line2}
                  onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
                  placeholder="e.g. Near City Center Mall"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">State</label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">PIN / Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.postal_code}
                    onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                    placeholder="400001"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Address Type</label>
                  <select
                    value={addressForm.type}
                    onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work / Office</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={addressForm.is_default}
                      onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span>Set as Default Address</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressSaving}
                  className="px-5 py-2.5 bg-black hover:bg-[#d0473e] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {addressSaving ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </GlozinLayout>
  );
}
