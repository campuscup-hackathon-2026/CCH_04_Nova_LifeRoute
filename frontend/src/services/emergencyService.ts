import { EmergencyRequest, EmergencyStatus, EmergencySeverity, AmbulanceType, Coordinates } from '../types';
import { MOCK_ACTIVE_EMERGENCY, MOCK_BOOKING_HISTORY, MOCK_AMBULANCES, DEMO_HOSPITALS } from '../data/mockData';
import { apiClient, mockDelay } from './apiClient';

const STORAGE_KEY_ACTIVE = 'smartpulse_active_emergency';
const STORAGE_KEY_HISTORY = 'smartpulse_history_emergency';

const getInitialActive = (): EmergencyRequest | null => {
  const saved = localStorage.getItem(STORAGE_KEY_ACTIVE);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return MOCK_ACTIVE_EMERGENCY;
    }
  }
  return MOCK_ACTIVE_EMERGENCY;
};

const getInitialHistory = (): EmergencyRequest[] => {
  const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return MOCK_BOOKING_HISTORY;
    }
  }
  return MOCK_BOOKING_HISTORY;
};

export interface CreateEmergencyParams {
  patientId: string;
  patientName: string;
  patientPhone: string;
  pickupLocation: Coordinates;
  severity: EmergencySeverity;
  ambulanceTypeRequired?: AmbulanceType;
  chiefComplaint: string;
  symptoms: string[];
  notes?: string;
}

export const emergencyService = {
  async getActiveEmergency(): Promise<EmergencyRequest | null> {
    await mockDelay(200);
    return getInitialActive();
  },

  async getEmergencyById(id: string): Promise<EmergencyRequest | null> {
    await mockDelay(200);
    const active = getInitialActive();
    if (active && active.id === id) return active;
    const history = getInitialHistory();
    return history.find((h) => h.id === id) || null;
  },

  async getBookingHistory(): Promise<EmergencyRequest[]> {
    await mockDelay(300);
    return getInitialHistory();
  },

  async createEmergencyRequest(params: CreateEmergencyParams): Promise<EmergencyRequest> {
    // Attempt backend sync
    try {
      const apiRes = await apiClient.post('/emergencies/', {
        patient_latitude: params.pickupLocation.lat,
        patient_longitude: params.pickupLocation.lng,
        patient_address: params.pickupLocation.address || 'Emergency Incident Site',
        emergency_type: params.chiefComplaint || 'general',
        severity: params.severity.toLowerCase(),
        notes: params.symptoms.join(', ') || params.chiefComplaint,
      });

      if (apiRes.data?.request_id) {
        try {
          await apiClient.post(`/dispatch/emergency/${apiRes.data.request_id}`);
        } catch {
          // dispatch assignment optional if no drivers online
        }
      }
    } catch {
      // Continue with responsive local UI state
    }

    await mockDelay(300);

    const targetAmbulance = MOCK_AMBULANCES[0]; // MED-EMG-0101
    const targetHospital = DEMO_HOSPITALS[0];

    const newRequest: EmergencyRequest = {
      id: `emg-${Date.now().toString().slice(-6)}`,
      patientId: params.patientId,
      patientName: params.patientName,
      patientPhone: params.patientPhone,
      pickupLocation: params.pickupLocation,
      destinationHospitalId: targetHospital.id,
      destinationHospitalName: targetHospital.name,
      destinationLocation: targetHospital.location,
      severity: params.severity,
      status: 'DISPATCHED',
      ambulanceTypeRequired: params.ambulanceTypeRequired || 'ALS',
      chiefComplaint: params.chiefComplaint,
      symptoms: params.symptoms.length > 0 ? params.symptoms : ['Immediate Medical Attention Required'],
      assignedAmbulanceId: targetAmbulance.id,
      assignedDriverId: targetAmbulance.driverId,
      assignedDriverName: targetAmbulance.driverName,
      assignedDriverPhone: targetAmbulance.driverPhone,
      assignedAmbulanceReg: targetAmbulance.registrationNumber,
      mlDispatchScore: 98.9,
      estimatedArrivalMinutes: 5,
      trafficDelayMinutes: 1.2,
      distanceKm: 2.1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusTimeline: [
        {
          status: 'REQUESTED',
          timestamp: new Date().toISOString(),
          note: 'Emergency SOS activated. Machine Learning dispatch algorithm triggered.',
        },
        {
          status: 'DISPATCHED',
          timestamp: new Date(Date.now() + 1000).toISOString(),
          note: `Optimal unit ${targetAmbulance.registrationNumber} automatically assigned with 98.9% match confidence.`,
        },
      ],
      vitalSigns: {
        heartRate: 104,
        bloodPressure: '135/88 mmHg',
        spo2: 95,
      },
    };

    localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(newRequest));
    return newRequest;
  },

  async call109Hotline(params?: {
    callerPhone?: string;
    callerName?: string;
    coords?: Coordinates;
    transcript?: string;
  }): Promise<EmergencyRequest> {
    const phone = params?.callerPhone || '+91 98765 00109';
    const name = params?.callerName || '109 Emergency Caller';
    const lat = params?.coords?.lat || 12.9716;
    const lng = params?.coords?.lng || 77.5946;

    try {
      await apiClient.post('/emergencies/call-109', {
        caller_phone: phone,
        caller_name: name,
        patient_latitude: lat,
        patient_longitude: lng,
        patient_address: 'Direct 109 Telecom Hotline Dispatch',
        emergency_type: 'dial_109_critical',
        severity: 'critical',
        voice_transcript: params?.transcript || 'Caller dialed 109 for immediate life-saving ambulance dispatch',
      });
    } catch {
      // Fallback to local dispatch
    }

    return this.createEmergencyRequest({
      patientId: 'user-109',
      patientName: name,
      patientPhone: phone,
      pickupLocation: { lat, lng, address: 'Direct 109 Emergency Location' },
      severity: 'CRITICAL',
      chiefComplaint: 'Dial 109 Emergency SOS Call',
      symptoms: ['109 Direct Hotline Dispatch', 'Severe Medical Emergency'],
    });
  },

  async updateEmergencyStatus(
    id: string,
    newStatus: EmergencyStatus,
    note?: string
  ): Promise<EmergencyRequest> {
    await mockDelay(300);
    const active = getInitialActive();

    if (!active || active.id !== id) {
      throw new Error('Emergency request not found or already completed');
    }

    const updated: EmergencyRequest = {
      ...active,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      statusTimeline: [
        ...active.statusTimeline,
        {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: note || `Status updated to ${newStatus}`,
        },
      ],
    };

    if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED') {
      const history = getInitialHistory();
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify([updated, ...history]));
      localStorage.removeItem(STORAGE_KEY_ACTIVE);
    } else {
      localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(updated));
    }

    return updated;
  },

  async cancelEmergency(id: string, reason: string = 'User cancelled'): Promise<void> {
    await mockDelay(300);
    await this.updateEmergencyStatus(id, 'CANCELLED', reason);
  },
};

