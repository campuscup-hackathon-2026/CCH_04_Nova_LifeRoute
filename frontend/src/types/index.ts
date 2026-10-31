export type UserRole = 'patient' | 'driver' | 'hospital' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isVerified?: boolean;
  createdAt: string;
}

export interface PatientProfile extends User {
  role: 'patient';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string[];
  medicalConditions: string[];
  emergencyContacts: EmergencyContact[];
  address: string;
  defaultLocation?: Coordinates;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export type DriverStatus = 'online' | 'offline' | 'busy' | 'on_break';

export interface DriverProfile extends User {
  role: 'driver';
  licenseNumber: string;
  experienceYears: number;
  status: DriverStatus;
  currentAmbulanceId?: string;
  rating: number;
  totalTrips: number;
  hospitalAffiliationId?: string;
}

export interface HospitalProfile extends User {
  role: 'hospital';
  hospitalName: string;
  licenseNumber: string;
  address: string;
  location: Coordinates;
  emergencyHotline: string;
  totalAmbulances: number;
  bedStats: HospitalBedStats;
  traumaCenterLevel: 1 | 2 | 3 | 4;
}

export interface HospitalBedStats {
  icuTotal: number;
  icuAvailable: number;
  emergencyTotal: number;
  emergencyAvailable: number;
  generalTotal: number;
  generalAvailable: number;
  pediatricTotal: number;
  pediatricAvailable: number;
}

export interface AdminProfile extends User {
  role: 'admin';
  department: string;
  accessLevel: 'super_admin' | 'dispatcher' | 'auditor';
}

export interface Coordinates {
  lat: number;
  lng: number;
  address?: string;
}

export type AmbulanceType = 'ALS' | 'BLS' | 'PCC' | 'NEONATAL';
// ALS: Advanced Life Support
// BLS: Basic Life Support
// PCC: Patient Care Carrier / Transport
// NEONATAL: Specialized Infant Care

export type AmbulanceStatus = 'available' | 'dispatched' | 'en_route' | 'maintenance' | 'offline';

export interface Ambulance {
  id: string;
  registrationNumber: string;
  type: AmbulanceType;
  model: string;
  hospitalId: string;
  hospitalName: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  status: AmbulanceStatus;
  currentLocation: Coordinates;
  equipment: {
    oxygenCylinder: boolean;
    defibrillator: boolean;
    ventilator: boolean;
    ecgMonitor: boolean;
    firstAidKit: boolean;
    suctionUnit: boolean;
  };
  fuelLevelPercent: number;
  oxygenPressurePercent: number;
  baseHospitalAddress: string;
}

export type EmergencySeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type EmergencyStatus =
  | 'REQUESTED'
  | 'DISPATCHED'
  | 'EN_ROUTE_PICKUP'
  | 'ARRIVED_SCENE'
  | 'TRANSPORTING'
  | 'ARRIVED_HOSPITAL'
  | 'COMPLETED'
  | 'CANCELLED';

export interface EmergencyRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  pickupLocation: Coordinates;
  destinationHospitalId?: string;
  destinationHospitalName?: string;
  destinationLocation?: Coordinates;
  severity: EmergencySeverity;
  status: EmergencyStatus;
  ambulanceTypeRequired: AmbulanceType;
  chiefComplaint: string;
  symptoms: string[];
  assignedAmbulanceId?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  assignedAmbulanceReg?: string;
  mlDispatchScore?: number;
  estimatedArrivalMinutes?: number;
  trafficDelayMinutes?: number;
  distanceKm?: number;
  createdAt: string;
  updatedAt: string;
  statusTimeline: {
    status: EmergencyStatus;
    timestamp: string;
    note?: string;
  }[];
  vitalSigns?: {
    heartRate?: number;
    bloodPressure?: string;
    spo2?: number;
    respiratoryRate?: number;
  };
}

export interface MLPrediction {
  recommendedAmbulanceId: string;
  estimatedTimeMinutes: number;
  confidenceScore: number;
  congestionFactor: 'Low' | 'Moderate' | 'Heavy' | 'Gridlock';
  optimalRouteDistanceKm: number;
  greenCorridorSuggested: boolean;
  modelFeatures: {
    historicalResponseTime: number;
    currentTrafficIndex: number;
    weatherPenalty: number;
    hospitalProximityScore: number;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  category: 'AUTH' | 'DISPATCH' | 'SYSTEM' | 'SECURITY' | 'VERIFICATION';
  actorName: string;
  actorRole: UserRole;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILURE';
}

export interface SystemMetric {
  id: string;
  label: string;
  value: string | number;
  changePercent?: number;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

