import { HospitalProfile, HospitalBedStats } from '../types';
import { DEMO_HOSPITALS } from '../data/mockData';
import { apiClient, mockDelay } from './apiClient';

const STORAGE_KEY_HOSPITALS = 'smartpulse_hospitals';

const getHospitalsList = (): HospitalProfile[] => {
  const saved = localStorage.getItem(STORAGE_KEY_HOSPITALS);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEMO_HOSPITALS;
    }
  }
  return DEMO_HOSPITALS;
};

export const hospitalService = {
  async getAllHospitals(): Promise<HospitalProfile[]> {
    try {
      const res = await apiClient.get('/hospitals/');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((h: any) => ({
          id: String(h.hospital_id),
          name: h.name,
          hospitalName: h.name,
          email: `${h.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@hospital.org`,
          phone: h.contact_phone || '+91 80 2222 0000',
          role: 'hospital' as const,
          isVerified: h.is_verified,
          createdAt: h.created_at || new Date().toISOString(),
          address: h.address || `${h.city || 'Metro'}, ${h.state || ''}`,
          emergencyHotline: h.contact_phone || '+91 80 2222 9999',
          licenseNumber: `HOSP-REG-${h.hospital_id}`,
          totalAmbulances: 4,
          traumaCenterLevel: 1,
          location: { lat: Number(h.latitude), lng: Number(h.longitude), address: h.address || h.name },
          bedStats: {
            icuTotal: h.icu_beds || 15,
            icuAvailable: h.available_icu_beds || 4,
            emergencyTotal: 20,
            emergencyAvailable: 8,
            generalTotal: h.total_beds || 80,
            generalAvailable: h.available_beds || 22,
            pediatricTotal: 10,
            pediatricAvailable: 5,
          },
        }));
      }
    } catch {
      // Fallback to local demo list
    }

    await mockDelay(200);
    return getHospitalsList();
  },

  async getHospitalById(id: string): Promise<HospitalProfile | null> {
    await mockDelay(200);
    const list = getHospitalsList();
    return list.find((h) => h.id === id) || null;
  },

  async updateBedAvailability(
    hospitalId: string,
    updates: Partial<HospitalBedStats>
  ): Promise<HospitalBedStats> {
    await mockDelay(300);
    const list = getHospitalsList();
    const index = list.findIndex((h) => h.id === hospitalId);
    if (index === -1) throw new Error('Hospital not found');

    const updatedStats: HospitalBedStats = {
      ...list[index].bedStats,
      ...updates,
    };

    list[index].bedStats = updatedStats;
    localStorage.setItem(STORAGE_KEY_HOSPITALS, JSON.stringify(list));
    return updatedStats;
  },
};

