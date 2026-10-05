import React from 'react';
import { VehicleConfig, VehicleType } from '../../types';
import { SlidersHorizontal, Zap } from 'lucide-react';

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
    { type: 'bike', label: 'Bike', icon: '🏍️', badge: `${configs.bike.mileageKmPerL} km/L` },
    { type: 'car', label: 'Car', icon: '🚗', badge: `${configs.car.mileageKmPerL} km/L` },
    { type: 'ev', label: 'EV', icon: '⚡', badge: `${configs.ev.currentBatteryPercent}%` },
    { type: 'auto', label: 'Auto', icon: '🛺', badge: 'CNG' },
    { type: 'bicycle', label: 'Cycle', icon: '🚲', badge: 'Eco' }
  ];

  const currentConfig = configs[selectedType];

  return (
    <div className="bg-[#121824] rounded-2xl border border-[#222E42] p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2 px-0.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Select Vehicle
        </span>
        <button
          onClick={() => onOpenSettings(selectedType)}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 transition-colors py-1 px-1.5 rounded"
          title="Tune mileage, fuel price & battery specs"
        >
          <SlidersHorizontal className="w-3 h-3 text-slate-400" />
          <span>Vehicle Specs</span>
        </button>
      </div>

      {/* Touch-optimized 5-column grid with min-height 48px */}
      <div className="grid grid-cols-5 gap-1.5">
        {vehicles.map((v) => {
          const isSelected = selectedType === v.type;
          return (
            <button
              key={v.type}
              onClick={() => onSelectVehicle(v.type)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl min-h-[52px] transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border border-blue-500 shadow-sm font-semibold'
                  : 'bg-[#182232] border border-[#222E42] hover:bg-[#1E2B3E] text-slate-300'
              }`}
            >
              <span className="text-xl leading-none">
                {v.icon}
              </span>
              <span className={`text-[11px] font-bold mt-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                {v.label}
              </span>
              <span className={`text-[9px] font-mono mt-0.5 truncate max-w-full ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                {v.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Vehicle Info Footer */}
      <div className="mt-2.5 pt-2 border-t border-[#222E42] flex items-center justify-between text-[11px] text-slate-300 px-0.5">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          <span className="font-medium text-slate-200 truncate">{currentConfig.name}</span>
        </div>

        {selectedType === 'ev' ? (
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] shrink-0">
            <span className="flex items-center gap-0.5">
              <Zap className="w-3 h-3" /> {currentConfig.efficiencyKmPerKwh} km/kWh
            </span>
            <span>&bull;</span>
            <span>{currentConfig.batteryCapacityKwh} kWh pack</span>
          </div>
        ) : selectedType === 'bicycle' ? (
          <div className="text-emerald-400 font-mono text-[10px] shrink-0">
            Zero Fuel &bull; Pedal Power
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] shrink-0">
            <span>{currentConfig.mileageKmPerL} km/L</span>
            <span>&bull;</span>
            <span>₹{currentConfig.fuelPricePerL}/L</span>
          </div>
        )}
      </div>
    </div>
  );
};
