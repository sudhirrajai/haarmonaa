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
  Package,
  ShieldCheck,
  ChevronRight,
  Truck,
  Gift,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { HaarmonaaLogo } from './HaarmonaaLogo';

interface HeaderProps {
  cartCount?: number;
  wishlistCount?: number;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenSearch,
}) => {
  const { url, props } = usePage<any>();
  const user = props.auth?.user;
  const storeSettings = props.settings || {};

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

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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
    setMobileMenuOpen(false);
    router.post('/logout');
  };

  // Helper to render top promo bar icon
  const renderTopbarIcon = (iconName?: string) => {
    switch (iconName) {
      case 'truck':
        return <Truck className="w-3.5 h-3.5 shrink-0" />;
      case 'gift':
        return <Gift className="w-3.5 h-3.5 shrink-0" />;
      case 'tag':
        return <Tag className="w-3.5 h-3.5 shrink-0" />;
      case 'shield':
        return <ShieldCheck className="w-3.5 h-3.5 shrink-0" />;
      case 'gem':
        return <Gem className="w-3.5 h-3.5 shrink-0" />;
      case 'none':
        return null;
      case 'sparkles':
      default:
        return <Sparkles className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  // Resolve dynamic navigation items
  const defaultNavItems = [
    { id: '1', label: 'Home', url: '/', is_external: false, is_enabled: true },
    { id: '2', label: 'Jewelry Catalog', url: '/shop', is_external: false, is_enabled: true },
    { id: '3', label: 'About Us', url: '/about-us', is_external: false, is_enabled: true },
    { id: '4', label: 'Contact Us', url: '/contact-us', is_external: false, is_enabled: true },
  ];

  const rawNavItems = storeSettings.header_nav_items;
  const navItems = (Array.isArray(rawNavItems) && rawNavItems.length > 0 ? rawNavItems : defaultNavItems).filter(
    (item: any) => item.is_enabled !== false
  );

  return (
    <>
      {/* Sticky Header Container */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100/90 shadow-2xs transition-all w-full">
        {/* Dynamic Top Promotional Bar (Customizable from Admin) */}
        {storeSettings.enable_topbar !== false && (
          <div
            style={{
              backgroundColor: storeSettings.topbar_bg_color || '#111111',
              color: storeSettings.topbar_text_color || '#ffffff',
            }}
            className="text-[10.5px] sm:text-[11px] font-semibold py-2 px-4 text-center tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            {renderTopbarIcon(storeSettings.topbar_icon)}
            {storeSettings.topbar_link ? (
              <Link
                href={storeSettings.topbar_link}
                className="hover:underline flex items-center gap-1.5"
              >
                <span>{storeSettings.topbar_text || 'COMPLIMENTARY LUXURY GIFT BOX & EXPRESS SHIPPING ON ALL ORDERS'}</span>
              </Link>
            ) : (
              <span>{storeSettings.topbar_text || 'COMPLIMENTARY LUXURY GIFT BOX & EXPRESS SHIPPING ON ALL ORDERS'}</span>
            )}
          </div>
        )}

        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-18 sm:h-20 relative">
            {/* MOBILE LAYOUT (Screens < lg): Left Hamburger | Center Logo | Right Search & Cart */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-gray-800 hover:text-black focus:outline-hidden cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6 stroke-[1.8]" />
              </button>
            </div>

            {/* Mobile Logo: Perfectly Centered on Mobile Devices */}
            <div className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <Link href="/" className="flex items-center py-1 group">
                <HaarmonaaLogo
                  logoUrl={storeSettings.store_logo}
                  logoHeight={storeSettings.header_logo_height || 40}
                  className="transition-transform group-hover:scale-105 duration-300"
                />
              </Link>
            </div>

            {/* Mobile Right Icons: Search & Cart */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-1.5 text-gray-800 hover:text-[#d0473e] transition-colors cursor-pointer"
                title="Search Jewelry"
              >
                <Search className="w-5 h-5 stroke-[1.8]" />
              </button>

              <button
                type="button"
                onClick={onOpenCart}
                className="p-1.5 text-gray-800 hover:text-[#d0473e] transition-colors relative cursor-pointer"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                <span className="absolute -top-1 -right-2 bg-[#d0473e] text-white text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center shadow-2xs">
                  {cartCount}
                </span>
              </button>
            </div>

            {/* DESKTOP LAYOUT (Screens >= lg): Left Logo | Center Nav | Right Search, Account, Wishlist, Cart */}
            {/* Left Corner: Brand Logo */}
            <div className="hidden lg:flex items-center justify-start flex-1">
              <Link href="/" className="flex items-center py-2 group">
                <HaarmonaaLogo
                  logoUrl={storeSettings.store_logo}
                  logoHeight={storeSettings.header_logo_height || 44}
                  className="transition-transform group-hover:scale-105 duration-300"
                />
              </Link>
            </div>

            {/* Absolute Center: Desktop Dynamic Navigation Links */}
            <nav className="hidden lg:flex items-center justify-center space-x-8 xl:space-x-10 text-[14px] font-semibold tracking-tight text-gray-900">
              {navItems.map((item: any) => {
                const isActive = item.url === '/' ? url === '/' : url.startsWith(item.url);
                if (item.is_external) {
                  return (
                    <a
                      key={item.id || item.label}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1 text-gray-700 hover:text-[#d0473e] transition-colors flex items-center gap-1"
                    >
                      <span>{item.label}</span>
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.id || item.label}
                    href={item.url}
                    className={`py-1 transition-colors ${
                      isActive
                        ? 'text-black font-extrabold border-b-2 border-black'
                        : 'text-gray-700 hover:text-[#d0473e]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Corner: Search Input + Account + Wishlist + Cart */}
            <div className="hidden lg:flex items-center justify-end flex-1 space-x-5">
              {/* Search Pill Input */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <div
                  onClick={onOpenSearch}
                  className="flex items-center bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200 hover:border-gray-300 rounded-full py-2 px-4 w-48 xl:w-56 cursor-pointer transition-all shadow-2xs"
                >
                  <Search className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jewelry..."
                    className="w-full bg-transparent border-none text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden p-0"
                  />
                </div>
              </form>

              {/* User Account Dropdown */}
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="p-2 text-gray-800 hover:text-[#d0473e] hover:bg-gray-50 rounded-full transition-colors relative flex items-center justify-center cursor-pointer"
                  title={user ? `Signed in as ${user.name}` : 'Account'}
                >
                  <UserIcon className="w-5 h-5 stroke-[1.8]" />
                  {user && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
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
                          <p className="text-xs text-gray-500 truncate font-mono">{user.email}</p>
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
                              <Link
                                href="/admin/profile"
                                onClick={() => setAccountMenuOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-50 rounded-xl transition-all"
                              >
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <span>Admin Profile</span>
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
                            type="button"
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
                            className="w-full py-2.5 bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
                          >
                            <LogIn className="w-4 h-4" />
                            <span>Sign In</span>
                          </Link>

                          <Link
                            href="/register"
                            onClick={() => setAccountMenuOpen(false)}
                            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all"
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
                className="p-2 text-gray-800 hover:text-[#d0473e] hover:bg-gray-50 rounded-full transition-colors relative"
                title="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.8]" />
                <span className="absolute top-1 right-1 bg-[#d0473e] text-white text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center shadow-2xs">
                  {wishlistCount}
                </span>
              </Link>

              {/* Shopping Bag / Cart Icon with Red Badge */}
              <button
                type="button"
                onClick={onOpenCart}
                className="p-2 text-gray-800 hover:text-[#d0473e] hover:bg-gray-50 rounded-full transition-colors relative focus:outline-hidden cursor-pointer"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                <span className="absolute top-1 right-1 bg-[#d0473e] text-white text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center shadow-2xs">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE LEFT SLIDING NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Left Sliding Panel */}
          <div className="relative w-full max-w-[310px] bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-slide-in-left overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Drawer Header: Logo & Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <HaarmonaaLogo
                  logoUrl={storeSettings.store_logo}
                  logoHeight={storeSettings.header_logo_height || 36}
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* In-Drawer Search Input */}
              <div
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenSearch) onOpenSearch();
                }}
                className="flex items-center bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl py-2.5 px-3.5 cursor-pointer text-gray-400 text-xs transition-all"
              >
                <Search className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                <span>Search fine jewelry...</span>
              </div>

              {/* Dynamic Navigation Links in Mobile Drawer */}
              <nav className="space-y-1">
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400 block px-3 pb-2">
                  Navigation
                </span>

                {navItems.map((item: any) => {
                  const isActive = item.url === '/' ? url === '/' : url.startsWith(item.url);
                  if (item.is_external) {
                    return (
                      <a
                        key={item.id || item.label}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-all"
                      >
                        <span>{item.label}</span>
                        <ExternalLink className="w-4 h-4 opacity-50" />
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={item.id || item.label}
                      href={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-black text-white shadow-xs'
                          : 'text-gray-800 hover:bg-gray-50 hover:text-black'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Link>
                  );
                })}

                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span>Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#d0473e] text-[10.5px] font-bold">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              </nav>

              {/* Customer / Admin Role-Aware Account Section */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400 block px-3 pb-1">
                  My Account
                </span>

                {user ? (
                  <div className="space-y-1.5">
                    <div className="px-3 py-2 bg-gray-50 rounded-xl mb-2">
                      <span className="text-xs font-bold text-gray-900 block truncate">{user.name}</span>
                      <span className="text-[11px] text-gray-500 font-mono block truncate">{user.email}</span>
                    </div>

                    {user.role === 'admin' ? (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-purple-700 bg-purple-50 rounded-xl"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                        <Link
                          href="/admin/orders"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-xl"
                        >
                          <PackageCheck className="w-4 h-4 text-gray-500" />
                          <span>Orders & Shipments</span>
                        </Link>
                        <Link
                          href="/admin/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-xl"
                        >
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Admin Profile</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/account/orders"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-xl"
                        >
                          <Package className="w-4 h-4 text-gray-500" />
                          <span>My Orders & Shipments</span>
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-xl"
                        >
                          <UserIcon className="w-4 h-4 text-gray-500" />
                          <span>Account Overview</span>
                        </Link>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2.5 bg-black hover:bg-[#d0473e] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold rounded-xl transition-all"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Support Info */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/70 space-y-2 text-[11px] text-gray-500">
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Insured Shipping Across India</span>
              </div>
              <p className="text-gray-400 text-[10px]">
                Haarmonaa Fine Jewelry • 18k Anti-Tarnish Vermeil
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
