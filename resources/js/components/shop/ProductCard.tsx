import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '@/types/shop';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  currencySymbol?: string;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop';

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currencySymbol = '₹',
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image || FALLBACK_IMAGE);
  const [secImgSrc, setSecImgSrc] = useState(product.secondaryImage);

  const activeWishlisted = isWishlisted !== undefined ? isWishlisted : isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
    } else {
      toggleWishlist(product);
    }
  };

  return (
    <div className="gz-product-card group flex flex-col bg-white text-center">
      {/* Product Thumbnail Container */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 mb-3 border border-gray-100/80 shadow-2xs">
        {/* Main Image */}
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          />
          {/* Secondary Hover Image */}
          {secImgSrc && (
            <img
              src={secImgSrc}
              alt={`${product.name} alternate view`}
              onError={() => setSecImgSrc(undefined)}
              className="gz-secondary-img absolute inset-0 w-full h-full object-cover"
            />
          )}
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none text-left">
          {product.discountPercent && (
            <span className="bg-[#d0473e] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              -{product.discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#111111] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              NEW
            </span>
          )}
          {product.isHot && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              HOT
            </span>
          )}
        </div>

        {/* Top Right Wishlist Action */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-sm backdrop-blur-md transition-all z-10 cursor-pointer ${
            activeWishlisted
              ? 'bg-[#d0473e] text-white scale-110'
              : 'bg-white/90 hover:bg-white text-gray-700 hover:text-[#d0473e]'
          }`}
          title={activeWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${activeWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Bottom Hover Actions Bar */}
        <div className="gz-card-actions absolute bottom-3 inset-x-3 flex items-center justify-center gap-2 z-10">
          {/* Quick Add to Cart Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-[#111111] hover:bg-[#d0473e] text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
              </>
            )}
          </button>

          {/* Quick View Eye Button */}
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="p-2.5 bg-white/90 hover:bg-white text-gray-800 hover:text-[#d0473e] rounded-full shadow-lg backdrop-blur-md transition-colors cursor-pointer"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-1.5 px-1 text-center">
        {/* Category Label */}
        {product.category && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block truncate">
            {product.category}
          </span>
        )}

        {/* Product Title */}
        <h3 className="text-xs font-bold text-gray-900 line-clamp-1 hover:text-[#d0473e] transition-colors">
          <Link href={`/product/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Price & Rating Row */}
        <div className="flex items-center justify-center gap-2 pt-0.5">
          <span className="text-xs font-extrabold text-gray-900">
            {currencySymbol}{product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[11px] font-normal text-gray-400 line-through">
              {currencySymbol}{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating Stars */}
        <div className="flex items-center justify-center gap-1 text-amber-500 pt-0.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating || 5)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-semibold text-gray-400">
            ({product.reviewCount || 12})
          </span>
        </div>
      </div>
    </div>
  );
};
