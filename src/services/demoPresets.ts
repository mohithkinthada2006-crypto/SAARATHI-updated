import { Coordinates, RoadHazard, TollPlaza, ChargingStation, ParkingLot } from '../types';

export interface PresetJourney {
  id: string;
  cityName: string;
  originName: string;
  originCoords: Coordinates;
  destinationName: string;
  destinationCoords: Coordinates;
  description: string;
  recommendedVehicle: 'bike' | 'car' | 'ev' | 'auto';
  tollPlazas: TollPlaza[];
  hazards: RoadHazard[];
  chargingStations: ChargingStation[];
  parkingLots: ParkingLot[];
}

export const PRESET_JOURNEYS: PresetJourney[] = [
  {
    id: 'hyd-gachibowli',
    cityName: 'Hyderabad',
    originName: 'Banjara Hills (Rd No. 12)',
    originCoords: [17.4156, 78.4354],
    destinationName: 'Gachibowli Financial District',
    destinationCoords: [17.4401, 78.3489],
    description: 'High-tech corridor with expressways, IT hubs, and rapid terrain changes.',
    recommendedVehicle: 'bike',
    tollPlazas: [
      {
        id: 'toll-orr-hyd',
        name: 'Gachibowli ORR Interchange Toll',
        location: [17.4320, 78.3610],
        distanceAlongRouteKm: 14.2,
        fastagEnabled: true,
        fee: { bike: 0, car: 60, ev: 60, auto: 30, bicycle: 0 }
      }
    ],
    hazards: [
      {
        id: 'hz-hyd-1',
        type: 'pothole',
        location: [17.4250, 78.4110],
        severity: 'medium',
        description: 'Deep road shoulder rut after recent fiber trenching',
        verifiedCount: 14,
        distanceAlongRouteKm: 3.2
      },
      {
        id: 'hz-hyd-2',
        type: 'waterlogging',
        location: [17.4290, 78.3910],
        severity: 'high',
        description: 'Monsoon water accumulation under Jubilee flyover underpass',
        verifiedCount: 29,
        distanceAlongRouteKm: 6.8
      },
      {
        id: 'hz-hyd-3',
        type: 'speed_breaker',
        location: [17.4380, 78.3550],
        severity: 'low',
        description: 'Unmarked rumble strips near Knowledge City gate',
        verifiedCount: 8,
        distanceAlongRouteKm: 12.5
      }
    ],
    chargingStations: [
      {
        id: 'cs-hyd-1',
        name: 'Tata Power EZ Charge — Inorbit Mall',
        location: [17.4340, 78.3860],
        availablePlugs: 3,
        totalPlugs: 4,
        powerKw: 60,
        pricePerKwh: 14.5,
        networkName: 'Tata Power',
        detourTimeMin: 3,
        plugTypes: ['CCS2', 'Type 2']
      },
      {
        id: 'cs-hyd-2',
        name: 'Jio-bp pulse — Bio-Diversity Junction',
        location: [17.4290, 78.3750],
        availablePlugs: 2,
        totalPlugs: 6,
        powerKw: 120,
        pricePerKwh: 16.0,
        networkName: 'Jio-bp',
        detourTimeMin: 2,
        plugTypes: ['CCS2']
      }
    ],
    parkingLots: [
      {
        id: 'pk-hyd-1',
        name: 'One West Smart Parking Tower',
        location: [17.4395, 78.3510],
        availableSlots: 48,
        totalSlots: 150,
        ratePerHour: 40,
        walkTimeMin: 4,
        isCovered: true
      },
      {
        id: 'pk-hyd-2',
        name: 'Financial District Multilevel Plaza',
        location: [17.4410, 78.3470],
        availableSlots: 112,
        totalSlots: 300,
        ratePerHour: 30,
        walkTimeMin: 6,
        isCovered: true
      }
    ]
  },
  {
    id: 'blr-ecity',
    cityName: 'Bengaluru',
    originName: 'MG Road (Cubbon Park)',
    originCoords: [12.9766, 77.5993],
    destinationName: 'Electronic City Phase 1',
    destinationCoords: [12.8452, 77.6602],
    description: 'Silicon valley arterial route known for Silk Board bottlenecks and elevated tollways.',
    recommendedVehicle: 'car',
    tollPlazas: [
      {
        id: 'toll-blr-elevated',
        name: 'BETL Electronic City Elevated Toll Plaza',
        location: [12.9150, 77.6250],
        distanceAlongRouteKm: 11.0,
        fastagEnabled: true,
        fee: { bike: 25, car: 85, ev: 85, auto: 45, bicycle: 0 }
      }
    ],
    hazards: [
      {
        id: 'hz-blr-1',
        type: 'rough_road',
        location: [12.9350, 77.6180],
        severity: 'high',
        description: 'Metro line construction rough road surface with uneven metal sheets',
        verifiedCount: 42,
        distanceAlongRouteKm: 6.2
      },
      {
        id: 'hz-blr-2',
        type: 'pothole',
        location: [12.8850, 77.6410],
        severity: 'medium',
        description: 'Cluster of 3 potholes on middle lane',
        verifiedCount: 19,
        distanceAlongRouteKm: 13.8
      }
    ],
    chargingStations: [
      {
        id: 'cs-blr-1',
        name: 'Zeon Fast Charger — Koramangala',
        location: [12.9340, 77.6220],
        availablePlugs: 4,
        totalPlugs: 4,
        powerKw: 50,
        pricePerKwh: 15.0,
        networkName: 'Zeon',
        detourTimeMin: 4,
        plugTypes: ['CCS2']
      },
      {
        id: 'cs-blr-2',
        name: 'Statiq Hub — Bommanahalli',
        location: [12.9020, 77.6320],
        availablePlugs: 1,
        totalPlugs: 4,
        powerKw: 60,
        pricePerKwh: 14.0,
        networkName: 'Statiq',
        detourTimeMin: 3,
        plugTypes: ['CCS2', 'Type 2']
      }
    ],
    parkingLots: [
      {
        id: 'pk-blr-1',
        name: 'Infosys Gate 1 Visitor Parking',
        location: [12.8465, 77.6590],
        availableSlots: 65,
        totalSlots: 200,
        ratePerHour: 30,
        walkTimeMin: 3,
        isCovered: true
      }
    ]
  },
  {
    id: 'che-ecr',
    cityName: 'Chennai',
    originName: 'Guindy Olympia Tech Park',
    originCoords: [13.0067, 80.2026],
    destinationName: 'ECR Kovalam Beach Resort',
    destinationCoords: [12.7932, 80.2483],
    description: 'Scenic coastal highway with sea breeze, toll plazas, and tourist traffic.',
    recommendedVehicle: 'ev',
    tollPlazas: [
      {
        id: 'toll-che-ecr',
        name: 'Uthandi Toll Plaza (ECR)',
        location: [12.8680, 80.2460],
        distanceAlongRouteKm: 18.5,
        fastagEnabled: true,
        fee: { bike: 0, car: 55, ev: 55, auto: 25, bicycle: 0 }
      }
    ],
    hazards: [
      {
        id: 'hz-che-1',
        type: 'accident',
        location: [12.9420, 80.2310],
        severity: 'medium',
        description: 'Slow moving traffic due to single lane diversion',
        verifiedCount: 11,
        distanceAlongRouteKm: 8.5
      },
      {
        id: 'hz-che-2',
        type: 'waterlogging',
        location: [12.8250, 80.2470],
        severity: 'medium',
        description: 'Coastal spray and tidal water accumulation near culvert',
        verifiedCount: 16,
        distanceAlongRouteKm: 23.0
      }
    ],
    chargingStations: [
      {
        id: 'cs-che-1',
        name: 'Ather Grid — Thoraipakkam OMR',
        location: [12.9380, 80.2330],
        availablePlugs: 2,
        totalPlugs: 2,
        powerKw: 22,
        pricePerKwh: 12.0,
        networkName: 'Ather',
        detourTimeMin: 2,
        plugTypes: ['Ather Proprietary', 'Type 2']
      },
      {
        id: 'cs-che-2',
        name: 'Relux Electric Supercharger — Akkarai',
        location: [12.8790, 80.2440],
        availablePlugs: 4,
        totalPlugs: 6,
        powerKw: 120,
        pricePerKwh: 17.5,
        networkName: 'Relux',
        detourTimeMin: 1,
        plugTypes: ['CCS2']
      }
    ],
    parkingLots: [
      {
        id: 'pk-che-1',
        name: 'Taj Fisherman Cove Valet Area',
        location: [12.7950, 80.2475],
        availableSlots: 32,
        totalSlots: 80,
        ratePerHour: 50,
        walkTimeMin: 2,
        isCovered: true
      }
    ]
  },
  {
    id: 'mum-bkc-vashi',
    cityName: 'Mumbai',
    originName: 'Bandra West (Linking Road)',
    originCoords: [19.0596, 72.8295],
    destinationName: 'Navi Mumbai Vashi Plaza',
    destinationCoords: [19.0770, 72.9986],
    description: 'Cross-harbour link traversing sea bridge corridors and bustling trade nodes.',
    recommendedVehicle: 'car',
    tollPlazas: [
      {
        id: 'toll-mum-vashi',
        name: 'Vashi Creek Bridge Toll Plaza',
        location: [19.0680, 72.9810],
        distanceAlongRouteKm: 19.8,
        fastagEnabled: true,
        fee: { bike: 0, car: 45, ev: 45, auto: 0, bicycle: 0 }
      }
    ],
    hazards: [
      {
        id: 'hz-mum-1',
        type: 'pothole',
        location: [19.0620, 72.8680],
        severity: 'high',
        description: 'Sion railway overbridge rough expansion joint bumps',
        verifiedCount: 35,
        distanceAlongRouteKm: 7.2
      }
    ],
    chargingStations: [
      {
        id: 'cs-mum-1',
        name: 'Magenta ChargeGrid — Chembur',
        location: [19.0580, 72.9050],
        availablePlugs: 3,
        totalPlugs: 4,
        powerKw: 60,
        pricePerKwh: 15.5,
        networkName: 'Magenta',
        detourTimeMin: 3,
        plugTypes: ['CCS2']
      }
    ],
    parkingLots: [
      {
        id: 'pk-mum-1',
        name: 'Vashi Station Commercial Parking',
        location: [19.0750, 72.9960],
        availableSlots: 84,
        totalSlots: 250,
        ratePerHour: 40,
        walkTimeMin: 5,
        isCovered: true
      }
    ]
  },
  {
    id: 'del-cybercity',
    cityName: 'Delhi NCR',
    originName: 'Connaught Place (Inner Circle)',
    originCoords: [28.6315, 77.2167],
    destinationName: 'DLF Cyber City Gurgaon',
    destinationCoords: [28.4950, 77.0890],
    description: 'Interstate mega-commute connecting central Delhi to Millennium City.',
    recommendedVehicle: 'auto',
    tollPlazas: [
      {
        id: 'toll-del-mcd',
        name: 'Delhi-Gurgaon Border MCD / NHAI Toll',
        location: [28.5120, 77.0980],
        distanceAlongRouteKm: 21.0,
        fastagEnabled: true,
        fee: { bike: 0, car: 65, ev: 65, auto: 20, bicycle: 0 }
      }
    ],
    hazards: [
      {
        id: 'hz-del-1',
        type: 'waterlogging',
        location: [28.5680, 77.1420],
        severity: 'high',
        description: 'Dhaula Kuan underpass drainage backflow risk during showers',
        verifiedCount: 48,
        distanceAlongRouteKm: 11.5
      }
    ],
    chargingStations: [
      {
        id: 'cs-del-1',
        name: 'BluSmart EV SuperHub — Aerocity',
        location: [28.5520, 77.1210],
        availablePlugs: 14,
        totalPlugs: 20,
        powerKw: 60,
        pricePerKwh: 13.5,
        networkName: 'BluSmart',
        detourTimeMin: 4,
        plugTypes: ['CCS2', 'Type 2']
      }
    ],
    parkingLots: [
      {
        id: 'pk-del-1',
        name: 'CyberHub Multilevel Parking Block',
        location: [28.4965, 77.0875],
        availableSlots: 140,
        totalSlots: 600,
        ratePerHour: 50,
        walkTimeMin: 3,
        isCovered: true
      }
    ]
  }
];
