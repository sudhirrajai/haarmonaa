import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { SeoHead } from '@/components/seo/SeoHead';
import { Product } from '@/types/shop';
import { Star, ArrowRight } from 'lucide-react';

interface AboutContentCMS {
  hero?: {
    enabled?: boolean;
    badge?: string;
    title?: string;
    description?: string;
  };
  media_banner?: {
    enabled?: boolean;
    left_image?: string;
    right_bg_image?: string;
    brand_subtitle_top?: string;
    brand_title?: string;
    brand_subtitle_bottom?: string;
  };
  stats?: {
    enabled?: boolean;
    items?: Array<{
      value: string;
      label: string;
      description: string;
    }>;
  };
  features?: {
    enabled?: boolean;
    badge?: string;
    title?: string;
    description?: string;
    cards?: Array<{
      image: string;
      title: string;
      description: string;
    }>;
  };
  quote?: {
    enabled?: boolean;
    stars?: number;
    quote?: string;
    author_name?: string;
    author_role?: string;
  };
  split_rows?: {
    enabled?: boolean;
    rows?: Array<{
      badge?: string;
      title?: string;
      description?: string;
      button_text?: string;
      button_link?: string;
      image?: string;
      image_position?: 'left' | 'right';
    }>;
  };
  stories?: {
    enabled?: boolean;
    badge?: string;
    title?: string;
    description?: string;
    cards?: Array<{
      image: string;
      title: string;
      description: string;
    }>;
  };
}

interface AboutProps {
  products?: Product[];
  aboutContent?: AboutContentCMS;
}

export default function About({ products = [], aboutContent }: AboutProps) {
  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'About Us', url: '/about-us' },
  ];

  const hero = aboutContent?.hero;
  const isHeroEnabled = hero?.enabled !== false;

  const mediaBanner = aboutContent?.media_banner;
  const isMediaEnabled = mediaBanner?.enabled !== false;

  const stats = aboutContent?.stats;
  const isStatsEnabled = stats?.enabled !== false && (stats?.items?.length ?? 0) > 0;

  const features = aboutContent?.features;
  const isFeaturesEnabled = features?.enabled !== false && (features?.cards?.length ?? 0) > 0;

  const quote = aboutContent?.quote;
  const isQuoteEnabled = quote?.enabled !== false && !!quote?.quote;

  const splitRows = aboutContent?.split_rows;
  const isSplitRowsEnabled = splitRows?.enabled !== false && (splitRows?.rows?.length ?? 0) > 0;

  const stories = aboutContent?.stories;
  const isStoriesEnabled = stories?.enabled !== false && (stories?.cards?.length ?? 0) > 0;

  return (
    <GlozinLayout allProducts={products}>
      <SeoHead
        title="About Us — Artisan Heritage & 18K Gold Vermeil Craftsmanship"
        description="Learn about Haarmonaa's heritage, sustainable gold vermeil metallurgy, anti-tarnish waterproof guarantees, and vision for everyday fine jewelry."
        breadcrumbs={breadcrumbs}
      />

      {/* 1. Breadcrumb & Hero Statement Section */}
      {isHeroEnabled ? (
        <section className="pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-12 bg-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Breadcrumb Navigation */}
            <nav className="text-[13px] font-semibold text-gray-500 mb-6 sm:mb-8">
              <Link href="/" className="hover:text-black transition-colors">
                Home
              </Link>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-900 font-bold">About Us</span>
            </nav>

            {/* Subtitle / Welcome Badge */}
            {hero?.badge && (
              <span className="text-xs sm:text-[13.5px] font-bold uppercase tracking-widest text-[#d0473e] block mb-3 sm:mb-3.5">
                {hero.badge}
              </span>
            )}

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[52px] font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-4 sm:mb-5 whitespace-pre-line">
              {hero?.title || 'Artisanal Fine Jewelry\nAvailable to Everyone'}
            </h1>

            {/* Subheading Description */}
            {hero?.description && (
              <p className="text-xs sm:text-[14.5px] lg:text-[15px] text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {hero.description}
              </p>
            )}
          </div>
        </section>
      ) : (
        /* Standalone Minimal Breadcrumb if Hero is Disabled */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <nav className="text-[13px] font-semibold text-gray-500">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">About Us</span>
          </nav>
        </div>
      )}

      {/* 2. Hero Dual Media Banner */}
      {isMediaEnabled && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-6 sm:my-8 lg:my-12">
          <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xs aspect-16/9 sm:aspect-21/9 lg:aspect-[2.35/1] max-h-[460px]">
            {/* Left Visual */}
            <div className="relative h-full overflow-hidden bg-gray-100">
              <img
                src={
                  mediaBanner?.left_image ||
                  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop'
                }
                alt="Haarmonaa Fine Jewelry Lifestyle"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Visual: Brand Identity Showcase */}
            <div className="relative h-full bg-[#3a444a] flex flex-col items-center justify-center text-center p-6 sm:p-10 text-white overflow-hidden">
              <img
                src={
                  mediaBanner?.right_bg_image ||
                  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop'
                }
                alt="Atmospheric Landscape"
                className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay filter blur-[1px]"
              />
              <div className="relative z-10 space-y-3 sm:space-y-4 max-w-sm mx-auto">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-300 block">
                  {mediaBanner?.brand_subtitle_top || 'HAARMONAA FINE JEWELRY'}
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white lowercase">
                  {mediaBanner?.brand_title || 'haarmonaa'}
                </h2>
                <span className="text-[9px] sm:text-[10.5px] font-semibold uppercase tracking-[0.28em] text-gray-300 block">
                  {mediaBanner?.brand_subtitle_bottom || 'SOLID 18K GOLD VERMEIL'}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Key Statistics Counters */}
      {isStatsEnabled && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div
            className={`grid gap-6 sm:gap-8 lg:gap-10 text-center ${
              (stats?.items?.length ?? 3) === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : (stats?.items?.length ?? 3) === 4
                ? 'grid-cols-2 md:grid-cols-4'
                : 'grid-cols-1 md:grid-cols-3'
            }`}
          >
            {stats?.items?.map((st, idx) => (
              <div key={idx} className="space-y-1.5 px-2">
                <div className="text-3xl sm:text-[36px] font-extrabold text-gray-900 tracking-tight">
                  {st.value}
                </div>
                <h3 className="text-[15px] font-bold text-gray-900">{st.label}</h3>
                <p className="text-[13px] text-gray-500 font-normal leading-relaxed max-w-[260px] mx-auto">
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Why Choose Us / Core Pillars (Feature Cards) */}
      {isFeaturesEnabled && (
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50/70 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12 space-y-2">
              {features?.badge && (
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#d0473e] block">
                  {features.badge}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                {features?.title || 'Our Peculiar Things'}
              </h2>
              {features?.description && (
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {features.description}
                </p>
              )}
            </div>

            <div
              className={`grid gap-4 sm:gap-6 lg:gap-8 ${
                (features?.cards?.length ?? 3) === 2
                  ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                  : (features?.cards?.length ?? 3) >= 4
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                  : 'grid-cols-1 md:grid-cols-3'
              }`}
            >
              {features?.cards?.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xs group flex flex-col justify-between"
                >
                  <div className="aspect-4/3 sm:aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 sm:p-7 space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">{card.title}</h3>
                    <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Brand Manifesto Quote Banner */}
      {isQuoteEnabled && (
        <section className="bg-[#1e2c28] text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 relative z-10">
            {/* Stars Rating */}
            <div className="flex items-center justify-center gap-1.5 text-[#f6e05e]">
              {[...Array(quote?.stars || 5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#f6e05e] text-[#f6e05e]" />
              ))}
            </div>

            {/* Quote Text */}
            <blockquote className="text-sm sm:text-base md:text-[17px] font-normal italic leading-relaxed text-[#eedac7] max-w-2xl mx-auto tracking-wide">
              "{quote?.quote}"
            </blockquote>

            {/* Author */}
            {(quote?.author_name || quote?.author_role) && (
              <div className="pt-2 space-y-0.5">
                {quote?.author_name && (
                  <span className="text-[13.5px] sm:text-[14px] font-bold text-[#eedac7] tracking-normal block">
                    {quote.author_name}
                  </span>
                )}
                {quote?.author_role && (
                  <span className="text-[12px] sm:text-[12.5px] font-normal text-[#a6b8b0] block">
                    {quote.author_role}
                  </span>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. Alternating Split Feature Rows */}
      {isSplitRowsEnabled && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-12 sm:space-y-16 lg:space-y-20">
          {splitRows?.rows?.map((row, idx) => {
            const isImageLeft = row.image_position !== 'right';
            return (
              <div
                key={idx}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center"
              >
                {/* Visual Image */}
                <div
                  className={`lg:col-span-6 rounded-3xl overflow-hidden aspect-4/3 sm:aspect-16/11 bg-gray-100 shadow-sm ${
                    isImageLeft ? 'order-1' : 'order-1 lg:order-2'
                  }`}
                >
                  <img
                    src={
                      row.image ||
                      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop'
                    }
                    alt={row.title || 'Haarmonaa Story'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Text Content */}
                <div
                  className={`lg:col-span-6 space-y-3 sm:space-y-4 text-center lg:text-left ${
                    isImageLeft ? 'lg:pl-6 order-2' : 'order-2 lg:order-1'
                  }`}
                >
                  {row.badge && (
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#d0473e] block">
                      {row.badge}
                    </span>
                  )}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    {row.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-lg">
                    {row.description}
                  </p>
                  {row.button_text && (
                    <div className="pt-2">
                      <Link
                        href={row.button_link || '/shop'}
                        className="inline-block bg-[#111111] hover:bg-[#d0473e] text-white px-8 py-3 rounded-full text-xs sm:text-[13px] font-bold tracking-normal transition-all shadow-sm cursor-pointer"
                      >
                        {row.button_text}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* 7. Expanding Horizons / Story & Team Cards */}
      {isStoriesEnabled && (
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50/70 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12 space-y-2">
              {stories?.badge && (
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#d0473e] block">
                  {stories.badge}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
                {stories?.title || 'Expanding Horizons'}
              </h2>
              {stories?.description && (
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {stories.description}
                </p>
              )}
            </div>

            <div
              className={`grid gap-4 sm:gap-6 lg:gap-8 ${
                (stories?.cards?.length ?? 3) === 2
                  ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                  : (stories?.cards?.length ?? 3) >= 4
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                  : 'grid-cols-1 md:grid-cols-3'
              }`}
            >
              {stories?.cards?.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xs group flex flex-col justify-between"
                >
                  <div className="aspect-4/3 overflow-hidden bg-gray-100">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 sm:p-7 space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">{card.title}</h3>
                    <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </GlozinLayout>
  );
}
