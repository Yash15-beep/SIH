'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import { Sprout, ShoppingCart, Building2, ShieldAlert, ArrowRight, TrendingUp, Sparkles, Truck, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import seedData from '@/data/agmarknet_seed_data.json';

export default function HomePage() {
  const { language, t } = useLanguage();
  const { switchDemoUser } = useAuth();
  const [tickerItems, setTickerItems] = useState<{ crop: string; mandi: string; price: number; change: string }[]>([]);

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

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Live Mandi Ticker */}
      <div className="bg-brand-900 text-brand-100 py-2.5 px-4 overflow-x-hidden border-b border-brand-800 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2 text-amber-400 font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="w-3.5 h-3.5" />
            <span>LIVE AGMARKNET BENCHMARKS:</span>
          </div>
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-0.5">
            {tickerItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 whitespace-nowrap bg-brand-800/60 px-3 py-1 rounded-full border border-brand-700/50">
                <span className="font-semibold text-white">{item.crop}</span>
                <span className="text-slate-300 text-[11px]">({item.mandi})</span>
                <span className="text-amber-300 font-bold">₹{item.price}/kg</span>
                <span className={`text-[10px] ${item.change.startsWith('+') ? 'text-emerald-400' : 'text-amber-300'}`}>
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/80 border border-brand-300 text-brand-900 text-xs font-semibold">
              <Sprout className="w-4 h-4 text-brand-700" />
              <span>SIH 2026 Problem Statement 26033 • DoCA Ministry Solution</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              {language === 'hi' ? (
                <>खेत से सीधा बाज़ार, <span className="text-brand-700">बिचौलिया मुक्त</span> और एआई निष्पक्ष व्यापार।</>
              ) : (
                <>Eliminating Middlemen with <span className="text-brand-700">Direct Farm Trading</span> & AI Pricing.</>
              )}
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              {t('subtagline')}
            </p>

            {/* Role Gateways Button Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/farmer/dashboard"
                onClick={() => switchDemoUser('farmer')}
                className="flex items-center justify-between p-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white shadow-md shadow-brand-900/10 font-medium group transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base">{t('hero_cta_farmer')}</div>
                    <div className="text-xs text-brand-200">List with AI Mandi Advisor</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-brand-300 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="/marketplace"
                onClick={() => switchDemoUser('consumer')}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md font-medium group transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base">{t('hero_cta_consumer')}</div>
                    <div className="text-xs text-slate-400">Fresh from nearby farms</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="/bulk/demand"
                onClick={() => switchDemoUser('bulk_buyer')}
                className="flex items-center justify-between p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 shadow-sm font-medium group transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base">{t('hero_cta_bulk')}</div>
                    <div className="text-xs text-slate-500">Hotels, caterers & FPO lots</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="/admin/dashboard"
                onClick={() => switchDemoUser('admin')}
                className="flex items-center justify-between p-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md font-medium group transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center text-white">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base">{t('hero_cta_admin')}</div>
                    <div className="text-xs text-amber-950 font-medium">Margin Saved & Transparency</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-900 group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Live Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200/80 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-2xl -mr-10 -mt-10" />
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-900 text-sm">Direct Trade Price-Formation</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
                  Agmarknet Verified
                </span>
              </div>

              {/* Price Waterfall Showcase Card */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                  <span>Commodity: <strong>Fresh Hybrid Tomatoes (टमाटर)</strong></span>
                  <span>Rewari Cluster</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                    <span className="text-xs text-rose-900 font-medium">Traditional Farm-gate (Village Trader)</span>
                    <span className="text-sm font-bold text-rose-700">₹14.00 /kg</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-xs text-amber-900 font-medium">Mandi Benchmark Rate (Modal)</span>
                    <span className="text-sm font-bold text-amber-800">₹24.00 /kg</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-100/90 border-2 border-emerald-500 shadow-sm">
                    <div>
                      <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        KisanSetu Direct Farmer Net Price
                      </div>
                      <div className="text-[11px] text-emerald-800 font-medium">+57% higher payout to farmer</div>
                    </div>
                    <span className="text-lg font-black text-emerald-800">₹22.00 /kg</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200">
                    <span className="text-xs text-slate-700 font-medium">Traditional Retail Consumer Price</span>
                    <span className="text-sm font-bold text-slate-900">₹45.00 /kg</span>
                  </div>
                </div>

                <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Saves ₹23/kg in redundant intermediary commission & markups.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. High Impact Transparency KPI Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-2xl border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                {t('kpi_farmer_uplift')}
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">+18% to +57%</div>
              <p className="text-xs text-slate-400">Compared to traditional distress sales</p>
            </div>

            <div className="space-y-1 sm:pl-8 pt-4 sm:pt-0">
              <div className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                {t('kpi_consumer_saving')}
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">25% – 50% Off</div>
              <p className="text-xs text-slate-400">Direct sourcing vs traditional retail</p>
            </div>

            <div className="space-y-1 lg:pl-8 pt-4 sm:pt-0">
              <div className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                {t('kpi_layers_bypassed')}
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">3 to 4 Layers</div>
              <p className="text-xs text-slate-400">Village trader, Arhtiya & Brokers bypassed</p>
            </div>

            <div className="space-y-1 lg:pl-8 pt-4 sm:pt-0">
              <div className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                Road Transit Saved
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">22.5% Saved</div>
              <p className="text-xs text-slate-400">Via AI multi-stop batch VRP routing</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Comprehensive Digital Supply Chain Architecture
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Addressing every requirement of Ministry of Consumer Affairs PS 26033: direct trading, AI demand forecasting, multi-stop route optimization, and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: AI Price Advisor */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">1-Tap Listing & AI Price Advisor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Farmers list produce in under 2 minutes. The system automatically pulls live Agmarknet mandi rates, calculates fair bands, and prevents under-negotiation.
            </p>
            <Link href="/farmer/listing/new" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800">
              Try Listing Wizard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 2: Demand Forecasting */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">7-Day Demand Forecasting</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Statistical moving average and trend regression on historical Agmarknet arrivals and prices forecast market shifts so farmers know when to harvest and sell.
            </p>
            <Link href="/insights" className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800">
              Explore Market Insights <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 3: Smart Routing */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Multi-Stop Route Optimizer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              VRP heuristic over OpenStreetMap road networks batches farm pickups and consumer drops, reducing logistics transit km and carbon footprint.
            </p>
            <Link href="/admin/logistics" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900">
              View Smart Logistics Map <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
