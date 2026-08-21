import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { Product } from '@/types/shop';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck, Tag, ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartProps {
  products?: Product[];
}

export default function Cart({ products = [] }: CartProps) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    appliedCoupons,
    applyCoupon,
    removeCoupon,
    subtotal,
    couponDiscount,
    tax,
    shipping,
    total,
    cartCount,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [applying, setApplying] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const freeShippingThreshold = 999;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setApplying(true);
    setCouponMessage(null);

    const result = await applyCoupon(couponCode.trim());
    setApplying(false);

    if (result.success) {
      setCouponMessage({ type: 'success', text: result.message });
      setCouponCode('');
    } else {
      setCouponMessage({ type: 'error', text: result.message });
    }
  };

  const handleRemoveCoupon = async (code: string) => {
    await removeCoupon(code);
    setCouponMessage(null);
  };

  return (
    <GlozinLayout allProducts={products}>
      <Head title="Shopping Bag — Haarmonaa Luxury Jewelry" />

      {/* Header & Breadcrumbs */}
      <section className="pt-10 pb-8 bg-white text-center border-b border-gray-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="text-[13px] font-semibold text-gray-500 mb-4">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">Shopping Bag</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Shopping Bag ({cartCount})
          </h1>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200/80 rounded-[10px] p-10 max-w-lg mx-auto shadow-2xs space-y-5">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-700">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-gray-900">Your shopping bag is empty</h2>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Discover handcrafted heirloom rings, pendants, earrings, and bracelets in 18k solid gold vermeil.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-block bg-[#111111] hover:bg-[#d0473e] text-white px-8 py-3.5 rounded-[10px] text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Explore Fine Jewelry
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left 8 Cols: Free Shipping Bar & Items Table */}
              <div className="lg:col-span-8 space-y-6">
                {/* Free Shipping Alert Bar */}
                <div className="bg-white p-5 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                    <Truck className="w-4 h-4 text-[#d0473e]" />
                    {remainingForFreeShipping > 0 ? (
                      <span>
                        Add <strong className="text-[#d0473e]">₹{remainingForFreeShipping.toFixed(2)}</strong> more to get <strong>FREE INSURED DELIVERY!</strong>
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold">
                        🎉 Congratulations! You have unlocked FREE INSURED DELIVERY!
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#111111] h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Items Table Container */}
                <div className="bg-white rounded-[10px] border border-gray-200/80 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/80 text-gray-500 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                        <tr>
                          <th className="py-4 px-6">Product</th>
                          <th className="py-4 px-4">Price</th>
                          <th className="py-4 px-4 text-center">Quantity</th>
                          <th className="py-4 px-4 text-right">Subtotal</th>
                          <th className="py-4 px-4 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium text-xs">
                        {cart.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                            {/* Product Info */}
                            <td className="py-5 px-6">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-[8px] bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.variant?.image || item.product.image}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Link
                                    href={`/product/${item.product.slug}`}
                                    className="font-bold text-gray-900 hover:text-[#d0473e] text-xs leading-snug line-clamp-1"
                                  >
                                    {item.product.name}
                                  </Link>
                                  <div className="flex flex-wrap gap-2 text-[11px] text-gray-500">
                                    {item.selectedColor && (
                                      <span className="bg-gray-100 px-2 py-0.5 rounded-[4px]">
                                        Finish: {item.selectedColor}
                                      </span>
                                    )}
                                    {item.selectedSize && (
                                      <span className="bg-gray-100 px-2 py-0.5 rounded-[4px]">
                                        Size: {item.selectedSize}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Unit Price */}
                            <td className="py-5 px-4 font-bold text-gray-900 whitespace-nowrap">
                              ₹{item.unitPrice.toFixed(2)}
                            </td>

                            {/* Quantity Controls */}
                            <td className="py-5 px-4 text-center">
                              <div className="inline-flex items-center border border-gray-200 rounded-[8px] overflow-hidden bg-white">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </td>

                            {/* Subtotal */}
                            <td className="py-5 px-4 text-right font-extrabold text-gray-900 whitespace-nowrap">
                              ₹{item.subtotal.toFixed(2)}
                            </td>

                            {/* Remove */}
                            <td className="py-5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-gray-400 hover:text-[#d0473e] hover:bg-rose-50 rounded-[6px] transition-colors cursor-pointer"
                                title="Remove from bag"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Promo Code Box */}
                <div className="bg-white p-6 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                    <Tag className="w-4 h-4 text-[#d0473e]" />
                    <span>Have a Promo Code or Gift Voucher?</span>
                  </div>

                  {/* Applied Coupons List */}
                  {appliedCoupons.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Applied Coupon(s):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {appliedCoupons.map((c) => (
                          <div
                            key={c.code}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-[8px] text-xs font-mono font-bold text-emerald-900"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{c.code}</span>
                            <span className="text-[11px] text-emerald-700 font-sans">
                              (-₹{Number(c.discount).toFixed(2)})
                            </span>
                            {c.allow_stacking && (
                              <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[9px] rounded-full font-sans uppercase">
                                Stacked
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveCoupon(c.code)}
                              className="text-emerald-800 hover:text-rose-600 ml-1 p-0.5 rounded-full hover:bg-emerald-100 cursor-pointer"
                              title="Remove coupon"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter promo voucher code..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-[8px] py-2.5 px-4 text-xs text-gray-900 uppercase font-mono placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white"
                    />
                    <button
                      type="submit"
                      disabled={applying || !couponCode.trim()}
                      className="px-6 py-2.5 bg-black hover:bg-[#d0473e] text-white text-xs font-bold uppercase rounded-[8px] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {applying ? 'Checking...' : appliedCoupons.length > 0 ? 'Add / Stack' : 'Apply'}
                    </button>
                  </form>

                  {couponMessage && (
                    <span
                      className={`text-xs block font-semibold ${
                        couponMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
                      }`}
                    >
                      {couponMessage.text}
                    </span>
                  )}
                </div>
              </div>

              {/* Right 4 Cols: Order Summary Card */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
                  <h3 className="text-base font-extrabold text-gray-900 tracking-tight pb-3 border-b border-gray-100">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
                    </div>

                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>
                          Promo Discount ({appliedCoupons.map((c) => c.code).join(', ')})
                        </span>
                        <span>-₹{couponDiscount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span>GST (3% Jewelry Tax)</span>
                      <span className="font-bold text-gray-900">₹{tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Insured Express Shipping</span>
                      <span className="font-bold text-gray-900">
                        {shipping === 0 ? (
                          <span className="text-emerald-600 uppercase">FREE</span>
                        ) : (
                          `₹${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                      <span className="text-sm font-extrabold text-gray-900 uppercase">Estimated Total</span>
                      <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full py-4 bg-[#111111] hover:bg-[#d0473e] text-white font-extrabold text-xs uppercase tracking-wider rounded-[10px] flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="pt-2 text-center text-[11px] text-gray-500 space-y-1.5 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-1.5 font-bold text-gray-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Authentic 18k Vermeil & Lifetime Quality</span>
                    </div>
                    <p className="text-[10px]">
                      Complimentary tamper-evident insurance packaging included on every order.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </GlozinLayout>
  );
}
