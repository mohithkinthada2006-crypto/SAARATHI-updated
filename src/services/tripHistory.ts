import { TripHistoryItem } from '../types';

const STORAGE_KEY = 'saarathi_trip_history_v1';

export const DEFAULT_TRIP_HISTORY: TripHistoryItem[] = [
  {
    id: 'trip-1',
    date: 'Yesterday, 6:45 PM',
    originName: 'Banjara Hills (Rd No. 12)',
    destinationName: 'Gachibowli Financial District',
    vehicleType: 'bike',
    distanceKm: 16.2,
    durationMin: 32,
    totalCost: 38,
    saarathiScore: 94,
    savingsVsFastest: 72,
    routeName: 'Saarathi Smart Line (Via Jubilee/Ring)',
    roadQualityScore: 92
  },
  {
    id: 'trip-2',
    date: '3 Oct 2026, 9:15 AM',
    originName: 'MG Road (Cubbon Park)',
    destinationName: 'Electronic City Phase 1',
    vehicleType: 'car',
    distanceKm: 21.8,
    durationMin: 39,
    totalCost: 182,
    saarathiScore: 89,
    savingsVsFastest: 85,
    routeName: 'Bannerghatta Bypass Corridor',
    roadQualityScore: 88
  },
  {
    id: 'trip-3',
    date: '28 Sep 2026, 4:20 PM',
    originName: 'Guindy Olympia Tech Park',
    destinationName: 'ECR Kovalam Beach Resort',
    vehicleType: 'ev',
    distanceKm: 28.5,
    durationMin: 44,
    totalCost: 75,
    saarathiScore: 96,
    savingsVsFastest: 45,
    routeName: 'ECR Scenic Electric Way',
    roadQualityScore: 95
  }
];

export function getTripHistory(): TripHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return DEFAULT_TRIP_HISTORY;
}

export function saveCompletedTrip(item: Omit<TripHistoryItem, 'id'>): TripHistoryItem {
  const history = getTripHistory();
  const created: TripHistoryItem = {
    ...item,
    id: `trip-${Date.now()}`
  };
  history.unshift(created);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
  return created;
}
