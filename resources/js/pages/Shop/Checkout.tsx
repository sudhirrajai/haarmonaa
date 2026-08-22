import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
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
  Tag,
  X,
  Plus,
  MapPin,
  Check,
  Building,
  Home,
} from 'lucide-react';

interface CustomerAddressItem {
  id: number;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state?: string | null;
  postal_code: string;
  type: string;
  is_default: boolean;
}

interface CheckoutProps {
  products?: Product[];
  razorpayKey?: string;
  savedAddresses?: CustomerAddressItem[];
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function Checkout({
  products = [],
  razorpayKey = 'rzp_test_demo123456',
  savedAddresses = [],
}: CheckoutProps) {
  const {
    cart,
    subtotal,
    appliedCoupons,
    applyCoupon,
    removeCoupon,
    couponDiscount,
    tax,
    taxRate,
    shipping,
    total,
    clearCart,
    cartCount,
  } = useCart();

  const defaultAddr = savedAddresses.find((a) => a.is_default) || savedAddresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<number | 'new'>(
    defaultAddr ? defaultAddr.id : 'new'
  );

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

  const [saveAddress, setSaveAddress] = useState(true);
  const [setAsDefault, setSetAsDefault] = useState(false);

  // Initialize or update form when selecting a saved address
  useEffect(() => {
    if (selectedAddressId !== 'new') {
      const addr = savedAddresses.find((a) => a.id === selectedAddressId);
      if (addr) {
        const parts = addr.name.trim().split(' ');
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';
        const fullAddr = addr.address_line1 + (addr.address_line2 ? `, ${addr.address_line2}` : '');

        setFormData((prev) => ({
          ...prev,
          firstName,
          lastName,
          phone: addr.phone,
          address: fullAddr,
          city: addr.city,
          postalCode: addr.postal_code,
        }));
      }
    }
  }, [selectedAddressId, savedAddresses]);

  const [processing, setProcessing] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isRedirectingToSuccess, setIsRedirectingToSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Prevent accessing checkout when cart is empty (e.g. hitting back button from Thank You page)
  useEffect(() => {
    if (cart.length === 0 && !isRedirectingToSuccess && !isProcessingPayment) {
      const timer = setTimeout(() => {
        router.visit('/cart', { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [cart.length, isRedirectingToSuccess, isProcessingPayment]);

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

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setApplyingCoupon(true);
    setCouponError(null);
    setCouponSuccess(null);

    const result = await applyCoupon(couponInput.trim(), formData.email);
    setApplyingCoupon(false);

    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponSuccess(result.message);
      setCouponInput('');
    }
  };

  const handleRemoveCoupon = async (code: string) => {
    await removeCoupon(code);
    setCouponSuccess(null);
    setCouponError(null);
  };

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

    const appliedCodes = appliedCoupons.map((c) => c.code);

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postal_code: formData.postalCode,
      payment_method: formData.paymentMethod,
      save_address: selectedAddressId === 'new' ? saveAddress : false,
      set_as_default: selectedAddressId === 'new' ? setAsDefault : false,
      coupon_code: appliedCodes.length > 0 ? appliedCodes.join(',') : null,
      coupon_codes: appliedCodes,
      items: cart.map((item) => ({
        product_id: item.product.id,
        variant_id: item.variant?.id || null,
        product_name:
          item.product.name +
          (item.selectedColor ? ` (${item.selectedColor}${item.selectedSize ? `, ${item.selectedSize}` : ''})` : ''),
        product_image: item.variant?.image || item.product.image,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      })),
    };

    try {
      const csrfToken =
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';

      // Handle Cash on Delivery (COD)
      if (formData.paymentMethod === 'cod') {
        const response = await fetch('/checkout/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
          body: JSON.stringify(payload),
        });

        const resData = await response.json();

        if (!response.ok || !resData.success) {
          throw new Error(resData.message || 'Failed to place order. Please review your details.');
        }

        setIsRedirectingToSuccess(true);
        clearCart();
        window.location.replace(resData.redirect_url);
        return;
      }

      // Handle Razorpay Online Payment
      if (formData.paymentMethod === 'razorpay') {
        // Step 1: Server-Side Razorpay Order Initialization
        const orderInitResponse = await fetch('/checkout/create-razorpay-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
          body: JSON.stringify(payload),
        });

        const rzpData = await orderInitResponse.json();

        if (!orderInitResponse.ok || !rzpData.success) {
          throw new Error(
            rzpData.message || 'Unable to initiate payment session. Please try again or choose Cash on Delivery.'
          );
        }

        const activeKey = rzpData.key_id || razorpayKey;
        const orderNumber = rzpData.order_number;
        const razorpayOrderId = rzpData.razorpay_order_id;

        if (typeof window.Razorpay === 'undefined') {
          throw new Error('Razorpay secure checkout failed to load. Please check your internet connection and retry.');
        }

        const options = {
          key: activeKey,
          amount: rzpData.amount_paise,
          currency: rzpData.currency || 'INR',
          name: 'Haarmonaa Fine Jewelry',
          description: `Order #${orderNumber}`,
          order_id: razorpayOrderId,
          prefill: {
            name: rzpData.customer?.name || `${formData.firstName} ${formData.lastName}`.trim(),
            email: rzpData.customer?.email || formData.email,
            contact: rzpData.customer?.phone || formData.phone,
          },
          theme: {
            color: '#111111',
          },
          modal: {
            backdropclose: false,
            ondismiss: function () {
              setProcessing(false);
              setIsProcessingPayment(false);
              setErrorMessage('Payment was cancelled. Your bag items have been kept safe.');
            },
          },
          handler: async function (paymentResponse: any) {
            try {
              setIsProcessingPayment(true);
              setProcessing(true);

              const verifyRes = await fetch('/payment/razorpay/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                  order_number: orderNumber,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_order_id: paymentResponse.razorpay_order_id || razorpayOrderId,
                  razorpay_signature: paymentResponse.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                setIsRedirectingToSuccess(true);
                clearCart();
                window.location.replace(verifyData.redirect_url);
              } else {
                setErrorMessage(
                  `Payment received (Ref #${paymentResponse.razorpay_payment_id}). If your bank account was debited, your order is secured and will be confirmed within 24 hours.`
                );
                setProcessing(false);
                setIsProcessingPayment(false);
              }
            } catch (err) {
              setErrorMessage(
                `Payment received (Ref #${paymentResponse.razorpay_payment_id}). If your bank was debited, your order will be confirmed within 24 hours or refunded.`
              );
              setProcessing(false);
              setIsProcessingPayment(false);
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setErrorMessage(
            resp.error?.description || 'Payment was declined by your bank or UPI app. Please try another method.'
          );
          setProcessing(false);
          setIsProcessingPayment(false);
        });
        rzp.open();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during checkout.');
      setProcessing(false);
      setIsProcessingPayment(false);
    }
  };

  return (
    <GlozinLayout allProducts={products}>
      <Head title="Secure Checkout — Haarmonaa Fine Jewelry" />

      {/* Fullscreen Luxury Order Confirmation Loader */}
      {(isProcessingPayment || isRedirectingToSuccess) && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 animate-pulse">
              <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#d0473e] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-3 inline-block">
            Payment Verified
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Finalizing Your Order...
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
            Thank you for shopping with Haarmonaa. We're generating your invoice and locking in your complimentary insured delivery.
          </p>
          <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="w-full h-full bg-[#d0473e] animate-pulse rounded-full" />
          </div>
        </div>
      )}

      {/* Header & Breadcrumbs */}
      <section className="pt-10 pb-8 bg-white text-center border-b border-gray-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="text-[13px] font-semibold text-gray-500 mb-4">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2 text-gray-400">•</span>
            <Link href="/cart" className="hover:text-black">Shopping Bag</Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">Secure Checkout</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Express Checkout
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 mt-2 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit Encrypted Checkout • Complimentary Insured Shipping</span>
          </p>
        </div>
      </section>

      <div className="bg-[#fafafa] py-10 sm:py-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {cart.length === 0 && !isProcessingPayment && !isRedirectingToSuccess ? (
            <div className="text-center py-20 bg-white border border-gray-200/80 rounded-[10px] p-10 max-w-lg mx-auto shadow-2xs space-y-4">
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-700">
                <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Your bag is empty</h2>
              <p className="text-xs text-gray-500">
                Add delicate 18k vermeil pieces to your bag before proceeding to checkout. Redirecting you to catalog...
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-block bg-black hover:bg-[#d0473e] text-white px-7 py-3 rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  Browse Catalog
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: Shipping & Payment Details (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Shipping Information */}
                <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                      1. Delivery Address & Contact
                    </h2>
                    <span className="text-[11px] font-bold text-gray-400">Step 1 of 2</span>
                  </div>

                  {/* Saved Address Selector (if customer has saved addresses) */}
                  {savedAddresses.length > 0 && (
                    <div className="space-y-3 pb-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Select Saved Delivery Address
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAddressId('new');
                            setFormData((prev) => ({
                              ...prev,
                              address: '',
                              city: '',
                              postalCode: '',
                            }));
                          }}
                          className="text-xs font-bold text-[#d0473e] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{selectedAddressId === 'new' ? 'Using New Address' : 'Use a Different Address'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2 relative ${
                              selectedAddressId === addr.id
                                ? 'border-black bg-gray-50/80 shadow-xs'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="selected_address"
                                  checked={selectedAddressId === addr.id}
                                  onChange={() => setSelectedAddressId(addr.id)}
                                  className="w-4 h-4 text-black focus:ring-black cursor-pointer"
                                />
                                <span className="text-xs font-bold text-gray-900">{addr.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                  {addr.type}
                                </span>
                                {addr.is_default && (
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Default
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 leading-relaxed pl-6">
                              {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}<br />
                              <strong className="text-gray-900">{addr.city} - {addr.postal_code}</strong><br />
                              <span className="text-gray-500">{addr.phone}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Manual Address Fields (If 'new' selected or no saved addresses) */}
                  {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
                    <div className="space-y-4 animate-fade-in">
                      {savedAddresses.length > 0 && (
                        <div className="text-xs font-bold text-gray-700 pb-1">
                          Entering New Delivery Address:
                        </div>
                      )}

                      {/* Name Fields */}
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
                            placeholder="E.g. Priya"
                            className="w-full bg-gray-50/70 border border-gray-200 rounded-[8px] py-3 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white transition-all"
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
                            placeholder="E.g. Sharma"
                            className="w-full bg-gray-50/70 border border-gray-200 rounded-[8px] py-3 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      {/* Contact Fields */}
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
                            placeholder="priya@example.com"
                            className="w-full bg-gray-50/70 border border-gray-200 rounded-[8px] py-3 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                          />
                          <span className="text-[10.5px] text-gray-400 mt-1 block">
                            Order confirmation & invoice will be sent here.
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            Mobile Number <span className="text-[#d0473e]">*</span>
                          </label>
                          <PhoneInput
                            value={formData.phone}
                            onChange={(val) => setFormData({ ...formData, phone: val })}
                            required
                          />
                          <span className="text-[10.5px] text-gray-400 mt-1 block">
                            For delivery courier tracking SMS & OTP.
                          </span>
                        </div>
                      </div>

                      {/* Street Address */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Street Address & Apartment <span className="text-[#d0473e]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="House / Flat No., Building Name, Street & Landmark"
                          className="w-full bg-gray-50/70 border border-gray-200 rounded-[8px] py-3 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                        />
                      </div>

                      {/* City & PIN */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            City / District <span className="text-[#d0473e]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Mumbai"
                            className="w-full bg-gray-50/70 border border-gray-200 rounded-[8px] py-3 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white transition-all"
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
                            className="w-full bg-gray-50/70 border border-gray-200 rounded-[8px] py-3 px-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      {/* Save Address Checkbox for Logged In Customer */}
                      {usePage<any>().props.auth?.user && (
                        <div className="pt-3 border-t border-gray-100 space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                            <input
                              type="checkbox"
                              checked={saveAddress}
                              onChange={(e) => setSaveAddress(e.target.checked)}
                              className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                            />
                            <span>Save this address to my account for future orders</span>
                          </label>

                          {saveAddress && (
                            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 pl-5">
                              <input
                                type="checkbox"
                                checked={setAsDefault}
                                onChange={(e) => setSetAsDefault(e.target.checked)}
                                className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                              />
                              <span>Set as my default delivery address</span>
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summary of Selected Address if using saved address */}
                  {selectedAddressId !== 'new' && savedAddresses.length > 0 && (
                    <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-900 font-medium">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Selected: <strong>{formData.firstName} {formData.lastName}</strong> • {formData.address}, {formData.city} ({formData.postalCode})
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-mono">{formData.phone}</span>
                    </div>
                  )}
                </div>

                {/* 2. Payment Method Options */}
                <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-5">
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
                      className={`block p-4 rounded-[10px] border-2 transition-all cursor-pointer ${
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
                      className={`block p-4 rounded-[10px] border-2 transition-all cursor-pointer ${
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
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-[8px] font-medium">
                      {errorMessage}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Summary & Coupon Promo (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-[10px] border border-gray-200/80 shadow-2xs space-y-6">
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
                        <div className="relative w-14 h-14 rounded-[8px] overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                          <img
                            src={item.variant?.image || item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-bl-[6px] flex items-center justify-center">
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

                  {/* PROMO COUPON CODE SECTION */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                      <Tag className="w-3.5 h-3.5 text-amber-600" />
                      <span>Have a Promo Code or Voucher?</span>
                    </div>

                    {/* Applied Coupons List */}
                    {appliedCoupons.length > 0 && (
                      <div className="space-y-2">
                        {appliedCoupons.map((c) => (
                          <div
                            key={c.code}
                            className="p-3 bg-emerald-50 border border-emerald-200 rounded-[8px] flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-extrabold text-emerald-900 font-mono">
                                    {c.code}
                                  </span>
                                  {c.allow_stacking && (
                                    <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[9px] font-bold rounded-full font-sans uppercase">
                                      Stacked
                                    </span>
                                  )}
                                </div>
                                <span className="block text-[10.5px] text-emerald-700 font-semibold">
                                  Saved ₹{Number(c.discount).toFixed(2)} on this order
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveCoupon(c.code)}
                              className="p-1 text-emerald-800 hover:text-rose-600 rounded-full hover:bg-emerald-100 transition-colors cursor-pointer"
                              title={`Remove ${c.code}`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Coupon Input Form */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder={appliedCoupons.length > 0 ? "Enter another stackable code..." : "Enter promo code..."}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-[8px] py-2 px-3.5 text-xs font-mono font-bold uppercase text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon || !couponInput.trim()}
                        className="px-4 py-2 bg-[#111111] hover:bg-[#d0473e] text-white font-bold text-xs rounded-[8px] transition-all disabled:opacity-50 cursor-pointer shrink-0"
                      >
                        {applyingCoupon ? 'Checking...' : 'Apply Coupon'}
                      </button>
                    </div>

                    {couponError && (
                      <div className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-[8px]">
                        {couponError}
                      </div>
                    )}
                    {couponSuccess && (
                      <div className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 p-2.5 rounded-[8px]">
                        {couponSuccess}
                      </div>
                    )}
                  </div>

                  {/* Price Calculations */}
                  <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
                    </div>

                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>
                          Coupon Discount ({appliedCoupons.map((c) => c.code).join(', ')})
                        </span>
                        <span>- ₹{couponDiscount.toFixed(2)}</span>
                      </div>
                    )}

                    {taxRate > 0 && tax > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>GST ({taxRate}% Tax)</span>
                        <span className="font-bold text-gray-900">₹{tax.toFixed(2)}</span>
                      </div>
                    )}

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
                    className="w-full py-4 bg-[#111111] hover:bg-[#d0473e] text-white font-extrabold text-xs uppercase tracking-wider rounded-[10px] flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
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
