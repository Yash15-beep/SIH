'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import { Sprout, ShoppingBag, TrendingUp, ShieldCheck, Truck, Users, Globe2, ArrowRightLeft } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';

export function Navbar() {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, switchDemoUser } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('nav_home'), icon: Sprout },
    { href: '/marketplace', label: t('nav_marketplace'), icon: ShoppingBag },
    { href: '/farmer/dashboard', label: t('nav_farmer_portal'), icon: Sprout },
    { href: '/bulk/demand', label: t('nav_bulk_demand'), icon: Users },
    { href: '/insights', label: t('nav_insights'), icon: TrendingUp },
    { href: '/admin/dashboard', label: t('nav_admin'), icon: ShieldCheck, highlight: true },
    { href: '/admin/logistics', label: t('nav_logistics'), icon: Truck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
      {/* Top Demo Bar: Quick Persona Switcher */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              {t('persona_switcher')}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => switchDemoUser('farmer')}
                className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                  currentUser?.role === 'farmer' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                🌾 Ramesh (Farmer)
              </button>
              <button
                onClick={() => switchDemoUser('consumer')}
                className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                  currentUser?.role === 'consumer' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                🛒 Priya (Consumer)
              </button>
              <button
                onClick={() => switchDemoUser('bulk_buyer')}
                className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                  currentUser?.role === 'bulk_buyer' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                🏨 Sanjay (Bulk Buyer)
              </button>
              <button
                onClick={() => switchDemoUser('admin')}
                className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                  currentUser?.role === 'admin' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                🏛️ DoCA Admin / Jury
              </button>
            </div>
          </div>

          {/* Active Persona Tag */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              Active: <strong className="text-white">{currentUser?.name}</strong> ({currentUser?.role})
            </span>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-brand-700 text-white hover:bg-brand-600 font-medium"
            >
              <Globe2 className="w-3 h-3" />
              {t('lang_toggle')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-md shadow-brand-700/20 group-hover:scale-105 transition">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                {language === 'hi' ? 'किसान' : 'Kisan'}
                <span className="text-brand-600">{language === 'hi' ? 'सेतु' : 'Setu'}</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 block">
                SIH 2026 • PS ID 26033
              </span>
            </div>
          </Link>

          {/* Navigation Links & Auth Trigger */}
          <div className="hidden md:flex items-center gap-2">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? link.highlight
                          ? 'bg-amber-100 text-amber-900 font-bold'
                          : 'bg-brand-50 text-brand-800 font-bold'
                        : link.highlight
                        ? 'text-amber-700 hover:bg-amber-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? (link.highlight ? 'text-amber-700' : 'text-brand-700') : 'text-slate-400'}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={() => setIsAuthOpen(true)}
              className="ml-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
}
