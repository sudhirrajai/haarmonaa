import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { Product } from '@/types/shop';
import { PhoneInput } from '@/components/shop/PhoneInput';
import { useCart } from '@/context/CartContext';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  CreditCard,
  Banknote,
  ArrowLeft,
  Truck,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface CheckoutProps {
  products?: Product[];
  razorpayKey?: string;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function Checkout({ products = [], razorpayKey = 'rzp_test_demo123456' }: CheckoutProps) {
  const { cart, subtotal, tax, shipping, total, clearCart, cartCount } = useCart();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'razorpay' as 'razorpay' | 'cod',
  });

  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty. Please add products before checking out.');
      return;
    }

    if (!formData.phone) {
      alert('Please provide a valid phone number for shipping and delivery updates.');
      return;
    }

    setProcessing(true);
    setErrorMessage(null);

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postal_code: formData.postalCode,
      payment_method: formData.paymentMethod,
      items: cart.map((item) => ({
        product_id: item.product.id,
        variant_id: item.variant?.id || null,
        product_name: item.product.name + (item.selectedColor ? ` (${item.selectedColor}${item.selectedSize ? `, ${item.selectedSize}` : ''})` : ''),
        product_image: item.variant?.image || item.product.image,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      })),
    };

    try {
      const response = await fetch('/checkout/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Failed to place order. Please review your details.');
      }

      const orderNumber = resData.order_number;

      // Handle Cash on Delivery (COD)
      if (formData.paymentMethod === 'cod') {
        clearCart();
        window.location.href = resData.redirect_url;
        return;
      }

      // Handle Razorpay Online Payment
      if (formData.paymentMethod === 'razorpay') {
        if (typeof window.Razorpay === 'undefined') {
          // Fallback simulation if razorpay script fails or demo mode
          clearCart();
          window.location.href = resData.redirect_url;
          return;
        }

        const options = {
          key: razorpayKey,
          amount: Math.round(total * 100), // in paise
          currency: 'INR',
          name: 'Haarmonaa Luxury Jewelry',
          description: `Order #${orderNumber}`,
          image: 'https://haarmonaa.vmcore.in/wp-content/uploads/2026/01/1.png',
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone.replace(/\D/g, ''),
          },
          theme: {
            color: '#111111',
          },
          handler: async function (paymentRes: any) {
            try {
              const verifyRes = await fetch('/payment/razorpay/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                  order_number: orderNumber,
                  razorpay_payment_id: paymentRes.razorpay_payment_id,
                  razorpay_order_id: paymentRes.razorpay_order_id,
                  razorpay_signature: paymentRes.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              clearCart();
              window.location.href = verifyData.redirect_url || resData.redirect_url;
            } catch {
              clearCart();
              window.location.href = resData.redirect_url;
            }
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
              setErrorMessage('Payment was cancelled. Your order is reserved; you can retry anytime.');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setProcessing(false);
          setErrorMessage(`Payment failed: ${resp.error.description}`);
        });
        rzp.open();
      }
    } catch (err: any) {
      setProcessing(false);
      setErrorMessage(err.message || 'An error occurred while creating your order.');
    }
  };

  return (
    <GlozinLayout allProducts={products}>
      <Head title="Secure Checkout — Haarmonaa Luxury Jewelry" />

      {/* Header & Breadcrumbs */}
      <section className="pt-10 pb-8 bg-white text-center border-b border-gray-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="text-[13px] font-semibold text-gray-500 mb-4">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2 text-gray-400">•</span>
            <Link href="/cart" className="hover:text-black">Bag</Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">Secure Checkout</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Express Boutique Checkout
          </h1>
        </div>
      </section>

      <div className="py-12 sm:py-16 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200/80 rounded-3xl p-10 max-w-lg mx-auto shadow-2xs space-y-5">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-700">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">Your shopping bag is empty</h2>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Add heirloom rings, necklaces, or bracelets to your cart before proceeding to checkout.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-block bg-[#111111] hover:bg-[#d0473e] text-white px-8 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Explore Fine Jewelry
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Shipping & Payment (8 Cols) */}
              <div className="lg:col-span-7 space-y-8">
                {/* 1. Contact & Shipping Address */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                      1. Delivery Address & Contact
                    </h2>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Insured Transit
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        First Name <span className="text-[#d0473e]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Ananya"
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl py-3 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Last Name <span className="text-[#d0473e]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Sharma"
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl py-3 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Email Address <span className="text-[#d0473e]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ananya@domain.com"
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl py-3 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Phone Number <span className="text-[#d0473e]">*</span>
                      </label>
                      <PhoneInput
                        value={formData.phone}
                        onChange={(val) => setFormData({ ...formData, phone: val })}
                        required={true}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Street Address & Apartment <span className="text-[#d0473e]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Flat 402, Sea Breeze Heights, Hill Road"
                      className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl py-3 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        City <span className="text-[#d0473e]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Mumbai"
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl py-3 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        PIN / Postal Code <span className="text-[#d0473e]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        placeholder="400050"
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-2xl py-3 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Payment Method Options */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                      2. Payment Method
                    </h2>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> SSL Encrypted
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Option 1: Razorpay */}
                    <label
                      className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        formData.paymentMethod === 'razorpay'
                          ? 'border-black bg-gray-50/80 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={formData.paymentMethod === 'razorpay'}
                            onChange={() => setFormData({ ...formData, paymentMethod: 'razorpay' })}
                            className="w-4 h-4 text-black focus:ring-black cursor-pointer"
                          />
                          <div>
                            <span className="text-xs font-bold text-gray-900 block">
                              Razorpay Secure Gateway (UPI / Cards / NetBanking)
                            </span>
                            <span className="text-[11px] text-gray-500 block mt-0.5">
                              Pay via Google Pay, PhonePe, Paytm, Credit/Debit Card or NetBanking.
                            </span>
                          </div>
                        </div>

                        <CreditCard className="w-5 h-5 text-gray-800 flex-shrink-0" />
                      </div>
                    </label>

                    {/* Option 2: Cash on Delivery (COD) */}
                    <label
                      className={`block p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        formData.paymentMethod === 'cod'
                          ? 'border-black bg-gray-50/80 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                            className="w-4 h-4 text-black focus:ring-black cursor-pointer"
                          />
                          <div>
                            <span className="text-xs font-bold text-gray-900 block">
                              Cash on Delivery (COD)
                            </span>
                            <span className="text-[11px] text-gray-500 block mt-0.5">
                              Pay cash upon insured home delivery by courier.
                            </span>
                          </div>
                        </div>

                        <Banknote className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                      </div>
                    </label>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                      {errorMessage}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Summary (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
                      Order Summary ({cartCount})
                    </h3>
                    <Link href="/cart" className="text-xs font-bold text-gray-500 hover:text-black">
                      Edit Bag
                    </Link>
                  </div>

                  {/* Cart Item List */}
                  <div className="space-y-4 max-h-72 overflow-y-auto divide-y divide-gray-100 pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 items-center">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                          <img
                            src={item.variant?.image || item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-bl-lg flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {item.product.name}
                          </h4>
                          <div className="flex gap-2 text-[10px] text-gray-500">
                            {item.selectedColor && <span>{item.selectedColor}</span>}
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          </div>
                        </div>

                        <span className="text-xs font-extrabold text-gray-900">
                          ₹{item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price Calculations */}
                  <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>GST (3% Jewelry Tax)</span>
                      <span className="font-bold text-gray-900">₹{tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Insured Express Shipping</span>
                      <span className="font-bold text-gray-900">
                        {shipping === 0 ? <span className="text-emerald-600 uppercase font-bold">FREE</span> : `₹${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                      <span className="text-sm font-extrabold text-gray-900 uppercase">Grand Total</span>
                      <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Place Order CTA */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-4 bg-[#111111] hover:bg-[#d0473e] text-white font-extrabold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {processing
                        ? 'Processing Order...'
                        : formData.paymentMethod === 'cod'
                        ? `Confirm COD Order (₹${total.toFixed(2)})`
                        : `Pay Online (₹${total.toFixed(2)})`}
                    </span>
                  </button>

                  {/* Trust Badge Row */}
                  <div className="pt-2 grid grid-cols-2 gap-3 text-[11px] text-gray-500 border-t border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>18K Solid Gold Vermeil</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>Insured Tamper-Proof Box</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </GlozinLayout>
  );
}
