import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { ProductCard } from '@/components/shop/ProductCard';
import { SeoHead } from '@/components/seo/SeoHead';
import { Product } from '@/types/shop';
import { useCart } from '@/context/CartContext';

import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Ruler,
  X,
  Flame,
  Lock,
  Plus,
  Tag,
  Package,
} from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
  onAddToCart?: (product: Product, color?: string, size?: string, quantity?: number) => void;
  onQuickView?: (product: Product) => void;
}

export default function ProductDetail({
  product,
  relatedProducts = [],
  onAddToCart,
  onQuickView,
}: ProductDetailProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  if (!product) {
    return (
      <GlozinLayout allProducts={relatedProducts}>
        <Head title="Product Not Found — Haarmonaa" />
        <div className="py-24 text-center max-w-md mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Jewelry Item Not Found</h2>
          <p className="text-xs text-gray-500">The product you are looking for may have been updated or relocated.</p>
          <Link
            href="/shop"
            className="inline-block bg-[#111111] hover:bg-[#d0473e] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
          >
            Browse All Jewelry
          </Link>
        </div>
      </GlozinLayout>
    );
  }

  // Collect all unique gallery images
  const allImages = [
    ...(product.images || []),
    product.image,
    ...(product.secondaryImage ? [product.secondaryImage] : []),
    ...(product.variants?.map((v) => v.image).filter(Boolean) || []),
  ];
  const uniqueImages = Array.from(new Set(allImages.filter(Boolean))) as string[];

  const [activeImage, setActiveImage] = useState(uniqueImages[0] || product.image);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [upsellAdded, setUpsellAdded] = useState(false);

  // Accordion State inside Sidebar (Description, Shipping, Returns)
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    description: true,
    shipping: false,
    returns: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Frequently Bought Together checkbox selections (Only if Admin explicitly selected upsell products)
  const explicitUpsellProducts =
    product.upsellIds && product.upsellIds.length > 0
      ? relatedProducts.filter((p) => product.upsellIds?.includes(p.id))
      : [];
  const upsellItem = explicitUpsellProducts[0] || null;
  const upsellItem2 = explicitUpsellProducts[1] || null;
  const hasUpsells = explicitUpsellProducts.length > 0;

  const [selectedBundleItems, setSelectedBundleItems] = useState<{ [key: string]: boolean }>({
    main: true,
    upsell1: true,
    upsell2: false,
  });

  // Dynamic Attribute Options from Variants
  const variants = product.variants || [];

  // Extract unique attribute keys (e.g. "Metal Finish", "Ring Size")
  const attributeKeys: string[] = [];
  variants.forEach((v) => {
    if (v.attributes && typeof v.attributes === 'object') {
      Object.keys(v.attributes).forEach((k) => {
        if (!attributeKeys.includes(k)) attributeKeys.push(k);
      });
    }
  });

  // Selected Attribute Values State
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>(() => {
    const initial: { [key: string]: string } = {};
    if (variants.length > 0 && variants[0].attributes) {
      Object.entries(variants[0].attributes).forEach(([k, v]) => {
        initial[k] = String(v);
      });
    }
    return initial;
  });

  // Find the exact variant matching all selected attributes
  const activeVariant = variants.find((v) => {
    if (!v.attributes) return false;
    return Object.entries(selectedAttributes).every(
      ([key, val]) => v.attributes?.[key] === val
    );
  }) || variants[0];

  // Dynamic Price & Stock based on Active Variant
  const currentPrice = activeVariant?.price ?? product.price;
  const currentStock = activeVariant?.stockQuantity ?? product.stockQuantity ?? 12;

  const handleAttributeSelect = (attrKey: string, val: string) => {
    const next = { ...selectedAttributes, [attrKey]: val };
    setSelectedAttributes(next);

    const matched = variants.find((v) => {
      if (!v.attributes) return false;
      return Object.entries(next).every(([k, vVal]) => v.attributes?.[k] === vVal);
    });

    if (matched && matched.image) {
      setActiveImage(matched.image);
    }
  };

  const handleAdd = () => {
    const colorVal = selectedAttributes['Metal Finish'] || selectedAttributes['Color'] || '';
    const sizeVal = selectedAttributes['Ring Size'] || selectedAttributes['Size'] || '';
    if (onAddToCart) {
      (onAddToCart as any)(product, colorVal, sizeVal, quantity, activeVariant);
    } else {
      addToCart(product, activeVariant, colorVal, sizeVal, quantity);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBundleAddToCart = () => {
    handleAdd();
    if (selectedBundleItems.upsell1 && upsellItem) addToCart(upsellItem);
    if (selectedBundleItems.upsell2 && upsellItem2) addToCart(upsellItem2);
    setUpsellAdded(true);
    setTimeout(() => setUpsellAdded(false), 2500);
  };

  const getColorHex = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('rose')) return '#E8A598';
    if (lower.includes('silver') || lower.includes('white')) return '#E3E3E3';
    if (lower.includes('gold') || lower.includes('yellow')) return '#D4AF37';
    return '#111111';
  };

  // Calculate Bundle Total Price
  let bundleTotal = currentPrice;
  if (selectedBundleItems.upsell1 && upsellItem) bundleTotal += upsellItem.price;
  if (selectedBundleItems.upsell2 && upsellItem2) bundleTotal += upsellItem2.price;

  // Mock Reviews
  const reviewsList = [
    {
      id: 1,
      author: 'Marvel',
      date: '06 Nov 2024',
      rating: 5,
      title: 'A true staple item in my wardrobe',
      comment:
        'I have been looking for an everyday pairs of earrings that look expensive but won’t break the bank for ages now, and these are perfect! The stone layering and 18k vermeil shine are stunning.',
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop',
      ],
    },
    {
      id: 2,
      author: 'Angellica Monet',
      date: '18 Oct 2024',
      rating: 5,
      title: 'Gorgeous and Metallic',
      comment:
        'I simply love these. So many people have asked me where I got these from and they look so lovely on me, I’m so happy with them! Shipping was fast and packaged beautifully.',
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop',
      ],
    },
  ];

  const cleanDescription = product.description
    ? product.description.replace(/<[^>]*>?/gm, '').trim()
    : `${product.name} — Handcrafted fine jewelry in 18k solid gold vermeil. Waterproof, anti-tarnish, and hypoallergenic for everyday luxury.`;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: uniqueImages.length > 0 ? uniqueImages : [product.image],
    description: cleanDescription,
    sku: `HAAR-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'Haarmonaa',
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: typeof window !== 'undefined' ? window.location.href : `https://haarmonaa.vmcore.in/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Haarmonaa',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.9,
      reviewCount: product.reviewCount || 18,
      bestRating: '5',
      worstRating: '1',
    },
  };

  const breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Jewelry', url: '/shop' },
    ...(product.category
      ? [{ label: product.category, url: `/category/${product.category.toLowerCase().replace(/\s+/g, '-')}` }]
      : []),
    { label: product.name, url: `/product/${product.slug}` },
  ];

  return (
    <GlozinLayout allProducts={[product, ...relatedProducts]}>
      <SeoHead
        title={`${product.name} — 18K Gold Vermeil Jewelry`}
        description={cleanDescription}
        ogImage={uniqueImages[0] || product.image}
        ogType="product"
        breadcrumbs={breadcrumbs}
        structuredData={productSchema}
      />

      {/* TOP HEADER BREADCRUMB & NEXT/PREV NAVIGATION BAR */}
      <div className="border-b border-gray-100 py-3 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-semibold text-gray-500">
          <nav className="flex items-center gap-2">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link href="/shop" className="hover:text-black">
              Fine Jewelry
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            {product.category ? (
              <Link
                href={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-gray-900 font-bold hover:underline truncate"
              >
                {product.category}
              </Link>
            ) : (
              <span className="text-gray-900 font-bold truncate">Earrings</span>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={relatedProducts[0] ? `/product/${relatedProducts[0].slug}` : '/shop'}
              className="flex items-center gap-1 hover:text-black transition-colors"
              title="Previous Product"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href={relatedProducts[1] ? `/product/${relatedProducts[1].slug}` : '/shop'}
              className="flex items-center gap-1 hover:text-black transition-colors"
              title="Next Product"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* GLOZIN JEWELRY 2-COLUMN MAIN LAYOUT (Left Gallery + Right Sticky Sidebar) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start w-full">
          {/* LEFT COLUMN: GLOZIN VERTICAL STACKED GALLERY (7 COLS) */}
          <div className="lg:col-span-7 space-y-4">
            {/* On Desktop: Glozin Signature Vertical Image Grid Stack */}
            <div className="hidden sm:space-y-4 sm:block">
              {uniqueImages.map((imgUrl, index) => {
                // Layout pattern: 1st image full width, 2nd & 3rd images side-by-side (2-col grid), 4th full width
                if (index === 1 && uniqueImages.length > 2) {
                  return (
                    <div key="grid-pair" className="grid grid-cols-2 gap-4">
                      <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#f5f4f0] border border-gray-100">
                        <img src={uniqueImages[1]} alt={`${product.name} detail 2`} className="w-full h-full object-cover" />
                      </div>
                      <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#f5f4f0] border border-gray-100">
                        <img src={uniqueImages[2]} alt={`${product.name} detail 3`} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  );
                }
                if (index === 2 && uniqueImages.length > 2) return null; // Handled in pair grid above

                return (
                  <div key={index} className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#f5f4f0] border border-gray-100 shadow-2xs">
                    <img src={imgUrl} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>

            {/* On Mobile: Main Active Image + Thumbnail Strip */}
            <div className="block sm:hidden space-y-3">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#f5f4f0] border border-gray-100">
                <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              </div>
              {uniqueImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {uniqueImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        activeImage === img ? 'border-black scale-105' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: GLOZIN STICKY PURCHASING SIDEBAR (5 COLS) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#d0473e] block">
                {product.category || 'Haarmonaa Fine Jewelry'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Refined Luxury Stock & Availability Indicator */}
              <div className="flex items-center gap-2.5 pt-1 text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-[10px] border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  In Stock
                </span>
                {currentStock > 0 && currentStock <= 5 && (
                  <span className="text-xs text-amber-700 font-medium bg-amber-50/80 px-2.5 py-1 rounded-[10px] border border-amber-200/60">
                    Low stock — Only {currentStock} left
                  </span>
                )}
              </div>
            </div>

            {/* Price Line */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                ₹{currentPrice.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-gray-400 line-through font-medium">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
              {(() => {
                if (!product.description)
                  return 'All 24k vermeil items made from 100% recycled silver, 18k gold vermeil and ethically sourced gemstones.';
                const cleanText = product.description
                  .replace(/<[^>]*>?/gm, ' ')
                  .replace(/\s+/g, ' ')
                  .trim();
                if (!cleanText || cleanText.length < 5) {
                  return 'All 24k vermeil items made from 100% recycled silver, 18k gold vermeil and ethically sourced gemstones.';
                }
                return cleanText.length > 160 ? cleanText.substring(0, 160) + '...' : cleanText;
              })()}
            </p>

            {/* Glozin Theme Signature Free Shipping & Perks Card Box */}
            <div className="p-4 sm:p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-3.5">
              {/* Row 1: Delivery Time */}
              <div className="flex items-center gap-3.5 border-b border-dashed border-gray-200 pb-3">
                <Truck className="w-5 h-5 text-gray-900 shrink-0 stroke-[1.75]" />
                <p className="text-xs sm:text-[13px] text-gray-600">
                  Estimate delivery times: <strong className="text-gray-900 font-bold">3-5 days Express.</strong>
                </p>
              </div>

              {/* Row 2: Discount Coupon */}
              <div className="flex items-center gap-3.5 border-b border-dashed border-gray-200 pb-3">
                <Tag className="w-5 h-5 text-gray-900 shrink-0 stroke-[1.75]" />
                <p className="text-xs sm:text-[13px] text-gray-600">
                  Use code <strong className="text-gray-900 font-bold">"WELCOME15"</strong> for discount 15% on your first order.
                </p>
              </div>

              {/* Row 3: Free Shipping & Returns */}
              <div className="flex items-center gap-3.5">
                <Package className="w-5 h-5 text-gray-900 shrink-0 stroke-[1.75]" />
                <p className="text-xs sm:text-[13px] text-gray-600">
                  Free shipping & returns: <strong className="text-gray-900 font-bold">On all orders over ₹1,999.</strong>
                </p>
              </div>
            </div>

            {/* FREQUENTLY BOUGHT TOGETHER SIDEBAR CARD (Only if Admin explicitly selected upsell items) */}
            {hasUpsells && upsellItem && (
              <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2.5">
                  Frequently Bought Together
                </h4>

                {/* Thumbnail Strip Row with Plus Connectors */}
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {/* Thumbnail 1: Main Product */}
                  <Link
                    href={`/product/${product.slug}`}
                    className={`relative group w-22 h-22 rounded-2xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50 transition-all ${
                      selectedBundleItems.main ? 'ring-2 ring-black shadow-xs' : 'opacity-40 grayscale'
                    }`}
                    title={product.name}
                  >
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </Link>

                  {/* Plus Icon 1 */}
                  {upsellItem && (
                    <>
                      <span className="text-gray-400 font-bold text-sm shrink-0">+</span>
                      {/* Thumbnail 2: Upsell Item 1 */}
                      <Link
                        href={`/product/${upsellItem.slug}`}
                        className={`relative group w-22 h-22 rounded-2xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50 transition-all ${
                          selectedBundleItems.upsell1 ? 'ring-2 ring-black shadow-xs' : 'opacity-40 grayscale'
                        }`}
                        title={upsellItem.name}
                      >
                        <img src={upsellItem.image} alt={upsellItem.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </Link>
                    </>
                  )}

                  {/* Plus Icon 2 & Thumbnail 3 */}
                  {upsellItem2 && (
                    <>
                      <span className="text-gray-400 font-bold text-sm shrink-0">+</span>
                      <Link
                        href={`/product/${upsellItem2.slug}`}
                        className={`relative group w-22 h-22 rounded-2xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50 transition-all ${
                          selectedBundleItems.upsell2 ? 'ring-2 ring-black shadow-xs' : 'opacity-40 grayscale'
                        }`}
                        title={upsellItem2.name}
                      >
                        <img src={upsellItem2.image} alt={upsellItem2.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </Link>
                    </>
                  )}
                </div>

                {/* Checkbox List with Product Links */}
                <div className="space-y-3 text-xs text-gray-800 pt-1">
                  {/* Item 1 */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="bundle-main"
                      checked={selectedBundleItems.main}
                      onChange={(e) =>
                        setSelectedBundleItems({ ...selectedBundleItems, main: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer shrink-0"
                    />
                    <label htmlFor="bundle-main" className="cursor-pointer min-w-0 flex-1 flex items-center justify-between gap-2">
                      <span className="truncate">
                        <strong className="text-gray-900 font-bold">This Item:</strong>{' '}
                        <Link href={`/product/${product.slug}`} className="hover:underline hover:text-black font-semibold text-gray-800">
                          {product.name}
                        </Link>
                      </span>
                      <span className="font-extrabold text-gray-900 shrink-0">₹{currentPrice.toFixed(2)}</span>
                    </label>
                  </div>

                  {/* Upsell 1 */}
                  {upsellItem && (
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="bundle-upsell1"
                        checked={selectedBundleItems.upsell1}
                        onChange={(e) =>
                          setSelectedBundleItems({ ...selectedBundleItems, upsell1: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer shrink-0"
                      />
                      <label htmlFor="bundle-upsell1" className="cursor-pointer min-w-0 flex-1 flex items-center justify-between gap-2">
                        <Link href={`/product/${upsellItem.slug}`} className="hover:underline hover:text-black text-gray-700 truncate font-medium">
                          {upsellItem.name}
                        </Link>
                        <span className="font-extrabold text-gray-900 shrink-0">₹{upsellItem.price.toFixed(2)}</span>
                      </label>
                    </div>
                  )}

                  {/* Upsell 2 */}
                  {upsellItem2 && (
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="bundle-upsell2"
                        checked={selectedBundleItems.upsell2}
                        onChange={(e) =>
                          setSelectedBundleItems({ ...selectedBundleItems, upsell2: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer shrink-0"
                      />
                      <label htmlFor="bundle-upsell2" className="cursor-pointer min-w-0 flex-1 flex items-center justify-between gap-2">
                        <Link href={`/product/${upsellItem2.slug}`} className="hover:underline hover:text-black text-gray-700 truncate font-medium">
                          {upsellItem2.name}
                        </Link>
                        <span className="font-extrabold text-gray-900 shrink-0">₹{upsellItem2.price.toFixed(2)}</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Total & Action Row */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">
                      Total Price:
                    </span>
                    <span className="text-xl font-extrabold text-gray-900">₹{bundleTotal.toFixed(2)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleBundleAddToCart}
                    className="px-5 py-2.5 bg-black hover:bg-[#d0473e] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors shadow-2xs cursor-pointer"
                  >
                    {upsellAdded ? 'Added To Cart ✓' : 'Add Selected to Cart'}
                  </button>
                </div>
              </div>
            )}

            {/* DYNAMIC ATTRIBUTE SELECTORS (Color Swatches & Sizes) */}
            {attributeKeys.map((attrKey) => {
              const valuesForAttr = Array.from(
                new Set(variants.map((v) => v.attributes?.[attrKey]).filter(Boolean))
              ) as string[];

              const isColorType =
                attrKey.toLowerCase().includes('finish') || attrKey.toLowerCase().includes('color');
              const isSizeType =
                attrKey.toLowerCase().includes('size') || attrKey.toLowerCase().includes('length');
              const selectedVal = selectedAttributes[attrKey] || valuesForAttr[0];

              return (
                <div key={attrKey} className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                    <div className="flex items-center gap-1.5">
                      <span>{attrKey}:</span>
                      <span className="text-gray-500 font-semibold">{selectedVal}</span>
                    </div>

                    {isSizeType && (
                      <button
                        type="button"
                        onClick={() => setShowSizeChart(true)}
                        className="inline-flex items-center gap-1 text-[11.5px] text-amber-700 hover:text-black font-extrabold underline cursor-pointer"
                      >
                        <Ruler className="w-3.5 h-3.5 text-amber-600" />
                        <span>Size Guide</span>
                      </button>
                    )}
                  </div>

                  {isColorType ? (
                    <div className="flex gap-2.5">
                      {valuesForAttr.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleAttributeSelect(attrKey, term)}
                          className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                            selectedVal === term
                              ? 'scale-110 border-black ring-2 ring-gray-200'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: getColorHex(term) }}
                          title={term}
                        >
                          {selectedVal === term && (
                            <Check className="w-3 h-3 text-black stroke-[3]" />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {valuesForAttr.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleAttributeSelect(attrKey, term)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedVal === term
                              ? 'bg-black text-white shadow-2xs'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* QUANTITY & BUY BUTTONS */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Control */}
                <div className="flex items-center border border-gray-200 rounded-full bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag (Black Primary) */}
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 py-3.5 bg-black hover:bg-gray-900 text-white font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{added ? 'Added to Bag ✓' : 'Add to Bag'}</span>
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 border rounded-full transition-all cursor-pointer flex items-center justify-center ${
                    isInWishlist(product.id)
                      ? 'border-[#d0473e] bg-[#d0473e] text-white'
                      : 'border-gray-300 hover:border-black text-gray-700 hover:text-black'
                  }`}
                  title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Buy Now (Glozin Coral/Rose Highlight Button) */}
              <button
                type="button"
                onClick={handleAdd}
                className="w-full py-3.5 bg-[#f09a96] hover:bg-[#d0473e] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-colors shadow-xs cursor-pointer text-center block"
              >
                Buy Now
              </button>
            </div>

            {/* GUARANTEED SAFE CHECKOUT STRIP */}
            <div className="pt-4 border-t border-gray-100 text-center space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3 text-gray-400" />
                Guaranteed Safe Checkout
              </span>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-600 flex-wrap">
                <span className="px-2 py-1 bg-gray-100 rounded border border-gray-200">VISA</span>
                <span className="px-2 py-1 bg-gray-100 rounded border border-gray-200">Mastercard</span>
                <span className="px-2 py-1 bg-gray-100 rounded border border-gray-200">AMEX</span>
                <span className="px-2 py-1 bg-gray-100 rounded border border-gray-200">Apple Pay</span>
                <span className="px-2 py-1 bg-gray-100 rounded border border-gray-200">UPI / GPay</span>
              </div>
            </div>

            {/* GLOZIN ACCORDION COLLAPSIBLE SECTIONS (Shipping, Returns) */}
            <div className="border-t border-gray-200 pt-3 space-y-1">
              {/* Accordion 1: Shipping and Returns */}
              <div className="border-b border-gray-200 py-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-[13px] font-extrabold text-gray-900 uppercase tracking-wider cursor-pointer"
                >
                  <span>Shipping and Returns</span>
                  {openAccordions.shipping ? (
                    <ChevronUp className="w-4 h-4 text-gray-900 stroke-[2.5]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-900 stroke-[2.5]" />
                  )}
                </button>
                {openAccordions.shipping && (
                  <div className="pt-3 text-[13.5px] text-gray-900 font-medium leading-relaxed">
                    Orders are processed within 24 hours. Express courier shipping takes 3-5 business days. Free delivery on orders over ₹1,999.
                  </div>
                )}
              </div>

              {/* Accordion 2: Return Policies */}
              <div className="border-b border-gray-200 py-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion('returns')}
                  className="w-full flex items-center justify-between text-[13px] font-extrabold text-gray-900 uppercase tracking-wider cursor-pointer"
                >
                  <span>Return Policies</span>
                  {openAccordions.returns ? (
                    <ChevronUp className="w-4 h-4 text-gray-900 stroke-[2.5]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-900 stroke-[2.5]" />
                  )}
                </button>
                {openAccordions.returns && (
                  <div className="pt-3 text-[13.5px] text-gray-900 font-medium leading-relaxed">
                    Return unworn items in original packaging within 30 days for a full refund or exchange. Includes a 2-Year Craftsmanship Guarantee.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FULL PRODUCT DESCRIPTION & SPECIFICATIONS SECTION */}
        <section className="pt-16 border-t border-gray-200 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Product Description & Details
            </h2>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Haarmonaa Craftsmanship
            </span>
          </div>

          <div className="bg-white p-5 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden">
            {product.description ? (
              <div
                className="prose prose-sm sm:prose-base max-w-full overflow-x-auto text-sm text-gray-900 leading-relaxed font-normal break-words [word-break:break-word] [&_*]:max-w-full [&_img]:rounded-3xl [&_img]:my-6 [&_img]:max-h-[500px] [&_img]:w-full [&_img]:object-cover [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-5 [&_h3]:mb-2 [&_table]:w-full [&_table]:block [&_table]:overflow-x-auto [&_table]:my-4 [&_td]:border [&_td]:border-gray-200 [&_td]:p-3 [&_td]:break-words [&_th]:border [&_th]:border-gray-200 [&_th]:p-3 [&_th]:bg-gray-50 [&_th]:break-words"
                dangerouslySetInnerHTML={{
                  __html: product.description
                    .replace(/\\r\\n/g, '')
                    .replace(/\\n/g, '')
                    .replace(/\\r/g, '')
                    .replace(/\\t/g, ' ')
                    .replace(/>\s*\\n\s*</g, '><'),
                }}
              />
            ) : (
              <div className="space-y-6 text-sm text-gray-900 leading-relaxed font-normal">
                <p className="font-medium text-base text-gray-900">
                  Exquisitely crafted in certified solid 18k yellow gold vermeil over 925 sterling silver. Waterproof, anti-tarnish, and hypoallergenic for everyday luxury.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                  <div className="p-5 bg-gray-50/80 border border-gray-200/80 rounded-2xl space-y-1.5">
                    <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">✦ 18k Vermeil Finish</span>
                    <p className="text-xs text-gray-600 leading-relaxed">Thick 2.5 micron 18k gold layer over certified sterling silver.</p>
                  </div>
                  <div className="p-5 bg-gray-50/80 border border-gray-200/80 rounded-2xl space-y-1.5">
                    <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">✦ Molecular Coating</span>
                    <p className="text-xs text-gray-600 leading-relaxed">Advanced anti-tarnish protection resistant to water, sweat, and perfumes.</p>
                  </div>
                  <div className="p-5 bg-gray-50/80 border border-gray-200/80 rounded-2xl space-y-1.5">
                    <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">✦ Hypoallergenic</span>
                    <p className="text-xs text-gray-600 leading-relaxed">100% nickel-free and lead-free for sensitive skin types.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CUSTOMER REVIEWS SECTION */}
        <section className="pt-16 border-t border-gray-200 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Customer Reviews ({reviewsList.length})
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
            >
              Write a Review
            </button>
          </div>

          <div className="space-y-6">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="p-6 border border-gray-100 rounded-2xl space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 text-gray-900 font-bold text-xs flex items-center justify-center">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">{rev.author}</span>
                      <span className="text-[11px] text-gray-400">{rev.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <h4 className="text-xs font-bold text-gray-900">{rev.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>

                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {rev.images.map((img, i) => (
                      <img key={i} src={img} alt="Customer upload" className="w-16 h-16 object-cover rounded-xl border border-gray-200" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* PEOPLE ALSO BOUGHT SECTION */}
        {relatedProducts.length > 0 && (
          <section className="pt-16 border-t border-gray-200 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-tight">
                People Also Bought
              </h2>
              <p className="text-xs text-gray-500">
                Here’s some of our favorite items people bought along with this product.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
              {relatedProducts.slice(0, 4).map((rel) => (
                <ProductCard
                  key={`also-bought-${rel.id}`}
                  product={rel}
                  onAddToCart={(p) => addToCart(p)}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          </section>
        )}

        {/* RECENTLY VIEWED SECTION */}
        <section className="pt-16 border-t border-gray-200 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-tight">
              Recently Viewed
            </h2>
            <p className="text-xs text-gray-500">
              Discover your recently viewed items and pick up where you left off.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-md mx-auto sm:max-w-none pt-4">
            <ProductCard
              product={product}
              onAddToCart={(p) => addToCart(p)}
              onQuickView={onQuickView}
            />
          </div>
        </section>
      </div>

      {/* SIZE CHART MODAL */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowSizeChart(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700">
                JEWELRY SIZING GUIDE
              </span>
              <h3 className="text-xl font-serif text-gray-900">Ring & Bracelet Size Chart</h3>
            </div>

            <div className="border border-gray-200 rounded-2xl overflow-hidden text-xs">
              <div className="grid grid-cols-4 p-3 bg-gray-900 text-white font-bold">
                <span>US Size</span>
                <span>UK Size</span>
                <span>Inner Diameter</span>
                <span>Circumference</span>
              </div>
              <div className="grid grid-cols-4 p-3 border-t border-gray-100">
                <span className="font-bold text-gray-900">US 5</span>
                <span>J 1/2</span>
                <span>15.7 mm</span>
                <span>49.3 mm</span>
              </div>
              <div className="grid grid-cols-4 p-3 border-t border-gray-100 bg-gray-50">
                <span className="font-bold text-gray-900">US 6</span>
                <span>L 1/2</span>
                <span>16.5 mm</span>
                <span>51.8 mm</span>
              </div>
              <div className="grid grid-cols-4 p-3 border-t border-gray-100">
                <span className="font-bold text-gray-900">US 7</span>
                <span>N 1/2</span>
                <span>17.3 mm</span>
                <span>54.4 mm</span>
              </div>
            </div>

            <button
              onClick={() => setShowSizeChart(false)}
              className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </GlozinLayout>
  );
}
