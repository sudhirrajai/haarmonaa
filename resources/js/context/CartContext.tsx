import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Product, ProductVariant } from '@/types/shop';

export interface CartItem {
  id: string; // Unique cart item key (e.g. product-id_variant-id)
  product: Product;
  variant?: ProductVariant;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface AppliedCoupon {
  id: number;
  code: string;
  description?: string;
  type: 'fixed' | 'percent';
  value: number;
  allow_stacking?: boolean;
  discount: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  appliedCoupons: AppliedCoupon[];
  addToCart: (
    product: Product,
    variant?: ProductVariant | null,
    selectedColor?: string,
    selectedSize?: string,
    quantity?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  removeFromWishlist: (productId: number) => void;
  applyCoupon: (code: string, customerEmail?: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: (code: string) => Promise<void>;
  clearCoupons: () => void;
  subtotal: number;
  couponDiscount: number;
  tax: number;
  taxRate: number;
  shipping: number;
  total: number;
  cartCount: number;
  wishlistCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'haarmonaa_cart_v1';
const WISHLIST_STORAGE_KEY = 'haarmonaa_wishlist_v1';
const COUPONS_STORAGE_KEY = 'haarmonaa_applied_coupons_v1';

export const CartProvider: React.FC<{ children: React.ReactNode; initialSettings?: any }> = ({
  children,
  initialSettings,
}) => {
  const [storeSettings, setStoreSettings] = useState<any>(initialSettings || null);

  useEffect(() => {
    if (initialSettings) {
      setStoreSettings(initialSettings);
    }
  }, [initialSettings]);

  useEffect(() => {
    const unbind = router.on('success', (event: any) => {
      const pageSettings = event.detail.page?.props?.settings;
      if (pageSettings) {
        setStoreSettings(pageSettings);
      }
    });
    return () => unbind();
  }, []);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupons, setAppliedCoupons] = useState<AppliedCoupon[]>(() => {
    try {
      const saved = localStorage.getItem(COUPONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(appliedCoupons));
    } catch (e) {
      console.error('Failed to save coupons to localStorage', e);
    }
  }, [appliedCoupons]);

  // Recalculate coupons whenever cart changes
  const recalculateCoupons = useCallback(
    async (items: CartItem[], currentCoupons: AppliedCoupon[]) => {
      if (items.length === 0 || currentCoupons.length === 0) {
        if (currentCoupons.length > 0 && items.length === 0) {
          setAppliedCoupons([]);
        }
        return;
      }

      try {
        const csrfToken =
          (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
        const response = await fetch('/checkout/recalculate-coupons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
          body: JSON.stringify({
            codes: currentCoupons.map((c) => c.code),
            items: items.map((item) => ({
              product_id: item.product.id,
              quantity: item.quantity,
              unit_price: item.unitPrice,
            })),
          }),
        });

        const data = await response.json();
        if (data.success && Array.isArray(data.coupons)) {
          setAppliedCoupons(data.coupons);
        }
      } catch (err) {
        console.error('Error recalculating coupons:', err);
      }
    },
    []
  );

  const applyCoupon = async (
    code: string,
    customerEmail?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!code || !code.trim()) {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    if (cart.length === 0) {
      return { success: false, message: 'Your cart is empty. Add products first.' };
    }

    try {
      const csrfToken =
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
      const response = await fetch('/checkout/apply-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          email: customerEmail || null,
          existing_codes: appliedCoupons.map((c) => c.code),
          items: cart.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            unit_price: item.unitPrice,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Invalid promo code.',
        };
      }

      if (Array.isArray(data.coupons)) {
        setAppliedCoupons(data.coupons);
      } else if (data.coupon) {
        setAppliedCoupons([data.coupon]);
      }

      return {
        success: true,
        message: data.message || 'Coupon applied successfully!',
      };
    } catch {
      return {
        success: false,
        message: 'Could not connect to server. Please try again.',
      };
    }
  };

  const removeCoupon = async (codeToRemove: string) => {
    const remaining = appliedCoupons.filter(
      (c) => c.code.toUpperCase() !== codeToRemove.toUpperCase()
    );
    setAppliedCoupons(remaining);

    if (remaining.length > 0 && cart.length > 0) {
      await recalculateCoupons(cart, remaining);
    }
  };

  const clearCoupons = () => {
    setAppliedCoupons([]);
  };

  const addToCart = (
    product: Product,
    variant?: ProductVariant | null,
    selectedColor?: string,
    selectedSize?: string,
    quantity: number = 1
  ) => {
    const unitPrice = variant?.price ?? product.price;
    const itemKey = `${product.id}_${variant?.id || 'base'}_${selectedColor || 'def'}_${selectedSize || 'def'}`;

    let updatedCart: CartItem[] = [];

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === itemKey);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          subtotal: newQty * unitPrice,
        };
        updatedCart = updated;
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemKey,
          product,
          variant: variant || undefined,
          selectedColor,
          selectedSize,
          quantity,
          unitPrice,
          subtotal: unitPrice * quantity,
        };
        updatedCart = [...prev, newItem];
        return updatedCart;
      }
    });

    setIsCartDrawerOpen(true);

    if (appliedCoupons.length > 0 && updatedCart.length > 0) {
      recalculateCoupons(updatedCart, appliedCoupons);
    }
  };

  const removeFromCart = (cartItemId: string) => {
    const updated = cart.filter((item) => item.id !== cartItemId);
    setCart(updated);
    if (appliedCoupons.length > 0) {
      recalculateCoupons(updated, appliedCoupons);
    }
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const updated = cart.map((item) => {
      if (item.id === cartItemId) {
        return {
          ...item,
          quantity: newQuantity,
          subtotal: item.unitPrice * newQuantity,
        };
      }
      return item;
    });
    setCart(updated);
    if (appliedCoupons.length > 0) {
      recalculateCoupons(updated, appliedCoupons);
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupons([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((p) => p.id === productId);
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  // Calculations from dynamic store settings & product rules
  const taxRatePercent = typeof storeSettings?.tax_rate_percent === 'number'
    ? storeSettings.tax_rate_percent
    : Number(storeSettings?.tax_rate_percent || 0);

  const freeShippingThreshold = typeof storeSettings?.free_shipping_min_order === 'number'
    ? storeSettings.free_shipping_min_order
    : (storeSettings?.free_shipping_min_order !== undefined
        ? Number(storeSettings.free_shipping_min_order)
        : (storeSettings?.free_shipping_threshold !== undefined
            ? Number(storeSettings.free_shipping_threshold)
            : 999));

  const standardShippingFee = typeof storeSettings?.shipping_fee === 'number'
    ? storeSettings.shipping_fee
    : (storeSettings?.shipping_fee !== undefined ? Number(storeSettings.shipping_fee) : 49);

  const enableFreeShipping = storeSettings?.enable_free_shipping !== undefined
    ? Boolean(storeSettings.enable_free_shipping)
    : true;

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const couponDiscount = appliedCoupons.reduce((sum, c) => sum + (Number(c.discount) || 0), 0);
  const taxableSubtotal = Math.max(0, subtotal - couponDiscount);
  const tax = taxRatePercent > 0 ? Number((taxableSubtotal * (taxRatePercent / 100)).toFixed(2)) : 0;

  // Dynamic Shipping Calculation (WordPress / WooCommerce style)
  let calculatedShipping = standardShippingFee;

  if (cart.length === 0 || subtotal === 0) {
    calculatedShipping = 0;
  } else {
    const allFreeShipping = cart.every((item) => item.product?.shipping_type === 'free');
    const flatRateItem = cart.find(
      (item) => item.product?.shipping_type === 'flat_rate' && typeof item.product?.shipping_fee === 'number'
    );
    const hasExcludeFreeItem = cart.some((item) => item.product?.shipping_type === 'exclude_free_shipping');

    if (allFreeShipping) {
      calculatedShipping = 0;
    } else if (flatRateItem && flatRateItem.product.shipping_fee !== undefined) {
      calculatedShipping = Number(flatRateItem.product.shipping_fee) || 0;
    } else if (!hasExcludeFreeItem && enableFreeShipping && (freeShippingThreshold === 0 || subtotal >= freeShippingThreshold)) {
      calculatedShipping = 0;
    } else {
      calculatedShipping = standardShippingFee;
    }
  }

  const shipping = calculatedShipping;
  const total = Number((taxableSubtotal + tax + shipping).toFixed(2));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        appliedCoupons,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        applyCoupon,
        removeCoupon,
        clearCoupons,
        subtotal,
        couponDiscount,
        tax,
        taxRate: taxRatePercent,
        shipping,
        total,
        cartCount,
        wishlistCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const defaultCartContext: CartContextType = {
  cart: [],
  wishlist: [],
  appliedCoupons: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  toggleWishlist: () => {},
  isInWishlist: () => false,
  removeFromWishlist: () => {},
  applyCoupon: async () => ({ success: false, message: '' }),
  removeCoupon: async () => {},
  clearCoupons: () => {},
  subtotal: 0,
  couponDiscount: 0,
  tax: 0,
  taxRate: 0,
  shipping: 0,
  total: 0,
  cartCount: 0,
  wishlistCount: 0,
  isCartDrawerOpen: false,
  setIsCartDrawerOpen: () => {},
};

export const useCart = () => {
  const context = useContext(CartContext);
  return context || defaultCartContext;
};
