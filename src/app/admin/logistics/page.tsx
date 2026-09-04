'use client';

import React, { useEffect, useState } from 'react';
import { Truck, MapPin, Play, ShieldCheck, Fuel, Leaf } from 'lucide-react';
import { RouteStop } from '@/types';
import LogisticsMap from '@/components/LogisticsMap';

export default function LogisticsPage() {
  const [routeData, setRouteData] = useState<any>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async () => {
    setOptimizing(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/optimize-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const json = await res.json();
        setRouteData(json.data);
      } else {
        const errJson = await res.json();
        setError(errJson.error?.message || 'Optimization failed');
      }
    } catch (e) {
      setError('Failed to contact route optimization service');
    } finally {
      setOptimizing(false);
    }
  };

  useEffect(() => {
    handleOptimize();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-bold mb-2">
            <Truck className="w-3.5 h-3.5" />
            AI Vehicle Routing Problem (VRP) Engine
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Smart Logistics & Multi-Stop Route Optimization
          </h1>
          <p className="text-slate-600 text-sm">
            Batches farm pickups and urban buyer drop-offs using OpenStreetMap & heuristic road network solvers.
          </p>
        </div>

        <button
          onClick={handleOptimize}
          disabled={optimizing}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition self-start sm:self-auto"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          {optimizing ? 'Calculating OSRM Route...' : 'Re-Optimize Pending Batches'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl">
          {error}
        </div>
      )}

      {routeData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-1 shadow-lg border border-slate-800">
            <div className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
              Total Road Distance
            </div>
            <div className="text-3xl font-extrabold text-white">
              {routeData.optimized_distance_km} <span className="text-sm font-normal text-slate-400">km</span>
            </div>
            <p className="text-xs text-slate-400">Naive sequential route: {routeData.naive_distance_km} km</p>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-500 p-6 rounded-3xl space-y-1 shadow-sm">
            <div className="text-xs uppercase tracking-wider font-bold text-emerald-900">
              Road Distance Saved
            </div>
            <div className="text-3xl font-black text-emerald-800">
              {routeData.distance_saved_km} km ({routeData.savings_pct}%)
            </div>
            <p className="text-xs text-emerald-900 font-medium">Bypasses empty back-hauls</p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-1 shadow-sm">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-amber-600" /> Fuel Saved
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {routeData.fuel_saved_litres} <span className="text-sm font-normal text-slate-500">Litres</span>
            </div>
            <p className="text-xs text-slate-400">Direct logistics efficiency</p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-1 shadow-sm">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" /> CO2 Avoided
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {routeData.co2_avoided_kg} <span className="text-sm font-normal text-slate-500">kg</span>
            </div>
            <p className="text-xs text-slate-400">Sustainable agri-supply chain</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-slate-900 text-lg">
              Optimal Multi-Stop Transit Sequence ({routeData?.stop_count || 0} stops)
            </h3>
            <span className="text-xs text-slate-500 font-medium">Haryana ➔ Delhi NCR</span>
          </div>

          <div className="space-y-4">
            {routeData?.stops?.map((stop: RouteStop, idx: number) => {
              const isPickup = stop.type === 'pickup';

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border-2 flex items-start gap-4 transition ${
                    isPickup ? 'border-brand-300 bg-brand-50/50' : 'border-amber-300 bg-amber-50/40'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isPickup ? 'bg-brand-700 text-white' : 'bg-amber-600 text-white'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="flex-grow space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-sm ${isPickup ? 'text-brand-950' : 'text-amber-950'}`}>
                        {stop.name}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                        ETA: {stop.eta}
                      </span>
                    </div>

                    <div className="text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{stop.location_name}</span>
                    </div>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-800">
                        {isPickup ? '📦 Picking up' : '📍 Delivering'}: {stop.quantity_kg}kg {stop.crop_name}
                      </span>
                      <span>• Order: #{stop.order_id.slice(-6)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <LogisticsMap
            stops={routeData?.stops || []}
            totalDistanceKm={routeData?.optimized_distance_km || 235}
            savedDistanceKm={routeData?.distance_saved_km || 75.2}
            savingsPct={routeData?.savings_pct || 24}
          />
        </div>
      </div>
    </div>
  );
}
