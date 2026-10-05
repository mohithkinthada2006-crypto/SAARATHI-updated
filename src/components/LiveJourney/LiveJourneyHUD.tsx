import React from 'react';
import { Route, VehicleConfig } from '../../types';
import { LiveRoadEvent, DynamicRerouteOffer } from '../../hooks/useLiveJourney';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  ArrowRight, 
  Navigation2,
  StopCircle,
  Activity
} from 'lucide-react';

interface LiveJourneyHUDProps {
  route: Route;
  vehicle: VehicleConfig;
  isPlaying: boolean;
  playbackSpeed: number;
  progress: number;
  bearing: number;
  currentSpeedKmh: number;
  followCamera: boolean;
  accumulatedCost: number;
  activeAlert: LiveRoadEvent | null;
  dynamicReroute: DynamicRerouteOffer | null;
  isOffRoute: boolean;
  isRecalculating: boolean;
  roadShockCount: number;
  remainingDistanceKm: number;
  remainingDurationMin: number;
  onTogglePlay: () => void;
  onReset: () => void;
  onSetSpeed: (speed: number) => void;
  onToggleFollowCamera: () => void;
  onAcceptReroute: () => void;
  onDismissReroute: () => void;
  onSimulateOffRoute: () => void;
  onSimulateRoadShock: () => void;
  onEndJourney: () => void;
}

export const LiveJourneyHUD: React.FC<LiveJourneyHUDProps> = ({
  route,
  vehicle,
  isPlaying,
  playbackSpeed,
  progress,
  bearing,
  currentSpeedKmh,
  followCamera,
  accumulatedCost,
  activeAlert,
  dynamicReroute,
  isOffRoute,
  isRecalculating,
  roadShockCount,
  remainingDistanceKm,
  remainingDurationMin,
  onTogglePlay,
  onReset,
  onSetSpeed,
  onToggleFollowCamera,
  onAcceptReroute,
  onDismissReroute,
  onSimulateOffRoute,
  onSimulateRoadShock,
  onEndJourney
}) => {
  return (
    <>
      {/* 1. TOP FLOATING NAVIGATION BANNER */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-xl pointer-events-auto">
        <div className="bg-[#121824]/95 backdrop-blur-md border border-[#222E42] rounded-2xl p-3 shadow-xl flex items-center justify-between gap-2.5">
          {/* Turn / Direction Icon */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <Navigation2 
                className="w-4 h-4 transition-transform duration-200" 
                style={{ transform: `rotate(${Math.round(bearing)}deg)` }}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-white truncate">
                  {route.via}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 shrink-0">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-mono truncate">
                <span>{Math.round(currentSpeedKmh)} km/h</span>
                <span>&bull;</span>
                <span className="text-slate-200">{vehicle.name}</span>
                {roadShockCount > 0 && (
                  <>
                    <span>&bull;</span>
                    <span className="text-amber-400 font-bold">{roadShockCount} Shocks</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Camera & Simulation Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onToggleFollowCamera}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                followCamera
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#182232] text-slate-400 hover:text-white border border-[#222E42]'
              }`}
              title={followCamera ? 'Lock camera' : 'Free roam'}
            >
              {followCamera ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onSimulateRoadShock}
              className="px-2 py-1.5 rounded-lg bg-[#182232] hover:bg-[#1E2B3E] border border-[#222E42] text-slate-300 hover:text-white text-[10px] font-bold transition-all flex items-center gap-1"
              title="Simulate road bump accelerometer trigger"
            >
              <Activity className="w-3 h-3 text-blue-400" />
              <span className="hidden sm:inline">Shock</span>
            </button>

            <button
              onClick={onSimulateOffRoute}
              disabled={isRecalculating}
              className="px-2 py-1.5 rounded-lg bg-[#182232] hover:bg-[#1E2B3E] border border-[#222E42] text-slate-300 hover:text-white text-[10px] font-bold transition-all"
              title="Test route deviation & recalculation"
            >
              Off-Route
            </button>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME EVENT / ROAD SHOCK ALERT */}
      {activeAlert && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md animate-in slide-in-from-top-3 duration-200 pointer-events-auto">
          <div className={`p-3 rounded-2xl backdrop-blur-md border shadow-xl flex items-center gap-2.5 ${
            activeAlert.accentColor === 'emerald'
              ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200'
              : activeAlert.accentColor === 'blue'
              ? 'bg-blue-950/90 border-blue-500/60 text-blue-200'
              : activeAlert.accentColor === 'rose'
              ? 'bg-rose-950/90 border-rose-500/60 text-rose-200'
              : 'bg-[#182232] border-blue-400 text-slate-200'
          }`}>
            <span className="text-xl shrink-0">{activeAlert.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wide">
                  {activeAlert.title}
                </span>
                {activeAlert.distanceAheadMeters > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10 font-bold">
                    in {activeAlert.distanceAheadMeters}m
                  </span>
                )}
              </div>
              <p className="text-[11px] opacity-90 mt-0.5 leading-snug">
                {activeAlert.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC REROUTING OFFER POPUP */}
      {dynamicReroute && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg animate-in zoom-in-95 duration-200 pointer-events-auto">
          <div className="p-4 rounded-2xl bg-[#121824] border-2 border-blue-500 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#222E42]">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Saarathi Dynamic Reroute</span>
              </div>
              <button
                onClick={onDismissReroute}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-2.5">
              <h4 className="font-bold text-sm text-white">{dynamicReroute.title}</h4>
              <p className="text-xs text-slate-300 mt-1">{dynamicReroute.reason}</p>
            </div>

            {/* Comparison delta pill */}
            <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-xs font-mono bg-[#0B0F14] p-2 rounded-xl border border-[#222E42]">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">ETA Impact</span>
                <span className="font-bold text-slate-200">+{dynamicReroute.timeDiffMin} min</span>
              </div>
              <div className="border-x border-[#222E42]">
                <span className="text-[10px] text-slate-400 block font-sans">Cost Savings</span>
                <span className="font-bold text-emerald-400">-₹{dynamicReroute.costDiffRs}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Hazards Avoided</span>
                <span className="font-bold text-emerald-400">-{dynamicReroute.hazardDiff}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                onClick={onDismissReroute}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Stay on Current Route
              </button>
              <button
                onClick={onAcceptReroute}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all"
              >
                <span>SWITCH ROUTE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. BOTTOM FLOATING JOURNEY DASHBOARD */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-2xl pointer-events-auto">
        <div className="bg-[#121824]/95 backdrop-blur-md border border-[#222E42] rounded-2xl p-3 shadow-xl space-y-2.5">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span className="font-bold text-slate-200 truncate">
                {route.name} &bull; <span className="text-emerald-400">{Math.round(progress * 100)}%</span>
              </span>
              <span>
                {remainingDistanceKm} km left &bull; <strong className="text-blue-400">{remainingDurationMin} min</strong>
              </span>
            </div>

            <div className="relative w-full h-2 bg-[#0B0F14] rounded-full overflow-hidden border border-[#222E42]">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-100"
                style={{ width: `${Math.max(1, Math.min(100, progress * 100))}%` }}
              />
            </div>
          </div>

          {/* Stats & Playback Controls */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            {/* Quick stats */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <div className="px-2 py-1 rounded-lg bg-[#0B0F14] border border-[#222E42] text-center">
                <span className="text-[9px] text-slate-400 block font-sans">ETA</span>
                <span className="font-bold text-blue-400 text-xs">{remainingDurationMin}m</span>
              </div>
              <div className="px-2 py-1 rounded-lg bg-[#0B0F14] border border-[#222E42] text-center">
                <span className="text-[9px] text-slate-400 block font-sans">Cost</span>
                <span className="font-bold text-emerald-400 text-xs">₹{accumulatedCost}</span>
              </div>
              <div className="px-2 py-1 rounded-lg bg-[#0B0F14] border border-[#222E42] text-center">
                <span className="text-[9px] text-slate-400 block font-sans">Road</span>
                <span className="font-bold text-slate-200 text-xs">{route.roadQualityScore}%</span>
              </div>
            </div>

            {/* Playback simulation controls */}
            <div className="flex items-center gap-1">
              <div className="flex items-center bg-[#0B0F14] p-0.5 rounded-lg border border-[#222E42] text-xs font-mono">
                {[1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => onSetSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      playbackSpeed === spd
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              <button
                onClick={onTogglePlay}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow transition-all active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                onClick={onReset}
                className="p-2 rounded-xl bg-[#182232] hover:bg-[#1E2B3E] text-slate-300 border border-[#222E42]"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={onEndJourney}
                className="px-2.5 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-bold"
                title="End Journey"
              >
                <StopCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
