'use client';

import React, { useEffect, useRef } from 'react';
import { RouteOptimizationResult } from '@/lib/algorithms/vrp-solver';

interface MapProps {
  trip?: RouteOptimizationResult | null;
  height?: string;
  onSelectWaypoint?: (wp: any) => void;
}

export default function MapComponent({ trip, height = '480px', onSelectWaypoint }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!leafletInstance.current) {
        // Centered strictly on Pune Agricultural Region
        const map = L.map(mapRef.current, {
          center: [18.8500, 73.9000], // Pune Region Center
          zoom: 9,
          scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          maxZoom: 18,
        }).addTo(map);

        leafletInstance.current = map;
      }

      const map = leafletInstance.current;

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }

      // Default Pune Regional Farm Waypoints
      const puneWaypoints = [
        {
          lat: 18.4965,
          lng: 73.9350,
          name: 'Hadapsar Cold Hub (Depot)',
          type: 'DEPOT',
          crop: 'Central Depot',
          weight: 0,
        },
        {
          lat: 19.2600,
          lng: 73.9100,
          name: 'Otur Junnar Farm (Tomatoes & Grapes)',
          type: 'PICKUP',
          crop: 'Tomatoes & Grapes',
          farmer: 'Balasaheb Patil',
          weight: 750,
          sequence: 1,
        },
        {
          lat: 19.0067,
          lng: 73.9392,
          name: 'Manchar Veg Cluster (Onions & Capsicum)',
          type: 'PICKUP',
          crop: 'Red Onions',
          farmer: 'Shivneri FPO',
          weight: 650,
          sequence: 2,
        },
        {
          lat: 18.8400,
          lng: 73.9000,
          name: 'Khed Farm Orchards (Wheat & Veg)',
          type: 'PICKUP',
          crop: 'Sharbati Wheat',
          farmer: 'Khed Kisan Sangh',
          weight: 500,
          sequence: 3,
        },
        {
          lat: 18.3400,
          lng: 74.0300,
          name: 'Saswad Fig & Pomegranate Farm',
          type: 'PICKUP',
          crop: 'Purandar Figs',
          farmer: 'Purandar Organic Group',
          weight: 400,
          sequence: 4,
        },
        {
          lat: 18.5900,
          lng: 73.7400,
          name: 'Hinjewadi & Viman Nagar Delivery Terminal',
          type: 'DROP',
          crop: 'Pune Wholesale Terminal',
          weight: 2300,
        },
      ];

      const waypoints = trip ? trip.waypointSequence : puneWaypoints;

      const createCustomIcon = (type: string, seq?: number) => {
        let bg = 'bg-emerald-600';
        let emoji = '🌾';

        if (type === 'DEPOT') {
          bg = 'bg-amber-500';
          emoji = '🏭';
        } else if (type === 'DROP') {
          bg = 'bg-blue-600';
          emoji = '🏢';
        }

        return L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
              <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${bg} text-white font-bold text-xs shadow-lg border-2 border-white ring-2 ring-black/10 group-hover:scale-110 transition-transform">
                <span>${seq ? seq : emoji}</span>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
      };

      const latLngBounds = L.latLngBounds([]);

      waypoints.forEach((wp: any) => {
        const marker = L.marker([wp.lat, wp.lng], {
          icon: createCustomIcon(wp.type, wp.sequence),
        }).addTo(map);

        latLngBounds.extend([wp.lat, wp.lng]);

        const popupContent = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 180px; padding: 4px;">
            <div style="font-size: 10px; font-weight: 700; color: ${wp.type === 'DEPOT' ? '#b45309' : wp.type === 'DROP' ? '#1d4ed8' : '#047857'}; text-transform: uppercase;">
              ${wp.type === 'DEPOT' ? 'Pune Cold Hub Depot' : wp.type === 'DROP' ? 'Pune Delivery Terminal' : `Stop #${wp.sequence || 1} • Pune Farm Pickup`}
            </div>
            <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-top: 2px;">${wp.name}</div>
            ${wp.farmerName ? `<div style="font-size: 11px; color: #475569;">👨‍🌾 ${wp.farmerName}</div>` : ''}
            ${wp.cropName ? `<div style="font-size: 11px; color: #047857; font-weight: 600;">📦 ${wp.cropName} (${wp.weightKg || wp.weight} kg)</div>` : ''}
            ${wp.estimatedArrivalMinutes ? `<div style="font-size: 10px; color: #64748b; margin-top: 4px;">⏱️ Est. Arrival: +${wp.estimatedArrivalMinutes} mins</div>` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (onSelectWaypoint) onSelectWaypoint(wp);
        });

        markersRef.current.push(marker);
      });

      const lineCoords = waypoints.map((wp: any) => [wp.lat, wp.lng]);
      if (lineCoords.length >= 2) {
        const polyline = L.polyline(lineCoords, {
          color: '#10b981',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 8',
          lineCap: 'round',
        }).addTo(map);

        polylineRef.current = polyline;
      }

      if (latLngBounds.isValid()) {
        map.fitBounds(latLngBounds, { padding: [40, 40] });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [trip]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      <div ref={mapRef} style={{ height }} className="w-full" />
      
      {/* Map Overlay Badge */}
      <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span className="font-bold text-slate-800">KhetConnect Pune Logistics Grid</span>
        <span className="text-[10px] text-slate-500 font-mono">Junnar - Manchar - Khed - Pune</span>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 right-3 z-[400] bg-white/90 backdrop-blur-md p-2 rounded-xl border border-slate-200 shadow-md text-[11px] font-semibold space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Hadapsar Cold Hub</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
          <span>Pune Farm Pickups</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span>
          <span>Hinjewadi Drop Terminal</span>
        </div>
      </div>
    </div>
  );
}
