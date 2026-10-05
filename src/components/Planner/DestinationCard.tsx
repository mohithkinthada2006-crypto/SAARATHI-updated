import React from 'react';
import { Route, VehicleConfig } from '../../types';
import { MapPin, Navigation, Play, Clock, Milestone, Sparkles, Compass } from 'lucide-react';

interface DestinationCardProps {
  originName: string;
  destinationName: string;
  routes: Route[];
  selectedRoute: Route | null;
  vehicle: VehicleConfig;
  onPlanJourney: () => void;
  onStartJourney: () => void;
  onOpenLocationSearch: () => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  originName,
  destinationName,
  routes,
  selectedRoute,
  vehicle,
  onPlanJourney,
  onStartJourney,
  onOpenLocationSearch
}) => {
  const activeRoute = selectedRoute || routes[0];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 p-3.5 shadow-2xl relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Origin -> Destination flow */}
      <div className="space-y-2 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Origin</div>
            <div className="text-xs font-semibold text-slate-200 truncate">{originName}</div>
          </div>
        </div>

        {/* Vertical connector line */}
        <div className="ml-1 w-0.5 h-3 bg-gradient-to-b from-emerald-500 to-amber-500 opacity-60" />

        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-500/20" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Destination</div>
            <div className="text-sm font-bold text-white truncate">{destinationName}</div>
          </div>
          <button
            onClick={onOpenLocationSearch}
            className="text-[11px] font-medium text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
          >
            Change
          </button>
        </div>
      </div>

      {/* Quick Route Preview Metrics if routes exist */}
      {activeRoute && (
        <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center bg-slate-950/40 rounded-xl p-2 border border-white/5">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Distance</div>
            <div className="text-sm font-extrabold text-white font-mono">{activeRoute.distanceKm} km</div>
          </div>
          <div className="border-x border-slate-800">
            <div className="text-[10px] text-slate-400 font-medium">Estimated Time</div>
            <div className="text-sm font-extrabold text-amber-400 font-mono">{activeRoute.durationMin} min</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Available Routes</div>
            <div className="text-sm font-extrabold text-emerald-400 font-mono">{routes.length} Alternatives</div>
          </div>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={onPlanJourney}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold transition-all duration-200 hover:border-slate-500"
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span>PLAN JOURNEY</span>
        </button>

        <button
          onClick={onStartJourney}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black tracking-wide shadow-lg shadow-amber-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>START JOURNEY</span>
        </button>
      </div>

      <div className="mt-2 text-center">
        <span className="text-[10px] text-slate-500">
          💡 Click anywhere on the map to drop a new destination marker
        </span>
      </div>
    </div>
  );
};
