'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Sprout,
  DollarSign,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Calculator,
  Users,
  PieChart as PieChartIcon,
  HelpCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface CropEconomics {
  id: string;
  name: string;
  hindi: string;
  middlemanFarmgate: number;
  mandiModal: number;
  kisansetuFarmgate: number;
  traditionalRetail: number;
  shelfLifeDays: number;
}

const CROPS_DATA: CropEconomics[] = [
  { id: 'tomato', name: 'Hybrid Tomatoes', hindi: 'टमाटर', middlemanFarmgate: 14, mandiModal: 24, kisansetuFarmgate: 22, traditionalRetail: 45, shelfLifeDays: 5 },
  { id: 'onion', name: 'Red Nashik Onions', hindi: 'प्याज', middlemanFarmgate: 18, mandiModal: 28, kisansetuFarmgate: 26, traditionalRetail: 52, shelfLifeDays: 20 },
  { id: 'potato', name: 'Jyoti Potatoes', hindi: 'आलू', middlemanFarmgate: 10, mandiModal: 18, kisansetuFarmgate: 16, traditionalRetail: 32, shelfLifeDays: 30 },
  { id: 'wheat', name: 'Sharbati Wheat', hindi: 'गेहूं', middlemanFarmgate: 19, mandiModal: 26, kisansetuFarmgate: 24.5, traditionalRetail: 42, shelfLifeDays: 180 },
  { id: 'mustard', name: 'Mustard Seeds (सरसों)', hindi: 'सरसों', middlemanFarmgate: 42, mandiModal: 54, kisansetuFarmgate: 51, traditionalRetail: 85, shelfLifeDays: 120 }
];

export default function EconomicVisualizer() {
  const [selectedCropId, setSelectedCropId] = useState('tomato');
  const [volumeKg, setVolumeKg] = useState(1000); // 1 Tonne default

  const crop = CROPS_DATA.find((c) => c.id === selectedCropId) || CROPS_DATA[0];

  // Financial Calculations
  const traditionalFarmerEarn = crop.middlemanFarmgate * volumeKg;
  const kisansetuFarmerEarn = crop.kisansetuFarmgate * volumeKg;
  const farmerGain = kisansetuFarmerEarn - traditionalFarmerEarn;
  const farmerGainPct = Math.round(((crop.kisansetuFarmgate - crop.middlemanFarmgate) / crop.middlemanFarmgate) * 100);

  const traditionalConsumerPaid = crop.traditionalRetail * volumeKg;
  const kisansetuLogistics = Math.round(kisansetuFarmerEarn * 0.065);
  const kisansetuPlatform = Math.round(kisansetuFarmerEarn * 0.025);
  const kisansetuConsumerPaid = kisansetuFarmerEarn + kisansetuLogistics + kisansetuPlatform;
  const consumerSaved = traditionalConsumerPaid - kisansetuConsumerPaid;
  const consumerSavedPct = Math.round(((traditionalConsumerPaid - kisansetuConsumerPaid) / traditionalConsumerPaid) * 100);

  const middlemanMarginExtracted = traditionalConsumerPaid - traditionalFarmerEarn;
  const kisansetuFrictionTotal = kisansetuLogistics + kisansetuPlatform;
  const deadweightLossEliminated = middlemanMarginExtracted - kisansetuFrictionTotal;

  // Chart Data for Price Comparison
  const chartData = [
    { stage: 'Village Middleman', price: crop.middlemanFarmgate, fill: '#ef4444', desc: 'Farmer exploited' },
    { stage: 'APMC Mandi Modal', price: crop.mandiModal, fill: '#f59e0b', desc: 'Wholesale benchmark' },
    { stage: 'KisanSetu Direct', price: crop.kisansetuFarmgate, fill: '#10b981', desc: 'Direct farmer payout' },
    { stage: 'Urban Retail Store', price: crop.traditionalRetail, fill: '#64748b', desc: 'Consumer retail' }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
            <Calculator className="w-3.5 h-3.5 text-emerald-700" />
            Interactive DoCA Value-Chain Simulator
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Direct Farm-to-Fork Profit & Savings Visualizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Simulate real harvest volume to calculate direct farmer earnings gain and consumer grocery savings vs traditional middlemen.
          </p>
        </div>

        {/* Volume Metric Display */}
        <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-right self-start md:self-auto shadow-md">
          <div className="text-[10px] uppercase font-bold text-amber-400">Batch Size Selected</div>
          <div className="text-2xl font-black text-white">
            {volumeKg >= 1000 ? `${(volumeKg / 1000).toFixed(1)} MT` : `${volumeKg} kg`}
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 p-5 rounded-3xl border border-slate-200/80">
        {/* Crop Selector Buttons */}
        <div className="md:col-span-6 space-y-2">
          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
            1. Select Produce Crop:
          </label>
          <div className="flex flex-wrap gap-2">
            {CROPS_DATA.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCropId(c.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedCropId === c.id
                    ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-700/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{c.name}</span>
                <span className="text-[10px] opacity-75">({c.hindi})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Harvest Volume Slider */}
        <div className="md:col-span-6 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              2. Harvest Volume Slider:
            </label>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
              {volumeKg.toLocaleString()} kg
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={volumeKg}
            onChange={(e) => setVolumeKg(Number(e.target.value))}
            className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>100 kg (Small Farm)</span>
            <span>2,500 kg (Tempo Load)</span>
            <span>10,000 kg (10 MT Truck)</span>
          </div>
        </div>
      </div>

      {/* Main 4-Card Live KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Farmer Direct Payout */}
        <div className="p-5 rounded-3xl bg-emerald-50 border-2 border-emerald-500 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
            🌾 Farmer Direct Income
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800">
            ₹{kisansetuFarmerEarn.toLocaleString()}
          </div>
          <div className="text-xs font-bold text-emerald-700">
            +₹{farmerGain.toLocaleString()} (+{farmerGainPct}%) vs village trader
          </div>
        </div>

        {/* 2. Consumer Total Cost */}
        <div className="p-5 rounded-3xl bg-blue-50 border-2 border-blue-400 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
            🛒 Consumer Total Grocery Cost
          </span>
          <div className="text-2xl sm:text-3xl font-black text-blue-900">
            ₹{kisansetuConsumerPaid.toLocaleString()}
          </div>
          <div className="text-xs font-bold text-blue-700">
            Saved ₹{consumerSaved.toLocaleString()} ({consumerSavedPct}% cheaper)
          </div>
        </div>

        {/* 3. Middleman Extraction Eliminated */}
        <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 space-y-1">
          <span className="text-[10px] font-bold text-rose-900 uppercase tracking-wider block">
            🛑 Middleman Rent Eliminated
          </span>
          <div className="text-2xl sm:text-3xl font-black text-rose-800">
            ₹{deadweightLossEliminated.toLocaleString()}
          </div>
          <p className="text-[11px] text-rose-700 font-medium">
            Bypassed 4 speculative layers
          </p>
        </div>

        {/* 4. Optimized Logistics & Tech */}
        <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-1 shadow-md border border-slate-800">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
            🚚 Pooled Logistics & Escrow Fee
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ₹{kisansetuFrictionTotal.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">
            Only 9% flat frictionless logistics overhead
          </p>
        </div>
      </div>

      {/* Visual Chart & Step Breakdown Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
        {/* Left: Recharts Price Formation Waterfall Bar */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Stage-by-Stage Price Formation (₹/kg)
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">Agmarknet Benchmark</span>
          </div>

          <div className="h-64 w-full bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 10, fill: '#475569' }} unit="₹" />
                <Tooltip
                  formatter={(value: any) => [`₹${value}/kg`, 'Price']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
                <Bar dataKey="price" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Concrete Value Comparison Table */}
        <div className="lg:col-span-5 space-y-3 bg-slate-50 p-5 rounded-3xl border border-slate-200">
          <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
            Economic Impact Summary ({crop.name})
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-600">Traditional Middleman Rate:</span>
              <strong className="text-rose-600 font-mono">₹{crop.middlemanFarmgate}/kg</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-300">
              <span className="text-emerald-950 font-bold">KisanSetu Direct Farmer Payout:</span>
              <strong className="text-emerald-700 font-mono font-black text-sm">₹{crop.kisansetuFarmgate}/kg (+{farmerGainPct}%)</strong>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-600">APMC Mandi Modal Benchmark:</span>
              <span className="text-amber-700 font-mono font-bold">₹{crop.mandiModal}/kg</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-600">Traditional Urban Retail:</span>
              <span className="text-slate-900 font-mono font-bold">₹{crop.traditionalRetail}/kg</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-700 text-white rounded-2xl text-[11px] font-bold text-center">
            ✓ Farmer gains ₹{(crop.kisansetuFarmgate - crop.middlemanFarmgate).toFixed(1)}/kg more • Buyer pays ₹{(crop.traditionalRetail - (crop.kisansetuFarmgate * 1.09)).toFixed(1)}/kg less
          </div>
        </div>
      </div>
    </div>
  );
}
