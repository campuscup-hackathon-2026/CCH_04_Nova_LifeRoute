import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Siren,
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  User,
  Car,
  CheckCircle2,
  Share2,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { LiveTrackingMap } from '../../components/map/LiveTrackingMap';
import { MLBadge } from '../../components/common/MLBadge';
import { SimulationBanner } from '../../components/common/SimulationBanner';
import { useEmergencyStore } from '../../store/useEmergencyStore';
import { useLiveSimulation } from '../../hooks/useLiveSimulation';

export const LiveTrackingPage: React.FC = () => {
  const { bookingId } = useParams();
  const {
    activeEmergency,
    fetchActiveEmergency,
    userLocation,
    liveAmbulanceCoords,
    cancelEmergency,
    updateStatus,
  } = useEmergencyStore();

  useEffect(() => {
    fetchActiveEmergency();
  }, [fetchActiveEmergency]);

  // Live simulation telemetry hook
  const {
    currentCoords,
    progressPercent,
    etaRemainingMinutes,
    speedKmh,
  } = useLiveSimulation({
    startCoords: liveAmbulanceCoords || {
      lat: (activeEmergency?.pickupLocation.lat || userLocation.lat) - 0.009,
      lng: (activeEmergency?.pickupLocation.lng || userLocation.lng) - 0.006,
    },
    targetCoords: activeEmergency?.pickupLocation || userLocation,
    isActive: !!activeEmergency && activeEmergency.status !== 'COMPLETED',
    baseEtaMinutes: activeEmergency?.estimatedArrivalMinutes || 5,
  });

  const patientCoords = activeEmergency?.pickupLocation || userLocation;
  const hospitalCoords = activeEmergency?.destinationLocation;

  const timelineSteps = [
    { key: 'REQUESTED', label: 'SOS Triggered' },
    { key: 'DISPATCHED', label: 'Unit Assigned' },
    { key: 'EN_ROUTE_PICKUP', label: 'En Route to Patient' },
    { key: 'ARRIVED_SCENE', label: 'Arrived at Scene' },
    { key: 'TRANSPORTING', label: 'En Route to Hospital' },
    { key: 'COMPLETED', label: 'Admitted at ER' },
  ];

  const currentStatusIndex = timelineSteps.findIndex(
    (s) => s.key === (activeEmergency?.status || 'EN_ROUTE_PICKUP')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emergency-600 animate-ping"></span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
              Live Ambulance Telemetry & Dispatch
            </h1>
            <MLBadge label="AI Green Corridor" score={98.6} variant="green" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking Incident ID:{' '}
            <span className="font-mono font-bold text-slate-800">
              {activeEmergency?.id || 'emg-2024-9041'}
            </span>{' '}
            • Real-time GPS & ML congestion routing
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <a
            href="tel:109"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs shadow transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 109 Hotline</span>
          </a>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Tracking Emergency Ambulance',
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Live tracking link copied to clipboard!');
              }
            }}
            className="p-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5"
            title="Share live link with family"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Map & Status HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Live Map */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-white rounded-2xl p-2 sm:p-4 border border-slate-200 shadow-sm flex-1 min-h-[460px] flex flex-col">
            <LiveTrackingMap
              patientCoords={patientCoords}
              ambulanceCoords={currentCoords}
              hospitalCoords={hospitalCoords}
              statusText={activeEmergency?.status || 'En Route to Patient'}
              etaMinutes={etaRemainingMinutes}
              speedKmh={speedKmh}
              className="flex-1 min-h-[440px]"
            />
          </div>

          {/* Route Milestones Progress Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-700">En Route Progress</span>
              <span className="font-mono font-bold text-healthcare-700">
                {Math.round(progressPercent)}% of route cleared
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-healthcare-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Timeline Milestones */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-6">
              {timelineSteps.map((step, idx) => {
                const isPassed = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;

                return (
                  <div
                    key={step.key}
                    className={`p-2.5 rounded-xl text-center border transition ${
                      isCurrent
                        ? 'bg-healthcare-50 border-healthcare-300 text-healthcare-800 font-bold shadow-xs ring-1 ring-healthcare-400'
                        : isPassed
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full mx-auto mb-1.5 flex items-center justify-center text-[10px] font-bold">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <div className="text-[11px] leading-tight">{step.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right HUD: ETA, Vehicle & Driver Information */}
        <div className="lg:col-span-4 space-y-4">
          {/* Big ETA Display Card */}
          <div className="bg-gradient-to-br from-navy-900 to-navy-950 text-white rounded-2xl p-6 shadow-xl border border-navy-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-healthcare-300">
                Machine Learning ETA
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight text-white">
                {etaRemainingMinutes}
              </span>
              <span className="text-lg font-bold text-healthcare-300">MINUTES</span>
            </div>

            <p className="text-xs text-slate-300 mt-2">
              Predicted arrival window based on real-time traffic corridor sensors.
            </p>

            <div className="mt-5 pt-4 border-t border-navy-800/80 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-slate-400 text-[10px] uppercase">Traffic Delay Factor</div>
                <div className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span>Cleared (+0.8m)</span>
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase">Distance to Pickup</div>
                <div className="font-bold text-white mt-0.5">
                  {activeEmergency?.distanceKm || 2.4} km
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Ambulance & Crew Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-healthcare-600" />
                <h3 className="font-bold text-slate-900 text-sm">Assigned Medical Unit</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emergency-100 text-emergency-800">
                {activeEmergency?.ambulanceTypeRequired || 'ALS'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle Registration:</span>
                <span className="font-mono font-bold text-slate-800">
                  {activeEmergency?.assignedAmbulanceReg || 'MED-EMG-0101'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Driver:</span>
                <span className="font-semibold text-slate-800">
                  {activeEmergency?.assignedDriverName || 'Officer Rajesh Kumar'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination Hospital:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                  {activeEmergency?.destinationHospitalName || 'Metro City Apex Trauma Center'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={`tel:${activeEmergency?.assignedDriverPhone || '+15554567890'}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-healthcare-50 hover:bg-healthcare-100 text-healthcare-700 border border-healthcare-200 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Driver</span>
              </a>

              {activeEmergency && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this emergency request?')) {
                      cancelEmergency(activeEmergency.id);
                    }
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-emergency-50 hover:text-emergency-700 text-slate-600 text-xs font-bold transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Patient Symptoms Summary */}
          {activeEmergency && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Emergency Vitals & Notes
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                "{activeEmergency.chiefComplaint}"
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeEmergency.symptoms.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

