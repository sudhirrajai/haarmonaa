import React, { useState, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Sparkles,
  PackageCheck,
  Gem,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { HaarmonaaLogo } from './HaarmonaaLogo';

interface HeaderProps {
  cartCount?: number;
  wishlistCount?: number;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount = 1,
  wishlistCount = 0,
  onOpenCart,
  onOpenSearch,
}) => {
  const { auth } = usePage<{ auth?: { user?: { name: string; email: string } | null } }>().props;
  const user = auth?.user;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const accountRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onOpenSearch) {
        onOpenSearch();
      } else {
        router.visit(`/shop?search=${encodeURIComponent(searchQuery)}`);
      }
    } else if (onOpenSearch) {
      onOpenSearch();
    }
  };

  const handleLogout = () => {
    setAccountMenuOpen(false);
    router.post('/logout');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-2xs transition-all w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Left Corner: Mobile Toggle & Haarmonaa Logo */}
          <div className="flex-1 flex items-center justify-start">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-black focus:outline-hidden lg:hidden mr-2 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center py-2 group">
              <HaarmonaaLogo />
            </Link>
          </div>

          {/* Absolute Center: Main Navigation Menu with Bold Typography */}
          <nav className="hidden lg:flex items-center justify-center space-x-10 text-[15px] font-semibold tracking-tight text-gray-900">
            <Link
              href="/"
              className="hover:text-[#d0473e] transition-colors py-1 font-bold text-[#111111]"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="hover:text-[#d0473e] transition-colors py-1"
            >
              Shop
            </Link>
            <Link
              href="/about-us"
              className="hover:text-[#d0473e] transition-colors py-1"
            >
              About Us
            </Link>
            <Link
              href="/contact-us"
              className="hover:text-[#d0473e] transition-colors py-1"
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Corner: Search Pill Input + Account + Wishlist + Cart */}
          <div className="flex-1 flex items-center justify-end space-x-4 sm:space-x-6">
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <div
                onClick={onOpenSearch}
                className="flex items-center bg-white border border-gray-200 hover:border-gray-300 rounded-full py-2 px-4 w-48 lg:w-60 cursor-pointer transition-all shadow-2xs focus-within:ring-2 focus-within:ring-gray-200"
              >
                <Search className="w-4 h-4 text-gray-400 mr-2.5 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="I'm looking for..."
                  className="w-full bg-transparent border-none text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden p-0"
                />
              </div>
            </form>

            {/* Mobile Search Trigger Icon */}
            <button
              onClick={onOpenSearch}
              className="p-1.5 text-gray-700 hover:text-[#d0473e] md:hidden cursor-pointer"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Account Dropdown Menu */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="p-1 text-gray-800 hover:text-[#d0473e] transition-colors relative flex items-center justify-center cursor-pointer"
                title={user ? `Signed in as ${user.name}` : 'Account'}
              >
                <UserIcon className="w-5 h-5 stroke-[1.8]" />
                {user && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white text-gray-900 border border-gray-200/90 rounded-2xl shadow-xl p-4 z-50 animate-fade-in space-y-3">
                  {user ? (
                    <>
                      <div className="pb-3 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {user.role === 'admin' ? 'Administrator' : 'Customer Account'}
                          </span>
                          {user.role === 'admin' && (
                            <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[9.5px] font-bold border border-purple-200">
                              Admin
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 truncate">{user.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      <div className="space-y-1">
                        {user.role === 'admin' ? (
                          <>
                            <Link
                              href="/admin"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                            >
                              <LayoutDashboard className="w-4 h-4 text-gray-500" />
                              <span>Admin Dashboard</span>
                            </Link>
                            <Link
                              href="/admin/orders"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                            >
                              <PackageCheck className="w-4 h-4 text-gray-500" />
                              <span>Orders & Shipments</span>
                            </Link>
                            <Link
                              href="/admin/products"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                            >
                              <Gem className="w-4 h-4 text-gray-500" />
                              <span>Jewelry Inventory</span>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/account/orders"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                            >
                              <Package className="w-4 h-4 text-gray-500" />
                              <span>My Orders & Shipments</span>
                            </Link>
                            <Link
                              href="/account"
                              onClick={() => setAccountMenuOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                            >
                              <UserIcon className="w-4 h-4 text-gray-500" />
                              <span>Account Overview</span>
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="pb-3 border-b border-gray-100 text-center space-y-1">
                        <h4 className="text-sm font-bold text-gray-900">Welcome</h4>
                        <p className="text-xs text-gray-500">
                          Sign in to access your orders and boutique profile.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Link
                          href="/login"
                          onClick={() => setAccountMenuOpen(false)}
                          className="w-full py-2.5 bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-[8px] flex items-center justify-center gap-2 transition-all shadow-xs"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Sign In</span>
                        </Link>

                        <Link
                          href="/register"
                          onClick={() => setAccountMenuOpen(false)}
                          className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-xs uppercase tracking-wider rounded-[8px] flex items-center justify-center gap-2 transition-all"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Create Account</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}

            </div>

            {/* Wishlist Heart Icon with Red Badge */}
            <Link
              href="/wishlist"
              className="p-1 text-gray-800 hover:text-[#d0473e] transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.8]" />
              <span className="absolute -top-1.5 -right-2 bg-[#d0473e] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            </Link>

            {/* Shopping Bag / Cart Icon with Red Badge */}
            <button
              onClick={onOpenCart}
              className="p-1 text-gray-800 hover:text-[#d0473e] transition-colors relative focus:outline-hidden cursor-pointer"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              <span className="absolute -top-1.5 -right-2 bg-[#d0473e] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white py-4 px-6 space-y-3 animate-fade-in shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-gray-900 hover:text-[#d0473e]"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-gray-900 hover:text-[#d0473e]"
          >
            Shop
          </Link>
          <Link
            href="/about-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-gray-900 hover:text-[#d0473e]"
          >
            About Us
          </Link>
          <Link
            href="/contact-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-gray-900 hover:text-[#d0473e]"
          >
            Contact Us
          </Link>

          <div className="pt-3 border-t border-gray-100 space-y-2">
            {user ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-xs font-bold text-amber-700 bg-amber-50 rounded-xl px-3"
                >
                  👑 Admin Dashboard ({user.name})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.post('/logout');
                  }}
                  className="w-full text-left py-2 text-xs font-bold text-rose-600 px-3 cursor-pointer"
                >
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-black text-white text-xs font-bold rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 bg-gray-100 text-gray-900 text-xs font-bold rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
