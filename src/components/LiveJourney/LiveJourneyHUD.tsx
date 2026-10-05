import React from 'react';
import { Route, VehicleConfig } from '../../types';
import { LiveRoadEvent, DynamicRerouteOffer } from '../../hooks/useLiveJourney';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Compass, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  ShieldAlert, 
  FastForward, 
  ArrowRight, 
  IndianRupee, 
  CheckCircle2, 
  X,
  Gauge,
  Navigation2,
  StopCircle
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
  remainingDistanceKm: number;
  remainingDurationMin: number;
  onTogglePlay: () => void;
  onReset: () => void;
  onSetSpeed: (speed: number) => void;
  onToggleFollowCamera: () => void;
  onAcceptReroute: () => void;
  onDismissReroute: () => void;
  onSimulateOffRoute: () => void;
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
  remainingDistanceKm,
  remainingDurationMin,
  onTogglePlay,
  onReset,
  onSetSpeed,
  onToggleFollowCamera,
  onAcceptReroute,
  onDismissReroute,
  onSimulateOffRoute,
  onEndJourney
}) => {
  return (
    <>
      {/* 1. TOP FLOATING NAVIGATION BANNER */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-xl pointer-events-auto">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3">
          {/* Turn / Direction Icon */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-md">
              <Navigation2 
                className="w-5 h-5 transition-transform duration-200" 
                style={{ transform: `rotate(${Math.round(bearing)}deg)` }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  {route.via}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Speed: <strong className="text-amber-300 font-mono">{Math.round(currentSpeedKmh)} km/h</strong></span>
                <span>&bull;</span>
                <span>Heading: <strong className="text-slate-300 font-mono">{Math.round(bearing)}°</strong></span>
                <span>&bull;</span>
                <span>Vehicle: <strong className="text-white">{vehicle.name}</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Camera & Off-Route Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleFollowCamera}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                followCamera
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
              title={followCamera ? 'Camera following vehicle (Click to free roam)' : 'Free Roam Camera (Click to lock on vehicle)'}
            >
              {followCamera ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="text-[10px] hidden sm:inline">{followCamera ? 'Lock' : 'Free'}</span>
            </button>

            <button
              onClick={onSimulateOffRoute}
              disabled={isRecalculating}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-amber-300 text-[10px] font-bold transition-all"
              title="Test Saarathi route deviation and recalculation logic"
            >
              Test Off-Route
            </button>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME EVENT / HAZARD / TOLL ALERT TOAST */}
      {activeAlert && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md animate-in slide-in-from-top-4 duration-200 pointer-events-auto">
          <div className={`p-3.5 rounded-2xl backdrop-blur-xl border shadow-2xl flex items-center gap-3 ${
            activeAlert.accentColor === 'emerald'
              ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200'
              : activeAlert.accentColor === 'amber'
              ? 'bg-amber-950/90 border-amber-500/60 text-amber-200'
              : 'bg-rose-950/90 border-rose-500/60 text-rose-200'
          }`}>
            <span className="text-2xl">{activeAlert.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs uppercase tracking-wide">
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
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg animate-in zoom-in-95 duration-200 pointer-events-auto">
          <div className="p-4 rounded-3xl bg-slate-900/95 border-2 border-amber-400 shadow-2xl backdrop-blur-2xl text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 animate-bounce" />
                <span>Saarathi Dynamic Reroute Alert</span>
              </div>
              <button
                onClick={onDismissReroute}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2.5">
              <h4 className="font-bold text-sm text-white">{dynamicReroute.title}</h4>
              <p className="text-xs text-slate-300 mt-1">{dynamicReroute.reason}</p>
            </div>

            {/* Comparison delta pill */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-mono bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">ETA Impact</span>
                <span className="font-bold text-amber-300">+{dynamicReroute.timeDiffMin} min</span>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Cost Savings</span>
                <span className="font-bold text-emerald-400">-₹{dynamicReroute.costDiffRs}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Hazards Avoided</span>
                <span className="font-bold text-emerald-400">-{dynamicReroute.hazardDiff} zones</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-3.5 flex items-center justify-end gap-2">
              <button
                onClick={onDismissReroute}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Stay on Current Route
              </button>
              <button
                onClick={onAcceptReroute}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 transition-all transform hover:scale-[1.02]"
              >
                <span>SWITCH ROUTE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. OFF-ROUTE RECALCULATING NOTIFICATION */}
      {isRecalculating && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 w-80 p-3 rounded-2xl bg-amber-950/90 border border-amber-500/80 shadow-2xl backdrop-blur-xl text-center text-amber-200 animate-pulse">
          <div className="font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2">
            <Compass className="w-4 h-4 animate-spin" />
            <span>Recalculating Journey...</span>
          </div>
          <p className="text-[11px] opacity-80 mt-1">Re-evaluating road quality & active sensors</p>
        </div>
      )}

      {/* 5. BOTTOM FLOATING JOURNEY DASHBOARD PANEL */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-3xl pointer-events-auto">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl space-y-3">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5 font-sans font-bold text-slate-200">
                <span>{route.name}</span>
                <span className="text-amber-400">&bull;</span>
                <span className="text-emerald-400">{Math.round(progress * 100)}% Complete</span>
              </span>
              <span>
                Remaining: <strong className="text-white">{remainingDistanceKm} km</strong> &bull; <strong className="text-amber-400">{remainingDurationMin} min</strong>
              </span>
            </div>

            <div className="relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-100 relative"
                style={{ width: `${Math.max(1, Math.min(100, progress * 100))}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-md animate-pulse" />
              </div>
            </div>
          </div>

          {/* Metric Badges & Playback Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Real-time stats */}
            <div className="flex items-center gap-2 sm:gap-4 font-mono text-xs">
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center min-w-[70px]">
                <span className="text-[10px] text-slate-400 block font-sans">ETA</span>
                <span className="font-extrabold text-amber-400 text-sm">{remainingDurationMin} min</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center min-w-[70px]">
                <span className="text-[10px] text-slate-400 block font-sans">Distance</span>
                <span className="font-extrabold text-slate-200 text-sm">{remainingDistanceKm} km</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center min-w-[80px]">
                <span className="text-[10px] text-slate-400 block font-sans">Trip Cost</span>
                <span className="font-extrabold text-emerald-400 text-sm">₹{accumulatedCost}</span>
              </div>

              <div className="hidden md:block p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center min-w-[70px]">
                <span className="text-[10px] text-slate-400 block font-sans">Road Index</span>
                <span className="font-extrabold text-cyan-400 text-sm">{route.roadQualityScore}%</span>
              </div>
            </div>

            {/* Playback simulation controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Speed Buttons */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                {[1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => onSetSpeed(spd)}
                    className={`px-2 py-1 rounded-lg transition-colors ${
                      playbackSpeed === spd
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Play / Pause Toggle */}
              <button
                onClick={onTogglePlay}
                className={`p-3 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform active:scale-95 ${
                  isPlaying
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/40 hover:bg-slate-700'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-amber-500/30'
                }`}
                title={isPlaying ? 'Pause Journey' : 'Resume Journey'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              {/* Reset Journey */}
              <button
                onClick={onReset}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Restart from beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* End Journey Button */}
              <button
                onClick={onEndJourney}
                className="px-3.5 py-2.5 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                title="Conclude trip now"
              >
                <StopCircle className="w-4 h-4" />
                <span className="hidden sm:inline">End Journey</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
