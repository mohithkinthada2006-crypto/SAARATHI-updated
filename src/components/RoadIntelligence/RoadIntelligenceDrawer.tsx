import React from 'react';
import { CrowdsourcedReport } from '../../types';
import { WeatherReport, calculateSmartDepartureTimes } from '../../services/weatherService';
import { 
  ShieldAlert, 
  ThumbsUp, 
  PlusCircle, 
  Clock
} from 'lucide-react';

interface RoadIntelligenceDrawerProps {
  reports: CrowdsourcedReport[];
  onUpvoteReport: (id: string) => void;
  onOpenReportModal: () => void;
  weather: WeatherReport;
  visibleLayers: {
    potholes: boolean;
    hazards: boolean;
    waterlogging: boolean;
    tolls: boolean;
    charging: boolean;
  };
  onToggleLayer: (layer: keyof RoadIntelligenceDrawerProps['visibleLayers']) => void;
  baseDurationMin: number;
}

export const RoadIntelligenceDrawer: React.FC<RoadIntelligenceDrawerProps> = ({
  reports,
  onUpvoteReport,
  onOpenReportModal,
  weather,
  visibleLayers,
  onToggleLayer,
  baseDurationMin
}) => {
  const { slots } = calculateSmartDepartureTimes(baseDurationMin);

  return (
    <div className="bg-[#121824] border border-[#222E42] rounded-2xl p-4 shadow-xl space-y-4 text-slate-200 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#222E42]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-heading">
              Road Conditions & Hazard Matrix
            </h2>
            <p className="text-[11px] text-slate-400">
              Community hazard reports and road quality telemetry
            </p>
          </div>
        </div>

        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Report Hazard</span>
        </button>
      </div>

      {/* Road Health Scorecard */}
      <div className="p-3 rounded-xl bg-[#0B0F14] border border-[#222E42]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Corridor Health Status
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 font-bold">
            Vetted
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
          <div className="p-2 rounded-lg bg-[#121824] border border-[#222E42]">
            <span className="text-[9px] text-slate-400 block font-sans">Health Score</span>
            <span className="text-sm font-bold text-emerald-400">89 / 100</span>
          </div>

          <div className="p-2 rounded-lg bg-[#121824] border border-[#222E42]">
            <span className="text-[9px] text-slate-400 block font-sans">Surface Quality</span>
            <span className="text-sm font-bold text-blue-400">86%</span>
          </div>

          <div className="p-2 rounded-lg bg-[#121824] border border-[#222E42]">
            <span className="text-[9px] text-slate-400 block font-sans">Waterlog Risk</span>
            <span className="text-sm font-bold text-slate-200">{weather.waterloggingAdvisory ? 'High' : weather.precipitationChance > 50 ? 'Moderate' : 'Low'}</span>
          </div>
        </div>
      </div>

      {/* Smart Departure Times */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>Optimal Departure Windows</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {slots.slice(0, 3).map((slot, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg border text-center font-mono ${
                slot.isRecommended
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-[#0B0F14] border-[#222E42] text-slate-400'
              }`}
            >
              <div className="text-[10px] font-bold font-sans">{slot.trafficLevel}</div>
              <div className="text-xs font-bold mt-0.5">{slot.timeStr}</div>
              <div className="text-[9px] text-slate-400 mt-0.5">{slot.travelTimeMin} mins</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Crowd Reports */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase text-slate-400">
          Recent Driver Reports ({reports.length})
        </div>

        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
          {reports.map((r) => (
            <div
              key={r.id}
              className="p-2.5 rounded-xl bg-[#0B0F14] border border-[#222E42] text-xs flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="font-bold text-white truncate">{r.title}</div>
                <div className="text-[10px] text-slate-400 truncate">{r.landmark} &bull; {r.timestamp}</div>
              </div>

              <button
                onClick={() => onUpvoteReport(r.id)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#182232] hover:bg-[#1E2B3E] border border-[#222E42] text-slate-300 hover:text-white text-[10px] font-bold shrink-0"
              >
                <ThumbsUp className="w-3 h-3 text-blue-400" />
                <span>{r.verifiedCount}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
