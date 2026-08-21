import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, X, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/types/shop';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

const DEFAULT_JEWELRY_TAGS = [
  'Gold Necklace',
  'Solitaire Ring',
  'Diamond Earrings',
  'Pearl Choker',
  '18K Gold Bracelet',
  'Anti-Tarnish Anklet',
  'Gemstone Pendant',
  'Statement Hoops',
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, products }) => {
  if (!isOpen) return null;

  const { settings } = (usePage().props as any) || {};
  const initialPopular: string[] =
    settings?.popular_search_keywords && settings.popular_search_keywords.length > 0
      ? settings.popular_search_keywords
      : DEFAULT_JEWELRY_TAGS;

  const currencySymbol = settings?.currency_symbol || '₹';

  const [query, setQuery] = useState('');
  const [popularKeywords, setPopularKeywords] = useState<string[]>(initialPopular);
  const logTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync popular keywords if updated from props
  useEffect(() => {
    if (settings?.popular_search_keywords && settings.popular_search_keywords.length > 0) {
      setPopularKeywords(settings.popular_search_keywords);
    }
  }, [settings?.popular_search_keywords]);

  const filteredProducts =
    query.trim() === ''
      ? []
      : products.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            (p.category_name && p.category_name.toLowerCase().includes(query.toLowerCase())) ||
            (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
        );

  // Function to log search query to backend
  const logSearchQuery = async (searchStr: string, count: number) => {
    const trimmed = searchStr.trim();
    if (trimmed.length < 2) return;

    try {
      const csrfToken =
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

      const response = await fetch('/api/search/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: trimmed,
          results_count: count,
        }),
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.popular) && data.popular.length > 0) {
        setPopularKeywords(data.popular);
      }
    } catch {
      // Silently ignore logging network errors
    }
  };

  // Debounced auto-log when user stops typing
  const handleQueryChange = (val: string) => {
    setQuery(val);

    if (logTimerRef.current) {
      clearTimeout(logTimerRef.current);
    }

    if (val.trim().length >= 2) {
      logTimerRef.current = setTimeout(() => {
        const count = products.filter(
          (p) =>
            p.name.toLowerCase().includes(val.toLowerCase()) ||
            (p.category_name && p.category_name.toLowerCase().includes(val.toLowerCase())) ||
            (p.category && p.category.toLowerCase().includes(val.toLowerCase()))
        ).length;
        logSearchQuery(val, count);
      }, 1200);
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    const count = products.filter(
      (p) =>
        p.name.toLowerCase().includes(tag.toLowerCase()) ||
        (p.category_name && p.category_name.toLowerCase().includes(tag.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(tag.toLowerCase()))
    ).length;
    logSearchQuery(tag, count);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="relative max-w-3xl mx-auto mt-16 px-4 z-10">
        <div className="bg-white rounded-[12px] shadow-2xl overflow-hidden animate-fade-in border border-gray-100">
          {/* Search Header */}
          <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <Search className="w-5 h-5 text-[#d0473e] shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search jewelry, styles, collections (e.g. Gold Necklace, Solitaire Ring, Diamond Earrings)..."
              className="w-full bg-transparent border-none text-sm sm:text-base font-semibold text-gray-900 placeholder-gray-400 focus:outline-hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-xs text-gray-400 hover:text-black font-semibold mr-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-black rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Body */}
          <div className="p-5 sm:p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {query.trim() === '' ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-400">
                  <TrendingUp className="w-4 h-4 text-[#d0473e]" />
                  <span>Popular Search Keywords</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {popularKeywords.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className="px-3.5 py-1.5 bg-gray-100 hover:bg-[#111111] hover:text-white rounded-[8px] text-xs font-semibold text-gray-800 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-400">
                  <span>Found {filteredProducts.length} Results for "{query}"</span>
                  {filteredProducts.length > 0 && (
                    <Link
                      href={`/shop?search=${encodeURIComponent(query)}`}
                      onClick={onClose}
                      className="text-[#d0473e] hover:underline normal-case font-bold"
                    >
                      View all in Shop &rarr;
                    </Link>
                  )}
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <p className="text-sm text-gray-500 font-medium">
                      No fine jewelry matching "<strong>{query}</strong>".
                    </p>
                    <p className="text-xs text-gray-400">
                      Try searching for "Gold Necklace", "Solitaire Ring", or "Diamond Earrings".
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {filteredProducts.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        onClick={onClose}
                        className="flex gap-3.5 p-3 rounded-[10px] border border-gray-100 hover:border-[#d0473e] hover:shadow-md transition-all group bg-white"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300&auto=format&fit=crop';
                          }}
                          className="w-16 h-18 object-cover rounded-[6px] bg-gray-50 shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#d0473e] truncate">
                            {p.category_name || p.category || 'Fine Jewelry'}
                          </span>
                          <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#d0473e] transition-colors truncate">
                            {p.name}
                          </h4>
                          <span className="text-xs font-extrabold text-gray-900 mt-1">
                            {currencySymbol}
                            {Number(p.price).toLocaleString('en-IN', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer View Catalog Link */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center flex items-center justify-center">
            <Link
              href={query ? `/shop?search=${encodeURIComponent(query)}` : '/shop'}
              onClick={onClose}
              className="text-xs font-bold text-gray-700 hover:text-[#d0473e] inline-flex items-center gap-1.5 uppercase tracking-wider transition-colors"
            >
              <span>Explore All Catalog Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
