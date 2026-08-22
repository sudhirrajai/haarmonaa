import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { HaarmonaaLogo } from '@/components/layout/HaarmonaaLogo';
import {
  LayoutDashboard,
  Gem,
  FolderTree,
  Sliders,
  ShoppingBag,
  Users,
  Settings,
  Menu,
  X,
  ExternalLink,
  Bell,
  Search,
  ChevronRight,
  ChevronDown,
  LogOut,
  Sparkles,
  Layers,
  Tag,
  Layout,
} from 'lucide-react';


import { ToastNotification } from '@/components/ui/ToastNotification';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Dashboard' }) => {
  const { url, props } = usePage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(true);

  const flash = (props.flash as { success?: string; error?: string }) || {};
  const authUser = (props.auth as { user?: { name: string; email: string } })?.user || {
    name: 'Admin Concierge',
    email: 'admin@haarmonaa.in',
  };

  const isProductsActive =
    url.startsWith('/admin/products') ||
    url.startsWith('/admin/collections') ||
    url.startsWith('/admin/categories') ||
    url.startsWith('/admin/attributes');


  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-2xs">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/admin" className="flex items-center gap-3">
            <HaarmonaaLogo className="h-7 sm:h-8 w-auto" />
            <span className="hidden sm:inline-block px-2 py-0.5 bg-[#111111] text-amber-300 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
              ADMIN
            </span>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              className="w-full bg-gray-50 hover:bg-gray-100/70 border border-gray-200/90 rounded-full py-2 pl-9 pr-4 text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right: Actions & User Menu */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* View Live Storefront Button */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 border border-gray-300 hover:border-black bg-white hover:bg-gray-50 text-gray-800 hover:text-black rounded-full text-xs font-bold transition-all shadow-2xs"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </a>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-black rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#d0473e] rounded-full ring-2 ring-white" />
          </button>

          {/* Admin Avatar & Logout */}
          <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-amber-300 font-bold text-xs flex items-center justify-center shadow-xs">
              {authUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-gray-900 leading-tight">{authUser.name}</span>
              <span className="block text-[10.5px] text-gray-500 leading-tight">{authUser.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-[#d0473e] rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar (Fixed Left) */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200/80 p-5 justify-between">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 px-3 block mb-2">
              MANAGEMENT
            </span>

            {/* Dashboard Link */}
            <Link
              href="/admin"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                url === '/admin' || url === '/admin/'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard
                  className={`w-4 h-4 ${
                    url === '/admin' || url === '/admin/' ? 'text-amber-300' : 'text-gray-500'
                  }`}
                />
                <span>Dashboard</span>
              </div>
              {(url === '/admin' || url === '/admin/') && (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )}
            </Link>

            {/* Products Group with Nested Submenu */}
            <div className="space-y-1">
              <button
                onClick={() => setProductsMenuOpen(!productsMenuOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isProductsActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Gem className={`w-4 h-4 ${isProductsActive ? 'text-amber-600' : 'text-gray-500'}`} />
                  <span>Products</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                    productsMenuOpen ? 'rotate-180 text-black' : ''
                  }`}
                />
              </button>

              {/* Submenu Items */}
              {productsMenuOpen && (
                <div className="pl-6 pr-1 py-1 space-y-1 animate-fade-in border-l-2 border-gray-100 ml-4">
                  <Link
                    href="/admin/products"
                    className={`block px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      url.startsWith('/admin/products')
                        ? 'bg-[#111111] text-white font-bold'
                        : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    All Products
                  </Link>
                  <Link
                    href="/admin/collections"
                    className={`block px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      url.startsWith('/admin/collections')
                        ? 'bg-[#111111] text-white font-bold'
                        : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    Collections
                  </Link>
                  <Link
                    href="/admin/categories"
                    className={`block px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      url.startsWith('/admin/categories')
                        ? 'bg-[#111111] text-white font-bold'
                        : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    Categories
                  </Link>
                  <Link
                    href="/admin/attributes"
                    className={`block px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      url.startsWith('/admin/attributes')
                        ? 'bg-[#111111] text-white font-bold'
                        : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    Attributes
                  </Link>
                </div>

              )}
            </div>

            {/* Orders Link */}
            <Link
              href="/admin/orders"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                url.startsWith('/admin/orders')
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag
                  className={`w-4 h-4 ${url.startsWith('/admin/orders') ? 'text-amber-300' : 'text-gray-500'}`}
                />
                <span>Orders</span>
              </div>
              {url.startsWith('/admin/orders') && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
            </Link>

            {/* Customers Link */}
            <Link
              href="/admin/customers"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                url.startsWith('/admin/customers')
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users
                  className={`w-4 h-4 ${url.startsWith('/admin/customers') ? 'text-amber-300' : 'text-gray-500'}`}
                />
                <span>Customers</span>
              </div>
              {url.startsWith('/admin/customers') && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
            </Link>

            {/* Coupons & Discounts Link */}
            <Link
              href="/admin/coupons"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                url.startsWith('/admin/coupons')
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag
                  className={`w-4 h-4 ${url.startsWith('/admin/coupons') ? 'text-amber-300' : 'text-gray-500'}`}
                />
                <span>Coupons & Promo</span>
              </div>
              {url.startsWith('/admin/coupons') && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
            </Link>

            {/* Pages & Section Builder Link */}
            <Link
              href="/admin/pages"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                url.startsWith('/admin/pages') || url.startsWith('/admin/cms')
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layout
                  className={`w-4 h-4 ${url.startsWith('/admin/pages') || url.startsWith('/admin/cms') ? 'text-amber-300' : 'text-gray-500'}`}
                />
                <span>Pages & Sections</span>
              </div>
              {(url.startsWith('/admin/pages') || url.startsWith('/admin/cms')) && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
            </Link>

            {/* Settings Link */}
            <Link
              href="/admin/settings"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                url.startsWith('/admin/settings')
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings
                  className={`w-4 h-4 ${url.startsWith('/admin/settings') ? 'text-amber-300' : 'text-gray-500'}`}
                />
                <span>Settings</span>
              </div>
              {url.startsWith('/admin/settings') && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
            </Link>
          </div>


          {/* Sidebar Luxury Promo Card */}
          <div className="bg-gradient-to-br from-[#192723] to-[#0f1715] text-white p-4 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Haarmonaa 2026</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Curated fine jewelry luxury platform. All transactions protected with 256-bit SSL.
            </p>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-64 max-w-[80vw] bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-10 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <HaarmonaaLogo className="h-6 w-auto" />
                  <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-gray-500 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/admin"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-700 hover:bg-gray-100"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/admin/products"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-700 hover:bg-gray-100"
                  >
                    <Gem className="w-4 h-4" />
                    <span>All Products</span>
                  </Link>
                  <Link
                    href="/admin/collections"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-700 hover:bg-gray-100"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Collections</span>
                  </Link>
                  <Link
                    href="/admin/categories"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-700 hover:bg-gray-100"
                  >
                    <FolderTree className="w-4 h-4" />
                    <span>Categories</span>
                  </Link>

                  <Link
                    href="/admin/attributes"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-700 hover:bg-gray-100"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Attributes</span>
                  </Link>
                  <Link
                    href="/admin/orders"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-700 hover:bg-gray-100"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Orders</span>
                  </Link>
                  <Link
                    href="/admin/customers"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-700 hover:bg-gray-100"
                  >
                    <Users className="w-4 h-4" />
                    <span>Customers</span>
                  </Link>
                  <Link
                    href="/admin/pages"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-700 hover:bg-gray-100"
                  >
                    <Layout className="w-4 h-4 text-amber-500" />
                    <span>Pages & Sections</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>

                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-2xl hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

      {/* Global Floating Toast Notifications (Success, Error, Validation, Warnings) */}
      <ToastNotification />
    </div>
  );
};
