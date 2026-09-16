'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  TrendingDown,
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';
import { generate30DayForecast } from '@/lib/algorithms/demand-forecaster';

interface OnionGraphProps {
  showTitle?: boolean;
  compact?: boolean;
}

export default function OnionForecastGraph({ showTitle = true, compact = false }: OnionGraphProps) {
  const [activeMetric, setActiveMetric] = useState<'DEMAND' | 'PRICE'>('DEMAND');
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);

  const forecast = generate30DayForecast('onions', 'Maharashtra (Mumbai - Pune - Nashik)');
  const days = forecast.dailyForecasts;

  const maxDemand = Math.max(...days.map((d) => d.upperBoundTonnes)) * 1.05;
  const minDemand = Math.min(...days.map((d) => d.lowerBoundTonnes)) * 0.9;
  
  const maxPrice = Math.max(...days.map((d) => d.predictedPricePerKg)) * 1.1;
  const minPrice = Math.min(...days.map((d) => d.mandiBaselinePricePerKg)) * 0.9;

  // Chart Dimensions for SVG
  const width = 800;
  const height = compact ? 220 : 320;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Coordinate Calculations
  const getX = (index: number) => paddingLeft + (index / (days.length - 1)) * chartWidth;
  
  const getY = (val: number, isPrice = false) => {
    const min = isPrice ? minPrice : minDemand;
    const max = isPrice ? maxPrice : maxDemand;
    const norm = (val - min) / (max - min);
    return paddingTop + chartHeight - norm * chartHeight;
  };

  // Build SVG Path Strings
  const demandPoints = days.map((d, i) => `${getX(i)},${getY(d.predictedDemandTonnes)}`);
  const demandLinePath = `M ${demandPoints.join(' L ')}`;
  
  const demandAreaPath = `M ${getX(0)},${paddingTop + chartHeight} L ${demandPoints.join(' L ')} L ${getX(days.length - 1)},${paddingTop + chartHeight} Z`;

  const pricePoints = days.map((d, i) => `${getX(i)},${getY(d.predictedPricePerKg, true)}`);
  const priceLinePath = `M ${pricePoints.join(' L ')}`;
  const priceAreaPath = `M ${getX(0)},${paddingTop + chartHeight} L ${pricePoints.join(' L ')} L ${getX(days.length - 1)},${paddingTop + chartHeight} Z`;

  const activePoints = activeMetric === 'DEMAND' ? demandPoints : pricePoints;
  const activeLine = activeMetric === 'DEMAND' ? demandLinePath : priceLinePath;
  const activeArea = activeMetric === 'DEMAND' ? demandAreaPath : priceAreaPath;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        {showTitle && (
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Nashik Red Onions • 30-Day Forward Demand & Price Graph
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Regional Pune & Maharashtra Consumption Forecasting with Festival Surge Modeling
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Metric Selector Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveMetric('DEMAND')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMetric === 'DEMAND'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Demand Curve (Tonnes)
          </button>
          <button
            onClick={() => setActiveMetric('PRICE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMetric === 'PRICE'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Price Trajectory (₹ / kg)
          </button>
        </div>
      </div>

      {/* Summary Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">30-Day Projected Volume</span>
          <strong className="text-purple-900 font-extrabold text-base font-display">
            {forecast.totalProjectedDemandTonnes.toLocaleString()} Tonnes
          </strong>
        </div>
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Current Direct Price</span>
          <strong className="text-emerald-900 font-extrabold text-base font-mono">
            ₹36.1 / kg
          </strong>
        </div>
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Peak Demand Date</span>
          <strong className="text-amber-900 font-bold text-xs">
            {forecast.peakDemandDate} (Festive Spike)
          </strong>
        </div>
        <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Local Market Price</span>
          <strong className="text-blue-900 font-bold text-xs font-mono">
            ₹38.0 - ₹42.0 / kg
          </strong>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative w-full overflow-hidden bg-slate-50/70 rounded-2xl border border-slate-200 p-2 sm:p-4">
        
        {/* Tooltip Float */}
        {hoveredPoint && (
          <div
            className="absolute top-4 left-6 z-20 bg-slate-900/90 backdrop-blur-md text-white text-xs p-3 rounded-2xl shadow-xl border border-slate-700 pointer-events-none animate-fade-in space-y-1"
          >
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <span>Day {hoveredPoint.dayIndex} ({hoveredPoint.date})</span>
              {hoveredPoint.festivalEvent && (
                <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  🎉 {hoveredPoint.festivalEvent}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px] font-mono pt-1">
              <div>
                <span className="text-slate-400 block">Predicted Demand:</span>
                <strong className="text-purple-300 text-xs">{hoveredPoint.predictedDemandTonnes} Tonnes</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Direct Price:</span>
                <strong className="text-emerald-300 text-xs">₹{hoveredPoint.predictedPricePerKg} / kg</strong>
              </div>
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            {/* Purple Gradient for Demand */}
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9333ea" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#9333ea" stopOpacity="0.0" />
            </linearGradient>

            {/* Emerald Gradient for Price */}
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const val = activeMetric === 'DEMAND'
              ? Math.round(minDemand + ratio * (maxDemand - minDemand))
              : (minPrice + ratio * (maxPrice - minPrice)).toFixed(1);

            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={paddingLeft + chartWidth}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94a3b8"
                  fontFamily="monospace"
                >
                  {val}{activeMetric === 'DEMAND' ? 'T' : '₹'}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path
            d={activeArea}
            fill={activeMetric === 'DEMAND' ? 'url(#purpleGradient)' : 'url(#emeraldGradient)'}
          />

          {/* Curve Line */}
          <path
            d={activeLine}
            fill="none"
            stroke={activeMetric === 'DEMAND' ? '#7e22ce' : '#059669'}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points and Festival Markers */}
          {days.map((d, i) => {
            const x = getX(i);
            const y = getY(
              activeMetric === 'DEMAND' ? d.predictedDemandTonnes : d.predictedPricePerKg,
              activeMetric === 'PRICE'
            );
            const isFestival = !!d.festivalEvent;
            const isHovered = hoveredPoint?.dayIndex === d.dayIndex;

            return (
              <g key={d.dayIndex} className="cursor-pointer">
                {/* Festival Event Vertical Line */}
                {isFestival && (
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={paddingTop + chartHeight}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Interactive Clickable Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 7 : isFestival ? 5.5 : 4}
                  fill={isFestival ? '#f59e0b' : activeMetric === 'DEMAND' ? '#7e22ce' : '#059669'}
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 3 : 2}
                  onMouseEnter={() => setHoveredPoint(d)}
                />

                {/* Day X-Axis Labels */}
                {(i === 0 || i === 4 || i === 9 || i === 14 || i === 19 || i === 24 || i === 29) && (
                  <text
                    x={x}
                    y={paddingTop + chartHeight + 20}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748b"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    D{d.dayIndex}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-3 border-t border-slate-200 mt-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${activeMetric === 'DEMAND' ? 'bg-purple-600' : 'bg-emerald-600'}`} />
              <strong className="text-slate-800">{activeMetric === 'DEMAND' ? '30-Day Demand (Tonnes)' : 'Price Trajectory (₹/kg)'}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-amber-800 font-semibold">Festive Surge (Navratri & Diwali)</span>
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Hover dots for daily details (D1 - D30)
          </span>
        </div>

      </div>

      {/* AI Insight Box */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-1.5 text-xs">
        <div className="flex items-center gap-2 font-bold text-purple-900">
          <Sparkles className="w-4 h-4 text-purple-700" />
          <span>Nashik Red Onions Market Trend Intelligence</span>
        </div>
        <p className="text-purple-800 leading-relaxed font-medium">
          📈 <strong>Demand Outlook:</strong> Onion demand across Pune & Western Maharashtra is projected to experience strong spikes around <strong>Day 11 (Navratri surge)</strong> and <strong>Day 25 (Diwali preparation)</strong>. Direct procurement via KhetConnect protects against open local market spot price surges.
        </p>
      </div>

    </div>
  );
}
