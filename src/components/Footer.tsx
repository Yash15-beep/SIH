import React from 'react';
import Link from 'next/link';
import { Sprout, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Sprout className="w-4 h-4" />
            </div>
            KisanSetu (किसानसेतु)
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-md">
            Built for Smart India Hackathon 2026 (PS ID 26033) for Department of Consumer Affairs (DoCA), Ministry of Consumer Affairs, Food & Public Distribution. Powered by live Agmarknet mandi data and open-source routing infrastructure.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs text-amber-400 font-medium">
            <ShieldCheck className="w-4 h-4" /> Zero-cost open tier architecture • Agmarknet & OSRM Open Data
          </div>
        </div>

        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Portals & Roles</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/farmer/dashboard" className="hover:text-white transition">Farmer Portal & AI Pricing</Link></li>
            <li><Link href="/marketplace" className="hover:text-white transition">Direct Consumer Marketplace</Link></li>
            <li><Link href="/bulk/demand" className="hover:text-white transition">Bulk Buyer Procurement Hub</Link></li>
            <li><Link href="/admin/dashboard" className="hover:text-white transition">DoCA Price-Formation Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">AI & Open Technology</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/insights" className="hover:text-white transition">7-Day Demand Forecasting</Link></li>
            <li><Link href="/admin/logistics" className="hover:text-white transition">OSRM Multi-Stop Route Optimizer</Link></li>
            <li><span className="text-slate-500">Agmarknet Mandi Open Data</span></li>
            <li><span className="text-slate-500">Leaflet OpenStreetMap Integration</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
        © 2026 KisanSetu. Developed for Smart India Hackathon. All rights reserved.
      </div>
    </footer>
  );
}
