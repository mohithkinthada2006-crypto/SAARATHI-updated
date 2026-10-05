import { Coordinates, CrowdsourcedReport, RoadHazardType } from '../types';

const STORAGE_KEY = 'saarathi_crowdsourced_reports_v1';

export const INITIAL_CROWD_REPORTS: CrowdsourcedReport[] = [
  {
    id: 'cr-1',
    type: 'pothole',
    title: 'Severe Rim-Bending Pothole',
    location: [17.4250, 78.4110],
    landmark: 'Opposite Jubilee Hills Metro Pillar 1402',
    timestamp: '12 mins ago',
    verifiedCount: 18,
    severity: 'high',
    reporter: 'Ramesh K. (Two-wheeler commuter)'
  },
  {
    id: 'cr-2',
    type: 'waterlogging',
    title: 'Waterlogged Underpass (1.5 ft water)',
    location: [17.4290, 78.3910],
    landmark: 'HITEC City Flyover Descent',
    timestamp: '25 mins ago',
    verifiedCount: 34,
    severity: 'high',
    reporter: 'Anita S. (EV Driver)'
  },
  {
    id: 'cr-3',
    type: 'speed_breaker',
    title: 'Unpainted Speed Breaker',
    location: [17.4380, 78.3550],
    landmark: 'Knowledge City Gate 3',
    timestamp: '1 hour ago',
    verifiedCount: 9,
    severity: 'low',
    reporter: 'Siddharth M.'
  },
  {
    id: 'cr-4',
    type: 'rough_road',
    title: 'Loose Gravel & Road Trenching',
    location: [12.9350, 77.6180],
    landmark: 'Sony World Junction, Koramangala',
    timestamp: '40 mins ago',
    verifiedCount: 27,
    severity: 'medium',
    reporter: 'Priya V.'
  },
  {
    id: 'cr-5',
    type: 'accident',
    title: 'Minor Multi-Car Collision, Left Lane Blocked',
    location: [19.0620, 72.8680],
    landmark: 'Sion Flyover Southbound',
    timestamp: '8 mins ago',
    verifiedCount: 15,
    severity: 'medium',
    reporter: 'Farhan A.'
  }
];

export function getCrowdReports(): CrowdsourcedReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return INITIAL_CROWD_REPORTS;
}

export function saveCrowdReport(newReport: Omit<CrowdsourcedReport, 'id' | 'timestamp' | 'verifiedCount'>): CrowdsourcedReport {
  const reports = getCrowdReports();
  const created: CrowdsourcedReport = {
    ...newReport,
    id: `cr-${Date.now()}`,
    timestamp: 'Just now',
    verifiedCount: 1
  };
  reports.unshift(created);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch {
    // ignore
  }
  return created;
}

export function upvoteReport(id: string): CrowdsourcedReport[] {
  const reports = getCrowdReports();
  const found = reports.find(r => r.id === id);
  if (found) {
    found.verifiedCount += 1;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch {
      // ignore
    }
  }
  return [...reports];
}
