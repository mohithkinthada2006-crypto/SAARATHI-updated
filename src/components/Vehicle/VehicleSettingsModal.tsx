import React, { useState } from 'react';
import { VehicleConfig, VehicleType } from '../../types';
import { Settings2, Save, X, RotateCcw, Zap } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#121824] border border-[#222E42] rounded-2xl shadow-2xl overflow-hidden p-5 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#222E42]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
              <Settings2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Vehicle Specs & Fuel/Battery Tuning
              </h2>
              <p className="text-xs text-slate-400">
                Adjust mileage, fuel rates, battery capacity, and tariffs.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Tabs */}
        <div className="flex items-center gap-1 mt-3 p-1 bg-[#0B0F14] rounded-xl border border-[#222E42]">
          {(['bike', 'car', 'ev', 'auto', 'bicycle'] as VehicleType[]).map((vt) => (
            <button
              key={vt}
              onClick={() => setCurrentTab(vt)}
              className={`flex-1 py-1.5 px-1 rounded-lg text-xs font-bold transition-all text-center ${
                currentTab === vt
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tempConfigs[vt].icon} <span className="capitalize">{vt}</span>
            </button>
          ))}
        </div>

        {/* Form fields */}
        <div className="mt-3.5 space-y-3 text-xs">
          {/* ICE Vehicles (Bike, Car, Auto) */}
          {(currentTab === 'bike' || currentTab === 'car' || currentTab === 'auto') && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Average City Mileage ({currentTab === 'auto' ? 'km / kg CNG' : 'km / Liter'})
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={current.mileageKmPerL}
                  onChange={(e) => updateCurrent({ mileageKmPerL: parseFloat(e.target.value) || 15 })}
                  className="w-full bg-[#0B0F14] border border-[#222E42] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Fuel Price (₹ / {currentTab === 'auto' ? 'kg CNG' : 'Litre'})
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={current.fuelPricePerL}
                  onChange={(e) => updateCurrent({ fuelPricePerL: parseFloat(e.target.value) || 100 })}
                  className="w-full bg-[#0B0F14] border border-[#222E42] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* EV Settings */}
          {currentTab === 'ev' && (
            <div className="space-y-2.5">
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 mb-1">
                  <span>Current Battery Level</span>
                  <span className="text-emerald-400 font-mono">{current.currentBatteryPercent}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={current.currentBatteryPercent}
                  onChange={(e) => updateCurrent({ currentBatteryPercent: parseInt(e.target.value, 10) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Battery Capacity (kWh)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={current.batteryCapacityKwh}
                    onChange={(e) => updateCurrent({ batteryCapacityKwh: parseFloat(e.target.value) || 40 })}
                    className="w-full bg-[#0B0F14] border border-[#222E42] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Efficiency (km / kWh)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={current.efficiencyKmPerKwh}
                    onChange={(e) => updateCurrent({ efficiencyKmPerKwh: parseFloat(e.target.value) || 7.2 })}
                    className="w-full bg-[#0B0F14] border border-[#222E42] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bicycle Settings */}
          {currentTab === 'bicycle' && (
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Max Comfortable Distance (km)
              </label>
              <input
                type="number"
                value={current.maxComfortDistanceKm}
                onChange={(e) => updateCurrent({ maxComfortDistanceKm: parseInt(e.target.value, 10) || 15 })}
                className="w-full bg-[#0B0F14] border border-[#222E42] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-[#222E42] flex items-center justify-between">
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE SPECS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
