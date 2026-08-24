import React from 'react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { SeoHead } from '@/components/seo/SeoHead';
import { Product, Category } from '@/types/shop';
import { SplitSlide } from '@/components/shop/SplitHeroSlider';
import { PromoCardData } from '@/components/shop/PromoDualBanners';
import { SectionRenderer, SectionBlock } from '@/components/shop/builder/SectionRenderer';

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
  sections?: SectionBlock[];
  products: Product[];
  bestSelling?: Product[];
  featuredCollection?: Product[];
  categories: Category[];
  banners?: PromoCardData[];
  slides?: SplitSlide[];
  heroSliderEnabled?: boolean;
  promoBannersEnabled?: boolean;
  trustBadgesEnabled?: boolean;
  shopByGramEnabled?: boolean;
  seasonalCollection?: SeasonalConfig;
  seasonalProducts?: Product[];
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export default function Home({
  sections = [],
  products = [],
  bestSelling = [],
  featuredCollection = [],
  categories = [],
  banners,
  slides,
  heroSliderEnabled = true,
  promoBannersEnabled = true,
  trustBadgesEnabled = true,
  shopByGramEnabled = true,
  seasonalCollection,
  seasonalProducts = [],
  onAddToCart,
  onQuickView,
}: HomeProps) {
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

      {/* Dynamic Section Engine (Managed via Admin Page Builder) */}
      <SectionRenderer
        sections={sections}
        products={products}
        bestSelling={bestSelling}
        featuredCollection={featuredCollection}
        categories={categories}
        banners={banners}
        slides={slides}
        heroSliderEnabled={heroSliderEnabled}
        promoBannersEnabled={promoBannersEnabled}
        trustBadgesEnabled={trustBadgesEnabled}
        shopByGramEnabled={shopByGramEnabled}
        seasonalCollection={seasonalCollection}
        seasonalProducts={seasonalProducts}
        onAddToCart={onAddToCart}
        onQuickView={onQuickView}
      />
    </GlozinLayout>
  );
}
