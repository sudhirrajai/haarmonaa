import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductListItem } from '@/components/shop/ProductListItem';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown } from '@/components/shop/SortDropdown';
import { SeoHead } from '@/components/seo/SeoHead';
import { Product, Category, FilterState } from '@/types/shop';
import { Grid2X2, Grid3X3, LayoutGrid, List, SlidersHorizontal, ChevronDown, Loader2, X } from 'lucide-react';

interface CatalogProps {
  products: Product[];
  categories: Category[];
  selectedCategory?: string;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export default function Catalog({
  products = [],
  categories = [],
  selectedCategory = 'all',
  onAddToCart,
  onQuickView,
}: CatalogProps) {
  const [columns, setColumns] = useState<2 | 3 | 4 | 'list'>(3);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    category: selectedCategory || 'all',
    minPrice: 0,
    maxPrice: 500,
    onSaleOnly: false,
    inStockOnly: false,
    sortBy: 'date-new',
  });

  // Sync state if selectedCategory prop changes
  useEffect(() => {
    if (selectedCategory) {
      setFilters((prev) => ({ ...prev, category: selectedCategory }));
    }
  }, [selectedCategory]);

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      minPrice: 0,
      maxPrice: 500,
      onSaleOnly: false,
      inStockOnly: false,
      sortBy: 'date-new',
    });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category Filter
        if (filters.category && filters.category !== 'all') {
          const target = filters.category.toLowerCase().replace(/[-_ ]/g, '');
          const pCat = (p.category || '').toLowerCase().replace(/[-_ ]/g, '');
          const pCats = (p.categories || []).map((c) => c.toLowerCase().replace(/[-_ ]/g, ''));
          const matches =
            pCat === target ||
            pCat.includes(target) ||
            target.includes(pCat) ||
            pCats.some((c) => c === target || c.includes(target) || target.includes(c));

          if (!matches) return false;
        }

        // Price Filter
        if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;

        // Availability Filters
        if (filters.onSaleOnly && (!p.discountPercent || p.discountPercent <= 0)) return false;
        if (filters.inStockOnly && !p.inStock) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'popularity') return (b.reviewCount || 0) - (a.reviewCount || 0);
        if (filters.sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        if (filters.sortBy === 'price-low') return a.price - b.price;
        if (filters.sortBy === 'price-high') return b.price - a.price;
        if (filters.sortBy === 'date-old') return a.id - b.id;
        // Default: Date, new to old
        return b.id - a.id;
      });
  }, [products, filters]);

  // Reset pagination count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [filters]);


  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (visibleCount >= filteredProducts.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 6, filteredProducts.length));
            setIsLoadingMore(false);
          }, 600);
        }
      },
      { threshold: 0.2, rootMargin: '100px' }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [visibleCount, filteredProducts.length, isLoadingMore]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const progressPercent =
    filteredProducts.length > 0
      ? Math.min(100, (displayedProducts.length / filteredProducts.length) * 100)
      : 0;

  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Fine Jewelry', url: '/shop' },
    ...(filters.category && filters.category !== 'all'
      ? [{ label: filters.category, url: `/shop?category=${filters.category}` }]
      : []),
  ];

  return (
    <GlozinLayout allProducts={products}>
      <SeoHead
        title="Fine Jewelry Catalog — 18K Solid Gold Vermeil"
        description="Browse all Haarmonaa handcrafted fine jewelry collections. Rings, earrings, necklaces, and bracelets in 18k thick solid gold vermeil. Waterproof and anti-tarnish."
        breadcrumbs={breadcrumbs}
      />

      {/* Centered Page Header Banner */}
      <div className="bg-white pt-12 pb-6 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="text-[13px] font-semibold text-gray-500 mb-2.5">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">Shop</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Shop
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Desktop Left Sidebar Filter (3 Columns) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28">
              <FilterSidebar
                categories={categories}
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={handleResetFilters}
                currencySymbol="₹"
                maxPriceLimit={500}
              />
            </div>
          </div>

          {/* Right Product Grid Area (9 Columns) */}
          <div className="lg:col-span-9 space-y-8">
            {/* Top Control Bar */}
            <div className="flex flex-row justify-between items-center gap-2 pb-4 border-b border-gray-100">
              {/* Left: Total Results Count & Mobile Filter */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileFilter(true)}
                  className="lg:hidden flex items-center gap-2 px-3.5 py-2 border border-gray-300 hover:border-black rounded-full text-xs font-bold text-gray-800 bg-white transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>
                <span className="hidden sm:inline text-[14px] sm:text-[14.5px] text-gray-700 font-medium">
                  There are {filteredProducts.length} results in total
                </span>
              </div>

              {/* Center & Right: Layout Switcher + Sorting */}
              <div className="flex items-center justify-end gap-3 sm:gap-6">
                {/* Column Layout Switcher (Desktop) */}
                <div className="hidden sm:flex items-center space-x-2.5 text-gray-400">
                  <button
                    onClick={() => setColumns(2)}
                    className={`p-1 transition-colors ${columns === 2 ? 'text-black font-bold' : 'hover:text-gray-700'}`}
                    title="2 Columns Grid"
                  >
                    <Grid2X2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setColumns(3)}
                    className={`p-1 transition-colors ${columns === 3 ? 'text-black font-bold' : 'hover:text-gray-700'}`}
                    title="3 Columns Grid"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setColumns(4)}
                    className={`p-1 transition-colors ${columns === 4 ? 'text-black font-bold' : 'hover:text-gray-700'}`}
                    title="4 Columns Grid"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setColumns('list')}
                    className={`p-1 transition-colors ${columns === 'list' ? 'text-black font-bold' : 'hover:text-gray-700'}`}
                    title="List View"
                  >
                    <List className="w-5 h-5 stroke-[2.2]" />
                  </button>
                </div>

                {/* Custom Luxury Sort Dropdown */}
                <SortDropdown
                  value={filters.sortBy}
                  onChange={(val) => setFilters({ ...filters, sortBy: val })}
                />
              </div>
            </div>

            {/* Products Grid / List */}
            {displayedProducts.length > 0 ? (
              columns === 'list' ? (
                /* List View Rendering */
                <div className="space-y-6 divide-y divide-gray-100">
                  {displayedProducts.map((product) => (
                    <ProductListItem
                      key={product.id}
                      product={product}
                      currencySymbol="₹"
                      onAddToCart={onAddToCart}
                      onQuickView={onQuickView}
                    />
                  ))}
                </div>
              ) : (
                /* Grid View Rendering (2-column on mobile, responsive on desktop) */
                <div
                  className={`grid gap-3 sm:gap-6 lg:gap-8 ${
                    columns === 2
                      ? 'grid-cols-2'
                      : columns === 4
                      ? 'grid-cols-2 lg:grid-cols-4'
                      : 'grid-cols-2 lg:grid-cols-3'
                  }`}
                >
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currencySymbol="₹"
                      onAddToCart={onAddToCart}
                      onQuickView={onQuickView}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-2">No jewelry found</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                  No items matched your chosen filter criteria. Try adjusting price or categories.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-[#d0473e] transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Auto-Load / Infinite Scroll Section */}
            {filteredProducts.length > 0 && (
              <div className="pt-12 pb-6 text-center space-y-4 max-w-xs mx-auto">
                {/* Result count text */}
                <p className="text-xs font-semibold text-gray-600">
                  You've viewed {displayedProducts.length} of {filteredProducts.length} result
                </p>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#111111] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Trigger Sentinel & Small Loader Pill */}
                {displayedProducts.length < filteredProducts.length ? (
                  <div ref={loadMoreRef} className="pt-2">
                    <button
                      onClick={() => {
                        setIsLoadingMore(true);
                        setTimeout(() => {
                          setVisibleCount((prev) => Math.min(prev + 6, filteredProducts.length));
                          setIsLoadingMore(false);
                        }, 500);
                      }}
                      className="inline-flex items-center justify-center bg-[#111111] text-white px-8 py-3 rounded-full hover:bg-black transition-all shadow-sm active:scale-95"
                      title="Load More"
                    >
                      {isLoadingMore ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <div className="flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-75" />
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-150" />
                        </div>
                      )}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 font-medium pt-2">
                    All products loaded
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-over Drawer with Smooth Slide Transition */}
      <div
        className={`fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300 ${
          showMobileFilter ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ${
            showMobileFilter ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setShowMobileFilter(false)}
        />
        <div
          className={`relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between transform transition-transform duration-300 ease-out ${
            showMobileFilter ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-base font-bold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="p-1.5 text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close Filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
              }}
              onResetFilters={() => {
                handleResetFilters();
                setShowMobileFilter(false);
              }}
              currencySymbol="₹"
              maxPriceLimit={500}
            />
          </div>

          <div className="pt-6 border-t border-gray-100 mt-6">
            <button
              onClick={() => setShowMobileFilter(false)}
              className="w-full py-3 bg-[#111111] hover:bg-[#d0473e] text-white text-xs font-bold rounded-full uppercase tracking-wider transition-all"
            >
              Apply Filters ({filteredProducts.length})
            </button>
          </div>
        </div>
      </div>

    </GlozinLayout>
  );
}
