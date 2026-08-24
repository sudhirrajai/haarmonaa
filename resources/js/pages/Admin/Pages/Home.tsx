import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Category, Product } from '@/types/shop';
import { SingleImageUploader } from '@/components/admin/SingleImageUploader';
import { VisualIconPicker } from '@/components/admin/VisualIconPicker';
import { AdminToggle } from '@/components/admin/AdminToggle';
import { SectionRenderer, SectionBlock } from '@/components/shop/builder/SectionRenderer';
import {
  Sparkles,
  Sliders,
  Layers,
  Save,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  ShoppingBag,
  Grid,
  Image as ImageIcon,
  Camera,
  ShieldCheck,
  FileText,
  HelpCircle,
  Code,
  ArrowLeft,
  X,
  Palette,
  Edit3,
} from 'lucide-react';

interface HomePageBuilderProps {
  sections: SectionBlock[];
  categories: Category[];
  collections: { id: number; name: string; slug: string }[];
  products: Product[];
}

const SECTION_PRESETS = [
  {
    type: 'curated_capsule',
    name: 'Curated / Seasonal Capsule',
    description: 'Highlight banner with badge, headline, and curated collection/category product carousel.',
    icon: Sparkles,
    badge: 'Popular',
    defaultSettings: {
      title: 'Summer Solstice Edition',
      subtitle: 'SUNLIT REFLECTIONS & WATERPROOF HEIRLOOMS',
      badge: 'SUMMER 2026 CAPSULE',
      description: 'A radiant curation of waterproof, anti-tarnish 18k solid gold vermeil designed to shine effortlessly.',
      category_slug: 'all',
      banner_image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
      button_text: 'Explore Summer Edit',
      button_link: '/shop',
      theme: 'gold',
    },
  },
  {
    type: 'hero_slider',
    name: 'Split Hero Slider',
    description: 'Full-bleed 50/50 split luxury slider with dual images, typography, and call-to-action buttons.',
    icon: Sliders,
    badge: 'Essential',
    defaultSettings: {
      slides: [
        {
          id: 1,
          subtitle: 'CAPTIVATING COLLECTION',
          title: 'Sculpted By Light',
          buttonText: 'Shop Collection',
          buttonLink: '/shop',
          showButton: true,
          enabled: true,
          badge: 'NEW 2026',
          leftImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
          rightImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1200&auto=format&fit=crop',
        },
        {
          id: 2,
          subtitle: '18K SOLID GOLD & VERMEIL',
          title: 'Modern Baroque Pearl Series',
          buttonText: 'Explore Pearls',
          buttonLink: '/shop?category=earrings',
          showButton: true,
          enabled: true,
          badge: 'HOT RELEASE',
          leftImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
          rightImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
        },
      ],
    },
  },
  {
    type: 'featured_products',
    name: 'Featured Products Slider',
    description: 'Interactive horizontal swipeable product slider showcasing handpicked masterpieces.',
    icon: ShoppingBag,
    defaultSettings: {
      title: 'Captivating Collection',
      subtitle: 'HANDCRAFTED 18K THICK SOLID GOLD VERMEIL',
      filter: 'featured',
      view_all_link: '/shop',
    },
  },
  {
    type: 'best_selling',
    name: 'Best Selling Products Grid',
    description: '4x2 clean grid of 8 products with interactive category filter tabs (Earrings, Necklaces, Rings, Bangles).',
    icon: Grid,
    defaultSettings: {
      title: 'Best Selling Products',
      subtitle: 'TIMELESS EVERYDAY LUXURY IN 18K GOLD VERMEIL',
      badge: 'MOST LOVED PIECES',
      view_all_link: '/shop',
      view_all_text: 'Explore Entire Collection',
    },
  },
  {
    type: 'category_slider',
    name: 'Shop By Category Track',
    description: 'Interactive category slider showcasing all store categories with product counts.',
    icon: Layers,
    defaultSettings: {
      title: 'Shop By Category',
      subtitle: 'EXPLORE TIMELESS CRAFTSMANSHIP',
    },
  },
  {
    type: 'dual_banners',
    name: 'Dual Promo Marketing Banners',
    description: 'Two side-by-side promotional campaign cards with customizable typography and CTA buttons.',
    icon: ImageIcon,
    defaultSettings: {
      banners: [
        {
          id: 1,
          subtitle: 'EPITOME OF REFINEMENT',
          title: 'Light The Wonders',
          description: "This season, the ordinary becomes extraordinary. Glozin's ambassadors open gates to wonder, where dreams come alive.",
          buttonText: 'Shop Now',
          buttonLink: '/shop',
          bgClass: 'bg-[#f4f4f4]',
          textColor: 'dark',
          align: 'center',
          enabled: true,
        },
        {
          id: 2,
          image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
          subtitle: 'HAARMONAA ICONIC',
          title: 'Sculpted Solid Gold Hoops',
          description: 'Timeless architectural curves crafted for effortless daily statement.',
          buttonText: 'Explore Hoops',
          buttonLink: '/shop?category=earrings',
          textColor: 'light',
          align: 'left',
          enabled: true,
        },
      ],
    },
  },
  {
    type: 'story_manifesto',
    name: 'Brand Story & Manifesto',
    description: 'Luxury editorial story section with high-res jewelry image, quote, vermeil seal, and brand story CTA.',
    icon: FileText,
    defaultSettings: {
      badge: 'THE HAARMONAA MANIFESTO',
      title: 'Sculpted for Everyday Splendor',
      subtitle: '18K SOLID GOLD VERMEIL & CONSCIOUS LUXURY',
      quote: '“Jewelry shouldn’t be reserved for special occasions. It should accompany every breath, sunlight glance, and spontaneous celebration of your life.”',
      body_text: 'At Haarmonaa, each jewel is meticulously electroplated with a lavish 2.5–3.0 micron layer of genuine 18K solid gold over premium 925 sterling silver — creating certified waterproof, anti-tarnish, and hypoallergenic masterpieces designed to endure forever.',
      signature_name: 'The Atelier Team',
      signature_title: 'Haarmonaa Fine Jewelry',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
      button_text: 'Read Brand Story',
      button_link: '/about-us',
    },
  },
  {
    type: 'trust_badges',
    name: 'Luxury Trust Badges',
    description: 'Value proposition cards (Free worldwide shipping, 18K vermeil warranty, 24/7 concierge, bespoke packaging).',
    icon: ShieldCheck,
    defaultSettings: {
      title: 'The Haarmonaa Promise',
      subtitle: 'CERTIFIED LUXURY EXPERIENCE & UNCOMPROMISING CRAFTSMANSHIP',
      features: [
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
      ],
    },
  },
  {
    type: 'faq_accordion',
    name: 'FAQ & Care Accordion',
    description: 'Expandable accordion questions and answers about materials, sizing, waterproof warranty, and shipping.',
    icon: HelpCircle,
    defaultSettings: {
      badge: 'CONCIERGE & ADVICE',
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about our craftsmanship, materials, and care.',
      items: [
        {
          id: 'faq_1',
          question: 'What is 18K Solid Gold Vermeil?',
          answer: 'Gold Vermeil is a premium technique requiring a thick minimum layer of 2.5 microns of real 18K solid gold over genuine 925 sterling silver.',
        },
        {
          id: 'faq_2',
          question: 'Is Haarmonaa jewelry 100% waterproof and sweatproof?',
          answer: 'Yes! All Haarmonaa jewelry is engineered with certified anti-tarnish sealing, making it completely waterproof and sweatproof.',
        },
        {
          id: 'faq_3',
          question: 'What is your shipping and return policy?',
          answer: 'We offer complimentary express shipping across India and a hassle-free 15-day return policy.',
        },
      ],
    },
  },
  {
    type: 'shop_by_gram',
    name: 'Shop By Gram (Instagram)',
    description: 'UGC social shopping grid displaying curated Instagram community photos.',
    icon: Camera,
    defaultSettings: {
      handle: '@haarmonaa',
      url: 'https://instagram.com/haarmonaa',
      posts: [
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
      ],
    },
  },
  {
    type: 'custom_html',
    name: 'Custom HTML / Embed Block',
    description: 'Raw HTML & CSS embed container for countdown timers, promotional codes, or custom marketing banners.',
    icon: Code,
    defaultSettings: {
      html_content: '<div class="text-center py-10 bg-amber-50/50 rounded-3xl border border-amber-200/50 p-6">\n  <span class="text-xs font-bold uppercase tracking-widest text-amber-800">VIP EXCLUSIVE PROMO</span>\n  <h3 class="text-2xl font-bold text-gray-900 mt-1">Get 15% Off Your First 18K Vermeil Order</h3>\n  <p class="text-xs text-gray-600 mt-1">Use coupon code <strong class="text-amber-900 bg-amber-100 px-2 py-0.5 rounded">VERMEIL15</strong> at checkout.</p>\n</div>',
      container_width: 'boxed',
      bg_color: '#ffffff',
      padding_y: 'medium',
    },
  },
];

export default function HomePageBuilder({
  sections: initialSections = [],
  categories = [],
  collections = [],
  products = [],
}: HomePageBuilderProps) {
  const [sections, setSections] = useState<SectionBlock[]>(initialSections);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    initialSections[0]?.id || null
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const activeSection = sections.find((s) => s.id === activeSectionId);
  const activeSectionIndex = sections.findIndex((s) => s.id === activeSectionId);

  // --- Drag & Drop Reordering ---
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSections = [...sections];
    const item = newSections.splice(draggedIndex, 1)[0];
    newSections.splice(index, 0, item);
    setDraggedIndex(index);
    setSections(newSections);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setSections(newSections);
  };

  // --- Section Actions ---
  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const duplicateSection = (index: number) => {
    const source = sections[index];
    const clone: SectionBlock = {
      ...JSON.parse(JSON.stringify(source)),
      id: `sec_${source.type}_${Date.now()}`,
      name: `${source.name} (Copy)`,
    };

    const updated = [...sections];
    updated.splice(index + 1, 0, clone);
    setSections(updated);
    setActiveSectionId(clone.id);
  };

  const deleteSection = (index: number) => {
    if (sections.length <= 1) {
      alert('You must have at least one section on your landing page.');
      return;
    }

    if (confirm(`Are you sure you want to delete "${sections[index].name}"?`)) {
      const updated = sections.filter((_, i) => i !== index);
      setSections(updated);
      if (activeSectionId === sections[index].id) {
        setActiveSectionId(updated[0]?.id || null);
      }
    }
  };

  const addSection = (preset: (typeof SECTION_PRESETS)[0]) => {
    const newSection: SectionBlock = {
      id: `sec_${preset.type}_${Date.now()}`,
      type: preset.type,
      name: preset.name,
      enabled: true,
      settings: JSON.parse(JSON.stringify(preset.defaultSettings)),
    };

    setSections((prev) => [...prev, newSection]);
    setActiveSectionId(newSection.id);
    setAddModalOpen(false);
  };

  const updateActiveSectionSettings = (newSettings: any) => {
    if (!activeSectionId) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === activeSectionId ? { ...s, settings: { ...s.settings, ...newSettings } } : s
      )
    );
  };

  const updateActiveSectionName = (name: string) => {
    if (!activeSectionId) return;
    setSections((prev) =>
      prev.map((s) => (s.id === activeSectionId ? { ...s, name } : s))
    );
  };

  // --- Save Handler ---
  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);

    router.post(
      '/admin/pages/home/builder',
      { sections },
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsSaving(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 4000);
        },
        onError: () => {
          setIsSaving(false);
          alert('Failed to save layout sections. Please verify all inputs.');
        },
      }
    );
  };

  const getSectionIcon = (type: string) => {
    const found = SECTION_PRESETS.find((p) => p.type === type);
    if (!found) return Layers;
    return found.icon;
  };

  return (
    <AdminLayout title="Landing Page Visual Section Builder">
      <Head title="Landing Page Builder — Admin" />

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span>Landing Page Visual Builder</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
                Modular CMS
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Drag, reorder, duplicate, and configure all live storefront sections.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* View Mode Toggle (Editor / Live Preview) */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'editor'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Live Preview
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors"
          >
            <span>Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer ${
              saveSuccess
                ? 'bg-emerald-600'
                : 'bg-[#111111] hover:bg-[#d0473e]'
            } disabled:opacity-50`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save All Sections'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Builder Canvas */}
      {viewMode === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
          {/* Left Column: Sections List & Hierarchy (4 Columns) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-900 tracking-tight">
                    Page Sections ({sections.length})
                  </h2>
                  <p className="text-[11px] text-gray-500">Drag to reorder section hierarchy</p>
                </div>

                <button
                  type="button"
                  onClick={() => setAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              {/* Sections Drag List */}
              <div className="space-y-2">
                {sections.map((sec, index) => {
                  const Icon = getSectionIcon(sec.type);
                  const isSelected = sec.id === activeSectionId;

                  return (
                    <div
                      key={sec.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setActiveSectionId(sec.id)}
                      className={`group relative rounded-xl border p-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/50 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                          : 'bg-white border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/50'
                      } ${!sec.enabled ? 'opacity-60 bg-gray-50' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        {/* Drag Handle & Icon */}
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-0.5">
                            <GripVertical className="w-4 h-4" />
                          </div>

                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-amber-500 text-white'
                                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate leading-tight">
                              {sec.name}
                            </p>
                            <p className="text-[10px] text-gray-500 font-mono capitalize">
                              {sec.type.replace('_', ' ')}
                            </p>
                          </div>
                        </div>

                        {/* Actions: Move, Toggle, Duplicate, Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            title="Move Up"
                            disabled={index === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(index, 'up');
                            }}
                            className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20 cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Move Down"
                            disabled={index === sections.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(index, 'down');
                            }}
                            className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20 cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title={sec.enabled ? 'Hide Section' : 'Show Section'}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSection(sec.id);
                            }}
                            className={`p-1 rounded cursor-pointer ${
                              sec.enabled ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            title="Duplicate Section"
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateSection(index);
                            }}
                            className="p-1 rounded text-gray-400 hover:text-amber-700 hover:bg-amber-50 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Delete Section"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSection(index);
                            }}
                            className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(true)}
                  className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 hover:border-amber-400 hover:bg-amber-50/40 text-gray-600 hover:text-amber-900 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Section</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Section Settings Inspector (8 Columns) */}
          <div className="lg:col-span-8">
            {activeSection ? (
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-6">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {activeSection.type.replace('_', ' ')}
                      </span>
                      {activeSection.enabled ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active Live
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={activeSection.name}
                        onChange={(e) => updateActiveSectionName(e.target.value)}
                        className="text-lg sm:text-xl font-extrabold text-gray-900 bg-transparent border-b border-dashed border-gray-300 hover:border-gray-500 focus:border-black focus:outline-hidden py-0.5"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <AdminToggle
                      label="Visible on Home"
                      checked={activeSection.enabled}
                      onChange={() => toggleSection(activeSection.id)}
                    />
                  </div>
                </div>

                {/* Section Specific Inspector Form */}
                {/* 1. Curated Capsule Form */}
                {activeSection.type === 'curated_capsule' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Capsule Headline (Title)
                        </label>
                        <input
                          type="text"
                          value={activeSection.settings?.title || ''}
                          onChange={(e) =>
                            updateActiveSectionSettings({ title: e.target.value })
                          }
                          placeholder="e.g. Summer Solstice Edition"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-1 focus:ring-black focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Sub-Headline / Tagline
                        </label>
                        <input
                          type="text"
                          value={activeSection.settings?.subtitle || ''}
                          onChange={(e) =>
                            updateActiveSectionSettings({ subtitle: e.target.value })
                          }
                          placeholder="e.g. SUNLIT REFLECTIONS & WATERPROOF HEIRLOOMS"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-1 focus:ring-black focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Editorial Badge
                        </label>
                        <input
                          type="text"
                          value={activeSection.settings?.badge || ''}
                          onChange={(e) =>
                            updateActiveSectionSettings({ badge: e.target.value })
                          }
                          placeholder="e.g. SUMMER 2026 CAPSULE"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-1 focus:ring-black focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Target Collection / Category
                        </label>
                        <select
                          value={activeSection.settings?.category_slug || 'all'}
                          onChange={(e) =>
                            updateActiveSectionSettings({ category_slug: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-1 focus:ring-black focus:border-black bg-white"
                        >
                          <option value="all">Featured Products (Automatic)</option>
                          <optgroup label="Collections">
                            {collections.map((coll) => (
                              <option key={`coll-${coll.id}`} value={coll.slug}>
                                Collection: {coll.name}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Categories">
                            {categories.map((cat) => (
                              <option key={`cat-${cat.id}`} value={cat.slug}>
                                Category: {cat.name}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Color Theme
                        </label>
                        <select
                          value={activeSection.settings?.theme || 'gold'}
                          onChange={(e) =>
                            updateActiveSectionSettings({ theme: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-1 focus:ring-black focus:border-black bg-white"
                        >
                          <option value="gold">Warm Gold Vermeil</option>
                          <option value="rose">Rose Gold Shimmer</option>
                          <option value="noir">Midnight Noir Luxury</option>
                          <option value="minimal">Clean Minimalist White</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Capsule Description & Story
                      </label>
                      <textarea
                        rows={3}
                        value={activeSection.settings?.description || ''}
                        onChange={(e) =>
                          updateActiveSectionSettings({ description: e.target.value })
                        }
                        placeholder="Detailed editorial story..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-1 focus:ring-black focus:border-black"
                      />
                    </div>

                    <div>
                      <SingleImageUploader
                        label="Highlight Banner Image"
                        value={activeSection.settings?.banner_image || ''}
                        onChange={(url) =>
                          updateActiveSectionSettings({ banner_image: url })
                        }
                        hint="Recommended: 1200x800px portrait or 4:5 luxury product photograph."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Button CTA Text
                        </label>
                        <input
                          type="text"
                          value={activeSection.settings?.button_text || ''}
                          onChange={(e) =>
                            updateActiveSectionSettings({ button_text: e.target.value })
                          }
                          placeholder="e.g. Explore Summer Edit"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-1 focus:ring-black focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Button Link
                        </label>
                        <input
                          type="text"
                          value={activeSection.settings?.button_link || ''}
                          onChange={(e) =>
                            updateActiveSectionSettings({ button_link: e.target.value })
                          }
                          placeholder="e.g. /shop?category=necklaces or /collection/summer-edit"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-1 focus:ring-black focus:border-black"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Hero Slider Form */}
                {activeSection.type === 'hero_slider' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Hero Slides ({(activeSection.settings?.slides || []).length})
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const current = activeSection.settings?.slides || [];
                          const newSlide = {
                            id: Date.now(),
                            subtitle: 'CAPTIVATING COLLECTION',
                            title: 'New Luxury Arrival',
                            buttonText: 'Shop Collection',
                            buttonLink: '/shop',
                            showButton: true,
                            enabled: true,
                            badge: 'NEW RELEASE',
                            leftImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop',
                            rightImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=1200&auto=format&fit=crop',
                          };
                          updateActiveSectionSettings({ slides: [...current, newSlide] });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Slide</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(activeSection.settings?.slides || []).map((slide: any, sIdx: number) => (
                        <div
                          key={slide.id || sIdx}
                          className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">
                              Slide #{sIdx + 1}: {slide.title || 'Untitled Slide'}
                            </span>
                            <div className="flex items-center gap-2">
                              <AdminToggle
                                label="Enabled"
                                checked={slide.enabled !== false}
                                onChange={() => {
                                  const slides = [...activeSection.settings.slides];
                                  slides[sIdx].enabled = !(slides[sIdx].enabled !== false);
                                  updateActiveSectionSettings({ slides });
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Delete this slide?')) {
                                    const slides = activeSection.settings.slides.filter((_: any, i: number) => i !== sIdx);
                                    updateActiveSectionSettings({ slides });
                                  }
                                }}
                                className="p-1 rounded text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input
                              type="text"
                              value={slide.badge || ''}
                              onChange={(e) => {
                                const slides = [...activeSection.settings.slides];
                                slides[sIdx].badge = e.target.value;
                                updateActiveSectionSettings({ slides });
                              }}
                              placeholder="Badge (e.g. NEW 2026)"
                              className="px-3 py-2 rounded-lg border border-gray-300 text-xs font-medium"
                            />
                            <input
                              type="text"
                              value={slide.subtitle || ''}
                              onChange={(e) => {
                                const slides = [...activeSection.settings.slides];
                                slides[sIdx].subtitle = e.target.value;
                                updateActiveSectionSettings({ slides });
                              }}
                              placeholder="Subtitle"
                              className="px-3 py-2 rounded-lg border border-gray-300 text-xs font-medium"
                            />
                            <input
                              type="text"
                              value={slide.title || ''}
                              onChange={(e) => {
                                const slides = [...activeSection.settings.slides];
                                slides[sIdx].title = e.target.value;
                                updateActiveSectionSettings({ slides });
                              }}
                              placeholder="Headline Title"
                              className="px-3 py-2 rounded-lg border border-gray-300 text-xs font-medium"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SingleImageUploader
                              label="Left Split Image"
                              value={slide.leftImage || ''}
                              onChange={(url) => {
                                const slides = [...activeSection.settings.slides];
                                slides[sIdx].leftImage = url;
                                updateActiveSectionSettings({ slides });
                              }}
                            />
                            <SingleImageUploader
                              label="Right Split Image"
                              value={slide.rightImage || ''}
                              onChange={(url) => {
                                const slides = [...activeSection.settings.slides];
                                slides[sIdx].rightImage = url;
                                updateActiveSectionSettings({ slides });
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={slide.buttonText || ''}
                              onChange={(e) => {
                                const slides = [...activeSection.settings.slides];
                                slides[sIdx].buttonText = e.target.value;
                                updateActiveSectionSettings({ slides });
                              }}
                              placeholder="Button Text (e.g. Shop Collection)"
                              className="px-3 py-2 rounded-lg border border-gray-300 text-xs font-medium"
                            />
                            <input
                              type="text"
                              value={slide.buttonLink || ''}
                              onChange={(e) => {
                                const slides = [...activeSection.settings.slides];
                                slides[sIdx].buttonLink = e.target.value;
                                updateActiveSectionSettings({ slides });
                              }}
                              placeholder="Button Link (e.g. /shop)"
                              className="px-3 py-2 rounded-lg border border-gray-300 text-xs font-medium"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Best Selling Grid Form */}
                {activeSection.type === 'best_selling' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={activeSection.settings?.title || ''}
                          onChange={(e) =>
                            updateActiveSectionSettings({ title: e.target.value })
                          }
                          placeholder="e.g. Best Selling Products"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          value={activeSection.settings?.badge || ''}
                          onChange={(e) =>
                            updateActiveSectionSettings({ badge: e.target.value })
                          }
                          placeholder="e.g. MOST LOVED PIECES"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={activeSection.settings?.subtitle || ''}
                        onChange={(e) =>
                          updateActiveSectionSettings({ subtitle: e.target.value })
                        }
                        placeholder="e.g. TIMELESS EVERYDAY LUXURY IN 18K GOLD VERMEIL"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Featured Products Slider Form */}
                {activeSection.type === 'featured_products' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={activeSection.settings?.title || ''}
                          onChange={(e) =>
                            updateActiveSectionSettings({ title: e.target.value })
                          }
                          placeholder="e.g. Captivating Collection"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={activeSection.settings?.subtitle || ''}
                          onChange={(e) =>
                            updateActiveSectionSettings({ subtitle: e.target.value })
                          }
                          placeholder="e.g. HANDCRAFTED 18K THICK SOLID GOLD VERMEIL"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Brand Manifesto Form */}
                {activeSection.type === 'story_manifesto' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Headline Title
                        </label>
                        <input
                          type="text"
                          value={activeSection.settings?.title || ''}
                          onChange={(e) =>
                            updateActiveSectionSettings({ title: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={activeSection.settings?.subtitle || ''}
                          onChange={(e) =>
                            updateActiveSectionSettings({ subtitle: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Featured Quote
                      </label>
                      <textarea
                        rows={2}
                        value={activeSection.settings?.quote || ''}
                        onChange={(e) =>
                          updateActiveSectionSettings({ quote: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <SingleImageUploader
                        label="Manifesto Editorial Photo"
                        value={activeSection.settings?.image || ''}
                        onChange={(url) =>
                          updateActiveSectionSettings({ image: url })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* 6. FAQ Accordion Form */}
                {activeSection.type === 'faq_accordion' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={activeSection.settings?.title || ''}
                          onChange={(e) =>
                            updateActiveSectionSettings({ title: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={activeSection.settings?.subtitle || ''}
                          onChange={(e) =>
                            updateActiveSectionSettings({ subtitle: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Questions & Answers ({(activeSection.settings?.items || []).length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const items = activeSection.settings?.items || [];
                            const newItem = {
                              id: `faq_${Date.now()}`,
                              question: 'New Question',
                              answer: 'Detailed helpful answer...',
                            };
                            updateActiveSectionSettings({ items: [...items, newItem] });
                          }}
                          className="text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200"
                        >
                          + Add FAQ
                        </button>
                      </div>

                      {(activeSection.settings?.items || []).map((faq: any, fIdx: number) => (
                        <div key={faq.id || fIdx} className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => {
                                const items = [...activeSection.settings.items];
                                items[fIdx].question = e.target.value;
                                updateActiveSectionSettings({ items });
                              }}
                              placeholder="Question"
                              className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const items = activeSection.settings.items.filter((_: any, i: number) => i !== fIdx);
                                updateActiveSectionSettings({ items });
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => {
                              const items = [...activeSection.settings.items];
                              items[fIdx].answer = e.target.value;
                              updateActiveSectionSettings({ items });
                            }}
                            placeholder="Answer"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. Custom HTML Block Form */}
                {activeSection.type === 'custom_html' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Container Width
                        </label>
                        <select
                          value={activeSection.settings?.container_width || 'boxed'}
                          onChange={(e) =>
                            updateActiveSectionSettings({ container_width: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-medium bg-white"
                        >
                          <option value="boxed">Boxed (Max 7xl Centered)</option>
                          <option value="full">Full Width Edge-to-Edge</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Background Color
                        </label>
                        <input
                          type="text"
                          value={activeSection.settings?.bg_color || '#ffffff'}
                          onChange={(e) =>
                            updateActiveSectionSettings({ bg_color: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-medium font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Vertical Padding
                        </label>
                        <select
                          value={activeSection.settings?.padding_y || 'medium'}
                          onChange={(e) =>
                            updateActiveSectionSettings({ padding_y: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-medium bg-white"
                        >
                          <option value="none">None (0px)</option>
                          <option value="small">Small (32px)</option>
                          <option value="medium">Medium (64px)</option>
                          <option value="large">Large (96px)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        HTML & CSS Code
                      </label>
                      <textarea
                        rows={8}
                        value={activeSection.settings?.html_content || ''}
                        onChange={(e) =>
                          updateActiveSectionSettings({ html_content: e.target.value })
                        }
                        placeholder="<div>Custom content...</div>"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono text-xs text-gray-800 bg-gray-900 text-emerald-400 focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-12 text-center">
                <p className="text-sm font-bold text-gray-900">No Section Selected</p>
                <p className="text-xs text-gray-500 mt-1">Select a section from the left sidebar to configure its properties.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Live Responsive Preview Mode */
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-xs max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                previewDevice === 'desktop'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                previewDevice === 'tablet'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet (768px)</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                previewDevice === 'mobile'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (375px)</span>
            </button>
          </div>

          {/* Preview Viewport Container */}
          <div className="flex justify-center bg-gray-100/80 p-4 sm:p-8 rounded-3xl border border-gray-200 min-h-[800px] overflow-x-auto">
            <div
              className={`transition-all duration-300 bg-white shadow-2xl overflow-hidden rounded-2xl ${
                previewDevice === 'desktop'
                  ? 'w-full max-w-7xl'
                  : previewDevice === 'tablet'
                  ? 'w-[768px]'
                  : 'w-[375px]'
              }`}
            >
              <SectionRenderer
                sections={sections}
                products={products}
                categories={categories}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add New Section Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                  Add New Landing Page Section
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Choose a luxury section preset to insert into your landing page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SECTION_PRESETS.map((preset) => {
                const Icon = preset.icon;
                return (
                  <div
                    key={preset.type}
                    onClick={() => addSection(preset)}
                    className="p-5 rounded-2xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        {preset.badge && (
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                            {preset.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-amber-900">
                        {preset.name}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center text-xs font-bold text-amber-800 group-hover:translate-x-1 transition-transform">
                      <span>+ Add to Page</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
