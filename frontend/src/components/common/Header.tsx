import React, { useState, useEffect } from 'react';
import { Menu, Siren, Bell, Shield, Clock, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { EmergencySOSButton } from './EmergencySOSButton';
import { useEmergencyStore } from '../../store/useEmergencyStore';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, title, subtitle }) => {
  const { user } = useAuthStore();
  const { notifications } = useNotificationStore();
  const { triggerQuickSOS, isLoading } = useEmergencyStore();
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roleColor = {
    patient: 'bg-healthcare-100 text-healthcare-800 border-healthcare-200',
    driver: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    hospital: 'bg-purple-100 text-purple-800 border-purple-200',
    admin: 'bg-navy-100 text-navy-800 border-navy-200',
  }[user?.role || 'patient'];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 h-18 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
            <span
              className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${roleColor}`}
            >
              {user?.role} portal
            </span>
          </div>
          {subtitle && <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{timeString}</span>
        </div>

        {/* SOS Action for Patient role */}
        {user?.role === 'patient' && (
          <EmergencySOSButton
            onTrigger={() => triggerQuickSOS(user.name, user.phone)}
            size="sm"
            isLoading={isLoading}
          />
        )}

        {/* Notifications Icon */}
        <div className="relative">
          <button
            type="button"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emergency-500 ring-2 ring-white"></span>
            )}
          </button>
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-healthcare-600 to-navy-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{user?.name}</div>
            <div className="text-[10px] text-slate-400 capitalize">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

