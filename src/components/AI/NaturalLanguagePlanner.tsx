import React, { useState } from 'react';
import { Sparkles, ArrowRight, X, Bot, CheckCircle2 } from 'lucide-react';
import { parseNaturalLanguageQuery, SAMPLE_AI_QUERIES } from '../../services/aiPlannerService';
import { NaturalLanguageConstraint } from '../../types';

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
    }, 200);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-[#121824] border border-[#222E42] rounded-2xl shadow-2xl overflow-hidden flex flex-col p-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#222E42]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Natural Language Route Assistant
              </h2>
              <p className="text-xs text-slate-400">
                Type or select your journey constraints
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#182232] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input box */}
        <div className="mt-3">
          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. “I'm on a bike, avoid tolls and give me the smoothest road under ₹100.”"
              className="w-full bg-[#0B0F14] border border-[#222E42] rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
            <button
              onClick={() => handleAnalyze()}
              disabled={isProcessing || !query.trim()}
              className="absolute right-2.5 bottom-3.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
            >
              <Sparkles className="w-3 h-3" />
              <span>{isProcessing ? 'Analyzing...' : 'Parse'}</span>
            </button>
          </div>
        </div>

        {/* Quick sample chips */}
        <div className="mt-2.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Sample Commute Queries:
          </div>
          <div className="space-y-1">
            {SAMPLE_AI_QUERIES.slice(0, 3).map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(sample)}
                className="w-full text-left p-2 rounded-lg bg-[#182232] hover:bg-[#1E2B3E] border border-[#222E42] text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between"
              >
                <span className="truncate pr-2">{sample}</span>
                <span className="text-[10px] text-blue-400 font-semibold whitespace-nowrap">
                  Load &rarr;
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Parsed Output */}
        {parsed && (
          <div className="mt-3 p-3 rounded-xl bg-[#0B0F14] border border-[#222E42] text-xs animate-in fade-in">
            <div className="flex items-center justify-between font-bold text-slate-200 text-xs mb-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Detected Criteria
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[11px]">
              <div className="p-1.5 rounded-lg bg-[#121824] border border-[#222E42]">
                <span className="text-[9px] text-slate-400 block font-sans">Vehicle</span>
                <span className="font-bold text-white uppercase">
                  {parsed.detectedVehicle || 'Default'}
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#121824] border border-[#222E42]">
                <span className="text-[9px] text-slate-400 block font-sans">Budget</span>
                <span className="font-bold text-emerald-400">
                  {parsed.maxBudget ? `₹${parsed.maxBudget}` : 'Any'}
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#121824] border border-[#222E42]">
                <span className="text-[9px] text-slate-400 block font-sans">Priority</span>
                <span className="font-bold text-blue-400 uppercase">
                  {parsed.priority || 'Balanced'}
                </span>
              </div>
            </div>

            <button
              onClick={handleApply}
              className="mt-2.5 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
            >
              <span>APPLY CONSTRAINTS TO ROUTE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
