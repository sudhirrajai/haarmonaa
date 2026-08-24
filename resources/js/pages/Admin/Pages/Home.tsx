import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Category, Product } from '@/types/shop';
import { SingleImageUploader } from '@/components/admin/SingleImageUploader';
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
  ChevronRight,
  Settings,
  SlidersHorizontal,
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
    description: 'Highlight banner with title, badge, and curated collection/category product grid (e.g. Summer Edition, Festive Edit).',
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
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'tree' | 'add'>('tree');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  // --- Drag & Drop Reordering ---
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newSections = [...sections];
    const item = newSections.splice(draggedIndex, 1)[0];
    newSections.splice(index, 0, item);
    setSections(newSections);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
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
    setSelectedSectionId(clone.id);
  };

  const deleteSection = (index: number) => {
    if (sections.length <= 1) {
      alert('You must have at least one section on your landing page.');
      return;
    }

    if (confirm(`Are you sure you want to delete "${sections[index].name}"?`)) {
      const updated = sections.filter((_, i) => i !== index);
      setSections(updated);
      if (selectedSectionId === sections[index].id) {
        setSelectedSectionId(null);
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
    setSelectedSectionId(newSection.id);
    setSidebarTab('tree');
  };

  const updateSelectedSectionSettings = (newSettings: any) => {
    if (!selectedSectionId) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === selectedSectionId ? { ...s, settings: { ...s.settings, ...newSettings } } : s
      )
    );
  };

  const updateSelectedSectionName = (name: string) => {
    if (!selectedSectionId) return;
    setSections((prev) =>
      prev.map((s) => (s.id === selectedSectionId ? { ...s, name } : s))
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
          alert('Failed to save layout sections. Please check inputs.');
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
    <AdminLayout title="Theme Customizer — Landing Page Builder">
      <Head title="Theme Customizer — Haarmonaa" />

      {/* Top Customizer Bar */}
      <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600"
            title="Back to Pages"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span>Homepage Theme Customizer</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
                Live Drag & Drop
              </span>
            </h1>
          </div>
        </div>

        {/* Center Viewport Switcher */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setPreviewDevice('desktop')}
            title="Desktop View (100%)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewDevice === 'desktop'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice('tablet')}
            title="Tablet View (768px)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewDevice === 'tablet'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice('mobile')}
            title="Mobile Phone View (375px)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewDevice === 'mobile'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors"
          >
            <span className="hidden sm:inline">View Store</span>
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
                <span>{isSaving ? 'Saving...' : 'Save Live'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Split Screen: Left Sidebar + Right Live Preview Canvas (Shopify Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT SIDEBAR (Shopify Customizer Tree & Inspector) */}
        <div className="lg:col-span-4 xl:col-span-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[calc(100vh-140px)] sticky top-4 overflow-hidden">
          {/* If a section is selected, show its dedicated Inspector Panel */}
          {selectedSection ? (
            <div className="flex flex-col h-full">
              {/* Inspector Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                <button
                  type="button"
                  onClick={() => setSelectedSectionId(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-black transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>All Sections</span>
                </button>

                <div className="flex items-center gap-2">
                  <AdminToggle
                    label="Visible"
                    checked={selectedSection.enabled}
                    onChange={() => toggleSection(selectedSection.id)}
                  />
                </div>
              </div>

              {/* Inspector Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Section Name (Admin Label)
                  </label>
                  <input
                    type="text"
                    value={selectedSection.name}
                    onChange={(e) => updateSelectedSectionName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>

                {/* Specific Form Fields */}
                {selectedSection.type === 'curated_capsule' && (
                  <div className="space-y-4 pt-2 border-t border-gray-100">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Capsule Headline (Title)
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.title || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ title: e.target.value })
                        }
                        placeholder="e.g. Summer Solstice Edition"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Tagline / Sub-Headline
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.subtitle || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ subtitle: e.target.value })
                        }
                        placeholder="e.g. SUNLIT REFLECTIONS & HEIRLOOMS"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          value={selectedSection.settings?.badge || ''}
                          onChange={(e) =>
                            updateSelectedSectionSettings({ badge: e.target.value })
                          }
                          placeholder="e.g. SUMMER CAPSULE"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Theme Styling
                        </label>
                        <select
                          value={selectedSection.settings?.theme || 'gold'}
                          onChange={(e) =>
                            updateSelectedSectionSettings({ theme: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium bg-white"
                        >
                          <option value="gold">Warm Gold</option>
                          <option value="rose">Rose Gold</option>
                          <option value="noir">Midnight Noir</option>
                          <option value="minimal">Clean White</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Target Collection / Category
                      </label>
                      <select
                        value={selectedSection.settings?.category_slug || 'all'}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ category_slug: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium bg-white"
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
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Editorial Description
                      </label>
                      <textarea
                        rows={3}
                        value={selectedSection.settings?.description || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ description: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <SingleImageUploader
                        label="Highlight Banner Image"
                        value={selectedSection.settings?.banner_image || ''}
                        onChange={(url) =>
                          updateSelectedSectionSettings({ banner_image: url })
                        }
                        hint="Recommended: 1200x800px luxury photograph."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={selectedSection.settings?.button_text || ''}
                          onChange={(e) =>
                            updateSelectedSectionSettings({ button_text: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Button Link
                        </label>
                        <input
                          type="text"
                          value={selectedSection.settings?.button_link || ''}
                          onChange={(e) =>
                            updateSelectedSectionSettings({ button_link: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Hero Slider Settings */}
                {selectedSection.type === 'hero_slider' && (
                  <div className="space-y-4 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">
                        Slides ({(selectedSection.settings?.slides || []).length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const current = selectedSection.settings?.slides || [];
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
                          updateSelectedSectionSettings({ slides: [...current, newSlide] });
                        }}
                        className="text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 cursor-pointer"
                      >
                        + Add Slide
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(selectedSection.settings?.slides || []).map((slide: any, sIdx: number) => (
                        <div key={slide.id || sIdx} className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">Slide #{sIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const slides = selectedSection.settings.slides.filter((_: any, i: number) => i !== sIdx);
                                updateSelectedSectionSettings({ slides });
                              }}
                              className="text-red-500 hover:bg-red-50 p-1 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={slide.title || ''}
                            onChange={(e) => {
                              const slides = [...selectedSection.settings.slides];
                              slides[sIdx].title = e.target.value;
                              updateSelectedSectionSettings({ slides });
                            }}
                            placeholder="Headline Title"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={slide.subtitle || ''}
                            onChange={(e) => {
                              const slides = [...selectedSection.settings.slides];
                              slides[sIdx].subtitle = e.target.value;
                              updateSelectedSectionSettings({ slides });
                            }}
                            placeholder="Subtitle"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                          />
                          <SingleImageUploader
                            label="Left Image"
                            value={slide.leftImage || ''}
                            onChange={(url) => {
                              const slides = [...selectedSection.settings.slides];
                              slides[sIdx].leftImage = url;
                              updateSelectedSectionSettings({ slides });
                            }}
                          />
                          <SingleImageUploader
                            label="Right Image"
                            value={slide.rightImage || ''}
                            onChange={(url) => {
                              const slides = [...selectedSection.settings.slides];
                              slides[sIdx].rightImage = url;
                              updateSelectedSectionSettings({ slides });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Best Selling Settings */}
                {selectedSection.type === 'best_selling' && (
                  <div className="space-y-4 pt-2 border-t border-gray-100">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.title || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.subtitle || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ subtitle: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* Featured Products Settings */}
                {selectedSection.type === 'featured_products' && (
                  <div className="space-y-4 pt-2 border-t border-gray-100">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.title || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.subtitle || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ subtitle: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* Custom HTML Settings */}
                {selectedSection.type === 'custom_html' && (
                  <div className="space-y-4 pt-2 border-t border-gray-100">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        HTML & CSS Content
                      </label>
                      <textarea
                        rows={7}
                        value={selectedSection.settings?.html_content || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ html_content: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs text-emerald-400 bg-gray-900"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Sidebar Main Tabs: Sections Tree vs Presets Library */
            <div className="flex flex-col h-full">
              {/* Tab Switcher */}
              <div className="flex border-b border-gray-200 bg-gray-50/70 p-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSidebarTab('tree')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sidebarTab === 'tree'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Sections ({sections.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTab('add')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    sidebarTab === 'add'
                      ? 'bg-amber-50 text-amber-900 border border-amber-200 shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              {/* Tab 1: Sections Tree with Real Drag & Drop */}
              {sidebarTab === 'tree' ? (
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  <p className="text-[11px] font-semibold text-gray-500 px-1">
                    Drag handles to reorder sections. Click to edit settings.
                  </p>

                  {sections.map((sec, index) => {
                    const Icon = getSectionIcon(sec.type);
                    const isDragOver = dragOverIndex === index;

                    return (
                      <div
                        key={sec.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={() => handleDrop(index)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedSectionId(sec.id)}
                        className={`group relative rounded-xl border p-3 transition-all cursor-pointer ${
                          isDragOver ? 'border-amber-500 bg-amber-50/60 shadow-md ring-2 ring-amber-400' : 'bg-white border-gray-200/90 hover:border-gray-300 hover:bg-gray-50/60'
                        } ${!sec.enabled ? 'opacity-60 bg-gray-50' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700 p-0.5">
                              <GripVertical className="w-4 h-4" />
                            </div>

                            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate leading-tight group-hover:text-amber-900">
                                {sec.name}
                              </p>
                              <p className="text-[10px] text-gray-400 font-mono capitalize truncate">
                                {sec.type.replace('_', ' ')}
                              </p>
                            </div>
                          </div>

                          {/* Quick Controls */}
                          <div className="flex items-center gap-1 shrink-0">
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
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Tab 2: Add Section Presets Catalog */
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  <p className="text-[11px] font-semibold text-gray-500 px-1">
                    Select a section preset to add to your landing page:
                  </p>
                  {SECTION_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    return (
                      <div
                        key={preset.type}
                        onClick={() => addSection(preset)}
                        className="p-3.5 rounded-xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50/40 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 group-hover:text-amber-900 truncate">
                              {preset.name}
                            </h4>
                            <p className="text-[10px] text-gray-500 line-clamp-1 leading-tight">
                              {preset.description}
                            </p>
                          </div>
                        </div>
                        <Plus className="w-4 h-4 text-amber-800 shrink-0 group-hover:scale-120 transition-transform" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT LIVE PREVIEW CANVAS (Live Dynamic Storefront) */}
        <div className="lg:col-span-8 xl:col-span-8 flex justify-center bg-gray-100/70 p-3 sm:p-6 rounded-2xl border border-gray-200/80 min-h-[calc(100vh-140px)] overflow-x-auto">
          <div
            className={`transition-all duration-300 bg-white shadow-xl overflow-hidden rounded-2xl border border-gray-200/60 ${
              previewDevice === 'desktop'
                ? 'w-full'
                : previewDevice === 'tablet'
                ? 'w-[768px] max-w-full'
                : 'w-[375px] max-w-full'
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
    </AdminLayout>
  );
}
