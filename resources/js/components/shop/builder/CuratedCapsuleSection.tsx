import React from 'react';
import { Link } from '@inertiajs/react';
import { Product } from '@/types/shop';
import { ProductCard } from '@/components/shop/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface CuratedCapsuleSettings {
  title?: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  category_slug?: string;
  banner_image?: string;
  button_text?: string;
  button_link?: string;
  theme?: 'gold' | 'rose' | 'noir' | 'minimal';
}

interface CuratedCapsuleSectionProps {
  settings: CuratedCapsuleSettings;
  products?: Product[];
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const CuratedCapsuleSection: React.FC<CuratedCapsuleSectionProps> = ({
  settings = {},
  products = [],
  onAddToCart,
  onQuickView,
}) => {
  const {
    title = 'Seasonal Collection',
    subtitle = 'SUNLIT REFLECTIONS & WATERPROOF HEIRLOOMS',
    badge = 'EXCLUSIVE CAPSULE',
    description = 'Handcrafted 18k solid gold vermeil crafted to shine effortlessly with everyday elegance.',
    banner_image,
    button_text = 'Explore Capsule',
    button_link = '/shop',
    theme = 'gold',
  } = settings;

  const themeClasses = {
    gold: 'bg-gradient-to-b from-amber-50/40 via-white to-white border-amber-100/50',
    rose: 'bg-gradient-to-b from-rose-50/40 via-white to-white border-rose-100/50',
    noir: 'bg-stone-900 text-white border-stone-800',
    minimal: 'bg-white border-gray-100',
  }[theme] || 'bg-gradient-to-b from-amber-50/40 via-white to-white border-amber-100/50';

  const badgeColor = {
    gold: 'text-amber-700 bg-amber-50 border-amber-200/60',
    rose: 'text-rose-700 bg-rose-50 border-rose-200/60',
    noir: 'text-amber-300 bg-white/10 border-white/20',
    minimal: 'text-gray-700 bg-gray-100 border-gray-200',
  }[theme] || 'text-amber-700 bg-amber-50 border-amber-200/60';

  const isDark = theme === 'noir';

  return (
    <section className={`py-12 sm:py-16 lg:py-20 border-b ${themeClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-8 sm:mb-10 lg:mb-12 gap-4">
          <div className="space-y-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase border ${badgeColor}`}
            >
              <Sparkles className="w-3 h-3" />
              {badge}
            </span>
            <h2
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className={`text-xs sm:text-sm font-medium ${
                  isDark ? 'text-stone-400' : 'text-gray-500'
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>

          {button_link && (
            <Link
              href={button_link}
              className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors group ${
                isDark
                  ? 'text-amber-300 hover:text-white'
                  : 'text-gray-900 hover:text-[#d0473e]'
              }`}
            >
              <span>{button_text}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Feature Grid: Highlight Banner Card + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Highlight Banner Card */}
          {banner_image && (
            <div className="lg:col-span-4 relative rounded-3xl overflow-hidden shadow-md flex flex-col justify-end p-6 sm:p-8 lg:p-10 min-h-[360px] bg-gray-900 text-white group">
              <img
                src={banner_image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                  {badge}
                </span>
                <h3 className="text-2xl font-extrabold leading-tight text-white">{title}</h3>
                {description && (
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                    {description}
                  </p>
                )}
                {button_link && (
                  <div className="pt-2">
                    <Link
                      href={button_link}
                      className="inline-block bg-white hover:bg-[#d0473e] text-black hover:text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                    >
                      {button_text}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Curated Products Grid */}
          {products && products.length > 0 ? (
            <div
              className={`${
                banner_image ? 'lg:col-span-8' : 'lg:col-span-12'
              } grid grid-cols-2 md:grid-cols-3 ${
                banner_image ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
              } gap-4 sm:gap-6 lg:gap-8`}
            >
              {products.slice(0, banner_image ? 6 : 8).map((product) => (
                <ProductCard
                  key={`capsule-${product.id}`}
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
                banner_image ? 'lg:col-span-8' : 'lg:col-span-12'
              } flex flex-col items-center justify-center p-8 bg-gray-50/80 border border-gray-100 rounded-3xl text-center min-h-[300px]`}
            >
              <p className="text-sm font-bold text-gray-900">Curated Capsule Dropping Soon</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                Exclusive artisanal pieces are currently being selected for this showcase.
              </p>
              {button_link && (
                <Link
                  href={button_link}
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
  );
};
