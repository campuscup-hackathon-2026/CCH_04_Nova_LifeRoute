import { User, UserRole, PatientProfile, DriverProfile, HospitalProfile } from '../types';
import { DEMO_PATIENTS, DEMO_DRIVERS, DEMO_HOSPITALS, DEMO_ADMINS } from '../data/mockData';
import { apiClient, mockDelay } from './apiClient';

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: UserRole;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  // Role specific fields
  bloodGroup?: string;
  allergies?: string[];
  medicalConditions?: string[];
  licenseNumber?: string;
  experienceYears?: number;
  hospitalName?: string;
  emergencyHotline?: string;
  address?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // 1. Attempt real API login to FastAPI backend
    try {
      const res = await apiClient.post('/auth/login', {
        email: credentials.email.trim(),
        password: credentials.password || 'password123',
      });
      if (res.data?.access_token && res.data?.user) {
        const u = res.data.user;
        const mappedRole: UserRole =
          u.role === 'hospital_staff' ? 'hospital' : (u.role as UserRole);

        const realUser: User = {
          id: String(u.user_id),
          name: `${u.first_name} ${u.last_name}`.trim(),
          email: u.email,
          phone: u.phone || '',
          role: mappedRole,
          isVerified: u.is_verified,
          createdAt: u.created_at,
        };

        localStorage.setItem('smartpulse_token', res.data.access_token);
        localStorage.setItem('smartpulse_user', JSON.stringify(realUser));
        return { user: realUser, token: res.data.access_token };
      }
    } catch {
      // Graceful fallback to demo mode
    }

    await mockDelay(300);

    const email = credentials.email.toLowerCase().trim();
    let foundUser: User | undefined;

    // Check across mock user profiles or fallback to requested role
    if (credentials.role === 'patient' || email.includes('patient')) {
      foundUser = DEMO_PATIENTS[0];
    } else if (credentials.role === 'driver' || email.includes('driver')) {
      foundUser = DEMO_DRIVERS[0];
    } else if (credentials.role === 'hospital' || email.includes('hospital')) {
      foundUser = DEMO_HOSPITALS[0];
    } else if (credentials.role === 'admin' || email.includes('admin')) {
      foundUser = DEMO_ADMINS[0];
    } else {
      // Default to matching email or patient
      foundUser =
        DEMO_PATIENTS.find((p) => p.email === email) ||
        DEMO_DRIVERS.find((d) => d.email === email) ||
        DEMO_HOSPITALS.find((h) => h.email === email) ||
        DEMO_ADMINS.find((a) => a.email === email) ||
        DEMO_PATIENTS[0];
    }

    const mockToken = `jwt-mock-token-${foundUser.role}-${Date.now()}`;
    localStorage.setItem('smartpulse_token', mockToken);
    localStorage.setItem('smartpulse_user', JSON.stringify(foundUser));

    return { user: foundUser, token: mockToken };
  },

  async register(payload: RegisterPayload): Promise<{ user: User; token: string }> {
    // 1. Attempt real API registration on FastAPI backend
    try {
      const parts = payload.name.trim().split(' ');
      const firstName = parts[0] || 'User';
      const lastName = parts.slice(1).join(' ') || 'Account';
      const backendRole = payload.role === 'hospital' ? 'hospital_staff' : payload.role;

      const regRes = await apiClient.post('/auth/register', {
        email: payload.email.trim(),
        password: payload.password || 'password123',
        first_name: firstName,
        last_name: lastName,
        phone: payload.phone,
        role: backendRole,
      });

      if (regRes.data?.user_id) {
        return await this.login({
          email: payload.email,
          password: payload.password || 'password123',
          role: payload.role,
        });
      }
    } catch {
      // Graceful fallback to demo mode
    }

    await mockDelay(400);

    const newId = `user-${Date.now()}`;
    let newUser: User;

    if (payload.role === 'patient') {
      const patient: PatientProfile = {
        id: newId,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: 'patient',
        isVerified: true,
        createdAt: new Date().toISOString(),
        bloodGroup: (payload.bloodGroup as any) || 'O+',
        allergies: payload.allergies || [],
        medicalConditions: payload.medicalConditions || [],
        emergencyContacts: [],
        address: payload.address || 'Metro Area',
      };
      newUser = patient;
    } else if (payload.role === 'driver') {
      const driver: DriverProfile = {
        id: newId,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: 'driver',
        isVerified: false, // requires admin verification
        createdAt: new Date().toISOString(),
        licenseNumber: payload.licenseNumber || 'DL-PENDING',
        experienceYears: payload.experienceYears || 2,
        status: 'offline',
        rating: 5.0,
        totalTrips: 0,
      };
      newUser = driver;
    } else if (payload.role === 'hospital') {
      const hospital: HospitalProfile = {
        id: newId,
        name: payload.hospitalName || payload.name,
        hospitalName: payload.hospitalName || payload.name,
        email: payload.email,
        phone: payload.phone,
        role: 'hospital',
        isVerified: false, // requires admin verification
        createdAt: new Date().toISOString(),
        licenseNumber: payload.licenseNumber || 'HOSP-REG-PENDING',
        address: payload.address || 'Central City Healthcare Zone',
        emergencyHotline: payload.emergencyHotline || payload.phone,
        totalAmbulances: 4,
        traumaCenterLevel: 2,
        location: { lat: 12.9716, lng: 77.5946 },
        bedStats: {
          icuTotal: 20,
          icuAvailable: 5,
          emergencyTotal: 30,
          emergencyAvailable: 10,
          generalTotal: 100,
          generalAvailable: 25,
          pediatricTotal: 15,
          pediatricAvailable: 4,
        },
      };
      newUser = hospital;
    } else {
      newUser = {
        id: newId,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        isVerified: true,
        createdAt: new Date().toISOString(),
      };
    }

    const mockToken = `jwt-mock-token-${newUser.role}-${Date.now()}`;
    localStorage.setItem('smartpulse_token', mockToken);
    localStorage.setItem('smartpulse_user', JSON.stringify(newUser));

    return { user: newUser, token: mockToken };
  },

  async logout(): Promise<void> {
    await mockDelay(150);
    localStorage.removeItem('smartpulse_token');
    localStorage.removeItem('smartpulse_user');
  },

  getCurrentUser(): User | null {
    const saved = localStorage.getItem('smartpulse_user');
    if (!saved) return null;
    try {
      return JSON.parse(saved) as User;
    } catch {
      return null;
    }
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    await mockDelay(400);
    return {
      success: true,
      message: `A simulated password reset OTP has been sent to ${email}. (Demo OTP: 948216)`,
    };
  },

  async verifyOtpAndReset(email: string, otp: string, _newPass: string): Promise<boolean> {
    await mockDelay(400);
    if (otp === '948216' || otp.length === 6) {
      return true;
    }
    throw new Error('Invalid OTP code. Please use demo code 948216.');
  },
};

