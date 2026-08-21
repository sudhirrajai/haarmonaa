import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
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
  Camera,
  Plus,
  Trash2,
  Package,
  ShieldCheck,
  MessageSquareText,
  Gem,
  RotateCcw,
  Heart,
  Clock,
  Award,
  Headphones,
  Gift,
  ExternalLink,
  Info,
} from 'lucide-react';

interface InstagramPostItem {
  id: string | number;
  image: string;
  alt?: string;
  handle?: string;
  url?: string;
}

interface StoreFeatureItem {
  id: string | number;
  icon: string;
  title: string;
  description: string;
}

interface SettingsProps {
  settings: { [key: string]: any };
}

const DEFAULT_GRAM_IMAGES: InstagramPostItem[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
    alt: 'Haarmonaa Silver Floral Bracelet & Rings',
    handle: '@haarmonaa_official',
    url: 'https://instagram.com',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
    alt: 'Haarmonaa Diamond Solitaire Ring',
    handle: '@haarmonaa_muse',
    url: 'https://instagram.com',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
    alt: 'Haarmonaa Sparkling Choker & Crystal Band',
    handle: '@haarmonaa_daily',
    url: 'https://instagram.com',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
    alt: 'Haarmonaa Statement Baroque Pearl Earrings',
    handle: '@haarmonaa_luxury',
    url: 'https://instagram.com',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    alt: 'Haarmonaa Stacking Rings in 18k Solid Gold',
    handle: '@haarmonaa_style',
    url: 'https://instagram.com',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop',
    alt: 'Haarmonaa Layered Gold Pendant Necklace',
    handle: '@haarmonaa_jewels',
    url: 'https://instagram.com',
  },
];

const DEFAULT_FEATURES: StoreFeatureItem[] = [
  {
    id: 'feat_1',
    icon: 'Package',
    title: 'Free Shipping',
    description: 'Enjoy free worldwide shipping and returns, with customs and duties taxes included.',
  },
  {
    id: 'feat_2',
    icon: 'ShieldCheck',
    title: 'Free Returns',
    description: 'Free returns within 15 days, please make sure the items are in undamaged condition.',
  },
  {
    id: 'feat_3',
    icon: 'MessageSquareText',
    title: 'Support Online',
    description: 'We support customers 24/7, send questions we will solve for you immediately.',
  },
];

const AVAILABLE_ICONS = [
  { value: 'Package', label: 'Package Box' },
  { value: 'Truck', label: 'Express Delivery Truck' },
  { value: 'ShieldCheck', label: 'Shield / Guarantee' },
  { value: 'Award', label: 'Certified Quality Award' },
  { value: 'MessageSquareText', label: '24/7 Concierge Chat' },
  { value: 'Headphones', label: 'Customer Support' },
  { value: 'Gem', label: 'Diamond / Gemstone' },
  { value: 'Sparkles', label: '18K Gold Sparkles' },
  { value: 'RotateCcw', label: 'Easy Returns & Refund' },
  { value: 'Heart', label: 'Handcrafted with Love' },
  { value: 'Clock', label: '24/7 Fast Turnaround' },
  { value: 'Gift', label: 'Luxury Gift Packaging' },
];

export default function Index({ settings }: SettingsProps) {
  // Parse JSON settings safely
  const parsedInstagramPosts = (() => {
    try {
      if (Array.isArray(settings.instagram_posts)) return settings.instagram_posts;
      if (typeof settings.instagram_posts === 'string' && settings.instagram_posts.trim()) {
        return JSON.parse(settings.instagram_posts);
      }
    } catch {}
    return DEFAULT_GRAM_IMAGES;
  })();

  const parsedStoreFeatures = (() => {
    try {
      if (Array.isArray(settings.store_features)) return settings.store_features;
      if (typeof settings.store_features === 'string' && settings.store_features.trim()) {
        return JSON.parse(settings.store_features);
      }
    } catch {}
    return DEFAULT_FEATURES;
  })();

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
    instagram_url: settings.instagram_url ?? 'https://instagram.com/haarmonaa',
    instagram_handle: settings.instagram_handle ?? '@haarmonaa',
    instagram_posts: parsedInstagramPosts,
    store_features: parsedStoreFeatures,
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.store_features.length < 3) {
      alert('A minimum of 3 Trust Badges & Value Proposition cards is mandatory for the homepage layout.');
      return;
    }

    setSaving(true);
    router.post('/admin/settings', formData, {
      onFinish: () => setSaving(false),
    });
  };

  // Instagram Posts Actions
  const handleAddInstagramPost = () => {
    const newPost: InstagramPostItem = {
      id: Date.now(),
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
      alt: 'Haarmonaa Fine Jewelry Look',
      handle: formData.instagram_handle || '@haarmonaa',
      url: formData.instagram_url || 'https://instagram.com',
    };
    setFormData((prev) => ({
      ...prev,
      instagram_posts: [...prev.instagram_posts, newPost],
    }));
  };

  const handleUpdateInstagramPost = (index: number, key: keyof InstagramPostItem, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.instagram_posts];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, instagram_posts: updated };
    });
  };

  const handleRemoveInstagramPost = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      instagram_posts: prev.instagram_posts.filter((_, i) => i !== index),
    }));
  };

  const handleResetInstagramTemplate = () => {
    if (confirm('Reset Instagram gallery to the default luxury jewelry curated collection?')) {
      setFormData((prev) => ({
        ...prev,
        instagram_posts: DEFAULT_GRAM_IMAGES.map((p) => ({
          ...p,
          handle: prev.instagram_handle || p.handle,
          url: prev.instagram_url || p.url,
        })),
      }));
    }
  };

  // Trust Features Actions (Min 3 mandatory)
  const handleAddFeature = () => {
    const newFeature: StoreFeatureItem = {
      id: 'feat_' + Date.now(),
      icon: 'Award',
      title: 'Authentic 18K Quality',
      description: 'Solid gold vermeil engineered with anti-tarnish coating for daily elegance.',
    };
    setFormData((prev) => ({
      ...prev,
      store_features: [...prev.store_features, newFeature],
    }));
  };

  const handleUpdateFeature = (index: number, key: keyof StoreFeatureItem, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.store_features];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, store_features: updated };
    });
  };

  const handleRemoveFeature = (index: number) => {
    if (formData.store_features.length <= 3) {
      alert('Cannot delete: A minimum of 3 Value Proposition cards is mandatory to keep the homepage layout balanced and responsive.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      store_features: prev.store_features.filter((_, i) => i !== index),
    }));
  };

  return (
    <AdminLayout title="Store Settings">
      <Head title="Store Settings — Admin Haarmonaa" />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Store Configuration & Homepage Sections
        </h1>
        <p className="text-xs sm:text-[13px] text-gray-500 mt-1">
          Customize brand logos, browser favicon, Instagram gallery feed, value proposition cards, taxes, and shipping rules.
        </p>
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

        {/* Card 4: HOMEPAGE "SHOP BY GRAM" (INSTAGRAM FEED) */}
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-50 text-rose-600 rounded-[8px]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Homepage: "Shop by Gram" (Instagram Gallery)</h2>
                <p className="text-[11px] text-gray-400">
                  Connect your Instagram handle and curate the 6-column aesthetic lifestyle grid.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetInstagramTemplate}
              className="text-[11px] font-bold text-gray-600 hover:text-black underline cursor-pointer"
            >
              Reset Curated Template
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Instagram Profile Link
              </label>
              <input
                type="url"
                required
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                placeholder="https://instagram.com/haarmonaa"
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Instagram Handle / Username
              </label>
              <input
                type="text"
                required
                value={formData.instagram_handle}
                onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                placeholder="@haarmonaa"
                className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
              />
            </div>
          </div>

          {/* Gallery Posts List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800">
                Gallery Posts ({formData.instagram_posts.length})
              </span>
              <button
                type="button"
                onClick={handleAddInstagramPost}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-black hover:bg-[#d0473e] text-white rounded-[8px] text-[11px] font-bold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Post</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.instagram_posts.map((post, idx) => (
                <div
                  key={post.id || idx}
                  className="p-4 bg-gray-50/70 border border-gray-200/70 rounded-[10px] space-y-3 relative group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-[8px] overflow-hidden bg-gray-200 shrink-0 border border-gray-300">
                      <img
                        src={post.image}
                        alt={post.alt || 'Gram'}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2 text-xs">
                      <div>
                        <label className="block text-[10.5px] font-bold text-gray-500 mb-0.5">
                          Image URL / Upload Link
                        </label>
                        <input
                          type="text"
                          required
                          value={post.image}
                          onChange={(e) => handleUpdateInstagramPost(idx, 'image', e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white border border-gray-200 rounded-[6px] py-1.5 px-2 text-[11px] text-gray-900 focus:outline-hidden focus:border-black"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10.5px] font-bold text-gray-500 mb-0.5">
                            Post Handle
                          </label>
                          <input
                            type="text"
                            value={post.handle || ''}
                            onChange={(e) => handleUpdateInstagramPost(idx, 'handle', e.target.value)}
                            placeholder="@haarmonaa_muse"
                            className="w-full bg-white border border-gray-200 rounded-[6px] py-1 px-2 text-[11px] text-gray-900 focus:outline-hidden focus:border-black"
                          />
                        </div>

                        <div>
                          <label className="block text-[10.5px] font-bold text-gray-500 mb-0.5">
                            Custom Post Link
                          </label>
                          <input
                            type="url"
                            value={post.url || ''}
                            onChange={(e) => handleUpdateInstagramPost(idx, 'url', e.target.value)}
                            placeholder="https://instagram.com/p/..."
                            className="w-full bg-white border border-gray-200 rounded-[6px] py-1 px-2 text-[11px] text-gray-900 focus:outline-hidden focus:border-black"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveInstagramPost(idx)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-[6px] transition-colors cursor-pointer"
                      title="Remove Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 5: HOMEPAGE VALUE PROPOSITIONS & TRUST BADGES (MANDATORY 3) */}
        <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-[8px]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Homepage: Trust Badges & Value Propositions</h2>
                <p className="text-[11px] text-gray-400">
                  Custom cards displayed beneath Shop by Gram. <strong>Minimum 3 cards are mandatory</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddFeature}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-black hover:bg-[#d0473e] text-white rounded-[8px] text-[11px] font-bold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Trust Card</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.store_features.map((feat, idx) => (
              <div
                key={feat.id || idx}
                className="p-4 sm:p-5 bg-gray-50/70 border border-gray-200/70 rounded-[10px] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      Card #{idx + 1} {idx < 3 && <span className="text-emerald-700 font-semibold">(Mandatory)</span>}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={formData.store_features.length <= 3}
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-[6px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title={
                      formData.store_features.length <= 3
                        ? 'Minimum 3 cards required'
                        : 'Remove Trust Card'
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Card Icon
                    </label>
                    <select
                      value={feat.icon}
                      onChange={(e) => handleUpdateFeature(idx, 'icon', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-medium focus:outline-hidden focus:border-black"
                    >
                      {AVAILABLE_ICONS.map((ic) => (
                        <option key={ic.value} value={ic.value}>
                          {ic.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Card Title
                    </label>
                    <input
                      type="text"
                      required
                      value={feat.title}
                      onChange={(e) => handleUpdateFeature(idx, 'title', e.target.value)}
                      placeholder="e.g. Free Shipping, 15-Day Returns"
                      className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Card Description
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={feat.description}
                    onChange={(e) => handleUpdateFeature(idx, 'description', e.target.value)}
                    placeholder="Short description highlighting your customer benefits..."
                    className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>
            ))}
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
            <span>{saving ? 'Saving...' : 'Save Settings & Homepage Sections'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
