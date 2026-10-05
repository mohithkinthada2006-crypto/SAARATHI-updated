import React from 'react';
import { CrowdsourcedReport } from '../../types';
import { WeatherReport, calculateSmartDepartureTimes } from '../../services/weatherService';
import { 
  ShieldAlert, 
  ThumbsUp, 
  MapPin, 
  PlusCircle, 
  Layers, 
  Clock, 
  Calendar, 
  Sparkles,
  CloudRain,
  Waves,
  AlertTriangle
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
    parking: boolean;
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
  const { slots, recommendedSlot } = calculateSmartDepartureTimes(baseDurationMin);

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-5 text-slate-200 max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-heading">
              Road Intelligence & Sensor Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Real-time Indian road health, crowdsourced observations, and weather telemetry.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-transform active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Report Incident</span>
        </button>
      </div>

      {/* 1. Road Health Scorecard */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-[#131b2a] to-slate-950 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Regional Road Health Index
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
            Live Telemetry Vetted
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Road Health</span>
            <span className="text-lg font-black text-emerald-400">89 / 100</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Surface Quality</span>
            <span className="text-lg font-black text-amber-300">86%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Pothole Index</span>
            <span className="text-lg font-black text-cyan-400">Low (0.3/km)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Waterlogging Risk</span>
            <span className="text-lg font-black text-teal-400">Minimal</span>
          </div>
        </div>
      </div>

      {/* 2. Weather & Monsoon Advisory */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{weather.conditionIcon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{weather.city} &bull; {weather.condition}</span>
              <span className="text-xs text-amber-400 font-mono font-bold">{weather.temperatureC}°C</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Precipitation: <strong className="text-slate-300 font-mono">{weather.precipitationChance}%</strong> &bull; Humidity: <strong className="text-slate-300 font-mono">{weather.humidityPercent}%</strong> &bull; Wind: <strong className="text-slate-300 font-mono">{weather.windSpeedKmh} km/h</strong>
            </p>
            {weather.waterloggingAdvisory && (
              <p className="text-xs text-amber-300 mt-1 font-medium flex items-center gap-1">
                <span>⚠️</span> {weather.waterloggingAdvisory}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Smart Departure Time Advisor */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Smart Departure Advisor (Target 9:00 AM)</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">
            Best time: {recommendedSlot.timeStr}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
          {slots.map((slot) => (
            <div
              key={slot.timeStr}
              className={`p-2.5 rounded-xl border transition-all ${
                slot.isRecommended
                  ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="font-bold text-white text-xs">{slot.timeStr}</div>
              <div className="text-[11px] text-amber-300 mt-0.5">{slot.travelTimeMin} min</div>
              <div className="text-[9px] text-slate-400 mt-0.5">{slot.trafficLevel}</div>
              {slot.isRecommended && (
                <div className="mt-1 text-[9px] font-black uppercase text-amber-400">
                  ★ RECOMMENDED
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active Crowdsourced Road Reports Feed */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <span>Verified Crowdsourced Reports</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400 font-mono">
              {reports.length}
            </span>
          </span>
        </div>

        <div className="space-y-2">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-xl mt-0.5">
                  {report.type === 'pothole'
                    ? '🕳️'
                    : report.type === 'waterlogging'
                    ? '🌊'
                    : report.type === 'accident'
                    ? '🚨'
                    : '🚧'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{report.title}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                      report.severity === 'high'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      {report.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{report.landmark}</span>
                    <span>&bull;</span>
                    <span>{report.timestamp}</span>
                  </p>
                </div>
              </div>

              {/* Upvote / Verified badge */}
              <button
                onClick={() => onUpvoteReport(report.id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 text-xs font-semibold transition-all"
                title="Verify this road report"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="font-mono">{report.verifiedCount}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
