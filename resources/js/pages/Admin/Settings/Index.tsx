import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SingleImageUploader } from '@/components/admin/SingleImageUploader';
import {
  Save,
  Store,
  Mail,
  Phone,
  IndianRupee,
  Truck,
  Percent,
  MapPin,
  Image as ImageIcon,
  Sparkles,
  Layout,
  ExternalLink,
} from 'lucide-react';

interface SettingsProps {
  settings: { [key: string]: any };
}

export default function Index({ settings }: SettingsProps) {
  const [formData, setFormData] = useState({
    store_name: settings.store_name ?? 'Haarmonaa Fine Jewelry',
    store_tagline: settings.store_tagline ?? '',
    store_logo: settings.store_logo ?? '',
    store_logo_dark: settings.store_logo_dark ?? '',
    store_favicon: settings.store_favicon ?? '',
    store_email: settings.store_email ?? 'support@haarmonaa.in',
    store_phone: settings.store_phone ?? '',
    currency_symbol: settings.currency_symbol ?? '₹',
    tax_rate_percent: settings.tax_rate_percent !== undefined ? String(settings.tax_rate_percent) : '0',
    shipping_fee: settings.shipping_fee !== undefined ? String(settings.shipping_fee) : '49',
    free_shipping_min_order: settings.free_shipping_min_order !== undefined ? String(settings.free_shipping_min_order) : '49',
    store_address: settings.store_address ?? '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    router.post('/admin/settings', formData, {
      onFinish: () => setSaving(false),
    });
  };

  return (
    <AdminLayout title="Store Settings">
      <Head title="Store Settings — Admin Haarmonaa" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Store Configuration
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
            Customize brand logos, browser favicon, store tagline, currency, tax rates, shipping rules, and contact info.
          </p>
        </div>

        {/* Shortcut to Pages Manager */}
        <Link
          href="/admin/pages/home"
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-[10px] text-xs font-bold transition-all shadow-2xs shrink-0"
        >
          <Layout className="w-4 h-4 text-amber-700" />
          <span>Edit Homepage Sections</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Card 1: Brand Logo & Favicon Assets */}
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <ImageIcon className="w-4 h-4 text-gray-700" />
            <div>
              <h2 className="text-sm font-bold text-gray-900">Brand Identity & Website Logos</h2>
              <p className="text-[11px] text-gray-400">
                Uploaded images will be immediately reflected in the store header, footer, and browser tabs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Logo */}
            <div className="p-4 bg-gray-50/70 border border-gray-200/70 rounded-[10px] space-y-2">
              <SingleImageUploader
                label="Primary Store Logo (Header)"
                hint="Recommended: 320×80 px (PNG/SVG transparent)"
                placeholder="Upload logo file or paste URL..."
                value={formData.store_logo}
                onChange={(url) => setFormData({ ...formData, store_logo: url })}
              />
            </div>

            {/* Dark / Inverted Logo */}
            <div className="p-4 bg-gray-50/70 border border-gray-200/70 rounded-[10px] space-y-2">
              <SingleImageUploader
                label="Dark / Inverted Logo (Footer)"
                hint="Recommended: 320×80 px (White/Gold on transparent)"
                placeholder="Upload footer logo file or paste URL..."
                value={formData.store_logo_dark}
                onChange={(url) => setFormData({ ...formData, store_logo_dark: url })}
              />
            </div>
          </div>

          {/* Browser Favicon */}
          <div className="p-4 bg-amber-50/40 border border-amber-200/60 rounded-[10px] space-y-2">
            <SingleImageUploader
              label="Website Favicon"
              hint="Recommended: 64×64 px or 32×32 px (Square PNG/ICO/SVG)"
              placeholder="Upload favicon file or paste URL..."
              value={formData.store_favicon}
              onChange={(url) => setFormData({ ...formData, store_favicon: url })}
            />
          </div>
        </div>

        {/* Card 2: Store Identity & Contact Details */}
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Store className="w-4 h-4 text-gray-700" />
            <h2 className="text-sm font-bold text-gray-900">Brand & Contact Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Store Public Name</label>
              <input
                type="text"
                required
                value={formData.store_name}
                onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Brand Tagline <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.store_tagline}
                onChange={(e) => setFormData({ ...formData, store_tagline: e.target.value })}
                placeholder="e.g. Timeless 18K Anti-Tarnish Gold Vermeil"
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Customer Support Email</label>
              <input
                type="email"
                required
                value={formData.store_email}
                onChange={(e) => setFormData({ ...formData, store_email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Customer Support Phone <span className="text-gray-400 font-normal">(Leave empty to hide)</span>
              </label>
              <input
                type="text"
                value={formData.store_phone}
                onChange={(e) => setFormData({ ...formData, store_phone: e.target.value })}
                placeholder="Leave blank to hide phone from website"
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Headquarters Address <span className="text-gray-400 font-normal">(Leave empty to hide)</span>
              </label>
              <input
                type="text"
                value={formData.store_address}
                onChange={(e) => setFormData({ ...formData, store_address: e.target.value })}
                placeholder="Leave blank to hide address from website"
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Currency, Taxes & Shipping Rules */}
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <IndianRupee className="w-4 h-4 text-gray-700" />
            <h2 className="text-sm font-bold text-gray-900">Currency, Taxes & Shipping Rules</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Currency Symbol</label>
              <input
                type="text"
                required
                value={formData.currency_symbol}
                onChange={(e) => setFormData({ ...formData, currency_symbol: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                GST / Sales Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                required
                value={formData.tax_rate_percent}
                onChange={(e) => setFormData({ ...formData, tax_rate_percent: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
              <span className="text-[10.5px] text-gray-500 mt-1 block">
                Set to <strong>0</strong> to hide GST completely.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.shipping_fee}
                onChange={(e) => setFormData({ ...formData, shipping_fee: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.free_shipping_min_order}
                onChange={(e) => setFormData({ ...formData, free_shipping_min_order: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
              <span className="text-[10.5px] text-gray-500 mt-1 block">
                Orders &ge; this subtotal receive Free Shipping. Set to <strong>0</strong> for free shipping on all orders.
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
