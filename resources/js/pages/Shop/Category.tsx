import React, { useState, useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { ProductCard } from '@/components/shop/ProductCard';
import { QuickViewModal } from '@/components/shop/QuickViewModal';
import { SeoHead } from '@/components/seo/SeoHead';
import { Product, Category as CategoryType } from '@/types/shop';
import {
  ChevronRight,
  SlidersHorizontal,
  FolderTree,
  Sparkles,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  ArrowUpDown,
} from 'lucide-react';

interface CategoryPageProps {
  category: {
    id: number;
    name: string;
    slug: string;
    tagline?: string;
    description?: string;
    image?: string;
    productsCount: number;
    isCollection?: boolean;
  };
  products: Product[];
  categories: CategoryType[];
  seo: {
    title: string;
    description: string;
    canonical: string;
    ogImage?: string | null;
    breadcrumbs: Array<{ label: string; url: string }>;
  };
}

export default function Category({
  category,
  products = [],
  categories = [],
  seo,
}: CategoryPageProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');

  // Filter & Sort Products client-side for ultra-fast response
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (inStockOnly) {
      list = list.filter((p) => p.inStock !== false);
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => b.id - a.id);
    } else {
      // featured
      list.sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0));
    }

    return list;
  }, [products, inStockOnly, sortBy]);

  // Schema.org CollectionPage & ItemList JSON-LD
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: seo.description,
    url: seo.canonical,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.slice(0, 20).map((prod, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${typeof window !== 'undefined' ? window.location.origin : 'https://haarmonaa.vmcore.in'}/product/${prod.slug}`,
        name: prod.name,
        image: prod.image,
        offers: {
          '@type': 'Offer',
          price: prod.price,
          priceCurrency: 'INR',
          availability: prod.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      })),
    },
  };

  return (
    <GlozinLayout>
      <SeoHead
        title={seo.title}
        description={seo.description}
        canonical={seo.canonical}
        ogImage={seo.ogImage || undefined}
        ogType="website"
        breadcrumbs={seo.breadcrumbs}
        structuredData={collectionSchema}
      />

      <div className="bg-[#FAF9F6] min-h-screen pb-20">
        {/* Category Hero Banner */}
        <div className="relative bg-[#111111] text-white overflow-hidden py-14 sm:py-20">
          {category.image && (
            <div className="absolute inset-0 z-0">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover object-center opacity-30 blur-xs scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            </div>
          )}

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Links */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/shop" className="hover:text-white transition-colors">
                Jewelry
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400 font-bold">{category.name}</span>
            </nav>

            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-extrabold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{category.tagline || '18K Gold Vermeil Collection'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white capitalize">
                {category.name}
              </h1>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-1">
                {category.description ||
                  `Explore our artisanal collection of ${category.name.toLowerCase()} handcrafted in 18k solid gold vermeil. Designed for everyday luxury with anti-tarnish, waterproof and hypoallergenic guarantees.`}
              </p>

              <div className="pt-2 flex items-center gap-4 text-xs text-gray-400 font-medium">
                <span>
                  <strong className="text-white font-bold">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'Design' : 'Designs'} Available
                </span>
                <span>•</span>
                <span>Waterproof & Anti-Tarnish</span>
                <span>•</span>
                <span>Pan-India Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sibling Category Quick Links */}
        {categories && categories.length > 0 && (
          <div className="bg-white border-b border-gray-200/80 sticky top-0 z-20 shadow-2xs backdrop-blur-md bg-white/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 pr-2">
                  Browse:
                </span>
                <Link
                  href="/shop"
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  All Jewelry
                </Link>
                {categories.map((cat) => {
                  const isActive = String(cat.slug) === String(category.slug);
                  return (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-black text-white shadow-xs'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {cat.itemCount !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {cat.itemCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Products Grid & Toolbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              {/* In-Stock Filter Toggle */}
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-black focus:ring-black rounded-xs cursor-pointer"
                />
                <span>In-Stock Ready to Ship</span>
              </label>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-gray-300 hover:border-black rounded-[8px] py-1.5 px-3 text-xs font-bold text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-black cursor-pointer shadow-2xs transition-all"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currencySymbol="₹"
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-gray-200/80 rounded-3xl p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <FolderTree className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">No items found in this curation</h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Try toggling the in-stock filter or explore our other handcrafted jewelry categories.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-[#d0473e] text-white text-xs font-bold rounded-full transition-colors uppercase tracking-wider shadow-xs"
                >
                  Explore All Jewelry
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Value Proposition Badges */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 bg-white rounded-3xl border border-gray-200/80 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900">Anti-Tarnish Guarantee</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Waterproof & sweat-resistant daily wear</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900">18K Solid Gold Vermeil</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Thick 2.5–3.0μm genuine gold layering</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-700">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900">Express Insured Delivery</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Fast pan-India dispatch with tracking</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-700">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900">7-Day Easy Returns</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Concierge exchange & doorstep pickup</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </GlozinLayout>
  );
}
