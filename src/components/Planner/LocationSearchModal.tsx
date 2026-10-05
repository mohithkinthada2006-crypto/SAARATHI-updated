import React, { useState } from 'react';
import { Coordinates } from '../../types';
import { X, Search, MapPin } from 'lucide-react';

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (name: string, coords: Coordinates, isOrigin: boolean) => void;
  isOrigin: boolean;
  cityName: string;
}

const INDIAN_HUBS: { city: string; places: { name: string; landmark: string; coords: Coordinates }[] }[] = [
  {
    city: 'Hyderabad',
    places: [
      { name: 'Banjara Hills (Rd No. 12)', landmark: 'Near MLA Colony', coords: [17.4156, 78.4354] },
      { name: 'Gachibowli Financial District', landmark: 'T-Hub & Knowledge City', coords: [17.4401, 78.3489] },
      { name: 'Jubilee Hills Check Post', landmark: 'Metro Pillar 1402', coords: [17.4290, 78.4110] },
      { name: 'RGIA International Airport', landmark: 'Shamshabad Corridor', coords: [17.2403, 78.4294] },
      { name: 'HITEC City Cyber Towers', landmark: 'Mindspace IT Park', coords: [17.4504, 78.3808] },
      { name: 'Charminar Heritage Zone', landmark: 'Old City Corridor', coords: [17.3616, 78.4747] }
    ]
  },
  {
    city: 'Bengaluru',
    places: [
      { name: 'MG Road (Cubbon Park)', landmark: 'Central Business District', coords: [12.9766, 77.5993] },
      { name: 'Electronic City Phase 1', landmark: 'Infosys Gate 1', coords: [12.8452, 77.6602] },
      { name: 'Koramangala Sony World', landmark: '100ft Road', coords: [12.9350, 77.6180] },
      { name: 'Kempegowda Int. Airport', landmark: 'Devanahalli Tollway', coords: [13.1986, 77.7066] },
      { name: 'Whitefield ITPL', landmark: 'Pattandur Agrahara', coords: [12.9863, 77.7380] }
    ]
  },
  {
    city: 'Chennai',
    places: [
      { name: 'Guindy Olympia Tech Park', landmark: 'Kathipara Junction', coords: [13.0067, 80.2026] },
      { name: 'ECR Kovalam Beach', landmark: 'East Coast Highway', coords: [12.7932, 80.2483] },
      { name: 'OMR Rajiv Gandhi Expressway', landmark: 'Sholinganallur Hub', coords: [12.9010, 80.2279] },
      { name: 'Marina Beach Promenade', landmark: 'Santhome High Road', coords: [13.0499, 80.2824] }
    ]
  },
  {
    city: 'Mumbai',
    places: [
      { name: 'Bandra West Linking Road', landmark: 'Near Bandra Station', coords: [19.0596, 72.8295] },
      { name: 'Navi Mumbai Vashi Plaza', landmark: 'Sion-Panvel Tollway', coords: [19.0770, 72.9986] },
      { name: 'Bandra Kurla Complex (BKC)', landmark: 'NSE Gateway', coords: [19.0664, 72.8687] },
      { name: 'Chhatrapati Shivaji Terminal', landmark: 'South Mumbai', coords: [18.9400, 72.8354] }
    ]
  },
  {
    city: 'Delhi NCR',
    places: [
      { name: 'Connaught Place (CP)', landmark: 'Inner Circle Block B', coords: [28.6315, 77.2167] },
      { name: 'DLF Cyber City Gurgaon', landmark: 'CyberHub Phase 2', coords: [28.4950, 77.0890] },
      { name: 'IGI Airport Terminal 3', landmark: 'Aerocity Corridor', coords: [28.5562, 77.1000] },
      { name: 'Noida Sector 62 Hub', landmark: 'Electronic City Metro', coords: [28.6280, 77.3649] }
    ]
  }
];

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  isOrigin,
  cityName
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const allPlaces = INDIAN_HUBS.flatMap(h => h.places.map(p => ({ ...p, city: h.city })));
  const filtered = query.trim()
    ? allPlaces.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.landmark.toLowerCase().includes(query.toLowerCase()) ||
        p.city.toLowerCase().includes(query.toLowerCase())
      )
    : allPlaces;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#121824] border border-[#222E42] rounded-2xl shadow-2xl overflow-hidden p-4 text-slate-100 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#222E42]">
          <div>
            <h3 className="font-bold text-sm text-white font-heading">
              Select {isOrigin ? 'Start Location' : 'Destination'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by area, landmark or city..."
            autoFocus
            className="w-full bg-[#0B0F14] border border-[#222E42] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Results List */}
        <div className="mt-2.5 flex-1 overflow-y-auto space-y-1 pr-0.5">
          {filtered.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectLocation(item.name, item.coords, isOrigin);
                onClose();
              }}
              className="w-full text-left p-2.5 rounded-xl hover:bg-[#182232] border border-transparent hover:border-[#222E42] transition-colors flex items-start gap-2.5 group"
            >
              <div className="p-1.5 rounded-lg bg-[#0B0F14] text-blue-400 shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-white truncate">{item.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{item.landmark} &bull; <strong className="text-slate-300">{item.city}</strong></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
