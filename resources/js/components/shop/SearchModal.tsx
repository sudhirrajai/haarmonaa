import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react';
import { Product } from '@/types/shop';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, products }) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const trendingTags = ['Denim Jacket', 'Silk Cardigan', 'Leather Bag', 'Pleated Trousers', 'Loafers', 'Cashmere'];

  const filteredProducts = query.trim() === ''
    ? []
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="relative max-w-3xl mx-auto mt-16 px-4 z-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in border border-gray-100">
          {/* Search Header */}
          <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <Search className="w-6 h-6 text-[#d0473e]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, categories, styles (e.g. Leather, Denim, Silk)..."
              className="w-full bg-transparent border-none text-base font-semibold text-gray-900 placeholder-gray-400 focus:outline-hidden"
            />
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Body */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {query.trim() === '' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <TrendingUp className="w-4 h-4 text-[#d0473e]" />
                  <span>Popular Search Keywords</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3.5 py-1.5 bg-gray-100 hover:bg-[#111111] hover:text-white rounded-full text-xs font-semibold text-gray-700 transition-all"
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
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-sm text-gray-500">
                    No products matching your search term. Try searching for "Denim", "Leather", or "Silk".
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        onClick={onClose}
                        className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:border-[#d0473e] hover:shadow-md transition-all group"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-16 h-20 object-cover rounded-lg bg-gray-50"
                        />
                        <div className="flex-1 flex flex-col justify-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#d0473e]">
                            {p.category}
                          </span>
                          <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#d0473e] transition-colors line-clamp-1">
                            {p.name}
                          </h4>
                          <span className="text-xs font-extrabold text-gray-900 mt-1">
                            ${p.price.toFixed(2)}
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
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
            <Link
              href="/shop"
              onClick={onClose}
              className="text-xs font-bold text-gray-700 hover:text-[#d0473e] inline-flex items-center gap-1 uppercase tracking-wider"
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
