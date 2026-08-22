import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { ProductCard } from '@/components/shop/ProductCard';
import { SeoHead } from '@/components/seo/SeoHead';
import { Product, Category } from '@/types/shop';
import { ArrowRight, SunMedium } from 'lucide-react';

import { SplitHeroSlider, SplitSlide } from '@/components/shop/SplitHeroSlider';
import { PromoDualBanners, PromoCardData } from '@/components/shop/PromoDualBanners';
import { ShopByGram } from '@/components/shop/ShopByGram';
import { FeaturedProductSlider } from '@/components/shop/FeaturedProductSlider';

interface SeasonalConfig {
  enabled: boolean;
  title: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  category_slug?: string;
  banner_image?: string;
  button_text?: string;
  button_link?: string;
}

interface HomeProps {
  products: Product[];
  bestSelling?: Product[];
  featuredCollection?: Product[];
  categories: Category[];
  banners?: PromoCardData[];
  slides?: SplitSlide[];
  seasonalCollection?: SeasonalConfig;
  seasonalProducts?: Product[];
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export default function Home({
  products = [],
  bestSelling = [],
  featuredCollection = [],
  categories = [],
  banners,
  slides,
  seasonalCollection,
  seasonalProducts = [],
  onAddToCart,
  onQuickView,
}: HomeProps) {
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');

  // Base list of products for best selling (8 curated items)
  const baseBestSelling = bestSelling && bestSelling.length > 0 ? bestSelling : products.slice(0, 8);

  // Filtered down to 8 products max (2 rows of 4 columns)
  const displayedBestSelling =
    activeCategoryTab === 'all'
      ? baseBestSelling.slice(0, 8)
      : products
          .filter((p) =>
            p.category.toLowerCase().includes(activeCategoryTab.toLowerCase())
          )
          .slice(0, 8);

  const homeSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Haarmonaa',
      url: 'https://haarmonaa.vmcore.in',
      logo: 'https://haarmonaa.vmcore.in/wp-content/uploads/2026/01/1.png',
      sameAs: ['https://instagram.com/haarmonaa'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: '+91-98765-43210',
        email: 'concierge@haarmonaa.com',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Haarmonaa Fine Jewelry',
      url: 'https://haarmonaa.vmcore.in',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://haarmonaa.vmcore.in/shop?search={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ];

  return (
    <GlozinLayout allProducts={products}>
      <SeoHead
        title="Everyday Luxury — 18K Anti-Tarnish Gold Vermeil Jewelry"
        description="Haarmonaa Fine Jewelry — Everyday luxury handcrafted from 18K thick solid gold vermeil. 100% waterproof, anti-tarnish, hypoallergenic, and sweatproof for sensitive skin."
        ogType="website"
        structuredData={homeSchemas}
      />

      {/* Full-Bleed 50/50 Split Hero Slider (Live from Admin CMS) */}
      <SplitHeroSlider slides={slides} />

      {/* DYNAMIC SEASONAL / CURATED COLLECTION SHOWCASE (Managed via Admin CMS) */}
      {seasonalCollection && seasonalCollection.enabled !== false && (
        <section className="py-16 sm:py-20 bg-gradient-to-b from-amber-50/40 via-white to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/80 text-amber-900 rounded-full text-[11px] font-extrabold tracking-wider uppercase">
                  <SunMedium className="w-3.5 h-3.5 text-amber-600" />
                  <span>{seasonalCollection.badge || 'EXCLUSIVE CAPSULE'}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {seasonalCollection.title || 'Seasonal Collection'}
                </h2>
                {seasonalCollection.subtitle && (
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-500">
                    {seasonalCollection.subtitle}
                  </p>
                )}
              </div>

              {seasonalCollection.button_link && (
                <Link
                  href={seasonalCollection.button_link}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900 hover:text-[#d0473e] transition-colors group"
                >
                  <span>{seasonalCollection.button_text || 'View Full Capsule'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>

            {/* Seasonal Feature Grid: Left Banner Card + Right Product Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Highlight Banner Card */}
              {seasonalCollection.banner_image && (
                <div className="lg:col-span-4 relative rounded-3xl overflow-hidden shadow-md flex flex-col justify-end p-8 sm:p-10 min-h-[380px] bg-gray-900 text-white group">
                  <img
                    src={seasonalCollection.banner_image}
                    alt={seasonalCollection.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                  <div className="relative z-10 space-y-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                      LIMITED HEIRLOOM EDITION
                    </span>
                    <h3 className="text-2xl font-extrabold leading-tight text-white">
                      {seasonalCollection.title}
                    </h3>
                    {seasonalCollection.description && (
                      <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                        {seasonalCollection.description}
                      </p>
                    )}
                    {seasonalCollection.button_link && (
                      <div className="pt-2">
                        <Link
                          href={seasonalCollection.button_link}
                          className="inline-block bg-white hover:bg-[#d0473e] text-black hover:text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                        >
                          {seasonalCollection.button_text || 'Shop Capsule'}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Right Curated Products Grid */}
              {seasonalProducts && seasonalProducts.length > 0 ? (
                <div
                  className={`${
                    seasonalCollection.banner_image ? 'lg:col-span-8' : 'lg:col-span-12'
                  } grid grid-cols-2 md:grid-cols-3 ${
                    seasonalCollection.banner_image ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
                  } gap-6 sm:gap-8`}
                >
                  {seasonalProducts.map((product) => (
                    <ProductCard
                      key={`seasonal-${product.id}`}
                      product={product}
                      currencySymbol="₹"
                      onAddToCart={onAddToCart}
                      onQuickView={onQuickView}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className={`${
                    seasonalCollection.banner_image ? 'lg:col-span-8' : 'lg:col-span-12'
                  } flex flex-col items-center justify-center p-8 bg-gray-50/80 border border-gray-100 rounded-3xl text-center min-h-[300px]`}
                >
                  <p className="text-sm font-bold text-gray-900">Curated Capsule Dropping Soon</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm">
                    Exclusive artisanal pieces are currently being selected for this showcase.
                  </p>
                  {seasonalCollection.button_link && (
                    <Link
                      href={seasonalCollection.button_link}
                      className="mt-4 inline-block bg-black hover:bg-[#d0473e] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Browse Boutique
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Best Selling Section: Clean 4x2 Grid (8 Products) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Best Selling
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
              Unmatched design with supreme performance and satisfaction.
            </p>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              <button
                onClick={() => setActiveCategoryTab('all')}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategoryTab === 'all'
                    ? 'bg-[#111111] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Jewelry
              </button>
              <button
                onClick={() => setActiveCategoryTab('earrings')}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategoryTab === 'earrings'
                    ? 'bg-[#111111] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Earrings & Hoops
              </button>
              <button
                onClick={() => setActiveCategoryTab('necklaces')}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategoryTab === 'necklaces'
                    ? 'bg-[#111111] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Necklaces & Pendants
              </button>
              <button
                onClick={() => setActiveCategoryTab('bracelets')}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategoryTab === 'bracelets'
                    ? 'bg-[#111111] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Bangles & Rings
              </button>
            </div>
          </div>

          {/* 4-Column x 2-Row Product Grid (Exact 8 Products) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {displayedBestSelling.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 border-2 border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              <span>Explore Entire Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Carousel Section */}
      <section className="py-20 bg-gray-50/70 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-xs font-bold uppercase text-[#d0473e] tracking-widest block mb-1">
                FINE CRAFTSMANSHIP
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Shop By Category
              </h2>
            </div>
            <Link
              href="/shop"
              className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-wider text-gray-900 hover:text-[#d0473e] flex items-center gap-1 transition-colors"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative aspect-4/5 rounded-3xl overflow-hidden bg-white shadow-xs hover:shadow-xl transition-all duration-500"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-opacity" />
                <div className="absolute bottom-6 inset-x-6 text-white text-center">
                  <h3 className="text-base font-extrabold tracking-tight mb-1">{cat.name}</h3>
                  <span className="text-xs font-medium text-gray-300">
                    {cat.itemCount} Designs
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Two Promotional Banner Cards Section (Live from Admin CMS) */}
      <PromoDualBanners cards={banners as any} />

      {/* Featured Collection Interactive Horizontal Slider Section */}
      {featuredCollection && featuredCollection.length > 0 && (
        <FeaturedProductSlider
          products={featuredCollection}
          title="Featured Collection"
          subtitle="Exceptional design, delivering top performance and ensuring customer satisfaction all together."
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
        />
      )}


      {/* Shop by Gram & 3 Value Proposition Cards Section */}
      <ShopByGram />
    </GlozinLayout>
  );
}
