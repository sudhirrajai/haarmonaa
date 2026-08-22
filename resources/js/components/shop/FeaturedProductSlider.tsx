import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Product } from '@/types/shop';
import { ProductCard } from '@/components/shop/ProductCard';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface FeaturedProductSliderProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const FeaturedProductSlider: React.FC<FeaturedProductSliderProps> = ({
  products = [],
  title = 'Featured Collection',
  subtitle = 'Handpicked architectural masterpieces and certified luxury heirlooms.',
  onAddToCart,
  onQuickView,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons, { passive: true });
    }
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      if (el) el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [products, updateScrollButtons]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.firstElementChild as HTMLElement;
    const cardWidth = card ? card.offsetWidth + 24 : container.clientWidth * 0.75;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white border-b border-gray-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-10 lg:mb-12 gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>CURATED SELECTION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-xl">
              {subtitle}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`w-11 h-11 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer ${
                canScrollLeft
                  ? 'border-gray-300 text-gray-900 hover:border-black hover:bg-black hover:text-white shadow-xs active:scale-95'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-40'
              }`}
              aria-label="Previous Products"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`w-11 h-11 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer ${
                canScrollRight
                  ? 'border-gray-300 text-gray-900 hover:border-black hover:bg-black hover:text-white shadow-xs active:scale-95'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-40'
              }`}
              aria-label="Next Products"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Fluid Horizontal Smooth-Scrolling Track */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 snap-x snap-mandatory scrollbar-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[82vw] sm:w-[46vw] md:w-[32vw] lg:w-[calc(25%-18px)] shrink-0 snap-start"
            >
              <ProductCard
                product={product}
                currencySymbol="₹"
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
