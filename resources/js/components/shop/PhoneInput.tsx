import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

export interface CountryInfo {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  digits: number;
  pattern?: RegExp;
  placeholder: string;
}

export const COUNTRIES: CountryInfo[] = [
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', digits: 10, pattern: /^[6-9]\d{9}$/, placeholder: '98765 43210' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', digits: 10, pattern: /^\d{10}$/, placeholder: '(555) 000-0000' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', digits: 10, pattern: /^\d{10,11}$/, placeholder: '7911 123456' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪', digits: 9, pattern: /^5\d{8}$/, placeholder: '50 123 4567' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', digits: 10, pattern: /^\d{10}$/, placeholder: '(555) 000-0000' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', digits: 9, pattern: /^4\d{8}$/, placeholder: '412 345 678' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', digits: 8, pattern: /^[89]\d{7}$/, placeholder: '8123 4567' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', digits: 9, pattern: /^5\d{8}$/, placeholder: '50 123 4567' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', digits: 11, pattern: /^\d{10,11}$/, placeholder: '151 23456789' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', digits: 9, pattern: /^[67]\d{8}$/, placeholder: '6 12 34 56 78' },
];

interface PhoneInputProps {
  value?: string;
  onChange: (fullNumber: string, isValid: boolean) => void;
  error?: string;
  required?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  error,
  required = false,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(COUNTRIES[0]); // Default to India
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-detect country based on Timezone & IP
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes('Kolkata') || tz.includes('Calcutta') || tz.includes('IST') || tz.includes('Asia/Colombo')) {
        setSelectedCountry(COUNTRIES.find((c) => c.code === 'IN') || COUNTRIES[0]);
      } else if (tz.includes('New_York') || tz.includes('Chicago') || tz.includes('Los_Angeles') || tz.includes('Denver')) {
        setSelectedCountry(COUNTRIES.find((c) => c.code === 'US') || COUNTRIES[0]);
      } else if (tz.includes('London')) {
        setSelectedCountry(COUNTRIES.find((c) => c.code === 'GB') || COUNTRIES[0]);
      } else if (tz.includes('Dubai')) {
        setSelectedCountry(COUNTRIES.find((c) => c.code === 'AE') || COUNTRIES[0]);
      } else {
        // Fallback or IP detect
        fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(2000) })
          .then((res) => res.json())
          .then((data) => {
            if (data?.country_code) {
              const matched = COUNTRIES.find((c) => c.code === data.country_code);
              if (matched) setSelectedCountry(matched);
            }
          })
          .catch(() => {});
      }
    } catch {
      // Default to India
      setSelectedCountry(COUNTRIES[0]);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, selectedCountry.digits);
    setPhoneNumber(raw);

    const full = raw ? `${selectedCountry.dialCode} ${raw}` : '';
    const isValid = selectedCountry.pattern ? selectedCountry.pattern.test(raw) : raw.length >= 8;
    onChange(full, raw.length > 0 ? isValid : !required);
  };

  const selectCountry = (country: CountryInfo) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearch('');
    const full = phoneNumber ? `${country.dialCode} ${phoneNumber}` : '';
    const isValid = country.pattern ? country.pattern.test(phoneNumber) : phoneNumber.length >= 8;
    onChange(full, phoneNumber.length > 0 ? isValid : !required);
  };

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <div className="relative flex items-center bg-white border border-gray-200/90 rounded-2xl focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
        {/* Country Flag & Dial Code Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 pl-4 pr-2.5 py-3.5 border-r border-gray-200 hover:bg-gray-50 rounded-l-2xl transition-colors cursor-pointer text-sm font-semibold text-gray-800 flex-shrink-0 select-none"
        >
          <span className="text-lg leading-none">{selectedCountry.flag}</span>
          <span className="text-xs font-bold text-gray-900">{selectedCountry.dialCode}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {/* Phone Input */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={selectedCountry.placeholder || 'Phone number'}
          className="w-full bg-transparent border-none py-3.5 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden"
        />

        {/* Dropdown Popover */}
        {isOpen && (
          <div className="absolute left-0 top-full mt-2 w-72 max-h-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col animate-fade-in">
            {/* Search Box inside Dropdown */}
            <div className="p-2.5 border-b border-gray-100 bg-gray-50/70">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5">
                <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country or code..."
                  className="w-full bg-transparent border-none text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden p-0"
                  autoFocus
                />
              </div>
            </div>

            {/* Country Options List */}
            <div className="overflow-y-auto divide-y divide-gray-50 py-1">
              {filteredCountries.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => selectCountry(c)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-gray-50 cursor-pointer ${
                    selectedCountry.code === c.code ? 'bg-amber-50/60 font-bold text-black' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 font-mono text-[11px] flex-shrink-0">
                    <span>{c.dialCode}</span>
                    {selectedCountry.code === c.code && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />}
                  </div>
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <div className="py-4 text-center text-xs text-gray-400">No countries found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Validation Message */}
      {phoneNumber && selectedCountry.pattern && !selectedCountry.pattern.test(phoneNumber) && (
        <span className="text-amber-700 text-[11px] ml-2 block">
          {selectedCountry.code === 'IN'
            ? 'Please enter a valid 10-digit Indian phone number (starts with 6, 7, 8, or 9)'
            : `Please enter a valid ${selectedCountry.digits}-digit phone number for ${selectedCountry.name}`}
        </span>
      )}

      {error && <span className="text-[#d0473e] text-xs mt-1 ml-2 block">{error}</span>}
    </div>
  );
};
