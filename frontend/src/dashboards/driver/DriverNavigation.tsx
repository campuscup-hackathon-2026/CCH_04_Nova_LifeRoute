import React from 'react';
import { Link } from 'react-router-dom';
import {
  Navigation,
  MapPin,
  Clock,
  PhoneCall,
  Siren,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Volume2,
  CheckCircle2,
} from 'lucide-react';
import { LiveTrackingMap } from '../../components/map/LiveTrackingMap';
import { MLBadge } from '../../components/common/MLBadge';
import { useEmergencyStore } from '../../store/useEmergencyStore';
import { useLiveSimulation } from '../../hooks/useLiveSimulation';
import { DEFAULT_CENTER_COORDS } from '../../data/mockData';

export const DriverNavigation: React.FC = () => {
  const { activeEmergency, userLocation, updateStatus } = useEmergencyStore();

  const startCoords = {
    lat: (activeEmergency?.pickupLocation.lat || DEFAULT_CENTER_COORDS.lat) - 0.008,
    lng: (activeEmergency?.pickupLocation.lng || DEFAULT_CENTER_COORDS.lng) - 0.005,
  };

  const targetCoords = activeEmergency?.pickupLocation || DEFAULT_CENTER_COORDS;

  const { currentCoords, etaRemainingMinutes, speedKmh } = useLiveSimulation({
    startCoords,
    targetCoords,
    isActive: true,
    baseEtaMinutes: 5,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/driver"
            className="p-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
              Turn-By-Turn Emergency Navigation
            </h2>
            <p className="text-xs text-slate-500">
              Live green corridor routing synchronized with metropolitan traffic signals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MLBadge label="Green Corridor Active" score={99.1} variant="green" />
        </div>
      </div>

      {/* Navigation HUD Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-healthcare-950 text-white rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-healthcare-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <Navigation className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-healthcare-400">
              Next Immediate Turn (400m)
            </div>
            <h3 className="text-lg font-bold">
              Turn LEFT onto Mahatma Gandhi Express Corridor
            </h3>
            <p className="text-xs text-slate-300">
              Traffic clearance signal activated at Brigade Junction
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <div className="text-slate-400 text-[10px]">CURRENT SPEED</div>
            <div className="text-xl font-bold text-emerald-400">{speedKmh} KM/H</div>
          </div>
          <div className="text-right pl-4 border-l border-white/20">
            <div className="text-slate-400 text-[10px]">ML REMAINING ETA</div>
            <div className="text-xl font-bold text-healthcare-300">
              ~{etaRemainingMinutes} MINS
            </div>
          </div>
        </div>
      </div>

      {/* Map and Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Big Navigation Map */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-3 border border-slate-200 shadow-sm min-h-[460px] flex flex-col">
          <LiveTrackingMap
            patientCoords={targetCoords}
            ambulanceCoords={currentCoords}
            hospitalCoords={activeEmergency?.destinationLocation}
            statusText="Navigating to Patient (Code 3)"
            etaMinutes={etaRemainingMinutes}
            speedKmh={speedKmh}
            className="flex-1 min-h-[450px]"
          />
        </div>

        {/* Patient Vitals & ER Coordination */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Patient Vitals Telemetry
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Heart Rate</span>
                <span className="text-base font-extrabold text-emergency-600">112 BPM</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Blood Pressure</span>
                <span className="text-base font-extrabold text-slate-800">148/96</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] block">SpO₂ Oxygen</span>
                <span className="text-base font-extrabold text-healthcare-700">93%</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Resp. Rate</span>
                <span className="text-base font-extrabold text-slate-800">24 /min</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-700 mb-1">Chief Symptoms:</div>
              <p className="text-xs text-slate-600 italic">
                "{activeEmergency?.chiefComplaint || 'Acute chest pain and severe shortness of breath'}"
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Destination ER Notification
            </h3>
            <div className="text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Trauma Bay 2 pre-reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cardiac Team on Standby at Apex Hospital</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Telemetry stream synced with attending physician</span>
              </div>
            </div>

            {activeEmergency && (
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      activeEmergency.id,
                      'ARRIVED_SCENE',
                      'Arrived at patient pickup location'
                    )
                  }
                  className="w-full py-2.5 rounded-xl bg-healthcare-600 hover:bg-healthcare-700 text-white font-bold text-xs shadow transition"
                >
                  Mark Arrived at Patient Location
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

