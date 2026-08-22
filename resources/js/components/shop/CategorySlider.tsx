import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { Category } from '@/types/shop';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

interface CategorySliderProps {
  categories: Category[];
  title?: string;
  subtitle?: string;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  categories = [],
  title = 'Shop By Category',
  subtitle = 'FINE CRAFTSMANSHIP',
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
  }, [categories, updateScrollButtons]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.firstElementChild as HTMLElement;
    const cardWidth = card ? card.offsetWidth + 24 : container.clientWidth * 0.6;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 bg-gray-50/80 border-y border-gray-100 select-none overflow-hidden">
      {/* Full-width Header Container */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mb-8 sm:mb-10 lg:mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 text-amber-900 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{subtitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-xl">
              Explore our distinctive collections of certified 18k solid gold vermeil everyday heirlooms.
            </p>
          </div>

          {/* Navigation Controls & View All Link */}
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-wider text-gray-900 hover:text-[#d0473e] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className={`w-11 h-11 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  canScrollLeft
                    ? 'border-gray-300 text-gray-900 hover:border-black hover:bg-black hover:text-white shadow-xs active:scale-95 bg-white'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-40 bg-white/50'
                }`}
                aria-label="Previous Categories"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className={`w-11 h-11 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  canScrollRight
                    ? 'border-gray-300 text-gray-900 hover:border-black hover:bg-black hover:text-white shadow-xs active:scale-95 bg-white'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-40 bg-white/50'
                }`}
                aria-label="Next Categories"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Horizontal Scroll Slider Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-8 lg:px-12 xl:px-16 pb-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="w-[240px] sm:w-[280px] md:w-[320px] lg:w-[340px] shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            <Link
              href={`/category/${cat.slug}`}
              className="group relative block aspect-4/5 rounded-3xl overflow-hidden bg-white shadow-xs hover:shadow-xl transition-all duration-500 border border-gray-100"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity" />

              <div className="absolute bottom-6 inset-x-6 text-white text-center space-y-1">
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight drop-shadow-xs">
                  {cat.name}
                </h3>
                <span className="inline-block text-xs font-semibold text-gray-300 group-hover:text-amber-300 transition-colors">
                  {cat.itemCount ? `${cat.itemCount} Designs` : 'Explore Collection →'}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};
