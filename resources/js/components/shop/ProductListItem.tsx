import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Heart, Eye, Star, Check } from 'lucide-react';
import { Product } from '@/types/shop';

interface ProductListItemProps {
  product: Product;
  currencySymbol?: string;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

export const ProductListItem: React.FC<ProductListItemProps> = ({
  product,
  currencySymbol = '₹',
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(isWishlisted);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setWishlisted(!wishlisted);
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-white p-2 sm:p-4 rounded-3xl border border-transparent hover:border-gray-100 transition-all group">
      {/* Product Image on Left */}
      <div className="relative w-full sm:w-64 md:w-72 aspect-square rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100/70">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.secondaryImage && (
            <img
              src={product.secondaryImage}
              alt={`${product.name} alternate view`}
              className="gz-secondary-img absolute inset-0 w-full h-full object-cover"
            />
          )}
        </Link>


        {/* Discount Badge */}
        {product.discountPercent && (
          <span className="absolute top-3 left-3 bg-[#d0473e] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      {/* Product Information on Right */}
      <div className="flex-1 space-y-3.5 text-left w-full">
        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          className="text-lg sm:text-xl font-bold text-gray-900 hover:text-[#d0473e] transition-colors block leading-snug"
        >
          {product.name}
        </Link>

        {/* Star Rating */}
        <div className="flex items-center gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(product.rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-gray-300 fill-gray-200'
              }`}
            />
          ))}
          <span className="text-xs font-semibold text-gray-500 ml-1.5">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2.5">
          <span className={`text-base sm:text-lg font-extrabold ${product.originalPrice ? 'text-[#d0473e]' : 'text-gray-900'}`}>
            {currencySymbol}{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through font-medium">
              {currencySymbol}{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Description Text */}
        <p className="text-[13px] sm:text-[13.5px] text-gray-600 leading-relaxed max-w-2xl line-clamp-3">
          {(() => {
            if (!product.description) return '';
            return product.description
              .replace(/<[^>]*>?/gm, ' ')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .replace(/&nbsp;/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
          })()}
        </p>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-3 pt-2">
          {/* Add to cart black pill button */}
          <button
            onClick={handleAddToCart}
            className={`px-8 py-3 rounded-full text-xs sm:text-[13.5px] font-bold tracking-normal transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-[#111111] hover:bg-[#d0473e] text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to cart</span>
              </>
            ) : (
              <span>Add to cart</span>
            )}
          </button>

          {/* Wishlist Circle Button */}
          <button
            onClick={handleWishlist}
            className={`p-3 rounded-full border border-gray-200 hover:border-gray-900 transition-all ${
              wishlisted
                ? 'bg-[#d0473e] border-[#d0473e] text-white'
                : 'bg-white text-gray-700 hover:text-black'
            }`}
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
          </button>

          {/* Quick View Circle Button */}
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="p-3 rounded-full border border-gray-200 hover:border-gray-900 bg-white text-gray-700 hover:text-black transition-all"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
