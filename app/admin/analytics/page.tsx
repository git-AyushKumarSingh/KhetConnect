'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Leaf, 
  Calendar, 
  Coins, 
  Layers, 
  CheckCircle2,
  Building2,
  Sprout
} from 'lucide-react';
import OnionForecastGraph from '@/components/OnionForecastGraph';

export default function AdminAnalyticsPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            30-Day Forward Demand & Price Intelligence
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Nashik Red Onions & Staple Demand Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Regional Pune & Maharashtra consumption projections with festival surge modeling
          </p>
        </div>
      </div>

      {/* Prominently Drawn Nashik Red Onions 30-Day Forecast Graph */}
      <section className="space-y-4">
        <OnionForecastGraph showTitle={true} compact={false} />
      </section>

      {/* Regional Price Realization Benchmark Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 font-display">Local Retail Market vs KhetConnect Direct Pricing</h3>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
            5% Guaranteed Lower
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-2">Commodity</th>
                <th className="pb-2">Origin</th>
                <th className="pb-2">Local Market Average</th>
                <th className="pb-2">KhetConnect Direct</th>
                <th className="pb-2">Customer Discount</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              <tr>
                <td className="py-3 font-bold text-slate-900">Nashik Red Onions (Garwa)</td>
                <td className="py-3 text-slate-500">Manchar / Junnar, Pune</td>
                <td className="py-3 font-mono line-through text-slate-400">₹38.0 / kg</td>
                <td className="py-3 font-mono font-bold text-emerald-700">₹36.1 / kg</td>
                <td className="py-3 font-bold text-emerald-600">5.0% Lower</td>
                <td className="py-3">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    High Demand
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Junnar Vine Tomatoes</td>
                <td className="py-3 text-slate-500">Otur / Junnar, Pune</td>
                <td className="py-3 font-mono line-through text-slate-400">₹42.0 / kg</td>
                <td className="py-3 font-mono font-bold text-emerald-700">₹39.9 / kg</td>
                <td className="py-3 font-bold text-emerald-600">5.0% Lower</td>
                <td className="py-3">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Fresh Harvest
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Malwa Sharbati Wheat</td>
                <td className="py-3 text-slate-500">Khed, Pune</td>
                <td className="py-3 font-mono line-through text-slate-400">₹54.0 / kg</td>
                <td className="py-3 font-mono font-bold text-emerald-700">₹51.3 / kg</td>
                <td className="py-3 font-bold text-emerald-600">5.0% Lower</td>
                <td className="py-3">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Bulk Available
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Fresh Sonaka Green Grapes</td>
                <td className="py-3 text-slate-500">Junnar Hills, Pune</td>
                <td className="py-3 font-mono line-through text-slate-400">₹120.0 / kg</td>
                <td className="py-3 font-mono font-bold text-emerald-700">₹114.0 / kg</td>
                <td className="py-3 font-bold text-emerald-600">5.0% Lower</td>
                <td className="py-3">
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Table Top Export
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
