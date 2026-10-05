import React from 'react';
import { JourneyMode } from '../../types';
import { Zap, IndianRupee, ShieldCheck, Waves, Scale } from 'lucide-react';

interface JourneyModeSelectorProps {
  currentMode: JourneyMode;
  onSelectMode: (mode: JourneyMode) => void;
}

export const JourneyModeSelector: React.FC<JourneyModeSelectorProps> = ({
  currentMode,
  onSelectMode
}) => {
  const modes: { mode: JourneyMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { mode: 'fastest', label: 'Fastest', icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, desc: 'Min time' },
    { mode: 'cheapest', label: 'Cheapest', icon: <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />, desc: 'Min cost' },
    { mode: 'safest', label: 'Safest', icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />, desc: 'Low hazards' },
    { mode: 'smoothest', label: 'Smoothest', icon: <Waves className="w-3.5 h-3.5 text-teal-400" />, desc: 'Best surface' },
    { mode: 'balanced', label: 'Balanced', icon: <Scale className="w-3.5 h-3.5 text-purple-400" />, desc: 'Saarathi ratio' }
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 p-3 shadow-xl">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
          Optimization Priority
        </span>
        <span className="text-[10px] text-slate-400">
          Ranks routes in real time
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {modes.map((item) => {
          const isSelected = currentMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => onSelectMode(item.mode)}
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-200 border text-center ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-400/90 text-white shadow-md shadow-amber-500/10'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 text-slate-400'
              }`}
            >
              <div className="mb-1">{item.icon}</div>
              <span className={`text-[11px] font-bold ${isSelected ? 'text-amber-300' : 'text-slate-300'}`}>
                {item.label}
              </span>
              <span className="text-[9px] text-slate-500 mt-0.5 whitespace-nowrap">
                {item.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
