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
  ArrowUpRight,
  Layers,
  ChevronRight
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
}

const COMPARISON_DATA: CropComparison[] = [
  {
    name: 'Hybrid Tomatoes',
    hindi: 'टमाटर',
    cluster: 'Rewari Mandi, Haryana',
    farmGate: 14.0,
    mandiModal: 24.0,
    kisansetuPrice: 22.0,
    retailPrice: 45.0,
    farmerGainPercent: 57,
  },
  {
    name: 'Red Onions',
    hindi: 'प्याज',
    cluster: 'Gurugram Mandi, Haryana',
    farmGate: 18.0,
    mandiModal: 28.0,
    kisansetuPrice: 26.0,
    retailPrice: 52.0,
    farmerGainPercent: 44,
  },
  {
    name: 'Jyoti Potatoes',
    hindi: 'आलू',
    cluster: 'Karnal Mandi, Haryana',
    farmGate: 10.0,
    mandiModal: 18.0,
    kisansetuPrice: 16.0,
    retailPrice: 32.0,
    farmerGainPercent: 60,
  },
  {
    name: 'Sharbati Wheat',
    hindi: 'गेहूं',
    cluster: 'Rohtak Mandi, Haryana',
    farmGate: 19.0,
    mandiModal: 26.0,
    kisansetuPrice: 24.5,
    retailPrice: 42.0,
    farmerGainPercent: 29,
  }
];

const initialTickerItems = seedData.crops.map((c, i) => {
  const mandi = seedData.mandis[i % seedData.mandis.length];
  return {
    crop: c.name,
    mandi: mandi.name,
    price: c.typical_mandi_modal,
    change: i % 2 === 0 ? '+3.2%' : '-1.5%'
  };
});

export default function HomePage() {
  const { language, t } = useLanguage();
  const { switchDemoUser } = useAuth();
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [tickerItems, setTickerItems] = useState(initialTickerItems);

  useEffect(() => {
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
    <div className="space-y-24 pb-28">
      {/* Explicit Inline Marquee Style with Edge Fade Masking */}
      <style>{`
        @keyframes continuousRatesMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .rates-marquee-container {
          mask-image: linear-gradient(to right, transparent 0%, black 60px, black calc(100% - 60px), transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 60px, black calc(100% - 60px), transparent 100%);
        }
        .rates-marquee-track {
          display: inline-flex;
          align-items: center;
          gap: 1.5rem;
          width: max-content;
          animation: continuousRatesMarquee 32s linear infinite;
          will-change: transform;
        }
        .rates-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 1. Harmonious Sliding Window of Agmarknet Live Rates */}
      <div className="bg-emerald-50/60 backdrop-blur-sm border-b border-emerald-100/90 py-2.5 px-4 shadow-xs overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-4 text-xs relative">
          {/* Static Live Badge with Solid Backdrop */}
          <div className="flex items-center gap-2 text-emerald-950 font-bold shrink-0 bg-white py-1.5 px-4 rounded-full border border-emerald-200/90 shadow-sm z-20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="tracking-wide text-[11px] whitespace-nowrap">LIVE AGMARKNET BENCHMARKS:</span>
          </div>

          {/* Marquee Track with Isolated Overflow and Soft 60px Edge Fading */}
          <div className="overflow-hidden whitespace-nowrap flex-1 min-w-0 relative rates-marquee-container pl-4">
            <div className="rates-marquee-track">
              {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-emerald-50/80 border border-slate-200/90 shadow-xs transition shrink-0 cursor-default"
                >
                  <span className="font-extrabold text-slate-900 text-xs">{item.crop}</span>
                  <span className="text-slate-400 text-[11px]">({item.mandi})</span>
                  <span className="text-emerald-700 font-black text-xs">₹{item.price}/kg</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.change.startsWith('+') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Focused, uncluttered messaging */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>Smart India Hackathon 2026 • PS 26033</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08] text-balance">
                {language === 'hi' ? (
                  <>
                    खेत से सीधा बाज़ार, <span className="text-emerald-700">बिचौलिया मुक्त</span> व्यापार।
                  </>
                ) : (
                  <>
                    Eliminating Middlemen with <span className="text-emerald-700">Direct Farm Trading</span>.
                  </>
                )}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Connecting farmers directly with consumers and bulk buyers using live Agmarknet AI price fairness, smart route pooling, and delivery OTP escrow.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/farmer/dashboard"
                onClick={() => switchDemoUser('farmer')}
                className="px-6 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 transition"
              >
                <Sprout className="w-4 h-4" />
                <span>List Produce (Farmer Portal)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/marketplace"
                onClick={() => switchDemoUser('consumer')}
                className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition"
              >
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>Buy Direct Fresh Produce</span>
              </Link>
            </div>

            {/* 3 Key Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/70">
              <div>
                <div className="text-2xl font-black text-slate-900">+57%</div>
                <div className="text-xs text-slate-500 font-medium">Avg. Farmer Earning</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-700">0%</div>
                <div className="text-xs text-slate-500 font-medium">Intermediary Take</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">₹18.4k</div>
                <div className="text-xs text-slate-500 font-medium">Savings / MT Lot</div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Interactive Price-Formation Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/80 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-900 text-sm">Price Formation Breakdown</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">DoCA PS 26033</span>
              </div>

              {/* Crop Selector Tabs */}
              <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
                {COMPARISON_DATA.map((crop, idx) => (
                  <button
                    key={crop.name}
                    onClick={() => setSelectedCropIndex(idx)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition text-center ${
                      selectedCropIndex === idx
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {crop.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Clear 3-Tier Price Comparison */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
                  <div className="text-xs font-semibold text-rose-950">Traditional Village Middleman</div>
                  <div className="text-sm font-black text-rose-700">₹{activeCrop.farmGate.toFixed(2)}/kg</div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <div className="text-xs font-semibold text-amber-950">APMC Mandi Benchmark (Modal)</div>
                  <div className="text-sm font-black text-amber-800">₹{activeCrop.mandiModal.toFixed(2)}/kg</div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 shadow-sm">
                  <div>
                    <div className="text-xs font-black text-emerald-950 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      KisanSetu Direct Farmer Payout
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium">+{activeCrop.farmerGainPercent}% more to farmer</div>
                  </div>
                  <div className="text-xl font-black text-emerald-800">₹{activeCrop.kisansetuPrice.toFixed(2)}/kg</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 text-center">
                Benchmark source: Rewari & Gurugram Mandi daily arrivals (Data.gov.in)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Four Role Portals (Airy Bento Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tailored Experiences for Every Stakeholder
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Select a portal to explore specialized tools for farmers, consumers, bulk buyers, and ministry regulators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Portal 1: Farmer */}
          <Link
            href="/farmer/dashboard"
            onClick={() => switchDemoUser('farmer')}
            className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition">
                Farmer & FPO Portal
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                4-step low-literacy listing wizard, real-time AI Mandi price recommendations, and direct UPI payouts.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition gap-1">
              <span>Open Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Portal 2: Consumer */}
          <Link
            href="/marketplace"
            onClick={() => switchDemoUser('consumer')}
            className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-lg transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-slate-700 transition">
                Direct Marketplace
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Browse harvested farm lots with transparent cost breakdowns, Razorpay escrow protection, and live tracking.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-slate-900 group-hover:translate-x-1 transition gap-1">
              <span>Shop Produce</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Portal 3: Bulk Buyer */}
          <Link
            href="/bulk/demand"
            onClick={() => switchDemoUser('bulk_buyer')}
            className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-800 transition">
                B2B Bulk Demand Hub
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Post recurring procurement contracts for hotels, processors, and FPOs with reverse bidding support.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-amber-800 group-hover:translate-x-1 transition gap-1">
              <span>Post Demand</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Portal 4: DoCA Admin */}
          <Link
            href="/admin/dashboard"
            onClick={() => switchDemoUser('admin')}
            className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-lg transition space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-700 transition">
                DoCA Transparency Portal
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Price-formation waterfall charts, intermediary margin savings metrics, and live Agmarknet sync tools.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-purple-700 group-hover:translate-x-1 transition gap-1">
              <span>View Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
