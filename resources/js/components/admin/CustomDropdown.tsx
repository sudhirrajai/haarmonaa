import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string | number;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface CustomDropdownProps {
  value: string | number;
  options: DropdownOption[];
  onChange: (value: any) => void;
  icon?: React.ComponentType<{ className?: string }>;
  prefix?: string;
  className?: string;
  buttonClassName?: string;
  menuWidth?: string;
  align?: 'left' | 'right';
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  options,
  onChange,
  icon: TriggerIcon,
  prefix,
  className = '',
  buttonClassName = '',
  menuWidth = 'w-48',
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => String(opt.value) === String(value)) || options[0];
  const SelectedIcon = selectedOption?.icon;

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-between gap-2 px-3.5 py-2 bg-white hover:bg-gray-50/90 text-gray-800 border border-gray-200/90 rounded-[8px] text-xs font-bold transition-all shadow-2xs hover:border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-black/10 cursor-pointer ${
          isOpen ? 'border-black ring-2 ring-black/10 bg-gray-50' : ''
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate">
          {TriggerIcon ? (
            <TriggerIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          ) : SelectedIcon ? (
            <SelectedIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          ) : null}

          {prefix && <span className="text-gray-400 font-medium">{prefix}:</span>}
          <span className="truncate">{selectedOption?.label}</span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-black' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-1.5 ${menuWidth} bg-white rounded-[10px] border border-gray-200/90 shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100 divide-y divide-gray-50`}
        >
          <div className="py-0.5 max-h-64 overflow-y-auto">
            {options.map((option) => {
              const isSelected = String(option.value) === String(value);
              const OptionIcon = option.icon;

              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-gray-100/80 text-gray-900 font-bold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-black font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {OptionIcon && (
                      <OptionIcon
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? 'text-black' : 'text-gray-400'
                        }`}
                      />
                    )}
                    <span className="truncate">{option.label}</span>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-black shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
