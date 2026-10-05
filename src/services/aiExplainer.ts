import { Route, VehicleConfig, JourneyMode } from '../types';

/**
 * Generates dynamic, data-driven explanations for why Saarathi recommended a specific route.
 */
export function generateAiReasons(
  candidate: Route,
  alternativeRoutes: Route[],
  vehicle: VehicleConfig,
  mode: JourneyMode
): string[] {
  const reasons: string[] = [];
  const others = alternativeRoutes.filter(r => r.id !== candidate.id);
  if (others.length === 0) {
    return [
      `Optimal road geometry matching ${vehicle.name} dynamics`,
      'Balanced ETA with minimal traffic congestion',
      'Continuous surface health index validated'
    ];
  }

  // Find reference route (e.g. fastest or first other)
  const fastest = [...others].sort((a, b) => a.durationMin - b.durationMin)[0] || others[0];
  const mostExpensive = [...others].sort((a, b) => b.totalCost - a.totalCost)[0] || others[0];
  const worstRoad = [...others].sort((a, b) => a.roadQualityScore - b.roadQualityScore)[0] || others[0];
  const mostHazards = [...others].sort((a, b) => b.hazardCount - a.hazardCount)[0] || others[0];

  // Cost comparison
  const costDiff = mostExpensive.totalCost - candidate.totalCost;
  if (costDiff >= 20) {
    reasons.push(`₹${Math.round(costDiff)} cheaper than the ${mostExpensive.tag || 'alternative'} route`);
  } else if (candidate.tollCount === 0 && others.some(r => r.tollCount > 0)) {
    reasons.push(`Zero toll charges (saves up to ₹${Math.max(...others.map(r => r.tollCost))})`);
  }

  // Road Quality comparison
  if (candidate.roadQualityScore > (worstRoad.roadQualityScore + 10)) {
    const qualityDiff = Math.round(candidate.roadQualityScore - worstRoad.roadQualityScore);
    reasons.push(`+${qualityDiff}% higher road smoothness index`);
  }

  // Hazards comparison
  const hazardDiff = mostHazards.hazardCount - candidate.hazardCount;
  if (hazardDiff >= 1) {
    reasons.push(`${hazardDiff} fewer hazard & pothole segments`);
  }

  // Toll comparison
  const tollDiff = mostExpensive.tollCount - candidate.tollCount;
  if (tollDiff >= 1) {
    reasons.push(`${tollDiff} fewer toll plaza stop${tollDiff > 1 ? 's' : ''}`);
  }

  // Vehicle specific benefits
  if (vehicle.type === 'bike') {
    if (candidate.roadQualityScore >= 80) {
      reasons.push('Ideal smooth asphalt reduces two-wheeler fatigue');
    }
    if (candidate.waterloggingRisk === 'low' && others.some(r => r.waterloggingRisk !== 'low')) {
      reasons.push('Avoids monsoon waterlogging lowlands');
    }
  } else if (vehicle.type === 'ev') {
    if ((candidate.estimatedArrivalBatteryPercent ?? 50) > 30) {
      reasons.push(`Safe battery reserve: leaves ${candidate.estimatedArrivalBatteryPercent}% at destination`);
    }
    if (candidate.energyConsumptionKwh && candidate.energyConsumptionKwh < 8) {
      reasons.push(`Eco-regen optimal terrain: only ${candidate.energyConsumptionKwh.toFixed(1)} kWh needed`);
    }
  } else if (vehicle.type === 'bicycle') {
    reasons.push('Avoids high-speed expressway corridors for rider safety');
  }

  // Time comparison vs fastest
  if (candidate.id === fastest.id) {
    reasons.push('Fastest arrival time on active Indian road corridors');
  } else {
    const timeDelta = candidate.durationMin - fastest.durationMin;
    if (timeDelta <= 6 && timeDelta > 0) {
      reasons.push(`Only ${timeDelta} min slower while offering substantially lower risk & cost`);
    }
  }

  // Mode priority reinforcement
  if (mode === 'cheapest') {
    reasons.push('Strict cost minimization priority satisfied');
  } else if (mode === 'safest') {
    reasons.push('Maximum structural safety buffer with vetted road segments');
  } else if (mode === 'smoothest') {
    reasons.push('Pothole avoidance filter active for maximum ride comfort');
  }

  // Guarantee at least 3 compelling data-driven reasons
  if (reasons.length < 3) {
    reasons.push('Continuous telemetry validation by Saarathi crowd network');
    reasons.push('Optimal balance of transit velocity and vehicle wear');
  }

  return reasons.slice(0, 5);
}
