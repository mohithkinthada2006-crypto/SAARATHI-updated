import React from 'react';
import { Route, VehicleConfig } from '../../types';
import { X, Sparkles, Check, Play } from 'lucide-react';

interface RouteComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  routes: Route[];
  selectedRouteId: string;
  onSelectRoute: (id: string) => void;
  onStartJourney: () => void;
  vehicle: VehicleConfig;
}

export const RouteComparisonModal: React.FC<RouteComparisonModalProps> = ({
  isOpen,
  onClose,
  routes,
  selectedRouteId,
  onSelectRoute,
  onStartJourney,
  vehicle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-[#121824] border border-[#222E42] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#222E42] bg-[#0B0F14]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-blue-600/20 text-blue-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white font-heading">
                Route Comparison Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluating Time, Cost, Road Quality, and {vehicle.name} dynamics.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#182232] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-4 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#222E42]">
                <th className="p-2.5 font-bold uppercase tracking-wider text-slate-400 bg-[#0B0F14] rounded-l-lg">
                  Metric
                </th>
                {routes.map((r) => {
                  return (
                    <th
                      key={r.id}
                      className={`p-2.5 text-center transition-colors min-w-[150px] ${
                        r.isRecommended
                          ? 'bg-emerald-950/20 border-t border-emerald-500/40'
                          : 'bg-[#0B0F14]'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {r.isRecommended && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500 text-slate-950">
                            Recommended
                          </span>
                        )}
                        <span className="font-bold text-white text-xs sm:text-sm">{r.name}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222E42] font-mono">
              {/* Saarathi Score */}
              <tr className="bg-blue-600/5">
                <td className="p-2.5 font-sans font-bold text-blue-300">Saarathi Score</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-2.5 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                      r.isRecommended
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-[#182232] text-slate-200'
                    }`}>
                      {r.saarathiScore} / 100
                    </span>
                  </td>
                ))}
              </tr>

              {/* Time */}
              <tr>
                <td className="p-2.5 font-sans font-medium text-slate-300">Travel Time</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-2.5 text-center font-bold text-white">
                    {r.durationMin} mins
                  </td>
                ))}
              </tr>

              {/* Distance */}
              <tr>
                <td className="p-2.5 font-sans font-medium text-slate-300">Distance</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-2.5 text-center text-slate-300">
                    {r.distanceKm} km
                  </td>
                ))}
              </tr>

              {/* Road Quality */}
              <tr>
                <td className="p-2.5 font-sans font-medium text-slate-300">Road Quality</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-2.5 text-center font-bold text-slate-200">
                    {r.roadQualityScore}%
                  </td>
                ))}
              </tr>

              {/* Hazards */}
              <tr>
                <td className="p-2.5 font-sans font-medium text-slate-300">Hazards</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-2.5 text-center text-slate-300">
                    {r.hazardCount} sections
                  </td>
                ))}
              </tr>

              {/* Tolls */}
              <tr>
                <td className="p-2.5 font-sans font-medium text-slate-300">Tolls</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-2.5 text-center text-slate-300">
                    ₹{r.tollCost} ({r.tollCount} plazas)
                  </td>
                ))}
              </tr>

              {/* Total Cost */}
              <tr className="bg-emerald-950/10">
                <td className="p-2.5 font-sans font-bold text-emerald-300">Total Trip Cost</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-2.5 text-center font-bold text-emerald-400">
                    ₹{r.totalCost}
                  </td>
                ))}
              </tr>

              {/* Action row */}
              <tr>
                <td className="p-2.5 font-sans text-slate-400">Select</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-2.5 text-center">
                    <button
                      onClick={() => {
                        onSelectRoute(r.id);
                        onClose();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        r.id === selectedRouteId
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#182232] hover:bg-[#1E2B3E] text-slate-300'
                      }`}
                    >
                      {r.id === selectedRouteId ? 'Selected' : 'Choose'}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#222E42] bg-[#0B0F14] flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Selected: <strong className="text-white">{routes.find(r => r.id === selectedRouteId)?.name}</strong>
          </span>
          <button
            onClick={() => {
              onClose();
              onStartJourney();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>START SELECTED ROUTE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
