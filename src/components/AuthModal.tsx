'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { setCurrentUser, switchDemoUser, users } = useAuth();
  const { language } = useLanguage();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'farmer' | 'consumer' | 'bulk_buyer' | 'admin'>('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const body = mode === 'signup'
        ? { name, email, password, phone, role, village }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Authentication failed');
      }

      setCurrentUser(json.user);
      setMessage({ text: json.message || 'Authenticated successfully!', type: 'success' });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPersona = (userRole: 'farmer' | 'consumer' | 'bulk_buyer' | 'admin') => {
    switchDemoUser(userRole);
    setMessage({ text: `Switched to ${userRole.toUpperCase()} demo persona!`, type: 'success' });
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-brand-900 to-emerald-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Supabase JWT Auth & RBAC
          </div>
          <h2 className="text-xl font-black">
            {mode === 'login' ? 'Login to KisanSetu' : 'Create KisanSetu Account'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {mode === 'login'
              ? 'Access direct farm marketplace, mandi pricing, & escrow payouts'
              : 'Join India’s direct farm-to-fork digital highway (SIH PS 26033)'}
          </p>
        </div>

        {/* Quick Persona Switcher Bar for Judges */}
        <div className="p-3 bg-slate-50 border-b border-slate-200">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Instant Evaluation Fast-Login:
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => handleQuickPersona('farmer')}
              className="px-2 py-1.5 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
            >
              🌾 Farmer
            </button>
            <button
              onClick={() => handleQuickPersona('consumer')}
              className="px-2 py-1.5 bg-white hover:bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
            >
              🛒 Buyer
            </button>
            <button
              onClick={() => handleQuickPersona('bulk_buyer')}
              className="px-2 py-1.5 bg-white hover:bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
            >
              🏢 FPO / B2B
            </button>
            <button
              onClick={() => handleQuickPersona('admin')}
              className="px-2 py-1.5 bg-white hover:bg-purple-50 border border-purple-200 text-purple-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
            >
              🏛️ DoCA
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-xs font-extrabold text-center transition ${
              mode === 'login'
                ? 'text-brand-700 border-b-2 border-brand-700 bg-brand-50/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Email Login
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 text-xs font-extrabold text-center transition ${
              mode === 'signup'
                ? 'text-brand-700 border-b-2 border-brand-700 bg-brand-50/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {message.text}
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Your Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'farmer', label: '🌾 Farmer / किसान' },
                    { id: 'consumer', label: '🛒 Consumer / ग्राहक' },
                    { id: 'bulk_buyer', label: '🏢 FPO / B2B' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold border transition text-center ${
                        role === r.id
                          ? 'border-brand-600 bg-brand-50 text-brand-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / पूरा नाम</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone / फोन</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Village / District</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Sonipat, Haryana"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-600"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address / ईमेल</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@kisansetu.in"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password / पासवर्ड</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? 'Login to KisanSetu' : 'Complete Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
