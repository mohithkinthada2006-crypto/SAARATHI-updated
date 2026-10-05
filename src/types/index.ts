export type VehicleType = 'bike' | 'car' | 'ev' | 'auto' | 'bicycle';

export type JourneyMode = 'fastest' | 'cheapest' | 'safest' | 'smoothest' | 'balanced';

export type Coordinates = [number, number]; // [lat, lng]

export type RoadHazardType = 
  | 'pothole' 
  | 'rough_road' 
  | 'waterlogging' 
  | 'hazard' 
  | 'speed_breaker' 
  | 'accident'
  | 'construction';

export interface RoadHazard {
  id: string;
  type: RoadHazardType;
  location: Coordinates;
  severity: 'low' | 'medium' | 'high';
  description: string;
  verifiedCount: number;
  distanceAlongRouteKm: number;
}

export interface TollPlaza {
  id: string;
  name: string;
  location: Coordinates;
  fee: Record<VehicleType, number>;
  distanceAlongRouteKm: number;
  fastagEnabled: boolean;
  laneType?: string;
}

export interface ChargingStation {
  id: string;
  name: string;
  location: Coordinates;
  availablePlugs: number;
  totalPlugs: number;
  powerKw: number;
  pricePerKwh: number;
  networkName: string;
  detourTimeMin: number;
  plugTypes: string[];
}

export interface ParkingLot {
  id: string;
  name: string;
  location: Coordinates;
  availableSlots: number;
  totalSlots: number;
  ratePerHour: number;
  walkTimeMin: number;
  isCovered: boolean;
}

export interface VehicleConfig {
  type: VehicleType;
  name: string;
  icon: string;
  // ICE Params
  mileageKmPerL: number;
  fuelType: 'petrol' | 'diesel' | 'cng';
  fuelPricePerL: number;
  // EV Params
  batteryCapacityKwh: number;
  currentBatteryPercent: number;
  efficiencyKmPerKwh: number;
  costPerKwh: number;
  chargingPreference: 'fast_only' | 'any' | 'cheapest';
  // Bicycle / Auto Params
  maxComfortDistanceKm: number;
  preferCycleFriendly: boolean;
}

export interface Route {
  id: string;
  name: string;
  tag: string;
  via: string;
  distanceKm: number;
  durationMin: number;
  coordinates: Coordinates[];
  tollCount: number;
  tollCost: number;
  tollPlazas: TollPlaza[];
  fuelLiters: number;
  fuelCost: number;
  parkingCost: number;
  totalCost: number;
  roadQualityScore: number; // 0 - 100
  roadHealthScore: number; // 0 - 100
  hazardCount: number;
  hazards: RoadHazard[];
  vehicleSuitability: number; // 0 - 100
  saarathiScore: number; // 0 - 100
  trafficStatus: 'light' | 'moderate' | 'heavy';
  aiReasons: string[];
  waterloggingRisk: 'low' | 'moderate' | 'high';
  elevationGainM: number;
  estimatedArrivalBatteryPercent?: number;
  energyConsumptionKwh?: number;
  isRecommended?: boolean;
}

export interface NaturalLanguageConstraint {
  rawQuery: string;
  detectedVehicle?: VehicleType;
  arrivalDeadline?: string;
  maxBudget?: number;
  priority?: JourneyMode;
  avoidTolls?: boolean;
  avoidWaterlogging?: boolean;
  batteryPercent?: number;
  summary: string;
}

export interface CrowdsourcedReport {
  id: string;
  type: RoadHazardType;
  title: string;
  location: Coordinates;
  landmark: string;
  timestamp: string;
  verifiedCount: number;
  severity: 'low' | 'medium' | 'high';
  reporter: string;
}

export interface TripHistoryItem {
  id: string;
  date: string;
  originName: string;
  destinationName: string;
  vehicleType: VehicleType;
  distanceKm: number;
  durationMin: number;
  totalCost: number;
  saarathiScore: number;
  savingsVsFastest: number;
  routeName: string;
  roadQualityScore: number;
}
