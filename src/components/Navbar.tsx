'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import {
  Sprout,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Truck,
  Users,
  Globe2,
  ChevronDown,
  UserCheck,
  Sparkles,
  LogOut
} from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';

export function Navbar() {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, switchDemoUser, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('nav_home') },
    { href: '/marketplace', label: t('nav_marketplace') },
    { href: '/farmer/dashboard', label: t('nav_farmer_portal') },
    { href: '/bulk/demand', label: t('nav_bulk_demand') },
    { href: '/insights', label: t('nav_insights') },
    { href: '/admin/dashboard', label: t('nav_admin'), highlight: true },
    { href: '/admin/logistics', label: t('nav_logistics') },
  ];

  const personas = [
    { id: 'farmer', name: 'Ramesh Kumar', role: 'Farmer', icon: '🌾', location: 'Rewari' },
    { id: 'consumer', name: 'Priya Sharma', role: 'Consumer', icon: '🛒', location: 'Gurugram' },
    { id: 'bulk_buyer', name: 'Sanjay Mehra', role: 'Bulk Buyer (Hotels)', icon: '🏨', location: 'Delhi NCR' },
    { id: 'admin', name: 'Amit Verma', role: 'DoCA Admin / Jury', icon: '🏛️', location: 'Govt of India' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm shadow-emerald-900/20 group-hover:scale-105 transition">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
                {language === 'hi' ? 'किसान' : 'Kisan'}
                <span className="text-emerald-600">{language === 'hi' ? 'सेतु' : 'Setu'}</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">
                SIH 2026 • PS 26033
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? link.highlight
                        ? 'bg-amber-100/80 text-amber-900 font-bold'
                        : 'bg-emerald-50 text-emerald-900 font-bold'
                      : link.highlight
                      ? 'text-amber-800 hover:bg-amber-50/60 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>

            {/* Authenticated User / Persona Controls */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono capitalize">
                    {currentUser.role?.replace('_', ' ')}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Authenticated User Menu */}
                {isPersonaMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Info Header */}
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <div className="text-xs font-extrabold text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1 capitalize">
                        Role: {currentUser.role?.replace('_', ' ')} {currentUser.village ? `• ${currentUser.village}` : ''}
                      </div>
                    </div>

                    {/* Switch Role Quick Tools for Evaluation */}
                    <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50/50">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Switch Persona (Hackathon Evaluation)
                      </div>
                      <div className="space-y-1">
                        {personas.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              switchDemoUser(p.id as any);
                              setIsPersonaMenuOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition ${
                              currentUser?.role === p.id && currentUser?.id.startsWith('usr_')
                                ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                                : 'text-slate-700 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{p.icon}</span>
                              <span className="font-semibold text-xs">{p.name} ({p.role})</span>
                            </div>
                            {currentUser?.role === p.id && (
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Logout Action */}
                    <div className="p-2">
                      <button
                        onClick={async () => {
                          setIsPersonaMenuOpen(false);
                          await logout();
                        }}
                        className="w-full py-2 rounded-xl text-center text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition flex items-center justify-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Account</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Supabase Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
}
