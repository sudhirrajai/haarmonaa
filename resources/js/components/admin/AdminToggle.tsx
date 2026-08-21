import React from 'react';

interface AdminToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  activeColor?: string; // default emerald or black
  className?: string;
}

export const AdminToggle: React.FC<AdminToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  size = 'md',
  disabled = false,
  activeColor = 'bg-black',
  className = '',
}) => {
  const switchSizes = {
    sm: {
      track: 'w-8 h-4.5 p-0.5',
      thumb: 'w-3.5 h-3.5',
      translate: 'translate-x-3.5',
    },
    md: {
      track: 'w-11 h-6 p-0.5',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      track: 'w-14 h-7.5 p-1',
      thumb: 'w-5.5 h-5.5',
      translate: 'translate-x-6.5',
    },
  }[size];

  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`flex items-start justify-between gap-3 select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group'
      } ${className}`}
    >
      {(label || description) && (
        <div className="flex-1 min-w-0 pr-2">
          {label && (
            <span className="text-xs font-bold text-gray-900 group-hover:text-black transition-colors block">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-gray-500 block mt-0.5 leading-snug">
              {description}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onChange(!checked);
        }}
        className={`relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
          switchSizes.track
        } ${checked ? activeColor : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        <span
          className={`pointer-events-none inline-block rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out transform ${
            switchSizes.thumb
          } ${checked ? switchSizes.translate : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
};
