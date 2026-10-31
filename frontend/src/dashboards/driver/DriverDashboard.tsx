import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  Power,
  Siren,
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Navigation,
  Fuel,
  Activity,
  User,
  Sparkles,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { MLBadge } from '../../components/common/MLBadge';
import { useAuthStore } from '../../store/useAuthStore';
import { useEmergencyStore } from '../../store/useEmergencyStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { DEMO_DRIVERS, MOCK_AMBULANCES } from '../../data/mockData';

export const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const driver = (user as any) || DEMO_DRIVERS[0];
  const ambulance = MOCK_AMBULANCES[0]; // MED-EMG-0101

  const { activeEmergency, updateStatus } = useEmergencyStore();
  const { addNotification } = useNotificationStore();

  const [isOnline, setIsOnline] = useState(true);
  const [incomingRequest, setIncomingRequest] = useState<any>(null);
  const [countdown, setCountdown] = useState(30);

  // Toggle online/offline
  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    addNotification({
      type: nextState ? 'success' : 'warning',
      title: nextState ? 'Driver Shift Online' : 'Driver Offline',
      message: nextState
        ? 'Unit MED-EMG-0101 is now accepting ML emergency dispatches.'
        : 'Unit taken out of emergency dispatch pool.',
    });
  };

  // Simulate an incoming emergency dispatch alert if online and no active trip
  useEffect(() => {
    if (isOnline && !activeEmergency && !incomingRequest) {
      const timer = setTimeout(() => {
        setIncomingRequest({
          id: 'emg-sim-5501',
          patientName: 'David H. (High Priority)',
          pickupAddress: 'Sector 4, North Ring Junction (1.9 km away)',
          severity: 'CRITICAL',
          complaint: 'Suspected Acute Myocardial Infarction (Severe Chest Pain)',
          symptoms: ['Chest Pain', 'Shortness of breath', 'Sweating'],
          hospital: 'Metro City Apex Trauma Center',
          mlEta: '4.5 min',
        });
        setCountdown(30);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [isOnline, activeEmergency, incomingRequest]);

  // Countdown timer for incoming request
  useEffect(() => {
    if (!incomingRequest) return;
    if (countdown <= 0) {
      setIncomingRequest(null);
      return;
    }
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [incomingRequest, countdown]);

  const handleAcceptEmergency = () => {
    setIncomingRequest(null);
    addNotification({
      type: 'emergency',
      title: 'Dispatch Accepted',
      message: 'Green corridor route calculated. Initiating turn-by-turn navigation.',
    });
    navigate('/dashboard/driver/navigate');
  };

  const handleRejectEmergency = () => {
    setIncomingRequest(null);
    addNotification({
      type: 'info',
      title: 'Dispatch Re-routed',
      message: 'Incident transferred to backup unit MED-EMG-0103 via ML re-ranking.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Shift Status Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-healthcare-50 text-healthcare-700 flex items-center justify-center font-extrabold text-xl shrink-0 border border-healthcare-200">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
                {driver.name}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-navy-100 text-navy-800">
                Paramedic Class A
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Assigned Vehicle:{' '}
              <span className="font-mono font-bold text-slate-800">
                {ambulance.registrationNumber}
              </span>{' '}
              ({ambulance.model}) • Rating: ⭐ {driver.rating || 4.95}
            </p>
          </div>
        </div>

        {/* Shift Toggle Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={handleToggleOnline}
            className={`w-full md:w-auto px-6 py-3 rounded-2xl font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-sm ${
              isOnline
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>Shift Status: {isOnline ? 'Online (Accepting)' : 'Offline (Off-Duty)'}</span>
          </button>
        </div>
      </div>

      {/* Incoming Emergency Dispatch Modal Overlay */}
      {incomingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-emergency-500 animate-bounce-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emergency-600 font-extrabold text-sm uppercase tracking-wider">
                <Siren className="w-5 h-5 animate-pulse" />
                <span>Priority 1 Emergency Dispatch</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-emergency-100 text-emergency-800 font-mono font-bold text-xs">
                {countdown}s to respond
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">{incomingRequest.complaint}</h3>
              <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-semibold">{incomingRequest.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pickup Address:</span>
                  <span className="font-semibold text-slate-800">
                    {incomingRequest.pickupAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination Hospital:</span>
                  <span className="font-semibold text-healthcare-700">
                    {incomingRequest.hospital}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ML Estimated Travel:</span>
                  <span className="font-bold text-emerald-700">{incomingRequest.mlEta}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={handleRejectEmergency}
                className="flex-1 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition"
              >
                Decline / Pass
              </button>
              <button
                type="button"
                onClick={handleAcceptEmergency}
                className="flex-1 py-3 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Accept & Start Route
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Telemetrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Fuel Level"
          value={`${ambulance.fuelLevelPercent}%`}
          subtitle="Range ~420 km"
          icon={Fuel}
          variant="healthcare"
        />
        <StatCard
          title="O₂ Cylinder Pressure"
          value={`${ambulance.oxygenPressurePercent}%`}
          subtitle="96 PSI Normalized"
          icon={Activity}
          variant="emergency"
        />
        <StatCard
          title="Shift Response Avg"
          value="4.8 min"
          change="Top 5% in sector"
          trend="up"
          icon={Clock}
          variant="default"
        />
        <StatCard
          title="Trips Completed"
          value={driver.totalTrips || 428}
          subtitle="100% On-time handoff"
          icon={CheckCircle2}
          variant="navy"
        />
      </div>

      {/* Active Trip Control Center */}
      {activeEmergency ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Active Mission in Progress
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emergency-100 text-emergency-800">
                  {activeEmergency.severity}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {activeEmergency.chiefComplaint}
              </h3>
            </div>
            <Link
              to="/dashboard/driver/navigate"
              className="px-4 py-2 rounded-xl bg-healthcare-600 hover:bg-healthcare-700 text-white font-bold text-xs shadow flex items-center gap-1.5 transition"
            >
              <Navigation className="w-4 h-4" />
              <span>Open Turn-By-Turn Navigation</span>
            </Link>
          </div>

          {/* Quick Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Patient Details:</span>
              <div className="font-bold text-slate-800">{activeEmergency.patientName}</div>
              <div className="text-slate-500">{activeEmergency.patientPhone}</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Pickup Address:</span>
              <div className="font-bold text-slate-800 truncate">
                {activeEmergency.pickupLocation.address || 'Metro District Square'}
              </div>
              <div className="text-healthcare-700 font-semibold">ETA ~5 mins (Green Corridor)</div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block mb-1">Target Trauma Room:</span>
              <div className="font-bold text-slate-800 truncate">
                {activeEmergency.destinationHospitalName}
              </div>
              <div className="text-emerald-700 font-semibold">ER Bed Reserved & Ready</div>
            </div>
          </div>

          {/* Mission Progress Action Stepper */}
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Update Trip Status (Paramedic Telemetry Handoff):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  updateStatus(activeEmergency.id, 'ARRIVED_SCENE', 'Driver arrived at patient pickup')
                }
                className={`py-3 px-3 rounded-xl border text-xs font-bold transition ${
                  activeEmergency.status === 'ARRIVED_SCENE'
                    ? 'bg-healthcare-600 text-white shadow'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                1. Arrived at Scene
              </button>
              <button
                type="button"
                onClick={() =>
                  updateStatus(activeEmergency.id, 'TRANSPORTING', 'Patient loaded. En route to hospital')
                }
                className={`py-3 px-3 rounded-xl border text-xs font-bold transition ${
                  activeEmergency.status === 'TRANSPORTING'
                    ? 'bg-healthcare-600 text-white shadow'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                2. Transporting Patient
              </button>
              <button
                type="button"
                onClick={() =>
                  updateStatus(activeEmergency.id, 'ARRIVED_HOSPITAL', 'Ambulance arrived at Hospital ER bay')
                }
                className={`py-3 px-3 rounded-xl border text-xs font-bold transition ${
                  activeEmergency.status === 'ARRIVED_HOSPITAL'
                    ? 'bg-healthcare-600 text-white shadow'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                3. Arrived at Hospital
              </button>
              <button
                type="button"
                onClick={() =>
                  updateStatus(activeEmergency.id, 'COMPLETED', 'Patient transferred to ER trauma bay')
                }
                className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow transition"
              >
                4. Complete & Free Unit
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Standby State */
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Unit in Standby / Patrolling</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your vehicle is currently registered with the smart dispatch algorithm. You will be alerted the moment an incident requires ALS assistance.
          </p>
        </div>
      )}

      {/* Ambulance Inventory Checklist */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
          Daily Pre-Flight Equipment Readiness Check
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {Object.entries(ambulance.equipment).map(([item, ready]) => (
            <div
              key={item}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs flex items-center justify-between"
            >
              <span className="capitalize text-slate-700 font-medium">
                {item.replace(/([A-Z])/g, ' $1')}
              </span>
              <CheckCircle2 className={`w-4 h-4 ${ready ? 'text-emerald-600' : 'text-slate-300'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

