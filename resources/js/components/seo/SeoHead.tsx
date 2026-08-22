import React from 'react';
import { Head } from '@inertiajs/react';

export interface BreadcrumbItem {
  label: string;
  url: string;
}

export interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  noIndex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  noIndex = false,
  breadcrumbs = [],
  structuredData,
}) => {
  const storeName = 'Haarmonaa';
  const defaultTagline = '18K Anti-Tarnish Gold Vermeil Jewelry';
  const defaultDesc =
    'Haarmonaa Fine Jewelry — Everyday luxury handcrafted from 18K thick solid gold vermeil. 100% waterproof, anti-tarnish, hypoallergenic, and sweatproof for sensitive skin.';
  const defaultOgImage = 'https://haarmonaa.vmcore.in/wp-content/uploads/2026/01/1.png';

  // Format full title
  let fullTitle = title || `${storeName} — ${defaultTagline}`;
  if (title && !title.includes(storeName)) {
    fullTitle = `${title} | ${storeName}`;
  }

  const metaDesc = description || defaultDesc;
  const metaImage = ogImage || defaultOgImage;

  // Derive Canonical URL safely
  let currentUrl = canonical;
  if (!currentUrl && typeof window !== 'undefined') {
    currentUrl = window.location.origin + window.location.pathname;
  }

  // Generate Breadcrumbs Schema if provided
  const breadcrumbsSchema =
    breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.label,
            item: crumb.url.startsWith('http')
              ? crumb.url
              : (typeof window !== 'undefined' ? window.location.origin : 'https://haarmonaa.vmcore.in') + crumb.url,
          })),
        }
      : null;

  // Combine schemas
  const schemas: any[] = [];
  if (breadcrumbsSchema) {
    schemas.push(breadcrumbsSchema);
  }
  if (structuredData) {
    if (Array.isArray(structuredData)) {
      schemas.push(...structuredData);
    } else {
      schemas.push(structuredData);
    }
  }

  return (
    <Head>
      {/* Basic Primary Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Canonical Link */}
      {currentUrl && <link rel="canonical" href={currentUrl} />}

      {/* OpenGraph / Facebook */}
      <meta property="og:site_name" content={storeName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type" content={ogType} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      {metaImage && <meta property="og:image" content={metaImage} />}
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@haarmonaa" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      {metaImage && <meta name="twitter:image" content={metaImage} />}

      {/* Schema.org Structured Data */}
      {schemas.map((schemaObj, idx) => (
        <script
          key={`schema-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObj) }}
        />
      ))}
    </Head>
  );
};
