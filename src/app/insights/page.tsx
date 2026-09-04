'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { TrendingUp, Sparkles, AlertCircle, Info, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import seedData from '@/data/agmarknet_seed_data.json';

export default function InsightsPage() {
  const { language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedRegion, setSelectedRegion] = useState('Rewari');
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/ai/forecast?crop_name=${encodeURIComponent(selectedCrop)}&region=${encodeURIComponent(selectedRegion)}`);
        if (res.ok) {
          const json = await res.json();
          setForecastData(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [selectedCrop, selectedRegion]);

  // Combine historical and forecast for single continuous chart
  const chartPoints = forecastData ? [
    ...(forecastData.historical_points || []).map((p: any) => ({
      date: p.date.slice(5),
      actualPrice: p.price,
      predictedPrice: null,
      arrivals: p.arrivals
    })),
    ...(forecastData.forecast || []).map((f: any) => ({
      date: `${f.date.slice(5)} (${f.day})`,
      actualPrice: null,
      predictedPrice: f.predicted_price,
      confidenceLow: f.confidence_low,
      confidenceHigh: f.confidence_high,
      arrivals: f.predicted_arrivals
    }))
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          Agmarknet AI Demand & Price Forecaster
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          7-Day Commodity Market Forecasts
        </h1>
        <p className="text-slate-600 text-sm">
          Statistical time-series trend and arrival regression models trained on daily official Agmarknet mandi data.
        </p>
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase">Crop:</span>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="p-2 rounded-xl border border-slate-300 font-bold text-slate-900 text-xs focus:ring-2 focus:ring-brand-600"
          >
            {seedData.crops.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.hindi_name})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase">Region / Mandi:</span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="p-2 rounded-xl border border-slate-300 font-bold text-slate-900 text-xs focus:ring-2 focus:ring-brand-600"
          >
            {seedData.mandis.map((m) => (
              <option key={m.district} value={m.district}>
                {m.name} ({m.district})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Summary Banner */}
      {forecastData && (
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Sparkles className="w-4 h-4" />
            <span>AI MARKET OUTLOOK (एआई बाज़ार परामर्श)</span>
          </div>
          <p className="text-base sm:text-lg font-semibold leading-relaxed text-slate-100">
            {language === 'hi' ? forecastData.summary_hi : forecastData.summary_en}
          </p>
          <div className="text-[11px] text-brand-200 flex items-center gap-1 pt-1">
            <Info className="w-3.5 h-3.5" />
            <span>Model: {forecastData.model_used}</span>
          </div>
        </div>
      )}

      {/* Interactive Price & Forecast Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Price Trend & 7-Day Forecast Curve</h3>
            <p className="text-xs text-slate-500">Historical mandi modal prices (solid) vs projected 7-day trajectory (dashed)</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-700" />
              <span>Historical Modal (₹/kg)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>AI Projected Price (₹/kg)</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-72 flex items-center justify-center text-slate-400 text-sm">
            Computing time-series forecast...
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartPoints} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: '#64748B' }} unit="₹" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="actualPrice"
                  name="Historical Rate"
                  stroke="#334155"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#334155' }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="predictedPrice"
                  name="Projected Rate"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#F59E0B' }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 7-Day Day-by-Day Forecast Breakdown */}
      {forecastData?.forecast && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">7-Day Day-by-Day Projections</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {forecastData.forecast.map((f: any, idx: number) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-1 text-center">
                <div className="text-xs font-bold text-slate-500 uppercase">{f.day}</div>
                <div className="text-[11px] text-slate-400">{f.date.slice(5)}</div>
                <div className="text-xl font-extrabold text-amber-600 pt-1">₹{f.predicted_price}</div>
                <div className="text-[10px] text-slate-500">Arrivals: {f.predicted_arrivals}q</div>
                <div className="text-[10px] text-emerald-600 font-medium">±₹{(f.confidence_high - f.confidence_low).toFixed(1)} band</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
