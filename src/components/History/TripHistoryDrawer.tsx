import React from 'react';
import { TripHistoryItem } from '../../types';
import { History, Calendar, MapPin, IndianRupee, ArrowRight, Clock, Trophy, Sparkles } from 'lucide-react';

interface TripHistoryDrawerProps {
  historyItems: TripHistoryItem[];
  onOpenTrip: (item: TripHistoryItem) => void;
}

export const TripHistoryDrawer: React.FC<TripHistoryDrawerProps> = ({
  historyItems,
  onOpenTrip
}) => {
  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-200 max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-heading">
              Your Guided Journey History
            </h2>
            <p className="text-xs text-slate-400">
              Saved telemetry, estimated toll/fuel savings, and previous route logs.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-amber-400">
          {historyItems.length} Past Trips
        </span>
      </div>

      {/* Trip List */}
      <div className="space-y-3">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/50 transition-all hover:bg-slate-950/90 text-xs space-y-2.5 group"
          >
            {/* Top row: Date & Vehicle */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{item.date}</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  {item.vehicleType}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-black">
                  ★ {item.saarathiScore}
                </span>
              </div>
            </div>

            {/* Origin to Destination */}
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="truncate">{item.originName}</span>
              <ArrowRight className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="truncate text-amber-300">{item.destinationName}</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-2 text-center font-mono text-[11px] bg-slate-900/60 p-2 rounded-xl border border-white/5">
              <div>
                <span className="text-[9px] text-slate-400 block font-sans">Distance</span>
                <span className="font-bold text-slate-200">{item.distanceKm} km</span>
              </div>
              <div className="border-l border-slate-800">
                <span className="text-[9px] text-slate-400 block font-sans">Time</span>
                <span className="font-bold text-slate-200">{item.durationMin} min</span>
              </div>
              <div className="border-l border-slate-800">
                <span className="text-[9px] text-slate-400 block font-sans">Total Cost</span>
                <span className="font-bold text-emerald-400">₹{item.totalCost}</span>
              </div>
              <div className="border-l border-slate-800 bg-emerald-500/10 rounded">
                <span className="text-[9px] text-emerald-400 block font-sans font-bold">Saved</span>
                <span className="font-black text-emerald-300">₹{item.savingsVsFastest}</span>
              </div>
            </div>

            {/* Replay / View trip button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500 truncate max-w-[280px]">
                Route: {item.routeName}
              </span>
              <button
                onClick={() => onOpenTrip(item)}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 group-hover:translate-x-0.5 transition-transform"
              >
                <span>Re-Plan Journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
