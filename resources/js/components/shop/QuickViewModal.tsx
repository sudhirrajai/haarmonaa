import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { X, Star, ShoppingBag, Heart, Check, Truck, ShieldCheck } from 'lucide-react';
import { Product } from '@/types/shop';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, color?: string, size?: string, quantity?: number) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !product) return null;

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden z-10 animate-fade-in my-8 border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white p-2 rounded-full text-gray-500 hover:text-black shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Gallery Section */}
          <div className="p-6 bg-gray-50 flex flex-col justify-between">
            <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-white mb-4 shadow-xs">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discountPercent && (
                <span className="absolute top-3 left-3 bg-[#d0473e] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  -{product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-[#d0473e] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                  {product.category}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> In Stock
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h2>

              {/* Price & Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-[#d0473e]">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-gray-400 line-through font-medium">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-50 px-2.5 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400">({product.reviewCount})</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-800 tracking-wider block">
                    Color: <span className="font-normal text-gray-600">{selectedColor}</span>
                  </label>
                  <div className="flex gap-2.5">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          selectedColor === c.name ? 'scale-110 border-[#111111] ring-2 ring-gray-300' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-800 tracking-wider block">
                    Size: <span className="font-normal text-gray-600">{selectedSize}</span>
                  </label>
                  <div className="flex gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                          selectedSize === s
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-gray-200 rounded-full px-3 py-1 bg-gray-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-500 hover:text-black font-bold px-2"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold px-3 text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-gray-500 hover:text-black font-bold px-2"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAdd}
                  className={`flex-1 rounded-full py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#111111] hover:bg-[#d0473e] text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Shopping Bag!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart — ${(product.price * quantity).toFixed(2)}
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="font-bold text-[#111111] underline hover:text-[#d0473e]"
                >
                  View Full Product Details →
                </Link>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-gray-400" /> Fast Shipping</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-gray-400" /> Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
