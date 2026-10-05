import React, { useState } from 'react';
import { Coordinates, RoadHazardType } from '../../types';
import { X, AlertTriangle, MapPin, Send, CheckCircle2 } from 'lucide-react';

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
  const [reporterName, setReporterName] = useState('Active Saarathi Commuter');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      type,
      title: title || `${type.replace('_', ' ').toUpperCase()} reported`,
      landmark: landmark || 'Near current road location',
      severity,
      reporter: reporterName,
      location: currentCoordinates
    });
    onClose();
  };

  const hazardOptions: { type: RoadHazardType; label: string; icon: string }[] = [
    { type: 'pothole', label: 'Pothole', icon: '🕳️' },
    { type: 'waterlogging', label: 'Waterlogging', icon: '🌊' },
    { type: 'rough_road', label: 'Broken / Rough Road', icon: '🛣️' },
    { type: 'speed_breaker', label: 'Unmarked Speed Breaker', icon: '⚠️' },
    { type: 'construction', label: 'Road Construction', icon: '🚧' },
    { type: 'accident', label: 'Accident Obstruction', icon: '🚨' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-white font-heading">
                Report Live Road Incident
              </h3>
              <p className="text-[11px] text-slate-400">
                Crowdsource real-time road conditions to protect fellow Indian commuters.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Hazard Type Grid */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1.5">
              Incident Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {hazardOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.type}
                  onClick={() => setType(opt.type)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    type === opt.type
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-[11px] text-center leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
              Short Description / Specific Warning
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sharp deep pothole in middle lane after underpass"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Landmark */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
              Nearest Landmark or Metro Pillar
            </label>
            <input
              type="text"
              placeholder="e.g. Near HDFC Bank / Pillar No. 120"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Severity */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
              Hazard Severity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((sev) => (
                <button
                  type="button"
                  key={sev}
                  onClick={() => setSeverity(sev)}
                  className={`py-2 rounded-xl border text-center uppercase font-bold text-[11px] transition-all ${
                    severity === sev
                      ? sev === 'high'
                        ? 'bg-rose-950 border-rose-500 text-rose-300'
                        : sev === 'medium'
                        ? 'bg-amber-950 border-amber-500 text-amber-300'
                        : 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Coordinates indicator */}
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Pin Coordinates
            </span>
            <span className="text-slate-300">
              {currentCoordinates[0].toFixed(4)}, {currentCoordinates[1].toFixed(4)}
            </span>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast to Community</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
