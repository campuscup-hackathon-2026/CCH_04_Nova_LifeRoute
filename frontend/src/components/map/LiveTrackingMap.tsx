import React, { useEffect, useRef } from 'react';
import { Coordinates } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SimulationBanner } from '../common/SimulationBanner';

interface LiveTrackingMapProps {
  patientCoords: Coordinates;
  ambulanceCoords?: Coordinates | null;
  hospitalCoords?: Coordinates | null;
  statusText?: string;
  etaMinutes?: number;
  speedKmh?: number;
  className?: string;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  patientCoords,
  ambulanceCoords,
  hospitalCoords,
  statusText = 'En Route to Patient',
  etaMinutes = 5,
  speedKmh = 48,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const patientMarkerRef = useRef<L.Marker | null>(null);
  const ambulanceMarkerRef = useRef<L.Marker | null>(null);
  const hospitalMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // Custom DivIcons
  const createPatientIcon = () =>
    L.divIcon({
      className: 'custom-patient-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-healthcare-400 opacity-75"></span>
          <div class="relative w-8 h-8 rounded-full bg-healthcare-600 border-2 border-white text-white flex items-center justify-center shadow-lg font-bold text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

  const createAmbulanceIcon = () =>
    L.divIcon({
      className: 'custom-ambulance-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-emergency-400 opacity-75"></span>
          <div class="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emergency-700 to-emergency-500 border-2 border-white text-white flex items-center justify-center shadow-xl">
            <svg class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 16H5m14 0a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 16V9a2 2 0 012-2m10 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0H7"></path></svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

  const createHospitalIcon = () =>
    L.divIcon({
      className: 'custom-hospital-marker',
      html: `
        <div class="relative w-9 h-9 rounded-xl bg-navy-900 border-2 border-white text-white flex items-center justify-center shadow-lg">
          <svg class="w-5 h-5 text-emergency-400 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [patientCoords.lat, patientCoords.lng],
        zoom: 14,
        zoomControl: true,
      });

      // Clean OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Patient Marker
    if (!patientMarkerRef.current) {
      patientMarkerRef.current = L.marker([patientCoords.lat, patientCoords.lng], {
        icon: createPatientIcon(),
      })
        .addTo(map)
        .bindPopup('<b>Patient Pickup Location</b><br/>' + (patientCoords.address || 'Active SOS'));
    } else {
      patientMarkerRef.current.setLatLng([patientCoords.lat, patientCoords.lng]);
    }

    // Ambulance Marker
    if (ambulanceCoords) {
      if (!ambulanceMarkerRef.current) {
        ambulanceMarkerRef.current = L.marker([ambulanceCoords.lat, ambulanceCoords.lng], {
          icon: createAmbulanceIcon(),
        })
          .addTo(map)
          .bindPopup(`<b>Ambulance (ALS Unit)</b><br/>Status: ${statusText}<br/>ETA: ~${etaMinutes} mins`);
      } else {
        ambulanceMarkerRef.current.setLatLng([ambulanceCoords.lat, ambulanceCoords.lng]);
        ambulanceMarkerRef.current.setPopupContent(
          `<b>Ambulance (ALS Unit)</b><br/>Status: ${statusText}<br/>Speed: ${speedKmh} km/h<br/>ETA: ~${etaMinutes} mins`
        );
      }
    }

    // Hospital Marker
    if (hospitalCoords) {
      if (!hospitalMarkerRef.current) {
        hospitalMarkerRef.current = L.marker([hospitalCoords.lat, hospitalCoords.lng], {
          icon: createHospitalIcon(),
        })
          .addTo(map)
          .bindPopup('<b>Destination Hospital</b><br/>' + (hospitalCoords.address || 'Trauma Center'));
      } else {
        hospitalMarkerRef.current.setLatLng([hospitalCoords.lat, hospitalCoords.lng]);
      }
    }

    // Route Polyline
    if (ambulanceCoords) {
      const waypoints: [number, number][] = [
        [ambulanceCoords.lat, ambulanceCoords.lng],
        // Simulated midpoint dog-leg for realistic road curvature
        [
          (ambulanceCoords.lat + patientCoords.lat) / 2 + 0.001,
          (ambulanceCoords.lng + patientCoords.lng) / 2 - 0.001,
        ],
        [patientCoords.lat, patientCoords.lng],
      ];

      if (hospitalCoords) {
        waypoints.push([hospitalCoords.lat, hospitalCoords.lng]);
      }

      if (!routePolylineRef.current) {
        routePolylineRef.current = L.polyline(waypoints, {
          color: '#2563EB',
          weight: 5,
          opacity: 0.85,
          dashArray: '8, 8',
          lineCap: 'round',
        }).addTo(map);
      } else {
        routePolylineRef.current.setLatLngs(waypoints);
      }

      // Fit bounds to show both markers
      const bounds = L.latLngBounds([
        [ambulanceCoords.lat, ambulanceCoords.lng],
        [patientCoords.lat, patientCoords.lng],
      ]);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }

    return () => {
      // Keep instance alive on state updates, only destroy on unmount
    };
  }, [patientCoords.lat, patientCoords.lng, ambulanceCoords?.lat, ambulanceCoords?.lng, hospitalCoords?.lat, hospitalCoords?.lng, etaMinutes, statusText, speedKmh]);

  // Cleanup on true unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[360px] z-0" />

      {/* Floating HUD Telemetry Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-lg pointer-events-auto flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Live Telemetry</div>
            <div className="text-xs font-extrabold text-slate-800">{statusText}</div>
          </div>
          <div className="pl-3 border-l border-slate-200 text-right">
            <div className="text-[10px] text-slate-400">ML Speed</div>
            <div className="text-xs font-mono font-bold text-healthcare-700">{speedKmh} km/h</div>
          </div>
        </div>

        <SimulationBanner compact />
      </div>

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-md flex items-center gap-4 text-[11px] font-semibold text-slate-700">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emergency-600"></span>
          <span>Ambulance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-healthcare-600"></span>
          <span>Patient</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-navy-900"></span>
          <span>Hospital ER</span>
        </div>
      </div>
    </div>
  );
};

