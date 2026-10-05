import React, { useState } from 'react';
import { Route, VehicleConfig } from '../../types';
import { 
  Clock, 
  IndianRupee, 
  ChevronDown, 
  ChevronUp, 
  Play,
  BatteryCharging,
  Check
} from 'lucide-react';

interface RouteCardProps {
  route: Route;
  isSelected: boolean;
  vehicle: VehicleConfig;
  onSelect: () => void;
  onStartJourney: () => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  isSelected,
  vehicle,
  onSelect,
  onStartJourney
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl transition-all cursor-pointer overflow-hidden border ${
        isSelected
          ? 'bg-[#182232] border-blue-500 shadow-md ring-1 ring-blue-500/30'
          : 'bg-[#121824] hover:bg-[#151D2C] border-[#222E42] text-slate-300'
      }`}
    >
      {/* Header bar: Route Name + Recommended Tag + Saarathi Score */}
      <div className="p-3.5 pb-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-sm sm:text-base text-white truncate">
                {route.name}
              </h3>
              {route.isRecommended && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Check className="w-3 h-3" />
                  Recommended
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{route.via}</p>
          </div>

          {/* Saarathi Score Badge */}
          <div className={`flex flex-col items-center justify-center px-2.5 py-1 rounded-xl border shrink-0 font-mono ${
            route.saarathiScore >= 85
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
              : route.saarathiScore >= 70
              ? 'bg-blue-950/60 border-blue-500/40 text-blue-400'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">SCORE</span>
            <span className="text-base sm:text-lg font-black leading-none">{route.saarathiScore}</span>
            <span className="text-[8px] text-slate-400">/ 100</span>
          </div>
        </div>

        {/* Primary metric chips: Duration, Distance, Total Cost, Road Quality */}
        <div className="grid grid-cols-4 gap-1.5 mt-2.5 text-center bg-[#0B0F14] p-2 rounded-xl border border-[#222E42] font-mono">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5 text-blue-400" /> Time
            </span>
            <span className="text-xs sm:text-sm font-bold text-white mt-0.5">{route.durationMin}m</span>
          </div>

          <div className="flex flex-col items-center border-l border-[#222E42]">
            <span className="text-[10px] text-slate-400">Distance</span>
            <span className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5">{route.distanceKm}km</span>
          </div>

          <div className="flex flex-col items-center border-l border-[#222E42]">
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
              <IndianRupee className="w-2.5 h-2.5 text-emerald-400" /> Cost
            </span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">₹{route.totalCost}</span>
          </div>

          <div className="flex flex-col items-center border-l border-[#222E42]">
            <span className="text-[10px] text-slate-400">Road Quality</span>
            <span className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5">{route.roadQualityScore}%</span>
          </div>
        </div>

        {/* Why Saarathi Recommends This Route */}
        {route.aiReasons.length > 0 && (
          <div className="mt-2.5 p-2.5 rounded-xl bg-[#0B0F14] border border-[#222E42] text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-blue-400 uppercase tracking-wider mb-1.5">
              <span>Why this route for your {vehicle.name}?</span>
            </div>
            <div className="space-y-1">
              {route.aiReasons.slice(0, 3).map((reason, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action / Expand bar */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#222E42]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 py-1"
          >
            <span>{isExpanded ? 'Hide Details' : 'View Breakdown'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartJourney();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>START THIS ROUTE</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Breakdown */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-2 bg-[#0B0F14] border-t border-[#222E42] text-xs space-y-2.5">
          {/* Cost Breakdown */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase text-slate-400 mb-1">
              <span>Cost Breakdown</span>
              <span className="text-slate-500 text-[9px]">{vehicle.name} Config</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center bg-[#121824] p-2 rounded-lg border border-[#222E42] font-mono text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {vehicle.type === 'ev' ? 'Energy' : 'Fuel'}
                </span>
                <span className="font-bold text-white">₹{route.fuelCost}</span>
              </div>
              <div className="border-l border-[#222E42]">
                <span className="text-slate-400 block text-[10px]">Tolls ({route.tollCount})</span>
                <span className="font-bold text-white">₹{route.tollCost}</span>
              </div>
              <div className="border-l border-[#222E42] bg-blue-950/40 rounded">
                <span className="text-blue-400 block text-[10px] font-bold">Total</span>
                <span className="font-bold text-emerald-400">₹{route.totalCost}</span>
              </div>
            </div>
          </div>

          {/* EV Specific Intelligence */}
          {vehicle.type === 'ev' && (
            <div className="p-2.5 rounded-xl bg-[#121824] border border-[#222E42]">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs uppercase mb-1">
                <BatteryCharging className="w-3.5 h-3.5" /> EV Battery Intelligence
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs mt-1 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">Current</span>
                  <span className="font-bold text-white">{vehicle.currentBatteryPercent}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Est. Arrival</span>
                  <span className={`font-bold ${(route.estimatedArrivalBatteryPercent ?? 0) < 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {route.estimatedArrivalBatteryPercent}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Energy Used</span>
                  <span className="font-bold text-slate-200">{route.energyConsumptionKwh} kWh</span>
                </div>
              </div>
            </div>
          )}

          {/* Road Conditions Details */}
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">
              Road Conditions & Hazards
            </div>
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="px-2 py-0.5 rounded bg-[#121824] border border-[#222E42] text-slate-300">
                🕳️ {route.hazards.filter(h => h.type === 'pothole').length} Potholes
              </span>
              <span className="px-2 py-0.5 rounded bg-[#121824] border border-[#222E42] text-slate-300">
                🚧 {route.hazards.filter(h => h.type === 'rough_road').length} Rough stretches
              </span>
              <span className="px-2 py-0.5 rounded bg-[#121824] border border-[#222E42] text-slate-300">
                🌊 {route.waterloggingRisk} waterlog risk
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
