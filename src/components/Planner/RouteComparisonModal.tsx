import React from 'react';
import { Route, VehicleConfig } from '../../types';
import { X, Sparkles, Check, ArrowRight, Play } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white font-heading">
                Multi-Route Intelligence Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluating Time, Cost, Road Integrity, Toll Plazas, and {vehicle.name} dynamics.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-5 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-3 font-bold uppercase tracking-wider text-slate-400 bg-slate-950/40 rounded-l-xl">
                  Metric
                </th>
                {routes.map((r) => {
                  const isSelected = r.id === selectedRouteId;
                  return (
                    <th
                      key={r.id}
                      className={`p-3 text-center transition-colors min-w-[170px] ${
                        r.isRecommended
                          ? 'bg-amber-500/10 border-x border-t border-amber-500/40'
                          : 'bg-slate-950/20'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {r.isRecommended && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                            Saarathi Choice
                          </span>
                        )}
                        <span className="font-bold text-white text-sm">{r.name}</span>
                        <span className="text-[10px] text-slate-400">{r.tag}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {/* Saarathi Score */}
              <tr className="bg-amber-500/5">
                <td className="p-3 font-sans font-bold text-amber-300">Saarathi Score</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-sm font-black ${
                      r.isRecommended
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                        : 'bg-slate-800 text-slate-200'
                    }`}>
                      {r.saarathiScore} / 100
                    </span>
                  </td>
                ))}
              </tr>

              {/* Travel Time */}
              <tr>
                <td className="p-3 font-sans text-slate-400">Duration (ETA)</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-3 text-center font-bold text-white">
                    {r.durationMin} mins
                  </td>
                ))}
              </tr>

              {/* Distance */}
              <tr>
                <td className="p-3 font-sans text-slate-400">Total Distance</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-3 text-center text-slate-300">
                    {r.distanceKm} km
                  </td>
                ))}
              </tr>

              {/* Toll Charges */}
              <tr>
                <td className="p-3 font-sans text-slate-400">Tolls ({vehicle.type})</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-3 text-center">
                    {r.tollCost === 0 ? (
                      <span className="text-emerald-400 font-bold">₹0 (Toll Free)</span>
                    ) : (
                      <span className="text-amber-400 font-bold">₹{r.tollCost} ({r.tollCount} plazas)</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Fuel / Energy Cost */}
              <tr>
                <td className="p-3 font-sans text-slate-400">
                  {vehicle.type === 'ev' ? 'Energy Cost' : 'Fuel Cost'}
                </td>
                {routes.map((r) => (
                  <td key={r.id} className="p-3 text-center text-slate-300">
                    ₹{r.fuelCost}
                    {vehicle.type === 'ev' && (
                      <span className="block text-[10px] text-slate-500">
                        {r.energyConsumptionKwh} kWh
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Total Estimated Cost */}
              <tr className="bg-slate-950/40">
                <td className="p-3 font-sans font-bold text-white">Total Trip Cost</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-3 text-center text-sm font-black text-emerald-400">
                    ₹{r.totalCost}
                  </td>
                ))}
              </tr>

              {/* Road Quality */}
              <tr>
                <td className="p-3 font-sans text-slate-400">Road Quality Index</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-3 text-center">
                    <span className={`font-bold ${r.roadQualityScore >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {r.roadQualityScore} / 100
                    </span>
                  </td>
                ))}
              </tr>

              {/* Hazards & Potholes */}
              <tr>
                <td className="p-3 font-sans text-slate-400">Hazards / Potholes</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-3 text-center text-slate-300">
                    {r.hazardCount === 0 ? (
                      <span className="text-emerald-400">None detected</span>
                    ) : (
                      <span>{r.hazardCount} segments</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Vehicle Suitability */}
              <tr>
                <td className="p-3 font-sans text-slate-400">Vehicle Match</td>
                {routes.map((r) => (
                  <td key={r.id} className="p-3 text-center text-slate-200">
                    {r.vehicleSuitability}%
                  </td>
                ))}
              </tr>

              {/* Action row */}
              <tr className="border-t-2 border-slate-700/80">
                <td className="p-3 font-sans font-bold text-slate-400">Select Route</td>
                {routes.map((r) => {
                  const isSelected = r.id === selectedRouteId;
                  return (
                    <td key={r.id} className="p-3 text-center">
                      <button
                        onClick={() => onSelectRoute(r.id)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        {isSelected ? '✓ ACTIVE' : 'CHOOSE'}
                      </button>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="text-xs text-slate-400">
            Selected: <strong className="text-amber-300 font-bold">
              {routes.find(r => r.id === selectedRouteId)?.name}
            </strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Back to Map
            </button>
            <button
              onClick={() => {
                onClose();
                onStartJourney();
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>START LIVE JOURNEY</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
