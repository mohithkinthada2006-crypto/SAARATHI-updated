import React from 'react';
import { Route, VehicleConfig } from '../../types';
import { Play, MapPin, Search } from 'lucide-react';

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
    <div className="bg-[#121824] rounded-2xl border border-[#222E42] p-3 shadow-lg">
      {/* Origin -> Destination row */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Location</div>
            <div className="text-xs font-semibold text-slate-200 truncate">{originName}</div>
          </div>
        </div>

        {/* Vertical connector */}
        <div className="ml-1 w-px h-2.5 bg-[#222E42]" />

        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destination</div>
            <div className="text-xs sm:text-sm font-bold text-white truncate">{destinationName}</div>
          </div>
          <button
            onClick={onOpenLocationSearch}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 py-1 px-2 rounded-lg bg-[#182232] border border-[#222E42] transition-colors shrink-0"
          >
            <Search className="w-3 h-3" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Bar */}
      {activeRoute && (
        <div className="mt-2.5 pt-2 border-t border-[#222E42] grid grid-cols-3 gap-1.5 text-center bg-[#0B0F14] rounded-xl p-1.5 border border-[#222E42] font-mono">
          <div>
            <div className="text-[9px] text-slate-400">Distance</div>
            <div className="text-xs font-bold text-slate-200">{activeRoute.distanceKm} km</div>
          </div>
          <div className="border-x border-[#222E42]">
            <div className="text-[9px] text-slate-400">Estimated Time</div>
            <div className="text-xs font-bold text-blue-400">{activeRoute.durationMin} min</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400">Evaluated</div>
            <div className="text-xs font-bold text-emerald-400">{routes.length} Routes</div>
          </div>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="mt-2.5">
        <button
          onClick={onStartJourney}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold tracking-wide shadow-md transition-all active:scale-[0.98]"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>START SMART JOURNEY</span>
        </button>
      </div>
    </div>
  );
};
