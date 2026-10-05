import React from 'react';
import { 
  Navigation, 
  Radio, 
  ShieldAlert, 
  History, 
  Settings2, 
  Layers, 
  CloudRain, 
  Sun, 
  Zap, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { WeatherReport } from '../../services/weatherService';
import { PRESET_JOURNEYS } from '../../services/demoPresets';

interface SaarathiHeaderProps {
  activeTab: 'plan' | 'live' | 'intelligence' | 'history' | 'vehicle';
  setActiveTab: (tab: 'plan' | 'live' | 'intelligence' | 'history' | 'vehicle') => void;
  selectedCityId: string;
  onSelectCityPreset: (presetId: string) => void;
  weather: WeatherReport;
  visibleLayers: {
    potholes: boolean;
    hazards: boolean;
    waterlogging: boolean;
    tolls: boolean;
    charging: boolean;
    parking: boolean;
  };
  onToggleLayer: (layer: keyof SaarathiHeaderProps['visibleLayers']) => void;
  isLiveJourney: boolean;
  onOpenAiPlanner: () => void;
}

export const SaarathiHeader: React.FC<SaarathiHeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCityId,
  onSelectCityPreset,
  weather,
  visibleLayers,
  onToggleLayer,
  isLiveJourney,
  onOpenAiPlanner
}) => {
  const [showLayerDropdown, setShowLayerDropdown] = React.useState(false);

  return (
    <header className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#0e131d]/90 backdrop-blur-md border-b border-white/10 select-none shadow-xl">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 shadow-lg shadow-amber-500/25 p-0.5">
          <div className="w-full h-full bg-[#12110e] rounded-[10px] flex items-center justify-center">
            {/* Charioteer / Compass emblem */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 4 14.5 10 20.5 12 14.5 14 12 20 9.5 14 3.5 12 9.5 10 12 4" fill="currentColor" fillOpacity="0.4" />
            </svg>
          </div>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent font-heading">
              SAARATHI
            </h1>
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 tracking-wider">
              GEO INTEL OS
            </span>
          </div>
          <p className="text-[11px] text-slate-400 tracking-wide hidden sm:block">
            Every Journey Needs a Guide.
          </p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex items-center gap-1 sm:gap-2 bg-slate-900/80 p-1 rounded-xl border border-white/5">
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            activeTab === 'plan'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Plan Journey</span>
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 relative ${
            activeTab === 'live'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${isLiveJourney ? 'text-emerald-400 animate-pulse' : ''}`} />
          <span>Live Journey</span>
          {isLiveJourney && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('intelligence')}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            activeTab === 'intelligence'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Road Intelligence</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Trip History</span>
        </button>

        <button
          onClick={() => setActiveTab('vehicle')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            activeTab === 'vehicle'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Vehicle Personalization & Settings"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Vehicle</span>
        </button>
      </nav>

      {/* Right Controls: City Preset, AI Natural Language trigger, Layers, Weather */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Natural Language AI button */}
        <button
          onClick={onOpenAiPlanner}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-600/20 text-amber-300 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/30 transition-all duration-200 shadow-md group"
          title="Natural Language AI Journey Planner"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Ask Saarathi AI</span>
        </button>

        {/* City Preset Selector */}
        <div className="relative hidden sm:block">
          <select
            value={selectedCityId}
            onChange={(e) => onSelectCityPreset(e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-700/80 rounded-lg pl-7 pr-7 py-1.5 text-xs font-medium text-slate-200 hover:border-amber-500/50 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
          >
            {PRESET_JOURNEYS.map((preset) => (
              <option key={preset.id} value={preset.id} className="bg-slate-900 text-white">
                📍 {preset.cityName} Demo
              </option>
            ))}
          </select>
          <MapPin className="w-3.5 h-3.5 text-amber-400 absolute left-2 top-2.5 pointer-events-none" />
        </div>

        {/* Layers Overlay Toggle Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayerDropdown(!showLayerDropdown)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700 hover:border-amber-500/40 text-slate-300 hover:text-white transition-colors"
            title="Toggle Map Overlays"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Layers</span>
          </button>

          {showLayerDropdown && (
            <div className="absolute right-0 mt-2 w-56 p-2 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-slate-800">
                Road Intelligence Overlays
              </div>
              <div className="mt-1 space-y-1 text-xs">
                {[
                  { key: 'potholes', label: '🕳️ Pothole Clusters', active: visibleLayers.potholes },
                  { key: 'hazards', label: '🚧 Hazards & Rough Roads', active: visibleLayers.hazards },
                  { key: 'waterlogging', label: '🌊 Monsoon Waterlogging', active: visibleLayers.waterlogging },
                  { key: 'tolls', label: '🛣️ Toll Plazas & Fees', active: visibleLayers.tolls },
                  { key: 'charging', label: '⚡ EV Superchargers', active: visibleLayers.charging },
                  { key: 'parking', label: '🅿️ Parking Availability', active: visibleLayers.parking },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => onToggleLayer(item.key as any)}
                    className="flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-left hover:bg-slate-800/80 transition-colors"
                  >
                    <span>{item.label}</span>
                    <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold ${
                      item.active ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-600'
                    }`}>
                      {item.active ? '✓' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Weather Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <span>{weather.conditionIcon}</span>
          <span className="font-semibold text-white">{weather.temperatureC}°C</span>
          <span className="text-[10px] text-slate-400">{weather.city}</span>
        </div>
      </div>
    </header>
  );
};
