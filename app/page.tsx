'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sprout,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Truck,
  Store,
  BarChart3,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Calculator,
  ShoppingBag,
  Zap,
  Leaf
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useStore';
import OnionForecastGraph from '@/components/OnionForecastGraph';

export default function HomePage() {
  const { setCurrentUserRole } = useAppStore();

  // Local Market Comparison Calculator State
  const [selectedProduce, setSelectedProduce] = useState('onions');
  const [basketVolumeKg, setBasketVolumeKg] = useState(25);

  const priceCatalog: Record<string, { name: string; localMarketRate: number; khetConnect: number }> = {
    onions: { name: 'Nashik Red Onions', localMarketRate: 38, khetConnect: 36.1 },
    tomatoes: { name: 'Junnar Hybrid Tomatoes', localMarketRate: 42, khetConnect: 39.9 },
    wheat: { name: 'Sharbati Golden Wheat', localMarketRate: 54, khetConnect: 51.3 },
    grapes: { name: 'Sonaka Green Grapes', localMarketRate: 120, khetConnect: 114.0 },
    capsicum: { name: 'Green Bell Capsicum', localMarketRate: 68, khetConnect: 64.6 },
    pomegranates: { name: 'Saswad Bhagwa Pomegranates', localMarketRate: 160, khetConnect: 152.0 },
  };

  const currentItem = priceCatalog[selectedProduce];
  const totalLocalMarketCost = Math.round(basketVolumeKg * currentItem.localMarketRate);
  const totalKhetConnectCost = Math.round(basketVolumeKg * currentItem.khetConnect);
  const totalSavings = totalLocalMarketCost - totalKhetConnectCost;

  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* 1. Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white p-8 md:p-14 shadow-2xl border border-emerald-800/40">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Farm Fresh • Pune Regional Grid</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-[1.1]">
              Farm-Fresh Harvest. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300 bg-clip-text text-transparent">
                5% Cheaper than Local Retail Markets
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 font-normal max-w-2xl leading-relaxed">
              Order directly from Pune & Maharashtra farmers. Harvested at sunrise, delivered within hours, with guaranteed lower prices than any local retail market.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/marketplace"
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <Store className="w-4 h-4" />
                Shop Fresh Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/farmer/dashboard"
                onClick={() => setCurrentUserRole('FARMER')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm flex items-center gap-2 transition-all active:scale-95"
              >
                <Sprout className="w-4 h-4 text-emerald-400" />
                Farmer Listing Hub
              </Link>
              <Link
                href="/admin/analytics"
                className="px-5 py-3.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-200 font-semibold text-sm backdrop-blur-sm flex items-center gap-2 transition-all"
              >
                <BarChart3 className="w-4 h-4 text-purple-400" />
                Onion 30-Day Forecast
              </Link>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-800/60 max-w-lg">
              <div>
                <p className="text-2xl font-extrabold text-white font-display">-5%</p>
                <p className="text-xs text-emerald-300">vs Local Market Rates</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white font-display">100%</p>
                <p className="text-xs text-emerald-300">Pune Farmgate Fresh</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white font-display">⚡ 3% Off</p>
                <p className="text-xs text-emerald-300">Auto B2B (₹2500+ Items)</p>
              </div>
            </div>

          </div>

          {/* Right Hero Graphic: Live Benchmark Comparison Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-emerald-700/50 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">

              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Live Local Market Benchmark
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded">
                  Daily APMC Benchmark
                </span>
              </div>

              {/* Local Market Price vs KhetConnect */}
              <div className="space-y-2.5 text-xs">

                <div className="bg-slate-800/70 border border-slate-700 p-3 rounded-xl flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                    <span>Local Retail Market Average:</span>
                  </div>
                  <span className="font-mono font-bold text-slate-200">₹{currentItem.localMarketRate}/kg</span>
                </div>

                {/* KhetConnect Direct Price */}
                <div className="bg-emerald-950/70 border-2 border-emerald-400 p-3.5 rounded-xl flex items-center justify-between text-white">
                  <div>
                    <p className="font-extrabold text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> KhetConnect Direct Price
                    </p>
                    <p className="text-[11px] text-emerald-400 font-medium">Guaranteed 5% lower + Farm fresh</p>
                  </div>
                  <span className="text-lg font-black text-amber-300 font-mono">
                    ₹{currentItem.khetConnect}/kg
                  </span>
                </div>

              </div>

              <div className="p-3 bg-emerald-900/40 border border-emerald-700/40 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-300">Pune Same-Day Morning Delivery</span>
                <span className="text-emerald-400 font-bold">100% Quality Checked</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. Embedded Nashik Red Onions 30-Day Forecast Graph */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full mb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              Live 30-Day Demand & Price Forecasting Graph
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Nashik Red Onions • 30-Day Price & Demand Trajectory
            </h2>
          </div>
          <Link
            href="/admin/analytics"
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            Explore Full Intelligence <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* The Drawn Graph */}
        <OnionForecastGraph showTitle={false} />
      </section>

      {/* 3. Local Market Comparison Calculator */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
              <Calculator className="w-3.5 h-3.5" />
              Local Market Price Comparison Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Calculate Savings vs Local Pune Retail Markets
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Compare fresh harvest prices directly against local retail mandi rates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Controls */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Farm Staple:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(priceCatalog).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedProduce(key)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${selectedProduce === key
                        ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                  >
                    {item.name.split(' ')[0]} {item.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                <span>Purchase Volume</span>
                <span className="text-emerald-700 font-mono">{basketVolumeKg} kg</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={basketVolumeKg}
                onChange={(e) => setBasketVolumeKg(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>5 kg (Family)</span>
                <span>25 kg (Weekly Grocery)</span>
                <span>100 kg (Restaurant / B2B)</span>
              </div>
            </div>
          </div>

          {/* Price Savings Display */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Local Market Total */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-center">
              <span className="text-[11px] font-bold uppercase text-slate-500">Local Retail Market</span>
              <p className="text-2xl font-extrabold text-slate-700 font-display">₹{totalLocalMarketCost.toLocaleString()}</p>
              <p className="text-xs text-slate-500 font-mono">₹{currentItem.localMarketRate}/kg average</p>
            </div>

            {/* KhetConnect Total */}
            <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 space-y-2 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl">
                5% LOWER
              </div>
              <span className="text-[11px] font-bold uppercase text-emerald-800">KhetConnect Direct</span>
              <p className="text-2xl font-extrabold text-emerald-900 font-display">₹{totalKhetConnectCost.toLocaleString()}</p>
              <p className="text-xs text-emerald-700 font-mono font-bold">₹{currentItem.khetConnect}/kg</p>
            </div>

            {/* Direct Total Savings */}
            <div className="sm:col-span-2 p-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-2xl flex items-center justify-between shadow-md">
              <div>
                <p className="text-xs text-emerald-200 font-medium">Your Savings on this Harvest Batch:</p>
                <p className="text-xl sm:text-2xl font-black font-display text-amber-300">
                  Save ₹{totalSavings.toLocaleString()} on Farmgate Quality
                </p>
              </div>
              <Link
                href="/marketplace"
                className="px-4 py-2 bg-white text-emerald-900 rounded-xl font-bold text-xs shadow hover:bg-emerald-50 transition-colors flex items-center gap-1"
              >
                Shop Now
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Portals Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Explore KhetConnect Hubs
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Engineered for retail consumers, Pune farmers, commercial kitchens, and logistics fleets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                🛒
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Consumer Marketplace</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse farm-fresh produce with guaranteed 5% lower prices than local markets, freshness scores, and same-day delivery.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800"
            >
              Explore Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                🌾
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Farmer Listing Hub</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Voice-to-listing simulator (Hindi/Marathi), AI quality freshness grading, and instant listing for Junnar, Manchar & Pune growers.
              </p>
            </div>
            <Link
              href="/farmer/dashboard"
              onClick={() => setCurrentUserRole('FARMER')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              Open Farmer Portal <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                🚚
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Pune Logistics & Map</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive map of Pune farm collection clusters (Otur, Manchar, Khed, Saswad), Hadapsar depot, and Hinjewadi terminal.
              </p>
            </div>
            <Link
              href="/logistics/dispatch"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              View Pune Map <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">Onion 30-Day Forecast</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                30-day regional demand curves, price trends, and festival spike overlays for major staple crops.
              </p>
            </div>
            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-800"
            >
              View 30-Day Graph <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
