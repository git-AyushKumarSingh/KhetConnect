'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Store, 
  Search, 
  Leaf, 
  Sparkles, 
  ShoppingCart, 
  Building2, 
  User, 
  MapPin, 
  Zap, 
  TrendingDown, 
  BarChart3, 
  ChevronDown,
  ChevronUp,
  Tag 
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useStore';
import { ProduceItem } from '@/lib/db/mock-data';
import OnionForecastGraph from '@/components/OnionForecastGraph';

export default function MarketplacePage() {
  const { produces, addToCart, currentUser, setCurrentUserRole } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [buyerMode, setBuyerMode] = useState<'RETAIL' | 'BULK'>(
    currentUser.role === 'BUYER_BULK' ? 'BULK' : 'RETAIL'
  );
  const [showForecastGraph, setShowForecastGraph] = useState(true);
  const [addedItemNotification, setAddedItemNotification] = useState<string | null>(null);

  // Filter Categories
  const categories = [
    { id: 'ALL', label: 'All Farm Harvest' },
    { id: 'VEGETABLES', label: '🥦 Vegetables' },
    { id: 'FRUITS', label: '🍎 Fruits' },
    { id: 'GRAINS_CEREALS', label: '🌾 Grains & Wheat' },
  ];

  // Filtered Produces
  const filteredProduces = produces.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (produce: ProduceItem, qty: number) => {
    addToCart(produce, qty);
    setAddedItemNotification(produce.id);
    setTimeout(() => setAddedItemNotification(null), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
            <Store className="w-3.5 h-3.5" />
            KhetConnect Pune Catalog
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Direct Farm Harvest Marketplace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            100% Farm Fresh from Junnar, Manchar & Pune growers • 5% Lower than Local Retail Markets
          </p>
        </div>

        {/* Quick Mode Toggle & Graph Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* 30-Day Graph Toggle Button */}
          <button
            onClick={() => setShowForecastGraph(!showForecastGraph)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-bold text-purple-800 shadow-sm transition-all"
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
            <span>{showForecastGraph ? 'Hide Onion Graph' : 'Show 30-Day Onion Graph'}</span>
            {showForecastGraph ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Retail vs Bulk Mode Toggle */}
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl border border-slate-300">
            <button
              onClick={() => {
                setBuyerMode('RETAIL');
                setCurrentUserRole('BUYER_RETAIL');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                buyerMode === 'RETAIL'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              Retail (5% Off Local Market)
            </button>

            <button
              onClick={() => {
                setBuyerMode('BULK');
                setCurrentUserRole('BUYER_BULK');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                buyerMode === 'BULK'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              B2B Bulk Mode
              <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded">
                +3% Off on ₹2500+
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Prominent Nashik Red Onions 30-Day Forecast Graph Section */}
      {showForecastGraph && (
        <div className="animate-fade-in space-y-2">
          <OnionForecastGraph showTitle={true} compact={false} />
        </div>
      )}

      {/* B2B Mode Automatic 3% Discount Alert Banner */}
      {buyerMode === 'BULK' && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-4 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-400/20 text-amber-300 font-bold text-base">⚡</span>
            <div>
              <p className="font-bold text-white text-sm">B2B Auto-Discount Active</p>
              <p className="text-emerald-200 text-[11px]">
                Automatic <strong>3% extra discount per item</strong> applied to any item order value of <strong>₹2,500 or higher</strong>!
              </p>
            </div>
          </div>
          <span className="text-[11px] bg-emerald-500/30 text-emerald-200 px-3 py-1.5 rounded-lg border border-emerald-400/40 font-mono font-semibold">
            Auto-Applied in Cart
          </span>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search fresh harvest (e.g. Nashik Red Onions, Junnar Tomatoes, Grapes)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProduces.map((item) => {
          const isBulk = buyerMode === 'BULK';
          const defaultQty = isBulk ? (item.category === 'GRAINS_CEREALS' ? 60 : 70) : 5;
          const [cardQty, setCardQty] = useState(defaultQty);

          const itemGross = cardQty * item.basePricePerKg;
          
          // Rule 8: If B2B mode and cart value of item >= 2500, apply 3% extra discount
          const isB2BDiscountEligible = isBulk && itemGross >= 2500;
          const b2bDiscountAmount = isB2BDiscountEligible ? Math.round(itemGross * 0.03 * 10) / 10 : 0;
          const finalItemTotal = Math.round((itemGross - b2bDiscountAmount) * 10) / 10;
          const effectivePricePerKg = Math.round((finalItemTotal / cardQty) * 10) / 10;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image & Freshness Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Top Left: Freshness AI Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1 shadow">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>AI Freshness: {item.freshnessScore}%</span>
                  </div>

                  {/* Top Right: 5% Lower Guarantee Tag */}
                  <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" /> 5% Below Local Market
                    </span>
                  </div>

                  {/* Origin */}
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-950/70 backdrop-blur-md text-white text-[11px] p-1.5 rounded-lg flex items-center justify-between">
                    <span className="flex items-center gap-1 truncate font-medium">
                      <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      {item.locationName}
                    </span>
                    <span className="text-[10px] text-emerald-300 font-mono">
                      📦 {item.quantityKg.toLocaleString()}kg Avail
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display group-hover:text-emerald-700 transition-colors">
                      {item.cropName}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Variety: <strong className="text-slate-700">{item.variety}</strong>
                    </p>
                  </div>

                  {/* Local Market Benchmark Comparison Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Local Retail Market Average:</span>
                      <span className="font-mono line-through">₹{item.bigBasketPricePerKg}/kg</span>
                    </div>
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="text-emerald-800 flex items-center gap-1 text-xs">
                        <Zap className="w-3.5 h-3.5 text-amber-500" /> KhetConnect Direct Price:
                      </span>
                      <span className="font-mono text-sm text-emerald-700 font-extrabold">
                        ₹{item.basePricePerKg}/kg
                      </span>
                    </div>
                  </div>

                  {/* B2B ₹2,500+ Auto 3% Discount Indicator */}
                  {isB2BDiscountEligible && (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-2 flex items-center justify-between text-[11px] text-amber-900 font-bold animate-fade-in">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-amber-700" /> B2B Volume Discount (3%):
                      </span>
                      <span className="font-mono">-₹{b2bDiscountAmount.toLocaleString()} Auto-Cut</span>
                    </div>
                  )}

                </div>
              </div>

              {/* Card Footer: Quantity Stepper & Add to Cart */}
              <div className="p-4 pt-0 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Order Quantity:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={isBulk ? 10 : 1}
                      step={isBulk ? 10 : 1}
                      value={cardQty}
                      onChange={(e) => setCardQty(Math.max(1, Number(e.target.value)))}
                      className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-center text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="text-slate-500 font-mono">kg</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(item, cardQty)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    Add {cardQty} kg • ₹{finalItemTotal.toLocaleString()}
                  </span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
