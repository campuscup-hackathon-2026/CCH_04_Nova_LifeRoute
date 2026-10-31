import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Siren,
  LayoutDashboard,
  MapPin,
  Clock,
  User,
  Shield,
  Car,
  Building2,
  Navigation,
  FileText,
  Activity,
  CheckCircle,
  BarChart3,
  LogOut,
  Radio,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout, switchDemoRole } = useAuthStore();
  const currentRole = user?.role || 'patient';

  const patientNav = [
    { label: 'Overview & SOS', path: '/dashboard/patient', icon: LayoutDashboard },
    { label: 'Live Tracking', path: '/track', icon: MapPin },
    { label: 'Booking History', path: '/dashboard/patient/history', icon: Clock },
    { label: 'Medical Profile', path: '/dashboard/patient/profile', icon: User },
  ];

  const driverNav = [
    { label: 'Driver Terminal', path: '/dashboard/driver', icon: LayoutDashboard },
    { label: 'Active Navigation', path: '/dashboard/driver/navigate', icon: Navigation },
    { label: 'Trip History', path: '/dashboard/driver/trips', icon: Clock },
    { label: 'Driver Profile', path: '/dashboard/driver/profile', icon: User },
  ];

  const hospitalNav = [
    { label: 'ER Overview', path: '/dashboard/hospital', icon: LayoutDashboard },
    { label: 'Fleet Management', path: '/dashboard/hospital/fleet', icon: Car },
    { label: 'Driver Staff', path: '/dashboard/hospital/drivers', icon: User },
    { label: 'Bed Availability', path: '/dashboard/hospital/beds', icon: Activity },
    { label: 'Analytics', path: '/dashboard/hospital/analytics', icon: BarChart3 },
  ];

  const adminNav = [
    { label: 'Command Overview', path: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Live Fleet Map', path: '/dashboard/admin/map', icon: MapPin },
    { label: 'User Management', path: '/dashboard/admin/users', icon: User },
    { label: 'Hospital Verifications', path: '/dashboard/admin/hospitals', icon: Building2 },
    { label: 'Driver Verifications', path: '/dashboard/admin/drivers', icon: CheckCircle },
    { label: 'ML Analytics', path: '/dashboard/admin/analytics', icon: BarChart3 },
    { label: 'Audit Logs', path: '/dashboard/admin/logs', icon: FileText },
  ];

  const getNavItems = () => {
    switch (currentRole) {
      case 'driver':
        return driverNav;
      case 'hospital':
        return hospitalNav;
      case 'admin':
        return adminNav;
      case 'patient':
      default:
        return patientNav;
    }
  };

  const navItems = getNavItems();

  const handleRoleSwitch = (role: UserRole) => {
    switchDemoRole(role);
    onClose();
    switch (role) {
      case 'patient':
        navigate('/dashboard/patient');
        break;
      case 'driver':
        navigate('/dashboard/driver');
        break;
      case 'hospital':
        navigate('/dashboard/hospital');
        break;
      case 'admin':
        navigate('/dashboard/admin');
        break;
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-navy-900 text-slate-300 flex flex-col border-r border-navy-800 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-18 px-5 flex items-center justify-between border-b border-navy-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-healthcare-600 to-emergency-600 flex items-center justify-center text-white shadow-sm">
              <Siren className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Smart<span className="text-healthcare-400">Pulse</span>
              </span>
              <span className="text-[10px] block font-semibold text-healthcare-300 uppercase tracking-wider">
                {currentRole} portal
              </span>
            </div>
          </Link>
        </div>

        {/* Current Active Persona Card */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-navy-800/80 border border-navy-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-healthcare-500/20 text-healthcare-400 flex items-center justify-center font-bold text-sm shrink-0 border border-healthcare-500/30">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">{user?.name || 'User'}</h4>
              <p className="text-[10px] text-slate-400 capitalize flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{user?.role} Mode</span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path.split('/').length <= 3}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-healthcare-600 text-white shadow-sm shadow-healthcare-600/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Quick Demo Switcher Section */}
        <div className="p-3 mx-3 mb-2 rounded-xl bg-navy-950/60 border border-navy-800 text-xs">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-healthcare-300 uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-healthcare-400" />
            <span>Switch Role (Demo)</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleRoleSwitch('patient')}
              className={`px-2 py-1.5 rounded text-[11px] font-medium transition text-left ${
                currentRole === 'patient'
                  ? 'bg-healthcare-600 text-white font-bold'
                  : 'bg-navy-800 text-slate-300 hover:bg-navy-700'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => handleRoleSwitch('driver')}
              className={`px-2 py-1.5 rounded text-[11px] font-medium transition text-left ${
                currentRole === 'driver'
                  ? 'bg-healthcare-600 text-white font-bold'
                  : 'bg-navy-800 text-slate-300 hover:bg-navy-700'
              }`}
            >
              Driver
            </button>
            <button
              onClick={() => handleRoleSwitch('hospital')}
              className={`px-2 py-1.5 rounded text-[11px] font-medium transition text-left ${
                currentRole === 'hospital'
                  ? 'bg-healthcare-600 text-white font-bold'
                  : 'bg-navy-800 text-slate-300 hover:bg-navy-700'
              }`}
            >
              Hospital
            </button>
            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`px-2 py-1.5 rounded text-[11px] font-medium transition text-left ${
                currentRole === 'admin'
                  ? 'bg-healthcare-600 text-white font-bold'
                  : 'bg-navy-800 text-slate-300 hover:bg-navy-700'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-navy-800 flex items-center justify-between">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
          >
            ← Public Home
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-1.5 text-slate-400 hover:text-emergency-400 hover:bg-navy-800 rounded-lg transition"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};

