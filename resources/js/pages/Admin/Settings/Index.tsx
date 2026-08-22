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
  Globe,
  FileCode,
  Share2,
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
    header_logo_height: Number(settings.header_logo_height || 44),
    footer_logo_height: Number(settings.footer_logo_height || 48),
    store_email: settings.store_email ?? 'support@haarmonaa.in',
    store_phone: settings.store_phone ?? '',
    shipping_fee: settings.shipping_fee !== undefined ? String(settings.shipping_fee) : '49',
    free_shipping_min_order: settings.free_shipping_min_order !== undefined ? String(settings.free_shipping_min_order) : '49',
    store_address: settings.store_address ?? '',
    meta_title_suffix: settings.meta_title_suffix ?? '18K Anti-Tarnish Gold Vermeil Jewelry',
    meta_description: settings.meta_description ?? 'Haarmonaa Fine Jewelry — Everyday luxury handcrafted from 18K thick solid gold vermeil. 100% waterproof, anti-tarnish, hypoallergenic, and sweatproof.',
    google_site_verification: settings.google_site_verification ?? '',
    bing_site_verification: settings.bing_site_verification ?? '',
    og_default_image: settings.og_default_image ?? '',
    instagram_url: settings.instagram_url ?? 'https://instagram.com/haarmonaa',
    facebook_url: settings.facebook_url ?? '',
    tiktok_url: settings.tiktok_url ?? '',
    youtube_url: settings.youtube_url ?? '',
    pinterest_url: settings.pinterest_url ?? '',
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
            <div className="p-4 bg-gray-50/70 border border-gray-200/70 rounded-[10px] space-y-4">
              <SingleImageUploader
                label="Primary Store Logo (Header)"
                hint="Recommended: 320×80 px (PNG/SVG transparent)"
                placeholder="Upload logo file or paste URL..."
                value={formData.store_logo}
                onChange={(url) => setFormData({ ...formData, store_logo: url })}
              />

              {/* Header Logo Height Slider & Manual Px Input */}
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-700">
                    Header Logo Size / Height
                  </label>
                  <span className="text-[10px] text-gray-400 font-semibold">
                    Adjust slider or type exact px
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="16"
                    max="150"
                    step="1"
                    value={formData.header_logo_height}
                    onChange={(e) =>
                      setFormData({ ...formData, header_logo_height: Number(e.target.value) })
                    }
                    className="flex-1 accent-black cursor-pointer"
                  />

                  <div className="flex items-center gap-1 bg-white border border-gray-300 focus-within:border-black rounded-[8px] px-2.5 py-1 shadow-2xs">
                    <input
                      type="number"
                      min="16"
                      max="200"
                      value={formData.header_logo_height}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData({
                          ...formData,
                          header_logo_height: isNaN(val) ? 16 : Math.max(16, Math.min(200, val)),
                        });
                      }}
                      className="w-12 text-xs font-extrabold text-gray-900 text-right focus:outline-hidden bg-transparent"
                    />
                    <span className="text-[11px] font-bold text-gray-400">px</span>
                  </div>
                </div>

                {/* Live Preview Box */}
                {formData.store_logo && (
                  <div className="p-3 bg-white border border-gray-200 rounded-[8px] flex flex-col items-center justify-center gap-1.5 overflow-hidden">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Header Preview ({formData.header_logo_height}px)
                    </span>
                    <img
                      src={formData.store_logo}
                      alt="Header Logo Preview"
                      style={{ height: `${formData.header_logo_height}px` }}
                      className="w-auto object-contain transition-all"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Dark / Inverted Logo */}
            <div className="p-4 bg-gray-50/70 border border-gray-200/70 rounded-[10px] space-y-4">
              <SingleImageUploader
                label="Dark / Inverted Logo (Footer)"
                hint="Recommended: 320×80 px (White/Gold on transparent)"
                placeholder="Upload footer logo file or paste URL..."
                value={formData.store_logo_dark}
                onChange={(url) => setFormData({ ...formData, store_logo_dark: url })}
              />

              {/* Footer Logo Height Slider & Manual Px Input */}
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-700">
                    Footer Logo Size / Height
                  </label>
                  <span className="text-[10px] text-gray-400 font-semibold">
                    Adjust slider or type exact px
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="16"
                    max="150"
                    step="1"
                    value={formData.footer_logo_height}
                    onChange={(e) =>
                      setFormData({ ...formData, footer_logo_height: Number(e.target.value) })
                    }
                    className="flex-1 accent-black cursor-pointer"
                  />

                  <div className="flex items-center gap-1 bg-white border border-gray-300 focus-within:border-black rounded-[8px] px-2.5 py-1 shadow-2xs">
                    <input
                      type="number"
                      min="16"
                      max="200"
                      value={formData.footer_logo_height}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData({
                          ...formData,
                          footer_logo_height: isNaN(val) ? 16 : Math.max(16, Math.min(200, val)),
                        });
                      }}
                      className="w-12 text-xs font-extrabold text-gray-900 text-right focus:outline-hidden bg-transparent"
                    />
                    <span className="text-[11px] font-bold text-gray-400">px</span>
                  </div>
                </div>

                {/* Dark Live Preview Box */}
                {(formData.store_logo_dark || formData.store_logo) && (
                  <div className="p-3 bg-[#111111] border border-gray-800 rounded-[8px] flex flex-col items-center justify-center gap-1.5 overflow-hidden">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Footer Preview ({formData.footer_logo_height}px)
                    </span>
                    <img
                      src={formData.store_logo_dark || formData.store_logo}
                      alt="Footer Logo Preview"
                      style={{ height: `${formData.footer_logo_height}px` }}
                      className="w-auto object-contain transition-all"
                    />
                  </div>
                )}
              </div>
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

        {/* Card 4: SEO, OpenGraph & AI Search Engine Indexing */}
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-gray-900">
                SEO, OpenGraph & AI Search Indexing (Perplexity, SearchGPT, Google)
              </h2>
            </div>

            {/* Quick Live Sitemap / LLM Links */}
            <div className="flex items-center gap-2">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-[6px] text-[11px] font-bold transition-all"
              >
                <span>sitemap.xml</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>

              <a
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-[6px] text-[11px] font-bold transition-all"
              >
                <span>llms.txt</span>
                <ExternalLink className="w-3 h-3 text-amber-500" />
              </a>

              <a
                href="/llms-full.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-[6px] text-[11px] font-bold transition-all"
              >
                <span>llms-full.txt</span>
                <ExternalLink className="w-3 h-3 text-purple-500" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Default Meta Title Suffix
              </label>
              <input
                type="text"
                value={formData.meta_title_suffix}
                onChange={(e) => setFormData({ ...formData, meta_title_suffix: e.target.value })}
                placeholder="e.g. 18K Anti-Tarnish Gold Vermeil Jewelry"
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
              <span className="text-[10.5px] text-gray-500 mt-1 block">
                Appended to all page titles: <code>[Page Name] | [Suffix]</code>.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Google Search Console Verification Tag
              </label>
              <input
                type="text"
                value={formData.google_site_verification}
                onChange={(e) =>
                  setFormData({ ...formData, google_site_verification: e.target.value })
                }
                placeholder="e.g. google-site-verification=abc123xyz"
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
              <span className="text-[10.5px] text-gray-500 mt-1 block">
                Paste your verification code from Google Search Console.
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Default Website Meta Description
              </label>
              <textarea
                rows={2}
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="Default description displayed on Google search results and AI search engine summaries..."
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Card 5: Social Media Profiles */}
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Share2 className="w-4 h-4 text-gray-700" />
            <div>
              <h2 className="text-sm font-bold text-gray-900">Social Media Channels</h2>
              <p className="text-[11px] text-gray-400">
                Connected accounts will be linked directly to your footer icons and community channels.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Instagram Profile URL</label>
              <input
                type="text"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                placeholder="https://instagram.com/haarmonaa"
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Facebook Page URL</label>
              <input
                type="text"
                value={formData.facebook_url}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">TikTok Channel URL</label>
              <input
                type="text"
                value={formData.tiktok_url}
                onChange={(e) => setFormData({ ...formData, tiktok_url: e.target.value })}
                placeholder="https://tiktok.com/@..."
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">YouTube Channel URL</label>
              <input
                type="text"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                placeholder="https://youtube.com/@..."
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Pinterest Profile URL</label>
              <input
                type="text"
                value={formData.pinterest_url}
                onChange={(e) => setFormData({ ...formData, pinterest_url: e.target.value })}
                placeholder="https://pinterest.com/..."
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
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
