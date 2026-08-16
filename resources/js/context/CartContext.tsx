import React, { createContext, useContext, useState, useEffect } from 'react';
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

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
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
  subtotal: number;
  tax: number;
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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const addToCart = (
    product: Product,
    variant?: ProductVariant | null,
    selectedColor?: string,
    selectedSize?: string,
    quantity: number = 1
  ) => {
    const unitPrice = variant?.price ?? product.price;
    const itemKey = `${product.id}_${variant?.id || 'base'}_${selectedColor || 'def'}_${selectedSize || 'def'}`;

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
        return updated;
      } else {
        return [
          ...prev,
          {
            id: itemKey,
            product,
            variant: variant || undefined,
            selectedColor,
            selectedSize,
            quantity,
            unitPrice,
            subtotal: unitPrice * quantity,
          },
        ];
      }
    });

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity: newQuantity,
            subtotal: item.unitPrice * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
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

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Number((subtotal * 0.03).toFixed(2)); // 3% GST on jewelry
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 49; // Free shipping above ₹999
  const total = Number((subtotal + tax + shipping).toFixed(2));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        subtotal,
        tax,
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
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  toggleWishlist: () => {},
  isInWishlist: () => false,
  removeFromWishlist: () => {},
  subtotal: 0,
  tax: 0,
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

