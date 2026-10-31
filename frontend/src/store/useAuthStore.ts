import { create } from 'zustand';
import { User, UserRole } from '../types';
import { authService, LoginCredentials, RegisterPayload } from '../services/authService';
import { DEMO_PATIENTS, DEMO_DRIVERS, DEMO_HOSPITALS, DEMO_ADMINS } from '../data/mockData';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize with saved user or default demo patient
  const savedUser = authService.getCurrentUser() || DEMO_PATIENTS[0];
  const savedToken = localStorage.getItem('smartpulse_token') || 'demo-initial-token';

  return {
    user: savedUser,
    token: savedToken,
    isAuthenticated: true,
    isLoading: false,
    error: null,

    login: async (credentials) => {
      set({ isLoading: true, error: null });
      try {
        const { user, token } = await authService.login(credentials);
        set({ user, token, isAuthenticated: true, isLoading: false });
        return user;
      } catch (err: any) {
        set({ error: err.message || 'Login failed', isLoading: false });
        throw err;
      }
    },

    register: async (payload) => {
      set({ isLoading: true, error: null });
      try {
        const { user, token } = await authService.register(payload);
        set({ user, token, isAuthenticated: true, isLoading: false });
        return user;
      } catch (err: any) {
        set({ error: err.message || 'Registration failed', isLoading: false });
        throw err;
      }
    },

    logout: async () => {
      set({ isLoading: true });
      await authService.logout();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    },

    switchDemoRole: (role: UserRole) => {
      let nextUser: User;
      switch (role) {
        case 'patient':
          nextUser = DEMO_PATIENTS[0];
          break;
        case 'driver':
          nextUser = DEMO_DRIVERS[0];
          break;
        case 'hospital':
          nextUser = DEMO_HOSPITALS[0];
          break;
        case 'admin':
          nextUser = DEMO_ADMINS[0];
          break;
      }
      localStorage.setItem('smartpulse_user', JSON.stringify(nextUser));
      set({ user: nextUser, isAuthenticated: true });
    },

    clearError: () => set({ error: null }),
  };
});

