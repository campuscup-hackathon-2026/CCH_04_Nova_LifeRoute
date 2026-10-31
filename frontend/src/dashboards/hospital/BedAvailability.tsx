import React, { useState } from 'react';
import { Activity, Plus, Minus, ShieldCheck, AlertTriangle } from 'lucide-react';
import { DEMO_HOSPITALS } from '../../data/mockData';
import { HospitalBedStats } from '../../types';
import { useNotificationStore } from '../../store/useNotificationStore';
import { MLBadge } from '../../components/common/MLBadge';

export const BedAvailability: React.FC = () => {
  const [bedStats, setBedStats] = useState<HospitalBedStats>(DEMO_HOSPITALS[0].bedStats);
  const [isSurgeActive, setIsSurgeActive] = useState(false);
  const { addNotification } = useNotificationStore();

  const handleAdjust = (field: keyof HospitalBedStats, delta: number) => {
    const nextVal = Math.max(0, bedStats[field] + delta);
    setBedStats({ ...bedStats, [field]: nextVal });
    addNotification({
      type: 'success',
      title: 'Bed Metric Broadcasted',
      message: `${field} updated to ${nextVal} and synced with central ML dispatch pool.`,
    });
  };

  const handleToggleSurge = () => {
    const next = !isSurgeActive;
    setIsSurgeActive(next);
    addNotification({
      type: next ? 'warning' : 'info',
      title: next ? 'Emergency Surge Protocol Active' : 'Normal Protocol Resumed',
      message: next
        ? 'Pre-allocated 10 overflow emergency triage bays for mass casualty or weather surge.'
        : 'Hospital bed allocation returned to standard baseline.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
            Comprehensive Bed Capacity Manager
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic ICU and trauma bed reservation synced with the SmartPulse AI routing algorithm
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleSurge}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            isSurgeActive
              ? 'bg-emergency-600 text-white shadow-lg shadow-emergency-600/30'
              : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Surge Protocol: {isSurgeActive ? 'ACTIVE (Overflow Ready)' : 'Standard'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ICU Bed Category */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">ICU Ventilator Care</h3>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emergency-100 text-emergency-800">
              Critical Life Support
            </span>
          </div>
          <p className="text-xs text-slate-500">
            For incoming patients with acute myocardial infarction, severe stroke, or respiratory collapse.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Available ICU Beds</span>
              <span className="text-3xl font-black text-emergency-700">{bedStats.icuAvailable}</span>
              <span className="text-xs text-slate-400 block mt-0.5">Total: {bedStats.icuTotal}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAdjust('icuAvailable', -1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-lg"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => handleAdjust('icuAvailable', 1)}
                className="w-10 h-10 rounded-xl bg-emergency-600 text-white font-bold hover:bg-emergency-700 flex items-center justify-center text-lg shadow-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Trauma / Emergency Category */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">Trauma & Resuscitation Bays</h3>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-healthcare-100 text-healthcare-800">
              Immediate ER Intake
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Designated for arriving ambulances with trauma surgeon teams on standby.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Available ER Bays</span>
              <span className="text-3xl font-black text-healthcare-700">{bedStats.emergencyAvailable}</span>
              <span className="text-xs text-slate-400 block mt-0.5">Total: {bedStats.emergencyTotal}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAdjust('emergencyAvailable', -1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-lg"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => handleAdjust('emergencyAvailable', 1)}
                className="w-10 h-10 rounded-xl bg-healthcare-600 text-white font-bold hover:bg-healthcare-700 flex items-center justify-center text-lg shadow-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

