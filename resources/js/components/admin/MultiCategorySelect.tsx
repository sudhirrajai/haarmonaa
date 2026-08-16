import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, Search, FolderTree } from 'lucide-react';

interface CategoryItem {
  id: number;
  name: string;
  slug?: string;
  image?: string;
}

interface MultiCategorySelectProps {
  categories: CategoryItem[];
  selectedCategoryIds: number[];
  onChange: (ids: number[]) => void;
  error?: string;
}

export const MultiCategorySelect: React.FC<MultiCategorySelectProps> = ({
  categories = [],
  selectedCategoryIds = [],
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCategory = (id: number) => {
    if (selectedCategoryIds.includes(id)) {
      if (selectedCategoryIds.length > 1) {
        onChange(selectedCategoryIds.filter((item) => item !== id));
      }
    } else {
      onChange([...selectedCategoryIds, id]);
    }
  };

  const removeCategory = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedCategoryIds.length > 1) {
      onChange(selectedCategoryIds.filter((item) => item !== id));
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="block text-xs font-bold text-gray-700 mb-1.5">
        Categories (Multi-Select) <span className="text-[#d0473e]">*</span>
      </label>

      {/* Main Trigger Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[42px] bg-gray-50 hover:bg-gray-100/70 border rounded-2xl p-2 flex items-center justify-between gap-2 cursor-pointer transition-all ${
          isOpen
            ? 'border-black ring-1 ring-black/10 bg-white'
            : error
            ? 'border-rose-400'
            : 'border-gray-200'
        }`}
      >
        {/* Selected Category Badges */}
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selectedCategoryIds.length > 0 ? (
            selectedCategoryIds.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              if (!cat) return null;
              return (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#111111] text-white text-[11px] font-bold rounded-xl shadow-2xs animate-fade-in"
                >
                  <span>{cat.name}</span>
                  {selectedCategoryIds.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => removeCategory(cat.id, e)}
                      className="hover:text-amber-300 text-gray-400 p-0.5 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              );
            })
          ) : (
            <span className="text-xs text-gray-400 pl-1">Select one or more categories...</span>
          )}
        </div>

        {/* Dropdown Chevron */}
        <div className="flex items-center pr-1 flex-shrink-0 text-gray-400">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-black' : ''}`}
          />
        </div>
      </div>

      {error && <span className="text-rose-500 text-[11px] mt-1 block">{error}</span>}

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200/90 rounded-2xl shadow-xl z-50 p-2 space-y-2 animate-fade-in">
          {/* Search Box */}
          <div className="relative px-1">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search category..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 pl-8 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Category List */}
          <div className="max-h-52 overflow-y-auto space-y-1 pr-1 divide-y divide-gray-50">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-gray-100 text-gray-900 font-bold'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-6 h-6 rounded-lg object-cover bg-gray-100"
                        />
                      ) : (
                        <FolderTree className="w-4 h-4 text-gray-400" />
                      )}
                      <span>{cat.name}</span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#111111] border-[#111111] text-amber-300'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-gray-400">No categories found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
