import React, { useState } from 'react';
import { Coordinates } from '../../types';
import { X, Search, MapPin, Building, Landmark, Compass } from 'lucide-react';

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

  // Flatten and search
  const allPlaces = INDIAN_HUBS.flatMap(h => h.places.map(p => ({ ...p, city: h.city })));
  const filtered = query.trim()
    ? allPlaces.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.landmark.toLowerCase().includes(query.toLowerCase()) ||
        p.city.toLowerCase().includes(query.toLowerCase())
      )
    : allPlaces;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-5 text-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white font-heading">
              Select {isOrigin ? 'Starting Origin' : 'Destination Point'}
            </h3>
            <p className="text-xs text-slate-400">
              Pick a prominent Indian transit hub or landmark corridor.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="mt-3 relative">
          <input
            type="text"
            autoFocus
            placeholder="Search landmark, street, tech park..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
        </div>

        {/* Place list */}
        <div className="mt-3 space-y-2 overflow-y-auto flex-1 pr-1">
          {filtered.map((place, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelectLocation(place.name, place.coords, isOrigin);
                onClose();
              }}
              className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900 text-amber-400 group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300">
                    {place.name}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>{place.landmark}</span>
                    <span>&bull;</span>
                    <span className="text-amber-400/80 font-medium">{place.city}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-500 group-hover:text-amber-400 font-bold">
                Select &rarr;
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
