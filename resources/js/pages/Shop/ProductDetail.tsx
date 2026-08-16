import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { ProductCard } from '@/components/shop/ProductCard';
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
  ChevronRight,
  Sparkles,
  Gem,
  CheckCircle2,
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
    product.image,
    ...(product.secondaryImage ? [product.secondaryImage] : []),
    ...(product.variants?.map((v) => v.image).filter(Boolean) || []),
  ];
  const uniqueImages = Array.from(new Set(allImages.filter(Boolean))) as string[];

  const [activeImage, setActiveImage] = useState(uniqueImages[0] || product.image);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'shipping'>('description');
  const [added, setAdded] = useState(false);

  // Dynamic Attribute Options from Variants
  const variants = product.variants || [];
  const hasVariants = variants.length > 0;

  // Extract unique attribute keys (e.g. "Metal Finish", "Ring Size")
  const attributeKeys: string[] = [];
  variants.forEach((v) => {
    if (v.attributes && typeof v.attributes === 'object') {
      Object.keys(v.attributes).forEach((k) => {
        if (!attributeKeys.includes(k)) attributeKeys.push(k);
      });
    }
  });


  // Selected Attribute Values State: e.g. { "Metal Finish": "18K Yellow Gold", "Ring Size": "US 6" }
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
  const currentStock = activeVariant?.stockQuantity ?? product.stockQuantity ?? 25;

  const handleAttributeSelect = (attrKey: string, val: string) => {
    const next = { ...selectedAttributes, [attrKey]: val };
    setSelectedAttributes(next);

    // If variant has a specific image, switch to it smoothly
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


  const getColorHex = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('rose')) return '#E8A598';
    if (lower.includes('silver') || lower.includes('white')) return '#E3E3E3';
    if (lower.includes('gold') || lower.includes('yellow')) return '#D4AF37';
    return '#111111';
  };

  return (
    <GlozinLayout allProducts={[product, ...relatedProducts]}>
      <Head title={`${product.name} — Haarmonaa Luxury Jewelry`} />

      {/* Breadcrumbs */}
      <div className="bg-gray-50/60 border-b border-gray-100 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link href="/shop" className="hover:text-black">
              Shop
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900 font-bold truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Gallery Images (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-2xs">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {product.discountPercent && (
                <span className="absolute top-4 left-4 bg-[#111111] text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  -{product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {uniqueImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {uniqueImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      activeImage === img
                        ? 'border-black scale-105 shadow-xs'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Dynamic Attribute Controls (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {product.category || 'Fine Jewelry'}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentStock > 0 ? `${currentStock} in stock` : 'Out of stock'}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating & Review */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-900">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-gray-50 rounded-2xl flex items-baseline gap-4 border border-gray-100">
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                ₹{currentPrice.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-gray-400 line-through font-medium">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
              {activeVariant?.sku && (
                <span className="text-[11px] font-mono text-gray-400 ml-auto">
                  SKU: {activeVariant.sku}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
              {product.description ||
                'Exquisitely crafted in certified solid 18k yellow gold vermeil. Waterproof, anti-tarnish, and hypoallergenic.'}
            </p>

            {/* DYNAMIC ATTRIBUTES SECTION */}
            {attributeKeys.map((attrKey) => {
              // Collect all available term values for this attribute
              const valuesForAttr = Array.from(
                new Set(
                  variants.map((v) => v.attributes?.[attrKey]).filter(Boolean)
                )
              ) as string[];

              const isColorType = attrKey.toLowerCase().includes('finish') || attrKey.toLowerCase().includes('color');
              const selectedVal = selectedAttributes[attrKey] || valuesForAttr[0];

              return (
                <div key={attrKey} className="space-y-2.5 pt-2">
                  <div className="flex justify-between text-xs font-bold text-gray-900">
                    <span>{attrKey}:</span>
                    <span className="text-gray-500 font-semibold">{selectedVal}</span>
                  </div>

                  {isColorType ? (
                    /* Color Swatches */
                    <div className="flex gap-2.5">
                      {valuesForAttr.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleAttributeSelect(attrKey, term)}
                          className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                            selectedVal === term
                              ? 'scale-110 border-[#111111] ring-2 ring-gray-200'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: getColorHex(term) }}
                          title={term}
                        >
                          {selectedVal === term && (
                            <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    /* Button / Pill Selection (Sizes) */
                    <div className="flex flex-wrap gap-2">
                      {valuesForAttr.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleAttributeSelect(attrKey, term)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedVal === term
                              ? 'bg-[#111111] text-white shadow-2xs'
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

            {/* Quantity & Add to Cart */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-full bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 py-3.5 bg-[#111111] hover:bg-[#d0473e] text-white font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{added ? 'Added to Bag ✓' : 'Add to Bag'}</span>
                </button>

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
            </div>


            {/* Trust Badges */}
            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-900" />
                <span>18K Solid Gold Vermeil</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-900" />
                <span>Free Insured Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-gray-900" />
                <span>30-Day Easy Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-gray-900" />
                <span>Hypoallergenic Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlozinLayout>
  );
}
