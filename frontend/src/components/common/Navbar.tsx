import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Siren,
  PhoneCall,
  User,
  Shield,
  Activity,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Car,
  Building2,
  Stethoscope,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { ConnectMobileModal } from './ConnectMobileModal';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, switchDemoRole } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isConnectMobileOpen, setIsConnectMobileOpen] = useState(false);

  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case 'patient':
        return '/dashboard/patient';
      case 'driver':
        return '/dashboard/driver';
      case 'hospital':
        return '/dashboard/hospital';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/dashboard/patient';
    }
  };

  const handleRoleSwitch = (role: UserRole) => {
    switchDemoRole(role);
    setIsRoleDropdownOpen(false);
    navigate(getDashboardPath(role));
  };

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'Emergency Services', path: '/#services' },
    { label: 'Live Fleet', path: '/track' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-healthcare-700 via-healthcare-600 to-emergency-600 flex items-center justify-center text-white shadow-md shadow-healthcare-600/20 group-hover:scale-105 transition duration-200">
              <Siren className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-navy-900">
                  Smart<span className="text-healthcare-600">Pulse</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emergency-100 text-emergency-700 uppercase tracking-wider">
                  AI ER
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest hidden sm:block">
                Emergency Machine Learning Response
              </p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-healthcare-600 hover:bg-slate-50 transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* 24/7 Hotline Badge */}
            <a
              href="tel:109"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emergency-50 border border-emergency-200 text-emergency-700 hover:bg-emergency-100 transition text-xs font-bold"
              title="Official Emergency Dispatch Line 109"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emergency-600 animate-bounce" />
              <span>Emergency Hotline: 109</span>
            </a>

            {/* Connect Mobile Device Button */}
            <button
              type="button"
              onClick={() => setIsConnectMobileOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-healthcare-50 border border-healthcare-200 text-healthcare-700 hover:bg-healthcare-100 transition text-xs font-bold shadow-2xs"
              title="Connect your mobile phone via QR Code"
            >
              <Smartphone className="w-3.5 h-3.5 text-healthcare-600" />
              <span>📱 Connect Mobile (109)</span>
            </button>

            {/* Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
                title="Switch role to preview specific dashboard"
              >
                <Sparkles className="w-3.5 h-3.5 text-healthcare-600" />
                <span className="capitalize">{user?.role || 'Switch Role'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-fadeIn text-xs">
                  <div className="px-3 py-2 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Switch Demo Persona
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('patient')}
                    className="w-full text-left px-3 py-2 hover:bg-healthcare-50 flex items-center gap-2.5 text-slate-700 hover:text-healthcare-700"
                  >
                    <User className="w-4 h-4 text-healthcare-600" />
                    <div>
                      <div className="font-bold">Patient View</div>
                      <div className="text-[10px] text-slate-500">SOS, live tracking & booking</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('driver')}
                    className="w-full text-left px-3 py-2 hover:bg-healthcare-50 flex items-center gap-2.5 text-slate-700 hover:text-healthcare-700"
                  >
                    <Car className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-bold">Ambulance Driver</div>
                      <div className="text-[10px] text-slate-500">Accept dispatch & navigation</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('hospital')}
                    className="w-full text-left px-3 py-2 hover:bg-healthcare-50 flex items-center gap-2.5 text-slate-700 hover:text-healthcare-700"
                  >
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-bold">Hospital ER Desk</div>
                      <div className="text-[10px] text-slate-500">Bed sync & intake board</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className="w-full text-left px-3 py-2 hover:bg-healthcare-50 flex items-center gap-2.5 text-slate-700 hover:text-healthcare-700"
                  >
                    <Shield className="w-4 h-4 text-navy-800" />
                    <div>
                      <div className="font-bold">Command Admin</div>
                      <div className="text-[10px] text-slate-500">City fleet map & analytics</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Dashboard / Auth Button */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath(user.role)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-healthcare-600 hover:bg-healthcare-700 text-white font-bold text-xs tracking-wide shadow-sm hover:shadow-healthcare-600/20 transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-healthcare-600 transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/dashboard/patient"
              className="px-3 py-1.5 rounded-lg bg-emergency-600 text-white text-xs font-bold"
            >
              SOS
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3">
              Switch Dashboard Role
            </div>
            <div className="grid grid-cols-2 gap-2 px-2">
              <button
                onClick={() => {
                  handleRoleSwitch('patient');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-bold text-xs text-left"
              >
                Patient View
              </button>
              <button
                onClick={() => {
                  handleRoleSwitch('driver');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-bold text-xs text-left"
              >
                Driver View
              </button>
              <button
                onClick={() => {
                  handleRoleSwitch('hospital');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-bold text-xs text-left"
              >
                Hospital ER
              </button>
              <button
                onClick={() => {
                  handleRoleSwitch('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-bold text-xs text-left"
              >
                Admin Command
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-lg border border-slate-300 font-bold text-sm text-slate-700"
            >
              Log in
            </Link>
            <Link
              to="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-lg bg-healthcare-600 font-bold text-sm text-white"
            >
              Register
            </Link>
          </div>
        </div>
      )}

      {/* Connect Mobile Phone Modal (QR Code) */}
      <ConnectMobileModal
        isOpen={isConnectMobileOpen}
        onClose={() => setIsConnectMobileOpen(false)}
      />
    </nav>
  );
};

