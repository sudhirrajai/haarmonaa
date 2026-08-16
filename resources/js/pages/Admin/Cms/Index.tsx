import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Category, Product } from '@/types/shop';
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

interface CmsIndexProps {
  slides: SplitSlideCMS[];
  seasonalCollection: SeasonalCollectionCMS;
  promoBanners: PromoBannerCMS[];
  categories: Category[];
  collections?: Array<{ id: number; name: string; slug: string }>;
  products: Product[];
}

export default function CmsIndex({
  slides: initialSlides = [],
  seasonalCollection: initialSeasonal,
  promoBanners: initialBanners = [],
  categories = [],
  collections = [],
  products = [],
}: CmsIndexProps) {

  const [activeTab, setActiveTab] = useState<'slider' | 'seasonal' | 'banners'>('slider');
  const [slides, setSlides] = useState<SplitSlideCMS[]>(initialSlides);
  const [seasonal, setSeasonal] = useState<SeasonalCollectionCMS>(initialSeasonal);
  const [banners, setBanners] = useState<PromoBannerCMS[]>(initialBanners);
  const [processing, setProcessing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // --- 1. Split Hero Slider Handlers ---
  const handleAddSlide = () => {
    const newSlide: SplitSlideCMS = {
      id: Date.now(),
      subtitle: 'NEW CURATION 2026',
      title: 'Heirloom Gold Statement',
      buttonText: 'Shop New Arrivals',
      buttonLink: '/shop',
      showButton: true,
      enabled: true,
      badge: 'NEW',
      leftImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
      rightImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1200&auto=format&fit=crop',
    };
    setSlides([...slides, newSlide]);
  };

  const handleUpdateSlide = (index: number, field: keyof SplitSlideCMS, value: any) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [field]: value };
    setSlides(updated);
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert('You must keep at least 1 hero slide.');
      return;
    }
    setSlides(slides.filter((_, i) => i !== index));
  };

  const handleSaveSlider = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    router.post(
      '/admin/cms/slider',
      { slides } as any,
      {
        onSuccess: () => {
          setProcessing(false);
          setSavedSuccess('Hero split slider saved successfully!');
          setTimeout(() => setSavedSuccess(null), 3000);
        },
        onError: () => setProcessing(false),
      }
    );
  };

  // --- 2. Seasonal Collection Handlers ---
  const handleSaveSeasonal = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    router.post(
      '/admin/cms/seasonal-collection',
      seasonal as any,
      {
        onSuccess: () => {
          setProcessing(false);
          setSavedSuccess('Seasonal Collection section updated successfully!');
          setTimeout(() => setSavedSuccess(null), 3000);
        },
        onError: () => setProcessing(false),
      }
    );
  };

  // --- 3. Promo Banners Handlers ---
  const handleSaveBanners = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    router.post(
      '/admin/cms/promo-banners',
      { banners } as any,
      {
        onSuccess: () => {
          setProcessing(false);
          setSavedSuccess('Promotional banners updated successfully!');
          setTimeout(() => setSavedSuccess(null), 3000);
        },
        onError: () => setProcessing(false),
      }
    );
  };


  return (
    <AdminLayout title="Homepage CMS & Website Builder">
      <Head title="Homepage CMS — Admin Haarmonaa" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Homepage CMS & Visual Studio
            </h1>
          </div>
          <p className="text-xs text-gray-500">
            Control the 50/50 hero split slider, seasonal collections (Summer/Winter/Festive), and promotional banners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Preview Live Homepage</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </a>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-white px-6 pt-3 rounded-t-3xl border-x border-t border-gray-200/80 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('slider')}
          className={`pb-4 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'slider'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>50/50 Hero Split Slider ({slides.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seasonal')}
          className={`pb-4 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'seasonal'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          <SunMedium className="w-4 h-4 text-amber-500" />
          <span>Seasonal Collection Section {seasonal.enabled ? '🟢 (Active)' : '⚪ (Disabled)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('banners')}
          className={`pb-4 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'banners'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Promotional Dual Banners</span>
        </button>
      </div>

      {/* TAB 1: 50/50 HERO SPLIT SLIDER */}
      {activeTab === 'slider' && (
        <form onSubmit={handleSaveSlider} className="bg-white p-6 sm:p-8 rounded-b-3xl border-x border-b border-gray-200/80 shadow-2xs space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Hero Split Slides</h2>
              <p className="text-xs text-gray-500">Each slide showcases 2 side-by-side images with centered typography and button.</p>
            </div>

            <button
              type="button"
              onClick={handleAddSlide}
              className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Slide</span>
            </button>
          </div>

          <div className="space-y-6">
            {slides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className={`p-6 rounded-3xl border-2 transition-all space-y-6 ${
                  slide.enabled ? 'border-gray-200 bg-[#fdfdfd]' : 'border-gray-200/60 bg-gray-50/70 opacity-75'
                }`}
              >
                {/* Top Row: Slide Header & Enable Toggle */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#111111] text-white text-xs font-extrabold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{slide.title || `Slide #${idx + 1}`}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Toggle Slide Active Status */}
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={slide.enabled}
                        onChange={(e) => handleUpdateSlide(idx, 'enabled', e.target.checked)}
                        className="w-4 h-4 text-black focus:ring-black rounded-sm cursor-pointer"
                      />
                      <span className={slide.enabled ? 'text-emerald-700 font-bold' : 'text-gray-400'}>
                        {slide.enabled ? 'Active on Storefront' : 'Disabled'}
                      </span>
                    </label>

                    {slides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(idx)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Left & Right Images Row with Live Previews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Image */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700">
                      Left Split Image URL <span className="text-[#d0473e]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={slide.leftImage}
                      onChange={(e) => handleUpdateSlide(idx, 'leftImage', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black"
                    />
                    <div className="aspect-16/10 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 max-h-36">
                      <img
                        src={slide.leftImage}
                        alt="Left Preview"
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800';
                        }}
                      />
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700">
                      Right Split Image URL <span className="text-[#d0473e]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={slide.rightImage}
                      onChange={(e) => handleUpdateSlide(idx, 'rightImage', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black"
                    />
                    <div className="aspect-16/10 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 max-h-36">
                      <img
                        src={slide.rightImage}
                        alt="Right Preview"
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.target.src = 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Text Content Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle / Tagline</label>
                    <input
                      type="text"
                      value={slide.subtitle}
                      onChange={(e) => handleUpdateSlide(idx, 'subtitle', e.target.value)}
                      placeholder="CAPTIVATING COLLECTION"
                      className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Main Heading / Title</label>
                    <input
                      type="text"
                      required
                      value={slide.title}
                      onChange={(e) => handleUpdateSlide(idx, 'title', e.target.value)}
                      placeholder="Sculpted By Light"
                      className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={slide.badge || ''}
                      onChange={(e) => handleUpdateSlide(idx, 'badge', e.target.value)}
                      placeholder="NEW ARRIVALS 2026"
                      className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                    />
                  </div>
                </div>

                {/* Button & Link Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 items-center bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`btn_show_${idx}`}
                      checked={slide.showButton !== false}
                      onChange={(e) => handleUpdateSlide(idx, 'showButton', e.target.checked)}
                      className="w-4 h-4 text-black focus:ring-black rounded-sm cursor-pointer"
                    />
                    <label htmlFor={`btn_show_${idx}`} className="text-xs font-bold text-gray-800 cursor-pointer">
                      Display CTA Button
                    </label>
                  </div>

                  {slide.showButton !== false && (
                    <>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Button Text</label>
                        <input
                          type="text"
                          value={slide.buttonText}
                          onChange={(e) => handleUpdateSlide(idx, 'buttonText', e.target.value)}
                          placeholder="Shop Collection"
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Button Link URL</label>
                        <input
                          type="text"
                          value={slide.buttonLink}
                          onChange={(e) => handleUpdateSlide(idx, 'buttonLink', e.target.value)}
                          placeholder="/shop"
                          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="px-8 py-3.5 bg-[#111111] hover:bg-[#d0473e] text-white font-extrabold text-xs uppercase tracking-wider rounded-full flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{processing ? 'Saving Slider...' : 'Save Split Hero Slider'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SEASONAL / CURATED COLLECTION (SUMMER / WINTER / FESTIVE) */}
      {activeTab === 'seasonal' && (
        <form onSubmit={handleSaveSeasonal} className="bg-white p-6 sm:p-8 rounded-b-3xl border-x border-b border-gray-200/80 shadow-2xs space-y-6">
          {/* Master Section Enable/Disable Switch */}
          <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-sm font-extrabold text-gray-900">
                Seasonal / Feature Collection Display Section
              </h2>
              <p className="text-xs text-gray-600">
                Turn this curated showcase section ON or OFF on the storefront landing page.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={seasonal.enabled}
                onChange={(e) => setSeasonal({ ...seasonal, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              <span className="ml-3 text-xs font-bold text-gray-900">
                {seasonal.enabled ? 'Section Enabled' : 'Section Hidden'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title & Badge */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Collection Title (e.g. Summer Solstice / Winter Lookbook) <span className="text-[#d0473e]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={seasonal.title}
                  onChange={(e) => setSeasonal({ ...seasonal, title: e.target.value })}
                  placeholder="Summer Solstice Edition"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle / Subheading</label>
                <input
                  type="text"
                  value={seasonal.subtitle}
                  onChange={(e) => setSeasonal({ ...seasonal, subtitle: e.target.value })}
                  placeholder="SUNLIT REFLECTIONS & WATERPROOF HEIRLOOMS"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Seasonal Capsule Badge</label>
                <input
                  type="text"
                  value={seasonal.badge}
                  onChange={(e) => setSeasonal({ ...seasonal, badge: e.target.value })}
                  placeholder="SUMMER 2026 CAPSULE"
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description Paragraph</label>
                <textarea
                  rows={3}
                  value={seasonal.description}
                  onChange={(e) => setSeasonal({ ...seasonal, description: e.target.value })}
                  placeholder="A radiant curation designed to shine effortlessly through beach sun and ocean mist..."
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                />
              </div>
            </div>

            {/* Banner Image & Category Target */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Collection Banner Image URL
                </label>
                <input
                  type="text"
                  value={seasonal.banner_image}
                  onChange={(e) => setSeasonal({ ...seasonal, banner_image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                />
                {seasonal.banner_image && (
                  <div className="mt-2 aspect-16/9 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 max-h-36">
                    <img src={seasonal.banner_image} alt="Banner Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Select Featured Category or Collection to Showcase
                </label>
                <select
                  value={seasonal.category_slug}
                  onChange={(e) => setSeasonal({ ...seasonal, category_slug: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                >
                  <option value="all">All Products</option>
                  <optgroup label="Shop Categories">
                    {categories.map((c) => (
                      <option key={`cat-${c.id}`} value={c.slug}>
                        Category: {c.name}
                      </option>
                    ))}
                  </optgroup>
                  {collections && collections.length > 0 && (
                    <optgroup label="Curated Collections">
                      {collections.map((col) => (
                        <option key={`col-${col.id}`} value={col.slug}>
                          Collection: {col.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={seasonal.button_text}
                    onChange={(e) => setSeasonal({ ...seasonal, button_text: e.target.value })}
                    placeholder="Explore Summer Edit"
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={seasonal.button_link}
                    onChange={(e) => setSeasonal({ ...seasonal, button_link: e.target.value })}
                    placeholder="/shop?category=necklaces"
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="px-8 py-3.5 bg-[#111111] hover:bg-[#d0473e] text-white font-extrabold text-xs uppercase tracking-wider rounded-full flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{processing ? 'Saving...' : 'Save Seasonal Collection Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: PROMOTIONAL DUAL BANNERS */}
      {activeTab === 'banners' && (
        <form onSubmit={handleSaveBanners} className="bg-white p-6 sm:p-8 rounded-b-3xl border-x border-b border-gray-200/80 shadow-2xs space-y-6">
          <div className="pb-3 border-b border-gray-100">
            <h2 className="text-base font-extrabold text-gray-900">Promotional Dual Banners</h2>
            <p className="text-xs text-gray-500">Edit the two side-by-side promotional highlight blocks displayed below categories.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {banners.map((card, idx) => (
              <div key={card.id || idx} className="p-6 rounded-3xl border-2 border-gray-200 bg-gray-50/50 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                    Promo Card #{idx + 1}
                  </h3>

                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={card.enabled !== false}
                      onChange={(e) => {
                        const updated = [...banners];
                        updated[idx].enabled = e.target.checked;
                        setBanners(updated);
                      }}
                      className="w-4 h-4 text-black focus:ring-black rounded-sm cursor-pointer"
                    />
                    <span className={card.enabled !== false ? 'text-emerald-700' : 'text-gray-400'}>
                      {card.enabled !== false ? 'Enabled' : 'Hidden'}
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={card.subtitle || ''}
                    onChange={(e) => {
                      const updated = [...banners];
                      updated[idx].subtitle = e.target.value;
                      setBanners(updated);
                    }}
                    placeholder="EPITOME OF REFINEMENT"
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={card.title}
                    onChange={(e) => {
                      const updated = [...banners];
                      updated[idx].title = e.target.value;
                      setBanners(updated);
                    }}
                    placeholder="Light The Wonders"
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={card.description || ''}
                    onChange={(e) => {
                      const updated = [...banners];
                      updated[idx].description = e.target.value;
                      setBanners(updated);
                    }}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Image URL (Optional)</label>
                  <input
                    type="text"
                    value={card.image || ''}
                    onChange={(e) => {
                      const updated = [...banners];
                      updated[idx].image = e.target.value;
                      setBanners(updated);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={card.buttonText || ''}
                      onChange={(e) => {
                        const updated = [...banners];
                        updated[idx].buttonText = e.target.value;
                        setBanners(updated);
                      }}
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Button Link</label>
                    <input
                      type="text"
                      value={card.buttonLink || ''}
                      onChange={(e) => {
                        const updated = [...banners];
                        updated[idx].buttonLink = e.target.value;
                        setBanners(updated);
                      }}
                      className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="px-8 py-3.5 bg-[#111111] hover:bg-[#d0473e] text-white font-extrabold text-xs uppercase tracking-wider rounded-full flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{processing ? 'Saving...' : 'Save Promo Banners'}</span>
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
