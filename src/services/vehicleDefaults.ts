import { VehicleConfig, VehicleType } from '../types';

export const DEFAULT_VEHICLE_CONFIGS: Record<VehicleType, VehicleConfig> = {
  bike: {
    type: 'bike',
    name: 'Motorcycle / Scooter',
    icon: '🏍️',
    mileageKmPerL: 46,
    fuelType: 'petrol',
    fuelPricePerL: 106.5,
    batteryCapacityKwh: 0,
    currentBatteryPercent: 100,
    efficiencyKmPerKwh: 0,
    costPerKwh: 0,
    chargingPreference: 'any',
    maxComfortDistanceKm: 60,
    preferCycleFriendly: false,
  },
  car: {
    type: 'car',
    name: 'Compact SUV / Sedan',
    icon: '🚗',
    mileageKmPerL: 15.4,
    fuelType: 'petrol',
    fuelPricePerL: 106.5,
    batteryCapacityKwh: 0,
    currentBatteryPercent: 100,
    efficiencyKmPerKwh: 0,
    costPerKwh: 0,
    chargingPreference: 'any',
    maxComfortDistanceKm: 250,
    preferCycleFriendly: false,
  },
  ev: {
    type: 'ev',
    name: 'Electric Vehicle (EV)',
    icon: '⚡',
    mileageKmPerL: 0,
    fuelType: 'petrol',
    fuelPricePerL: 0,
    batteryCapacityKwh: 42,
    currentBatteryPercent: 78,
    efficiencyKmPerKwh: 7.4,
    costPerKwh: 9.5,
    chargingPreference: 'fast_only',
    maxComfortDistanceKm: 320,
    preferCycleFriendly: false,
  },
  auto: {
    type: 'auto',
    name: 'Auto Rickshaw',
    icon: '🛺',
    mileageKmPerL: 28,
    fuelType: 'cng',
    fuelPricePerL: 87.0,
    batteryCapacityKwh: 0,
    currentBatteryPercent: 100,
    efficiencyKmPerKwh: 0,
    costPerKwh: 0,
    chargingPreference: 'any',
    maxComfortDistanceKm: 50,
    preferCycleFriendly: false,
  },
  bicycle: {
    type: 'bicycle',
    name: 'Commuter Bicycle',
    icon: '🚲',
    mileageKmPerL: 0,
    fuelType: 'petrol',
    fuelPricePerL: 0,
    batteryCapacityKwh: 0,
    currentBatteryPercent: 100,
    efficiencyKmPerKwh: 0,
    costPerKwh: 0,
    chargingPreference: 'any',
    maxComfortDistanceKm: 18,
    preferCycleFriendly: true,
  }
};

const STORAGE_KEY = 'saarathi_vehicle_configs_v1';

export function loadVehicleConfigs(): Record<VehicleType, VehicleConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_VEHICLE_CONFIGS, ...parsed };
    }
  } catch {
    // ignore
  }
  return DEFAULT_VEHICLE_CONFIGS;
}

export function saveVehicleConfigs(configs: Record<VehicleType, VehicleConfig>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  } catch {
    // ignore
  }
}
