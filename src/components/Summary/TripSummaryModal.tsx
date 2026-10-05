import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Route, VehicleConfig } from '../../types';
import { 
  CheckCircle2, 
  X,
  RotateCcw
} from 'lucide-react';

interface TripSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route;
  vehicle: VehicleConfig;
  stats: {
    distanceKm: number;
    durationMin: number;
    totalCost: number;
    tollPaid: number;
    fuelUsedL: number;
    roadQualityScore: number;
    hazardsEncountered: number;
    roadShocksRecorded?: number;
  };
  onSaveToHistory: () => void;
  onPlanAnother: () => void;
}

export const TripSummaryModal: React.FC<TripSummaryModalProps> = ({
  isOpen,
  onClose,
  route,
  vehicle,
  stats,
  onSaveToHistory,
  onPlanAnother
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#10B981', '#F8FAFC']
      });
      onSaveToHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#121824] border border-[#222E42] rounded-2xl shadow-2xl overflow-hidden flex flex-col p-5 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center pt-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 mb-2">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white font-heading">
            Journey Completed
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {route.name} &bull; {vehicle.name}
          </p>
        </div>

        {/* Primary Metric Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center font-mono">
          <div className="p-2.5 rounded-xl bg-[#0B0F14] border border-[#222E42]">
            <span className="text-[10px] text-slate-400 block font-sans">Distance</span>
            <span className="text-base font-bold text-white">{stats.distanceKm} km</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0B0F14] border border-[#222E42]">
            <span className="text-[10px] text-slate-400 block font-sans">Time</span>
            <span className="text-base font-bold text-blue-400">{stats.durationMin}m</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0B0F14] border border-[#222E42]">
            <span className="text-[10px] text-slate-400 block font-sans">Trip Cost</span>
            <span className="text-base font-bold text-emerald-400">₹{stats.totalCost}</span>
          </div>
        </div>

        {/* Telemetry Summary */}
        <div className="mt-3 p-3 rounded-xl bg-[#0B0F14] border border-[#222E42] text-xs space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-slate-300">
            <span>Road Health Score:</span>
            <strong className="text-emerald-400">{stats.roadQualityScore}%</strong>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Hazards Navigated:</span>
            <strong className="text-slate-200">{stats.hazardsEncountered}</strong>
          </div>
          {typeof stats.roadShocksRecorded === 'number' && (
            <div className="flex items-center justify-between text-slate-300">
              <span>Road Shocks Sensed:</span>
              <strong className="text-blue-400">{stats.roadShocksRecorded} events</strong>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={onPlanAnother}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>PLAN ANOTHER TRIP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
