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
  ShieldCheck,
  Sparkles,
  ArrowRight,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, switchDemoUser } = useAuth();
  const { language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Authentication failed. Please check credentials.');
      }

      setCurrentUser(json.user);
      setMessage({ text: 'Login successful! Redirecting...', type: 'success' });

      setTimeout(() => {
        if (json.user.role === 'farmer') router.push('/farmer/dashboard');
        else if (json.user.role === 'admin') router.push('/admin/dashboard');
        else router.push('/marketplace');
      }, 800);
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFastPersona = (role: 'farmer' | 'consumer' | 'bulk_buyer' | 'admin') => {
    switchDemoUser(role);
    setMessage({ text: `Switched to ${role.toUpperCase()} persona! Redirecting...`, type: 'success' });
    setTimeout(() => {
      if (role === 'farmer') router.push('/farmer/dashboard');
      else if (role === 'admin') router.push('/admin/dashboard');
      else router.push('/marketplace');
    }, 600);
  };

  const personas = [
    { id: 'farmer', name: 'Ramesh Kumar', role: 'farmer' as const, label: 'Farmer (Rewari)', icon: '🌾', email: 'ramesh.farmer@kisansetu.in' },
    { id: 'consumer', name: 'Priya Sharma', role: 'consumer' as const, label: 'Consumer (Gurugram)', icon: '🛒', email: 'priya.buyer@kisansetu.in' },
    { id: 'bulk_buyer', name: 'Sanjay Mehra', role: 'bulk_buyer' as const, label: 'Bulk Buyer (Hotels)', icon: '🏨', email: 'sanjay.hotel@kisansetu.in' },
    { id: 'admin', name: 'Amit Verma', role: 'admin' as const, label: 'DoCA Admin (Jury)', icon: '🏛️', email: 'admin.doca@gov.in' }
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
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
            Sign in to your account
          </h1>
          <p className="text-xs text-slate-500">
            Secure Supabase JWT Authentication & Role-Based Access Control
          </p>
        </div>

        {/* 1-Click Fast Evaluation Login Grid */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Instant Evaluation Fast-Login (For Judges & Demo):</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              1-Click Auth
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {personas.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleFastPersona(p.role)}
                className="flex items-center gap-2.5 p-3 rounded-2xl border border-slate-200/90 hover:border-emerald-500 hover:bg-emerald-50/60 bg-slate-50/50 transition text-left group"
              >
                <span className="text-xl group-hover:scale-110 transition">{p.icon}</span>
                <div className="min-w-0 flex-1">
                  <strong className="text-xs text-slate-900 block font-bold truncate">{p.name}</strong>
                  <span className="text-[10px] text-slate-500 block truncate">{p.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Traditional Credentials Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
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

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh.farmer@kisansetu.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-600 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <span className="text-[11px] text-slate-400">Default: password123</span>
              </div>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating with Supabase...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">Don't have an account yet? </span>
            <Link href="/signup" className="text-xs font-bold text-emerald-700 hover:underline">
              Create KisanSetu Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
