import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, Search, FolderTree, CornerDownRight, Layers } from 'lucide-react';

interface CategoryItem {
  id: number;
  name: string;
  slug?: string;
  image?: string;
  parent_id?: number | null;
  parent?: {
    id: number;
    name: string;
  } | null;
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

  // Group top-level categories and their children
  const topLevelCategories = categories.filter((c) => !c.parent_id);
  const childCategories = categories.filter((c) => Boolean(c.parent_id));

  // Build hierarchical list
  const structuredList: { item: CategoryItem; isChild: boolean; parentName?: string }[] = [];
  topLevelCategories.forEach((parent) => {
    structuredList.push({ item: parent, isChild: false });
    const children = childCategories.filter((c) => c.parent_id === parent.id);
    children.forEach((child) => {
      structuredList.push({ item: child, isChild: true, parentName: parent.name });
    });
  });

  // Include any orphan children whose parents aren't in topLevelCategories
  childCategories.forEach((child) => {
    const alreadyIncluded = structuredList.some((s) => s.item.id === child.id);
    if (!alreadyIncluded) {
      const parent = categories.find((c) => c.id === child.parent_id);
      structuredList.push({ item: child, isChild: true, parentName: parent?.name });
    }
  });

  // Filter based on search query
  const filteredList = structuredList.filter(({ item, parentName }) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      (parentName && parentName.toLowerCase().includes(term))
    );
  });

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
              const parent = cat.parent_id ? categories.find((p) => p.id === cat.parent_id) : null;
              return (
                <span
                  key={cat.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#111111] text-white text-[11px] font-bold rounded-xl shadow-2xs animate-fade-in"
                >
                  {parent && (
                    <span className="text-gray-400 font-normal">
                      {parent.name} →
                    </span>
                  )}
                  <span>{cat.name}</span>
                  {selectedCategoryIds.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => removeCategory(cat.id, e)}
                      className="hover:text-amber-300 text-gray-400 p-0.5 rounded-full cursor-pointer"
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
              placeholder="Search category (e.g. Rings, Hoops)..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 pl-8 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Category List */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
            {filteredList.length > 0 ? (
              filteredList.map(({ item: cat, isChild, parentName }) => {
                const isSelected = selectedCategoryIds.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                      isChild ? 'ml-4 pl-3 border-l-2 border-amber-200 bg-gray-50/50' : ''
                    } ${
                      isSelected
                        ? 'bg-amber-50 text-gray-900 font-bold border border-amber-300'
                        : 'text-gray-700 hover:bg-gray-100/80 hover:text-black'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isChild ? (
                        <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          <CornerDownRight className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-md bg-gray-200 text-gray-700 flex items-center justify-center shrink-0">
                          <Layers className="w-3 h-3" />
                        </div>
                      )}

                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-6 h-6 rounded-lg object-cover bg-gray-100 shrink-0"
                        />
                      ) : null}

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`${isChild ? 'font-medium' : 'font-bold'} truncate`}>
                            {cat.name}
                          </span>
                          <span
                            className={`text-[9.5px] px-1.5 py-0.2 rounded-md font-semibold ${
                              isChild
                                ? 'bg-amber-100/80 text-amber-900'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {isChild ? 'Subcategory' : 'Main'}
                          </span>
                        </div>
                        {isChild && parentName && (
                          <span className="text-[10px] text-gray-400 block truncate">
                            Parent: {parentName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
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
