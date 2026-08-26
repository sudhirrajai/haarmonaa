import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
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
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface HomePageBuilderProps {
  sections: SectionBlock[];
  categories: Category[];
  collections: { id: number; name: string; slug: string }[];
  products: Product[];
}

const SECTION_PRESETS = [
  {
    type: 'hero_slider',
    name: 'Split Hero Slider',
    description: 'Full-bleed luxury hero slider with typography, badges, and dual image split.',
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
    type: 'curated_capsule',
    name: 'Curated / Seasonal Capsule',
    description: 'Highlight banner with title, badge, and curated collection/category product grid (e.g. Summer Edition, Festive Edit).',
    icon: Sparkles,
    badge: 'Popular',
    defaultSettings: {
      title: 'Summer Solstice Edition',
      subtitle: 'SUNLIT REFLECTIONS & WATERPROOF HEIRLOOMS',
      badge: 'SUMMER 2026 CAPSULE',
      description: 'A radiant curation of waterproof, anti-tarnish 18k solid gold vermeil designed to shine effortlessly through beach sun, ocean mist, and sunset soirees.',
      category_slug: 'all',
      banner_image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
      button_text: 'Explore Summer Edit',
      button_link: '/shop',
      theme: 'gold',
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [hasChanges, setHasChanges] = useState(false);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  // --- Select & Scroll to Section ---
  const handleSelectSection = (id: string | null) => {
    setSelectedSectionId(id);
    if (id) {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    }
  };

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
    setHasChanges(true);
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
    setHasChanges(true);
  };

  // --- Section Actions ---
  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    setHasChanges(true);
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
    handleSelectSection(clone.id);
    setHasChanges(true);
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
      setHasChanges(true);
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
    handleSelectSection(newSection.id);
    setSidebarTab('tree');
    setHasChanges(true);
  };

  const updateSelectedSectionSettings = (newSettings: any) => {
    if (!selectedSectionId) return;
    setSections((prev) =>
      prev.map((s) =>
        s.id === selectedSectionId ? { ...s, settings: { ...(s.settings || {}), ...newSettings } } : s
      )
    );
    setHasChanges(true);
  };

  const updateSelectedSectionName = (name: string) => {
    if (!selectedSectionId) return;
    setSections((prev) =>
      prev.map((s) => (s.id === selectedSectionId ? { ...s, name } : s))
    );
    setHasChanges(true);
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
          setHasChanges(false);
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
    <div className="h-screen w-screen flex flex-col bg-[#0b0d13] text-gray-100 overflow-hidden font-sans">
      <Head title="Theme Customizer — Haarmonaa Fine Jewelry" />

      {/* TOP HEADER (Shopify Chrome Toolbar) */}
      <header className="h-14 bg-[#161922] border-b border-gray-800 px-4 flex items-center justify-between shrink-0 z-30 shadow-sm">
        {/* Left Side: Exit Link & Toggle Sidebar */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition-colors border border-gray-700/60"
            title="Exit to Pages List"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </Link>

          <div className="h-4 w-px bg-gray-700 mx-1 hidden sm:block" />

          {/* Toggle Sidebar Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              sidebarOpen
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700/60'
            }`}
            title={sidebarOpen ? 'Collapse Left Sidebar' : 'Open Left Sidebar'}
          >
            {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          {/* Page Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-tight">Homepage Customizer</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-widest">
              Live Canvas
            </span>
          </div>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="flex items-center bg-[#0e1017] p-1 rounded-xl border border-gray-800 shadow-inner">
          <button
            type="button"
            onClick={() => setPreviewDevice('desktop')}
            title="Desktop View (Full Width)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewDevice === 'desktop'
                ? 'bg-gray-800 text-white shadow-sm ring-1 ring-gray-700'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice('tablet')}
            title="Tablet View (768px)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewDevice === 'tablet'
                ? 'bg-gray-800 text-white shadow-sm ring-1 ring-gray-700'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet (768px)</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice('mobile')}
            title="Mobile Phone View (375px)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              previewDevice === 'mobile'
                ? 'bg-gray-800 text-white shadow-sm ring-1 ring-gray-700'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile (375px)</span>
          </button>
        </div>

        {/* Right Side: View Store Link & Save Live Button */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-700"
          >
            <span className="hidden sm:inline">View Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-5 py-1.5 rounded-xl text-xs font-bold text-white transition-all shadow-md cursor-pointer ${
              saveSuccess
                ? 'bg-emerald-600'
                : hasChanges
                ? 'bg-amber-600 hover:bg-amber-500 ring-2 ring-amber-400/50'
                : 'bg-white/15 hover:bg-white/25 text-white'
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
                <span>{isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* BODY (Split Customizer Workspace) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT SIDEBAR (Hierarchy List + Complete Section Inspector) */}
        <aside
          className={`h-full bg-[#161922] border-r border-gray-800 transition-all duration-300 flex flex-col shrink-0 z-20 ${
            sidebarOpen ? 'w-[370px] sm:w-[400px]' : 'w-0 -translate-x-full overflow-hidden border-none'
          }`}
        >
          {/* Section Inspector Mode */}
          {selectedSection ? (
            <div className="flex flex-col h-full bg-[#161922]">
              {/* Header */}
              <div className="p-3.5 border-b border-gray-800 flex items-center justify-between bg-[#12141c]">
                <button
                  type="button"
                  onClick={() => handleSelectSection(null)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
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

              {/* Inspector Form */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-gray-200">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Section Name (Admin Label)
                  </label>
                  <input
                    type="text"
                    value={selectedSection.name}
                    onChange={(e) => updateSelectedSectionName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-bold text-white focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                {/* 1. CURATED CAPSULE INSPECTOR */}
                {selectedSection.type === 'curated_capsule' && (
                  <div className="space-y-4 pt-2 border-t border-gray-800">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Capsule Headline (Title)
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.title || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ title: e.target.value })
                        }
                        placeholder="e.g. Summer Solstice Edition"
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white focus:ring-1 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Tagline / Sub-Headline
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.subtitle || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ subtitle: e.target.value })
                        }
                        placeholder="e.g. SUNLIT REFLECTIONS & HEIRLOOMS"
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white focus:ring-1 focus:ring-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          value={selectedSection.settings?.badge || ''}
                          onChange={(e) =>
                            updateSelectedSectionSettings({ badge: e.target.value })
                          }
                          placeholder="e.g. SUMMER CAPSULE"
                          className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                          Theme Styling
                        </label>
                        <select
                          value={selectedSection.settings?.theme || 'gold'}
                          onChange={(e) =>
                            updateSelectedSectionSettings({ theme: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                        >
                          <option value="gold">Warm Gold</option>
                          <option value="rose">Rose Gold</option>
                          <option value="noir">Midnight Noir</option>
                          <option value="minimal">Clean White</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Target Collection / Category
                      </label>
                      <select
                        value={selectedSection.settings?.category_slug || 'all'}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ category_slug: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
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
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Editorial Description
                      </label>
                      <textarea
                        rows={3}
                        value={selectedSection.settings?.description || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ description: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>

                    <div>
                      <SingleImageUploader
                        label="Highlight Banner Image"
                        value={selectedSection.settings?.banner_image || ''}
                        onChange={(url) =>
                          updateSelectedSectionSettings({ banner_image: url })
                        }
                        hint="Recommended: 1200x800px portrait photograph."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={selectedSection.settings?.button_text || ''}
                          onChange={(e) =>
                            updateSelectedSectionSettings({ button_text: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                          Button Link
                        </label>
                        <input
                          type="text"
                          value={selectedSection.settings?.button_link || ''}
                          onChange={(e) =>
                            updateSelectedSectionSettings({ button_link: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. HERO SLIDER INSPECTOR */}
                {selectedSection.type === 'hero_slider' && (
                  <div className="space-y-4 pt-2 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
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
                        className="text-xs font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 px-2.5 py-1 rounded-lg border border-amber-500/40 cursor-pointer"
                      >
                        + Add Slide
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(selectedSection.settings?.slides || []).map((slide: any, sIdx: number) => (
                        <div key={slide.id || sIdx} className="p-3 rounded-xl border border-gray-800 bg-gray-900/60 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-200">Slide #{sIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const slides = selectedSection.settings.slides.filter((_: any, i: number) => i !== sIdx);
                                updateSelectedSectionSettings({ slides });
                              }}
                              className="text-red-400 hover:bg-red-500/20 p-1 rounded cursor-pointer"
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
                            className="w-full px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs font-bold text-white"
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
                            className="w-full px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-white"
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

                {/* 3. BEST SELLING INSPECTOR */}
                {selectedSection.type === 'best_selling' && (
                  <div className="space-y-4 pt-2 border-t border-gray-800">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.title || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.subtitle || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ subtitle: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Badge Label
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.badge || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ badge: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                  </div>
                )}

                {/* 4. LUXURY TRUST BADGES INSPECTOR */}
                {selectedSection.type === 'trust_badges' && (
                  <div className="space-y-4 pt-2 border-t border-gray-800">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Headline Title
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.title || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ title: e.target.value })
                        }
                        placeholder="e.g. The Haarmonaa Promise"
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.subtitle || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ subtitle: e.target.value })
                        }
                        placeholder="e.g. CERTIFIED LUXURY EXPERIENCE"
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>

                    {/* Layout Mode: Grid vs Carousel */}
                    <div className="p-3 rounded-xl bg-gray-900/90 border border-gray-800 space-y-3">
                      <span className="text-[11px] font-bold text-amber-300 block uppercase tracking-wider">
                        Layout & Responsive Grid
                      </span>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Display Mode
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => updateSelectedSectionSettings({ layout: 'grid' })}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              (selectedSection.settings?.layout || 'grid') === 'grid'
                                ? 'bg-amber-500 text-black shadow-sm'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                          >
                            Grid Layout
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSelectedSectionSettings({ layout: 'carousel' })}
                            className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              selectedSection.settings?.layout === 'carousel'
                                ? 'bg-amber-500 text-black shadow-sm'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                          >
                            Carousel Slider
                          </button>
                        </div>
                      </div>

                      {/* 3-Device Columns Selector */}
                      {(selectedSection.settings?.layout || 'grid') === 'grid' && (
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <div>
                            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                              Desktop Cols
                            </label>
                            <select
                              value={selectedSection.settings?.columns_desktop || 4}
                              onChange={(e) =>
                                updateSelectedSectionSettings({
                                  columns_desktop: Number(e.target.value),
                                })
                              }
                              className="w-full px-2 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs font-bold text-white"
                            >
                              <option value="1">1 Col</option>
                              <option value="2">2 Cols</option>
                              <option value="3">3 Cols</option>
                              <option value="4">4 Cols</option>
                              <option value="5">5 Cols</option>
                              <option value="6">6 Cols</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                              Tablet Cols
                            </label>
                            <select
                              value={selectedSection.settings?.columns_tablet || 2}
                              onChange={(e) =>
                                updateSelectedSectionSettings({
                                  columns_tablet: Number(e.target.value),
                                })
                              }
                              className="w-full px-2 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs font-bold text-white"
                            >
                              <option value="1">1 Col</option>
                              <option value="2">2 Cols</option>
                              <option value="3">3 Cols</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                              Mobile Cols
                            </label>
                            <select
                              value={selectedSection.settings?.columns_mobile || 1}
                              onChange={(e) =>
                                updateSelectedSectionSettings({
                                  columns_mobile: Number(e.target.value),
                                })
                              }
                              className="w-full px-2 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs font-bold text-white"
                            >
                              <option value="1">1 Col</option>
                              <option value="2">2 Cols</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Trust Cards with Icon Selector & Custom Icon */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Trust Cards ({(selectedSection.settings?.features || []).length})</span>
                        <button
                          type="button"
                          onClick={() => {
                            const current = selectedSection.settings?.features || [];
                            const newCard = {
                              id: `feat_${Date.now()}`,
                              icon: 'ShieldCheck',
                              title: 'New Guarantee',
                              description: 'Description of your guarantee or promise to the customer.',
                            };
                            updateSelectedSectionSettings({ features: [...current, newCard] });
                          }}
                          className="text-xs font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 px-2 py-1 rounded-lg border border-amber-500/40 cursor-pointer"
                        >
                          + Add Card
                        </button>
                      </div>

                      {(selectedSection.settings?.features || []).map((feat: any, fIdx: number) => (
                        <div key={feat.id || fIdx} className="p-3 rounded-xl border border-gray-800 bg-gray-900/60 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-300">Card #{fIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const features = selectedSection.settings.features.filter((_: any, i: number) => i !== fIdx);
                                updateSelectedSectionSettings({ features });
                              }}
                              className="text-red-400 hover:bg-red-500/20 p-1 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Icon Picker Dropdown */}
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                              Card Icon
                            </label>
                            <select
                              value={feat.icon || 'ShieldCheck'}
                              onChange={(e) => {
                                const features = [...selectedSection.settings.features];
                                features[fIdx].icon = e.target.value;
                                updateSelectedSectionSettings({ features });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs font-bold text-white"
                            >
                              <option value="Package">📦 Package / Shipping Box</option>
                              <option value="Truck">🚚 Truck / Express Delivery</option>
                              <option value="ShieldCheck">🛡️ ShieldCheck / Guarantee</option>
                              <option value="Gem">💎 Gem / Diamond Masterpiece</option>
                              <option value="Award">🏆 Award / Certified Premium</option>
                              <option value="RotateCcw">🔄 RotateCcw / Free Returns</option>
                              <option value="MessageSquareText">💬 MessageSquareText / Support</option>
                              <option value="Headphones">🎧 Headphones / Concierge</option>
                              <option value="Phone">📞 Phone / 24/7 Call</option>
                              <option value="Gift">🎁 Gift / Bespoke Box</option>
                              <option value="Sparkles">✨ Sparkles / Pure Lustre</option>
                              <option value="Zap">⚡ Zap / Fast Dispatch</option>
                              <option value="Heart">❤️ Heart / Handcrafted with Love</option>
                              <option value="Clock">⏰ Clock / 24/7 Service</option>
                              <option value="Lock">🔒 Lock / Secure 256-bit Payment</option>
                              <option value="Star">⭐ Star / 5-Star Luxury Rating</option>
                              <option value="Smile">😊 Smile / 100% Satisfaction</option>
                              <option value="ThumbsUp">👍 ThumbsUp / Trusted Quality</option>
                              <option value="RefreshCw">🔁 RefreshCw / Lifetime Exchange</option>
                              <option value="CheckCircle2">✅ CheckCircle / Verified Authentic</option>
                            </select>
                          </div>

                          <input
                            type="text"
                            value={feat.title || ''}
                            onChange={(e) => {
                              const features = [...selectedSection.settings.features];
                              features[fIdx].title = e.target.value;
                              updateSelectedSectionSettings({ features });
                            }}
                            placeholder="Card Title (e.g. Free Shipping)"
                            className="w-full px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs font-bold text-white"
                          />
                          <textarea
                            rows={2}
                            value={feat.description || ''}
                            onChange={(e) => {
                              const features = [...selectedSection.settings.features];
                              features[fIdx].description = e.target.value;
                              updateSelectedSectionSettings({ features });
                            }}
                            placeholder="Card Description"
                            className="w-full px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-white"
                          />

                          {/* Custom Image Icon Option */}
                          <SingleImageUploader
                            label="Custom Icon Image (Optional)"
                            value={feat.custom_icon || ''}
                            onChange={(url) => {
                              const features = [...selectedSection.settings.features];
                              features[fIdx].custom_icon = url;
                              updateSelectedSectionSettings({ features });
                            }}
                            hint="Upload SVG or PNG to replace standard icon."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. SHOP BY GRAM INSPECTOR */}
                {selectedSection.type === 'shop_by_gram' && (
                  <div className="space-y-4 pt-2 border-t border-gray-800">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.handle || '@haarmonaa'}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ handle: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Instagram Profile URL
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.url || 'https://instagram.com/haarmonaa'}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ url: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                  </div>
                )}

                {/* 6. CATEGORY SLIDER INSPECTOR */}
                {selectedSection.type === 'category_slider' && (
                  <div className="space-y-4 pt-2 border-t border-gray-800">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.title || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.subtitle || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ subtitle: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                  </div>
                )}

                {/* 7. FEATURED PRODUCTS INSPECTOR */}
                {selectedSection.type === 'featured_products' && (
                  <div className="space-y-4 pt-2 border-t border-gray-800">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.title || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.subtitle || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ subtitle: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                  </div>
                )}

                {/* 8. DUAL PROMO BANNERS INSPECTOR */}
                {selectedSection.type === 'dual_banners' && (
                  <div className="space-y-4 pt-2 border-t border-gray-800">
                    <span className="text-xs font-bold text-white block">Banner Cards (2)</span>
                    {(selectedSection.settings?.banners || []).map((banner: any, bIdx: number) => (
                      <div key={banner.id || bIdx} className="p-3 rounded-xl border border-gray-800 bg-gray-900/60 space-y-2.5">
                        <span className="text-xs font-bold text-amber-300">Banner #{bIdx + 1}</span>
                        <input
                          type="text"
                          value={banner.title || ''}
                          onChange={(e) => {
                            const banners = [...(selectedSection.settings.banners || [])];
                            banners[bIdx].title = e.target.value;
                            updateSelectedSectionSettings({ banners });
                          }}
                          placeholder="Banner Headline Title"
                          className="w-full px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs font-bold text-white"
                        />
                        <input
                          type="text"
                          value={banner.subtitle || ''}
                          onChange={(e) => {
                            const banners = [...(selectedSection.settings.banners || [])];
                            banners[bIdx].subtitle = e.target.value;
                            updateSelectedSectionSettings({ banners });
                          }}
                          placeholder="Subtitle / Badge"
                          className="w-full px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-white"
                        />
                        <textarea
                          rows={2}
                          value={banner.description || ''}
                          onChange={(e) => {
                            const banners = [...(selectedSection.settings.banners || [])];
                            banners[bIdx].description = e.target.value;
                            updateSelectedSectionSettings({ banners });
                          }}
                          placeholder="Description"
                          className="w-full px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-white"
                        />
                        <SingleImageUploader
                          label="Banner Background Image (Optional)"
                          value={banner.image || ''}
                          onChange={(url) => {
                            const banners = [...(selectedSection.settings.banners || [])];
                            banners[bIdx].image = url;
                            updateSelectedSectionSettings({ banners });
                          }}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={banner.buttonText || ''}
                            onChange={(e) => {
                              const banners = [...(selectedSection.settings.banners || [])];
                              banners[bIdx].buttonText = e.target.value;
                              updateSelectedSectionSettings({ banners });
                            }}
                            placeholder="Button Text"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={banner.buttonLink || ''}
                            onChange={(e) => {
                              const banners = [...(selectedSection.settings.banners || [])];
                              banners[bIdx].buttonLink = e.target.value;
                              updateSelectedSectionSettings({ banners });
                            }}
                            placeholder="Button Link"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 9. BRAND STORY MANIFESTO INSPECTOR */}
                {selectedSection.type === 'story_manifesto' && (
                  <div className="space-y-4 pt-2 border-t border-gray-800">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Headline Title
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.title || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Badge Label
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.badge || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ badge: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Featured Quote
                      </label>
                      <textarea
                        rows={3}
                        value={selectedSection.settings?.quote || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ quote: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Story Body Text
                      </label>
                      <textarea
                        rows={4}
                        value={selectedSection.settings?.body_text || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ body_text: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                    <SingleImageUploader
                      label="Editorial Photograph"
                      value={selectedSection.settings?.image || ''}
                      onChange={(url) =>
                        updateSelectedSectionSettings({ image: url })
                      }
                    />
                  </div>
                )}

                {/* 10. FAQ ACCORDION INSPECTOR */}
                {selectedSection.type === 'faq_accordion' && (
                  <div className="space-y-4 pt-2 border-t border-gray-800">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Headline Title
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.title || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={selectedSection.settings?.subtitle || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ subtitle: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-xs font-medium text-white"
                      />
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Questions ({(selectedSection.settings?.items || []).length})</span>
                        <button
                          type="button"
                          onClick={() => {
                            const current = selectedSection.settings?.items || [];
                            const newItem = {
                              id: `faq_${Date.now()}`,
                              question: 'New Question',
                              answer: 'Answer to the question.',
                            };
                            updateSelectedSectionSettings({ items: [...current, newItem] });
                          }}
                          className="text-xs font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 px-2 py-1 rounded-lg border border-amber-500/40 cursor-pointer"
                        >
                          + Add FAQ
                        </button>
                      </div>
                      {(selectedSection.settings?.items || []).map((faq: any, idx: number) => (
                        <div key={faq.id || idx} className="p-3 rounded-xl border border-gray-800 bg-gray-900/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-300">FAQ #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const items = selectedSection.settings.items.filter((_: any, i: number) => i !== idx);
                                updateSelectedSectionSettings({ items });
                              }}
                              className="text-red-400 hover:bg-red-500/20 p-1 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={faq.question || ''}
                            onChange={(e) => {
                              const items = [...selectedSection.settings.items];
                              items[idx].question = e.target.value;
                              updateSelectedSectionSettings({ items });
                            }}
                            placeholder="Question"
                            className="w-full px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs font-bold text-white"
                          />
                          <textarea
                            rows={2}
                            value={faq.answer || ''}
                            onChange={(e) => {
                              const items = [...selectedSection.settings.items];
                              items[idx].answer = e.target.value;
                              updateSelectedSectionSettings({ items });
                            }}
                            placeholder="Answer"
                            className="w-full px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 11. CUSTOM HTML INSPECTOR */}
                {selectedSection.type === 'custom_html' && (
                  <div className="space-y-4 pt-2 border-t border-gray-800">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        HTML & CSS Content
                      </label>
                      <textarea
                        rows={7}
                        value={selectedSection.settings?.html_content || ''}
                        onChange={(e) =>
                          updateSelectedSectionSettings({ html_content: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-700 font-mono text-xs text-emerald-400 bg-gray-900"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Sidebar Main Hierarchy List + Add Section Tab */
            <div className="flex flex-col h-full">
              {/* Tab Switcher */}
              <div className="flex border-b border-gray-800 bg-[#12141c] p-2 gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setSidebarTab('tree')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sidebarTab === 'tree'
                      ? 'bg-gray-800 text-white shadow-xs'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sections ({sections.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTab('add')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    sidebarTab === 'add'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              {/* Sections Tree List with Move Up/Down and Drag Handles */}
              {sidebarTab === 'tree' ? (
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  <p className="text-[10px] font-semibold text-gray-400 px-1 uppercase tracking-wider">
                    Click section to edit. Use ▲▼ to reorder.
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
                        onClick={() => handleSelectSection(sec.id)}
                        className={`group relative rounded-xl border p-2.5 transition-all cursor-pointer ${
                          isDragOver
                            ? 'border-amber-400 bg-amber-500/20 shadow-lg ring-2 ring-amber-400'
                            : 'bg-gray-900/80 border-gray-800 hover:border-gray-700 hover:bg-gray-800/80'
                        } ${!sec.enabled ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Reorder Arrows */}
                            <div className="flex flex-col gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => moveSection(index, 'up')}
                                className="p-0.5 rounded text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-20 cursor-pointer"
                                title="Move Section Up"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={index === sections.length - 1}
                                onClick={() => moveSection(index, 'down')}
                                className="p-0.5 rounded text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-20 cursor-pointer"
                                title="Move Section Down"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 p-0.5">
                              <GripVertical className="w-4 h-4" />
                            </div>

                            <div className="w-7 h-7 rounded-lg bg-gray-800 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <Icon className="w-3.5 h-3.5" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate leading-tight group-hover:text-amber-300">
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
                                sec.enabled ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-gray-500 hover:bg-gray-800'
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
                              className="p-1 rounded text-gray-400 hover:text-amber-300 hover:bg-amber-500/20 cursor-pointer"
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
                              className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/20 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Tab 2: Add Section Presets Catalog */
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  <p className="text-[10px] font-semibold text-gray-400 px-1 uppercase tracking-wider">
                    Select a section preset to add to your page:
                  </p>
                  {SECTION_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    return (
                      <div
                        key={preset.type}
                        onClick={() => addSection(preset)}
                        className="p-3 rounded-xl border border-gray-800 bg-gray-900/60 hover:border-amber-500/50 hover:bg-amber-500/10 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                              {preset.name}
                            </h4>
                            <p className="text-[10px] text-gray-400 line-clamp-1 leading-tight">
                              {preset.description}
                            </p>
                          </div>
                        </div>
                        <Plus className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-120 transition-transform" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </aside>

        {/* RIGHT MAIN WORKSPACE (Real-Time Live Storefront Canvas with Smooth Scrolling) */}
        <main
          className={`flex-1 h-full bg-[#0b0d13] overflow-y-auto overflow-x-hidden flex flex-col items-center transition-all ${
            previewDevice === 'desktop' ? 'p-0' : 'p-4 sm:p-6 lg:p-8'
          }`}
        >
          <div
            className={`transition-all duration-300 bg-white shrink-0 pb-16 ${
              previewDevice === 'desktop'
                ? 'w-full min-w-full rounded-none border-none shadow-none'
                : previewDevice === 'tablet'
                ? 'w-[768px] shadow-2xl rounded-2xl border border-gray-800/80 my-4'
                : 'w-[375px] rounded-[36px] ring-8 ring-gray-900 shadow-2xl my-4'
            }`}
          >
            <SectionRenderer
              sections={sections}
              products={products}
              categories={categories}
              selectedSectionId={selectedSectionId}
              onSelectSection={handleSelectSection}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
