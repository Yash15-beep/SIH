'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import { Listing } from '@/types';
import { Sprout, Plus, TrendingUp, Sparkles, CheckCircle, Package, ArrowUpRight, DollarSign } from 'lucide-react';
import seedData from '@/data/agmarknet_seed_data.json';

export default function FarmerDashboard() {
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/listings');
        if (res.ok) {
          const data = await res.json();
          setListings(data.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [currentUser]);

  const farmerListings = listings.filter(l => !currentUser || currentUser.role !== 'farmer' || l.farmer_id === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold mb-2">
            <Sprout className="w-3.5 h-3.5" />
            Farmer Portal • Rewari Cluster
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('farmer_dashboard_title')}
          </h1>
          <p className="text-slate-600 text-sm">
            Welcome, <strong>{currentUser?.name || 'Ramesh Kumar'}</strong> ({currentUser?.village || 'Dharuhera, Rewari'})
          </p>
        </div>

        <Link
          href="/farmer/listing/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition"
        >
          <Plus className="w-5 h-5" />
          {t('btn_list_produce')}
        </Link>
      </div>

      {/* Daily Price Ticker Carousel Card */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-800 text-white p-6 rounded-2xl shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Today's Live Agmarknet Mandi Rates (आज के मंडी भाव)</span>
          </div>
          <span className="text-xs text-brand-200">Rewari & NCR Mandis</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {seedData.crops.slice(0, 4).map((c, idx) => (
            <div key={idx} className="bg-brand-950/40 border border-brand-700/60 p-3.5 rounded-xl space-y-1">
              <div className="text-xs text-slate-300 font-medium">{language === 'hi' ? c.hindi_name : c.name}</div>
              <div className="text-xl font-bold text-white">₹{c.typical_mandi_modal} <span className="text-xs text-slate-300">/kg</span></div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> Direct Sug: ₹{c.typical_mandi_modal - 1}/kg
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Earnings & Mandi Comparison (The Emotional Payoff Screen) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">
            Total Active Produce Listed
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {farmerListings.reduce((acc, curr) => acc + curr.quantity_kg, 0).toLocaleString()} <span className="text-sm font-normal text-slate-500">kg</span>
          </div>
          <p className="text-xs text-slate-500">Across {farmerListings.length} active crop batches</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">
            Direct Platform Revenue
          </div>
          <div className="text-3xl font-extrabold text-brand-700">
            ₹{farmerListings.reduce((acc, curr) => acc + (curr.quantity_kg * curr.price_per_kg), 0).toLocaleString()}
          </div>
          <p className="text-xs text-emerald-600 font-medium">100% direct bank payout without commission</p>
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-500 p-6 rounded-2xl shadow-sm space-y-2">
          <div className="text-xs uppercase tracking-wider font-bold text-emerald-900">
            {t('earnings_summary')}
          </div>
          <div className="text-3xl font-black text-emerald-800">
            +₹{(farmerListings.reduce((acc, curr) => acc + (curr.quantity_kg * 4.5), 0)).toLocaleString()}
          </div>
          <p className="text-xs text-emerald-950 font-medium">
            Additional earnings saved by bypassing arhtiya commission (avg ₹4.5/kg gain).
          </p>
        </div>
      </div>

      {/* Active Listings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-600" />
            {t('active_listings')} ({farmerListings.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            Loading your produce listings...
          </div>
        ) : farmerListings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
            <Sprout className="w-12 h-12 text-brand-600 mx-auto" />
            <div className="font-semibold text-slate-700">No active produce listed yet</div>
            <Link
              href="/farmer/listing/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
            >
              <Plus className="w-4 h-4" /> List First Crop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmerListings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200'}
                      alt={item.crop_name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{item.crop_name}</h3>
                      <div className="text-xs text-slate-500">{item.farmer_village}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase">
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500 block">Available Qty:</span>
                    <strong className="text-slate-900 text-sm">{item.quantity_kg} kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Direct Price:</span>
                    <strong className="text-brand-700 text-sm">₹{item.price_per_kg} /kg</strong>
                  </div>
                </div>

                {item.mandi_benchmark_price && (
                  <div className="bg-amber-50 p-2.5 rounded-xl text-xs text-amber-900 flex items-center justify-between border border-amber-200">
                    <span>Mandi Benchmark:</span>
                    <strong className="text-amber-800">₹{item.mandi_benchmark_price}/kg</strong>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">Harvest: {item.harvest_date}</span>
                  <Link
                    href={`/marketplace/${item.id}`}
                    className="text-xs font-semibold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
                  >
                    View in Marketplace <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
