import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Save, Store, Mail, Phone, IndianRupee, Truck, Percent, MapPin } from 'lucide-react';

interface SettingsProps {
  settings: { [key: string]: string };
}

export default function Index({ settings }: SettingsProps) {
  const [formData, setFormData] = useState({
    store_name: settings.store_name || 'Haarmonaa Fine Jewelry',
    store_email: settings.store_email || 'support@haarmonaa.in',
    store_phone: settings.store_phone || '+1 (973) 435-3638',
    currency_symbol: settings.currency_symbol || '₹',
    tax_rate_percent: settings.tax_rate_percent || '3',
    free_shipping_min_order: settings.free_shipping_min_order || '999',
    store_address: settings.store_address || '75 Fifth Avenue, Suite 400, New York, NY 10003',
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Store Configuration
        </h1>
        <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
          Customize currency symbols, tax rates, shipping thresholds, and store identity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Card 1: Store Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
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
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Customer Support Email</label>
              <input
                type="email"
                required
                value={formData.store_email}
                onChange={(e) => setFormData({ ...formData, store_email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Customer Support Phone</label>
              <input
                type="text"
                value={formData.store_phone}
                onChange={(e) => setFormData({ ...formData, store_phone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Headquarters Address</label>
              <input
                type="text"
                value={formData.store_address}
                onChange={(e) => setFormData({ ...formData, store_address: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Currency & Taxes */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <IndianRupee className="w-4 h-4 text-gray-700" />
            <h2 className="text-sm font-bold text-gray-900">Currency & Shipping Rules</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Currency Symbol</label>
              <input
                type="text"
                required
                value={formData.currency_symbol}
                onChange={(e) => setFormData({ ...formData, currency_symbol: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">GST / Sales Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={formData.tax_rate_percent}
                onChange={(e) => setFormData({ ...formData, tax_rate_percent: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
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
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#111111] hover:bg-[#d0473e] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
