import { useState, useEffect, useRef, useCallback } from 'react';
import { Coordinates, Route, VehicleConfig } from '../types';

export interface LiveRoadEvent {
  id: string;
  type: 'toll' | 'pothole' | 'rough_road' | 'waterlogging' | 'speed_breaker' | 'hazard' | 'shock';
  title: string;
  message: string;
  distanceAheadMeters: number;
  costImpact?: number;
  icon: string;
  accentColor: 'blue' | 'emerald' | 'rose' | 'amber';
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
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.5);
  const [progress, setProgress] = useState<number>(0);
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
  const [roadShockCount, setRoadShockCount] = useState<number>(0);

  // References
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);
  const triggeredEventsRef = useRef<Set<string>>(new Set());
  const rerouteTriggeredRef = useRef<boolean>(false);
  const lastShockTimeRef = useRef<number>(0);

  // Safe device motion listener for phone accelerometer
  useEffect(() => {
    if (!isPlaying) return;

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc) return;

      const z = acc.z || 0;
      const x = acc.x || 0;
      const y = acc.y || 0;
      const totalG = Math.sqrt(x * x + y * y + z * z);

      // Detect vertical shock or sharp displacement (> 14 m/s² total vector or sharp delta)
      const now = Date.now();
      if (totalG > 14.5 && now - lastShockTimeRef.current > 3500) {
        lastShockTimeRef.current = now;
        setRoadShockCount(prev => prev + 1);

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }

        setActiveAlert({
          id: `shock-${now}`,
          type: 'shock',
          title: 'Road Shock Detected',
          message: `Vertical acceleration spike (+${(totalG / 9.8).toFixed(1)}G) recorded by phone sensor.`,
          distanceAheadMeters: 0,
          icon: '📉',
          accentColor: 'amber'
        });

        setTimeout(() => setActiveAlert(null), 4000);
      }
    };

    if (typeof window !== 'undefined' && 'ondevicemotion' in window) {
      window.addEventListener('devicemotion', handleDeviceMotion, { passive: true });
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('devicemotion', handleDeviceMotion);
      }
    };
  }, [isPlaying]);

  // Reset when active route changes
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
      setRoadShockCount(0);
    }
  }, [activeRoute?.id]);

  // Main animation loop
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
    const baseJourneyDurationMs = 36000;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

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
          hazardsEncountered: activeRoute.hazardCount,
          roadShocksRecorded: roadShockCount
        });
        return;
      }

      progressRef.current = nextProgress;
      setProgress(nextProgress);

      const rawIndex = nextProgress * (totalPoints - 1);
      const lowerIndex = Math.floor(rawIndex);
      const upperIndex = Math.min(totalPoints - 1, lowerIndex + 1);
      const factor = rawIndex - lowerIndex;

      const p1 = coords[lowerIndex];
      const p2 = coords[upperIndex];

      const lat = p1[0] + (p2[0] - p1[0]) * factor;
      const lng = p1[1] + (p2[1] - p1[1]) * factor;
      setCurrentCoords([lat, lng]);

      if (lowerIndex !== upperIndex) {
        const nextBearing = calculateBearing(p1, p2);
        setBearing(nextBearing);

        const futureIndex = Math.min(totalPoints - 1, upperIndex + 2);
        const futureBearing = calculateBearing(p2, coords[futureIndex]);
        const angleDiff = Math.abs(futureBearing - nextBearing);
        if (angleDiff > 35) {
          setCurrentSpeedKmh(Math.max(22, 48 - Math.min(26, angleDiff * 0.4)));
        } else {
          setCurrentSpeedKmh(Math.min(65, 46 + Math.sin(nextProgress * Math.PI) * 14));
        }
      }

      const currentDistKm = nextProgress * activeRoute.distanceKm;

      // Toll plazas
      activeRoute.tollPlazas.forEach(toll => {
        const distDiffKm = toll.distanceAlongRouteKm - currentDistKm;
        const distDiffM = Math.round(distDiffKm * 1000);

        if (distDiffM > 0 && distDiffM <= 800 && !triggeredEventsRef.current.has(`toll-warn-${toll.id}`)) {
          triggeredEventsRef.current.add(`toll-warn-${toll.id}`);
          if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(60);
          setActiveAlert({
            id: `alert-toll-${toll.id}`,
            type: 'toll',
            title: 'Toll Plaza Ahead',
            message: `${toll.name} in ${distDiffM}m. FASTag Fee: ₹${toll.fee[vehicle.type] || 0}`,
            distanceAheadMeters: distDiffM,
            costImpact: toll.fee[vehicle.type] || 0,
            icon: '🛣️',
            accentColor: 'blue'
          });
        }

        if (distDiffKm <= 0 && !triggeredEventsRef.current.has(`toll-crossed-${toll.id}`)) {
          triggeredEventsRef.current.add(`toll-crossed-${toll.id}`);
          const fee = toll.fee[vehicle.type] || 0;
          setAccumulatedCost(prev => prev + fee);
          setPaidTollIds(prev => new Set([...prev, toll.id]));
          setActiveAlert({
            id: `alert-toll-paid-${toll.id}`,
            type: 'toll',
            title: 'Toll Paid via FASTag',
            message: `₹${fee} auto-debited at ${toll.name}`,
            distanceAheadMeters: 0,
            icon: '✅',
            accentColor: 'emerald'
          });
          setTimeout(() => setActiveAlert(null), 3500);
        }
      });

      // Hazards
      activeRoute.hazards.forEach(hazard => {
        const distDiffKm = hazard.distanceAlongRouteKm - currentDistKm;
        const distDiffM = Math.round(distDiffKm * 1000);

        if (distDiffM > 0 && distDiffM <= 500 && !triggeredEventsRef.current.has(`hz-${hazard.id}`)) {
          triggeredEventsRef.current.add(`hz-${hazard.id}`);
          if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(100);
          let icon = '⚠️';
          let title = 'Road Alert Ahead';
          if (hazard.type === 'pothole') { icon = '🕳️'; title = 'Pothole Section Ahead'; }
          else if (hazard.type === 'waterlogging') { icon = '🌊'; title = 'Waterlogged Zone Ahead'; }
          else if (hazard.type === 'rough_road') { icon = '🚧'; title = 'Rough Road Ahead'; }

          setActiveAlert({
            id: `alert-hz-${hazard.id}`,
            type: hazard.type as any,
            title,
            message: `${hazard.description} in ${distDiffM}m (${hazard.verifiedCount} drivers verified).`,
            distanceAheadMeters: distDiffM,
            icon,
            accentColor: 'rose'
          });

          setTimeout(() => setActiveAlert(null), 4500);
        }
      });

      // Dynamic Rerouting Demo
      if (nextProgress >= 0.44 && nextProgress <= 0.60 && !rerouteTriggeredRef.current) {
        rerouteTriggeredRef.current = true;
        const alternative = allRoutes.find(r => r.id !== activeRoute.id);
        if (alternative) {
          if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([80, 40, 80]);
          setDynamicReroute({
            newRouteId: alternative.id,
            title: 'Hazard Congestion Detected Ahead',
            reason: 'Cluster of rough road segments detected ahead. Saarathi recommends switching.',
            timeDiffMin: 2,
            costDiffRs: Math.max(15, Math.round(activeRoute.totalCost - alternative.totalCost)),
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
  }, [isPlaying, playbackSpeed, activeRoute, allRoutes, vehicle.type, roadShockCount]);

  const acceptReroute = useCallback(() => {
    if (!dynamicReroute) return;
    const targetRouteId = dynamicReroute.newRouteId;
    setDynamicReroute(null);
    setActiveAlert({
      id: 'reroute-success',
      type: 'rough_road',
      title: 'Rerouted to Saarathi Optimal Path',
      message: 'Route updated. Bypassing road hazards and tolls.',
      distanceAheadMeters: 0,
      icon: '🔄',
      accentColor: 'emerald'
    });
    setTimeout(() => setActiveAlert(null), 3000);
    onSwitchRoute(targetRouteId);
  }, [dynamicReroute, onSwitchRoute]);

  const dismissReroute = useCallback(() => {
    setDynamicReroute(null);
  }, []);

  const simulateOffRoute = useCallback(() => {
    if (!isPlaying || !currentCoords) return;
    setIsOffRoute(true);
    setIsRecalculating(true);
    setActiveAlert({
      id: 'off-route-alert',
      type: 'hazard',
      title: 'Off-Route Detected',
      message: 'Vehicle deviated from plan. Saarathi recalculating best corridor...',
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
        title: 'Route Recalculated',
        message: 'Reconnected with optimal path. Continuing navigation.',
        distanceAheadMeters: 0,
        icon: '✅',
        accentColor: 'emerald'
      });
      setTimeout(() => setActiveAlert(null), 2500);
    }, 2000);
  }, [isPlaying, currentCoords]);

  // Simulate Road Shock manually (for desktop demo testing)
  const simulateRoadShock = useCallback(() => {
    setRoadShockCount(prev => prev + 1);
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(100);
    setActiveAlert({
      id: `shock-sim-${Date.now()}`,
      type: 'shock',
      title: 'Road Shock Detected',
      message: 'Phone accelerometer recorded a sudden vertical bump (+1.6G).',
      distanceAheadMeters: 0,
      icon: '📉',
      accentColor: 'amber'
    });
    setTimeout(() => setActiveAlert(null), 3500);
  }, []);

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
    setRoadShockCount(0);
    if (activeRoute && activeRoute.coordinates.length > 0) {
      setCurrentCoords(activeRoute.coordinates[0]);
      if (activeRoute.coordinates.length > 1) {
        setBearing(calculateBearing(activeRoute.coordinates[0], activeRoute.coordinates[1]));
      }
    }
  }, [activeRoute]);

  const remainingDistanceKm = activeRoute
    ? Math.max(0, Number((activeRoute.distanceKm * (1 - progress)).toFixed(1)))
    : 0;

  const remainingDurationMin = activeRoute
    ? Math.max(1, Math.round(activeRoute.durationMin * (1 - progress)))
    : 0;

  const currentRunningCost = activeRoute
    ? Math.round((activeRoute.fuelCost * progress) + accumulatedCost)
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
    roadShockCount,
    remainingDistanceKm,
    remainingDurationMin,
    togglePlay,
    resetJourney,
    acceptReroute,
    dismissReroute,
    simulateOffRoute,
    simulateRoadShock
  };
}
