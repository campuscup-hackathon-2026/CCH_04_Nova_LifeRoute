import { Ambulance, Coordinates } from '../types';
import { MOCK_AMBULANCES } from '../data/mockData';
import { apiClient, mockDelay } from './apiClient';

const STORAGE_KEY_FLEET = 'smartpulse_ambulance_fleet';

const getFleet = (): Ambulance[] => {
  const saved = localStorage.getItem(STORAGE_KEY_FLEET);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return MOCK_AMBULANCES;
    }
  }
  return MOCK_AMBULANCES;
};

// Helper: Haversine distance in km
export const calculateDistanceKm = (c1: Coordinates, c2: Coordinates): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
  const dLon = ((c2.lng - c1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1.lat * Math.PI) / 180) *
      Math.cos((c2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export const ambulanceService = {
  async getAllAmbulances(): Promise<Ambulance[]> {
    try {
      const res = await apiClient.get('/ambulances/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((a: any) => ({
          id: String(a.ambulance_id),
          registrationNumber: a.registration_number,
          type: (a.vehicle_type || 'ALS') as any,
          model: 'Force Traveller Advanced Critical Unit',
          hospitalId: a.hospital_id ? String(a.hospital_id) : 'hosp-01',
          hospitalName: 'Apollo Speciality Emergency Care',
          driverId: a.driver_id ? String(a.driver_id) : undefined,
          driverName: a.driver_id ? `Driver #${a.driver_id}` : 'Unit Operator',
          driverPhone: '+91 98765 43210',
          status: a.status as any,
          currentLocation: {
            lat: Number(a.current_latitude || 12.9716),
            lng: Number(a.current_longitude || 77.5946),
            address: 'Central Station Zone',
          },
          equipment: {
            oxygenCylinder: true,
            defibrillator: true,
            ventilator: a.vehicle_type === 'ALS' || a.vehicle_type === 'ICU',
            ecgMonitor: true,
            firstAidKit: true,
            suctionUnit: true,
          },
          fuelLevelPercent: 88,
          oxygenPressurePercent: 95,
          baseHospitalAddress: 'Central Healthcare Boulevard',
        }));
      }
    } catch {
      // Fallback to local fleet
    }

    await mockDelay(200);
    return getFleet();
  },

  async getNearbyAmbulances(userLocation: Coordinates): Promise<(Ambulance & { distanceKm: number; etaMinutes: number })[]> {
    await mockDelay(300);
    const fleet = getFleet();

    return fleet
      .filter((amb) => amb.status === 'available' || amb.status === 'en_route')
      .map((amb) => {
        const distance = calculateDistanceKm(userLocation, amb.currentLocation);
        // Simulated ML speed estimate: ~30km/h in city traffic => 2 mins per km + 1.5 min prep
        const eta = Math.max(3, Math.round(distance * 2.2 + 1.5));
        return {
          ...amb,
          distanceKm: distance,
          etaMinutes: eta,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  },

  async getAmbulanceById(id: string): Promise<Ambulance | null> {
    await mockDelay(200);
    const fleet = getFleet();
    return fleet.find((a) => a.id === id) || null;
  },

  async getAmbulancesByHospital(hospitalId: string): Promise<Ambulance[]> {
    await mockDelay(250);
    const fleet = getFleet();
    return fleet.filter((a) => a.hospitalId === hospitalId);
  },

  async updateAmbulanceStatus(id: string, status: Ambulance['status']): Promise<Ambulance> {
    await mockDelay(300);
    const fleet = getFleet();
    const index = fleet.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Ambulance not found');

    fleet[index] = {
      ...fleet[index],
      status,
    };
    localStorage.setItem(STORAGE_KEY_FLEET, JSON.stringify(fleet));
    return fleet[index];
  },
};

