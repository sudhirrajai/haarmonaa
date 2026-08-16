import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { GlozinLayout } from '@/components/layout/GlozinLayout';
import { Product } from '@/types/shop';
import { PhoneInput } from '@/components/shop/PhoneInput';
import { Eye, EyeOff } from 'lucide-react';

interface RegisterProps {
  products?: Product[];
}

export default function Register({ products = [] }: RegisterProps) {
  const [data, setData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    router.post('/register', data, {
      onError: (err) => {
        setErrors(err);
        setProcessing(false);
      },
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <GlozinLayout allProducts={products}>
      <Head title="Register — Haarmonaa Luxury Jewelry" />

      <div className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-[440px] mx-auto text-center space-y-8">
          {/* Breadcrumb & Main Heading */}
          <div className="space-y-3">
            <nav className="text-[13px] font-medium text-gray-500 flex items-center justify-center gap-2">
              <Link href="/" className="hover:text-black transition-colors">
                Home
              </Link>
              <span className="text-gray-300">•</span>
              <span className="text-gray-700">My account</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Register
            </h1>
          </div>

          {/* Form Container */}
          <div className="space-y-6 text-left">
            <h2 className="text-xl font-bold text-gray-900 text-center">Create Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    placeholder="Full name *"
                    className="w-full bg-white border border-gray-200/90 rounded-2xl py-3.5 px-5 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
                {errors.name && (
                  <span className="text-[#d0473e] text-xs mt-1.5 ml-2 block">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email Input */}
              <div>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    placeholder="Email address *"
                    className="w-full bg-white border border-gray-200/90 rounded-2xl py-3.5 px-5 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
                {errors.email && (
                  <span className="text-[#d0473e] text-xs mt-1.5 ml-2 block">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Country Code & Phone Input with IP auto-detect & Indian validation */}
              <div>
                <PhoneInput
                  value={data.phone}
                  onChange={(fullNumber) => setData({ ...data, phone: fullNumber })}
                  error={errors.phone}
                  required={false}
                />
              </div>

              {/* Password Input with Eye Toggle */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={data.password}
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                    placeholder="Password *"
                    className="w-full bg-white border border-gray-200/90 rounded-2xl py-3.5 pl-5 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 stroke-[1.7]" />
                    ) : (
                      <Eye className="w-5 h-5 stroke-[1.7]" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-[#d0473e] text-xs mt-1.5 ml-2 block">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Confirm Password with Eye Toggle */}
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={data.password_confirmation}
                    onChange={(e) =>
                      setData({ ...data, password_confirmation: e.target.value })
                    }
                    placeholder="Confirm password *"
                    className="w-full bg-white border border-gray-200/90 rounded-2xl py-3.5 pl-5 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 stroke-[1.7]" />
                    ) : (
                      <Eye className="w-5 h-5 stroke-[1.7]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3.5 bg-[#111111] hover:bg-black text-white font-bold text-sm rounded-full transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                >
                  {processing ? 'Creating account...' : 'Register'}
                </button>
              </div>
            </form>

            {/* Back to Sign In Link */}
            <div className="pt-4 text-center border-t border-gray-100 space-y-3">
              <span className="text-xs text-gray-500 block">Already have an account?</span>
              <Link
                href="/login"
                className="w-full py-3 border border-gray-300 hover:border-black hover:bg-black hover:text-white text-gray-900 font-bold text-sm rounded-full transition-all flex items-center justify-center cursor-pointer"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GlozinLayout>
  );
}
