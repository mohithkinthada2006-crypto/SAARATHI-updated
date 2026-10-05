import React, { useState } from 'react';
import { Route, VehicleConfig } from '../../types';
import { 
  Sparkles, 
  Clock, 
  IndianRupee, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Play,
  Fuel,
  BatteryCharging,
  Layers,
  Info
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

  // Score badge coloring
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-950/70 border-emerald-500/50 shadow-emerald-500/20';
    if (score >= 78) return 'text-amber-400 bg-amber-950/70 border-amber-500/50 shadow-amber-500/20';
    return 'text-slate-300 bg-slate-800 border-slate-700';
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden border ${
        isSelected
          ? 'bg-gradient-to-b from-[#181e2b] to-[#121620] border-amber-400 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/40'
          : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 text-slate-300'
      }`}
    >
      {/* Header bar: Recommended tag + Saarathi Score */}
      <div className="p-3.5 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white tracking-tight font-heading">
                {route.name}
              </h3>
              {route.isRecommended && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-sm shadow-amber-500/40">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  Saarathi Pick
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{route.via}</p>
          </div>

          {/* Saarathi Score Badge */}
          <div className={`flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl border shadow-md font-mono ${getScoreColor(route.saarathiScore)}`}>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">SCORE</span>
            <span className="text-lg font-black leading-none">{route.saarathiScore}</span>
            <span className="text-[8px] text-slate-400">/ 100</span>
          </div>
        </div>

        {/* Primary metric chips: Duration, Distance, Total Cost, Road Quality */}
        <div className="grid grid-cols-4 gap-1.5 mt-3 text-center bg-slate-950/60 p-2 rounded-xl border border-white/5 font-mono">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" /> Time
            </span>
            <span className="text-xs sm:text-sm font-bold text-white mt-0.5">{route.durationMin}m</span>
          </div>

          <div className="flex flex-col items-center border-l border-slate-800">
            <span className="text-[10px] text-slate-400">Distance</span>
            <span className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5">{route.distanceKm}km</span>
          </div>

          <div className="flex flex-col items-center border-l border-slate-800">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <IndianRupee className="w-3 h-3 text-emerald-400" /> Cost
            </span>
            <span className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">₹{route.totalCost}</span>
          </div>

          <div className="flex flex-col items-center border-l border-slate-800">
            <span className="text-[10px] text-slate-400">Road Index</span>
            <span className="text-xs sm:text-sm font-bold text-cyan-400 mt-0.5">{route.roadQualityScore}%</span>
          </div>
        </div>

        {/* Explainable AI: Why Saarathi chose this route */}
        {route.aiReasons.length > 0 && (
          <div className="mt-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" /> Why Saarathi Recommends This
            </div>
            <div className="space-y-1">
              {route.aiReasons.slice(0, 3).map((reason, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-200">
                  <span className="text-amber-400 font-bold mt-0.5">✓</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expand / Collapse toggle */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
          >
            <span>{isExpanded ? 'Hide Detailed Breakdown' : 'Show Cost & Road Intelligence'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartJourney();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>START THIS ROUTE</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Breakdown */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-2 bg-slate-950/80 border-t border-slate-800/80 text-xs space-y-3">
          {/* Detailed Cost Breakdown */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase text-slate-400 mb-1.5">
              <span>Cost Breakdown</span>
              <span className="text-slate-500 text-[9px]">Model-based &bull; User Configured</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">
                  {vehicle.type === 'ev' ? 'Energy' : 'Fuel'}
                </span>
                <span className="font-bold text-white">₹{route.fuelCost}</span>
              </div>
              <div className="border-l border-slate-800">
                <span className="text-slate-400 block text-[10px]">Tolls ({route.tollCount})</span>
                <span className="font-bold text-white">₹{route.tollCost}</span>
              </div>
              <div className="border-l border-slate-800">
                <span className="text-slate-400 block text-[10px]">Parking</span>
                <span className="font-bold text-white">₹{route.parkingCost}</span>
              </div>
              <div className="border-l border-slate-800 bg-amber-500/10 rounded">
                <span className="text-amber-400 block text-[10px] font-bold">Total</span>
                <span className="font-black text-amber-300">₹{route.totalCost}</span>
              </div>
            </div>
          </div>

          {/* EV Specific Intelligence */}
          {vehicle.type === 'ev' && (
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs uppercase mb-1">
                <BatteryCharging className="w-3.5 h-3.5" /> EV Range & Battery Intelligence
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs mt-1.5 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">Current Batt</span>
                  <span className="font-bold text-white">{vehicle.currentBatteryPercent}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Est. Arrival</span>
                  <span className="font-bold text-emerald-400">{route.estimatedArrivalBatteryPercent}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Energy Used</span>
                  <span className="font-bold text-slate-300">{route.energyConsumptionKwh} kWh</span>
                </div>
              </div>
            </div>
          )}

          {/* Road Intelligence Details */}
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-400 mb-1">
              Road Conditions & Hazards
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">
                🕳️ {route.hazards.filter(h => h.type === 'pothole').length} Potholes
              </span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">
                🚧 {route.hazards.filter(h => h.type === 'rough_road').length} Rough patches
              </span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">
                🌊 {route.waterloggingRisk} flood risk
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
