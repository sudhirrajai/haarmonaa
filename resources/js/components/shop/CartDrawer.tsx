import React from 'react';
import { Link } from '@inertiajs/react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    cartCount,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d0473e]" />
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider">
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-4 bg-amber-50/50 border-b border-amber-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-800 mb-2">
              <Truck className="w-4 h-4 text-[#d0473e]" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-[#d0473e]">₹{remainingForFreeShipping.toFixed(2)}</strong> more to unlock <strong>FREE INSURED DELIVERY!</strong>
                </span>
              ) : (
                <span className="text-emerald-700 font-bold">
                  🎉 Congratulations! You have unlocked FREE INSURED DELIVERY!
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-[#d0473e] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto stroke-1" />
                <p className="text-sm text-gray-500 font-medium">Your shopping bag is currently empty.</p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="bg-[#111111] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#d0473e] transition-colors cursor-pointer"
                >
                  Explore Fine Jewelry
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-6 first:pt-0 flex gap-4 items-start">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                    <img
                      src={item.variant?.image || item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="text-xs font-bold text-gray-900 hover:text-[#d0473e] line-clamp-1"
                    >
                      {item.product.name}
                    </Link>

                    {/* Options (Color / Size / Finish) */}
                    <div className="flex flex-wrap gap-2 text-[11px] text-gray-500">
                      {item.selectedColor && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                          {item.selectedColor}
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                          Size: {item.selectedSize}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-200 rounded-full px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-400 hover:text-black p-0.5 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-400 hover:text-black p-0.5 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-gray-900">
                        ₹{item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/80 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>GST (3%) & Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-3 bg-white border border-gray-300 hover:border-black text-gray-900 font-bold text-xs uppercase tracking-wider rounded-full text-center transition-all cursor-pointer"
                >
                  View Cart
                </Link>

                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-3 bg-[#111111] hover:bg-[#d0473e] text-white font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
