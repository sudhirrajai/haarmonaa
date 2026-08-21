import React from 'react';
import { usePage } from '@inertiajs/react';

interface HaarmonaaLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  height?: number | string;
}

export const HaarmonaaLogo: React.FC<HaarmonaaLogoProps> = ({
  className = '',
  variant = 'light',
  height,
}) => {
  const { props } = usePage<{
    settings?: {
      store_name?: string;
      store_logo?: string;
      store_logo_dark?: string;
      header_logo_height?: number;
      footer_logo_height?: number;
    };
  }>();

  const settings = props.settings;

  const logoSrc =
    variant === 'dark' && settings?.store_logo_dark
      ? settings.store_logo_dark
      : settings?.store_logo || null;

  // Determine dynamic height
  const configuredHeight =
    height ??
    (variant === 'dark'
      ? settings?.footer_logo_height || 48
      : settings?.header_logo_height || 44);

  const styleHeight =
    typeof configuredHeight === 'number'
      ? `${configuredHeight}px`
      : configuredHeight;

  if (logoSrc) {
    return (
      <div
        className={`flex items-center select-none ${className}`}
        style={{ height: styleHeight }}
      >
        <img
          src={logoSrc}
          alt={settings?.store_name || 'Haarmonaa'}
          style={{ height: styleHeight }}
          className="w-auto object-contain transition-all"
        />
      </div>
    );
  }

  // Fallback to stylized luxury SVG logo
  const textColor = variant === 'dark' ? '#ffffff' : '#101e33';

  return (
    <div className={`flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 280 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Butterfly Icon Hovering Above M */}
        <g transform="translate(136, 2) scale(0.65)" fill={textColor}>
          {/* Left Wing */}
          <path d="M7 14C3 9 2 4 4 2c2-2 7 1 10 7-1-4 2-8 5-7 3 1 2 6-1 10 3-1 6 1 6 3s-4 3-7 2c-3 3-5 5-7 4-2-1-2-5 0-7z" opacity="0.85" />
          {/* Right Wing */}
          <path d="M21 14c4-5 5-10 3-12-2-2-7 1-10 7 1-4-2-8-5-7-3 1-2 6 1 10-3-1-6 1-6 3s4 3 7 2c3 3 5 5 7 4 2-1 2-5 0-7z" opacity="0.85" />
          {/* Antennae */}
          <path d="M12 8c-2-4-5-6-7-7M16 8c2-4 5-6 7-7" stroke={textColor} strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* HAARMONAA Stylized High-Fashion Typography */}
        <text
          x="10"
          y="32"
          fontFamily="'Playfair Display', 'Didot', 'Bodoni MT', 'Cinzel', Georgia, serif"
          fontSize="27"
          fontWeight="600"
          letterSpacing="0.12em"
          fill={textColor}
        >
          {settings?.store_name ? settings.store_name.toUpperCase() : 'HAARMONAA'}
        </text>

        {/* Flourish underline accent under H and last A */}
        <path
          d="M10 35 Q 25 39, 45 35"
          stroke={textColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M225 35 Q 245 39, 268 35"
          stroke={textColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};
