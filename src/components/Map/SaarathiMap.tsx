import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import {
  Coordinates,
  Route,
  VehicleConfig,
  RoadHazard,
  TollPlaza,
  ChargingStation,
  ParkingLot
} from '../../types';

// SVG icons for vehicles with glowing directional indicators
const VEHICLE_SVGS: Record<string, string> = {
  bike: `
    <svg viewBox="0 0 40 40" width="38" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#1E1B18" stroke="#F59E0B" stroke-width="2.5"/>
      <circle cx="20" cy="20" r="14" fill="#2E2415"/>
      <path d="M20 7L24 16H16L20 7Z" fill="#F59E0B"/>
      <!-- Bike glyph -->
      <circle cx="14" cy="25" r="3.5" stroke="#FDE68A" stroke-width="1.8"/>
      <circle cx="26" cy="25" r="3.5" stroke="#FDE68A" stroke-width="1.8"/>
      <path d="M14 25L18 19L22 25M18 19L23 19M23 19L26 25M23 19L21 15H25" stroke="#FFF" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `,
  car: `
    <svg viewBox="0 0 40 40" width="38" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#181E29" stroke="#3B82F6" stroke-width="2.5"/>
      <circle cx="20" cy="20" r="14" fill="#1E2A40"/>
      <path d="M20 7L24 16H16L20 7Z" fill="#60A5FA"/>
      <!-- Car glyph -->
      <path d="M13 26V23C13 22 14 21 15 21H25C26 21 27 22 27 23V26M13 26H27M15 26V28M25 26V28M15 18L17 15H23L25 18H15Z" stroke="#FFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  ev: `
    <svg viewBox="0 0 40 40" width="38" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#0E231F" stroke="#10B981" stroke-width="2.5"/>
      <circle cx="20" cy="20" r="14" fill="#13362E"/>
      <path d="M20 7L24 16H16L20 7Z" fill="#34D399"/>
      <!-- EV Zap glyph -->
      <path d="M21 13L15 22H20L19 28L25 19H20L21 13Z" fill="#6EE7B7" stroke="#047857" stroke-width="0.8"/>
    </svg>
  `,
  auto: `
    <svg viewBox="0 0 40 40" width="38" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#292015" stroke="#F97316" stroke-width="2.5"/>
      <circle cx="20" cy="20" r="14" fill="#3D2E19"/>
      <path d="M20 7L24 16H16L20 7Z" fill="#FB923C"/>
      <!-- Auto Rickshaw glyph -->
      <path d="M14 26C14 22 16 16 20 16C24 16 26 22 26 26H14Z" stroke="#FFF" stroke-width="1.8"/>
      <circle cx="16" cy="26" r="2.5" fill="#FED7AA"/>
      <circle cx="24" cy="26" r="2.5" fill="#FED7AA"/>
    </svg>
  `,
  bicycle: `
    <svg viewBox="0 0 40 40" width="38" height="38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#162723" stroke="#14B8A6" stroke-width="2.5"/>
      <circle cx="20" cy="20" r="14" fill="#1B3832"/>
      <path d="M20 7L24 16H16L20 7Z" fill="#2DD4BF"/>
      <circle cx="14" cy="24" r="3.2" stroke="#CCFBF1" stroke-width="1.8"/>
      <circle cx="26" cy="24" r="3.2" stroke="#CCFBF1" stroke-width="1.8"/>
      <path d="M14 24L18 19L22 24M18 19L23 19" stroke="#FFF" stroke-width="1.8"/>
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
    parking: boolean;
  };
  tollPlazas: TollPlaza[];
  roadHazards: RoadHazard[];
  chargingStations: ChargingStation[];
  parkingLots: ParkingLot[];
  onMapClick: (coords: Coordinates) => void;
  onSelectRoute: (routeId: string) => void;
  onSelectToll?: (toll: TollPlaza) => void;
  onSelectHazard?: (hazard: RoadHazard) => void;
  onSelectCharging?: (station: ChargingStation) => void;
  onSelectParking?: (parking: ParkingLot) => void;
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
  parkingLots,
  onMapClick,
  onSelectRoute,
  onSelectToll,
  onSelectHazard,
  onSelectCharging,
  onSelectParking
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer groups for clean, high-performance updates
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

    // Reliable OpenStreetMap raster tiles with dark styling filter
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      className: 'saarathi-dark-tiles'
    }).addTo(map);

    tileLayer.on('tileerror', (error) => {
      console.warn('OpenStreetMap tile notice:', error);
    });

    // Zoom controls at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Attribution control
    L.control.attribution({ position: 'bottomleft', prefix: 'Saarathi GeoOS' }).addTo(map);

    // Create layer groups
    routesLayerGroupRef.current = L.layerGroup().addTo(map);
    overlaysLayerGroupRef.current = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = L.layerGroup().addTo(map);

    // Handle clicks on map
    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    });

    // Ensure map tiles and container dimensions calculate properly
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    // Setup ResizeObserver to guarantee full-bleed map rendering on any layout change
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

    // Render alternative routes first (behind active route)
    routes.forEach(route => {
      if (route.id === selectedRouteId) return;

      const poly = L.polyline(route.coordinates, {
        color: '#475569',
        weight: 5,
        opacity: 0.65,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round'
      });

      poly.on('click', () => onSelectRoute(route.id));
      poly.bindTooltip(
        `<div class="text-xs font-semibold px-1 py-0.5">${route.name} (${route.durationMin}m &bull; ₹${route.totalCost})</div>`,
        { sticky: true, className: 'leaflet-custom-tooltip' }
      );
      routesGroup.addLayer(poly);
    });

    // Render selected active route with glowing double polyline
    const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];
    if (activeRoute) {
      // Glow underlay
      const glowPoly = L.polyline(activeRoute.coordinates, {
        color: '#F59E0B',
        weight: 12,
        opacity: 0.22,
        lineCap: 'round',
        lineJoin: 'round'
      });
      routesGroup.addLayer(glowPoly);

      // Core crisp polyline
      const mainPoly = L.polyline(activeRoute.coordinates, {
        color: '#F59E0B',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      });
      routesGroup.addLayer(mainPoly);

      // In live journey, shade completed portion
      if (isLiveJourney && liveCoordinates) {
        const completedIndex = Math.min(
          activeRoute.coordinates.length - 1,
          Math.floor(liveProgress * (activeRoute.coordinates.length - 1))
        );
        const completedCoords = activeRoute.coordinates.slice(0, completedIndex + 1);
        if (completedCoords.length > 1) {
          const completedPoly = L.polyline(completedCoords, {
            color: '#10B981',
            weight: 6,
            opacity: 0.9,
            lineCap: 'round'
          });
          routesGroup.addLayer(completedPoly);
        }
      }

      // Auto-fit bounds if not in live journey follow mode
      if (!isLiveJourney) {
        const bounds = L.latLngBounds(activeRoute.coordinates);
        map.fitBounds(bounds, { padding: [70, 70], maxZoom: 15 });
      }
    }
  }, [routes, selectedRouteId, isLiveJourney, liveProgress, liveCoordinates]);

  // Update Origin and Destination Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // Origin Marker
    const originIcon = L.divIcon({
      className: 'custom-origin-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center animate-ping absolute"></div>
          <div class="w-8 h-8 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
          <div class="absolute -top-7 px-2 py-0.5 rounded-md bg-slate-900/90 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 whitespace-nowrap shadow-md">
            START
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const originMarker = L.marker(origin, { icon: originIcon });
    originMarker.bindPopup(`
      <div class="p-2 text-slate-100">
        <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Journey Origin</div>
        <div class="font-semibold text-sm mt-0.5">${originName}</div>
      </div>
    `);
    markersGroup.addLayer(originMarker);

    // Destination Marker
    const destIcon = L.divIcon({
      className: 'custom-dest-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-9 h-9 rounded-full bg-amber-500/25 flex items-center justify-center animate-ping absolute"></div>
          <div class="w-9 h-9 rounded-full bg-amber-950 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/40">
            <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="absolute -top-7 px-2 py-0.5 rounded-md bg-slate-900/90 border border-amber-500/40 text-[10px] font-bold text-amber-300 whitespace-nowrap shadow-md">
            DESTINATION
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const destMarker = L.marker(destination, { icon: destIcon });
    destMarker.bindPopup(`
      <div class="p-2 text-slate-100">
        <div class="text-[10px] font-bold uppercase tracking-wider text-amber-400">Final Destination</div>
        <div class="font-semibold text-sm mt-0.5">${destinationName}</div>
      </div>
    `);
    markersGroup.addLayer(destMarker);
  }, [origin, destination, originName, destinationName]);

  // Update Road Intelligence Overlays (Tolls, Hazards, Charging, Parking)
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
            <div class="relative group cursor-pointer transition-transform hover:scale-110">
              <div class="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-950/90 border border-amber-400/80 shadow-lg text-amber-300 text-[11px] font-bold">
                <span>🛣️</span>
                <span>₹${fee}</span>
              </div>
            </div>
          `,
          iconSize: [60, 24],
          iconAnchor: [30, 12]
        });

        const marker = L.marker(toll.location, { icon: tollIcon });
        marker.on('click', () => onSelectToll?.(toll));
        marker.bindPopup(`
          <div class="p-2 text-slate-200">
            <div class="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase">
              <span>🛣️</span> Toll Plaza
            </div>
            <div class="font-bold text-sm text-white mt-1">${toll.name}</div>
            <div class="text-xs text-slate-300 mt-1">Vehicle Fee: <span class="font-bold text-amber-400">₹${fee}</span></div>
            <div class="text-[11px] text-emerald-400 mt-0.5">${toll.fastagEnabled ? '✓ FASTag Auto-Debit Enabled' : 'Cash / FASTag'}</div>
          </div>
        `);
        overlaysGroup.addLayer(marker);
      });
    }

    // 2. Road Hazards (Potholes, Waterlogging, Rough Roads, Speed Breakers)
    roadHazards.forEach(hazard => {
      let isVisible = false;
      let badgeBg = 'bg-red-950/90 border-red-500/80 text-red-300';
      let icon = '⚠️';

      if (hazard.type === 'pothole' && visibleLayers.potholes) {
        isVisible = true;
        badgeBg = 'bg-rose-950/90 border-rose-500/80 text-rose-300';
        icon = '🕳️';
      } else if (hazard.type === 'waterlogging' && visibleLayers.waterlogging) {
        isVisible = true;
        badgeBg = 'bg-sky-950/90 border-sky-400/80 text-sky-300';
        icon = '🌊';
      } else if ((hazard.type === 'rough_road' || hazard.type === 'hazard' || hazard.type === 'speed_breaker') && visibleLayers.hazards) {
        isVisible = true;
        badgeBg = 'bg-amber-950/90 border-amber-500/80 text-amber-300';
        icon = hazard.type === 'speed_breaker' ? '⚠️' : '🚧';
      }

      if (!isVisible) return;

      const hazardIcon = L.divIcon({
        className: 'hazard-marker',
        html: `
          <div class="relative group cursor-pointer transition-transform hover:scale-125">
            <div class="flex items-center justify-center w-7 h-7 rounded-full ${badgeBg} border shadow-lg text-xs">
              ${icon}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(hazard.location, { icon: hazardIcon });
      marker.on('click', () => onSelectHazard?.(hazard));
      marker.bindPopup(`
        <div class="p-2 text-slate-200">
          <div class="flex items-center gap-1.5 text-xs font-bold uppercase text-red-400">
            <span>${icon}</span> ${hazard.type.replace('_', ' ').toUpperCase()}
          </div>
          <div class="text-xs text-white font-medium mt-1">${hazard.description}</div>
          <div class="flex items-center justify-between text-[11px] text-slate-400 mt-2 border-t border-slate-700/60 pt-1">
            <span>Severity: <strong class="text-amber-300">${hazard.severity.toUpperCase()}</strong></span>
            <span class="text-emerald-400 font-semibold">✓ ${hazard.verifiedCount} users verified</span>
          </div>
        </div>
      `);
      overlaysGroup.addLayer(marker);
    });

    // 3. Charging Stations (EV Layer)
    if (visibleLayers.charging) {
      chargingStations.forEach(cs => {
        const csIcon = L.divIcon({
          className: 'charging-marker',
          html: `
            <div class="relative group cursor-pointer transition-transform hover:scale-110">
              <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-400 shadow-md text-emerald-300 text-[11px] font-bold">
                <span>⚡</span>
                <span>${cs.powerKw}kW</span>
              </div>
            </div>
          `,
          iconSize: [55, 22],
          iconAnchor: [27, 11]
        });

        const marker = L.marker(cs.location, { icon: csIcon });
        marker.on('click', () => onSelectCharging?.(cs));
        marker.bindPopup(`
          <div class="p-2 text-slate-200">
            <div class="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase">
              <span>⚡</span> Fast EV Hub
            </div>
            <div class="font-bold text-sm text-white mt-1">${cs.name}</div>
            <div class="text-xs text-slate-300 mt-1">Available: <span class="font-bold text-emerald-400">${cs.availablePlugs}/${cs.totalPlugs} Plugs</span></div>
            <div class="text-xs text-slate-400">Speed: ${cs.powerKw} kW DC &bull; ₹${cs.pricePerKwh}/kWh</div>
            <div class="text-[11px] text-amber-300 mt-1">Estimated detour: +${cs.detourTimeMin} min</div>
          </div>
        `);
        overlaysGroup.addLayer(marker);
      });
    }

    // 4. Parking Lots
    if (visibleLayers.parking) {
      parkingLots.forEach(pk => {
        const pkIcon = L.divIcon({
          className: 'parking-marker',
          html: `
            <div class="relative group cursor-pointer transition-transform hover:scale-110">
              <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-950/90 border border-blue-400 shadow-md text-blue-300 text-[11px] font-bold">
                <span>🅿️</span>
                <span>${pk.availableSlots}</span>
              </div>
            </div>
          `,
          iconSize: [45, 22],
          iconAnchor: [22, 11]
        });

        const marker = L.marker(pk.location, { icon: pkIcon });
        marker.on('click', () => onSelectParking?.(pk));
        marker.bindPopup(`
          <div class="p-2 text-slate-200">
            <div class="flex items-center gap-1.5 text-blue-400 text-xs font-bold uppercase">
              <span>🅿️</span> Smart Parking
            </div>
            <div class="font-bold text-sm text-white mt-1">${pk.name}</div>
            <div class="text-xs text-slate-300 mt-1">Open Slots: <span class="font-bold text-blue-400">${pk.availableSlots}/${pk.totalSlots}</span></div>
            <div class="text-xs text-slate-400">Tariff: ₹${pk.ratePerHour}/hr &bull; ${pk.walkTimeMin} min walk to destination</div>
          </div>
        `);
        overlaysGroup.addLayer(marker);
      });
    }
  }, [visibleLayers, tollPlazas, roadHazards, chargingStations, parkingLots, vehicle.type]);

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

    // Vehicle custom marker with dynamic rotation
    const vehicleIcon = L.divIcon({
      className: 'vehicle-marker-wrapper',
      html: `
        <div style="transform: rotate(${liveBearing}deg); transform-origin: center center;" class="filter drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] transition-transform duration-75">
          ${svgIconHtml}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    if (!vehicleMarkerRef.current) {
      vehicleMarkerRef.current = L.marker(liveCoordinates, { icon: vehicleIcon, zIndexOffset: 1000 }).addTo(map);
    } else {
      vehicleMarkerRef.current.setLatLng(liveCoordinates);
      vehicleMarkerRef.current.setIcon(vehicleIcon);
    }

    // Smoothly pan camera if follow mode is active
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
