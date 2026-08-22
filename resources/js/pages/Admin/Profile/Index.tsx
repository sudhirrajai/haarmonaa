import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  Save,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';

interface AdminProfileProps {
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
    created_at: string;
  };
}

export default function AdminProfile({ user }: AdminProfileProps) {
  const [data, setData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    router.put('/admin/profile', data, {
      onError: (err) => {
        setErrors(err);
        setProcessing(false);
      },
      onSuccess: () => {
        setProcessing(false);
        setData((prev) => ({
          ...prev,
          current_password: '',
          new_password: '',
          new_password_confirmation: '',
        }));
      },
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <AdminLayout title="Admin Profile & Security">
      <Head title="Admin Profile & Security — Haarmonaa Luxury Jewelry" />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#d0473e] block mb-1">
              Security & Credentials
            </span>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Administrator Profile Management
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Update administrative name, email address, contact phone, and master password.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold shrink-0">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Master Administrator Access</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card: Account Information */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <UserIcon className="w-5 h-5 text-gray-700" />
              <h2 className="text-sm font-bold text-gray-900">Personal & Contact Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Admin Name <span className="text-[#d0473e]">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                  />
                </div>
                {errors.name && <span className="text-[#d0473e] text-xs mt-1 block">{errors.name}</span>}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Admin Email <span className="text-[#d0473e]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono font-medium text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                  />
                </div>
                {errors.email && <span className="text-[#d0473e] text-xs mt-1 block">{errors.email}</span>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                  />
                </div>
                {errors.phone && <span className="text-[#d0473e] text-xs mt-1 block">{errors.phone}</span>}
              </div>

              {/* Account Role */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Assigned Role
                </label>
                <input
                  type="text"
                  disabled
                  value="Master Administrator"
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2.5 px-4 text-xs font-bold text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Card: Change Password */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <KeyRound className="w-5 h-5 text-gray-700" />
              <div>
                <h2 className="text-sm font-bold text-gray-900">Change Admin Password</h2>
                <p className="text-[11px] text-gray-400">Leave blank if you do not want to modify your password.</p>
              </div>
            </div>

            <div className="space-y-4 max-w-lg">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={data.current_password}
                    onChange={(e) => setData({ ...data, current_password: e.target.value })}
                    placeholder="Enter current password to verify"
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-xs font-medium text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.current_password && (
                  <span className="text-[#d0473e] text-xs mt-1 block">{errors.current_password}</span>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={data.new_password}
                    onChange={(e) => setData({ ...data, new_password: e.target.value })}
                    placeholder="Enter new strong password"
                    className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-xs font-medium text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.new_password && (
                  <span className="text-[#d0473e] text-xs mt-1 block">{errors.new_password}</span>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={data.new_password_confirmation}
                  onChange={(e) => setData({ ...data, new_password_confirmation: e.target.value })}
                  placeholder="Re-enter new password"
                  className="w-full bg-gray-50/70 border border-gray-200 rounded-xl py-2.5 px-4 text-xs font-medium text-gray-900 focus:outline-hidden focus:border-black focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] hover:bg-[#d0473e] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{processing ? 'Updating Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
