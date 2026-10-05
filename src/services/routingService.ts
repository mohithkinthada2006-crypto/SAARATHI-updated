import { Coordinates, JourneyMode, Route, VehicleConfig, TollPlaza, RoadHazard } from '../types';
import { calculateSaarathiScore } from './scoringEngine';
import { generateAiReasons } from './aiExplainer';
import { PRESET_JOURNEYS } from './demoPresets';

// Helper to calculate approximate distance in KM using Haversine formula
export function haversineDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
  const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180;
  const lat1 = (coord1[0] * Math.PI) / 180;
  const lat2 = (coord2[0] * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Generates smooth intermediate curved points between two locations with realistic road bends
function generateSmoothRoadPolyline(
  start: Coordinates,
  end: Coordinates,
  curveFactor: number,
  numSegments: number = 40
): Coordinates[] {
  const points: Coordinates[] = [];
  const midLat = (start[0] + end[0]) / 2;
  const midLng = (start[1] + end[1]) / 2;
  
  // Vector perpendicular to line between start & end
  const dx = end[1] - start[1];
  const dy = end[0] - start[0];
  
  // Normal vector
  const normalLat = -dx * curveFactor;
  const normalLng = dy * curveFactor;

  // Control points for a cubic Bezier curve simulating urban arterial roads
  const p0 = start;
  const p1: Coordinates = [start[0] * 0.65 + midLat * 0.35 + normalLat * 0.7, start[1] * 0.65 + midLng * 0.35 + normalLng * 0.7];
  const p2: Coordinates = [midLat * 0.35 + end[0] * 0.65 + normalLat * 0.9, midLng * 0.35 + end[1] * 0.65 + normalLng * 0.9];
  const p3 = end;

  for (let i = 0; i <= numSegments; i++) {
    const t = i / numSegments;
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    // Cubic Bezier interpolation
    let lat = uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0];
    let lng = uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1];

    // Add subtle micro-variations for realistic road contours
    if (i > 0 && i < numSegments) {
      const wiggle = Math.sin(i * 1.3) * 0.0004;
      lat += wiggle * (curveFactor > 0 ? 1 : -1);
      lng += Math.cos(i * 1.5) * 0.0004;
    }

    points.push([lat, lng]);
  }

  return points;
}

export function generateCandidateRoutes(
  origin: Coordinates,
  destination: Coordinates,
  vehicle: VehicleConfig,
  mode: JourneyMode = 'balanced',
  presetTolls: TollPlaza[] = [],
  presetHazards: RoadHazard[] = []
): Route[] {
  const directDist = haversineDistanceKm(origin, destination);
  const baseDistKm = Math.max(2.5, directDist * 1.28); // road factor

  // Check if matches a preset to enrich names
  const matchedPreset = PRESET_JOURNEYS.find(
    p => haversineDistanceKm(p.originCoords, origin) < 2.0 && haversineDistanceKm(p.destinationCoords, destination) < 2.0
  );

  // 1. ROUTE A: Fastest Corridor (Expressway / Arterial)
  const distA = Number((baseDistKm * 1.05).toFixed(1));
  const durA = Math.max(6, Math.round(distA * 1.5)); // fast transit
  const coordsA = generateSmoothRoadPolyline(origin, destination, 0.22, 55);
  
  // 2. ROUTE B: Saarathi Optimal (Recommended)
  const distB = Number((baseDistKm * 0.96).toFixed(1));
  const durB = Math.max(8, Math.round(distB * 1.85)); // slightly slower than expressway, but direct
  const coordsB = generateSmoothRoadPolyline(origin, destination, -0.18, 55);

  // 3. ROUTE C: Smoothest & Safest (Local avenues, bypasses rough zones)
  const distC = Number((baseDistKm * 1.18).toFixed(1));
  const durC = Math.max(10, Math.round(distC * 2.2));
  const coordsC = generateSmoothRoadPolyline(origin, destination, 0.42, 60);

  // Associate tolls
  const tollsA = presetTolls.length > 0 ? presetTolls : [
    {
      id: 'toll-a1',
      name: 'Expressway Toll Plaza',
      location: coordsA[Math.floor(coordsA.length * 0.55)],
      distanceAlongRouteKm: Number((distA * 0.55).toFixed(1)),
      fastagEnabled: true,
      fee: {
        bike: 0,
        car: 60,
        ev: 60,
        auto: 25,
        bicycle: 0
      }
    }
  ];

  // Route B has fewer or 0 tolls
  const tollsB: TollPlaza[] = [];
  const tollsC: TollPlaza[] = [];

  // Associated hazards
  const defaultHazardsA: RoadHazard[] = [
    {
      id: 'hz-a1',
      type: 'rough_road',
      location: coordsA[Math.floor(coordsA.length * 0.3)],
      severity: 'medium',
      description: 'Flyover expansion joints & rough surface',
      verifiedCount: 16,
      distanceAlongRouteKm: Number((distA * 0.3).toFixed(1))
    },
    {
      id: 'hz-a2',
      type: 'speed_breaker',
      location: coordsA[Math.floor(coordsA.length * 0.8)],
      severity: 'low',
      description: 'Consecutive rubber speed bumps',
      verifiedCount: 9,
      distanceAlongRouteKm: Number((distA * 0.8).toFixed(1))
    }
  ];

  const defaultHazardsB: RoadHazard[] = [
    {
      id: 'hz-b1',
      type: 'pothole',
      location: coordsB[Math.floor(coordsB.length * 0.45)],
      severity: 'low',
      description: 'Small edge-lane pothole marked by traffic cone',
      verifiedCount: 7,
      distanceAlongRouteKm: Number((distB * 0.45).toFixed(1))
    }
  ];

  const defaultHazardsC: RoadHazard[] = [
    {
      id: 'hz-c1',
      type: 'speed_breaker',
      location: coordsC[Math.floor(coordsC.length * 0.6)],
      severity: 'low',
      description: 'Residential zone speed table',
      verifiedCount: 5,
      distanceAlongRouteKm: Number((distC * 0.6).toFixed(1))
    }
  ];

  // Calculate costs helper
  const calcCosts = (distanceKm: number, tolls: TollPlaza[]) => {
    let fuelL = 0;
    let fuelCost = 0;
    let arrivalBattery: number | undefined = undefined;
    let energyKwh: number | undefined = undefined;
    const tollCost = tolls.reduce((acc, t) => acc + (t.fee[vehicle.type] || 0), 0);
    const parkingCost = 0;

    if (vehicle.type === 'ev') {
      const eff = vehicle.efficiencyKmPerKwh || 7.2;
      energyKwh = Number((distanceKm / eff).toFixed(2));
      fuelCost = Math.round(energyKwh * (vehicle.costPerKwh || 9.5));
      const batteryPercentUsed = (energyKwh / (vehicle.batteryCapacityKwh || 40)) * 100;
      arrivalBattery = Math.max(0, Math.round(vehicle.currentBatteryPercent - batteryPercentUsed));
    } else if (vehicle.type === 'bicycle') {
      fuelL = 0;
      fuelCost = 0;
    } else {
      const mileage = vehicle.mileageKmPerL || (vehicle.type === 'bike' ? 45 : 15);
      fuelL = Number((distanceKm / mileage).toFixed(2));
      fuelCost = Math.round(fuelL * (vehicle.fuelPricePerL || 106.5));
    }

    const totalCost = fuelCost + tollCost;
    return { fuelL, fuelCost, tollCost, parkingCost, totalCost, arrivalBattery, energyKwh };
  };

  const costsA = calcCosts(distA, tollsA);
  const costsB = calcCosts(distB, tollsB);
  const costsC = calcCosts(distC, tollsC);

  const rawRouteA: Route = {
    id: 'route-a',
    name: matchedPreset ? `${matchedPreset.cityName} Expressway Corridor` : 'Expressway Corridor',
    tag: 'Fastest',
    via: 'Via Elevated Highway & Arterial Roads',
    distanceKm: distA,
    durationMin: durA,
    coordinates: coordsA,
    tollCount: tollsA.length,
    tollCost: costsA.tollCost,
    tollPlazas: tollsA,
    fuelLiters: costsA.fuelL,
    fuelCost: costsA.fuelCost,
    parkingCost: costsA.parkingCost,
    totalCost: costsA.totalCost,
    roadQualityScore: 78,
    roadHealthScore: 75,
    hazardCount: defaultHazardsA.length,
    hazards: defaultHazardsA,
    vehicleSuitability: vehicle.type === 'bicycle' ? 45 : 88,
    saarathiScore: 0,
    trafficStatus: 'moderate',
    aiReasons: [],
    waterloggingRisk: 'low',
    elevationGainM: 35,
    estimatedArrivalBatteryPercent: costsA.arrivalBattery,
    energyConsumptionKwh: costsA.energyKwh,
    isRecommended: false
  };

  const rawRouteB: Route = {
    id: 'route-b',
    name: matchedPreset ? `Saarathi Smart Line (Via Jubilee/Ring)` : 'Saarathi Smart Line',
    tag: 'Saarathi Recommended',
    via: 'Via Optimized City Mainline',
    distanceKm: distB,
    durationMin: durB,
    coordinates: coordsB,
    tollCount: tollsB.length,
    tollCost: costsB.tollCost,
    tollPlazas: tollsB,
    fuelLiters: costsB.fuelL,
    fuelCost: costsB.fuelCost,
    parkingCost: costsB.parkingCost,
    totalCost: costsB.totalCost,
    roadQualityScore: 92,
    roadHealthScore: 90,
    hazardCount: defaultHazardsB.length,
    hazards: defaultHazardsB,
    vehicleSuitability: 96,
    saarathiScore: 0,
    trafficStatus: 'light',
    aiReasons: [],
    waterloggingRisk: 'low',
    elevationGainM: 22,
    estimatedArrivalBatteryPercent: costsB.arrivalBattery,
    energyConsumptionKwh: costsB.energyKwh,
    isRecommended: true
  };

  const rawRouteC: Route = {
    id: 'route-c',
    name: 'Avenue Bypass & Scenic Link',
    tag: 'Smoothest & Toll-Free',
    via: 'Via Low-Traffic Suburban Boulevards',
    distanceKm: distC,
    durationMin: durC,
    coordinates: coordsC,
    tollCount: tollsC.length,
    tollCost: costsC.tollCost,
    tollPlazas: tollsC,
    fuelLiters: costsC.fuelL,
    fuelCost: costsC.fuelCost,
    parkingCost: costsC.parkingCost,
    totalCost: costsC.totalCost,
    roadQualityScore: 84,
    roadHealthScore: 82,
    hazardCount: defaultHazardsC.length,
    hazards: defaultHazardsC,
    vehicleSuitability: vehicle.type === 'bicycle' ? 95 : 82,
    saarathiScore: 0,
    trafficStatus: 'light',
    aiReasons: [],
    waterloggingRisk: 'low',
    elevationGainM: 18,
    estimatedArrivalBatteryPercent: costsC.arrivalBattery,
    energyConsumptionKwh: costsC.energyKwh,
    isRecommended: false
  };

  const batch = [rawRouteA, rawRouteB, rawRouteC];

  // Calculate Saarathi Score for each route
  batch.forEach(r => {
    const { score } = calculateSaarathiScore(r, mode, vehicle, batch);
    r.saarathiScore = score;
  });

  // Sort routes according to Saarathi Score (highest first)
  batch.sort((a, b) => b.saarathiScore - a.saarathiScore);

  // Mark top ranked route as recommended
  batch.forEach((r, idx) => {
    r.isRecommended = idx === 0;
    r.aiReasons = generateAiReasons(r, batch, vehicle, mode);
  });

  return batch;
}
