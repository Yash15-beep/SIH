'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/i18n';
import {
  Sprout,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ShieldCheck,
  MapPin,
  Building2,
  Truck,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { setCurrentUser } = useAuth();
  const { language } = useLanguage();

  const [role, setRole] = useState<'farmer' | 'consumer' | 'bulk_buyer' | 'transporter'>('farmer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [villageOrAddress, setVillageOrAddress] = useState('');
  const [extraDetail, setExtraDetail] = useState(''); // Land size / Business name / Vehicle type
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          role: role === 'transporter' ? 'admin' : role, // map to RBAC model
          village: villageOrAddress,
          extra: extraDetail
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Registration failed.');
      }

      setCurrentUser(json.user);
      setMessage({ text: 'Account created successfully! Redirecting...', type: 'success' });

      setTimeout(() => {
        if (role === 'farmer') router.push('/farmer/dashboard');
        else if (role === 'bulk_buyer') router.push('/bulk/demand');
        else if (role === 'transporter') router.push('/admin/logistics');
        else router.push('/marketplace');
      }, 900);
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { id: 'farmer' as const, label: 'Farmer / FPO', icon: '🌾', desc: 'List fresh produce, access Agmarknet benchmarks & escrow payouts' },
    { id: 'consumer' as const, label: 'Direct Consumer', icon: '🛒', desc: 'Buy fresh produce straight from verified farms with OTP verification' },
    { id: 'bulk_buyer' as const, label: 'Bulk Buyer / Hotel', icon: '🏨', desc: 'Post high-volume recurring procurement demand contracts' },
    { id: 'transporter' as const, label: 'Transporter Fleet', icon: '🚚', desc: 'Join pooled VRP smart logistics routes & earn per-pickup' }
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-11 h-11 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Kisan<span className="text-emerald-600">Setu</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Create your KisanSetu Account
          </h1>
          <p className="text-xs text-slate-500">
            Join India's unified Direct Farm-to-Fork ecosystem (SIH 2026 PS 26033)
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="text-xs font-bold text-slate-700">Select Your Account Type:</div>
          <div className="grid grid-cols-2 gap-2.5">
            {roleOptions.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  role === r.id
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xl">{r.icon}</span>
                  {role === r.id && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </div>
                <strong className="text-xs font-bold text-slate-900 block">{r.label}</strong>
                <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">{r.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <form onSubmit={handleSignup} className="space-y-4">
            {message && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border border-rose-300'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name / Entity</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'farmer' ? 'Ramesh Kumar' : role === 'bulk_buyer' ? 'Taj Hotels Procurement' : 'Priya Sharma'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone Number (For OTP)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {role === 'farmer' ? 'Village & District' : 'City / Delivery Address'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={villageOrAddress}
                    onChange={(e) => setVillageOrAddress(e.target.value)}
                    placeholder={role === 'farmer' ? 'Bapas Village, Rewari, Haryana' : 'Sector 45, Gurugram'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {role === 'farmer' ? 'Land Size (Acres) / Primary Crop' : role === 'bulk_buyer' ? 'GSTIN / FSSAI License No.' : role === 'transporter' ? 'Vehicle Type / Payload Capacity' : 'Preferred Delivery Landmark'}
                </label>
                <input
                  type="text"
                  value={extraDetail}
                  onChange={(e) => setExtraDetail(e.target.value)}
                  placeholder={role === 'farmer' ? '5 Acres (Tomato & Wheat)' : role === 'bulk_buyer' ? '06AAAAA0000A1Z5' : role === 'transporter' ? 'Tata Ace (1.5 Tonnes)' : 'Near Central Park'}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Creating Supabase Account...' : 'Complete Registration & Open Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">Already registered? </span>
            <Link href="/login" className="text-xs font-bold text-emerald-700 hover:underline">
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
