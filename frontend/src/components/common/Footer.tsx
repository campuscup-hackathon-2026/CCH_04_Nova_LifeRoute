import React from 'react';
import { Link } from 'react-router-dom';
import { Siren, PhoneCall, HeartPulse, ShieldCheck, Cpu, MapPin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-slate-800">
      {/* Emergency Banner */}
      <div className="bg-emergency-600 text-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <h4 className="font-bold text-base">In a life-threatening situation?</h4>
              <p className="text-xs text-emergency-100">
                Call immediate national emergency response or click the 1-touch SOS button.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:109"
              className="px-5 py-2 rounded-lg bg-white text-emergency-700 font-extrabold text-sm shadow hover:bg-emergency-50 transition"
            >
              Dial 109 Hotline Now
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-healthcare-600 flex items-center justify-center text-white">
                <Siren className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Smart<span className="text-healthcare-400">Pulse</span> AI
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Next-generation Machine Learning emergency dispatch and smart ambulance navigation platform. Real-time traffic congestion prediction, automated severity triage, and dynamic hospital bed allocation.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Cpu className="w-4 h-4 text-healthcare-400" />
              <span>Machine Learning v4.2 Ensemble Routing Engine</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>HIPAA Compliant Emergency Telemetry Architecture</span>
            </div>
          </div>

          {/* Quick Dashboards */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard/patient" className="hover:text-healthcare-400 transition">
                  Patient Emergency SOS
                </Link>
              </li>
              <li>
                <Link to="/dashboard/driver" className="hover:text-healthcare-400 transition">
                  Ambulance Driver Terminal
                </Link>
              </li>
              <li>
                <Link to="/dashboard/hospital" className="hover:text-healthcare-400 transition">
                  Hospital ER & Bed Sync
                </Link>
              </li>
              <li>
                <Link to="/dashboard/admin" className="hover:text-healthcare-400 transition">
                  City Command & Admin
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-healthcare-400 transition">
                  Live Ambulance Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Capabilities */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3">Capabilities</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Advanced Life Support (ALS)</li>
              <li>Basic Life Support (BLS)</li>
              <li>Neonatal Mobile Intensive Care</li>
              <li>Green Corridor Traffic Routing</li>
              <li>Smart Triage ML Severity Scoring</li>
              <li>Real-time ICU Bed Reservation</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3">Dispatch Desk</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>Central Emergency Dispatch Center, Metro Health District</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>emergency-ops@smartpulse.ai</span>
              </div>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 rounded bg-slate-800 text-[11px] text-slate-300 font-mono">
                  FastAPI & PostGIS Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} SmartPulse AI — Smart Ambulance Finder & Emergency Response System. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Privacy Protocol</span>
            <span>•</span>
            <span>Emergency Telemetry Standards</span>
            <span>•</span>
            <span>Simulated Frontend Demo</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

