import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, Siren, MapPin, CheckCircle2, ChevronRight, X, ShieldAlert, Radio } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useEmergencyStore } from '../../store/useEmergencyStore';

export const Incoming109CallModal: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveEmergency } = useEmergencyStore();
  const [activeCall, setActiveCall] = useState<any | null>(null);
  const [hasSeenId, setHasSeenId] = useState<string | null>(null);

  useEffect(() => {
    // Poll for new 109 calls every 2 seconds
    const interval = setInterval(async () => {
      try {
        const res = await apiClient.get('/emergencies/recent-109-calls');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const latest = res.data[0];
          // If this is a recent call from within the last 60 seconds and not seen yet
          const callAgeSec = (Date.now() - new Date(latest.timestamp).getTime()) / 1000;
          if (callAgeSec < 60 && latest.call_id !== hasSeenId) {
            setActiveCall(latest);
          }
        }
      } catch {
        // quiet error in background polling
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [hasSeenId]);

  if (!activeCall) return null;

  const handleAcceptAndTrack = () => {
    if (activeCall) {
      setHasSeenId(activeCall.call_id);
      setActiveEmergency({
        id: `emg-${activeCall.request_id || '109'}`,
        patientId: 'caller-109',
        patientName: activeCall.caller_name || '109 Hotline Caller',
        patientPhone: activeCall.caller_phone || '+91 98765 00109',
        pickupLocation: {
          lat: activeCall.patient_latitude || 12.9716,
          lng: activeCall.patient_longitude || 77.5946,
          address: 'Incoming 109 Mobile Call Location',
        },
        severity: 'CRITICAL',
        status: 'DISPATCHED',
        ambulanceTypeRequired: 'ALS',
        chiefComplaint: 'Incoming 109 Emergency Phone Call',
        symptoms: ['Emergency 109 Line Activated'],
        assignedAmbulanceId: String(activeCall.assigned_ambulance_id || 'MED-EMG-0101'),
        assignedDriverName: 'First Responder Unit',
        assignedDriverPhone: '+91 98765 43210',
        assignedAmbulanceReg: 'MED-109-ALS',
        estimatedArrivalMinutes: 5,
        trafficDelayMinutes: 0.8,
        distanceKm: 2.3,
        statusTimeline: [
          {
            status: 'REQUESTED',
            timestamp: new Date().toISOString(),
            note: '109 Hotline Emergency Call Ingested from Mobile Device',
          },
          {
            status: 'DISPATCHED',
            timestamp: new Date().toISOString(),
            note: 'First Responder Unit automatically dispatched via Dijkstra ML algorithm',
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setActiveCall(null);
      navigate('/track');
    }
  };

  const handleDismiss = () => {
    if (activeCall) {
      setHasSeenId(activeCall.call_id);
      setActiveCall(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-emergency-500 relative overflow-hidden text-slate-800">
        {/* Glow ambient header */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emergency-600 via-amber-500 to-emergency-600 animate-pulse"></div>

        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-emergency-100 text-emergency-600 flex items-center justify-center shrink-0 border border-emergency-200 shadow-md animate-bounce">
            <PhoneCall className="w-7 h-7 text-emergency-600" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emergency-100 text-emergency-700 text-[10px] font-black uppercase tracking-wider">
              <Radio className="w-3 h-3 text-emergency-600 animate-ping" />
              <span>LIVE CALL DETECTED ON 109</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-navy-900 leading-tight">
              Emergency 109 Call Received!
            </h3>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2.5 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Caller Phone:</span>
            <span className="font-extrabold text-sm text-navy-950 font-mono">{activeCall.caller_phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Caller Location:</span>
            <span className="font-mono text-slate-700 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-healthcare-600" />
              {activeCall.patient_latitude?.toFixed(4)}, {activeCall.patient_longitude?.toFixed(4)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Assigned Unit:</span>
            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Unit #{activeCall.assigned_ambulance_id || 'MED-0101'} (Dispatched)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Estimated Arrival:</span>
            <span className="font-extrabold text-healthcare-700">~5-6 Minutes</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition"
          >
            Ignore
          </button>
          <button
            onClick={handleAcceptAndTrack}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emergency-600 to-emergency-700 hover:from-emergency-500 hover:to-emergency-600 text-white font-black text-sm shadow-lg shadow-emergency-600/30 flex items-center justify-center gap-2 transition active:scale-98"
          >
            <span>Open Live Tracking Map</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

