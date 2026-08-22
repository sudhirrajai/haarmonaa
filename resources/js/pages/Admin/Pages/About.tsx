import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminToggle } from '@/components/admin/AdminToggle';
import { SingleImageUploader } from '@/components/admin/SingleImageUploader';
import {
  Sparkles,
  ArrowLeft,
  Save,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Sliders,
  Image as ImageIcon,
  BarChart2,
  Award,
  Quote,
  Layers,
  Users,
  ShieldCheck,
  Star,
} from 'lucide-react';

interface AboutContentCMS {
  hero: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
  };
  media_banner: {
    enabled: boolean;
    left_image: string;
    right_bg_image: string;
    brand_subtitle_top: string;
    brand_title: string;
    brand_subtitle_bottom: string;
  };
  stats: {
    enabled: boolean;
    items: Array<{
      value: string;
      label: string;
      description: string;
    }>;
  };
  features: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    cards: Array<{
      image: string;
      title: string;
      description: string;
    }>;
  };
  quote: {
    enabled: boolean;
    stars: number;
    quote: string;
    author_name: string;
    author_role: string;
  };
  split_rows: {
    enabled: boolean;
    rows: Array<{
      badge: string;
      title: string;
      description: string;
      button_text: string;
      button_link: string;
      image: string;
      image_position: 'left' | 'right';
    }>;
  };
  stories: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    cards: Array<{
      image: string;
      title: string;
      description: string;
    }>;
  };
}

interface AboutPageProps {
  aboutContent: AboutContentCMS;
}

export default function About({ aboutContent: initialContent }: AboutPageProps) {
  const [activeTab, setActiveTab] = useState<
    'hero' | 'media' | 'stats' | 'features' | 'quote' | 'split' | 'stories'
  >('hero');

  const [content, setContent] = useState<AboutContentCMS>(initialContent);
  const [saving, setSaving] = useState(false);
  const [instantFeedback, setInstantFeedback] = useState<string | null>(null);

  const handleAsyncSectionToggle = async (section: string, enabled: boolean) => {
    try {
      const csrfToken =
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
      const response = await fetch('/admin/pages/about/toggle-section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({ section, enabled }),
      });

      const data = await response.json();
      if (data.success) {
        setInstantFeedback(data.message || 'Section visibility updated');
        setTimeout(() => setInstantFeedback(null), 3000);
      }
    } catch {
      setInstantFeedback('Network error while updating visibility');
      setTimeout(() => setInstantFeedback(null), 3000);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    router.post(
      '/admin/pages/about',
      { aboutContent: content },
      {
        onFinish: () => setSaving(false),
      }
    );
  };

  return (
    <AdminLayout title="About Us Page Customizer">
      <Head title="About Us Page Customizer — Admin Haarmonaa" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-1">
            <Link href="/admin/pages" className="hover:text-black transition-colors">
              Pages
            </Link>
            <span>/</span>
            <span className="text-gray-900">About Us</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            About Us Page Customizer
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-0.5">
            Customize typography, image showcases, stats counters, brand quotes, and story sections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-[10px] text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Pages</span>
          </Link>

          <a
            href="/about-us"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 hover:border-black text-gray-900 rounded-[10px] text-xs font-bold transition-all shadow-2xs"
          >
            <span>Preview Live</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </a>
        </div>
      </div>

      {/* Floating Instant Live Feedback Toast */}
      {instantFeedback && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-black text-white text-xs font-bold rounded-[10px] shadow-2xl flex items-center gap-3 animate-bounce border border-gray-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{instantFeedback}</span>
        </div>
      )}

      {/* Navigation Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200/80 rounded-[10px] shadow-2xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'hero'
              ? 'bg-[#111111] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>1. Hero Header {content.hero.enabled ? '🟢' : '⚪'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'media'
              ? 'bg-[#111111] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>2. Dual Media {content.media_banner.enabled ? '🟢' : '⚪'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'stats'
              ? 'bg-[#111111] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>3. Stats Counters {content.stats.enabled ? '🟢' : '⚪'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('features')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'features'
              ? 'bg-[#111111] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-purple-400" />
          <span>4. Core Pillars {content.features.enabled ? '🟢' : '⚪'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quote')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'quote'
              ? 'bg-[#111111] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          <Quote className="w-3.5 h-3.5 text-amber-500" />
          <span>5. Brand Quote {content.quote.enabled ? '🟢' : '⚪'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('split')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'split'
              ? 'bg-[#111111] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-rose-400" />
          <span>6. Split Rows {content.split_rows.enabled ? '🟢' : '⚪'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stories')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'stories'
              ? 'bg-[#111111] text-white shadow-xs'
              : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>7. Our Roots {content.stories.enabled ? '🟢' : '⚪'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ======================================================== */}
        {/* TAB 1: HERO HEADER & BREADCRUMBS STATEMENT */}
        {/* ======================================================== */}
        {activeTab === 'hero' && (
          <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Hero Statement Section</h2>
                <p className="text-xs text-gray-500">
                  Displays the breadcrumbs, main heading, and introduction at the very top of the About page.
                </p>
              </div>

              <AdminToggle
                label={content.hero.enabled ? 'Section Active' : 'Section Hidden'}
                checked={content.hero.enabled}
                onChange={(val) => {
                  setContent({
                    ...content,
                    hero: { ...content.hero, enabled: val },
                  });
                  handleAsyncSectionToggle('hero', val);
                }}
                activeColor="bg-emerald-600"
                size="md"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Top Badge / Welcome Tag
                </label>
                <input
                  type="text"
                  value={content.hero.badge || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, badge: e.target.value },
                    })
                  }
                  placeholder="WELCOME TO HAARMONAA"
                  className="w-full bg-white border border-gray-200 rounded-[8px] py-2.5 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Main Page Heading <span className="text-gray-400 font-normal">(Use Enter for new line)</span>
                </label>
                <textarea
                  rows={2}
                  value={content.hero.title || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, title: e.target.value },
                    })
                  }
                  placeholder="Artisanal Fine Jewelry&#10;Available to Everyone"
                  className="w-full bg-white border border-gray-200 rounded-[8px] py-2.5 px-3 text-xs text-gray-900 font-extrabold focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Introductory Paragraph Description
                </label>
                <textarea
                  rows={3}
                  value={content.hero.description || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, description: e.target.value },
                    })
                  }
                  placeholder="Over a decade of master goldsmithing, crafting thick 18K solid gold vermeil..."
                  className="w-full bg-white border border-gray-200 rounded-[8px] py-2.5 px-3 text-xs text-gray-900 leading-relaxed focus:outline-hidden focus:border-black"
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
                <span>{saving ? 'Saving...' : 'Save About Page'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: DUAL MEDIA SHOWCASE BANNER */}
        {/* ======================================================== */}
        {activeTab === 'media' && (
          <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Dual Media Showcase Banner</h2>
                <p className="text-xs text-gray-500">
                  Side-by-side high-fashion photo & luxury dark brand signature card.
                </p>
              </div>

              <AdminToggle
                label={content.media_banner.enabled ? 'Section Active' : 'Section Hidden'}
                checked={content.media_banner.enabled}
                onChange={(val) => {
                  setContent({
                    ...content,
                    media_banner: { ...content.media_banner, enabled: val },
                  });
                  handleAsyncSectionToggle('media_banner', val);
                }}
                activeColor="bg-emerald-600"
                size="md"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Photo */}
              <div className="p-5 bg-gray-50 rounded-[10px] border border-gray-200/70 space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                  Left Visual (Models / Lifestyle)
                </h3>
                <SingleImageUploader
                  label="Left Image Upload"
                  hint="Recommended: 1200×800 px (Landscape)"
                  value={content.media_banner.left_image}
                  onChange={(url) =>
                    setContent({
                      ...content,
                      media_banner: { ...content.media_banner, left_image: url },
                    })
                  }
                />
              </div>

              {/* Right Brand Showcase */}
              <div className="p-5 bg-gray-50 rounded-[10px] border border-gray-200/70 space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                  Right Visual (Brand Identity Card)
                </h3>
                <SingleImageUploader
                  label="Background Overlay Image"
                  hint="Recommended: 1200×800 px"
                  value={content.media_banner.right_bg_image}
                  onChange={(url) =>
                    setContent({
                      ...content,
                      media_banner: { ...content.media_banner, right_bg_image: url },
                    })
                  }
                />

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Top Micro Subtitle
                  </label>
                  <input
                    type="text"
                    value={content.media_banner.brand_subtitle_top}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        media_banner: {
                          ...content.media_banner,
                          brand_subtitle_top: e.target.value,
                        },
                      })
                    }
                    placeholder="HAARMONAA FINE JEWELRY"
                    className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Brand Center Title
                  </label>
                  <input
                    type="text"
                    value={content.media_banner.brand_title}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        media_banner: {
                          ...content.media_banner,
                          brand_title: e.target.value,
                        },
                      })
                    }
                    placeholder="haarmonaa"
                    className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Bottom Micro Subtitle
                  </label>
                  <input
                    type="text"
                    value={content.media_banner.brand_subtitle_bottom}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        media_banner: {
                          ...content.media_banner,
                          brand_subtitle_bottom: e.target.value,
                        },
                      })
                    }
                    placeholder="SOLID 18K GOLD VERMEIL"
                    className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save About Page'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: KEY STATISTICS COUNTERS */}
        {/* ======================================================== */}
        {activeTab === 'stats' && (
          <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Key Statistics Counters</h2>
                <p className="text-xs text-gray-500">
                  Highlight your accomplishments (e.g. 50k+ pieces, 100% waterproof, 15k+ customers).
                </p>
              </div>

              <div className="flex items-center gap-4">
                <AdminToggle
                  label={content.stats.enabled ? 'Section Active' : 'Section Hidden'}
                  checked={content.stats.enabled}
                  onChange={(val) => {
                    setContent({
                      ...content,
                      stats: { ...content.stats, enabled: val },
                    });
                    handleAsyncSectionToggle('stats', val);
                  }}
                  activeColor="bg-emerald-600"
                  size="md"
                />

                <button
                  type="button"
                  onClick={() => {
                    setContent({
                      ...content,
                      stats: {
                        ...content.stats,
                        items: [
                          ...content.stats.items,
                          { value: '100+', label: 'New Metric', description: 'Metric explanation...' },
                        ],
                      },
                    });
                  }}
                  className="px-3.5 py-1.5 bg-black hover:bg-gray-800 text-white rounded-[8px] text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stat</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.stats.items.map((st, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-gray-50 rounded-[10px] border border-gray-200/80 space-y-3 relative group"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (content.stats.items.length <= 1) {
                        alert('Must keep at least 1 statistic item.');
                        return;
                      }
                      const updated = content.stats.items.filter((_, i) => i !== idx);
                      setContent({
                        ...content,
                        stats: { ...content.stats, items: updated },
                      });
                    }}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-[6px] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Counter Value (e.g. 50k+)
                    </label>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => {
                        const updated = [...content.stats.items];
                        updated[idx].value = e.target.value;
                        setContent({
                          ...content,
                          stats: { ...content.stats, items: updated },
                        });
                      }}
                      placeholder="50k+"
                      className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-base font-extrabold text-gray-900 focus:outline-hidden focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Title Label
                    </label>
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => {
                        const updated = [...content.stats.items];
                        updated[idx].label = e.target.value;
                        setContent({
                          ...content,
                          stats: { ...content.stats, items: updated },
                        });
                      }}
                      placeholder="Heirloom Jewels"
                      className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs font-bold text-gray-900 focus:outline-hidden focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Description Subtext
                    </label>
                    <textarea
                      rows={2}
                      value={st.description}
                      onChange={(e) => {
                        const updated = [...content.stats.items];
                        updated[idx].description = e.target.value;
                        setContent({
                          ...content,
                          stats: { ...content.stats, items: updated },
                        });
                      }}
                      placeholder="Brief explanation..."
                      className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-600 focus:outline-hidden focus:border-black"
                    />
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
                <span>{saving ? 'Saving...' : 'Save About Page'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: WHY CHOOSE US / 3 CORE PILLARS */}
        {/* ======================================================== */}
        {activeTab === 'features' && (
          <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Why Choose Us / Core Pillars</h2>
                <p className="text-xs text-gray-500">
                  Curated photo cards showcasing materials, craftsmanship, and pricing values.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <AdminToggle
                  label={content.features.enabled ? 'Section Active' : 'Section Hidden'}
                  checked={content.features.enabled}
                  onChange={(val) => {
                    setContent({
                      ...content,
                      features: { ...content.features, enabled: val },
                    });
                    handleAsyncSectionToggle('features', val);
                  }}
                  activeColor="bg-emerald-600"
                  size="md"
                />

                <button
                  type="button"
                  onClick={() => {
                    setContent({
                      ...content,
                      features: {
                        ...content.features,
                        cards: [
                          ...content.features.cards,
                          {
                            image:
                              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
                            title: 'New Value Pillar',
                            description: 'Description of this craft principle...',
                          },
                        ],
                      },
                    });
                  }}
                  className="px-3.5 py-1.5 bg-black hover:bg-gray-800 text-white rounded-[8px] text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Card</span>
                </button>
              </div>
            </div>

            {/* Section Header Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={content.features.badge}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      features: { ...content.features, badge: e.target.value },
                    })
                  }
                  placeholder="WHY CHOOSE US"
                  className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={content.features.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      features: { ...content.features, title: e.target.value },
                    })
                  }
                  placeholder="Our Peculiar Things"
                  className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Header Description</label>
                <input
                  type="text"
                  value={content.features.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      features: { ...content.features, description: e.target.value },
                    })
                  }
                  placeholder="Our boutique selections are chosen..."
                  className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              {content.features.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-gray-50 rounded-[10px] border border-gray-200/80 space-y-4 relative group"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (content.features.cards.length <= 1) {
                        alert('Must keep at least 1 pillar card.');
                        return;
                      }
                      const updated = content.features.cards.filter((_, i) => i !== idx);
                      setContent({
                        ...content,
                        features: { ...content.features, cards: updated },
                      });
                    }}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-[6px] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <SingleImageUploader
                    label={`Pillar #${idx + 1} Image`}
                    hint="Recommended: 800×800 px (Square / 4:3)"
                    value={card.image}
                    onChange={(url) => {
                      const updated = [...content.features.cards];
                      updated[idx].image = url;
                      setContent({
                        ...content,
                        features: { ...content.features, cards: updated },
                      });
                    }}
                  />

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Card Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const updated = [...content.features.cards];
                        updated[idx].title = e.target.value;
                        setContent({
                          ...content,
                          features: { ...content.features, cards: updated },
                        });
                      }}
                      placeholder="Pillar Title"
                      className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs font-bold text-gray-900 focus:outline-hidden focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Card Description
                    </label>
                    <textarea
                      rows={3}
                      value={card.description}
                      onChange={(e) => {
                        const updated = [...content.features.cards];
                        updated[idx].description = e.target.value;
                        setContent({
                          ...content,
                          features: { ...content.features, cards: updated },
                        });
                      }}
                      placeholder="Craftsmanship principle..."
                      className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-600 leading-relaxed focus:outline-hidden focus:border-black"
                    />
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
                <span>{saving ? 'Saving...' : 'Save About Page'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: BRAND TESTIMONIAL QUOTE BANNER */}
        {/* ======================================================== */}
        {activeTab === 'quote' && (
          <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Brand Manifesto Quote Banner</h2>
                <p className="text-xs text-gray-500">
                  Full-width luxury emerald quote band with star rating and founder citation.
                </p>
              </div>

              <AdminToggle
                label={content.quote.enabled ? 'Section Active' : 'Section Hidden'}
                checked={content.quote.enabled}
                onChange={(val) => {
                  setContent({
                    ...content,
                    quote: { ...content.quote, enabled: val },
                  });
                  handleAsyncSectionToggle('quote', val);
                }}
                activeColor="bg-emerald-600"
                size="md"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Star Rating (1 - 5)
                </label>
                <div className="flex items-center gap-1.5 text-amber-500 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setContent({
                          ...content,
                          quote: { ...content.quote, stars: s },
                        })
                      }
                      className="cursor-pointer hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= content.quote.stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-gray-500 ml-2">
                    ({content.quote.stars || 5} Stars)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Quote Paragraph Text
                </label>
                <textarea
                  rows={4}
                  value={content.quote.quote}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      quote: { ...content.quote, quote: e.target.value },
                    })
                  }
                  placeholder="Haarmonaa will become an example of responsible business..."
                  className="w-full bg-white border border-gray-200 rounded-[8px] py-2.5 px-3 text-xs text-gray-900 italic leading-relaxed focus:outline-hidden focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Author / Founder Name
                  </label>
                  <input
                    type="text"
                    value={content.quote.author_name}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        quote: { ...content.quote, author_name: e.target.value },
                      })
                    }
                    placeholder="Carie—Gosée Hera"
                    className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs font-bold text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Author Title / Role
                  </label>
                  <input
                    type="text"
                    value={content.quote.author_role}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        quote: { ...content.quote, author_role: e.target.value },
                      })
                    }
                    placeholder="CEO and Founder Haarmonaa Boutique"
                    className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#111111] hover:bg-[#d0473e] text-white rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save About Page'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: ALTERNATING SPLIT STORY ROWS */}
        {/* ======================================================== */}
        {activeTab === 'split' && (
          <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Alternating Split Feature Rows</h2>
                <p className="text-xs text-gray-500">
                  Large photography rows with customizable button links and badge tags.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <AdminToggle
                  label={content.split_rows.enabled ? 'Section Active' : 'Section Hidden'}
                  checked={content.split_rows.enabled}
                  onChange={(val) => {
                    setContent({
                      ...content,
                      split_rows: { ...content.split_rows, enabled: val },
                    });
                    handleAsyncSectionToggle('split_rows', val);
                  }}
                  activeColor="bg-emerald-600"
                  size="md"
                />

                <button
                  type="button"
                  onClick={() => {
                    setContent({
                      ...content,
                      split_rows: {
                        ...content.split_rows,
                        rows: [
                          ...content.split_rows.rows,
                          {
                            badge: 'NEW PROMISE',
                            title: 'New Story Feature',
                            description: 'Description of this feature...',
                            button_text: 'Explore Collection',
                            button_link: '/shop',
                            image:
                              'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
                            image_position: 'left',
                          },
                        ],
                      },
                    });
                  }}
                  className="px-3.5 py-1.5 bg-black hover:bg-gray-800 text-white rounded-[8px] text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Split Row</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {content.split_rows.rows.map((row, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-gray-50 rounded-[10px] border border-gray-200/80 space-y-4 relative group"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-900">
                      Split Row #{idx + 1}
                    </h3>

                    <div className="flex items-center gap-3">
                      <select
                        value={row.image_position || 'left'}
                        onChange={(e) => {
                          const updated = [...content.split_rows.rows];
                          updated[idx].image_position = e.target.value as 'left' | 'right';
                          setContent({
                            ...content,
                            split_rows: { ...content.split_rows, rows: updated },
                          });
                        }}
                        className="bg-white border border-gray-200 rounded-[6px] py-1 px-2.5 text-xs text-gray-700 font-bold focus:outline-hidden"
                      >
                        <option value="left">Image on Left</option>
                        <option value="right">Image on Right</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          if (content.split_rows.rows.length <= 1) {
                            alert('Must keep at least 1 split row.');
                            return;
                          }
                          const updated = content.split_rows.rows.filter((_, i) => i !== idx);
                          setContent({
                            ...content,
                            split_rows: { ...content.split_rows, rows: updated },
                          });
                        }}
                        className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-[6px] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <SingleImageUploader
                        label="Row Photo"
                        hint="Recommended: 1000×750 px (4:3)"
                        value={row.image}
                        onChange={(url) => {
                          const updated = [...content.split_rows.rows];
                          updated[idx].image = url;
                          setContent({
                            ...content,
                            split_rows: { ...content.split_rows, rows: updated },
                          });
                        }}
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Micro Badge Tag
                        </label>
                        <input
                          type="text"
                          value={row.badge}
                          onChange={(e) => {
                            const updated = [...content.split_rows.rows];
                            updated[idx].badge = e.target.value;
                            setContent({
                              ...content,
                              split_rows: { ...content.split_rows, rows: updated },
                            });
                          }}
                          placeholder="OUR PROMISE"
                          className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs font-bold text-gray-900 focus:outline-hidden focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Row Title
                        </label>
                        <input
                          type="text"
                          value={row.title}
                          onChange={(e) => {
                            const updated = [...content.split_rows.rows];
                            updated[idx].title = e.target.value;
                            setContent({
                              ...content,
                              split_rows: { ...content.split_rows, rows: updated },
                            });
                          }}
                          placeholder="The Best Product"
                          className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs font-extrabold text-gray-900 focus:outline-hidden focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={row.description}
                          onChange={(e) => {
                            const updated = [...content.split_rows.rows];
                            updated[idx].description = e.target.value;
                            setContent({
                              ...content,
                              split_rows: { ...content.split_rows, rows: updated },
                            });
                          }}
                          placeholder="Crafting details..."
                          className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-600 leading-relaxed focus:outline-hidden focus:border-black"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            Button Text
                          </label>
                          <input
                            type="text"
                            value={row.button_text}
                            onChange={(e) => {
                              const updated = [...content.split_rows.rows];
                              updated[idx].button_text = e.target.value;
                              setContent({
                                ...content,
                                split_rows: { ...content.split_rows, rows: updated },
                              });
                            }}
                            placeholder="Learn More"
                            className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            Button Link
                          </label>
                          <input
                            type="text"
                            value={row.button_link}
                            onChange={(e) => {
                              const updated = [...content.split_rows.rows];
                              updated[idx].button_link = e.target.value;
                              setContent({
                                ...content,
                                split_rows: { ...content.split_rows, rows: updated },
                              });
                            }}
                            placeholder="/shop"
                            className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                          />
                        </div>
                      </div>
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
                <span>{saving ? 'Saving...' : 'Save About Page'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: EXPANDING HORIZONS / STORY & TEAM CARDS */}
        {/* ======================================================== */}
        {activeTab === 'stories' && (
          <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  Expanding Horizons / Our Roots
                </h2>
                <p className="text-xs text-gray-500">
                  Highlight your studio team, genesis story, and packaging promises.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <AdminToggle
                  label={content.stories.enabled ? 'Section Active' : 'Section Hidden'}
                  checked={content.stories.enabled}
                  onChange={(val) => {
                    setContent({
                      ...content,
                      stories: { ...content.stories, enabled: val },
                    });
                    handleAsyncSectionToggle('stories', val);
                  }}
                  activeColor="bg-emerald-600"
                  size="md"
                />

                <button
                  type="button"
                  onClick={() => {
                    setContent({
                      ...content,
                      stories: {
                        ...content.stories,
                        cards: [
                          ...content.stories.cards,
                          {
                            image:
                              'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
                            title: 'New Chapter',
                            description: 'Story of this milestone...',
                          },
                        ],
                      },
                    });
                  }}
                  className="px-3.5 py-1.5 bg-black hover:bg-gray-800 text-white rounded-[8px] text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Card</span>
                </button>
              </div>
            </div>

            {/* Header Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={content.stories.badge}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      stories: { ...content.stories, badge: e.target.value },
                    })
                  }
                  placeholder="SEE OUR ROOTS"
                  className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={content.stories.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      stories: { ...content.stories, title: e.target.value },
                    })
                  }
                  placeholder="Expanding Horizons"
                  className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 font-bold focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Header Description</label>
                <input
                  type="text"
                  value={content.stories.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      stories: { ...content.stories, description: e.target.value },
                    })
                  }
                  placeholder="Rooted in a passion for artisanal beauty..."
                  className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-900 focus:outline-hidden focus:border-black"
                />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              {content.stories.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-gray-50 rounded-[10px] border border-gray-200/80 space-y-4 relative group"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (content.stories.cards.length <= 1) {
                        alert('Must keep at least 1 story card.');
                        return;
                      }
                      const updated = content.stories.cards.filter((_, i) => i !== idx);
                      setContent({
                        ...content,
                        stories: { ...content.stories, cards: updated },
                      });
                    }}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-[6px] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <SingleImageUploader
                    label={`Story #${idx + 1} Image`}
                    hint="Recommended: 800×600 px (4:3)"
                    value={card.image}
                    onChange={(url) => {
                      const updated = [...content.stories.cards];
                      updated[idx].image = url;
                      setContent({
                        ...content,
                        stories: { ...content.stories, cards: updated },
                      });
                    }}
                  />

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Story Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const updated = [...content.stories.cards];
                        updated[idx].title = e.target.value;
                        setContent({
                          ...content,
                          stories: { ...content.stories, cards: updated },
                        });
                      }}
                      placeholder="Story Title"
                      className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs font-bold text-gray-900 focus:outline-hidden focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Story Description
                    </label>
                    <textarea
                      rows={3}
                      value={card.description}
                      onChange={(e) => {
                        const updated = [...content.stories.cards];
                        updated[idx].description = e.target.value;
                        setContent({
                          ...content,
                          stories: { ...content.stories, cards: updated },
                        });
                      }}
                      placeholder="Story explanation..."
                      className="w-full bg-white border border-gray-200 rounded-[8px] py-2 px-3 text-xs text-gray-600 leading-relaxed focus:outline-hidden focus:border-black"
                    />
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
                <span>{saving ? 'Saving...' : 'Save About Page'}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </AdminLayout>
  );
}
