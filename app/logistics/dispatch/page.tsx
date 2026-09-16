'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  Fuel, 
  Leaf, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  RefreshCw,
  Layers,
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useStore';
import { solveCVRP, LocationPoint } from '@/lib/algorithms/vrp-solver';
import confetti from 'canvas-confetti';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full bg-slate-100 rounded-2xl flex items-center justify-center text-xs text-slate-500 font-semibold">
      Loading Pune Regional Corridor Map...
    </div>
  ),
});

export default function LogisticsDispatchPage() {
  const { activeTrip, setActiveTrip, tripStatus, setTripStatus } = useAppStore();

  const [vehicleCapacityKg, setVehicleCapacityKg] = useState(3500);
  const [vehicleType, setVehicleType] = useState('Tata 407 (3.5T Cold-Box)');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedWaypoint, setSelectedWaypoint] = useState<any>(null);
  const [completedStops, setCompletedStops] = useState<number[]>([]);

  // Strict Pune Region Farm Pickups
  const punePickups: LocationPoint[] = [
    {
      id: 'pune_pk_01',
      lat: 19.2600,
      lng: 73.9100,
      name: 'Otur Junnar Farm (Tomatoes & Grapes)',
      farmerName: 'Balasaheb Patil',
      cropName: 'Tomatoes & Grapes',
      weightKg: 750,
      type: 'PICKUP',
      phone: '+91 98220 12345',
    },
    {
      id: 'pune_pk_02',
      lat: 19.0067,
      lng: 73.9392,
      name: 'Manchar Veg Cluster (Onions & Capsicum)',
      farmerName: 'Shivneri FPO',
      cropName: 'Nashik Red Onions',
      weightKg: 650,
      type: 'PICKUP',
      phone: '+91 98221 54321',
    },
    {
      id: 'pune_pk_03',
      lat: 18.8400,
      lng: 73.9000,
      name: 'Khed Farm Orchards (Wheat & Veg)',
      farmerName: 'Khed Kisan Sangh',
      cropName: 'Sharbati Wheat',
      weightKg: 500,
      type: 'PICKUP',
      phone: '+91 98223 99887',
    },
    {
      id: 'pune_pk_04',
      lat: 18.3400,
      lng: 74.0300,
      name: 'Saswad Fig & Pomegranate Farm',
      farmerName: 'Purandar Organic Group',
      cropName: 'Purandar Figs',
      weightKg: 400,
      type: 'PICKUP',
      phone: '+91 98225 11223',
    },
  ];

  const puneDepot: LocationPoint = {
    id: 'depot_pune_hadapsar',
    lat: 18.4965,
    lng: 73.9350,
    name: 'Hadapsar Pune Cold Chain Hub (Depot)',
    weightKg: 0,
    type: 'DEPOT',
    address: 'Hadapsar Industrial Estate, Pune',
  };

  const puneDestination: LocationPoint = {
    id: 'dest_pune_hinjewadi',
    lat: 18.5900,
    lng: 73.7400,
    name: 'Hinjewadi & Viman Nagar Delivery Terminal',
    weightKg: 0,
    type: 'DROP',
    address: 'Phase 1, Hinjewadi IT Park, Pune',
  };

  useEffect(() => {
    if (!activeTrip) {
      const initialResults = solveCVRP(
        punePickups,
        puneDepot,
        puneDestination,
        vehicleCapacityKg
      );
      if (initialResults.length > 0) {
        setActiveTrip(initialResults[0]);
      }
    }
  }, []);

  const handleRunOptimizer = async () => {
    setIsOptimizing(true);

    try {
      const res = await fetch('/api/logistics/optimize-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickups: punePickups,
          depot: puneDepot,
          destination: puneDestination,
          vehicleCapacityKg,
        }),
      });

      const json = await res.json();
      if (json.success && json.data.trips.length > 0) {
        setActiveTrip(json.data.trips[0]);
        setTripStatus('OPTIMIZING');
        setTimeout(() => setTripStatus('IDLE'), 800);
      }
    } catch (err) {
      const results = solveCVRP(
        punePickups,
        puneDepot,
        puneDestination,
        vehicleCapacityKg
      );
      if (results.length > 0) {
        setActiveTrip(results[0]);
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDispatchTrip = () => {
    setTripStatus('DISPATCHED');
    setCompletedStops([0]);
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleToggleStop = (seq: number) => {
    if (completedStops.includes(seq)) {
      setCompletedStops(completedStops.filter((s) => s !== seq));
    } else {
      const updated = [...completedStops, seq];
      setCompletedStops(updated);
      if (activeTrip && updated.length >= activeTrip.waypointSequence.length) {
        setTripStatus('COMPLETED');
      } else {
        setTripStatus('IN_TRANSIT');
      }
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header & Fleet Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full mb-1">
            <Truck className="w-3.5 h-3.5" />
            Pune Regional Fleet Routing
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display">
            Pune Logistics & Milk-Run Dispatch Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Junnar • Manchar • Khed • Saswad farm collection pooling to Hadapsar & Hinjewadi
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-sm">
            <span className="font-bold text-slate-600">Vehicle:</span>
            <select
              value={vehicleCapacityKg}
              onChange={(e) => {
                const cap = Number(e.target.value);
                setVehicleCapacityKg(cap);
                if (cap === 1500) setVehicleType('Tata Ace (1.5T)');
                else if (cap === 3500) setVehicleType('Tata 407 (3.5T Cold-Box)');
                else setVehicleType('Eicher Pro (5.0T Heavy)');
              }}
              className="bg-transparent font-bold text-slate-900 focus:outline-none"
            >
              <option value={1500}>Tata Ace (1.5 Tonnes)</option>
              <option value={3500}>Tata 407 (3.5 Tonnes)</option>
              <option value={5000}>Eicher Pro (5.0 Tonnes)</option>
            </select>
          </div>

          <button
            onClick={handleRunOptimizer}
            disabled={isOptimizing}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isOptimizing ? 'Optimizing Pune Route...' : 'Re-Run Pune AI Routing'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Leaflet Map focused strictly on Pune */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-md">
            <MapComponent
              trip={activeTrip}
              height="460px"
              onSelectWaypoint={(wp) => setSelectedWaypoint(wp)}
            />
          </div>

          {/* Efficiency Metrics */}
          {activeTrip && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-blue-500" />
                  Pune Milk-Run Loop
                </span>
                <p className="text-xl font-extrabold text-slate-900 font-display">
                  {activeTrip.totalDistanceKm} km
                </p>
                <span className="text-[10px] text-emerald-600 font-bold">
                  -{activeTrip.distanceSavedKm} km vs individual trips
                </span>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                  <Fuel className="w-3 h-3 text-amber-500" />
                  Diesel Saved
                </span>
                <p className="text-xl font-extrabold text-amber-600 font-display">
                  {activeTrip.estimatedFuelSavedLiters} Liters
                </p>
                <span className="text-[10px] text-slate-500 font-mono">
                  ~₹{activeTrip.estimatedCostSavedInr} saved
                </span>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-500" />
                  CO2 Prevented
                </span>
                <p className="text-xl font-extrabold text-emerald-700 font-display">
                  {activeTrip.carbonEmissionsSavedKg} kg
                </p>
                <span className="text-[10px] text-emerald-600 font-bold">
                  Clean Green Corridor
                </span>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                  <Layers className="w-3 h-3 text-purple-500" />
                  Vehicle Load
                </span>
                <p className="text-xl font-extrabold text-purple-700 font-display">
                  {activeTrip.totalPayloadKg} kg
                </p>
                <span className="text-[10px] text-purple-600 font-bold">
                  {activeTrip.capacityUtilizationPercent}% Capacity
                </span>
              </div>

            </div>
          )}

        </div>

        {/* Right Column: Turn-by-Turn Checklist */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pune Route Plan</span>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {activeTrip?.clusterId || 'ROUTE-PUNE-01'}
                </h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tripStatus === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : tripStatus === 'DISPATCHED' || tripStatus === 'IN_TRANSIT'
                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tripStatus === 'IDLE' ? 'READY' : tripStatus}
              </span>
            </div>

            {/* Vehicle Card */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>🚚 {vehicleType}</span>
                <span className="font-mono text-emerald-700 font-extrabold">
                  {activeTrip?.totalPayloadKg} / {vehicleCapacityKg} kg
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${activeTrip?.capacityUtilizationPercent || 0}%` }}
                />
              </div>
            </div>

            {/* Stops Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Pune Waypoint Sequence</span>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {activeTrip?.waypointSequence.map((wp) => {
                  const isCompleted = completedStops.includes(wp.sequence);
                  const isDepot = wp.type === 'DEPOT';
                  const isDrop = wp.type === 'DROP';

                  return (
                    <div
                      key={wp.sequence}
                      onClick={() => handleToggleStop(wp.sequence)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                        isCompleted
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 opacity-90'
                          : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5 ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isDepot
                            ? 'bg-amber-500 text-white'
                            : isDrop
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> : wp.sequence}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-900 truncate text-xs">{wp.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">+{wp.estimatedArrivalMinutes}m</span>
                        </div>
                        {wp.farmerName && (
                          <p className="text-[11px] text-slate-500">
                            👨‍🌾 {wp.farmerName} • 📦 {wp.cropName} ({wp.weightKg} kg)
                          </p>
                        )}
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Load: {wp.cumulativeWeightKg} kg • Leg: {wp.cumulativeDistanceKm} km
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            {tripStatus === 'IDLE' ? (
              <button
                onClick={handleDispatchTrip}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                Dispatch Driver for Pune Pickups
              </button>
            ) : (
              <button
                onClick={() => {
                  setTripStatus('COMPLETED');
                  if (activeTrip) {
                    setCompletedStops(activeTrip.waypointSequence.map((s) => s.sequence));
                  }
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <PackageCheck className="w-4 h-4" />
                Mark Pune Route Delivered
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
