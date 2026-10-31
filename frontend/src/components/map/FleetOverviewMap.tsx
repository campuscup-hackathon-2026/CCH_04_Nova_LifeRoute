import React, { useEffect, useRef } from 'react';
import { Ambulance, HospitalProfile, Coordinates } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_CENTER_COORDS } from '../../data/mockData';

interface FleetOverviewMapProps {
  ambulances: Ambulance[];
  hospitals: HospitalProfile[];
  center?: Coordinates;
  className?: string;
  onSelectAmbulance?: (amb: Ambulance) => void;
}

export const FleetOverviewMap: React.FC<FleetOverviewMapProps> = ({
  ambulances,
  hospitals,
  center = DEFAULT_CENTER_COORDS,
  className = '',
  onSelectAmbulance,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: 13,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const markersGroup = markersLayerRef.current;
    if (!markersGroup) return;

    markersGroup.clearLayers();

    // Render Hospitals
    hospitals.forEach((hosp) => {
      const hospIcon = L.divIcon({
        className: 'custom-hosp-marker',
        html: `
          <div class="w-8 h-8 rounded-xl bg-navy-950 border-2 border-white text-white flex items-center justify-center shadow-lg font-bold text-xs cursor-pointer hover:scale-110 transition">
            <svg class="w-4 h-4 text-emergency-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([hosp.location.lat, hosp.location.lng], { icon: hospIcon })
        .bindPopup(`
          <div class="p-1">
            <h4 class="font-bold text-sm text-slate-900">${hosp.name}</h4>
            <p class="text-xs text-slate-500">${hosp.address}</p>
            <div class="mt-2 text-xs grid grid-cols-2 gap-1 bg-slate-50 p-2 rounded">
              <div>ICU Beds: <b>${hosp.bedStats.icuAvailable}/${hosp.bedStats.icuTotal}</b></div>
              <div>ER Beds: <b>${hosp.bedStats.emergencyAvailable}/${hosp.bedStats.emergencyTotal}</b></div>
            </div>
          </div>
        `)
        .addTo(markersGroup);
    });

    // Render Ambulances
    ambulances.forEach((amb) => {
      const statusColor =
        amb.status === 'available'
          ? 'bg-emerald-500 border-white text-white'
          : amb.status === 'en_route'
          ? 'bg-healthcare-600 border-white text-white'
          : 'bg-amber-500 border-white text-white';

      const ambIcon = L.divIcon({
        className: 'custom-fleet-amb-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer hover:scale-110 transition">
            <div class="w-8 h-8 rounded-lg ${statusColor} border-2 flex items-center justify-center shadow-md">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 16H5m14 0a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 16V9a2 2 0 012-2m10 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0H7"></path></svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([amb.currentLocation.lat, amb.currentLocation.lng], {
        icon: ambIcon,
      }).addTo(markersGroup);

      marker.bindPopup(`
        <div class="p-1">
          <div class="flex items-center justify-between gap-2">
            <span class="font-bold text-sm">${amb.registrationNumber}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              amb.type === 'ALS' ? 'bg-emergency-100 text-emergency-700' : 'bg-slate-100 text-slate-700'
            }">${amb.type}</span>
          </div>
          <p class="text-xs text-slate-600 mt-1">${amb.model}</p>
          <div class="text-xs mt-2 space-y-1">
            <div>Driver: <b>${amb.driverName || 'Unassigned'}</b></div>
            <div>Hospital: <b>${amb.hospitalName}</b></div>
            <div>Status: <b class="capitalize">${amb.status}</b></div>
            <div>Fuel: <b>${amb.fuelLevelPercent}%</b> | O₂: <b>${amb.oxygenPressurePercent}%</b></div>
          </div>
        </div>
      `);

      if (onSelectAmbulance) {
        marker.on('click', () => onSelectAmbulance(amb));
      }
    });
  }, [ambulances, hospitals, center.lat, center.lng, onSelectAmbulance]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px] z-0" />

      {/* Fleet Filter Legend Overlay */}
      <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-lg text-xs space-y-1.5">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Fleet Status Key</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Available ({ambulances.filter((a) => a.status === 'available').length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-healthcare-600"></span>
          <span>En Route ({ambulances.filter((a) => a.status === 'en_route').length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Maintenance ({ambulances.filter((a) => a.status === 'maintenance').length})</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <span className="w-2.5 h-2.5 rounded-sm bg-navy-950"></span>
          <span>Hospitals ({hospitals.length})</span>
        </div>
      </div>
    </div>
  );
};

