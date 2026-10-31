import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Activity,
  Car,
  User,
  Plus,
  Minus,
  Siren,
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { MLBadge } from '../../components/common/MLBadge';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useEmergencyStore } from '../../store/useEmergencyStore';
import { hospitalService } from '../../services/hospitalService';
import { DEMO_HOSPITALS, MOCK_AMBULANCES } from '../../data/mockData';
import { HospitalBedStats } from '../../types';

export const HospitalDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const hospital = (user as any) || DEMO_HOSPITALS[0];
  const { addNotification } = useNotificationStore();
  const { activeEmergency } = useEmergencyStore();

  const [bedStats, setBedStats] = useState<HospitalBedStats>(hospital.bedStats);
  const [fleet] = useState(MOCK_AMBULANCES);

  const handleAdjustBed = async (type: keyof HospitalBedStats, delta: number) => {
    const current = bedStats[type];
    const nextVal = Math.max(0, current + delta);
    const updated = { ...bedStats, [type]: nextVal };
    setBedStats(updated);

    try {
      await hospitalService.updateBedAvailability(hospital.id, updated);
      addNotification({
        type: 'success',
        title: 'Bed Sync Broadcasted',
        message: `${type} updated to ${nextVal}. Synced with state emergency dispatch.`,
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hospital Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-extrabold text-xl shrink-0 border border-purple-200">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
                {hospital.name || hospital.hospitalName}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 text-purple-800">
                Level 1 Trauma Center
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Hotline: <span className="font-semibold text-slate-800">{hospital.emergencyHotline}</span> •{' '}
              {hospital.address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Emergency Dept: OPEN (Normal Protocol)</span>
          </span>
        </div>
      </div>

      {/* Bed Availability Counters Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Real-Time Emergency Bed Sync
            </h3>
            <p className="text-xs text-slate-500">
              Live capacity broadcast to smart ambulances for zero-delay trauma pre-allocation
            </p>
          </div>
          <MLBadge label="Auto-Synced with ML Dispatch" score={99.8} variant="purple" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* ICU Beds */}
          <div className="p-4 rounded-2xl bg-emergency-50/60 border border-emergency-200 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-emergency-800 uppercase tracking-wider">
                ICU Ventilator Beds
              </span>
              <span className="text-slate-500 font-semibold">Total: {bedStats.icuTotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-emergency-700">
                {bedStats.icuAvailable}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAdjustBed('icuAvailable', -1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 flex items-center justify-center transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustBed('icuAvailable', 1)}
                  className="w-8 h-8 rounded-lg bg-emergency-600 text-white font-bold hover:bg-emergency-700 flex items-center justify-center transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="text-[11px] text-slate-500">
              Occupancy: {Math.round(((bedStats.icuTotal - bedStats.icuAvailable) / bedStats.icuTotal) * 100)}%
            </div>
          </div>

          {/* Emergency / Trauma Room Beds */}
          <div className="p-4 rounded-2xl bg-healthcare-50/60 border border-healthcare-200 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-healthcare-800 uppercase tracking-wider">
                Trauma / ER Bays
              </span>
              <span className="text-slate-500 font-semibold">Total: {bedStats.emergencyTotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-healthcare-700">
                {bedStats.emergencyAvailable}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAdjustBed('emergencyAvailable', -1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 flex items-center justify-center transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustBed('emergencyAvailable', 1)}
                  className="w-8 h-8 rounded-lg bg-healthcare-600 text-white font-bold hover:bg-healthcare-700 flex items-center justify-center transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="text-[11px] text-slate-500">
              Occupancy: {Math.round(((bedStats.emergencyTotal - bedStats.emergencyAvailable) / bedStats.emergencyTotal) * 100)}%
            </div>
          </div>

          {/* Pediatric Beds */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-purple-800 uppercase tracking-wider">
                Pediatric NICU
              </span>
              <span className="text-slate-500 font-semibold">Total: {bedStats.pediatricTotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-purple-700">
                {bedStats.pediatricAvailable}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAdjustBed('pediatricAvailable', -1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 flex items-center justify-center transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustBed('pediatricAvailable', 1)}
                  className="w-8 h-8 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 flex items-center justify-center transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="text-[11px] text-slate-500">
              Occupancy: {Math.round(((bedStats.pediatricTotal - bedStats.pediatricAvailable) / bedStats.pediatricTotal) * 100)}%
            </div>
          </div>

          {/* General Inpatient */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-700 uppercase tracking-wider">
                General Ward Beds
              </span>
              <span className="text-slate-500 font-semibold">Total: {bedStats.generalTotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-slate-800">
                {bedStats.generalAvailable}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAdjustBed('generalAvailable', -1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 flex items-center justify-center transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustBed('generalAvailable', 1)}
                  className="w-8 h-8 rounded-lg bg-navy-800 text-white font-bold hover:bg-navy-900 flex items-center justify-center transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="text-[11px] text-slate-500">
              Occupancy: {Math.round(((bedStats.generalTotal - bedStats.generalAvailable) / bedStats.generalTotal) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Incoming Ambulance Admissions Board */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Siren className="w-5 h-5 text-emergency-600 animate-pulse" />
            <h3 className="font-bold text-slate-900 text-base">
              Incoming Ambulance Admissions (Pre-Arrival Telemetry)
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">1 Incoming Unit</span>
        </div>

        <div className="border border-emergency-200 bg-emergency-50/40 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emergency-600 text-white">
                  ALS CODE 3
                </span>
                <span className="font-bold text-sm text-slate-900">
                  {activeEmergency?.patientName || 'Johnathan Miller'}
                </span>
                <span className="text-xs text-slate-500">Age: 42 • Male</span>
              </div>
              <p className="text-xs text-emergency-900 font-semibold mt-1">
                "{activeEmergency?.chiefComplaint || 'Acute chest pain radiating to left arm, shortness of breath'}"
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500">ML Predicted ETA</div>
              <div className="text-2xl font-black text-emergency-600">
                ~{activeEmergency?.estimatedArrivalMinutes || 5} MINS
              </div>
            </div>
          </div>

          {/* Vitals Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Heart Rate</span>
              <span className="font-bold text-slate-900">112 BPM (Tachycardia)</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Blood Pressure</span>
              <span className="font-bold text-slate-900">148/96 mmHg</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Oxygen Saturation</span>
              <span className="font-bold text-emergency-700">93% SpO₂</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-slate-400 text-[10px] block">Responding Unit</span>
              <span className="font-mono font-bold text-slate-900">MED-EMG-0101</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-emergency-200/60">
            <span className="text-xs text-slate-600 font-medium">
              Driver: Officer Rajesh Kumar • Paramedic onboard: Yes
            </span>
            <div className="flex items-center gap-2">
              <Link
                to="/track"
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50"
              >
                Track Unit
              </Link>
              <button
                type="button"
                onClick={() =>
                  addNotification({
                    type: 'success',
                    title: 'Trauma Bay 2 Pre-allocated',
                    message: 'Emergency room team notified. Crash cart prepared for cardiac intake.',
                  })
                }
                className="px-4 py-2 rounded-xl bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs shadow-sm transition"
              >
                Confirm Trauma Bay 2 Prep
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Overview Snippet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Affiliated Fleet Status
            </h3>
            <Link to="/dashboard/hospital/fleet" className="text-xs font-bold text-healthcare-600">
              Manage Fleet →
            </Link>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {fleet.slice(0, 3).map((amb) => (
              <div key={amb.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-800">{amb.registrationNumber}</span>
                  <span className="text-slate-400 ml-2">({amb.type})</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    amb.status === 'available'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-healthcare-50 text-healthcare-700'
                  }`}
                >
                  {amb.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Emergency Team On Duty
            </h3>
            <Link to="/dashboard/hospital/drivers" className="text-xs font-bold text-healthcare-600">
              View Staff →
            </Link>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Dr. Alistair Finch</span>
                <span className="text-slate-400 text-[10px] block">Chief Trauma Surgeon</span>
              </div>
              <span className="text-emerald-700 font-bold">On Standby</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Officer Rajesh Kumar</span>
                <span className="text-slate-400 text-[10px] block">Lead Paramedic (Unit 101)</span>
              </div>
              <span className="text-healthcare-700 font-bold">Dispatched</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

