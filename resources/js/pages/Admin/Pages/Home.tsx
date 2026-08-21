import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Category, Product } from '@/types/shop';
import { SingleImageUploader } from '@/components/admin/SingleImageUploader';
import { VisualIconPicker } from '@/components/admin/VisualIconPicker';
import {
  Sparkles,
  Sliders,
  Layers,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  SunMedium,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  MoveUp,
  MoveDown,
  RefreshCw,
  Camera,
  ShieldCheck,
  Package,
  Truck,
  Award,
  MessageSquareText,
  Headphones,
  Gem,
  RotateCcw,
  Heart,
  Clock,
  Gift,
  ArrowLeft,
  Zap,
  Upload,
} from 'lucide-react';

interface SplitSlideCMS {
  id: number | string;
  subtitle: string;
  title: string;
  buttonText: string;
  buttonLink: string;
  showButton: boolean;
  enabled: boolean;
  badge?: string;
  leftImage: string;
  rightImage: string;
}

interface SeasonalCollectionCMS {
  enabled: boolean;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  category_slug: string;
  product_ids: number[];
  banner_image: string;
  button_text: string;
  button_link: string;
}

interface PromoBannerCMS {
  id: number | string;
  subtitle?: string;
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
  bgClass?: string;
  textColor?: 'dark' | 'light';
  align?: 'left' | 'center' | 'right';
  enabled: boolean;
}

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
  custom_icon?: string;
  title: string;
  description: string;
}

interface HomePageCMSProps {
  slides: SplitSlideCMS[];
  seasonalCollection: SeasonalCollectionCMS;
  promoBanners: PromoBannerCMS[];
  instagram: {
    url: string;
    handle: string;
    access_token?: string;
    posts: InstagramPostItem[];
  };
  storeFeatures: StoreFeatureItem[];
  categories: Category[];
  collections?: Array<{ id: number; name: string; slug: string }>;
  products: Product[];
}

const AVAILABLE_ICONS = [
  { value: 'Package', label: 'Package Box' },
  { value: 'Truck', label: 'Express Delivery Truck' },
  { value: 'ShieldCheck', label: 'Guarantee Shield' },
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

export default function Home({
  slides: initialSlides,
  seasonalCollection: initialSeasonal,
  promoBanners: initialBanners,
  instagram: initialInstagram,
  storeFeatures: initialFeatures,
  categories,
  products,
}: HomePageCMSProps) {
  const [activeTab, setActiveTab] = useState<
    'slider' | 'banners' | 'seasonal' | 'instagram' | 'features'
  >('instagram');

  const [saving, setSaving] = useState(false);
  const [fetchingInsta, setFetchingInsta] = useState(false);
  const [instaMessage, setInstaMessage] = useState<string | null>(null);

  // States
  const [slides, setSlides] = useState<SplitSlideCMS[]>(initialSlides);
  const [seasonal, setSeasonal] = useState<SeasonalCollectionCMS>(initialSeasonal);
  const [banners, setBanners] = useState<PromoBannerCMS[]>(initialBanners);
  const [instagram, setInstagram] = useState(initialInstagram);
  const [features, setFeatures] = useState<StoreFeatureItem[]>(initialFeatures);

  // Auto-Fetch Instagram Action
  const handleAutoFetchInstagram = async () => {
    setFetchingInsta(true);
    setInstaMessage(null);
    try {
      const response = await fetch('/admin/pages/home/instagram-fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN':
            (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
        body: JSON.stringify({
          handle: instagram.handle,
          url: instagram.url,
          access_token: instagram.access_token,
        }),
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.posts)) {
        setInstagram((prev) => ({
          ...prev,
          posts: data.posts,
        }));
        setInstaMessage(data.message || 'Instagram posts successfully synchronized!');
      } else {
        setInstaMessage('Could not synchronize posts. You can manually edit or upload posts below.');
      }
    } catch (err) {
      setInstaMessage('Auto-fetch connection failed. Check handle or API token.');
    } finally {
      setFetchingInsta(false);
    }
  };

  // Submit Handlers
  const handleSaveSlider = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    router.post(
      '/admin/pages/home/slider',
      { slides },
      { onFinish: () => setSaving(false) }
    );
  };

  const handleSaveBanners = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    router.post(
      '/admin/pages/home/promo-banners',
      { banners },
      { onFinish: () => setSaving(false) }
    );
  };

  const handleSaveSeasonal = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    router.post('/admin/pages/home/seasonal-collection', seasonal, {
      onFinish: () => setSaving(false),
    });
  };

  const handleSaveInstagram = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    router.post('/admin/pages/home/instagram', instagram, {
      onFinish: () => setSaving(false),
    });
  };

  const handleSaveFeatures = (e: React.FormEvent) => {
    e.preventDefault();
    if (features.length < 3) {
      alert('A minimum of 3 Trust Badges is mandatory for the homepage layout.');
      return;
    }
    setSaving(true);
    router.post(
      '/admin/pages/home/trust-badges',
      { features },
      { onFinish: () => setSaving(false) }
    );
  };

  return (
    <AdminLayout title="Homepage Sections">
      <Head title="Homepage Sections — Admin Haarmonaa" />

      {/* Header with Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1">
            <Link href="/admin/pages" className="hover:text-black transition-colors">
              Pages
            </Link>
            <span>/</span>
            <span className="text-gray-900">Homepage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Homepage Section Customizer
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-0.5">
            Configure live sliders, promo blocks, curated Instagram gallery, and value proposition trust badges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/pages"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-[10px] text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Pages</span>
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:border-black text-gray-900 rounded-[10px] text-xs font-bold transition-all shadow-2xs"
          >
            <span>Preview Live</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </a>
        </div>
      </div>

      {/* Navigation Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200/80 rounded-[10px] shadow-2xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('instagram')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'instagram'
              ? 'bg-[#111111] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-rose-400" />
          <span>Shop by Gram (Instagram Feed)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('features')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'features'
              ? 'bg-[#111111] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Trust Badges (Min 3)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('slider')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'slider'
              ? 'bg-[#111111] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>Hero Split Slider</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'banners'
              ? 'bg-[#111111] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Promo Banners</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seasonal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'seasonal'
              ? 'bg-[#111111] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          <SunMedium className="w-3.5 h-3.5 text-amber-500" />
          <span>Seasonal Capsule</span>
        </button>
      </div>

      {/* TAB 1: SHOP BY GRAM (INSTAGRAM FEED & AUTO-FETCH) */}
      {activeTab === 'instagram' && (
        <form onSubmit={handleSaveInstagram} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-[8px]">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    "Shop by Gram" Instagram Gallery & Auto-Fetch
                  </h2>
                  <p className="text-xs text-gray-400">
                    Connect your Instagram account, auto-sync posts, or manually curate high-res luxury lookbooks.
                  </p>
                </div>
              </div>

              {/* 1-Click Auto-Fetch Button */}
              <button
                type="button"
                onClick={handleAutoFetchInstagram}
                disabled={fetchingInsta}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-[8px] text-xs font-extrabold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Zap className={`w-3.5 h-3.5 ${fetchingInsta ? 'animate-spin' : ''}`} />
                <span>{fetchingInsta ? 'Fetching Instagram...' : '⚡ Auto-Fetch Latest Posts'}</span>
              </button>
            </div>

            {instaMessage && (
              <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-[8px] text-xs text-rose-800 font-semibold flex items-center justify-between">
                <span>{instaMessage}</span>
                <button
                  type="button"
                  onClick={() => setInstaMessage(null)}
                  className="text-rose-500 hover:text-black text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Profile Config Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Instagram Profile Link <span className="text-[#d0473e]">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={instagram.url}
                  onChange={(e) => setInstagram({ ...instagram, url: e.target.value })}
                  placeholder="https://instagram.com/haarmonaa"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Instagram Handle <span className="text-[#d0473e]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={instagram.handle}
                  onChange={(e) => setInstagram({ ...instagram, handle: e.target.value })}
                  placeholder="@haarmonaa"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Graph API Token <span className="text-gray-400 font-normal">(Optional for direct sync)</span>
                </label>
                <input
                  type="text"
                  value={instagram.access_token || ''}
                  onChange={(e) => setInstagram({ ...instagram, access_token: e.target.value })}
                  placeholder="Paste Instagram Access Token"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>
            </div>

            {/* Gallery Posts Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900">
                  Curated Gallery Posts ({instagram.posts.length} items)
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const newPost: InstagramPostItem = {
                      id: Date.now(),
                      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
                      alt: 'Haarmonaa Jewelry Post',
                      handle: instagram.handle || '@haarmonaa',
                      url: instagram.url || 'https://instagram.com',
                    };
                    setInstagram((prev) => ({
                      ...prev,
                      posts: [...prev.posts, newPost],
                    }));
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-[#d0473e] text-white rounded-[8px] text-[11px] font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Post</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {instagram.posts.map((post, idx) => (
                  <div
                    key={post.id || idx}
                    className="p-4 bg-gray-50/80 border border-gray-200/80 rounded-[10px] space-y-3 relative group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full">
                          Post #{idx + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setInstagram((prev) => ({
                              ...prev,
                              posts: prev.posts.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-[6px] transition-colors cursor-pointer"
                          title="Remove Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Image Upload Component */}
                      <SingleImageUploader
                        label="Post Image / Screenshot"
                        placeholder="Upload image or paste URL..."
                        value={post.image}
                        onChange={(url) => {
                          const updated = [...instagram.posts];
                          updated[idx] = { ...updated[idx], image: url };
                          setInstagram({ ...instagram, posts: updated });
                        }}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10.5px] font-bold text-gray-500 mb-0.5">
                            Post Handle
                          </label>
                          <input
                            type="text"
                            value={post.handle || ''}
                            onChange={(e) => {
                              const updated = [...instagram.posts];
                              updated[idx] = { ...updated[idx], handle: e.target.value };
                              setInstagram({ ...instagram, posts: updated });
                            }}
                            placeholder="@haarmonaa_"
                            className="w-full bg-white border border-gray-200 rounded-[6px] py-1 px-2 text-[11px] text-gray-900 focus:outline-hidden focus:border-black"
                          />
                        </div>

                        <div>
                          <label className="block text-[10.5px] font-bold text-gray-500 mb-0.5">
                            Post URL Link
                          </label>
                          <input
                            type="url"
                            value={post.url || ''}
                            onChange={(e) => {
                              const updated = [...instagram.posts];
                              updated[idx] = { ...updated[idx], url: e.target.value };
                              setInstagram({ ...instagram, posts: updated });
                            }}
                            placeholder="https://instagram.com/p/..."
                            className="w-full bg-white border border-gray-200 rounded-[6px] py-1 px-2 text-[11px] text-gray-900 focus:outline-hidden focus:border-black"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Instagram Section'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: TRUST BADGES & VALUE PROPOSITIONS (MIN 3 MANDATORY) */}
      {activeTab === 'features' && (
        <form onSubmit={handleSaveFeatures} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-[8px]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Homepage Trust Badges & Value Propositions
                  </h2>
                  <p className="text-xs text-gray-400">
                    Displayed beneath Shop by Gram. <strong>Minimum 3 cards are mandatory</strong> for a balanced responsive layout.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newFeature: StoreFeatureItem = {
                    id: 'feat_' + Date.now(),
                    icon: 'Award',
                    title: 'Solid 18K Gold Vermeil',
                    description: 'Heirloom-grade craftsmanship with thick anti-tarnish coating.',
                  };
                  setFeatures((prev) => [...prev, newFeature]);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-[#d0473e] text-white rounded-[8px] text-xs font-bold transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Trust Card</span>
              </button>
            </div>

            <div className="space-y-4">
              {features.map((feat, idx) => (
                <div
                  key={feat.id || idx}
                  className="p-5 bg-gray-50/80 border border-gray-200/80 rounded-[10px] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        Card #{idx + 1} {idx < 3 && <span className="text-emerald-700 font-semibold">(Mandatory)</span>}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={features.length <= 3}
                      onClick={() => {
                        if (features.length <= 3) {
                          alert('Minimum 3 cards are required.');
                          return;
                        }
                        setFeatures((prev) => prev.filter((_, i) => i !== idx));
                      }}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-[6px] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title={features.length <= 3 ? 'Minimum 3 cards required' : 'Remove Card'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                    <div>
                      <VisualIconPicker
                        selectedIcon={feat.icon}
                        customIconUrl={feat.custom_icon || ''}
                        onSelectIcon={(newIcon) => {
                          const updated = [...features];
                          updated[idx] = { ...updated[idx], icon: newIcon, custom_icon: '' };
                          setFeatures(updated);
                        }}
                        onCustomIconChange={(newCustomIcon) => {
                          const updated = [...features];
                          updated[idx] = { ...updated[idx], custom_icon: newCustomIcon };
                          setFeatures(updated);
                        }}
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-[11px] font-bold text-gray-700">
                        Card Title <span className="text-[#d0473e]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={feat.title}
                        onChange={(e) => {
                          const updated = [...features];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setFeatures(updated);
                        }}
                        placeholder="e.g. Free Worldwide Shipping"
                        className="w-full bg-white border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
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
                      onChange={(e) => {
                        const updated = [...features];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setFeatures(updated);
                      }}
                      placeholder="Highlight customer guarantees and benefits..."
                      className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Trust Badges'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: HERO SPLIT SLIDER */}
      {activeTab === 'slider' && (
        <form onSubmit={handleSaveSlider} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Hero Split Slider</h2>
                <p className="text-xs text-gray-400">
                  Manage interactive slide frames, headline typography, and call-to-action buttons.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="p-5 bg-gray-50/80 border border-gray-200/80 rounded-[10px] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">
                      Slide #{index + 1}: {slide.title || 'Untitled Slide'}
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={slide.enabled}
                        onChange={(e) => {
                          const updated = [...slides];
                          updated[index] = { ...updated[index], enabled: e.target.checked };
                          setSlides(updated);
                        }}
                        className="rounded-xs text-black"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Subtitle / Kicker
                      </label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => {
                          const updated = [...slides];
                          updated[index] = { ...updated[index], subtitle: e.target.value };
                          setSlides(updated);
                        }}
                        className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Main Title
                      </label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const updated = [...slides];
                          updated[index] = { ...updated[index], title: e.target.value };
                          setSlides(updated);
                        }}
                        className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Left Image URL
                      </label>
                      <input
                        type="text"
                        value={slide.leftImage}
                        onChange={(e) => {
                          const updated = [...slides];
                          updated[index] = { ...updated[index], leftImage: e.target.value };
                          setSlides(updated);
                        }}
                        className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Right Image URL
                      </label>
                      <input
                        type="text"
                        value={slide.rightImage}
                        onChange={(e) => {
                          const updated = [...slides];
                          updated[index] = { ...updated[index], rightImage: e.target.value };
                          setSlides(updated);
                        }}
                        className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Slider'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 4: PROMO BANNERS */}
      {activeTab === 'banners' && (
        <form onSubmit={handleSaveBanners} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Promotional Banners</h2>
                <p className="text-xs text-gray-400">
                  Configure promotional split blocks and luxury editorial cards.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className="p-5 bg-gray-50/80 border border-gray-200/80 rounded-[10px] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">
                      Banner #{index + 1}: {banner.title}
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={banner.enabled}
                        onChange={(e) => {
                          const updated = [...banners];
                          updated[index] = { ...updated[index], enabled: e.target.checked };
                          setBanners(updated);
                        }}
                        className="rounded-xs text-black"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={banner.title}
                        onChange={(e) => {
                          const updated = [...banners];
                          updated[index] = { ...updated[index], title: e.target.value };
                          setBanners(updated);
                        }}
                        className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={banner.image || ''}
                        onChange={(e) => {
                          const updated = [...banners];
                          updated[index] = { ...updated[index], image: e.target.value };
                          setBanners(updated);
                        }}
                        placeholder="https://..."
                        className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Banners'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 5: SEASONAL CAPSULE */}
      {activeTab === 'seasonal' && (
        <form onSubmit={handleSaveSeasonal} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Seasonal Capsule Collection</h2>
                <p className="text-xs text-gray-400">
                  Highlight exclusive summer / festive drops with custom hero photography.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-900">
                <input
                  type="checkbox"
                  checked={seasonal.enabled}
                  onChange={(e) => setSeasonal({ ...seasonal, enabled: e.target.checked })}
                  className="rounded-xs text-black"
                />
                <span>Enable Section</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={seasonal.badge}
                  onChange={(e) => setSeasonal({ ...seasonal, badge: e.target.value })}
                  placeholder="SUMMER 2026 CAPSULE"
                  className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Collection Title
                </label>
                <input
                  type="text"
                  value={seasonal.title}
                  onChange={(e) => setSeasonal({ ...seasonal, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={seasonal.description}
                  onChange={(e) => setSeasonal({ ...seasonal, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Seasonal Capsule'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
