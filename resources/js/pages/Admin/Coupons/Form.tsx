import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SearchableMultiSelect } from '@/components/admin/SearchableMultiSelect';
import {
  ArrowLeft,
  Save,
  Tag,
  Percent,
  IndianRupee,
  Calendar,
  Users,
  ShieldAlert,
  Layers,
  FolderTree,
  Gem,
  Check,
  HelpCircle,
  Sparkles,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';

interface SimpleOption {
  id: number;
  name: string;
}

interface ProductOption {
  id: number;
  name: string;
  price: number;
  image?: string;
}

interface CouponData {
  id?: number;
  code: string;
  description?: string;
  type: 'fixed' | 'percent';
  value: number | string;
  min_spend?: number | string;
  max_discount?: number | string;
  usage_limit?: number | string;
  usage_limit_per_user?: number | string;
  start_date?: string;
  expires_at?: string;
  is_active: boolean;
  applicable_products?: number[];
  applicable_categories?: number[];
  applicable_collections?: number[];
}

interface FormProps {
  coupon?: CouponData | null;
  categories?: SimpleOption[];
  collections?: SimpleOption[];
  products?: ProductOption[];
}

export default function Form({
  coupon,
  categories = [],
  collections = [],
  products = [],
}: FormProps) {
  const isEditing = !!coupon?.id;

  const [data, setData] = useState<CouponData>({
    code: coupon?.code || '',
    description: coupon?.description || '',
    type: coupon?.type || 'fixed',
    value: coupon?.value || '',
    min_spend: coupon?.min_spend || '',
    max_discount: coupon?.max_discount || '',
    usage_limit: coupon?.usage_limit || '',
    usage_limit_per_user: coupon?.usage_limit_per_user ?? 1,
    start_date: coupon?.start_date ? coupon.start_date.substring(0, 16) : '',
    expires_at: coupon?.expires_at ? coupon.expires_at.substring(0, 16) : '',
    is_active: coupon?.is_active ?? true,
    applicable_products: coupon?.applicable_products || [],
    applicable_categories: coupon?.applicable_categories || [],
    applicable_collections: coupon?.applicable_collections || [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const generateCouponCode = () => {
    const prefixes = ['LUXE', 'HAAR', 'GOLD', 'GEM', 'PROMO', 'FEAST', 'SUMMER', 'VIP', 'ROYAL'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generated = `${randomPrefix}${randomNum}`;
    setData((prev) => ({ ...prev, code: generated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      router.put(`/admin/coupons/${coupon.id}`, data as any, {
        onError: (err) => setErrors(err),
      });
    } else {
      router.post('/admin/coupons', data as any, {
        onError: (err) => setErrors(err),
      });
    }
  };

  const toggleArrayItem = (field: 'applicable_products' | 'applicable_categories' | 'applicable_collections', id: number) => {
    setData((prev) => {
      const current = prev[field] || [];
      if (current.includes(id)) {
        return { ...prev, [field]: current.filter((item) => item !== id) };
      } else {
        return { ...prev, [field]: [...current, id] };
      }
    });
  };

  return (
    <AdminLayout title={isEditing ? 'Edit Coupon' : 'Create New Coupon'}>
      <Head title={`${isEditing ? 'Edit' : 'Create'} Coupon — Admin Haarmonaa`} />

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/coupons"
          className="p-2 bg-white hover:bg-gray-100 rounded-full border border-gray-200 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {isEditing ? `Edit Coupon "${coupon?.code}"` : 'Create New Promo Coupon'}
          </h1>
          <p className="text-xs text-gray-500">
            Define discount values, minimum spend rules, total/per-user usage limits, and scheduling.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Side: General Info & Restrictions (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: Basic Information */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-600" />
                <span>Coupon Identity & Discount Type</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Coupon Code <span className="text-[#d0473e]">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={data.code}
                      onChange={(e) => setData({ ...data, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. SUMMER20 or FESTIVE500"
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 font-mono font-bold uppercase focus:outline-hidden focus:border-black focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={generateCouponCode}
                      className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                      title="Auto Generate Random Code"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Auto Generate</span>
                    </button>
                  </div>
                  {errors.code && (
                    <span className="text-rose-500 text-[11px] mt-1 block">{errors.code}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Discount Type <span className="text-[#d0473e]">*</span>
                  </label>
                  <div className="flex items-center gap-1.5 p-1 bg-gray-100/90 rounded-xl border border-gray-200/80 h-[42px]">
                    <button
                      type="button"
                      onClick={() => setData({ ...data, type: 'fixed' })}
                      className={`flex-1 h-full rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        data.type === 'fixed'
                          ? 'bg-white text-gray-900 shadow-xs font-extrabold border border-gray-200/80'
                          : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Fixed (₹)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setData({ ...data, type: 'percent' })}
                      className={`flex-1 h-full rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        data.type === 'percent'
                          ? 'bg-white text-gray-900 shadow-xs font-extrabold border border-gray-200/80'
                          : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      <Percent className="w-3.5 h-3.5 text-amber-600" />
                      <span>Percent (%)</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Discount Value <span className="text-[#d0473e]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={data.value}
                      onChange={(e) => setData({ ...data, value: e.target.value })}
                      placeholder={data.type === 'percent' ? 'e.g. 15 for 15%' : 'e.g. 500 for ₹500'}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-3.5 pr-8 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black focus:bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      {data.type === 'percent' ? '%' : '₹'}
                    </span>
                  </div>
                  {errors.value && (
                    <span className="text-rose-500 text-[11px] mt-1 block">{errors.value}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Coupon Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    placeholder="e.g. Get ₹500 off on solid gold necklaces"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Spend & Discount Restrictions */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Spend Restrictions & Caps</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Minimum Spend Threshold (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.min_spend}
                    onChange={(e) => setData({ ...data, min_spend: e.target.value })}
                    placeholder="e.g. 1999 (Leave empty for no minimum)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                  />
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Minimum order subtotal required to apply this coupon.
                  </span>
                </div>

                {data.type === 'percent' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Maximum Discount Cap (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={data.max_discount}
                      onChange={(e) => setData({ ...data, max_discount: e.target.value })}
                      placeholder="e.g. 1000 (Caps total percentage savings)"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                    />
                    <span className="text-[11px] text-gray-400 mt-1 block">
                      Maximum discount limit in ₹ allowed for percentage coupons.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Card 3: Scope & Item Restrictions */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-5">
              <div>
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>Applicable Product Scope</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Leave all unselected to allow this coupon on ALL store products, or select specific categories, collections, or individual products to restrict usage.
                </p>
              </div>

              <div className="space-y-4 pt-1">
                {/* Specific Categories */}
                <SearchableMultiSelect
                  label="Restricted to Categories"
                  placeholder="Type or click to search categories..."
                  options={categories.map((c) => ({ id: c.id, name: c.name }))}
                  selectedIds={data.applicable_categories || []}
                  onChange={(ids) => setData({ ...data, applicable_categories: ids })}
                  icon={<FolderTree className="w-3.5 h-3.5 text-gray-500" />}
                  emptyText="No categories match your search"
                />

                {/* Specific Collections */}
                <SearchableMultiSelect
                  label="Restricted to Collections"
                  placeholder="Type or click to search collections..."
                  options={collections.map((col) => ({ id: col.id, name: col.name }))}
                  selectedIds={data.applicable_collections || []}
                  onChange={(ids) => setData({ ...data, applicable_collections: ids })}
                  icon={<Gem className="w-3.5 h-3.5 text-amber-600" />}
                  emptyText="No collections match your search"
                />

                {/* Specific Products */}
                {products.length > 0 && (
                  <SearchableMultiSelect
                    label="Restricted to Specific Products"
                    placeholder="Type or click to search specific products..."
                    options={products.map((p) => ({
                      id: p.id,
                      name: p.name,
                      subtext: `₹${p.price.toFixed(2)}`,
                      image: p.image,
                    }))}
                    selectedIds={data.applicable_products || []}
                    onChange={(ids) => setData({ ...data, applicable_products: ids })}
                    icon={<ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />}
                    emptyText="No products match your search"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Usage Limits & Schedule (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 4: Usage Limits */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Usage Limits</span>
              </h2>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Total Usage Limit (Overall)
                </label>
                <input
                  type="number"
                  min="1"
                  value={data.usage_limit}
                  onChange={(e) => setData({ ...data, usage_limit: e.target.value })}
                  placeholder="e.g. 50 (Empty for unlimited)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Total number of times this coupon can be redeemed across all customers.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Usage Limit Per Customer
                </label>
                <input
                  type="number"
                  min="1"
                  value={data.usage_limit_per_user}
                  onChange={(e) => setData({ ...data, usage_limit_per_user: e.target.value })}
                  placeholder="1"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Maximum times an individual customer (by email) can redeem this coupon.
                </span>
              </div>
            </div>

            {/* Card 5: Schedule & Activation */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Schedule & Status</span>
              </h2>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Start Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={data.start_date}
                  onChange={(e) => setData({ ...data, start_date: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Expiration Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={data.expires_at}
                  onChange={(e) => setData({ ...data, expires_at: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.is_active}
                    onChange={(e) => setData({ ...data, is_active: e.target.checked })}
                    className="w-4 h-4 rounded-xs border-gray-300 text-black focus:ring-black cursor-pointer"
                  />
                  <span className="text-xs font-bold text-gray-800">Coupon Active & Redeemable</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Global Save Controls */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <Link
            href="/admin/coupons"
            className="px-6 py-3 border border-gray-300 text-xs font-bold text-gray-700 rounded-full hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#111111] hover:bg-[#d0473e] text-white font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Update Coupon Rules' : 'Save & Enable Coupon'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
