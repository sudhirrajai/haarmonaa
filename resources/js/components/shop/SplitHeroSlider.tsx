import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface SplitSlide {
  id: number | string;
  subtitle: string;
  title: string;
  buttonText?: string;
  buttonLink?: string;
  showButton?: boolean;
  enabled?: boolean;
  badge?: string;
  leftImage: string;
  rightImage: string;
}

interface SplitHeroSliderProps {
  slides?: SplitSlide[];
  autoPlayInterval?: number;
}

const defaultSlides: SplitSlide[] = [
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
  {
    id: 3,
    subtitle: 'ORGANIC LUXURY',
    title: 'Layered Statement Adornments',
    buttonText: 'Discover Necklaces',
    buttonLink: '/shop?category=necklaces',
    showButton: true,
    enabled: true,
    badge: 'TRENDING',
    leftImage: 'https://images.unsplash.com/photo-1611591475102-7634599ce074?q=80&w=1200&auto=format&fit=crop',
    rightImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop',
  },
];

export const SplitHeroSlider: React.FC<SplitHeroSliderProps> = ({
  slides: rawSlides,
  autoPlayInterval = 6500,
}) => {
  // If rawSlides is explicitly passed as empty array, or if all slides are disabled, return null (hide slider completely)
  if (rawSlides !== undefined && rawSlides.length === 0) {
    return null;
  }

  const candidateSlides = rawSlides && rawSlides.length > 0 ? rawSlides : defaultSlides;
  const activeSlides = candidateSlides.filter((s) => s.enabled !== false);

  if (activeSlides.length === 0) {
    return null;
  }

  const slides = activeSlides;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [currentSlide, isPaused, slides.length, autoPlayInterval]);

  const activeSlide = slides[currentSlide] || slides[0];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="@container group relative w-full overflow-hidden bg-[#111111] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full grid grid-cols-1 @[768px]:grid-cols-2 min-h-[460px] @sm:min-h-[520px] @lg:min-h-[640px]">
        {/* Left Half: Animated Image Layer + Smooth Keyframe Overlay Text */}
        <div className="relative w-full h-full min-h-[380px] @sm:min-h-[440px] @lg:min-h-full overflow-hidden bg-gray-900 flex flex-col justify-end p-6 @sm:p-10 @lg:p-14">
          {/* Cross-fade Ken Burns Background Images */}
          {slides.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <div
                key={`left-${slide.id}`}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none -z-10'
                }`}
              >
                <img
                  src={slide.leftImage}
                  alt={slide.title}
                  className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
            );
          })}

          {/* Smooth Multi-Stop Cinematic Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 pointer-events-none z-1" />

          {/* Text Content Block with Staggered Keyframe Animation */}
          <div
            key={`content-${currentSlide}`}
            className="relative z-10 space-y-3 @sm:space-y-4 max-w-xl transition-all duration-700 ease-out animate-fade-in"
          >
            {activeSlide.badge && (
              <div className="inline-block animate-slide-up">
                <span className="bg-[#111111]/90 backdrop-blur-md text-amber-300 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-300/30 shadow-lg">
                  {activeSlide.badge}
                </span>
              </div>
            )}

            <span className="text-[11px] @sm:text-xs font-extrabold uppercase tracking-widest text-amber-100 block drop-shadow-md">
              {activeSlide.subtitle}
            </span>

            <h1 className="text-2xl @sm:text-3xl @md:text-4xl @lg:text-5xl font-extrabold text-white tracking-tight leading-tight break-words drop-shadow-lg">
              {activeSlide.title}
            </h1>

            {activeSlide.showButton !== false && activeSlide.buttonText && (
              <div className="pt-2 @sm:pt-3">
                <Link
                  href={activeSlide.buttonLink || '/shop'}
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#d0473e] text-black hover:text-white px-6 @sm:px-8 py-2.5 @sm:py-3.5 rounded-full text-xs @sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>{activeSlide.buttonText}</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            )}
          </div>

          {/* Progress Bars & Pagination Indicator */}
          {slides.length > 1 && (
            <div className="absolute bottom-6 right-8 z-20 flex items-center space-x-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`relative overflow-hidden transition-all duration-500 rounded-full cursor-pointer ${
                    idx === currentSlide
                      ? 'w-10 h-2 bg-white/40'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/90'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                >
                  {idx === currentSlide && (
                    <span
                      className="absolute inset-0 bg-white rounded-full transition-all"
                      style={{
                        animation: isPaused
                          ? 'none'
                          : `progressFill ${autoPlayInterval}ms linear forwards`,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Half: Pure Image Showcase with Ken Burns Smooth Transition */}
        <div className="relative w-full h-full min-h-[380px] sm:min-h-[480px] lg:min-h-full overflow-hidden bg-gray-950 hidden sm:block">
          {slides.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <div
                key={`right-${slide.id}`}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none -z-10'
                }`}
              >
                <img
                  src={slide.rightImage}
                  alt="Haarmonaa Fine Jewelry Muse"
                  className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Modern Floating Hover Navigation Controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/40 hover:bg-white text-white hover:text-black backdrop-blur-md rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hidden lg:flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-black/40 hover:bg-white text-white hover:text-black backdrop-blur-md rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hidden lg:flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </>
      )}

      {/* Progress Fill CSS Animation */}
      <style>{`
        @keyframes progressFill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
};
