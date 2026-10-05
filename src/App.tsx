import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Coordinates, 
  VehicleType, 
  VehicleConfig, 
  JourneyMode, 
  Route, 
  NaturalLanguageConstraint, 
  CrowdsourcedReport, 
  TripHistoryItem,
  TollPlaza,
  RoadHazard,
  ChargingStation,
  ParkingLot
} from './types';
import { DEFAULT_VEHICLE_CONFIGS, loadVehicleConfigs, saveVehicleConfigs } from './services/vehicleDefaults';
import { PRESET_JOURNEYS, PresetJourney } from './services/demoPresets';
import { generateCandidateRoutes } from './services/routingService';
import { getWeatherForLocation } from './services/weatherService';
import { getCrowdReports, saveCrowdReport, upvoteReport } from './services/crowdReports';
import { getTripHistory, saveCompletedTrip } from './services/tripHistory';
import { useLiveJourney } from './hooks/useLiveJourney';

// UI Components
import { SaarathiHeader } from './components/Navigation/SaarathiHeader';
import { SaarathiMap } from './components/Map/SaarathiMap';
import { DestinationCard } from './components/Planner/DestinationCard';
import { VehicleSelector } from './components/Planner/VehicleSelector';
import { JourneyModeSelector } from './components/Planner/JourneyModeSelector';
import { RouteCard } from './components/Planner/RouteCard';
import { RouteComparisonModal } from './components/Planner/RouteComparisonModal';
import { NaturalLanguagePlanner } from './components/AI/NaturalLanguagePlanner';
import { LiveJourneyHUD } from './components/LiveJourney/LiveJourneyHUD';
import { TripSummaryModal } from './components/Summary/TripSummaryModal';
import { RoadIntelligenceDrawer } from './components/RoadIntelligence/RoadIntelligenceDrawer';
import { ReportHazardModal } from './components/RoadIntelligence/ReportHazardModal';
import { TripHistoryDrawer } from './components/History/TripHistoryDrawer';
import { VehicleSettingsModal } from './components/Vehicle/VehicleSettingsModal';
import { LocationSearchModal } from './components/Planner/LocationSearchModal';
import { Sparkles, SlidersHorizontal, Table, MapPin, Compass } from 'lucide-react';

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'plan' | 'live' | 'intelligence' | 'history' | 'vehicle'>('plan');
  const [selectedCityId, setSelectedCityId] = useState<string>('hyd-gachibowli');

  // Vehicle State
  const [vehicleConfigs, setVehicleConfigs] = useState<Record<VehicleType, VehicleConfig>>(loadVehicleConfigs());
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>('bike');
  const activeVehicle = vehicleConfigs[selectedVehicleType];

  // Journey Optimization Mode
  const [journeyMode, setJourneyMode] = useState<JourneyMode>('balanced');

  // Locations State (Default to Hyderabad demo preset)
  const currentPreset = useMemo(() => {
    return PRESET_JOURNEYS.find(p => p.id === selectedCityId) || PRESET_JOURNEYS[0];
  }, [selectedCityId]);

  const [originCoords, setOriginCoords] = useState<Coordinates>(currentPreset.originCoords);
  const [originName, setOriginName] = useState<string>(currentPreset.originName);
  const [destCoords, setDestCoords] = useState<Coordinates>(currentPreset.destinationCoords);
  const [destName, setDestName] = useState<string>(currentPreset.destinationName);

  // Overlays / Layers State
  const [visibleLayers, setVisibleLayers] = useState({
    potholes: true,
    hazards: true,
    waterlogging: true,
    tolls: true,
    charging: true,
    parking: true
  });

  // Modals & Drawers State
  const [isAiPlannerOpen, setIsAiPlannerOpen] = useState<boolean>(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [isVehicleSettingsOpen, setIsVehicleSettingsOpen] = useState<boolean>(false);
  const [isReportHazardOpen, setIsReportHazardOpen] = useState<boolean>(false);
  const [isLocationSearchOpen, setIsLocationSearchOpen] = useState<boolean>(false);
  const [searchIsOrigin, setSearchIsOrigin] = useState<boolean>(false);
  const [isTripSummaryOpen, setIsTripSummaryOpen] = useState<boolean>(false);

  // Completed trip stats for summary modal
  const [completedStats, setCompletedStats] = useState<any>(null);

  // Crowdsourced Reports & Trip History
  const [crowdReports, setCrowdReports] = useState<CrowdsourcedReport[]>(getCrowdReports());
  const [tripHistoryList, setTripHistoryList] = useState<TripHistoryItem[]>(getTripHistory());

  // Weather Intelligence
  const weather = useMemo(() => {
    return getWeatherForLocation(currentPreset.cityName);
  }, [currentPreset.cityName]);

  // Generate candidate routes dynamically
  const candidateRoutes = useMemo(() => {
    return generateCandidateRoutes(
      originCoords,
      destCoords,
      activeVehicle,
      journeyMode,
      currentPreset.tollPlazas,
      currentPreset.hazards
    );
  }, [originCoords, destCoords, activeVehicle, journeyMode, currentPreset]);

  // Selected route ID
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-b');

  // Ensure selected route is valid
  useEffect(() => {
    if (candidateRoutes.length > 0) {
      const exists = candidateRoutes.some(r => r.id === selectedRouteId);
      if (!exists) {
        setSelectedRouteId(candidateRoutes[0].id);
      }
    }
  }, [candidateRoutes, selectedRouteId]);

  const activeRoute = useMemo(() => {
    return candidateRoutes.find(r => r.id === selectedRouteId) || candidateRoutes[0] || null;
  }, [candidateRoutes, selectedRouteId]);

  // Callback when journey simulation finishes
  const handleJourneyCompleted = useCallback((stats: any) => {
    setCompletedStats(stats);
    setIsTripSummaryOpen(true);
  }, []);

  // Live Journey Hook
  const liveJourney = useLiveJourney(
    activeRoute,
    activeVehicle,
    candidateRoutes,
    (newRouteId) => setSelectedRouteId(newRouteId),
    handleJourneyCompleted
  );

  // Switch City Preset
  const handleSelectCityPreset = (presetId: string) => {
    const preset = PRESET_JOURNEYS.find(p => p.id === presetId);
    if (preset) {
      setSelectedCityId(presetId);
      setOriginCoords(preset.originCoords);
      setOriginName(preset.originName);
      setDestCoords(preset.destinationCoords);
      setDestName(preset.destinationName);
      setSelectedVehicleType(preset.recommendedVehicle);
      liveJourney.resetJourney();
    }
  };

  // Map Click Handler (sets destination directly)
  const handleMapClick = (coords: Coordinates) => {
    if (activeTab === 'live' && liveJourney.isPlaying) return; // don't interrupt active live journey
    setDestCoords(coords);
    setDestName(`Custom Map Pin (${coords[0].toFixed(3)}, ${coords[1].toFixed(3)})`);
    liveJourney.resetJourney();
  };

  // Start Live Journey
  const handleStartJourney = () => {
    setActiveTab('live');
    if (!liveJourney.isPlaying) {
      liveJourney.togglePlay();
    }
  };

  // Toggle Layer
  const handleToggleLayer = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  // Upvote Crowdsourced Report
  const handleUpvoteReport = (id: string) => {
    const updated = upvoteReport(id);
    setCrowdReports(updated);
  };

  // Submit New Road Hazard
  const handleSubmitHazard = (reportData: any) => {
    const created = saveCrowdReport(reportData);
    setCrowdReports([created, ...crowdReports]);
  };

  // Apply NLP Constraints
  const handleApplyAiConstraints = (constraints: NaturalLanguageConstraint) => {
    if (constraints.detectedVehicle) {
      setSelectedVehicleType(constraints.detectedVehicle);
    }
    if (constraints.priority) {
      setJourneyMode(constraints.priority);
    }
    if (constraints.avoidTolls) {
      setJourneyMode('cheapest');
    }
  };

  // Save Configs
  const handleSaveVehicleConfigs = (newConfigs: Record<VehicleType, VehicleConfig>) => {
    setVehicleConfigs(newConfigs);
    saveVehicleConfigs(newConfigs);
  };

  // Save Trip to History
  const handleSaveToHistory = () => {
    if (!activeRoute) return;
    const item = saveCompletedTrip({
      date: 'Just now',
      originName,
      destinationName: destName,
      vehicleType: selectedVehicleType,
      distanceKm: activeRoute.distanceKm,
      durationMin: activeRoute.durationMin,
      totalCost: activeRoute.totalCost,
      saarathiScore: activeRoute.saarathiScore,
      savingsVsFastest: Math.max(40, Math.round(activeRoute.totalCost * 0.3)),
      routeName: activeRoute.name,
      roadQualityScore: activeRoute.roadQualityScore
    });
    setTripHistoryList([item, ...tripHistoryList]);
  };

  // Re-open trip from history
  const handleOpenPreviousTrip = (item: TripHistoryItem) => {
    setSelectedVehicleType(item.vehicleType);
    setActiveTab('plan');
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#0b0f17] text-slate-100 overflow-hidden select-none">
      {/* 1. MAIN GLOBAL HEADER */}
      <SaarathiHeader
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'vehicle') {
            setIsVehicleSettingsOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        selectedCityId={selectedCityId}
        onSelectCityPreset={handleSelectCityPreset}
        weather={weather}
        visibleLayers={visibleLayers}
        onToggleLayer={handleToggleLayer}
        isLiveJourney={liveJourney.isPlaying || activeTab === 'live'}
        onOpenAiPlanner={() => setIsAiPlannerOpen(true)}
      />

      {/* 2. MAIN MAP VIEWPORT & FLOATING WORKSPACE */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Full-bleed interactive map */}
        <SaarathiMap
          origin={originCoords}
          destination={destCoords}
          originName={originName}
          destinationName={destName}
          routes={candidateRoutes}
          selectedRouteId={selectedRouteId}
          vehicle={activeVehicle}
          isLiveJourney={activeTab === 'live'}
          liveProgress={liveJourney.progress}
          liveCoordinates={liveJourney.currentCoords}
          liveBearing={liveJourney.bearing}
          followCamera={liveJourney.followCamera}
          visibleLayers={visibleLayers}
          tollPlazas={currentPreset.tollPlazas}
          roadHazards={currentPreset.hazards}
          chargingStations={currentPreset.chargingStations}
          parkingLots={currentPreset.parkingLots}
          onMapClick={handleMapClick}
          onSelectRoute={(id) => setSelectedRouteId(id)}
        />

        {/* TAB 1: PLAN JOURNEY FLOATING LEFT SIDEBAR */}
        {activeTab === 'plan' && (
          <aside className="absolute top-4 left-4 z-20 w-[94%] sm:w-[410px] max-h-[calc(100vh-80px)] overflow-y-auto space-y-3 pointer-events-auto pr-1">
            {/* Origin & Destination Card */}
            <DestinationCard
              originName={originName}
              destinationName={destName}
              routes={candidateRoutes}
              selectedRoute={activeRoute}
              vehicle={activeVehicle}
              onPlanJourney={() => {}}
              onStartJourney={handleStartJourney}
              onOpenLocationSearch={() => {
                setSearchIsOrigin(false);
                setIsLocationSearchOpen(true);
              }}
            />

            {/* Vehicle Selector */}
            <VehicleSelector
              selectedType={selectedVehicleType}
              configs={vehicleConfigs}
              onSelectVehicle={(type) => setSelectedVehicleType(type)}
              onOpenSettings={() => setIsVehicleSettingsOpen(true)}
            />

            {/* Optimization Priority */}
            <JourneyModeSelector
              currentMode={journeyMode}
              onSelectMode={(mode) => setJourneyMode(mode)}
            />

            {/* Routes List Header & Multi-route matrix button */}
            <div className="flex items-center justify-between px-1 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span>Evaluated Routes</span>
                <span className="text-amber-400 font-mono">({candidateRoutes.length})</span>
              </span>

              <button
                onClick={() => setIsComparisonOpen(true)}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <Table className="w-3.5 h-3.5" />
                <span>Compare Matrix</span>
              </button>
            </div>

            {/* Candidate Route Cards */}
            <div className="space-y-2.5 pb-4">
              {candidateRoutes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  isSelected={route.id === selectedRouteId}
                  vehicle={activeVehicle}
                  onSelect={() => setSelectedRouteId(route.id)}
                  onStartJourney={handleStartJourney}
                />
              ))}
            </div>
          </aside>
        )}

        {/* TAB 2: LIVE JOURNEY HUD OVERLAY */}
        {activeTab === 'live' && activeRoute && (
          <LiveJourneyHUD
            route={activeRoute}
            vehicle={activeVehicle}
            isPlaying={liveJourney.isPlaying}
            playbackSpeed={liveJourney.playbackSpeed}
            progress={liveJourney.progress}
            bearing={liveJourney.bearing}
            currentSpeedKmh={liveJourney.currentSpeedKmh}
            followCamera={liveJourney.followCamera}
            accumulatedCost={liveJourney.accumulatedCost}
            activeAlert={liveJourney.activeAlert}
            dynamicReroute={liveJourney.dynamicReroute}
            isOffRoute={liveJourney.isOffRoute}
            isRecalculating={liveJourney.isRecalculating}
            remainingDistanceKm={liveJourney.remainingDistanceKm}
            remainingDurationMin={liveJourney.remainingDurationMin}
            onTogglePlay={liveJourney.togglePlay}
            onReset={liveJourney.resetJourney}
            onSetSpeed={liveJourney.setPlaybackSpeed}
            onToggleFollowCamera={() => liveJourney.setFollowCamera(!liveJourney.followCamera)}
            onAcceptReroute={liveJourney.acceptReroute}
            onDismissReroute={liveJourney.dismissReroute}
            onSimulateOffRoute={liveJourney.simulateOffRoute}
            onEndJourney={() => {
              liveJourney.resetJourney();
              setActiveTab('plan');
            }}
          />
        )}

        {/* TAB 3: ROAD INTELLIGENCE DRAWER */}
        {activeTab === 'intelligence' && (
          <div className="absolute top-4 left-4 z-20 w-[94%] sm:w-[480px] max-h-[calc(100vh-80px)] pointer-events-auto">
            <RoadIntelligenceDrawer
              reports={crowdReports}
              onUpvoteReport={handleUpvoteReport}
              onOpenReportModal={() => setIsReportHazardOpen(true)}
              weather={weather}
              visibleLayers={visibleLayers}
              onToggleLayer={handleToggleLayer}
              baseDurationMin={activeRoute?.durationMin || 32}
            />
          </div>
        )}

        {/* TAB 4: TRIP HISTORY DRAWER */}
        {activeTab === 'history' && (
          <div className="absolute top-4 left-4 z-20 w-[94%] sm:w-[460px] max-h-[calc(100vh-80px)] pointer-events-auto">
            <TripHistoryDrawer
              historyItems={tripHistoryList}
              onOpenTrip={handleOpenPreviousTrip}
            />
          </div>
        )}
      </div>

      {/* 3. MODALS & OVERLAYS */}
      {/* Natural Language AI Planner Modal */}
      <NaturalLanguagePlanner
        isOpen={isAiPlannerOpen}
        onClose={() => setIsAiPlannerOpen(false)}
        onApplyConstraints={handleApplyAiConstraints}
      />

      {/* Multi-Route Matrix Comparison Modal */}
      <RouteComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        routes={candidateRoutes}
        selectedRouteId={selectedRouteId}
        onSelectRoute={(id) => setSelectedRouteId(id)}
        onStartJourney={handleStartJourney}
        vehicle={activeVehicle}
      />

      {/* Vehicle Settings / Personalization Modal */}
      <VehicleSettingsModal
        isOpen={isVehicleSettingsOpen}
        onClose={() => setIsVehicleSettingsOpen(false)}
        activeType={selectedVehicleType}
        configs={vehicleConfigs}
        onSaveConfigs={handleSaveVehicleConfigs}
      />

      {/* Report Live Road Hazard Modal */}
      <ReportHazardModal
        isOpen={isReportHazardOpen}
        onClose={() => setIsReportHazardOpen(false)}
        currentCoordinates={destCoords}
        onSubmitReport={handleSubmitHazard}
      />

      {/* Location / Destination Search Modal */}
      <LocationSearchModal
        isOpen={isLocationSearchOpen}
        onClose={() => setIsLocationSearchOpen(false)}
        isOrigin={searchIsOrigin}
        cityName={currentPreset.cityName}
        onSelectLocation={(name, coords, isOrigin) => {
          if (isOrigin) {
            setOriginName(name);
            setOriginCoords(coords);
          } else {
            setDestName(name);
            setDestCoords(coords);
          }
          liveJourney.resetJourney();
        }}
      />

      {/* Trip Completed Summary Modal */}
      {completedStats && activeRoute && (
        <TripSummaryModal
          isOpen={isTripSummaryOpen}
          onClose={() => {
            setIsTripSummaryOpen(false);
            setActiveTab('plan');
          }}
          route={activeRoute}
          vehicle={activeVehicle}
          stats={completedStats}
          onSaveToHistory={handleSaveToHistory}
          onPlanAnother={() => {
            setIsTripSummaryOpen(false);
            liveJourney.resetJourney();
            setActiveTab('plan');
          }}
        />
      )}
    </div>
  );
}

export default App;
