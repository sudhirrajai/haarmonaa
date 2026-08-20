import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, Search, Tag } from 'lucide-react';

export interface SearchableOption {
  id: number;
  name: string;
  subtext?: string;
  image?: string;
}

interface SearchableMultiSelectProps {
  label: string;
  options: SearchableOption[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
  emptyText?: string;
  icon?: React.ReactNode;
}

export const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  label,
  options = [],
  selectedIds = [],
  onChange,
  placeholder = 'Select options...',
  emptyText = 'No items found',
  icon,
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

  const toggleOption = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeOption = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedIds.filter((item) => item !== id));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opt.subtext && opt.subtext.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="relative w-full space-y-1.5" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
          {selectedIds.length > 0 && (
            <span className="px-2 py-0.2 bg-amber-100 text-amber-900 text-[10px] font-extrabold rounded-full">
              {selectedIds.length} Selected
            </span>
          )}
        </label>

        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] font-bold text-gray-400 hover:text-rose-600 transition-colors"
          >
            Clear Selections
          </button>
        )}
      </div>

      {/* Main Trigger Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[42px] bg-gray-50 hover:bg-gray-100/70 border rounded-2xl p-2 flex items-center justify-between gap-2 cursor-pointer transition-all ${
          isOpen ? 'border-black ring-1 ring-black/10 bg-white' : 'border-gray-200'
        }`}
      >
        {/* Selected Badges */}
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selectedIds.length > 0 ? (
            selectedIds.map((id) => {
              const opt = options.find((o) => o.id === id);
              if (!opt) return null;
              return (
                <span
                  key={opt.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#111111] text-white text-[11px] font-bold rounded-xl shadow-2xs animate-fade-in"
                >
                  {opt.image && (
                    <img src={opt.image} alt={opt.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                  )}
                  <span className="truncate max-w-[150px]">{opt.name}</span>
                  <button
                    type="button"
                    onClick={(e) => removeOption(opt.id, e)}
                    className="hover:text-amber-300 text-gray-400 p-0.5 rounded-full cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-xs text-gray-400 pl-1">{placeholder}</span>
          )}
        </div>

        {/* Dropdown Chevron */}
        <div className="flex items-center pr-1 flex-shrink-0 text-gray-400">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-black' : ''}`}
          />
        </div>
      </div>

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
              placeholder={`Search ${label.toLowerCase()}...`}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 pl-8 pr-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto space-y-1 pr-1 divide-y divide-gray-50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = selectedIds.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-gray-100 text-gray-900 font-bold'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {opt.image ? (
                        <img
                          src={opt.image}
                          alt={opt.name}
                          className="w-6 h-6 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                        />
                      ) : (
                        <Tag className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <span className="block truncate">{opt.name}</span>
                        {opt.subtext && (
                          <span className="block text-[10px] text-gray-400 font-normal truncate">
                            {opt.subtext}
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
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
              <div className="py-4 text-center text-xs text-gray-400">{emptyText}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
