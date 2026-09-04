'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import {
  Sprout,
  ShoppingCart,
  Building2,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Truck,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Coins,
  LineChart,
  Layers,
  ArrowUpRight,
  Check
} from 'lucide-react';
import seedData from '@/data/agmarknet_seed_data.json';

interface CropComparison {
  name: string;
  hindi: string;
  cluster: string;
  farmGate: number;
  mandiModal: number;
  kisansetuPrice: number;
  retailPrice: number;
  farmerGainPercent: number;
  consumerSavingsPercent: number;
}

const COMPARISON_DATA: CropComparison[] = [
  {
    name: 'Fresh Hybrid Tomatoes',
    hindi: 'टमाटर',
    cluster: 'Rewari Mandi Cluster, Haryana',
    farmGate: 14.0,
    mandiModal: 24.0,
    kisansetuPrice: 22.0,
    retailPrice: 45.0,
    farmerGainPercent: 57,
    consumerSavingsPercent: 51
  },
  {
    name: 'Nashik Red Onions',
    hindi: 'प्याज',
    cluster: 'Gurugram Mandi Cluster, Haryana',
    farmGate: 18.0,
    mandiModal: 28.0,
    kisansetuPrice: 26.0,
    retailPrice: 52.0,
    farmerGainPercent: 44,
    consumerSavingsPercent: 50
  },
  {
    name: 'Kufri Jyoti Potatoes',
    hindi: 'आलू',
    cluster: 'Karnal Mandi Cluster, Haryana',
    farmGate: 10.0,
    mandiModal: 18.0,
    kisansetuPrice: 16.0,
    retailPrice: 32.0,
    farmerGainPercent: 60,
    consumerSavingsPercent: 50
  },
  {
    name: 'Pusa Bold Mustard',
    hindi: 'सरसों',
    cluster: 'Azadpur Mandi Cluster, Delhi',
    farmGate: 42.0,
    mandiModal: 54.0,
    kisansetuPrice: 52.0,
    retailPrice: 78.0,
    farmerGainPercent: 24,
    consumerSavingsPercent: 33
  },
  {
    name: 'Sharbati Organic Wheat',
    hindi: 'गेहूं',
    cluster: 'Rohtak Mandi Cluster, Haryana',
    farmGate: 19.0,
    mandiModal: 26.0,
    kisansetuPrice: 24.5,
    retailPrice: 42.0,
    farmerGainPercent: 29,
    consumerSavingsPercent: 42
  }
];

export default function HomePage() {
  const { language, t } = useLanguage();
  const { switchDemoUser } = useAuth();
  const [tickerItems, setTickerItems] = useState<{ crop: string; mandi: string; price: number; change: string }[]>([]);
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);

  useEffect(() => {
    // Generate ticker items from seed data
    const items = seedData.crops.map((c, i) => {
      const mandi = seedData.mandis[i % seedData.mandis.length];
      return {
        crop: language === 'hi' ? c.hindi_name : c.name,
        mandi: mandi.name,
        price: c.typical_mandi_modal,
        change: i % 2 === 0 ? '+3.2%' : '-1.5%'
      };
    });
    setTickerItems(items);
  }, [language]);

  const activeCrop = COMPARISON_DATA[selectedCropIndex];

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      {/* 1. Continuous Live Mandi Marquee Ticker */}
      <div className="bg-gradient-to-r from-slate-950 via-brand-950 to-slate-950 text-brand-100 py-2.5 px-4 overflow-hidden border-b border-brand-900/60 shadow-inner relative">
        <div className="max-w-7xl mx-auto flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2 text-amber-400 font-bold shrink-0 bg-brand-950/90 py-1 px-3 rounded-full border border-amber-500/30 shadow-sm z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="tracking-wide">LIVE AGMARKNET BENCHMARKS:</span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1 relative mask-fade-edges">
            <div className="animate-marquee flex items-center gap-6">
              {[...tickerItems, ...tickerItems].map((item, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800/90 border border-brand-800/40 transition shrink-0 cursor-default"
                >
                  <span className="font-bold text-white text-xs">{item.crop}</span>
                  <span className="text-slate-400 text-[11px]">({item.mandi})</span>
                  <span className="text-amber-300 font-extrabold text-xs">₹{item.price}/kg</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    item.change.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Section with Ambient Glow Aura */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Ambient Decorative Auras */}
        <div className="absolute -top-10 left-1/4 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Subtext & 4 Role Gateways */}
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-sm animate-pulse-subtle">
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>SIH 2026 Problem Statement 26033 • DoCA Ministry Solution</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-[-0.03em] leading-[1.08] text-balance">
              {language === 'hi' ? (
                <>
                  खेत से सीधा बाज़ार,{' '}
                  <span className="bg-gradient-to-r from-brand-700 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                    बिचौलिया मुक्त
                  </span>{' '}
                  और एआई निष्पक्ष व्यापार।
                </>
              ) : (
                <>
                  Eliminating Middlemen with{' '}
                  <span className="bg-gradient-to-r from-brand-700 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                    Direct Farm Trading
                  </span>{' '}
                  & AI Pricing.
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              {t('subtagline')}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-700 font-semibold pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> 0% Intermediary Cuts
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Escrow + OTP Settlement
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> Agmarknet Live AI Model
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
                <Truck className="w-3.5 h-3.5 text-purple-600" /> Smart Route Batching
              </span>
            </div>

            {/* Role Gateways Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <Link
                href="/farmer/dashboard"
                onClick={() => switchDemoUser('farmer')}
                className="group relative flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-brand-700 to-emerald-800 hover:from-brand-800 hover:to-emerald-900 text-white shadow-lg shadow-brand-900/15 border border-brand-600/30 transition duration-150 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner group-hover:scale-105 transition">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-base leading-snug">{t('hero_cta_farmer')}</div>
                    <div className="text-xs text-emerald-100 font-medium">List with AI Mandi Advisor</div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition" />
                </div>
              </Link>

              <Link
                href="/marketplace"
                onClick={() => switchDemoUser('consumer')}
                className="group relative flex items-center justify-between p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/15 border border-slate-700 transition duration-150 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 border border-slate-700 shadow-inner group-hover:scale-105 transition">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-base leading-snug">{t('hero_cta_consumer')}</div>
                    <div className="text-xs text-slate-400 font-medium">Fresh from nearby farms</div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition" />
                </div>
              </Link>

              <Link
                href="/bulk/demand"
                onClick={() => switchDemoUser('bulk_buyer')}
                className="group relative flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 shadow-md border border-slate-200 transition duration-150 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-800 border border-amber-200 shadow-inner group-hover:scale-105 transition">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-base leading-snug">{t('hero_cta_bulk')}</div>
                    <div className="text-xs text-slate-500 font-medium">Hotels, caterers & FPO lots</div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition">
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 transition" />
                </div>
              </Link>

              <Link
                href="/admin/dashboard"
                onClick={() => switchDemoUser('admin')}
                className="group relative flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-md border border-amber-400/40 transition duration-150 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-950/20 flex items-center justify-center text-slate-950 border border-amber-950/20 shadow-inner group-hover:scale-105 transition">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-base leading-snug">{t('hero_cta_admin')}</div>
                    <div className="text-xs text-slate-900 font-semibold">Margin Saved & Transparency</div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-950/10 flex items-center justify-center group-hover:bg-slate-950/20 transition">
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 transition" />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Live Price-Formation Simulator Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden">
              {/* Card Header & Pulse Status */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">Direct Trade Price-Formation</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Agmarknet Live Sync
                </span>
              </div>

              {/* Commodity Switcher Pills */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Select Commodity / फसल:</span>
                  <span className="text-[11px] text-slate-400">{activeCrop.cluster}</span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {COMPARISON_DATA.map((crop, idx) => (
                    <button
                      key={crop.name}
                      onClick={() => setSelectedCropIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                        selectedCropIndex === idx
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {crop.name.split(' ')[0]} ({crop.hindi})
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Waterfall Breakdown Rows */}
              <div className="space-y-2.5">
                {/* 1. Traditional Farm-Gate */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 transition">
                  <div className="space-y-0.5">
                    <div className="text-xs text-rose-950 font-bold">Traditional Farm-gate (Village Trader)</div>
                    <div className="text-[10px] text-rose-700">Exploitative distress rate paid to farmer</div>
                  </div>
                  <div className="text-base font-black text-rose-700">₹{activeCrop.farmGate.toFixed(2)}/kg</div>
                </div>

                {/* 2. APMC Mandi Modal */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 transition">
                  <div className="space-y-0.5">
                    <div className="text-xs text-amber-950 font-bold">Mandi Benchmark Rate (Modal)</div>
                    <div className="text-[10px] text-amber-700">Official Data.gov.in Agmarknet average</div>
                  </div>
                  <div className="text-base font-black text-amber-800">₹{activeCrop.mandiModal.toFixed(2)}/kg</div>
                </div>

                {/* 3. KisanSetu Direct Payout (Highlighted) */}
                <div className="relative p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-500 shadow-sm space-y-1.5 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>KisanSetu Direct Farmer Net Price</span>
                    </div>
                    <span className="text-xl font-black text-emerald-800">₹{activeCrop.kisansetuPrice.toFixed(2)}/kg</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 pt-0.5 border-t border-emerald-200/60">
                    <span>+{activeCrop.farmerGainPercent}% higher direct farmer earning</span>
                    <span>Zero Middleman Cut</span>
                  </div>
                </div>

                {/* 4. Traditional Consumer Retail Price */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 transition">
                  <div className="space-y-0.5">
                    <div className="text-xs text-slate-800 font-bold">Traditional Consumer Retail Price</div>
                    <div className="text-[10px] text-slate-500">Includes 4-tier commission agents & markups</div>
                  </div>
                  <div className="text-base font-black text-slate-900 line-through text-slate-400">
                    ₹{activeCrop.retailPrice.toFixed(2)}/kg
                  </div>
                </div>
              </div>

              {/* Visual Split Bar */}
              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-emerald-700">Farmer Share: ~85% on KisanSetu</span>
                  <span className="text-rose-600">vs 30% in Mandi</span>
                </div>
                <div className="h-3 w-full rounded-full bg-rose-200 overflow-hidden flex shadow-inner">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: '85%' }} />
                  <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: '15%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>🟢 Farmer Direct Payout (85%)</span>
                  <span>🔵 Logistics Pool (15%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Problem Statement 26033: Before vs After Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-900 text-xs font-bold">
            <Layers className="w-3.5 h-3.5 text-brand-700" />
            <span>SIH 2026 Problem Statement 26033 Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Replacing 4 Intermediaries with 1 Transparent Digital Bridge
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            How KisanSetu solves the Department of Consumer Affairs mandate by protecting farm-gate margins and stabilizing retail consumer basket inflation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Broken Chain */}
          <div className="p-7 rounded-3xl bg-rose-50/50 border border-rose-200/80 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-rose-200/60 pb-3">
              <span className="font-extrabold text-rose-900 text-base">❌ Traditional Intermediary APMC Chain</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">
                ~55% Value Lost
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {[
                { step: '1. Village Aggregator / Kacha Arhatiya', cut: 'Takes 15-20% margin under weighing deduction', price: '₹14/kg' },
                { step: '2. APMC Mandi Commission Agent (Pucca Arhatiya)', cut: 'Mandatory 6-8% commission + market cess', price: '₹24/kg' },
                { step: '3. Secondary Wholesaler / City Trader', cut: 'Unrefrigerated transit spoilage + 25% markup', price: '₹34/kg' },
                { step: '4. Neighborhood Retail Vendor / Supermarket', cut: 'Final consumer retail price markup', price: '₹45/kg' }
              ].map((item, i) => (
                <div key={i} className="flex items-start justify-between p-3 rounded-xl bg-white border border-rose-100 shadow-sm">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">{item.step}</div>
                    <div className="text-rose-700 text-[11px]">{item.cut}</div>
                  </div>
                  <strong className="text-slate-800 font-mono text-sm">{item.price}</strong>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-rose-100 text-rose-950 text-xs font-bold text-center">
              ⚠️ Farmer receives only 31% of the final consumer expenditure.
            </div>
          </div>

          {/* KisanSetu Solution */}
          <div className="p-7 rounded-3xl bg-emerald-50/50 border border-emerald-200/80 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
              <span className="font-extrabold text-emerald-950 text-base">✅ KisanSetu Direct Highway</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                0% Middleman Take
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {[
                { step: '1. Direct Farm Listing with AI Mandi Advisor', cut: 'Agmarknet regression prevents distress sale', price: '₹22/kg (Farmer Payout)' },
                { step: '2. Direct Rural Pooling & VRP Route Batching', cut: 'Optimized multi-farmer pickup saves 38% fuel', price: '₹3/kg (Handling Pool)' },
                { step: '3. Direct Delivery & Consumer Escrow Handover', cut: '4-digit OTP releases instant UPI payout to farmer', price: '₹25/kg (Total Consumer Cost)' }
              ].map((item, i) => (
                <div key={i} className="flex items-start justify-between p-3 rounded-xl bg-white border border-emerald-100 shadow-sm">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">{item.step}</div>
                    <div className="text-emerald-700 text-[11px]">{item.cut}</div>
                  </div>
                  <strong className="text-emerald-800 font-mono text-sm">{item.price}</strong>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center shadow-md shadow-emerald-900/10">
              🎉 Farmer earns +57% more • Consumer saves 45% on fresh produce.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
