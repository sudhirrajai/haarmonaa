import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: SortOption[];
}

const defaultOptions: SortOption[] = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Average rating' },
  { value: 'price-low', label: 'Price, low to high' },
  { value: 'price-high', label: 'Price, high to low' },
  { value: 'date-new', label: 'Date, new to old' },
  { value: 'date-old', label: 'Date, old to new' },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  onChange,
  options = defaultOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[4];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left select-none" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[14.5px] font-semibold text-gray-900 hover:text-black py-1.5 focus:outline-hidden group"
      >
        <span className="text-gray-600 font-normal">Sort by:</span>
        <span className="font-bold text-gray-900">{selectedOption.label}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-700 stroke-[2]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-700 stroke-[2]" />
        )}
      </button>

      {/* Floating Custom Menu Panel */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-52 sm:w-56 max-w-[85vw] bg-white rounded-2xl shadow-2xl border border-gray-100/80 py-3.5 px-2 z-50 animate-fade-in transition-all">
          <div className="space-y-1">

            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-[14.5px] transition-colors ${
                    isSelected
                      ? 'font-bold text-black bg-gray-50/80'
                      : 'text-gray-600 hover:text-black hover:bg-gray-50/50 font-normal'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
