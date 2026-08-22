import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../shop/CartDrawer';
import { QuickViewModal } from '../shop/QuickViewModal';
import { SearchModal } from '../shop/SearchModal';
import { Product } from '@/types/shop';
import { useCart } from '@/context/CartContext';

import { ToastNotification } from '@/components/ui/ToastNotification';

interface GlozinLayoutProps {
  children: React.ReactNode;
  allProducts?: Product[];
}

export const GlozinLayout: React.FC<GlozinLayoutProps> = ({ children, allProducts = [] }) => {
  const {
    cartCount,
    wishlistCount,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    addToCart,
  } = useCart();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-800 antialiased overflow-x-hidden selection:bg-[#d0473e] selection:text-white">
      {/* Header with live dynamic counts directly from single global CartContext */}
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Page Slot */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Quick View Popup Modal */}
      <QuickViewModal
        isOpen={!!quickViewProduct}
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, color, size, qty) => addToCart(p, null, color, size, qty)}
      />

      {/* Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={allProducts}
      />

      {/* Global Floating Toast Notifications */}
      <ToastNotification />
    </div>
  );
};
