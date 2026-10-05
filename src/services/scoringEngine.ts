import { JourneyMode, Route, VehicleConfig } from '../types';

export interface ScoreWeights {
  time: number;
  cost: number;
  roadQuality: number;
  safety: number;
  vehicleCompatibility: number;
  traffic: number;
  efficiency: number;
}

export const MODE_WEIGHTS: Record<JourneyMode, ScoreWeights> = {
  balanced: {
    time: 0.22,
    cost: 0.20,
    roadQuality: 0.18,
    safety: 0.16,
    vehicleCompatibility: 0.10,
    traffic: 0.08,
    efficiency: 0.06
  },
  fastest: {
    time: 0.45,
    cost: 0.08,
    roadQuality: 0.10,
    safety: 0.10,
    vehicleCompatibility: 0.07,
    traffic: 0.15,
    efficiency: 0.05
  },
  cheapest: {
    time: 0.10,
    cost: 0.48,
    roadQuality: 0.12,
    safety: 0.10,
    vehicleCompatibility: 0.08,
    traffic: 0.05,
    efficiency: 0.07
  },
  safest: {
    time: 0.08,
    cost: 0.10,
    roadQuality: 0.24,
    safety: 0.40,
    vehicleCompatibility: 0.10,
    traffic: 0.05,
    efficiency: 0.03
  },
  smoothest: {
    time: 0.12,
    cost: 0.08,
    roadQuality: 0.48,
    safety: 0.18,
    vehicleCompatibility: 0.08,
    traffic: 0.04,
    efficiency: 0.02
  }
};

/**
 * Calculates a deterministic Saarathi Journey Score (0 - 100)
 */
export function calculateSaarathiScore(
  route: Partial<Route>,
  mode: JourneyMode,
  vehicle: VehicleConfig,
  allRoutesInBatch: Partial<Route>[] = []
): { score: number; breakdown: Record<string, number> } {
  const weights = MODE_WEIGHTS[mode];

  // Benchmark minimums and maximums across routes for normalization
  const times = allRoutesInBatch.map(r => r.durationMin || 30);
  const costs = allRoutesInBatch.map(r => r.totalCost || 100);
  
  const minTime = Math.min(...times, route.durationMin || 30);
  const maxTime = Math.max(...times, (route.durationMin || 30) * 1.5);
  
  const minCost = Math.min(...costs, route.totalCost || 50);
  const maxCost = Math.max(...costs, (route.totalCost || 50) * 1.5);

  // Time subscore (100 is best/fastest)
  const timeSpread = Math.max(1, maxTime - minTime);
  const timeScore = Math.max(20, Math.min(100, 100 - (((route.durationMin || 30) - minTime) / timeSpread) * 80));

  // Cost subscore (100 is cheapest)
  const costSpread = Math.max(1, maxCost - minCost);
  const costScore = Math.max(20, Math.min(100, 100 - (((route.totalCost || 0) - minCost) / costSpread) * 80));

  // Road Quality subscore (direct 0-100)
  const roadQualityScore = route.roadQualityScore || 75;

  // Safety subscore (based on hazards count and waterlogging risk)
  let safetyScore = 95 - (route.hazardCount || 0) * 9;
  if (route.waterloggingRisk === 'high') safetyScore -= 25;
  if (route.waterloggingRisk === 'moderate') safetyScore -= 12;
  safetyScore = Math.max(15, Math.min(100, safetyScore));

  // Vehicle Compatibility subscore
  let vehicleCompat = 85;
  if (vehicle.type === 'bicycle') {
    if ((route.distanceKm || 0) > vehicle.maxComfortDistanceKm) vehicleCompat -= 30;
    if (roadQualityScore < 70) vehicleCompat -= 20;
    if ((route.tollCount || 0) > 0) vehicleCompat += 10; // usually bikes/bicycles can bypass or avoid tolls easily
  } else if (vehicle.type === 'bike') {
    // Bikes hate potholes and wet roads
    if ((route.hazardCount || 0) > 3) vehicleCompat -= 15;
    if (roadQualityScore > 85) vehicleCompat += 10;
  } else if (vehicle.type === 'ev') {
    // EV battery check
    const arrivalBatt = route.estimatedArrivalBatteryPercent ?? 50;
    if (arrivalBatt < 20) vehicleCompat -= 35;
    else if (arrivalBatt < 35) vehicleCompat -= 15;
    else vehicleCompat += 10;
  }
  vehicleCompat = Math.max(20, Math.min(100, vehicleCompat));

  // Traffic score
  const trafficScore = route.trafficStatus === 'light' ? 95 : route.trafficStatus === 'moderate' ? 70 : 40;

  // Efficiency score
  const efficiencyScore = route.distanceKm && route.fuelLiters
    ? Math.min(100, Math.max(30, 100 - ((route.distanceKm * 0.8) / 10)))
    : 80;

  // Final weighted aggregate
  const rawScore = 
    timeScore * weights.time +
    costScore * weights.cost +
    roadQualityScore * weights.roadQuality +
    safetyScore * weights.safety +
    vehicleCompat * weights.vehicleCompatibility +
    trafficScore * weights.traffic +
    efficiencyScore * weights.efficiency;

  const finalScore = Math.round(Math.max(10, Math.min(99, rawScore)));

  return {
    score: finalScore,
    breakdown: {
      time: Math.round(timeScore),
      cost: Math.round(costScore),
      roadQuality: Math.round(roadQualityScore),
      safety: Math.round(safetyScore),
      vehicleCompat: Math.round(vehicleCompat),
      traffic: Math.round(trafficScore),
      efficiency: Math.round(efficiencyScore)
    }
  };
}
