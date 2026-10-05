import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Route, VehicleConfig } from '../../types';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Milestone, 
  ShieldCheck, 
  Star, 
  X,
  Share2,
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
  const [rating, setRating] = useState<number>(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger festive confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899']
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const estimatedSavings = Math.max(45, Math.round(route.totalCost * 0.35));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 text-slate-100 glass-panel-gold">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebratory Icon & Heading */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/30 mb-3 animate-bounce">
            <Trophy className="w-8 h-8 fill-slate-950" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight font-heading">
            Journey Complete 🎉
          </h2>
          <p className="text-xs text-amber-300 font-medium mt-1">
            Guided with precision by Saarathi AI Navigation Engine
          </p>
        </div>

        {/* Primary Metric Grid */}
        <div className="grid grid-cols-3 gap-2.5 mt-5 text-center font-mono">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Distance</span>
            <span className="text-lg font-black text-white">{stats.distanceKm} km</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Travel Time</span>
            <span className="text-lg font-black text-amber-400">{stats.durationMin} min</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-sans">Total Cost</span>
            <span className="text-lg font-black text-emerald-400">₹{stats.totalCost}</span>
          </div>
        </div>

        {/* Secondary Details: Toll, Fuel, Road Quality */}
        <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs font-mono bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">
              {vehicle.type === 'ev' ? 'Energy Used' : 'Fuel Used'}
            </span>
            <span className="font-bold text-slate-200">
              {vehicle.type === 'ev' ? `${route.energyConsumptionKwh} kWh` : `${stats.fuelUsedL} L`}
            </span>
          </div>

          <div className="border-x border-slate-800">
            <span className="text-[10px] text-slate-400 block font-sans">Toll Paid</span>
            <span className="font-bold text-amber-300">₹{stats.tollPaid}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-sans">Road Integrity</span>
            <span className="font-bold text-cyan-400">{stats.roadQualityScore}/100</span>
          </div>
        </div>

        {/* AI Trip Insight Card */}
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Saarathi Journey Intelligence Insight</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            You saved approximately <strong className="text-emerald-400 font-bold">₹{estimatedSavings}</strong> and avoided{' '}
            <strong className="text-amber-300 font-bold">{Math.max(1, stats.hazardsEncountered)} rough road segments</strong> by choosing this guided corridor compared to standard unoptimized routing.
          </p>
        </div>

        {/* How was the journey feedback */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
          <p className="text-xs font-semibold text-slate-300">How was the road condition guidance?</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 text-amber-400 transition-transform hover:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            onClick={() => {
              onSaveToHistory();
              onPlanAnother();
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Plan Next Journey</span>
          </button>

          <button
            onClick={() => {
              onSaveToHistory();
              onClose();
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save to Trip History</span>
          </button>
        </div>
      </div>
    </div>
  );
};
