/**
 * KrishiDirect AI Logistics Engine
 * Capacitated Vehicle Routing Problem (CVRP) & 2-Opt Traveling Salesperson Optimizer
 * 
 * Solves agricultural milk-run collection routes from multiple dispersed farms
 * to central aggregation hubs / wholesale distribution centers.
 */

export interface LocationPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  farmerName?: string;
  cropName?: string;
  weightKg: number;
  type: 'PICKUP' | 'DROP' | 'DEPOT';
  address?: string;
  phone?: string;
}

export interface OptimizedWaypoint extends LocationPoint {
  sequence: number;
  cumulativeWeightKg: number;
  cumulativeDistanceKm: number;
  estimatedArrivalMinutes: number;
}

export interface RouteOptimizationResult {
  clusterId: string;
  vehicleCapacityKg: number;
  totalPayloadKg: number;
  capacityUtilizationPercent: number;
  totalDistanceKm: number;
  baselineIndependentDistanceKm: number; // Distance if each farmer did their own trip to hub
  distanceSavedKm: number;
  estimatedFuelSavedLiters: number;
  carbonEmissionsSavedKg: number;
  estimatedCostSavedInr: number;
  waypointSequence: OptimizedWaypoint[];
  geoJsonRoute: {
    type: 'FeatureCollection';
    features: Array<{
      type: 'Feature';
      geometry: {
        type: 'LineString' | 'Point';
        coordinates: [number, number] | [number, number][];
      };
      properties: Record<string, any>;
    }>;
  };
}

// Earth radius in km
const EARTH_RADIUS_KM = 6371.0;
// Average road winding factor in rural Indian corridors
const ROAD_TORTUOSITY = 1.28;
// Diesel fuel economy: 4.2 km per liter for light commercial vehicles (LCV / Tata 407 / Bolero Maxi)
const FUEL_EFFICIENCY_KM_PER_LITER = 4.2;
// Diesel carbon emission coefficient: 2.68 kg CO2 per liter
const CO2_PER_LITER_DIESEL = 2.68;
// Average diesel price INR
const DIESEL_PRICE_PER_LITER_INR = 92.5;

/**
 * Calculates Haversine great circle distance with road tortuosity factor
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c * ROAD_TORTUOSITY * 10) / 10;
}

/**
 * 2-Opt TSP optimization heuristic for a tour starting at depot, visiting all stops, and returning/ending at hub
 */
function optimize2Opt(
  points: LocationPoint[],
  depot: LocationPoint,
  destination: LocationPoint
): LocationPoint[] {
  if (points.length <= 2) return points;

  let bestTour = [...points];
  let improved = true;
  let iterations = 0;
  const maxIterations = 50;

  const calculateTourDistance = (tour: LocationPoint[]): number => {
    let dist = calculateDistanceKm(depot.lat, depot.lng, tour[0].lat, tour[0].lng);
    for (let i = 0; i < tour.length - 1; i++) {
      dist += calculateDistanceKm(
        tour[i].lat,
        tour[i].lng,
        tour[i + 1].lat,
        tour[i + 1].lng
      );
    }
    dist += calculateDistanceKm(
      tour[tour.length - 1].lat,
      tour[tour.length - 1].lng,
      destination.lat,
      destination.lng
    );
    return dist;
  };

  let bestDistance = calculateTourDistance(bestTour);

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 0; i < bestTour.length - 1; i++) {
      for (let k = i + 1; k < bestTour.length; k++) {
        // Reverse sub-array between i and k
        const newTour = [
          ...bestTour.slice(0, i),
          ...bestTour.slice(i, k + 1).reverse(),
          ...bestTour.slice(k + 1),
        ];

        const newDist = calculateTourDistance(newTour);
        if (newDist < bestDistance - 0.1) {
          bestTour = newTour;
          bestDistance = newDist;
          improved = true;
          break;
        }
      }
      if (improved) break;
    }
  }

  return bestTour;
}

/**
 * Solves Capacitated Vehicle Routing Problem (CVRP) for a set of farm pickups
 */
export function solveCVRP(
  pickups: LocationPoint[],
  depot: LocationPoint,
  destination: LocationPoint,
  vehicleCapacityKg: number = 1500
): RouteOptimizationResult[] {
  if (!pickups || pickups.length === 0) {
    return [];
  }

  // 1. Sort pickups by polar angle / proximity relative to depot for spatial clustering
  const sortedPickups = [...pickups].sort((a, b) => {
    const angleA = Math.atan2(a.lat - depot.lat, a.lng - depot.lng);
    const angleB = Math.atan2(b.lat - depot.lat, b.lng - depot.lng);
    return angleA - angleB;
  });

  // 2. Cluster pickups according to vehicle payload capacity
  const clusters: LocationPoint[][] = [];
  let currentCluster: LocationPoint[] = [];
  let currentWeight = 0;

  for (const pickup of sortedPickups) {
    if (currentWeight + pickup.weightKg <= vehicleCapacityKg || currentCluster.length === 0) {
      currentCluster.push(pickup);
      currentWeight += pickup.weightKg;
    } else {
      clusters.push(currentCluster);
      currentCluster = [pickup];
      currentWeight = pickup.weightKg;
    }
  }
  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }

  // 3. For each cluster, optimize the multi-stop pickup sequence using 2-Opt TSP
  const results: RouteOptimizationResult[] = [];

  clusters.forEach((clusterPoints, index) => {
    const optimizedStops = optimize2Opt(clusterPoints, depot, destination);
    const totalPayloadKg = clusterPoints.reduce((sum, p) => sum + p.weightKg, 0);

    // Calculate baseline independent distance (if each farmer transported their own produce to the destination)
    const baselineIndependentDistanceKm = clusterPoints.reduce((sum, p) => {
      return sum + calculateDistanceKm(p.lat, p.lng, destination.lat, destination.lng) * 2; // round-trip
    }, 0);

    // Build waypoint sequence with cumulative metrics
    const waypointSequence: OptimizedWaypoint[] = [];
    let cumulativeDist = 0;
    let cumulativeWeight = 0;
    let avgSpeedKmh = 35; // typical rural/semi-urban transport speed

    // Start at Depot
    waypointSequence.push({
      ...depot,
      sequence: 0,
      cumulativeWeightKg: 0,
      cumulativeDistanceKm: 0,
      estimatedArrivalMinutes: 0,
    });

    let prevPoint = depot;

    // Pickups in sequence
    optimizedStops.forEach((stop, idx) => {
      const legDist = calculateDistanceKm(prevPoint.lat, prevPoint.lng, stop.lat, stop.lng);
      cumulativeDist += legDist;
      cumulativeWeight += stop.weightKg;
      const arrivalMinutes = Math.round((cumulativeDist / avgSpeedKmh) * 60 + idx * 15); // 15 mins loading per farm

      waypointSequence.push({
        ...stop,
        sequence: idx + 1,
        cumulativeWeightKg: cumulativeWeight,
        cumulativeDistanceKm: Math.round(cumulativeDist * 10) / 10,
        estimatedArrivalMinutes: arrivalMinutes,
      });

      prevPoint = stop;
    });

    // End at Destination Hub
    const lastLeg = calculateDistanceKm(prevPoint.lat, prevPoint.lng, destination.lat, destination.lng);
    cumulativeDist += lastLeg;
    const finalMinutes = Math.round((cumulativeDist / avgSpeedKmh) * 60 + optimizedStops.length * 15 + 20);

    waypointSequence.push({
      ...destination,
      sequence: optimizedStops.length + 1,
      cumulativeWeightKg: cumulativeWeight,
      cumulativeDistanceKm: Math.round(cumulativeDist * 10) / 10,
      estimatedArrivalMinutes: finalMinutes,
    });

    const totalDistanceKm = Math.round(cumulativeDist * 10) / 10;
    const distanceSavedKm = Math.max(0, Math.round((baselineIndependentDistanceKm - totalDistanceKm) * 10) / 10);
    const estimatedFuelSavedLiters = Math.round((distanceSavedKm / FUEL_EFFICIENCY_KM_PER_LITER) * 10) / 10;
    const carbonEmissionsSavedKg = Math.round(estimatedFuelSavedLiters * CO2_PER_LITER_DIESEL * 10) / 10;
    const estimatedCostSavedInr = Math.round(estimatedFuelSavedLiters * DIESEL_PRICE_PER_LITER_INR);
    const capacityUtilizationPercent = Math.min(100, Math.round((totalPayloadKg / vehicleCapacityKg) * 100));

    // Build GeoJSON features
    const lineCoordinates: [number, number][] = waypointSequence.map((wp) => [wp.lng, wp.lat]);

    const pointFeatures = waypointSequence.map((wp) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [wp.lng, wp.lat] as [number, number],
      },
      properties: {
        sequence: wp.sequence,
        name: wp.name,
        farmerName: wp.farmerName || '',
        cropName: wp.cropName || '',
        weightKg: wp.weightKg,
        type: wp.type,
        estimatedArrivalMinutes: wp.estimatedArrivalMinutes,
      },
    }));

    const routeLineFeature = {
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: lineCoordinates,
      },
      properties: {
        clusterId: `CLUSTER-${index + 1}`,
        totalDistanceKm,
        totalPayloadKg,
        stopsCount: waypointSequence.length,
      },
    };

    results.push({
      clusterId: `ROUTE-MH-${String(index + 1).padStart(3, '0')}`,
      vehicleCapacityKg,
      totalPayloadKg,
      capacityUtilizationPercent,
      totalDistanceKm,
      baselineIndependentDistanceKm: Math.round(baselineIndependentDistanceKm * 10) / 10,
      distanceSavedKm,
      estimatedFuelSavedLiters,
      carbonEmissionsSavedKg,
      estimatedCostSavedInr,
      waypointSequence,
      geoJsonRoute: {
        type: 'FeatureCollection',
        features: [routeLineFeature, ...pointFeatures],
      },
    });
  });

  return results;
}
