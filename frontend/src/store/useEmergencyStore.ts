import { create } from 'zustand';
import { EmergencyRequest, EmergencyStatus, Ambulance, Coordinates } from '../types';
import { emergencyService, CreateEmergencyParams } from '../services/emergencyService';
import { ambulanceService } from '../services/ambulanceService';
import { DEFAULT_CENTER_COORDS } from '../data/mockData';
import { useNotificationStore } from './useNotificationStore';

interface EmergencyStoreState {
  activeEmergency: EmergencyRequest | null;
  history: EmergencyRequest[];
  nearbyAmbulances: (Ambulance & { distanceKm: number; etaMinutes: number })[];
  userLocation: Coordinates;
  liveAmbulanceCoords: Coordinates | null;
  isSimulatingLiveTracking: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchActiveEmergency: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  fetchNearbyAmbulances: () => Promise<void>;
  setUserLocation: (coords: Coordinates) => void;
  triggerQuickSOS: (patientName?: string, phone?: string) => Promise<EmergencyRequest>;
  createDetailedEmergency: (params: CreateEmergencyParams) => Promise<EmergencyRequest>;
  updateStatus: (id: string, newStatus: EmergencyStatus, note?: string) => Promise<void>;
  cancelEmergency: (id: string, reason?: string) => Promise<void>;
  updateLiveAmbulanceCoords: (coords: Coordinates) => void;
  setActiveEmergency: (emergency: EmergencyRequest | null) => void;
}

export const useEmergencyStore = create<EmergencyStoreState>((set, get) => ({
  activeEmergency: null,
  history: [],
  nearbyAmbulances: [],
  userLocation: DEFAULT_CENTER_COORDS,
  liveAmbulanceCoords: null,
  isSimulatingLiveTracking: false,
  isLoading: false,
  error: null,

  fetchActiveEmergency: async () => {
    try {
      const active = await emergencyService.getActiveEmergency();
      set({
        activeEmergency: active,
        liveAmbulanceCoords: active?.pickupLocation
          ? {
              lat: active.pickupLocation.lat - 0.008,
              lng: active.pickupLocation.lng - 0.006,
            }
          : null,
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  fetchHistory: async () => {
    try {
      const history = await emergencyService.getBookingHistory();
      set({ history });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  fetchNearbyAmbulances: async () => {
    try {
      const loc = get().userLocation;
      const list = await ambulanceService.getNearbyAmbulances(loc);
      set({ nearbyAmbulances: list });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  setUserLocation: (coords: Coordinates) => {
    set({ userLocation: coords });
    get().fetchNearbyAmbulances();
  },

  triggerQuickSOS: async (patientName = 'Johnathan Miller', phone = '+1 (555) 234-5678') => {
    set({ isLoading: true, error: null });
    const loc = get().userLocation;
    try {
      const request = await emergencyService.createEmergencyRequest({
        patientId: 'pat-001',
        patientName,
        patientPhone: phone,
        pickupLocation: loc,
        severity: 'CRITICAL',
        ambulanceTypeRequired: 'ALS',
        chiefComplaint: 'Instant SOS trigger - Immediate emergency triage needed',
        symptoms: ['Acute distress', 'Emergency assistance requested via instant SOS'],
      });

      set({
        activeEmergency: request,
        liveAmbulanceCoords: {
          lat: loc.lat - 0.007,
          lng: loc.lng - 0.005,
        },
        isLoading: false,
      });

      useNotificationStore.getState().addNotification({
        type: 'emergency',
        title: 'EMERGENCY DISPATCH TRIGGERED',
        message: `Ambulance ${request.assignedAmbulanceReg} dispatched to your location! ML ETA: 5 mins.`,
      });

      return request;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  createDetailedEmergency: async (params: CreateEmergencyParams) => {
    set({ isLoading: true, error: null });
    try {
      const request = await emergencyService.createEmergencyRequest(params);
      set({
        activeEmergency: request,
        liveAmbulanceCoords: {
          lat: params.pickupLocation.lat - 0.007,
          lng: params.pickupLocation.lng - 0.005,
        },
        isLoading: false,
      });

      useNotificationStore.getState().addNotification({
        type: 'emergency',
        title: 'Emergency Request Confirmed',
        message: `ALS Unit ${request.assignedAmbulanceReg} en route. ML ETA: 5 mins.`,
      });

      return request;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateStatus: async (id: string, newStatus: EmergencyStatus, note?: string) => {
    try {
      const updated = await emergencyService.updateEmergencyStatus(id, newStatus, note);
      if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED') {
        set({ activeEmergency: null, liveAmbulanceCoords: null });
        get().fetchHistory();
      } else {
        set({ activeEmergency: updated });
      }

      useNotificationStore.getState().addNotification({
        type: 'info',
        title: 'Status Update',
        message: `Emergency trip status changed to: ${newStatus}`,
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  cancelEmergency: async (id: string, reason?: string) => {
    try {
      await emergencyService.cancelEmergency(id, reason);
      set({ activeEmergency: null, liveAmbulanceCoords: null });
      get().fetchHistory();

      useNotificationStore.getState().addNotification({
        type: 'warning',
        title: 'Emergency Cancelled',
        message: 'The active emergency request has been cancelled.',
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateLiveAmbulanceCoords: (coords: Coordinates) => {
    set({ liveAmbulanceCoords: coords });
  },

  setActiveEmergency: (emergency: EmergencyRequest | null) => {
    set({
      activeEmergency: emergency,
      liveAmbulanceCoords: emergency?.pickupLocation
        ? {
            lat: emergency.pickupLocation.lat - 0.008,
            lng: emergency.pickupLocation.lng - 0.006,
          }
        : null,
    });
  },
}));

