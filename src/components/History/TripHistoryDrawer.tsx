import React from 'react';
import { TripHistoryItem } from '../../types';
import { History, Calendar, ArrowRight } from 'lucide-react';

interface TripHistoryDrawerProps {
  historyItems: TripHistoryItem[];
  onOpenTrip: (item: TripHistoryItem) => void;
}

export const TripHistoryDrawer: React.FC<TripHistoryDrawerProps> = ({
  historyItems,
  onOpenTrip
}) => {
  return (
    <div className="bg-[#121824] border border-[#222E42] rounded-2xl p-4 shadow-xl space-y-3 text-slate-200 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#222E42]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-heading">
              Trip History & Savings
            </h2>
            <p className="text-[11px] text-slate-400">
              Completed journeys and toll/pothole savings logs
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-blue-400">
          {historyItems.length} Trips
        </span>
      </div>

      {/* Trip List */}
      <div className="space-y-2.5">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-[#0B0F14] border border-[#222E42] text-xs space-y-2"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                <Calendar className="w-3 h-3 text-blue-400" />
                <span>{item.date}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-[#182232] text-[9px] font-bold uppercase text-slate-300">
                  {item.vehicleType}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[9px] font-mono font-bold">
                  Score {item.saarathiScore}
                </span>
              </div>
            </div>

            {/* Origin -> Destination */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <span className="truncate">{item.originName}</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate text-slate-200">{item.destinationName}</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px] bg-[#121824] p-1.5 rounded-lg border border-[#222E42]">
              <div>
                <span className="text-[9px] text-slate-400 block font-sans">Distance</span>
                <span className="font-bold text-slate-200">{item.distanceKm} km</span>
              </div>
              <div className="border-l border-[#222E42]">
                <span className="text-[9px] text-slate-400 block font-sans">Time</span>
                <span className="font-bold text-slate-200">{item.durationMin}m</span>
              </div>
              <div className="border-l border-[#222E42]">
                <span className="text-[9px] text-slate-400 block font-sans">Cost</span>
                <span className="font-bold text-emerald-400">₹{item.totalCost}</span>
              </div>
              <div className="border-l border-[#222E42]">
                <span className="text-[9px] text-slate-400 block font-sans">Saved</span>
                <span className="font-bold text-emerald-400">₹{item.savingsVsFastest}</span>
              </div>
            </div>

            {/* Replay button */}
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
                {item.routeName}
              </span>
              <button
                onClick={() => onOpenTrip(item)}
                className="flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300"
              >
                <span>Re-Plan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
