import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Siren,
  Sparkles,
  Zap,
  MapPin,
  Clock,
  ShieldCheck,
  HeartPulse,
  Activity,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Cpu,
  Car,
  Building2,
  Stethoscope,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { EmergencySOSButton } from '../components/common/EmergencySOSButton';
import { MLBadge } from '../components/common/MLBadge';
import { useEmergencyStore } from '../store/useEmergencyStore';
import { useAuthStore } from '../store/useAuthStore';
import { emergencyService } from '../services/emergencyService';
import { UserRole } from '../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { triggerQuickSOS, isLoading } = useEmergencyStore();
  const { switchDemoRole } = useAuthStore();

  const handleLaunchRole = (role: UserRole) => {
    switchDemoRole(role);
    navigate(`/dashboard/${role}`);
  };

  const handleHeroSOS = async () => {
    switchDemoRole('patient');
    await triggerQuickSOS('Emergency Citizen', '+1 (555) 911-0000');
    navigate('/track');
  };

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        {/* Subtle glowing ambient lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-healthcare-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-emergency-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-800 border border-healthcare-500/30 text-xs font-semibold text-healthcare-300 shadow-inner">
                <Sparkles className="w-4 h-4 text-healthcare-400" />
                <span>Next-Gen Machine Learning Dispatch Architecture</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
                Every Second Counts. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-healthcare-400 via-sky-300 to-emergency-400">
                  Smart Ambulance Finder
                </span>{' '}
                & Emergency AI.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Automated emergency response system utilizing machine learning traffic regression, automated severity triage, and real-time hospital bed allocation to slash response times by up to 58%.
              </p>

              {/* Demo Persona Quick Switch Buttons */}
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Explore Interactive Dashboards:
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                  <button
                    onClick={() => handleLaunchRole('patient')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition text-white"
                  >
                    <HeartPulse className="w-3.5 h-3.5 text-emergency-400" />
                    Patient Portal
                  </button>
                  <button
                    onClick={() => handleLaunchRole('driver')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition text-white"
                  >
                    <Car className="w-3.5 h-3.5 text-emerald-400" />
                    Ambulance Driver
                  </button>
                  <button
                    onClick={() => handleLaunchRole('hospital')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition text-white"
                  >
                    <Building2 className="w-3.5 h-3.5 text-purple-400" />
                    Hospital ER Desk
                  </button>
                  <button
                    onClick={() => handleLaunchRole('admin')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold transition text-white"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    Admin Command
                  </button>
                </div>
              </div>

              {/* Key Metrics Counter Strip */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-navy-800 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">5.2 min</div>
                  <div className="text-xs text-slate-400">Avg ML Response Time</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-healthcare-400">98.4%</div>
                  <div className="text-xs text-slate-400">ETA Prediction Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">14,200+</div>
                  <div className="text-xs text-slate-400">Emergency Dispatches</div>
                </div>
              </div>
            </div>

            {/* Right Hero: High-Impact SOS Action Card */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-md bg-navy-900/90 rounded-3xl p-8 border border-white/15 shadow-2xl backdrop-blur-md text-center relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-emergency-500/20 rounded-full blur-2xl"></div>

                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emergency-500/10 border border-emergency-500/30 text-emergency-400 text-xs font-bold uppercase tracking-wider mb-6">
                  <span className="w-2 h-2 rounded-full bg-emergency-500 animate-ping"></span>
                  Immediate Medical Dispatch
                </div>

                <div className="my-4 flex justify-center">
                  <EmergencySOSButton
                    size="hero"
                    onTrigger={handleHeroSOS}
                    isLoading={isLoading}
                  />
                </div>

                <h3 className="text-lg font-bold text-white mt-4">One-Touch Emergency SOS</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Auto-detects GPS, activates nearest Advanced Life Support unit, and alerts the emergency trauma corridor.
                </p>

                {/* 109 Emergency Hotline Quick Call / Simulation Bar */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-navy-800">
                  <a
                    href="tel:109"
                    className="flex-1 py-2 px-3 rounded-xl bg-emergency-600/30 hover:bg-emergency-600/50 border border-emergency-500/50 text-emergency-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    title="Direct Dial 109 Emergency Hotline"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emergency-400 animate-bounce" />
                    <span>Dial 109</span>
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      switchDemoRole('patient');
                      await emergencyService.call109Hotline({
                        callerName: '109 Emergency Citizen',
                        callerPhone: '+91 98765 00109',
                        transcript: 'Incoming 109 emergency distress call initiated from web terminal',
                      });
                      navigate('/track');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-healthcare-600 hover:bg-healthcare-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                    title="Simulate incoming 109 telecom dispatch"
                  >
                    <span>Simulate 109 Call</span>
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-navy-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Verified ALS Telemetry
                  </span>
                  <Link
                    to="/track"
                    className="text-healthcare-400 hover:text-healthcare-300 font-bold flex items-center gap-1"
                  >
                    Track Live <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-healthcare-50 text-healthcare-700 text-xs font-bold uppercase tracking-wider border border-healthcare-200 mb-3">
            <Cpu className="w-3.5 h-3.5 text-healthcare-600" />
            Machine Learning Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            How SmartPulse AI Dispatches in Seconds
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            By eliminating traditional dispatch call-center bottlenecks, our multi-modal machine learning architecture optimizes every stage from patient distress to trauma bay admission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition duration-200 relative">
            <div className="w-12 h-12 rounded-xl bg-healthcare-100 text-healthcare-700 font-extrabold flex items-center justify-center text-lg mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-navy-900 mb-2">Instant Geo-Lock & SOS</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Patient triggers emergency SOS. Browser GPS locks coordinates and performs real-time reverse geocoding within 8-meter accuracy.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1 text-[11px] font-semibold text-healthcare-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-healthcare-600" />
              Sub-second geo-triangulation
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition duration-200 relative">
            <div className="w-12 h-12 rounded-xl bg-emergency-100 text-emergency-700 font-extrabold flex items-center justify-center text-lg mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-navy-900 mb-2">ML Dispatch Optimization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ensemble XGBoost regression scores all available units based on proximity, live road congestion indices, and required ALS/BLS equipment.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              98.4% ETA model accuracy
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition duration-200 relative">
            <div className="w-12 h-12 rounded-xl bg-navy-100 text-navy-900 font-extrabold flex items-center justify-center text-lg mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-navy-900 mb-2">Green Corridor Navigation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Driver receives turn-by-turn guidance with dynamic detour recommendations, prioritizing traffic-signal synchronization and emergency lanes.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1 text-[11px] font-semibold text-healthcare-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-healthcare-600" />
              Live traffic bypass
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition duration-200 relative">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-lg mb-4">
              04
            </div>
            <h3 className="text-base font-bold text-navy-900 mb-2">Hospital Bed Pre-Allocation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nearest hospital Emergency Room automatically receives incoming patient vitals, resus bays, and reserves an available ICU bed before arrival.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1 text-[11px] font-semibold text-purple-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
              Zero-wait trauma handoff
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="bg-slate-100/80 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
              Specialized Emergency Medical Fleet
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Every ambulance in our network is equipped with specialized telemetry and staffed by certified paramedics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emergency-50 text-emergency-600 flex items-center justify-center mb-4">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-slate-900">Advanced Life Support (ALS)</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emergency-100 text-emergency-800">
                  CRITICAL
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                For cardiac arrest, severe respiratory compromise, and major trauma. Equipped with ventilators, multiparameter ECG monitors, and defibrillators.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-healthcare-50 text-healthcare-600 flex items-center justify-center mb-4">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-slate-900">Basic Life Support (BLS)</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-healthcare-100 text-healthcare-800">
                  STANDARD
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                For non-critical emergency transfers, fractures, asthma attacks, and vitals stabilization with oxygen delivery and hemorrhage control.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-slate-900">Neonatal & Pediatric Care</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                  SPECIALIZED
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Mobile neonatal intensive care units (NICU) with transport incubators, micro-infusion pumps, and specialized pediatric airway management.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center mb-4">
                <Car className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-slate-900">Inter-Hospital Transport</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                  PLANNED
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                High-comfort transfers between healthcare institutions, dialysis centers, and super-specialty surgery wards with paramedic monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EMERGENCY FIRST-AID & ASSISTANCE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-healthcare-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emergency-500/20 text-emergency-400 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-emergency-400" />
                <span>Life Saving First Aid Protocols</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Immediate Steps While Ambulance Is En Route
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our automated dispatch system immediately alerts you with step-by-step guidance. Follow these essential first-aid guidelines while help is on the way:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emergency-400"></span>
                    Chest Pain & Cardiac
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Keep patient calm and seated. Loosen tight clothing. If prescribed, assist with nitroglycerin.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-healthcare-400"></span>
                    Stroke Symptoms (FAST)
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Check Face droop, Arm weakness, and Slurred Speech. Note the exact time symptoms started.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 text-center">
              <PhoneCall className="w-12 h-12 text-emergency-400 mx-auto mb-3 animate-bounce" />
              <h4 className="text-lg font-bold text-white">Direct Medical Control</h4>
              <p className="text-xs text-slate-300 mt-1 mb-4">
                Need to speak with an emergency physician or paramedic dispatcher right now?
              </p>
              <a
                href="tel:109"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-sm shadow-lg transition"
              >
                <PhoneCall className="w-4 h-4" />
                Call 109 Emergency Hotline
              </a>
              <div className="mt-3 text-[11px] text-slate-400">
                Toll-free 24 hours a day, 7 days a week
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Ready to test the Smart Ambulance Finder?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto mt-2 mb-6">
            Experience the complete user journey: trigger a simulated emergency, track the ambulance in real-time, or manage the hospital triage room.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard/patient"
              className="px-6 py-3 rounded-xl bg-healthcare-600 hover:bg-healthcare-700 text-white font-bold text-sm shadow-md hover:shadow-healthcare-600/30 transition flex items-center gap-2"
            >
              <span>Open Patient Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/track"
              className="px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-950 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Live Tracking Map</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

