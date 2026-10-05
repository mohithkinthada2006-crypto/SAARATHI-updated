import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  Coordinates,
  Route,
  VehicleConfig,
  RoadHazard,
  TollPlaza,
  ChargingStation
} from '../../types';

// Crisp SVG directional icons for vehicles in 3-color palette
const VEHICLE_SVGS: Record<string, string> = {
  bike: `
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="17" fill="#121824" stroke="#2563EB" stroke-width="2.5"/>
      <polygon points="20,6 24,15 16,15" fill="#2563EB"/>
      <circle cx="14" cy="25" r="3" stroke="#94A3B8" stroke-width="1.8"/>
      <circle cx="26" cy="25" r="3" stroke="#94A3B8" stroke-width="1.8"/>
      <path d="M14 25L18 19L22 25M18 19L23 19M23 19L26 25M23 19L21 15H25" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
  `,
  car: `
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="17" fill="#121824" stroke="#2563EB" stroke-width="2.5"/>
      <polygon points="20,6 24,15 16,15" fill="#2563EB"/>
      <path d="M13 25V22C13 21 14 20 15 20H25C26 20 27 21 27 22V25M13 25H27M15 25V27M25 25V27M15 17L17 14H23L25 17H15Z" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  ev: `
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="17" fill="#121824" stroke="#10B981" stroke-width="2.5"/>
      <polygon points="20,6 24,15 16,15" fill="#10B981"/>
      <path d="M21 13L15 22H20L19 28L25 19H20L21 13Z" fill="#10B981" stroke="#FFFFFF" stroke-width="0.8"/>
    </svg>
  `,
  auto: `
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="17" fill="#121824" stroke="#2563EB" stroke-width="2.5"/>
      <polygon points="20,6 24,15 16,15" fill="#2563EB"/>
      <path d="M14 25C14 21 16 16 20 16C24 16 26 21 26 25H14Z" stroke="#FFFFFF" stroke-width="1.6"/>
      <circle cx="16" cy="25" r="2" fill="#94A3B8"/>
      <circle cx="24" cy="25" r="2" fill="#94A3B8"/>
    </svg>
  `,
  bicycle: `
    <svg viewBox="0 0 40 40" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="17" fill="#121824" stroke="#10B981" stroke-width="2.5"/>
      <polygon points="20,6 24,15 16,15" fill="#10B981"/>
      <circle cx="14" cy="24" r="3" stroke="#94A3B8" stroke-width="1.6"/>
      <circle cx="26" cy="24" r="3" stroke="#94A3B8" stroke-width="1.6"/>
      <path d="M14 24L18 19L22 24M18 19L23 19" stroke="#FFFFFF" stroke-width="1.6"/>
    </svg>
  `
};

interface SaarathiMapProps {
  origin: Coordinates;
  destination: Coordinates;
  originName: string;
  destinationName: string;
  routes: Route[];
  selectedRouteId: string;
  vehicle: VehicleConfig;
  isLiveJourney: boolean;
  liveProgress: number; // 0.0 to 1.0
  liveCoordinates: Coordinates | null;
  liveBearing: number;
  followCamera: boolean;
  visibleLayers: {
    potholes: boolean;
    hazards: boolean;
    waterlogging: boolean;
    tolls: boolean;
    charging: boolean;
  };
  tollPlazas: TollPlaza[];
  roadHazards: RoadHazard[];
  chargingStations: ChargingStation[];
  onMapClick: (coords: Coordinates) => void;
  onSelectRoute: (routeId: string) => void;
  onSelectToll?: (toll: TollPlaza) => void;
  onSelectHazard?: (hazard: RoadHazard) => void;
  onSelectCharging?: (station: ChargingStation) => void;
}

export const SaarathiMap: React.FC<SaarathiMapProps> = ({
  origin,
  destination,
  originName,
  destinationName,
  routes,
  selectedRouteId,
  vehicle,
  isLiveJourney,
  liveProgress,
  liveCoordinates,
  liveBearing,
  followCamera,
  visibleLayers,
  tollPlazas,
  roadHazards,
  chargingStations,
  onMapClick,
  onSelectRoute,
  onSelectToll,
  onSelectHazard,
  onSelectCharging
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer groups
  const routesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const overlaysLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: origin,
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    // Dark OpenStreetMap raster tiles
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; OpenStreetMap contributors',
      className: 'saarathi-dark-tiles'
    }).addTo(map);

    tileLayer.on('tileerror', (error) => {
      console.warn('Map tile notice:', error);
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.attribution({ position: 'bottomleft', prefix: 'Saarathi GeoOS' }).addTo(map);

    routesLayerGroupRef.current = L.layerGroup().addTo(map);
    overlaysLayerGroupRef.current = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = L.layerGroup().addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    });

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    let resizeObserver: ResizeObserver | null = null;
    if (window.ResizeObserver && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    mapInstanceRef.current = map;

    return () => {
      clearTimeout(timer);
      if (resizeObserver) resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update routes polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routesGroup = routesLayerGroupRef.current;
    if (!map || !routesGroup) return;

    routesGroup.clearLayers();
    if (routes.length === 0) return;

    // Alternative routes
    routes.forEach(route => {
      if (route.id === selectedRouteId) return;

      const poly = L.polyline(route.coordinates, {
        color: '#475569',
        weight: 4,
        opacity: 0.5,
        dashArray: '5, 8',
        lineCap: 'round',
        lineJoin: 'round'
      });

      poly.on('click', () => onSelectRoute(route.id));
      poly.bindTooltip(
        `<div class="text-xs font-semibold px-1 py-0.5">${route.name} (${route.durationMin}m &bull; ₹${route.totalCost})</div>`,
        { sticky: true }
      );
      routesGroup.addLayer(poly);
    });

    // Selected route
    const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];
    if (activeRoute) {
      const isRecommended = activeRoute.isRecommended;
      const strokeColor = isRecommended ? '#10B981' : '#2563EB';

      // Clean underlay
      const glowPoly = L.polyline(activeRoute.coordinates, {
        color: strokeColor,
        weight: 10,
        opacity: 0.15,
        lineCap: 'round',
        lineJoin: 'round'
      });
      routesGroup.addLayer(glowPoly);

      // Core polyline
      const mainPoly = L.polyline(activeRoute.coordinates, {
        color: strokeColor,
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      });
      routesGroup.addLayer(mainPoly);

      // Live journey completed progress polyline
      if (isLiveJourney && liveCoordinates) {
        const completedIndex = Math.min(
          activeRoute.coordinates.length - 1,
          Math.floor(liveProgress * (activeRoute.coordinates.length - 1))
        );
        const completedCoords = activeRoute.coordinates.slice(0, completedIndex + 1);
        if (completedCoords.length > 1) {
          const completedPoly = L.polyline(completedCoords, {
            color: '#10B981',
            weight: 5,
            opacity: 0.9,
            lineCap: 'round'
          });
          routesGroup.addLayer(completedPoly);
        }
      }

      if (!isLiveJourney) {
        const bounds = L.latLngBounds(activeRoute.coordinates);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [routes, selectedRouteId, isLiveJourney, liveProgress, liveCoordinates]);

  // Update Origin and Destination Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // Origin Marker (Clean Blue)
    const originIcon = L.divIcon({
      className: 'custom-origin-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-lg">
            <div class="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <div class="absolute -top-6 px-1.5 py-0.5 rounded bg-[#121824] border border-[#222E42] text-[9px] font-bold text-blue-300 whitespace-nowrap shadow">
            START
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const originMarker = L.marker(origin, { icon: originIcon });
    originMarker.bindPopup(`
      <div class="p-1.5 text-slate-100">
        <div class="text-[10px] font-bold uppercase text-blue-400">Start Location</div>
        <div class="font-semibold text-xs mt-0.5">${originName}</div>
      </div>
    `);
    markersGroup.addLayer(originMarker);

    // Destination Marker (Clean Emerald)
    const destIcon = L.divIcon({
      className: 'custom-dest-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center shadow-lg">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="absolute -top-6 px-1.5 py-0.5 rounded bg-[#121824] border border-[#222E42] text-[9px] font-bold text-emerald-300 whitespace-nowrap shadow">
            DESTINATION
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const destMarker = L.marker(destination, { icon: destIcon });
    destMarker.bindPopup(`
      <div class="p-1.5 text-slate-100">
        <div class="text-[10px] font-bold uppercase text-emerald-400">Destination</div>
        <div class="font-semibold text-xs mt-0.5">${destinationName}</div>
      </div>
    `);
    markersGroup.addLayer(destMarker);
  }, [origin, destination, originName, destinationName]);

  // Update Road Hazards, Tolls, Charging Overlays
  useEffect(() => {
    const overlaysGroup = overlaysLayerGroupRef.current;
    if (!overlaysGroup) return;

    overlaysGroup.clearLayers();

    // 1. Toll Plazas
    if (visibleLayers.tolls) {
      tollPlazas.forEach(toll => {
        const fee = toll.fee[vehicle.type] || 0;
        const tollIcon = L.divIcon({
          className: 'toll-marker',
          html: `
            <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#121824] border border-[#222E42] text-slate-200 text-[10px] font-bold shadow-md">
              <span>🛣️</span>
              <span>₹${fee}</span>
            </div>
          `,
          iconSize: [50, 20],
          iconAnchor: [25, 10]
        });

        const marker = L.marker(toll.location, { icon: tollIcon });
        marker.on('click', () => onSelectToll?.(toll));
        marker.bindPopup(`
          <div class="p-1.5 text-slate-200">
            <div class="text-blue-400 text-[10px] font-bold uppercase">🛣️ Toll Plaza</div>
            <div class="font-bold text-xs text-white mt-0.5">${toll.name}</div>
            <div class="text-[11px] text-slate-300 mt-1">Fee: <strong>₹${fee}</strong></div>
          </div>
        `);
        overlaysGroup.addLayer(marker);
      });
    }

    // 2. Road Hazards
    roadHazards.forEach(hazard => {
      let isVisible = false;
      let icon = '⚠️';

      if (hazard.type === 'pothole' && visibleLayers.potholes) {
        isVisible = true;
        icon = '🕳️';
      } else if (hazard.type === 'waterlogging' && visibleLayers.waterlogging) {
        isVisible = true;
        icon = '🌊';
      } else if ((hazard.type === 'rough_road' || hazard.type === 'hazard' || hazard.type === 'speed_breaker') && visibleLayers.hazards) {
        isVisible = true;
        icon = hazard.type === 'speed_breaker' ? '⚠️' : '🚧';
      }

      if (!isVisible) return;

      const hazardIcon = L.divIcon({
        className: 'hazard-marker',
        html: `
          <div class="flex items-center justify-center w-6 h-6 rounded-full bg-[#121824] border border-[#222E42] shadow text-xs">
            ${icon}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker(hazard.location, { icon: hazardIcon });
      marker.on('click', () => onSelectHazard?.(hazard));
      marker.bindPopup(`
        <div class="p-1.5 text-slate-200">
          <div class="text-rose-400 text-[10px] font-bold uppercase">${icon} ${hazard.type.replace('_', ' ').toUpperCase()}</div>
          <div class="text-xs text-white font-medium mt-0.5">${hazard.description}</div>
          <div class="text-[10px] text-slate-400 mt-1">${hazard.verifiedCount} verified</div>
        </div>
      `);
      overlaysGroup.addLayer(marker);
    });

    // 3. Charging Stations (EV Layer)
    if (visibleLayers.charging && vehicle.type === 'ev') {
      chargingStations.forEach(cs => {
        const csIcon = L.divIcon({
          className: 'charging-marker',
          html: `
            <div class="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#121824] border border-emerald-500/50 text-emerald-300 text-[10px] font-bold shadow">
              <span>⚡</span>
              <span>${cs.powerKw}kW</span>
            </div>
          `,
          iconSize: [50, 20],
          iconAnchor: [25, 10]
        });

        const marker = L.marker(cs.location, { icon: csIcon });
        marker.on('click', () => onSelectCharging?.(cs));
        marker.bindPopup(`
          <div class="p-1.5 text-slate-200">
            <div class="text-emerald-400 text-[10px] font-bold uppercase">⚡ EV Charger</div>
            <div class="font-bold text-xs text-white mt-0.5">${cs.name}</div>
            <div class="text-[11px] text-slate-300 mt-1">${cs.powerKw} kW DC &bull; ${cs.availablePlugs} plugs open</div>
          </div>
        `);
        overlaysGroup.addLayer(marker);
      });
    }
  }, [visibleLayers, tollPlazas, roadHazards, chargingStations, vehicle.type]);

  // Handle Live Vehicle Animation & Movement
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!isLiveJourney || !liveCoordinates) {
      if (vehicleMarkerRef.current) {
        map.removeLayer(vehicleMarkerRef.current);
        vehicleMarkerRef.current = null;
      }
      return;
    }

    const svgIconHtml = VEHICLE_SVGS[vehicle.type] || VEHICLE_SVGS.bike;

    const vehicleIcon = L.divIcon({
      className: 'vehicle-marker-wrapper',
      html: `
        <div style="transform: rotate(${liveBearing}deg); transform-origin: center center;" class="filter drop-shadow-md">
          ${svgIconHtml}
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    if (!vehicleMarkerRef.current) {
      vehicleMarkerRef.current = L.marker(liveCoordinates, { icon: vehicleIcon, zIndexOffset: 1000 }).addTo(map);
    } else {
      vehicleMarkerRef.current.setLatLng(liveCoordinates);
      vehicleMarkerRef.current.setIcon(vehicleIcon);
    }

    if (followCamera) {
      map.panTo(liveCoordinates, { animate: true, duration: 0.15 });
    }
  }, [isLiveJourney, liveCoordinates, liveBearing, vehicle.type, followCamera]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
};
