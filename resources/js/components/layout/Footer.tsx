import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { HaarmonaaLogo } from '@/components/layout/HaarmonaaLogo';
import { ChevronUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0e0e0e] text-white pt-16 sm:pt-20 pb-10 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16">
          {/* Column 1: Brand & Socials (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <HaarmonaaLogo className="h-9 sm:h-10 w-auto" />
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Discover timeless elegance with Haarmonaa's curated fine jewelry collection. Meticulously handcrafted with anti-tarnish, hypoallergenic luxury materials.
            </p>

            <div>
              <a
                href="mailto:support@haarmonaa.in"
                className="text-xs sm:text-[13px] font-bold text-white hover:text-[#d0473e] transition-colors"
              >
                support@haarmonaa.in
              </a>
            </div>

            {/* Circular Social Outline Icons */}
            <div className="flex items-center space-x-2.5 pt-1">
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-gray-700 hover:border-white text-gray-300 hover:text-white flex items-center justify-center transition-all text-xs"
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-gray-700 hover:border-white text-gray-300 hover:text-white flex items-center justify-center transition-all text-xs"
                title="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-gray-700 hover:border-white text-gray-300 hover:text-white flex items-center justify-center transition-all text-xs"
                title="TikTok"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.12 4.87 4.87 0 0 1-2-1.4z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-gray-700 hover:border-white text-gray-300 hover:text-white flex items-center justify-center transition-all text-xs"
                title="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full border border-gray-700 hover:border-white text-gray-300 hover:text-white flex items-center justify-center transition-all text-xs"
                title="Pinterest"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.94-.13-2.39.03-3.42.14-.95.95-4.04.95-4.04s-.24-.49-.24-1.21c0-1.14.66-1.99 1.48-1.99.7 0 1.04.52 1.04 1.15 0 .7-.45 1.76-.68 2.73-.19.82.41 1.49 1.22 1.49 1.47 0 2.6-1.55 2.6-3.79 0-1.98-1.42-3.37-3.46-3.37-2.36 0-3.74 1.77-3.74 3.6 0 .71.27 1.48.61 1.9.07.08.08.15.06.24-.07.28-.21.87-.24 1-.04.16-.13.2-.3.12-1.12-.52-1.82-2.15-1.82-3.47 0-2.82 2.05-5.41 5.92-5.41 3.1 0 5.52 2.21 5.52 5.17 0 3.09-1.95 5.57-4.65 5.57-.91 0-1.76-.47-2.06-1.03l-.56 2.14c-.2.78-.75 1.76-1.12 2.36A12 12 0 1 0 12 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Our Company (2.5 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-normal">
              Our Company
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li>
                <Link href="/terms-of-use" className="hover:text-white transition-colors">
                  Terms Of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="/about-us" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white transition-colors">
                  Store Location
                </Link>
              </li>

            </ul>
          </div>

          {/* Column 3: Shop Categories (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-normal">
              Shop Categories
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li>
                <Link href="/shop?category=bracelets" className="hover:text-white transition-colors">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=earrings" className="hover:text-white transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=necklaces" className="hover:text-white transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/shop?category=rings" className="hover:text-white transition-colors">
                  Rings
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Sign-up (3.5 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-white tracking-normal">
              Sign Up to Newsletter
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sign up for 10% off your first purchase and free shipping. Updates information on Sales and Offers.
            </p>

            {subscribed ? (
              <div className="p-3 bg-white/10 border border-white/20 text-white rounded text-xs">
                ✨ Thank you for subscribing to Haarmonaa updates!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 mb-1.5">
                    Email Address <span className="text-[#d0473e]">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address..."
                    required
                    className="w-full bg-[#161616] border border-gray-800 rounded-sm py-2.5 px-3.5 text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-gray-500 transition-colors"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="bg-white hover:bg-gray-200 text-black px-7 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            )}

            <p className="text-[10.5px] text-gray-500 leading-relaxed pt-1">
              ***By entering the e-mail you accept the{' '}
              <Link href="/about-us" className="text-gray-400 hover:text-white underline">
                terms and conditions
              </Link>{' '}
              and the{' '}
              <Link href="/about-us" className="text-gray-400 hover:text-white underline">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Haarmonaa. All rights reserved.</p>

          {/* Payment Badges Pill Icons */}
          <div className="flex items-center space-x-1.5 opacity-90 grayscale-20">
            <span className="px-2 py-0.5 bg-[#002663] text-white text-[9px] font-black rounded-xs">AMEX</span>
            <span className="px-2 py-0.5 bg-[#ffb3c7] text-black text-[9px] font-bold rounded-xs">Klarna</span>
            <span className="px-2 py-0.5 bg-[#1a1f71] text-white text-[9px] font-bold rounded-xs">DISC</span>
            <span className="px-2 py-0.5 bg-[#eb001b] text-white text-[9px] font-bold rounded-xs">MC</span>
            <span className="px-2 py-0.5 bg-[#0a2f64] text-white text-[9px] font-bold rounded-xs">Maestro</span>
            <span className="px-2 py-0.5 bg-[#1a1f71] text-white text-[9px] font-black rounded-xs">VISA</span>
            <span className="px-2 py-0.5 bg-[#003087] text-white text-[9px] font-bold rounded-xs">PayPal</span>
            <span className="px-2 py-0.5 bg-[#0066b2] text-white text-[9px] font-bold rounded-xs">UPI</span>
          </div>
        </div>
      </div>

      {/* Floating Scroll To Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-white text-black shadow-xl hover:bg-[#d0473e] hover:text-white flex items-center justify-center transition-all cursor-pointer"
        title="Scroll to Top"
        aria-label="Scroll to Top"
      >
        <ChevronUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </footer>
  );
};
