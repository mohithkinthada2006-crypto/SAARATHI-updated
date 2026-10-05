import React, { useState } from 'react';
import { 
  Navigation, 
  Radio, 
  ShieldAlert, 
  History, 
  Settings2, 
  Layers, 
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
  const [showLayerDropdown, setShowLayerDropdown] = useState(false);

  return (
    <header className="relative z-20 flex items-center justify-between px-3 sm:px-5 py-2 bg-[#0B0F14]/95 backdrop-blur-md border-b border-[#222E42] select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 text-white shadow-sm shrink-0">
          <Navigation className="w-4 h-4 fill-white" />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white font-heading">
              SAARATHI
            </h1>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-600/15 text-blue-400 border border-blue-500/30">
              SMART MOBILITY
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-[#121824] p-1 rounded-xl border border-[#222E42]">
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'plan'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-[#182232]'
          }`}
        >
          <Navigation className="w-3 h-3" />
          <span>Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
            activeTab === 'live'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-[#182232]'
          }`}
        >
          <Radio className={`w-3 h-3 ${isLiveJourney ? 'text-emerald-400' : ''}`} />
          <span>Live</span>
          {isLiveJourney && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('intelligence')}
          className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'intelligence'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-[#182232]'
          }`}
        >
          <ShieldAlert className="w-3 h-3" />
          <span>Hazards</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-[#182232]'
          }`}
        >
          <History className="w-3 h-3" />
          <span>History</span>
        </button>

        <button
          onClick={() => setActiveTab('vehicle')}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'vehicle'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-[#182232]'
          }`}
          title="Vehicle Specs"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Specs</span>
        </button>
      </nav>

      {/* Right Controls: AI trigger, City presets, Layers */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Natural Language AI button */}
        <button
          onClick={onOpenAiPlanner}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/15 text-blue-300 border border-blue-500/30 hover:bg-blue-600/25 transition-all"
          title="Natural Language Query Assistant"
        >
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        {/* City Preset Selector */}
        <div className="relative hidden md:block">
          <select
            value={selectedCityId}
            onChange={(e) => onSelectCityPreset(e.target.value)}
            className="appearance-none bg-[#121824] border border-[#222E42] rounded-lg pl-6 pr-6 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 focus:outline-none cursor-pointer"
          >
            {PRESET_JOURNEYS.map((preset) => (
              <option key={preset.id} value={preset.id} className="bg-[#121824] text-white">
                {preset.cityName} Demo
              </option>
            ))}
          </select>
          <MapPin className="w-3 h-3 text-blue-400 absolute left-2 top-2 pointer-events-none" />
        </div>

        {/* Layers Overlay Toggle Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayerDropdown(!showLayerDropdown)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-[#121824] border border-[#222E42] text-slate-300 hover:text-white transition-colors"
            title="Toggle Map Layers"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden lg:inline">Layers</span>
          </button>

          {showLayerDropdown && (
            <div className="absolute right-0 mt-2 w-52 p-2 rounded-xl bg-[#121824] border border-[#222E42] shadow-2xl z-50 animate-in fade-in">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 border-b border-[#222E42]">
                Map Overlays
              </div>
              <div className="mt-1 space-y-1 text-xs">
                {[
                  { key: 'potholes', label: '🕳️ Potholes', active: visibleLayers.potholes },
                  { key: 'hazards', label: '🚧 Rough Roads', active: visibleLayers.hazards },
                  { key: 'waterlogging', label: '🌊 Waterlogging', active: visibleLayers.waterlogging },
                  { key: 'tolls', label: '🛣️ Toll Plazas', active: visibleLayers.tolls },
                  { key: 'charging', label: '⚡ EV Chargers', active: visibleLayers.charging }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => onToggleLayer(item.key as any)}
                    className="flex items-center justify-between w-full px-2 py-1 rounded-lg text-left hover:bg-[#182232] transition-colors"
                  >
                    <span>{item.label}</span>
                    <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold ${
                      item.active ? 'bg-blue-600 text-white' : 'bg-[#182232] text-slate-500'
                    }`}>
                      {item.active ? '✓' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
