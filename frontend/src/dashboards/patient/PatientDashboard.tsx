import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Siren,
  MapPin,
  Clock,
  HeartPulse,
  PhoneCall,
  User,
  Car,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Activity,
  FileText,
} from 'lucide-react';
import { EmergencySOSButton } from '../../components/common/EmergencySOSButton';
import { MLBadge } from '../../components/common/MLBadge';
import { StatCard } from '../../components/common/StatCard';
import { EmergencyRequestModal } from './EmergencyRequestModal';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmergencyStore } from '../../store/useEmergencyStore';
import { emergencyService } from '../../services/emergencyService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { DEMO_PATIENTS } from '../../data/mockData';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const patient = (user as any) || DEMO_PATIENTS[0];

  const {
    activeEmergency,
    fetchActiveEmergency,
    history,
    fetchHistory,
    nearbyAmbulances,
    fetchNearbyAmbulances,
    triggerQuickSOS,
    createDetailedEmergency,
    isLoading,
  } = useEmergencyStore();

  const { coordinates, accuracyMeters, isSimulated, isLoading: isLocating, detectLocation } =
    useGeolocation();

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    fetchActiveEmergency();
    fetchHistory();
    fetchNearbyAmbulances();
  }, [fetchActiveEmergency, fetchHistory, fetchNearbyAmbulances]);

  const handleDetailedSubmit = async (params: any) => {
    setIsRequestModalOpen(false);
    await createDetailedEmergency({
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      pickupLocation: coordinates,
      ...params,
    });
    navigate('/track');
  };

  return (
    <div className="space-y-6">
      {/* Active Emergency Alert Banner (if request in progress) */}
      {activeEmergency && (
        <div className="bg-gradient-to-r from-emergency-600 to-emergency-700 text-white rounded-2xl p-5 shadow-lg border border-emergency-500 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse-fast">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Siren className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-[11px]">
                  Emergency Active ({activeEmergency.status})
                </span>
                <span className="text-xs text-emergency-100">
                  Unit {activeEmergency.assignedAmbulanceReg}
                </span>
              </div>
              <h3 className="font-bold text-base mt-0.5">
                Ambulance dispatched! Estimated Arrival: ~
                {activeEmergency.estimatedArrivalMinutes || 5} Mins
              </h3>
            </div>
          </div>
          <Link
            to="/track"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-emergency-700 font-extrabold text-xs shadow-md hover:bg-emergency-50 transition flex items-center justify-center gap-2"
          >
            <span>Open Live Tracking Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Hero Welcome & Quick SOS Strip */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-healthcare-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Welcome Info */}
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Online Citizen Emergency Terminal</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Hello, {patient.name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              If you or someone near you needs critical medical help, trigger the instant SOS button or submit a symptom-guided dispatch request.
            </p>

            {/* Location Detection UI Card */}
            <div className="pt-2">
              <div className="inline-flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700">
                <MapPin className="w-4 h-4 text-healthcare-600 shrink-0" />
                <div className="min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">
                    Detected Location (Accuracy: ±{accuracyMeters}m)
                  </span>
                  <span className="font-semibold text-slate-800 truncate block max-w-xs sm:max-w-md">
                    {coordinates.address || `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`}
                  </span>
                </div>
                <button
                  onClick={detectLocation}
                  disabled={isLocating}
                  className="ml-auto p-1.5 text-slate-500 hover:text-healthcare-600 hover:bg-slate-200/60 rounded-lg transition"
                  title="Refresh GPS"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick SOS Trigger Box */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-emergency-50/70 border border-emergency-200 rounded-2xl text-center space-y-2.5">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-emergency-700">
              Immediate Assistance
            </div>
            <EmergencySOSButton
              size="lg"
              onTrigger={async () => {
                await triggerQuickSOS(patient.name, patient.phone);
                navigate('/track');
              }}
              isLoading={isLoading}
            />
            <div className="flex items-center gap-2 w-full pt-1">
              <a
                href="tel:109"
                className="flex-1 py-1.5 px-3 rounded-lg bg-white border border-emergency-300 text-emergency-700 hover:bg-emergency-100 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                title="Dial 109 Emergency Hotline"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emergency-600 animate-bounce" />
                <span>Call 109</span>
              </a>
              <button
                type="button"
                onClick={async () => {
                  await emergencyService.call109Hotline({
                    callerName: patient.name,
                    callerPhone: patient.phone,
                    coords: coordinates,
                    transcript: "Patient triggered direct 109 Hotline simulation from dashboard"
                  });
                  navigate('/track');
                }}
                className="flex-1 py-1.5 px-3 rounded-lg bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition"
                title="Simulate incoming 109 call dispatch"
              >
                <span>Simulate 109</span>
              </button>
            </div>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="text-xs font-bold text-healthcare-700 hover:text-healthcare-900 underline flex items-center justify-center gap-1"
            >
              <span>Or fill symptom details form</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Health Stats & Medical ID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Blood Group"
          value={patient.bloodGroup || 'O+'}
          subtitle="Verified in Medical ID"
          icon={HeartPulse}
          variant="emergency"
        />
        <StatCard
          title="Nearest Hospital"
          value="1.8 km"
          subtitle="Apex Trauma Center"
          icon={MapPin}
          variant="healthcare"
        />
        <StatCard
          title="Avg City Dispatch"
          value="5.2 min"
          change="-42% vs phone 911"
          trend="down"
          icon={Clock}
          variant="default"
        />
        <StatCard
          title="Emergency Contacts"
          value="2 Active"
          subtitle="Spouse & Primary Doc"
          icon={PhoneCall}
          variant="navy"
        />
      </div>

      {/* Middle Grid: Nearby Ambulances & Medical Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Nearby Ambulances List */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-healthcare-600" />
              <h3 className="font-bold text-slate-900 text-base">Nearby Available Ambulances</h3>
            </div>
            <MLBadge label="Live Fleet Telemetry" score={98.4} variant="blue" />
          </div>

          <p className="text-xs text-slate-500">
            Real-time GPS proximity and estimated arrival times calculated using traffic congestion models.
          </p>

          <div className="divide-y divide-slate-100">
            {nearbyAmbulances.slice(0, 4).map((amb) => (
              <div key={amb.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {amb.type}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{amb.registrationNumber}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        Available
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs">{amb.model}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-extrabold text-healthcare-700">
                    ~{amb.etaMinutes} mins
                  </div>
                  <div className="text-[10px] text-slate-400">{amb.distanceKm} km away</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
            >
              Request Nearest Ambulance Unit
            </button>
          </div>
        </div>

        {/* Medical ID & Emergency Contacts Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-healthcare-600" />
              <h3 className="font-bold text-slate-900 text-base">Emergency Medical ID</h3>
            </div>
            <Link
              to="/dashboard/patient/profile"
              className="text-xs font-bold text-healthcare-600 hover:text-healthcare-800"
            >
              Edit →
            </Link>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Blood Type:</span>
              <span className="font-bold text-emergency-600">{patient.bloodGroup || 'O+'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Known Allergies:</span>
              <span className="font-semibold text-slate-800">
                {patient.allergies?.join(', ') || 'Penicillin, Sulfa'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Chronic Conditions:</span>
              <span className="font-semibold text-slate-800">Hypertension, Mild Asthma</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Emergency Contacts
            </h4>
            <div className="space-y-2">
              {patient.emergencyContacts?.map((c: any) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-800">{c.name}</div>
                    <div className="text-[10px] text-slate-500">{c.relationship}</div>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking History Widget */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-healthcare-600" />
            <h3 className="font-bold text-slate-900 text-base">Recent Emergency Requests</h3>
          </div>
          <Link
            to="/dashboard/patient/history"
            className="text-xs font-bold text-healthcare-600 hover:text-healthcare-800"
          >
            View Full Records →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Booking ID</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Symptoms / Reason</th>
                <th className="py-2.5 px-3">Hospital Destination</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.slice(0, 3).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{item.id}</td>
                  <td className="py-3 px-3 text-slate-600">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-slate-800 font-medium truncate max-w-xs">
                    {item.chiefComplaint}
                  </td>
                  <td className="py-3 px-3 text-slate-700">{item.destinationHospitalName}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                      {item.ambulanceTypeRequired}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-healthcare-50 text-healthcare-700 border border-healthcare-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Request Modal */}
      <EmergencyRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleDetailedSubmit}
        userLocation={coordinates}
        isLoading={isLoading}
      />
    </div>
  );
};

