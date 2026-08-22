import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  Home,
  User as UserIcon,
  Store,
  Heart,
  ShoppingBag,
} from 'lucide-react';

interface MobileBottomNavProps {
  cartCount?: number;
  wishlistCount?: number;
  onOpenCart?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
}) => {
  const { url, props } = usePage<any>();
  const user = props.auth?.user;

  const accountHref = user
    ? user.role === 'admin'
      ? '/admin'
      : '/account'
    : '/login';

  const isHomeActive = url === '/';
  const isShopActive = url.startsWith('/shop') || url.startsWith('/category');
  const isWishlistActive = url.startsWith('/wishlist');
  const isAccountActive = url.startsWith('/account') || url.startsWith('/login') || url.startsWith('/register') || url.startsWith('/admin');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden safe-area-bottom">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isHomeActive ? 'text-black font-bold' : 'text-gray-600 hover:text-black'
          }`}
        >
          <Home className={`w-5 h-5 mb-1 ${isHomeActive ? 'stroke-[2.2] text-[#d0473e]' : 'stroke-[1.7]'}`} />
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        {/* 2. Account */}
        <Link
          href={accountHref}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isAccountActive ? 'text-black font-bold' : 'text-gray-600 hover:text-black'
          }`}
        >
          <UserIcon className={`w-5 h-5 mb-1 ${isAccountActive ? 'stroke-[2.2] text-[#d0473e]' : 'stroke-[1.7]'}`} />
          <span className="text-[10px] tracking-tight">{user ? (user.role === 'admin' ? 'Admin' : 'Account') : 'Account'}</span>
        </Link>

        {/* 3. Shop */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isShopActive ? 'text-black font-bold' : 'text-gray-600 hover:text-black'
          }`}
        >
          <Store className={`w-5 h-5 mb-1 ${isShopActive ? 'stroke-[2.2] text-[#d0473e]' : 'stroke-[1.7]'}`} />
          <span className="text-[10px] tracking-tight">Shop</span>
        </Link>

        {/* 4. Wishlist with Badge */}
        <Link
          href="/wishlist"
          className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
            isWishlistActive ? 'text-black font-bold' : 'text-gray-600 hover:text-black'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 mb-1 ${isWishlistActive ? 'stroke-[2.2] text-[#d0473e] fill-[#d0473e]/10' : 'stroke-[1.7]'}`} />
            <span className="absolute -top-1 -right-2.5 bg-[#d0473e] text-white text-[9px] font-extrabold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-0.5 shadow-2xs">
              {wishlistCount}
            </span>
          </div>
          <span className="text-[10px] tracking-tight">Wishlist</span>
        </Link>

        {/* 5. Cart with Badge */}
        <button
          type="button"
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 text-gray-600 hover:text-black transition-colors relative cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-1 stroke-[1.7]" />
            <span className="absolute -top-1 -right-2.5 bg-[#d0473e] text-white text-[9px] font-extrabold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-0.5 shadow-2xs">
              {cartCount}
            </span>
          </div>
          <span className="text-[10px] tracking-tight">Cart</span>
        </button>
      </div>
    </nav>
  );
};
