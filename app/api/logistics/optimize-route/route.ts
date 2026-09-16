import { NextRequest, NextResponse } from 'next/server';
import { solveCVRP, LocationPoint } from '@/lib/algorithms/vrp-solver';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      pickups,
      depot,
      destination,
      vehicleCapacityKg = 1500,
    } = body;

    // Default Maharashtra Agricultural Corridor Depot & Destination if not specified
    const defaultDepot: LocationPoint = {
      id: 'depot_nashik_hub',
      lat: 19.9975,
      lng: 73.7898,
      name: 'Nashik Agro-Logistics Cold Hub',
      weightKg: 0,
      type: 'DEPOT',
      address: 'Pimpalgaon APMC Complex, Nashik, MH',
    };

    const defaultDestination: LocationPoint = {
      id: 'dest_mumbai_terminal',
      lat: 19.0760,
      lng: 72.9980,
      name: 'Vashi Mega Agri-Terminal & Central Distribution',
      weightKg: 0,
      type: 'DROP',
      address: 'Sector 19, Vashi, Navi Mumbai, MH',
    };

    // Default sample pending farm pickups if empty
    const defaultPickups: LocationPoint[] = [
      {
        id: 'pk_01',
        lat: 20.0833,
        lng: 74.0000,
        name: 'Balasaheb Onion Farm (Dindori)',
        farmerName: 'Balasaheb Patil',
        cropName: 'Nashik Red Onions',
        weightKg: 650,
        type: 'PICKUP',
        phone: '+91 98220 12345',
      },
      {
        id: 'pk_02',
        lat: 20.0150,
        lng: 73.9100,
        name: 'Suresh Grape Orchards (Niphad)',
        farmerName: 'Suresh Shinde',
        cropName: 'Sonaka Green Grapes',
        weightKg: 400,
        type: 'PICKUP',
        phone: '+91 98221 54321',
      },
      {
        id: 'pk_03',
        lat: 19.8200,
        lng: 73.7500,
        name: 'Igatpuri Hill Farm (Tomatoes)',
        farmerName: 'Vikas Jadhav',
        cropName: 'Hybrid Tomatoes',
        weightKg: 350,
        type: 'PICKUP',
        phone: '+91 98223 99887',
      },
      {
        id: 'pk_04',
        lat: 19.5500,
        lng: 73.6800,
        name: 'Shahapur Organic Cluster (Veg)',
        farmerName: 'Ganesh Bhoir',
        cropName: 'Green Capsicum & Beans',
        weightKg: 300,
        type: 'PICKUP',
        phone: '+91 98225 11223',
      },
    ];

    const finalPickups: LocationPoint[] = pickups && pickups.length > 0 ? pickups : defaultPickups;
    const finalDepot: LocationPoint = depot || defaultDepot;
    const finalDestination: LocationPoint = destination || defaultDestination;

    // Run Capacitated VRP & 2-Opt TSP optimization
    const optimizedTrips = solveCVRP(
      finalPickups,
      finalDepot,
      finalDestination,
      Number(vehicleCapacityKg)
    );

    // Calculate aggregated metrics
    const totalDistanceKm = optimizedTrips.reduce((acc, t) => acc + t.totalDistanceKm, 0);
    const totalDistanceSavedKm = optimizedTrips.reduce((acc, t) => acc + t.distanceSavedKm, 0);
    const totalFuelSavedLiters = optimizedTrips.reduce((acc, t) => acc + t.estimatedFuelSavedLiters, 0);
    const totalCo2SavedKg = optimizedTrips.reduce((acc, t) => acc + t.carbonEmissionsSavedKg, 0);
    const totalCostSavedInr = optimizedTrips.reduce((acc, t) => acc + t.estimatedCostSavedInr, 0);

    return NextResponse.json({
      success: true,
      data: {
        trips: optimizedTrips,
        summary: {
          totalTripsGenerated: optimizedTrips.length,
          totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
          totalDistanceSavedKm: Math.round(totalDistanceSavedKm * 10) / 10,
          totalFuelSavedLiters: Math.round(totalFuelSavedLiters * 10) / 10,
          totalCo2SavedKg: Math.round(totalCo2SavedKg * 10) / 10,
          totalCostSavedInr,
          averageCapacityUtilization: Math.round(
            optimizedTrips.reduce((acc, t) => acc + t.capacityUtilizationPercent, 0) / (optimizedTrips.length || 1)
          ),
        },
      },
    });
  } catch (error: any) {
    console.error('Error in /api/logistics/optimize-route:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to optimize logistics route' },
      { status: 500 }
    );
  }
}
