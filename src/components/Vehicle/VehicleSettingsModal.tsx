import React, { useState } from 'react';
import { VehicleConfig, VehicleType } from '../../types';
import { Settings2, Save, X, RotateCcw, Zap, Fuel, Bike, Car, Compass } from 'lucide-react';
import { DEFAULT_VEHICLE_CONFIGS } from '../../services/vehicleDefaults';

interface VehicleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeType: VehicleType;
  configs: Record<VehicleType, VehicleConfig>;
  onSaveConfigs: (configs: Record<VehicleType, VehicleConfig>) => void;
}

export const VehicleSettingsModal: React.FC<VehicleSettingsModalProps> = ({
  isOpen,
  onClose,
  activeType,
  configs,
  onSaveConfigs
}) => {
  const [currentTab, setCurrentTab] = useState<VehicleType>(activeType);
  const [tempConfigs, setTempConfigs] = useState<Record<VehicleType, VehicleConfig>>(configs);

  if (!isOpen) return null;

  const current = tempConfigs[currentTab];

  const updateCurrent = (patch: Partial<VehicleConfig>) => {
    setTempConfigs({
      ...tempConfigs,
      [currentTab]: {
        ...tempConfigs[currentTab],
        ...patch
      }
    });
  };

  const handleSave = () => {
    onSaveConfigs(tempConfigs);
    onClose();
  };

  const handleResetToDefaults = () => {
    setTempConfigs(DEFAULT_VEHICLE_CONFIGS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Vehicle Intelligence & Energy Specs
              </h2>
              <p className="text-xs text-slate-400">
                Personalize fuel economy, fuel rates, battery capacity & tariffs.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Tabs */}
        <div className="flex items-center gap-1.5 mt-4 p-1 bg-slate-950 rounded-xl border border-slate-800">
          {(['bike', 'car', 'ev', 'auto', 'bicycle'] as VehicleType[]).map((vt) => (
            <button
              key={vt}
              onClick={() => setCurrentTab(vt)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                currentTab === vt
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tempConfigs[vt].icon} <span className="capitalize">{vt}</span>
            </button>
          ))}
        </div>

        {/* Active vehicle settings form */}
        <div className="mt-4 space-y-4 text-xs">
          {/* ICE Vehicles (Bike, Car, Auto) */}
          {(currentTab === 'bike' || currentTab === 'car' || currentTab === 'auto') && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Average City Mileage ({currentTab === 'auto' ? 'km / kg CNG' : 'km / Liter'})
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={current.mileageKmPerL}
                  onChange={(e) => updateCurrent({ mileageKmPerL: parseFloat(e.target.value) || 15 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Fuel Type
                  </label>
                  <select
                    value={current.fuelType}
                    onChange={(e) => updateCurrent({ fuelType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="cng">CNG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Fuel Price (₹ / {current.fuelType === 'cng' ? 'kg' : 'Liter'})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={current.fuelPricePerL}
                    onChange={(e) => updateCurrent({ fuelPricePerL: parseFloat(e.target.value) || 100 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Electric Vehicle Settings */}
          {currentTab === 'ev' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Battery Pack Size (kWh)
                  </label>
                  <input
                    type="number"
                    value={current.batteryCapacityKwh}
                    onChange={(e) => updateCurrent({ batteryCapacityKwh: parseFloat(e.target.value) || 40 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Current Battery State (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={current.currentBatteryPercent}
                    onChange={(e) => updateCurrent({ currentBatteryPercent: parseInt(e.target.value, 10) || 80 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-emerald-400 font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Efficiency (km / kWh)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={current.efficiencyKmPerKwh}
                    onChange={(e) => updateCurrent({ efficiencyKmPerKwh: parseFloat(e.target.value) || 7.0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Electricity Tariff (₹ / kWh)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={current.costPerKwh}
                    onChange={(e) => updateCurrent({ costPerKwh: parseFloat(e.target.value) || 9.0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bicycle Settings */}
          {currentTab === 'bicycle' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Maximum Comfortable Range (km)
                </label>
                <input
                  type="number"
                  value={current.maxComfortDistanceKm}
                  onChange={(e) => updateCurrent({ maxComfortDistanceKm: parseFloat(e.target.value) || 15 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                🌱 Zero tailpipe emissions, zero fuel expense, and bypasses all Indian toll plaza requirements automatically.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-800">
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard Indian Averages</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply & Save Specs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
