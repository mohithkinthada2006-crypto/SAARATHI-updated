import React, { useState } from 'react';
import { Coordinates, RoadHazardType } from '../../types';
import { X, AlertTriangle, Send } from 'lucide-react';

interface ReportHazardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCoordinates: Coordinates;
  onSubmitReport: (data: {
    type: RoadHazardType;
    title: string;
    landmark: string;
    severity: 'low' | 'medium' | 'high';
    reporter: string;
    location: Coordinates;
  }) => void;
}

export const ReportHazardModal: React.FC<ReportHazardModalProps> = ({
  isOpen,
  onClose,
  currentCoordinates,
  onSubmitReport
}) => {
  const [type, setType] = useState<RoadHazardType>('pothole');
  const [title, setTitle] = useState('');
  const [landmark, setLandmark] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      type,
      title: title || `${type.replace('_', ' ').toUpperCase()} reported`,
      landmark: landmark || 'Near current road location',
      severity,
      reporter: 'Verified Rider',
      location: currentCoordinates
    });
    onClose();
  };

  const hazardOptions: { type: RoadHazardType; label: string; icon: string }[] = [
    { type: 'pothole', label: 'Pothole', icon: '🕳️' },
    { type: 'waterlogging', label: 'Waterlogging', icon: '🌊' },
    { type: 'rough_road', label: 'Broken Road', icon: '🛣️' },
    { type: 'speed_breaker', label: 'Speed Breaker', icon: '⚠️' },
    { type: 'construction', label: 'Construction', icon: '🚧' },
    { type: 'accident', label: 'Accident Obstacle', icon: '🚨' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#121824] border border-[#222E42] rounded-2xl shadow-2xl overflow-hidden p-5 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-[#222E42]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-white font-heading">
                Report Road Hazard
              </h3>
              <p className="text-[11px] text-slate-400">
                Log real-time road defects to protect fellow commuters.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 space-y-3 text-xs">
          {/* Hazard Type Grid */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
              Hazard Type
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {hazardOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.type}
                  onClick={() => setType(opt.type)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    type === opt.type
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                      : 'bg-[#0B0F14] border-[#222E42] text-slate-300 hover:bg-[#182232]'
                  }`}
                >
                  <span className="text-lg">{opt.icon}</span>
                  <span className="text-[10px] text-center leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Description / Landmark
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Near metro pillar 128 / right lane"
              className="w-full bg-[#0B0F14] border border-[#222E42] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Severity */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Severity Level
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['low', 'medium', 'high'] as const).map((sev) => (
                <button
                  type="button"
                  key={sev}
                  onClick={() => setSeverity(sev)}
                  className={`py-1.5 rounded-lg border text-[11px] font-bold uppercase transition-all ${
                    severity === sev
                      ? sev === 'high'
                        ? 'bg-rose-950/70 border-rose-500 text-rose-300'
                        : 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-[#0B0F14] border-[#222E42] text-slate-400'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>SUBMIT ROAD REPORT</span>
          </button>
        </form>
      </div>
    </div>
  );
};
