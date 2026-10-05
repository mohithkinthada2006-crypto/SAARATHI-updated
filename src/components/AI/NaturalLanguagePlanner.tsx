import React, { useState } from 'react';
import { Sparkles, ArrowRight, X, Bot, CheckCircle2, CornerDownLeft } from 'lucide-react';
import { parseNaturalLanguageQuery, SAMPLE_AI_QUERIES } from '../../services/aiPlannerService';
import { NaturalLanguageConstraint, VehicleType, JourneyMode } from '../../types';

interface NaturalLanguagePlannerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyConstraints: (constraints: NaturalLanguageConstraint) => void;
}

export const NaturalLanguagePlanner: React.FC<NaturalLanguagePlannerProps> = ({
  isOpen,
  onClose,
  onApplyConstraints
}) => {
  const [query, setQuery] = useState('');
  const [parsed, setParsed] = useState<NaturalLanguageConstraint | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = (textToAnalyze?: string) => {
    const q = textToAnalyze || query;
    if (!q.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      const result = parseNaturalLanguageQuery(q);
      setParsed(result);
      setIsProcessing(false);
    }, 280);
  };

  const handleApply = () => {
    if (parsed) {
      onApplyConstraints(parsed);
      onClose();
    }
  };

  const handlePresetClick = (sample: string) => {
    setQuery(sample);
    handleAnalyze(sample);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 glass-panel-gold">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                <span>Saarathi Journey Intelligence Engine</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  NLP v2.4
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                State your journey goals in natural English or Hinglish constraints.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input box */}
        <div className="mt-4">
          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. “I need to reach college by 9 AM, I'm on a bike and I don't want to spend more than ₹150.”"
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-2xl p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 resize-none transition-all"
            />
            <button
              onClick={() => handleAnalyze()}
              disabled={isProcessing || !query.trim()}
              className="absolute right-3 bottom-4 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Analyzing...' : 'Parse & Optimize'}</span>
            </button>
          </div>
        </div>

        {/* Quick sample chips */}
        <div className="mt-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Try Quick Indian Commute Prompts:
          </div>
          <div className="space-y-1.5">
            {SAMPLE_AI_QUERIES.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(sample)}
                className="w-full text-left p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 text-xs text-slate-300 hover:text-amber-200 transition-all flex items-center justify-between group"
              >
                <span className="truncate pr-2">{sample}</span>
                <span className="text-[10px] text-amber-400/70 group-hover:text-amber-300 font-semibold whitespace-nowrap">
                  Load &rarr;
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Parsed Structured Constraints Box */}
        {parsed && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between font-bold text-amber-400 uppercase text-[11px] mb-2.5">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Structured Constraints Extracted
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Confidence: 98.4%</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Vehicle</span>
                <span className="font-bold text-white uppercase text-xs">
                  {parsed.detectedVehicle || 'Current'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Arrival By</span>
                <span className="font-bold text-amber-300 text-xs">
                  {parsed.arrivalDeadline || 'Asap'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Max Budget</span>
                <span className="font-bold text-emerald-400 text-xs">
                  {parsed.maxBudget ? `₹${parsed.maxBudget}` : 'Flexible'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Optimization</span>
                <span className="font-bold text-purple-300 uppercase text-xs">
                  {parsed.priority || 'Balanced'}
                </span>
              </div>
            </div>

            {/* Special flags */}
            {(parsed.avoidTolls || parsed.avoidWaterlogging || parsed.batteryPercent) && (
              <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-300 flex-wrap">
                {parsed.avoidTolls && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300">
                    🛣️ Bypass All Toll Plazas
                  </span>
                )}
                {parsed.avoidWaterlogging && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300">
                    🌊 Avoid Monsoon Waterlogging
                  </span>
                )}
                {parsed.batteryPercent && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                    ⚡ Battery Reserve: {parsed.batteryPercent}%
                  </span>
                )}
              </div>
            )}

            <button
              onClick={handleApply}
              className="mt-3.5 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <span>APPLY INTELLIGENCE TO JOURNEY PLAN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
