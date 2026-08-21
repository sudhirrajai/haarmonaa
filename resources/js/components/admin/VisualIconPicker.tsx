import React, { useState } from 'react';
import {
  Package,
  Truck,
  ShieldCheck,
  Award,
  MessageSquareText,
  Headphones,
  Gem,
  Sparkles,
  RotateCcw,
  Heart,
  Clock,
  Gift,
  Lock,
  Star,
  Percent,
  Tag,
  SunMedium,
  CheckCircle2,
  Search,
  Upload,
  X,
  Check,
} from 'lucide-react';
import { SingleImageUploader } from '@/components/admin/SingleImageUploader';

export interface IconOption {
  value: string;
  label: string;
  category?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ICON_LIBRARY: IconOption[] = [
  { value: 'Package', label: 'Package Box', icon: Package },
  { value: 'Truck', label: 'Express Delivery Truck', icon: Truck },
  { value: 'ShieldCheck', label: 'Guarantee / Warranty Shield', icon: ShieldCheck },
  { value: 'Award', label: 'Certified Quality Award', icon: Award },
  { value: 'MessageSquareText', label: '24/7 Concierge Chat', icon: MessageSquareText },
  { value: 'Headphones', label: 'VIP Customer Support', icon: Headphones },
  { value: 'Gem', label: 'Diamond / Gemstone', icon: Gem },
  { value: 'Sparkles', label: '18K Gold Sparkles', icon: Sparkles },
  { value: 'RotateCcw', label: 'Easy Returns & Refund', icon: RotateCcw },
  { value: 'Heart', label: 'Handcrafted with Love', icon: Heart },
  { value: 'Clock', label: '24/7 Fast Turnaround', icon: Clock },
  { value: 'Gift', label: 'Luxury Gift Packaging', icon: Gift },
  { value: 'Lock', label: '256-Bit SSL Secure Checkout', icon: Lock },
  { value: 'Star', label: '5-Star Luxury Rating', icon: Star },
  { value: 'Percent', label: 'Best Price Guarantee', icon: Percent },
  { value: 'Tag', label: 'Exclusive Designer Drop', icon: Tag },
  { value: 'SunMedium', label: 'Waterproof & Sweatproof', icon: SunMedium },
  { value: 'CheckCircle2', label: 'Hypoallergenic Certified', icon: CheckCircle2 },
];

export const getIconComponent = (iconName: string) => {
  const found = ICON_LIBRARY.find(
    (i) => i.value.toLowerCase() === (iconName || '').toLowerCase()
  );
  return found ? found.icon : Package;
};

interface VisualIconPickerProps {
  selectedIcon: string;
  customIconUrl?: string;
  onSelectIcon: (iconName: string) => void;
  onCustomIconChange: (url: string) => void;
}

export const VisualIconPicker: React.FC<VisualIconPickerProps> = ({
  selectedIcon,
  customIconUrl = '',
  onSelectIcon,
  onCustomIconChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>(
    customIconUrl ? 'upload' : 'library'
  );
  const [search, setSearch] = useState('');

  const filteredIcons = ICON_LIBRARY.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.value.toLowerCase().includes(search.toLowerCase())
  );

  const CurrentIcon = getIconComponent(selectedIcon);

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-bold text-gray-700">
        Card Icon <span className="text-[#d0473e]">*</span>
      </label>

      {/* Trigger Button with Visual Icon & Label */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex-1 flex items-center justify-between gap-3 p-2.5 bg-white border border-gray-200 hover:border-black rounded-[8px] transition-all cursor-pointer group text-left shadow-2xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Visual Icon Badge */}
            <div className="w-9 h-9 rounded-[6px] bg-amber-50 border border-amber-200/80 flex items-center justify-center text-gray-900 shrink-0 group-hover:scale-105 transition-transform">
              {customIconUrl ? (
                <img
                  src={customIconUrl}
                  alt="Custom Icon"
                  className="w-5 h-5 object-contain"
                />
              ) : (
                <CurrentIcon className="w-5 h-5 stroke-[1.5]" />
              )}
            </div>

            <div className="truncate">
              <span className="text-xs font-bold text-gray-900 block truncate">
                {customIconUrl
                  ? 'Custom Uploaded SVG / Icon'
                  : ICON_LIBRARY.find((i) => i.value === selectedIcon)?.label || selectedIcon}
              </span>
              <span className="text-[10px] text-gray-500 block">
                {customIconUrl ? 'SVG Custom Asset' : `Library: ${selectedIcon}`}
              </span>
            </div>
          </div>

          <span className="text-[11px] font-bold text-amber-700 hover:text-amber-800 shrink-0 px-2 py-1 bg-amber-50 rounded-[6px]">
            Change Icon
          </span>
        </button>
      </div>

      {/* Visual Modal Picker Popover */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-[12px] shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  Select or Upload Trust Badge Icon
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Choose from our curated fine jewelry icons or upload your own custom SVG.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Selector */}
            <div className="flex border-b border-gray-200 px-4 sm:px-5 pt-3 gap-2 bg-white">
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'library'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                Icon Library ({ICON_LIBRARY.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'upload'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom SVG</span>
                {customIconUrl && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
              {activeTab === 'library' ? (
                <>
                  {/* Search input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search icons (e.g. shipping, shield, diamond, returns)..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-[8px] py-2 pl-9 pr-3.5 text-xs text-gray-900 focus:outline-hidden focus:border-black focus:bg-white"
                    />
                  </div>

                  {/* Icon Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    {filteredIcons.map((item) => {
                      const IconComp = item.icon;
                      const isSelected = selectedIcon === item.value && !customIconUrl;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => {
                            onSelectIcon(item.value);
                            onCustomIconChange('');
                            setIsOpen(false);
                          }}
                          className={`p-3 rounded-[8px] border transition-all text-left flex items-center gap-3 cursor-pointer group ${
                            isSelected
                              ? 'bg-amber-50/80 border-amber-400 ring-1 ring-amber-400 shadow-2xs'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/80'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-amber-400 text-black'
                                : 'bg-gray-100 text-gray-800 group-hover:bg-black group-hover:text-white'
                            } transition-colors`}
                          >
                            <IconComp className="w-4 h-4 stroke-[1.6]" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-gray-900 block truncate leading-tight">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-gray-500 block truncate">
                              {item.value}
                            </span>
                          </div>

                          {isSelected && (
                            <Check className="w-4 h-4 text-amber-700 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {filteredIcons.length === 0 && (
                    <div className="text-center py-8 space-y-2">
                      <p className="text-xs text-gray-500">
                        No icon matching "<strong>{search}</strong>"
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className="text-xs font-bold text-amber-700 hover:underline"
                      >
                        Upload your custom SVG instead &rarr;
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Upload Custom SVG Tab */
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-[8px] text-xs text-amber-900 leading-relaxed">
                    <strong>Custom SVG / Image:</strong> Upload your own branded vector icon or illustration (SVG, PNG, WEBP). It will be rendered at crisp vector resolution in the Trust Badges section.
                  </div>

                  <SingleImageUploader
                    label="Upload Custom SVG or Paste URL"
                    hint="Recommended: Square SVG or transparent PNG (e.g. 64×64 px)"
                    placeholder="Upload SVG file or paste URL..."
                    value={customIconUrl}
                    onChange={(url) => {
                      onCustomIconChange(url);
                    }}
                  />

                  {customIconUrl && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-[8px]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[6px] bg-white border border-gray-200 flex items-center justify-center p-1.5">
                          <img
                            src={customIconUrl}
                            alt="Custom Icon Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-900 block">
                            Custom Icon Active
                          </span>
                          <span className="text-[11px] text-gray-500 truncate max-w-xs block">
                            {customIconUrl}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onCustomIconChange('')}
                        className="text-xs text-rose-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-2.5 bg-black hover:bg-[#d0473e] text-white rounded-[8px] text-xs font-bold transition-all cursor-pointer"
                    >
                      Apply Icon
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
