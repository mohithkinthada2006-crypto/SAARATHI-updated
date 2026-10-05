import { useState, useEffect, useRef, useCallback } from 'react';
import { Coordinates, Route, TollPlaza, RoadHazard, VehicleConfig } from '../types';
import { haversineDistanceKm } from '../services/routingService';

export interface LiveRoadEvent {
  id: string;
  type: 'toll' | 'pothole' | 'rough_road' | 'waterlogging' | 'speed_breaker' | 'parking' | 'hazard';
  title: string;
  message: string;
  distanceAheadMeters: number;
  costImpact?: number;
  icon: string;
  accentColor: string;
}

export interface DynamicRerouteOffer {
  newRouteId: string;
  title: string;
  reason: string;
  timeDiffMin: number;
  costDiffRs: number;
  hazardDiff: number;
}

export function calculateBearing(coord1: Coordinates, coord2: Coordinates): number {
  const lat1 = (coord1[0] * Math.PI) / 180;
  const lat2 = (coord2[0] * Math.PI) / 180;
  const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

export function useLiveJourney(
  activeRoute: Route | null,
  vehicle: VehicleConfig,
  allRoutes: Route[],
  onSwitchRoute: (newRouteId: string) => void,
  onJourneyCompleted: (completedStats: any) => void
) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.5); // 1x, 2x, 4x
  const [progress, setProgress] = useState<number>(0); // 0.0 to 1.0
  const [currentCoords, setCurrentCoords] = useState<Coordinates | null>(null);
  const [bearing, setBearing] = useState<number>(0);
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState<number>(45);
  const [followCamera, setFollowCamera] = useState<boolean>(true);
  
  // Real-time accumulating cost & paid tolls
  const [accumulatedCost, setAccumulatedCost] = useState<number>(0);
  const [paidTollIds, setPaidTollIds] = useState<Set<string>>(new Set());

  // Alerts & road events
  const [activeAlert, setActiveAlert] = useState<LiveRoadEvent | null>(null);
  const [dynamicReroute, setDynamicReroute] = useState<DynamicRerouteOffer | null>(null);
  const [isOffRoute, setIsOffRoute] = useState<boolean>(false);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  // References for requestAnimationFrame loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);
  const triggeredEventsRef = useRef<Set<string>>(new Set());
  const rerouteTriggeredRef = useRef<boolean>(false);

  // Initialize or reset when route changes
  useEffect(() => {
    if (activeRoute && activeRoute.coordinates.length > 0) {
      setCurrentCoords(activeRoute.coordinates[0]);
      if (activeRoute.coordinates.length > 1) {
        setBearing(calculateBearing(activeRoute.coordinates[0], activeRoute.coordinates[1]));
      }
      setAccumulatedCost(0);
      setPaidTollIds(new Set());
      setProgress(0);
      progressRef.current = 0;
      triggeredEventsRef.current = new Set();
      rerouteTriggeredRef.current = false;
      setActiveAlert(null);
      setDynamicReroute(null);
      setIsOffRoute(false);
      setIsRecalculating(false);
    }
  }, [activeRoute?.id]);

  // Main high-precision animation loop
  useEffect(() => {
    if (!isPlaying || !activeRoute || activeRoute.coordinates.length < 2) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    const coords = activeRoute.coordinates;
    const totalPoints = coords.length;
    // Base duration for journey simulation: ~40 seconds at 1x speed
    const baseJourneyDurationMs = 38000;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Increment progress
      const progressDelta = (deltaTime / baseJourneyDurationMs) * playbackSpeed;
      let nextProgress = progressRef.current + progressDelta;

      if (nextProgress >= 1) {
        nextProgress = 1;
        progressRef.current = 1;
        setProgress(1);
        setCurrentCoords(coords[totalPoints - 1]);
        setIsPlaying(false);
        onJourneyCompleted({
          distanceKm: activeRoute.distanceKm,
          durationMin: activeRoute.durationMin,
          totalCost: activeRoute.totalCost,
          tollPaid: activeRoute.tollCost,
          fuelUsedL: activeRoute.fuelLiters,
          roadQualityScore: activeRoute.roadQualityScore,
          hazardsEncountered: activeRoute.hazardCount
        });
        return;
      }

      progressRef.current = nextProgress;
      setProgress(nextProgress);

      // Interpolate along coordinates array
      const rawIndex = nextProgress * (totalPoints - 1);
      const lowerIndex = Math.floor(rawIndex);
      const upperIndex = Math.min(totalPoints - 1, lowerIndex + 1);
      const factor = rawIndex - lowerIndex;

      const p1 = coords[lowerIndex];
      const p2 = coords[upperIndex];

      const lat = p1[0] + (p2[0] - p1[0]) * factor;
      const lng = p1[1] + (p2[1] - p1[1]) * factor;
      const interpolatedPos: Coordinates = [lat, lng];

      setCurrentCoords(interpolatedPos);

      // Calculate bearing angle
      if (lowerIndex !== upperIndex) {
        const nextBearing = calculateBearing(p1, p2);
        setBearing(nextBearing);

        // Turn anticipation: if angle change is large, simulate slowing down
        const futureIndex = Math.min(totalPoints - 1, upperIndex + 2);
        const futureBearing = calculateBearing(p2, coords[futureIndex]);
        const angleDiff = Math.abs(futureBearing - nextBearing);
        if (angleDiff > 35) {
          setCurrentSpeedKmh(Math.max(22, 50 - Math.min(28, angleDiff * 0.4)));
        } else {
          setCurrentSpeedKmh(Math.min(68, 48 + Math.sin(nextProgress * Math.PI) * 15));
        }
      }

      // Check Road Events & Tolls along the path
      const currentDistKm = nextProgress * activeRoute.distanceKm;

      // 1. Toll Plazas
      activeRoute.tollPlazas.forEach(toll => {
        const distDiffKm = toll.distanceAlongRouteKm - currentDistKm;
        const distDiffM = Math.round(distDiffKm * 1000);

        if (distDiffM > 0 && distDiffM <= 900 && !triggeredEventsRef.current.has(`toll-warn-${toll.id}`)) {
          triggeredEventsRef.current.add(`toll-warn-${toll.id}`);
          setActiveAlert({
            id: `alert-toll-${toll.id}`,
            type: 'toll',
            title: 'Toll Plaza Ahead',
            message: `${toll.name} in ${distDiffM}m. Fee: ₹${toll.fee[vehicle.type] || 0}`,
            distanceAheadMeters: distDiffM,
            costImpact: toll.fee[vehicle.type] || 0,
            icon: '🛣️',
            accentColor: 'amber'
          });
        }

        // Crossed toll
        if (distDiffKm <= 0 && !triggeredEventsRef.current.has(`toll-crossed-${toll.id}`)) {
          triggeredEventsRef.current.add(`toll-crossed-${toll.id}`);
          const fee = toll.fee[vehicle.type] || 0;
          setAccumulatedCost(prev => prev + fee);
          setPaidTollIds(prev => new Set([...prev, toll.id]));
          setActiveAlert({
            id: `alert-toll-paid-${toll.id}`,
            type: 'toll',
            title: 'Toll Paid via FASTag',
            message: `₹${fee} deducted automatically at ${toll.name}`,
            distanceAheadMeters: 0,
            icon: '✅',
            accentColor: 'emerald'
          });
          setTimeout(() => setActiveAlert(null), 4000);
        }
      });

      // 2. Road Hazards
      activeRoute.hazards.forEach(hazard => {
        const distDiffKm = hazard.distanceAlongRouteKm - currentDistKm;
        const distDiffM = Math.round(distDiffKm * 1000);

        if (distDiffM > 0 && distDiffM <= 600 && !triggeredEventsRef.current.has(`hz-${hazard.id}`)) {
          triggeredEventsRef.current.add(`hz-${hazard.id}`);
          let icon = '⚠️';
          let title = 'Road Alert Ahead';
          if (hazard.type === 'pothole') { icon = '🕳️'; title = 'Pothole Zone Ahead'; }
          else if (hazard.type === 'waterlogging') { icon = '🌊'; title = 'Waterlogged Segment Ahead'; }
          else if (hazard.type === 'rough_road') { icon = '🚧'; title = 'Rough Road Ahead'; }
          else if (hazard.type === 'speed_breaker') { icon = '⚠️'; title = 'Speed Breakers Ahead'; }

          setActiveAlert({
            id: `alert-hz-${hazard.id}`,
            type: hazard.type as any,
            title,
            message: `${hazard.description} in ${distDiffM}m. Verified by ${hazard.verifiedCount} drivers.`,
            distanceAheadMeters: distDiffM,
            icon,
            accentColor: 'rose'
          });

          setTimeout(() => setActiveAlert(null), 5000);
        }
      });

      // 3. Dynamic Rerouting Event: Triggered at ~45% progress to demonstrate live Saarathi intelligence!
      if (nextProgress >= 0.42 && nextProgress <= 0.65 && !rerouteTriggeredRef.current) {
        rerouteTriggeredRef.current = true;
        const alternative = allRoutes.find(r => r.id !== activeRoute.id);
        if (alternative) {
          setDynamicReroute({
            newRouteId: alternative.id,
            title: 'Traffic & Bottleneck Detected Ahead',
            reason: 'Heavy congestion & pothole cluster observed on current stretch. Saarathi recommends immediate bypass.',
            timeDiffMin: 3,
            costDiffRs: Math.max(20, Math.round(activeRoute.totalCost - alternative.totalCost)),
            hazardDiff: 2
          });
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, activeRoute, allRoutes, vehicle.type]);

  // Handle switching to alternative route dynamically
  const acceptReroute = useCallback(() => {
    if (!dynamicReroute) return;
    const targetRouteId = dynamicReroute.newRouteId;
    setDynamicReroute(null);
    setActiveAlert({
      id: 'reroute-success',
      type: 'rough_road',
      title: 'Rerouted to Saarathi Smart Path',
      message: 'Route smoothly updated. Saved toll and reduced pothole exposure.',
      distanceAheadMeters: 0,
      icon: '🔄',
      accentColor: 'emerald'
    });
    setTimeout(() => setActiveAlert(null), 3500);
    onSwitchRoute(targetRouteId);
  }, [dynamicReroute, onSwitchRoute]);

  const dismissReroute = useCallback(() => {
    setDynamicReroute(null);
  }, []);

  // Simulate off-route deviation & recalculation
  const simulateOffRoute = useCallback(() => {
    if (!isPlaying || !currentCoords) return;
    setIsOffRoute(true);
    setIsRecalculating(true);
    setActiveAlert({
      id: 'off-route-alert',
      type: 'hazard',
      title: 'Off-Route Detected',
      message: 'Vehicle departed planned corridor. Saarathi AI recalculating optimal path...',
      distanceAheadMeters: 0,
      icon: '⚠️',
      accentColor: 'rose'
    });

    setTimeout(() => {
      setIsRecalculating(false);
      setIsOffRoute(false);
      setActiveAlert({
        id: 'recalculated-alert',
        type: 'rough_road',
        title: 'New Path Acquired',
        message: 'Reconnected with optimal route. Continuing guided navigation.',
        distanceAheadMeters: 0,
        icon: '✅',
        accentColor: 'emerald'
      });
      setTimeout(() => setActiveAlert(null), 3000);
    }, 2200);
  }, [isPlaying, currentCoords]);

  // Play / Pause / Reset handlers
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const resetJourney = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
    progressRef.current = 0;
    triggeredEventsRef.current = new Set();
    rerouteTriggeredRef.current = false;
    setActiveAlert(null);
    setDynamicReroute(null);
    setIsOffRoute(false);
    setIsRecalculating(false);
    if (activeRoute && activeRoute.coordinates.length > 0) {
      setCurrentCoords(activeRoute.coordinates[0]);
      if (activeRoute.coordinates.length > 1) {
        setBearing(calculateBearing(activeRoute.coordinates[0], activeRoute.coordinates[1]));
      }
    }
  }, [activeRoute]);

  const jumpToProgress = useCallback((newProgress: number) => {
    progressRef.current = Math.max(0, Math.min(1, newProgress));
    setProgress(progressRef.current);
    if (activeRoute && activeRoute.coordinates.length > 1) {
      const idx = Math.floor(progressRef.current * (activeRoute.coordinates.length - 1));
      setCurrentCoords(activeRoute.coordinates[idx]);
    }
  }, [activeRoute]);

  // Derived stats
  const remainingDistanceKm = activeRoute
    ? Math.max(0, Number((activeRoute.distanceKm * (1 - progress)).toFixed(1)))
    : 0;

  const remainingDurationMin = activeRoute
    ? Math.max(1, Math.round(activeRoute.durationMin * (1 - progress)))
    : 0;

  // Running total cost includes base fuel so far + paid tolls
  const currentRunningCost = activeRoute
    ? Math.round((activeRoute.fuelCost * progress) + accumulatedCost + (progress > 0.9 ? activeRoute.parkingCost : 0))
    : 0;

  return {
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    progress,
    currentCoords,
    bearing,
    currentSpeedKmh,
    followCamera,
    setFollowCamera,
    accumulatedCost: currentRunningCost,
    activeAlert,
    dynamicReroute,
    isOffRoute,
    isRecalculating,
    remainingDistanceKm,
    remainingDurationMin,
    togglePlay,
    resetJourney,
    jumpToProgress,
    acceptReroute,
    dismissReroute,
    simulateOffRoute
  };
}
