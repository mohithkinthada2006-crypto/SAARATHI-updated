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
    { mode: 'balanced', label: 'Balanced', icon: <Scale className="w-3.5 h-3.5" />, desc: 'Recommended' },
    { mode: 'fastest', label: 'Fastest', icon: <Zap className="w-3.5 h-3.5" />, desc: 'Min time' },
    { mode: 'safest', label: 'Safest', icon: <ShieldCheck className="w-3.5 h-3.5" />, desc: 'Low hazards' },
    { mode: 'smoothest', label: 'Smooth', icon: <Waves className="w-3.5 h-3.5" />, desc: 'Best road' },
    { mode: 'cheapest', label: 'Toll-Free', icon: <IndianRupee className="w-3.5 h-3.5" />, desc: 'Zero toll' }
  ];

  return (
    <div className="bg-[#121824] rounded-2xl border border-[#222E42] p-2.5 shadow-lg">
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Optimization Priority
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          Dynamic weights
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1">
        {modes.map((item) => {
          const isSelected = currentMode === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => onSelectMode(item.mode)}
              className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-all border text-center ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                  : 'bg-[#182232] border-[#222E42] hover:bg-[#1E2B3E] text-slate-400'
              }`}
            >
              <div className={isSelected ? 'text-blue-400' : 'text-slate-400'}>{item.icon}</div>
              <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-300 font-bold' : 'text-slate-300'}`}>
                {item.label}
              </span>
              <span className="text-[8px] text-slate-500 mt-0.5 whitespace-nowrap">
                {item.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
