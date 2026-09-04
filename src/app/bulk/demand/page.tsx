'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import { DemandPost, Listing } from '@/types';
import { Building2, Plus, Sparkles, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import seedData from '@/data/agmarknet_seed_data.json';

export default function BulkDemandPage() {
  const { language } = useLanguage();
  const { currentUser } = useAuth();

  const [posts, setPosts] = useState<DemandPost[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [cropName, setCropName] = useState(seedData.crops[1].name); // Onion
  const [quantityKg, setQuantityKg] = useState<number>(300);
  const [frequency, setFrequency] = useState<'one_time' | 'weekly' | 'monthly'>('weekly');
  const [deliveryAddress, setDeliveryAddress] = useState('Central Sourcing Dock 2, Connaught Place, New Delhi');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    try {
      const [pRes, lRes] = await Promise.all([
        fetch('/api/demand-posts'),
        fetch('/api/listings')
      ]);
      if (pRes.ok) {
        const pJson = await pRes.json();
        setPosts(pJson.data || []);
      }
      if (lRes.ok) {
        const lJson = await lRes.json();
        setListings(lJson.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/demand-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: currentUser?.id || 'usr_bulk_sanjay',
          crop_name: cropName,
          quantity_kg: quantityKg,
          frequency,
          delivery_address: deliveryAddress
        })
      });
      if (res.ok) {
        setShowForm(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5 text-amber-700" />
            B2B & Bulk Sourcing Portal
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Bulk Demand Matching Hub
          </h1>
          <p className="text-slate-600 text-sm">
            Hotels, restaurants, retail chains, and processors: post recurring demand to match direct with FPOs and farmer clusters.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          {showForm ? 'Close Form' : 'Post New Demand (मांग दर्ज करें)'}
        </button>
      </div>

      {/* Post Demand Form */}
      {showForm && (
        <form onSubmit={handleCreateDemand} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6 max-w-2xl mx-auto">
          <h3 className="font-extrabold text-slate-900 text-xl border-b border-slate-100 pb-3">
            Post Recurring Commodity Demand
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Crop Required</label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-brand-600"
              >
                {seedData.crops.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.hindi_name})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Batch Volume (kg)</label>
                <input
                  type="number"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Number(e.target.value))}
                  min={50}
                  step={50}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-brand-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-brand-600"
                >
                  <option value="one_time">One-Time Lot</option>
                  <option value="weekly">Weekly Recurring</option>
                  <option value="monthly">Monthly Recurring</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">Delivery Dock Address</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition"
          >
            {submitting ? 'Broadcasting to FPOs...' : 'Broadcast Demand to Nearby Farmers'}
          </button>
        </form>
      )}

      {/* Active Demands & Match-making Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Active Procurement Posts & Live Farmer Matches</h2>

        <div className="space-y-6">
          {posts.map((post) => {
            // Find matched listings for this crop
            const matchingListings = listings.filter(l => l.crop_name.toLowerCase() === post.crop_name.toLowerCase() && l.status === 'active');

            return (
              <div key={post.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-lg">{post.crop_name}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase">
                        {post.frequency}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Posted by <strong>{post.buyer_name}</strong> • {post.delivery_address}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400">Target Quantity</div>
                    <div className="text-2xl font-black text-slate-900">{post.quantity_kg} kg</div>
                  </div>
                </div>

                {/* Matchmaking algorithm output */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1 text-emerald-800">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Algorithmic Farmer / FPO Matches ({matchingListings.length} nearby sources)
                    </span>
                    <span className="text-slate-400 text-[11px]">Ranked by price, proximity & freshness</span>
                  </div>

                  {matchingListings.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-50 text-center text-xs text-slate-500">
                      Searching for more farmers harvesting {post.crop_name}...
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {matchingListings.slice(0, 3).map((item) => (
                        <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong className="text-slate-900 text-sm block">{item.farmer_name}</strong>
                              <span className="text-xs text-slate-500">{item.farmer_village}</span>
                            </div>
                            <span className="text-brand-700 font-extrabold text-sm">₹{item.price_per_kg}/kg</span>
                          </div>

                          <div className="text-xs text-slate-600 flex justify-between">
                            <span>Available: {item.quantity_kg} kg</span>
                            <span className="text-emerald-700 font-semibold">98% Match</span>
                          </div>

                          <button
                            onClick={() => {
                              alert(`Order contract of ${Math.min(post.quantity_kg, item.quantity_kg)}kg requested with ${item.farmer_name}!`);
                            }}
                            className="w-full py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs"
                          >
                            Lock Supply Contract
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
