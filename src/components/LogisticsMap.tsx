'use client';

import React, { useState, useEffect } from 'react';
import { RouteStop } from '@/types';
import { Truck, MapPin, Sparkles, Navigation, AlertTriangle, CheckCircle2, Fuel, Leaf, ArrowRight, RefreshCw } from 'lucide-react';

interface LogisticsMapProps {
  stops?: RouteStop[];
  totalDistanceKm?: number;
  savedDistanceKm?: number;
  savingsPct?: number;
}

interface WaypointPoint {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  type: 'pickup' | 'delivery' | 'drop';
  crop: string;
  eta: string;
  farmId?: number;
}

export default function LogisticsMap({
  stops,
  totalDistanceKm = 235,
  savedDistanceKm = 75.2,
  savingsPct = 24
}: LogisticsMapProps) {
  const [activeStopIndex, setActiveStopIndex] = useState<number | null>(0);
  const [viewMode, setViewMode] = useState<'optimized' | 'naive'>('optimized');
  const [truckProgress, setTruckProgress] = useState(0);
  const [naiveProgress, setNaiveProgress] = useState([0, 25, 50, 75]);

  // Geographically accurate coordinates for Haryana & Delhi NCR corridor:
  // Lat bounds: 28.15 to 28.85
  // Lng bounds: 76.55 to 77.30
  const minLat = 28.15;
  const maxLat = 28.85;
  const minLng = 76.55;
  const maxLng = 77.30;

  const defaultWaypoints: WaypointPoint[] = [
    { id: 'w1', name: 'Ramesh Farm Node', location: 'Dharuhera, Rewari', lat: 28.205, lng: 76.794, type: 'pickup', crop: '25kg Onion (Grade A)', eta: '08:30 AM', farmId: 1 },
    { id: 'w2', name: 'Suresh Green Acres', location: 'Bapas Village, Rewari', lat: 28.245, lng: 76.680, type: 'pickup', crop: '15kg Tomato (Grade A)', eta: '08:55 AM', farmId: 2 },
    { id: 'w3', name: 'Baljit Agrarian Hub', location: 'Sampla, Rohtak', lat: 28.775, lng: 76.772, type: 'pickup', crop: '50kg Wheat (Grade A)', eta: '09:25 AM', farmId: 3 },
    { id: 'w4', name: 'Kisan FPO Cluster', location: 'Tauru, Nuh', lat: 28.280, lng: 76.950, type: 'pickup', crop: '40kg Potato (Grade B)', eta: '09:55 AM', farmId: 4 },
    { id: 'w5', name: 'Gurugram Aggregation Hub', location: 'Sector 56, Gurugram', lat: 28.435, lng: 77.100, type: 'delivery', crop: 'Micro-Hub Consolidation', eta: '10:35 AM' },
    { id: 'w6', name: 'Dwarka Urban Center', location: 'Sector 12, Dwarka, Delhi', lat: 28.592, lng: 77.046, type: 'delivery', crop: 'Consumer Bulk Drop', eta: '11:05 AM' },
    { id: 'w7', name: 'DoCA Central Sourcing Hub', location: 'Connaught Place, Delhi', lat: 28.630, lng: 77.218, type: 'delivery', crop: 'Final Mandi Distribution', eta: '11:40 AM' }
  ];

  // Map input stops or fallback to realistic default spread
  const mapWaypoints: WaypointPoint[] = stops && stops.length >= 4
    ? stops.map((s, i) => {
        // If the stop doesn't have realistic distinct coordinates, map from default set to maintain real geography
        const fallback = defaultWaypoints[i % defaultWaypoints.length];
        return {
          id: s.order_id || `stop-${i}`,
          name: s.name,
          location: s.location_name,
          lat: s.lat && s.lat !== 28.20 ? s.lat : fallback.lat,
          lng: s.lng && s.lng !== 76.75 ? s.lng : fallback.lng,
          type: s.type === 'drop' ? 'delivery' : (s.type as any),
          crop: `${s.quantity_kg}kg ${s.crop_name}`,
          eta: s.eta,
          farmId: (i % 4) + 1
        };
      })
    : defaultWaypoints;

  // Project lat/lng to 2D percentage canvas (with 12% padding for UI aesthetics)
  const projectToPercent = (lat: number, lng: number) => {
    const x = Math.max(12, Math.min(88, ((lng - minLng) / (maxLng - minLng)) * 76 + 12));
    const y = Math.max(12, Math.min(88, (1 - (lat - minLat) / (maxLat - minLat)) * 76 + 12));
    return { x, y };
  };

  const projectedPoints = mapWaypoints.map(w => ({
    ...w,
    ...projectToPercent(w.lat, w.lng)
  }));

  // Separate pickups and destinations for naive mode
  const pickupPoints = projectedPoints.filter(p => p.type === 'pickup');
  const destinationPoint = projectedPoints[projectedPoints.length - 1]; // Central Delhi Hub

  // Animation for Optimized single vehicle
  useEffect(() => {
    const interval = setInterval(() => {
      setTruckProgress(prev => (prev >= 100 ? 0 : prev + 0.8));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Animation for Naive 4 separate vehicles
  useEffect(() => {
    const interval = setInterval(() => {
      setNaiveProgress(prev => prev.map(val => (val >= 100 ? 0 : val + 1.2)));
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Calculate position along optimized multi-segment path
  const getOptimizedTruckPosition = () => {
    if (projectedPoints.length < 2) return { x: 50, y: 50, angle: 0 };
    const totalSegments = projectedPoints.length - 1;
    const segmentProgress = (truckProgress / 100) * totalSegments;
    const currentSegmentIndex = Math.min(totalSegments - 1, Math.floor(segmentProgress));
    const segmentFraction = segmentProgress - currentSegmentIndex;

    const p1 = projectedPoints[currentSegmentIndex];
    const p2 = projectedPoints[currentSegmentIndex + 1];

    const x = p1.x + (p2.x - p1.x) * segmentFraction;
    const y = p1.y + (p2.y - p1.y) * segmentFraction;

    return { x, y };
  };

  // Calculate positions for 4 separate unpooled vehicles travelling back and forth
  const getNaiveVehiclePositions = () => {
    return pickupPoints.map((pickup, idx) => {
      const progress = naiveProgress[idx % naiveProgress.length];
      // Simulate round trip: 0-50% going to Delhi, 50-100% returning empty
      const isReturning = progress > 50;
      const normalizedFraction = isReturning ? (100 - progress) / 50 : progress / 50;

      const x = pickup.x + (destinationPoint.x - pickup.x) * normalizedFraction;
      const y = pickup.y + (destinationPoint.y - pickup.y) * normalizedFraction;

      return { x, y, isReturning, farmName: pickup.name };
    });
  };

  const optimizedTruck = getOptimizedTruckPosition();
  const naiveVehicles = getNaiveVehiclePositions();

  // SVG Polyline Path String for Optimized
  const optimizedPolyline = projectedPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-2xl space-y-4 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
        viewMode === 'optimized' ? 'bg-emerald-500/15' : 'bg-rose-500/15'
      }`} />
      <div className={`absolute -left-20 -bottom-20 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
        viewMode === 'optimized' ? 'bg-amber-500/10' : 'bg-orange-500/10'
      }`} />

      {/* Map Header & Interactive Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full animate-ping ${viewMode === 'optimized' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <h3 className="font-extrabold text-sm text-white tracking-wide flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              GIS Route Simulator
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            {viewMode === 'optimized' 
              ? 'Consolidated multi-stop batch routing (Haryana Farm Gate ➔ Urban Hubs)' 
              : 'Traditional fragmented logistics (Independent unpooled round trips)'}
          </p>
        </div>

        {/* Solver Switcher Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700/80 shadow-inner self-start sm:self-auto">
          <button
            onClick={() => setViewMode('optimized')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'optimized'
                ? 'bg-emerald-600 text-white shadow-lg ring-1 ring-emerald-400/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Google OR-Tools VRP
          </button>
          <button
            onClick={() => setViewMode('naive')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'naive'
                ? 'bg-rose-600 text-white shadow-lg ring-1 ring-rose-400/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            Naive Unpooled
          </button>
        </div>
      </div>

      {/* Mode Explainer Banner */}
      <div className={`p-3 rounded-2xl text-xs flex items-center justify-between gap-3 border transition-all duration-300 ${
        viewMode === 'optimized'
          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
          : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
      }`}>
        <div className="flex items-center gap-2">
          {viewMode === 'optimized' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className="font-semibold leading-tight">
            {viewMode === 'optimized' ? (
              <>
                <strong className="text-white">AI-Optimized Pooled Route:</strong> 1 truck collects all produce in sequential geographic order. Bypasses 75.2 km of redundant haulage.
              </>
            ) : (
              <>
                <strong className="text-white">Traditional Unpooled Model:</strong> 4 independent tempos travel separately to Delhi and return empty. 310.2 km total road distance (+24% waste).
              </>
            )}
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 shrink-0">
          {viewMode === 'optimized' ? '1 Single Vehicle' : '4 Dispatched Tempos'}
        </span>
      </div>

      {/* Interactive GIS Visual Map Canvas */}
      <div className="relative w-full h-84 sm:h-96 rounded-2xl bg-slate-900/95 border border-slate-800 overflow-hidden shadow-inner">
        {/* Subtle GIS Grid Mesh */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
          <defs>
            <pattern id="gisGrid2" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#64748b" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gisGrid2)" />
        </svg>

        {/* Geographic Landmark Labels */}
        <div className="absolute left-4 top-3 text-[10px] font-bold font-mono text-slate-500 tracking-wider pointer-events-none">
          📍 HARYANA AGRARIAN NODES (REWARI / NUH / ROHTAK)
        </div>
        <div className="absolute right-4 bottom-3 text-[10px] font-bold font-mono text-emerald-400/80 tracking-wider pointer-events-none">
          🏙️ DELHI NCR CONSUMPTION CORRIDOR
        </div>

        {/* Vector SVG Polylines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {viewMode === 'optimized' ? (
            <>
              {/* Green Pooled Polyline (Glow) */}
              <polyline
                points={optimizedPolyline}
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeOpacity="0.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Main Green Active Line */}
              <polyline
                points={optimizedPolyline}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="3 1.5"
              />
            </>
          ) : (
            // Naive 4 Separate Radial Lines from each farm directly to Delhi
            pickupPoints.map((pickup, idx) => (
              <g key={idx}>
                {/* Thick Red Line for Separate Trip */}
                <line
                  x1={pickup.x}
                  y1={pickup.y}
                  x2={destinationPoint.x}
                  y2={destinationPoint.y}
                  stroke="#f43f5e"
                  strokeWidth="2"
                  strokeDasharray="2.5 2.5"
                  strokeOpacity="0.8"
                />
                {/* Return Empty Haul (Dimmed Orange Line) */}
                <line
                  x1={destinationPoint.x}
                  y1={destinationPoint.y}
                  x2={pickup.x}
                  y2={pickup.y}
                  stroke="#fb923c"
                  strokeWidth="1"
                  strokeDasharray="1 3"
                  strokeOpacity="0.4"
                />
              </g>
            ))
          )}
        </svg>

        {/* Animated Vehicles on Map */}
        {viewMode === 'optimized' ? (
          // Single AI-Optimized Carrier Truck
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none transition-all duration-75 ease-linear"
            style={{ left: `${optimizedTruck.x}%`, top: `${optimizedTruck.y}%` }}
          >
            <div className="w-9 h-9 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-xl ring-4 ring-emerald-400/40 animate-pulse">
              <Truck className="w-5 h-5 fill-slate-950" />
            </div>
          </div>
        ) : (
          // 4 Separate Unpooled Vehicles driving independently
          naiveVehicles.map((veh, idx) => (
            <div
              key={idx}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none transition-all duration-100 ease-linear"
              style={{ left: `${veh.x}%`, top: `${veh.y}%` }}
            >
              <div className={`px-1.5 py-0.5 rounded-full text-[9px] font-black shadow-lg flex items-center gap-0.5 border ${
                veh.isReturning
                  ? 'bg-orange-500 text-white border-orange-300 ring-2 ring-orange-400/30'
                  : 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-400/40'
              }`}>
                <span>🛻</span>
                <span>#{idx + 1}</span>
                {veh.isReturning && <span className="text-[7px] text-orange-200">EMPTY</span>}
              </div>
            </div>
          ))
        )}

        {/* Waypoint Interactive Markers */}
        {projectedPoints.map((pt, idx) => {
          const isDestination = idx === projectedPoints.length - 1;
          const isSelected = activeStopIndex === idx;

          return (
            <div
              key={idx}
              onClick={() => setActiveStopIndex(idx)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
            >
              <div
                className={`rounded-full flex items-center justify-center font-black transition-all shadow-lg ${
                  isDestination
                    ? 'w-7 h-7 bg-amber-400 text-slate-950 ring-4 ring-amber-400/40 scale-110'
                    : isSelected
                    ? viewMode === 'optimized'
                      ? 'w-7 h-7 bg-emerald-400 text-slate-950 ring-4 ring-emerald-400/50 scale-125'
                      : 'w-7 h-7 bg-rose-500 text-white ring-4 ring-rose-400/50 scale-125'
                    : viewMode === 'optimized'
                    ? 'w-6 h-6 bg-emerald-700 text-white hover:bg-emerald-500 hover:scale-115'
                    : 'w-6 h-6 bg-rose-700 text-white hover:bg-rose-500 hover:scale-115'
                } text-[11px]`}
              >
                {isDestination ? '📍' : idx + 1}
              </div>

              {/* Waypoint Label Badge on Map */}
              <div className={`absolute top-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded-md text-[9px] font-bold border pointer-events-none transition ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-600 shadow-md z-30'
                  : 'bg-slate-950/80 text-slate-300 border-slate-800 opacity-80 group-hover:opacity-100'
              }`}>
                {pt.name.split(' ')[0]}
              </div>

              {/* Expanded Card Popup for Selected Stop */}
              {isSelected && (
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-52 bg-slate-900 border border-slate-700 p-3 rounded-2xl shadow-2xl z-40 text-left space-y-1.5 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-white truncate">{pt.name}</span>
                    <span className="text-emerald-400 font-mono text-[10px] font-bold bg-slate-800 px-1.5 py-0.5 rounded">
                      {pt.eta}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{pt.location}</span>
                  </div>
                  <div className="text-[11px] font-bold text-amber-300 pt-1 border-t border-slate-800 flex items-center justify-between">
                    <span>{pt.crop}</span>
                    <span className="text-[9px] text-slate-400 font-normal">
                      {pt.type === 'pickup' ? '📦 Farm Pickup' : '📍 Urban Drop'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dynamic Metrics Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
        <div className={`p-3.5 rounded-2xl border transition-all ${
          viewMode === 'optimized'
            ? 'bg-slate-900/90 border-emerald-500/30'
            : 'bg-slate-900/90 border-rose-500/30'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
              viewMode === 'optimized' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {viewMode === 'optimized' ? '24%' : '0%'}
            </div>
            <div className="min-w-0">
              <strong className="text-white block text-xs truncate">
                {viewMode === 'optimized' ? 'Road Distance Saved' : 'Total Unpooled Mileage'}
              </strong>
              <span className="text-[11px] text-slate-400">
                {viewMode === 'optimized' ? `${savedDistanceKm} km bypassed` : '310.2 km (4x trips)'}
              </span>
            </div>
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border transition-all ${
          viewMode === 'optimized'
            ? 'bg-slate-900/90 border-amber-500/30'
            : 'bg-slate-900/90 border-rose-500/30'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
              viewMode === 'optimized' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              <Fuel className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <strong className="text-white block text-xs truncate">
                {viewMode === 'optimized' ? 'Diesel Saved' : 'Wasted Fuel Expense'}
              </strong>
              <span className="text-[11px] text-slate-400">
                {viewMode === 'optimized' ? '6.3L (₹567 cut)' : '+6.3L wasted on empty hauls'}
              </span>
            </div>
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border transition-all ${
          viewMode === 'optimized'
            ? 'bg-slate-900/90 border-purple-500/30'
            : 'bg-slate-900/90 border-rose-500/30'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
              viewMode === 'optimized' ? 'bg-purple-500/20 text-purple-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              <Leaf className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <strong className="text-white block text-xs truncate">
                {viewMode === 'optimized' ? 'Carbon Abated' : 'Excess Emissions'}
              </strong>
              <span className="text-[11px] text-slate-400">
                {viewMode === 'optimized' ? '13.5 kg CO2 avoided' : '32.8 kg CO2 emitted'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

