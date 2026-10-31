import { create } from 'zustand';

export interface ToastNotification {
  id: string;
  type: 'emergency' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

interface NotificationState {
  notifications: ToastNotification[];
  addNotification: (notification: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    {
      id: 'init-1',
      type: 'info',
      title: 'SmartPulse AI System Ready',
      message: 'Machine Learning dispatch models online with 98.4% historical ETA accuracy.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ],

  addNotification: (item) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newNotif: ToastNotification = {
      ...item,
      id,
      timestamp: new Date().toLocaleTimeString(),
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications].slice(0, 5), // keep last 5
    }));

    // Auto-dismiss after 6 seconds if not emergency
    if (item.type !== 'emergency') {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, 6000);
    }
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),
}));

