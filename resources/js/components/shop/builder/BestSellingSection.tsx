import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Product } from '@/types/shop';
import { ProductCard } from '@/components/shop/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface BestSellingSettings {
  title?: string;
  subtitle?: string;
  badge?: string;
  view_all_link?: string;
  view_all_text?: string;
}

interface BestSellingSectionProps {
  settings?: BestSellingSettings;
  products?: Product[];
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const BestSellingSection: React.FC<BestSellingSectionProps> = ({
  settings = {},
  products = [],
  onAddToCart,
  onQuickView,
}) => {
  const {
    title = 'Best Selling Products',
    subtitle = 'TIMELESS EVERYDAY LUXURY IN 18K GOLD VERMEIL',
    badge = 'MOST LOVED PIECES',
    view_all_link = '/shop',
    view_all_text = 'Explore Entire Collection',
  } = settings;

  const [activeCategoryTab, setActiveCategoryTab] = useState('all');

  const baseProducts = products && products.length > 0 ? products : [];

  const displayedProducts =
    activeCategoryTab === 'all'
      ? baseProducts.slice(0, 8)
      : baseProducts
          .filter((p) => {
            const tabLower = String(activeCategoryTab || '').toLowerCase();
            const catLower = String(p?.category || '').toLowerCase();
            return (
              catLower.includes(tabLower) ||
              p?.categories?.some((c) => String(c || '').toLowerCase().includes(tabLower))
            );
          })
          .slice(0, 8);

  return (
    <section className="@container py-10 @sm:py-14 @lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 @sm:px-6 @lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 @sm:mb-10 @lg:mb-12">
          {badge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full text-[10px] @sm:text-xs font-bold tracking-[0.2em] uppercase bg-amber-50 text-amber-800 border border-amber-200/50">
              <Sparkles className="w-3 h-3" />
              {badge}
            </span>
          )}
          <h2 className="text-2xl @sm:text-3xl @lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs @sm:text-sm text-gray-500 mt-1.5 font-medium">
              {subtitle}
            </p>
          )}

          {/* Category Filter Tabs */}
          <div
            className="w-full overflow-x-auto no-scrollbar scrollbar-none [&::-webkit-scrollbar]:hidden py-2 mt-4 @sm:mt-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex flex-nowrap items-center justify-center gap-2 min-w-max mx-auto px-2">
              <button
                type="button"
                onClick={() => setActiveCategoryTab('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeCategoryTab === 'all'
                    ? 'bg-[#111111] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Jewelry
              </button>
              <button
                type="button"
                onClick={() => setActiveCategoryTab('earrings')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeCategoryTab === 'earrings'
                    ? 'bg-[#111111] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Earrings & Hoops
              </button>
              <button
                type="button"
                onClick={() => setActiveCategoryTab('necklaces')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeCategoryTab === 'necklaces'
                    ? 'bg-[#111111] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Necklaces & Pendants
              </button>
              <button
                type="button"
                onClick={() => setActiveCategoryTab('rings')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeCategoryTab === 'rings'
                    ? 'bg-[#111111] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Rings & Bands
              </button>
              <button
                type="button"
                onClick={() => setActiveCategoryTab('bracelets')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeCategoryTab === 'bracelets'
                    ? 'bg-[#111111] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Bracelets & Cuffs
              </button>
            </div>
          </div>
        </div>

        {/* 4-Column x 2-Row Product Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 @sm:grid-cols-2 @md:grid-cols-3 @[1024px]:grid-cols-4 gap-3 @sm:gap-5 @lg:gap-7">
            {displayedProducts.map((product) => (
              <ProductCard
                key={`bestseller-${product.id}`}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-sm font-semibold text-gray-700">No products found in this category.</p>
          </div>
        )}

        {view_all_link && (
          <div className="text-center mt-8 sm:mt-10 lg:mt-12">
            <Link
              href={view_all_link}
              className="inline-flex items-center gap-2 border-2 border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer group"
            >
              <span>{view_all_text}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
