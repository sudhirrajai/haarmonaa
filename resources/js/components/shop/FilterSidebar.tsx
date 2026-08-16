import React, { useState } from 'react';
import { Minus, Plus, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { Category, FilterState } from '@/types/shop';

interface FilterSidebarProps {
  categories: Category[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  currencySymbol?: string;
  maxPriceLimit?: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  filters,
  onFilterChange,
  onResetFilters,
  currencySymbol = '₹',
  maxPriceLimit = 500,
}) => {
  // Accordion open/close states
  const [openCategories, setOpenCategories] = useState(true);
  const [openAvailability, setOpenAvailability] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);

  // Subcategory expand states
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    earrings: true,
    rings: true,
  });

  const toggleSubcat = (catSlug: string) => {
    setExpandedCats((prev) => ({
      ...prev,
      [catSlug]: !prev[catSlug],
    }));
  };

  return (
    <aside className="w-full space-y-7 select-none">
      {/* 1. Products Category Section */}
      <div className="border-b border-gray-200/80 pb-6">
        <button
          onClick={() => setOpenCategories(!openCategories)}
          className="w-full flex items-center justify-between py-1 text-left group"
        >
          <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">
            Products Category
          </h3>
          <span className="text-gray-600 group-hover:text-black">
            {openCategories ? <Minus className="w-4 h-4 stroke-[2.2]" /> : <Plus className="w-4 h-4 stroke-[2.2]" />}
          </span>
        </button>

        {openCategories && (
          <div className="mt-4 space-y-2 text-[13.5px] font-medium text-gray-700">
            {/* All Products option */}
            <button
              onClick={() => onFilterChange({ ...filters, category: 'all' })}
              className={`w-full text-left py-1 px-1 rounded-sm flex items-center justify-between transition-colors ${
                filters.category === 'all'
                  ? 'text-[#111111] font-bold'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <span>All Categories</span>
            </button>

            {categories.map((cat) => {
              const isActive = filters.category === cat.slug;
              const hasSub = cat.subcategories && cat.subcategories.length > 0;
              const isExpanded = expandedCats[cat.slug];

              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between py-1 px-1 rounded-sm">
                    <button
                      onClick={() => onFilterChange({ ...filters, category: cat.slug })}
                      className={`text-left transition-colors flex-1 ${
                        isActive
                          ? 'text-[#111111] font-bold'
                          : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      <span>{cat.name}</span>{' '}
                      <span className="text-gray-400 font-normal">({cat.itemCount})</span>
                    </button>

                    {hasSub && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSubcat(cat.slug);
                        }}
                        className="p-1 text-gray-400 hover:text-black"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Subcategories list */}
                  {hasSub && isExpanded && (
                    <div className="pl-4 space-y-1.5 pt-1 border-l border-gray-100 ml-2">
                      {cat.subcategories!.map((sub) => (
                        <button
                          key={sub.slug}
                          onClick={() => onFilterChange({ ...filters, category: sub.slug })}
                          className={`w-full text-left py-0.5 text-xs transition-colors flex justify-between ${
                            filters.category === sub.slug
                              ? 'text-[#111111] font-bold'
                              : 'text-gray-500 hover:text-black'
                          }`}
                        >
                          <span>{sub.name}</span>
                          <span className="text-gray-400">({sub.count})</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Availability Section */}
      <div className="border-b border-gray-200/80 pb-6">
        <button
          onClick={() => setOpenAvailability(!openAvailability)}
          className="w-full flex items-center justify-between py-1 text-left group"
        >
          <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">
            Availability
          </h3>
          <span className="text-gray-600 group-hover:text-black">
            {openAvailability ? <Minus className="w-4 h-4 stroke-[2.2]" /> : <Plus className="w-4 h-4 stroke-[2.2]" />}
          </span>
        </button>

        {openAvailability && (
          <div className="mt-4 space-y-3 text-[13.5px] text-gray-700">
            {/* On Sale */}
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onSaleOnly}
                onChange={(e) =>
                  onFilterChange({ ...filters, onSaleOnly: e.target.checked })
                }
                className="w-4 h-4 rounded-xs border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
              />
              <span className={filters.onSaleOnly ? 'font-bold text-gray-900' : 'text-gray-600'}>
                On sale
              </span>
            </label>

            {/* In Stock */}
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) =>
                  onFilterChange({ ...filters, inStockOnly: e.target.checked })
                }
                className="w-4 h-4 rounded-xs border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
              />
              <span className={filters.inStockOnly ? 'font-bold text-gray-900' : 'text-gray-600'}>
                In stock
              </span>
            </label>
          </div>
        )}
      </div>

      {/* 3. Price Section */}
      <div className="border-b border-gray-200/80 pb-6">
        <button
          onClick={() => setOpenPrice(!openPrice)}
          className="w-full flex items-center justify-between py-1 text-left group"
        >
          <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">
            Price
          </h3>
          <span className="text-gray-600 group-hover:text-black">
            {openPrice ? <Minus className="w-4 h-4 stroke-[2.2]" /> : <Plus className="w-4 h-4 stroke-[2.2]" />}
          </span>
        </button>

        {openPrice && (
          <div className="mt-4 space-y-4">
            {/* Inputs Row: [ ₹ 0 ] — [ ₹ 230 ] */}
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center border border-gray-200 rounded-md px-3 py-2 bg-white">
                <span className="text-xs text-gray-500 mr-1.5">{currencySymbol}</span>
                <input
                  type="number"
                  min="0"
                  max={filters.maxPrice}
                  value={filters.minPrice}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      minPrice: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="w-full text-xs font-semibold text-gray-900 bg-transparent border-none focus:outline-hidden p-0"
                />
              </div>

              <span className="text-gray-400 font-bold">—</span>

              <div className="flex-1 flex items-center border border-gray-200 rounded-md px-3 py-2 bg-white">
                <span className="text-xs text-gray-500 mr-1.5">{currencySymbol}</span>
                <input
                  type="number"
                  min={filters.minPrice}
                  max={maxPriceLimit}
                  value={filters.maxPrice}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      maxPrice: Math.min(maxPriceLimit, Number(e.target.value) || maxPriceLimit),
                    })
                  }
                  className="w-full text-xs font-semibold text-gray-900 bg-transparent border-none focus:outline-hidden p-0"
                />
              </div>
            </div>

            {/* Slider Track */}
            <div className="pt-2">
              <input
                type="range"
                min="0"
                max={maxPriceLimit}
                step="10"
                value={filters.maxPrice}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    maxPrice: Number(e.target.value),
                  })
                }
                className="w-full accent-black cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
              />
            </div>

            {/* Label Underneath */}
            <div className="text-[13px] text-gray-800 font-semibold pt-1">
              Price:{' '}
              <span className="font-bold text-gray-900">
                {currencySymbol}{filters.minPrice} — {currencySymbol}{filters.maxPrice}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Reset Filter Button */}
      {(filters.category !== 'all' || filters.onSaleOnly || filters.inStockOnly || filters.minPrice > 0 || filters.maxPrice < maxPriceLimit) && (
        <button
          onClick={onResetFilters}
          className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-gray-700 bg-gray-100 hover:bg-black hover:text-white rounded-md transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear All Filters</span>
        </button>
      )}
    </aside>
  );
};
