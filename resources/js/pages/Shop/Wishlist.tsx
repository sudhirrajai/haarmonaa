import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { ProductCard } from '@/components/shop/ProductCard';
import { Product } from '@/types/shop';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface WishlistProps {
  products?: Product[];
}

export default function Wishlist({ products = [] }: WishlistProps) {
  const { wishlist, addToCart, toggleWishlist, isInWishlist } = useCart();

  return (
    <GlozinLayout allProducts={products}>
      <Head title="Saved Wishlist — Haarmonaa Luxury Jewelry" />

      {/* Header & Breadcrumbs */}
      <section className="pt-10 pb-8 bg-white text-center border-b border-gray-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="text-[13px] font-semibold text-gray-500 mb-4">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-900 font-bold">My Wishlist</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            My Saved Jewelry ({wishlist.length})
          </h1>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {wishlist.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200/80 rounded-3xl p-10 max-w-lg mx-auto shadow-2xs space-y-5">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
                <Heart className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-gray-900">Your wishlist is currently empty</h2>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Click the heart icon on any jewelry piece across our catalog to save items for later.
                </p>
              </div>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {wishlist.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={isInWishlist(product.id)}
                  onAddToCart={(p) => addToCart(p, null, undefined, undefined, 1)}
                  onToggleWishlist={(p) => toggleWishlist(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </GlozinLayout>
  );
}
