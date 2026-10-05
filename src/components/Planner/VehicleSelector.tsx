import React from 'react';
import { VehicleConfig, VehicleType } from '../../types';
import { SlidersHorizontal, BatteryCharging, Fuel, Bike, Car, Zap } from 'lucide-react';

interface VehicleSelectorProps {
  selectedType: VehicleType;
  configs: Record<VehicleType, VehicleConfig>;
  onSelectVehicle: (type: VehicleType) => void;
  onOpenSettings: (type: VehicleType) => void;
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  selectedType,
  configs,
  onSelectVehicle,
  onOpenSettings
}) => {
  const vehicles: { type: VehicleType; label: string; icon: string; badge: string }[] = [
    { type: 'bike', label: 'Bike', icon: '🏍️', badge: `${configs.bike.mileageKmPerL} km/l` },
    { type: 'car', label: 'Car', icon: '🚗', badge: `${configs.car.mileageKmPerL} km/l` },
    { type: 'ev', label: 'EV', icon: '⚡', badge: `${configs.ev.currentBatteryPercent}% Batt` },
    { type: 'auto', label: 'Auto', icon: '🛺', badge: 'CNG' },
    { type: 'bicycle', label: 'Bicycle', icon: '🚲', badge: '0 Cost' }
  ];

  const currentConfig = configs[selectedType];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 p-3 shadow-xl">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
          Selected Vehicle Mode
        </span>
        <button
          onClick={() => onOpenSettings(selectedType)}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-amber-300 transition-colors"
          title="Tune mileage, fuel price & battery parameters"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>Tune Specs</span>
        </button>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {vehicles.map((v) => {
          const isSelected = selectedType === v.type;
          return (
            <button
              key={v.type}
              onClick={() => onSelectVehicle(v.type)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 relative group ${
                isSelected
                  ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/30 border-2 border-amber-400 shadow-md shadow-amber-500/20 scale-[1.03]'
                  : 'bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
              }`}
            >
              <span className="text-xl sm:text-2xl transition-transform group-hover:scale-110">
                {v.icon}
              </span>
              <span className={`text-[11px] font-bold mt-1 ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                {v.label}
              </span>
              <span className="text-[9px] text-slate-400 font-mono mt-0.5 whitespace-nowrap">
                {v.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Vehicle Quick Metric Bar */}
      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-amber-400">●</span>
          <span className="font-medium text-white">{currentConfig.name}</span>
        </div>

        {selectedType === 'ev' ? (
          <div className="flex items-center gap-2 text-emerald-400 font-mono">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" /> {currentConfig.efficiencyKmPerKwh} km/kWh
            </span>
            <span>&bull;</span>
            <span>₹{currentConfig.costPerKwh}/kWh</span>
          </div>
        ) : selectedType === 'bicycle' ? (
          <div className="text-teal-400 font-mono">
            Zero Fuel &bull; Eco Commute
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-300 font-mono">
            <span>Mileage: <strong className="text-amber-300">{currentConfig.mileageKmPerL} km/L</strong></span>
            <span>&bull;</span>
            <span>Fuel: <strong className="text-amber-300">₹{currentConfig.fuelPricePerL}/L</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};
