export interface WeatherReport {
  city: string;
  temperatureC: number;
  condition: 'Clear Skies' | 'Scattered Clouds' | 'Monsoon Showers' | 'Heavy Thunderstorms' | 'Mist / Fog';
  conditionIcon: string;
  humidityPercent: number;
  precipitationChance: number;
  windSpeedKmh: number;
  waterloggingAdvisory: string | null;
  evRangeImpactPercent: number; // e.g. -5% due to AC/wipers in heavy rain
  visibilityMeters: number;
  isSimulatedLive: boolean;
}

export function getWeatherForLocation(cityName: string = 'Hyderabad'): WeatherReport {
  // Returns contextual Indian road weather intelligence
  if (cityName.toLowerCase().includes('mumbai') || cityName.toLowerCase().includes('vashi')) {
    return {
      city: 'Mumbai',
      temperatureC: 29,
      condition: 'Monsoon Showers',
      conditionIcon: '🌧️',
      humidityPercent: 88,
      precipitationChance: 75,
      windSpeedKmh: 24,
      waterloggingAdvisory: 'Moderate waterlogging recorded near low-lying rail underpasses. Slow down.',
      evRangeImpactPercent: -8,
      visibilityMeters: 3500,
      isSimulatedLive: true
    };
  }

  if (cityName.toLowerCase().includes('chennai') || cityName.toLowerCase().includes('ecr')) {
    return {
      city: 'Chennai',
      temperatureC: 32,
      condition: 'Scattered Clouds',
      conditionIcon: '⛅',
      humidityPercent: 78,
      precipitationChance: 25,
      windSpeedKmh: 18,
      waterloggingAdvisory: null,
      evRangeImpactPercent: -3,
      visibilityMeters: 8000,
      isSimulatedLive: true
    };
  }

  if (cityName.toLowerCase().includes('bengaluru') || cityName.toLowerCase().includes('ecity')) {
    return {
      city: 'Bengaluru',
      temperatureC: 24,
      condition: 'Scattered Clouds',
      conditionIcon: '⛅',
      humidityPercent: 65,
      precipitationChance: 35,
      windSpeedKmh: 14,
      waterloggingAdvisory: null,
      evRangeImpactPercent: -2,
      visibilityMeters: 9000,
      isSimulatedLive: true
    };
  }

  if (cityName.toLowerCase().includes('delhi')) {
    return {
      city: 'Delhi NCR',
      temperatureC: 31,
      condition: 'Mist / Fog',
      conditionIcon: '🌫️',
      humidityPercent: 60,
      precipitationChance: 10,
      windSpeedKmh: 10,
      waterloggingAdvisory: null,
      evRangeImpactPercent: -4,
      visibilityMeters: 2800,
      isSimulatedLive: true
    };
  }

  // Default: Hyderabad
  return {
    city: 'Hyderabad',
    temperatureC: 28,
    condition: 'Clear Skies',
    conditionIcon: '☀️',
    humidityPercent: 54,
    precipitationChance: 15,
    windSpeedKmh: 12,
    waterloggingAdvisory: null,
    evRangeImpactPercent: 0,
    visibilityMeters: 10000,
    isSimulatedLive: true
  };
}

export interface DepartureSlot {
  timeStr: string;
  travelTimeMin: number;
  trafficLevel: 'Low' | 'Moderate' | 'Heavy' | 'Peak Congestion';
  isRecommended: boolean;
  score: number;
}

export function calculateSmartDepartureTimes(
  baseDurationMin: number,
  targetArrivalTime: string = '09:00 AM'
): { slots: DepartureSlot[]; recommendedSlot: DepartureSlot } {
  // Simulates departure curves based on typical Indian urban traffic peaks (8:00 AM - 10:00 AM)
  const slots: DepartureSlot[] = [
    {
      timeStr: '08:00 AM',
      travelTimeMin: Math.round(baseDurationMin * 1.35),
      trafficLevel: 'Moderate',
      isRecommended: false,
      score: 76
    },
    {
      timeStr: '08:15 AM',
      travelTimeMin: Math.round(baseDurationMin * 1.05),
      trafficLevel: 'Low',
      isRecommended: true,
      score: 94
    },
    {
      timeStr: '08:30 AM',
      travelTimeMin: Math.round(baseDurationMin * 1.5),
      trafficLevel: 'Peak Congestion',
      isRecommended: false,
      score: 62
    },
    {
      timeStr: '08:45 AM',
      travelTimeMin: Math.round(baseDurationMin * 1.7),
      trafficLevel: 'Peak Congestion',
      isRecommended: false,
      score: 55
    }
  ];

  const recommendedSlot = slots.find(s => s.isRecommended) || slots[1];
  return { slots, recommendedSlot };
}
