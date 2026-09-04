'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import { Listing } from '@/types';
import { ShoppingBag, MapPin, Sparkles, Search, ArrowRight, Clock, ScanLine } from 'lucide-react';
import seedData from '@/data/agmarknet_seed_data.json';

export default function MarketplacePage() {
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [now, setNow] = useState(() => Date.now());

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
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const listedAgo = (createdAt: string) => {
    const minutes = Math.max(0, Math.floor((now - new Date(createdAt).getTime()) / 60_000));
    if (minutes < 1) return 'Listed just now';
    if (minutes < 60) return `Listed ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Listed ${hours}h ago`;
    return `Listed ${Math.floor(hours / 24)}d ago`;
  };

  const filteredListings = listings.filter(item => {
    if (selectedCrop !== 'All' && item.crop_name.toLowerCase() !== selectedCrop.toLowerCase()) return false;
    if (searchQuery && !item.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.farmer_village?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return item.status === 'active';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            Direct Farm Marketplace
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('marketplace_title')}
          </h1>
          <p className="text-slate-600 text-sm">
            Discover freshly harvested produce direct from Haryana & Delhi NCR farmers. Zero middleman markups.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Map View (नक्शा)
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search crop or village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          {/* Quick Crop Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCrop('All')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCrop === 'All' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Crops (सभी)
            </button>
            {seedData.crops.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCrop(c.name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCrop === c.name ? 'bg-brand-700 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {language === 'hi' ? c.hindi_name : c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings Section */}
      {viewMode === 'grid' ? (
        loading ? (
          <div className="p-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
            Loading fresh farm listings...
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="p-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 text-lg">No produce found</div>
            <p className="text-xs">Try selecting a different crop filter or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => {
              const mandiModal = item.mandi_benchmark_price || (item.price_per_kg + 2);
              const retailPrice = Math.round(mandiModal * 1.8);
              const isAiFair = Math.abs(item.price_per_kg - (item.ai_suggested_price || item.price_per_kg)) <= 2;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col group"
                >
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500'}
                      alt={item.crop_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {isAiFair && (
                      <div className="absolute top-3 left-3 bg-emerald-700/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        {t('badge_ai_fair')}
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                      {item.quantity_kg} kg available
                    </div>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-lg">{item.crop_name}</h3>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {item.farmer_village} (24 km away)
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 line-through block">₹{retailPrice}/kg</span>
                          <span className="text-xl font-black text-brand-700">₹{item.price_per_kg}</span>
                          <span className="text-xs text-slate-500"> /kg</span>
                        </div>
                      </div>

                      <div className="bg-brand-50/70 p-2.5 rounded-xl text-xs text-brand-900 flex items-center justify-between border border-brand-200">
                        <span>Farmer Direct:</span>
                        <strong className="text-brand-800">{item.farmer_name}</strong>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{listedAgo(item.created_at)}</span>
                        {item.freshness && <span className="flex items-center gap-1 font-semibold text-emerald-700"><ScanLine className="w-3.5 h-3.5" />Fresh Vision: {item.freshness}</span>}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-400">Harvest: {item.harvest_date}</span>
                      <Link
                        href={`/checkout/${item.id}`}
                        className="px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-brand-900/10 group-hover:bg-brand-800 transition"
                      >
                        {t('btn_order_now')} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Map View with Farm Pins */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-900">Haryana NCR Farm Locations & Clusters</span>
            <span>Showing {filteredListings.length} farm supply nodes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredListings.map(item => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-slate-900 text-sm">{item.crop_name}</div>
                  <span className="text-brand-700 font-extrabold text-sm">₹{item.price_per_kg}/kg</span>
                </div>
                <div className="text-xs text-slate-500">{item.farmer_village}</div>
                <div className="text-xs text-slate-600 font-medium">{item.farmer_name} • {item.quantity_kg}kg batch</div>
                <Link
                  href={`/checkout/${item.id}`}
                  className="block text-center w-full py-2 rounded-xl bg-brand-700 text-white text-xs font-bold hover:bg-brand-800 mt-2"
                >
                  Order from Farm
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
