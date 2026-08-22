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
  ShieldCheck,
  CreditCard,
  Copy,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Gift,
  Tag,
  Gem,
  Menu,
  CornerDownRight,
  ChevronRight,
} from 'lucide-react';

interface SettingsProps {
  settings: { [key: string]: any };
}

export default function Index({ settings }: SettingsProps) {
  const [copiedWebhook, setCopiedWebhook] = useState(false);
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
    currency_symbol: settings.currency_symbol ?? '₹',
    tax_rate_percent: settings.tax_rate_percent !== undefined ? String(settings.tax_rate_percent) : '0',
    shipping_fee: settings.shipping_fee !== undefined ? String(settings.shipping_fee) : '49',
    free_shipping_min_order: settings.free_shipping_min_order !== undefined ? String(settings.free_shipping_min_order) : '49',
    store_address: settings.store_address ?? '',
    meta_title_suffix: settings.meta_title_suffix ?? '18K Anti-Tarnish Gold Vermeil Jewelry',
    meta_description: settings.meta_description ?? 'Haarmonaa Fine Jewelry — Everyday luxury handcrafted from 18K thick solid gold vermeil. 100% waterproof, anti-tarnish, hypoallergenic, and sweatproof.',
    google_site_verification: settings.google_site_verification ?? '',
    bing_site_verification: settings.bing_site_verification ?? '',
    og_default_image: settings.og_default_image ?? '',
    enable_topbar: settings.enable_topbar !== undefined ? (settings.enable_topbar === '1' || settings.enable_topbar === true || settings.enable_topbar === 'true') : true,
    topbar_text: settings.topbar_text ?? 'COMPLIMENTARY LUXURY GIFT BOX & EXPRESS SHIPPING ON ALL ORDERS',
    topbar_link: settings.topbar_link ?? '',
    topbar_bg_color: settings.topbar_bg_color ?? '#111111',
    topbar_text_color: settings.topbar_text_color ?? '#ffffff',
    topbar_icon: settings.topbar_icon ?? 'sparkles',
    header_nav_items: (() => {
      try {
        const parsed = typeof settings.header_nav_items === 'string' ? JSON.parse(settings.header_nav_items) : settings.header_nav_items;
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
      return [
        { id: '1', label: 'Home', url: '/', is_external: false, is_enabled: true },
        { id: '2', label: 'Jewelry Catalog', url: '/shop', is_external: false, is_enabled: true },
        { id: '3', label: 'About Us', url: '/about-us', is_external: false, is_enabled: true },
        { id: '4', label: 'Contact Us', url: '/contact-us', is_external: false, is_enabled: true },
      ];
    })(),
    instagram_url: settings.instagram_url ?? 'https://instagram.com/haarmonaa',
    facebook_url: settings.facebook_url ?? '',
    tiktok_url: settings.tiktok_url ?? '',
    youtube_url: settings.youtube_url ?? '',
    pinterest_url: settings.pinterest_url ?? '',
    razorpay_key_id: settings.razorpay_key_id ?? '',
    razorpay_key_secret: settings.razorpay_key_secret ?? '',
    razorpay_webhook_secret: settings.razorpay_webhook_secret ?? '',
    razorpay_mode: settings.razorpay_mode ?? 'test',
  });

  const [saving, setSaving] = useState(false);

  const handleAddNavItem = () => {
    const newItem = {
      id: Date.now().toString(),
      label: 'New Link',
      url: '/shop',
      is_external: false,
      is_enabled: true,
    };
    setFormData((prev) => ({
      ...prev,
      header_nav_items: [...prev.header_nav_items, newItem],
    }));
  };

  const handleQuickAddCategory = (label: string, url: string) => {
    const newItem = {
      id: Date.now().toString(),
      label,
      url,
      is_external: false,
      is_enabled: true,
    };
    setFormData((prev) => ({
      ...prev,
      header_nav_items: [...prev.header_nav_items, newItem],
    }));
  };

  const handleUpdateNavItem = (id: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      header_nav_items: prev.header_nav_items.map((item: any) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleRemoveNavItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      header_nav_items: prev.header_nav_items.filter((item: any) => item.id !== id),
    }));
  };

  const handleMoveNavItem = (index: number, direction: 'up' | 'down') => {
    const items = [...formData.header_nav_items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, header_nav_items: items }));
  };

  const handleAddSubItem = (parentId: string) => {
    const newSubItem = {
      id: Date.now().toString(),
      label: 'Sub Item',
      url: '/shop',
      is_external: false,
      is_enabled: true,
    };
    setFormData((prev) => ({
      ...prev,
      header_nav_items: prev.header_nav_items.map((item: any) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newSubItem],
          };
        }
        return item;
      }),
    }));
  };

  const handleUpdateSubItem = (parentId: string, subId: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      header_nav_items: prev.header_nav_items.map((item: any) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: (item.children || []).map((sub: any) =>
              sub.id === subId ? { ...sub, [field]: value } : sub
            ),
          };
        }
        return item;
      }),
    }));
  };

  const handleRemoveSubItem = (parentId: string, subId: string) => {
    setFormData((prev) => ({
      ...prev,
      header_nav_items: prev.header_nav_items.map((item: any) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: (item.children || []).filter((sub: any) => sub.id !== subId),
          };
        }
        return item;
      }),
    }));
  };

  const handleMoveSubItem = (parentId: string, index: number, direction: 'up' | 'down') => {
    setFormData((prev) => ({
      ...prev,
      header_nav_items: prev.header_nav_items.map((item: any) => {
        if (item.id === parentId) {
          const subs = [...(item.children || [])];
          const targetIndex = direction === 'up' ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= subs.length) return item;
          const temp = subs[index];
          subs[index] = subs[targetIndex];
          subs[targetIndex] = temp;
          return { ...item, children: subs };
        }
        return item;
      }),
    }));
  };

  const handleAddCategorySub = (parentId: string, label: string, url: string) => {
    const newSubItem = {
      id: Date.now().toString(),
      label,
      url,
      is_external: false,
      is_enabled: true,
    };
    setFormData((prev) => ({
      ...prev,
      header_nav_items: prev.header_nav_items.map((item: any) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newSubItem],
          };
        }
        return item;
      }),
    }));
  };

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

      <form onSubmit={handleSubmit} className="w-full space-y-8">
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

        {/* Card: Top Announcement / Promotional Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <div>
                <h2 className="text-sm font-bold text-gray-900">Top Announcement / Promotional Bar</h2>
                <p className="text-[11px] text-gray-400">
                  Customize the sticky header top announcement banner, colors, icon, link, or disable it entirely.
                </p>
              </div>
            </div>

            {/* Enable / Disable Toggle Switch */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs font-bold text-gray-700">
                {formData.enable_topbar ? 'Enabled' : 'Disabled'}
              </span>
              <input
                type="checkbox"
                checked={formData.enable_topbar}
                onChange={(e) => setFormData({ ...formData, enable_topbar: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 relative" />
            </label>
          </div>

          {formData.enable_topbar && (
            <div className="space-y-4 animate-fade-in">
              {/* Live Preview Banner */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Live Preview on Storefront
                </span>
                <div
                  style={{
                    backgroundColor: formData.topbar_bg_color,
                    color: formData.topbar_text_color,
                  }}
                  className="p-2.5 rounded-[8px] text-[11px] font-semibold text-center flex items-center justify-center gap-2 tracking-wider shadow-2xs transition-all"
                >
                  {formData.topbar_icon === 'truck' && <Truck className="w-3.5 h-3.5 shrink-0" />}
                  {formData.topbar_icon === 'gift' && <Gift className="w-3.5 h-3.5 shrink-0" />}
                  {formData.topbar_icon === 'tag' && <Tag className="w-3.5 h-3.5 shrink-0" />}
                  {formData.topbar_icon === 'shield' && <ShieldCheck className="w-3.5 h-3.5 shrink-0" />}
                  {formData.topbar_icon === 'gem' && <Gem className="w-3.5 h-3.5 shrink-0" />}
                  {formData.topbar_icon === 'sparkles' && <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                  <span>{formData.topbar_text || 'Announcement text preview...'}</span>
                </div>
              </div>

              {/* Text & Link Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Announcement Message</label>
                  <input
                    type="text"
                    value={formData.topbar_text}
                    onChange={(e) => setFormData({ ...formData, topbar_text: e.target.value })}
                    placeholder="e.g. COMPLIMENTARY LUXURY GIFT BOX & EXPRESS SHIPPING"
                    className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Click Link URL <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.topbar_link}
                    onChange={(e) => setFormData({ ...formData, topbar_link: e.target.value })}
                    placeholder="e.g. /shop or /collections"
                    className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Colors and Icon selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Background Color */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Background Color</label>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-[8px] p-1.5">
                    <input
                      type="color"
                      value={formData.topbar_bg_color}
                      onChange={(e) => setFormData({ ...formData, topbar_bg_color: e.target.value })}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.topbar_bg_color}
                      onChange={(e) => setFormData({ ...formData, topbar_bg_color: e.target.value })}
                      className="w-full bg-transparent border-none text-xs font-mono text-gray-800 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Text Color</label>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-[8px] p-1.5">
                    <input
                      type="color"
                      value={formData.topbar_text_color}
                      onChange={(e) => setFormData({ ...formData, topbar_text_color: e.target.value })}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.topbar_text_color}
                      onChange={(e) => setFormData({ ...formData, topbar_text_color: e.target.value })}
                      className="w-full bg-transparent border-none text-xs font-mono text-gray-800 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Icon Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Leading Icon</label>
                  <select
                    value={formData.topbar_icon}
                    onChange={(e) => setFormData({ ...formData, topbar_icon: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white cursor-pointer"
                  >
                    <option value="sparkles">✨ Sparkles (Luxury)</option>
                    <option value="truck">🚚 Truck (Express Delivery)</option>
                    <option value="gift">🎁 Gift Box (Complimentary Gift)</option>
                    <option value="tag">🏷️ Sale Tag (Promo / Discount)</option>
                    <option value="shield">🛡️ Shield (Insured / Guarantee)</option>
                    <option value="gem">💎 Gem / Diamond (Fine Jewelry)</option>
                    <option value="none">🚫 None (No Icon)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card: Header & Mobile Navbar Menu Items Manager */}
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Menu className="w-4 h-4 text-gray-700" />
              <div>
                <h2 className="text-sm font-bold text-gray-900">Header & Mobile Navigation Menu</h2>
                <p className="text-[11px] text-gray-400">
                  Manage the navigation links displayed across desktop header and mobile sliding drawer.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddNavItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-[#d0473e] text-white rounded-[8px] text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Nav Link</span>
            </button>
          </div>

          {/* Quick Category Adders */}
          <div className="p-3 bg-gray-50 border border-gray-200/70 rounded-xl space-y-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
              Quick Add Category Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickAddCategory('Earrings', '/category/earrings')}
                className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-800 transition-all cursor-pointer shadow-2xs"
              >
                + Earrings
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddCategory('Necklaces', '/category/necklaces')}
                className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-800 transition-all cursor-pointer shadow-2xs"
              >
                + Necklaces
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddCategory('Rings', '/category/rings')}
                className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-800 transition-all cursor-pointer shadow-2xs"
              >
                + Rings
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddCategory('Bracelets', '/category/bracelets')}
                className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-800 transition-all cursor-pointer shadow-2xs"
              >
                + Bracelets
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddCategory('Best Sellers', '/shop?filter=best_sellers')}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
              >
                + Best Sellers
              </button>
            </div>
          </div>

          {/* Navigation Items List */}
          <div className="space-y-4">
            {formData.header_nav_items.map((item: any, index: number) => (
              <div
                key={item.id || index}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  item.is_enabled !== false ? 'bg-white border-gray-200 shadow-2xs' : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 w-full sm:w-auto sm:flex-1">
                    {/* Label */}
                    <div className="sm:col-span-5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Main Menu Label
                      </label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleUpdateNavItem(item.id, 'label', e.target.value)}
                        placeholder="e.g. Catalog"
                        className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-1.5 px-2.5 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black focus:bg-white"
                      />
                    </div>

                    {/* URL */}
                    <div className="sm:col-span-5">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Target URL / Route
                      </label>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => handleUpdateNavItem(item.id, 'url', e.target.value)}
                        placeholder="e.g. /shop or /category/earrings"
                        className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-1.5 px-2.5 text-xs text-gray-900 font-mono focus:outline-hidden focus:border-black focus:bg-white"
                      />
                    </div>

                    {/* External Toggle */}
                    <div className="sm:col-span-2 flex items-center pt-4 sm:pt-5">
                      <label className="flex items-center gap-1.5 text-[11px] text-gray-600 font-semibold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={item.is_external || false}
                          onChange={(e) => handleUpdateNavItem(item.id, 'is_external', e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span>External</span>
                      </label>
                    </div>
                  </div>

                  {/* Actions: Add Sub Link, Enable Toggle, Move Up/Down, Delete */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center pt-2 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleAddSubItem(item.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-md text-[11px] font-bold cursor-pointer transition-all"
                      title="Add dropdown sub-menu item"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Sub Link</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateNavItem(item.id, 'is_enabled', item.is_enabled === false ? true : false)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                        item.is_enabled !== false
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {item.is_enabled !== false ? 'Active' : 'Hidden'}
                    </button>

                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveNavItem(index, 'up')}
                      className="p-1.5 text-gray-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      disabled={index === formData.header_nav_items.length - 1}
                      onClick={() => handleMoveNavItem(index, 'down')}
                      className="p-1.5 text-gray-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveNavItem(item.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md cursor-pointer"
                      title="Delete Menu Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-Items (Dropdown Menu Links) */}
                {item.children && item.children.length > 0 && (
                  <div className="pl-4 sm:pl-8 pt-3 border-t border-gray-100 space-y-2.5 bg-gray-50/50 p-3 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                        <CornerDownRight className="w-3 h-3 text-amber-600" />
                        <span>Sub-Menu Links ({item.children.length}):</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddSubItem(item.id)}
                        className="text-[10.5px] font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
                      >
                        + Add another sub-item
                      </button>
                    </div>

                    <div className="space-y-2">
                      {item.children.map((sub: any, subIndex: number) => (
                        <div
                          key={sub.id || subIndex}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 bg-white border border-gray-200 rounded-lg shadow-2xs"
                        >
                          <div className="flex items-center gap-2 flex-1 w-full">
                            <CornerDownRight className="w-3.5 h-3.5 text-gray-400 shrink-0 hidden sm:block" />
                            <input
                              type="text"
                              value={sub.label}
                              onChange={(e) => handleUpdateSubItem(item.id, sub.id, 'label', e.target.value)}
                              placeholder="Submenu Label (e.g. Studs)"
                              className="w-1/3 bg-gray-50 border border-gray-200 rounded-[6px] py-1 px-2 text-xs font-semibold text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                            />
                            <input
                              type="text"
                              value={sub.url}
                              onChange={(e) => handleUpdateSubItem(item.id, sub.id, 'url', e.target.value)}
                              placeholder="URL (e.g. /category/stud-earrings)"
                              className="flex-1 bg-gray-50 border border-gray-200 rounded-[6px] py-1 px-2 text-xs font-mono text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                            />
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                            <label className="flex items-center gap-1 text-[10px] text-gray-500 font-semibold cursor-pointer select-none mr-1">
                              <input
                                type="checkbox"
                                checked={sub.is_external || false}
                                onChange={(e) => handleUpdateSubItem(item.id, sub.id, 'is_external', e.target.checked)}
                                className="rounded border-gray-300 text-black focus:ring-black w-3 h-3"
                              />
                              <span>Ext</span>
                            </label>

                            <button
                              type="button"
                              onClick={() => handleUpdateSubItem(item.id, sub.id, 'is_enabled', sub.is_enabled === false ? true : false)}
                              className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                                sub.is_enabled !== false
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {sub.is_enabled !== false ? 'Active' : 'Hidden'}
                            </button>

                            <button
                              type="button"
                              disabled={subIndex === 0}
                              onClick={() => handleMoveSubItem(item.id, subIndex, 'up')}
                              className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              disabled={subIndex === item.children.length - 1}
                              onClick={() => handleMoveSubItem(item.id, subIndex, 'down')}
                              className="p-1 text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveSubItem(item.id, sub.id)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                              title="Delete Sub Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
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

        {/* Card 3.5: Razorpay Payment Gateway & Webhook Security */}
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  Razorpay Payment Gateway (UPI, Cards, NetBanking)
                </h2>
                <p className="text-[11px] text-gray-400">
                  Automated HMAC signature verification, real-time webhooks, and background order reconciliation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                  formData.razorpay_mode === 'live'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {formData.razorpay_mode === 'live' ? '● LIVE MODE' : '○ TEST MODE'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Gateway Environment Mode
              </label>
              <select
                value={formData.razorpay_mode}
                onChange={(e) => setFormData({ ...formData, razorpay_mode: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black focus:bg-white"
              >
                <option value="test">Test Mode (rzp_test_...)</option>
                <option value="live">Live Production (rzp_live_...)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Razorpay Key ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.razorpay_key_id}
                onChange={(e) => setFormData({ ...formData, razorpay_key_id: e.target.value })}
                placeholder="e.g. rzp_live_xxxxxxxxxxxxxx"
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 font-mono focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Razorpay Key Secret <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={formData.razorpay_key_secret}
                onChange={(e) => setFormData({ ...formData, razorpay_key_secret: e.target.value })}
                placeholder="••••••••••••••••••••••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 font-mono focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Razorpay Webhook Secret <span className="text-gray-400 font-normal">(Recommended)</span>
              </label>
              <input
                type="password"
                value={formData.razorpay_webhook_secret}
                onChange={(e) => setFormData({ ...formData, razorpay_webhook_secret: e.target.value })}
                placeholder="Secret configured in Razorpay Dashboard"
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 font-mono focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            {/* Webhook Endpoint Box */}
            <div className="sm:col-span-2 bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider block">
                  Your Webhook URL (For Razorpay Dashboard)
                </span>
                <code className="text-xs text-blue-800 font-mono font-bold select-all break-all">
                  {typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/razorpay` : 'https://haarmonaa.in/api/webhooks/razorpay'}
                </code>
                <p className="text-[10.5px] text-blue-700/90 pt-0.5">
                  Events to enable: <strong>payment.captured</strong>, <strong>order.paid</strong>, <strong>payment.failed</strong>, <strong>refund.processed</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/api/webhooks/razorpay`;
                  navigator.clipboard.writeText(url);
                  setCopiedWebhook(true);
                  setTimeout(() => setCopiedWebhook(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
              >
                {copiedWebhook ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWebhook ? 'Copied!' : 'Copy Webhook URL'}</span>
              </button>
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
