import React from 'react';

export interface CustomHtmlSettings {
  html_content?: string;
  container_width?: 'full' | 'boxed';
  bg_color?: string;
  padding_y?: 'small' | 'medium' | 'large' | 'none';
}

interface CustomHtmlSectionProps {
  settings?: CustomHtmlSettings;
}

export const CustomHtmlSection: React.FC<CustomHtmlSectionProps> = ({ settings = {} }) => {
  const {
    html_content = '<div class="text-center py-8"><p class="text-gray-500 font-medium">Custom HTML / Marketing Embed Block</p></div>',
    container_width = 'boxed',
    bg_color = '#ffffff',
    padding_y = 'medium',
  } = settings;

  const paddingClass = {
    none: 'py-0',
    small: 'py-6 sm:py-8',
    medium: 'py-12 sm:py-16',
    large: 'py-16 sm:py-24',
  }[padding_y] || 'py-12 sm:py-16';

  return (
    <section style={{ backgroundColor: bg_color }} className={`${paddingClass} overflow-hidden`}>
      <div className={container_width === 'boxed' ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' : 'w-full'}>
        <div
          dangerouslySetInnerHTML={{ __html: html_content }}
          className="custom-html-wrapper"
        />
      </div>
    </section>
  );
};
