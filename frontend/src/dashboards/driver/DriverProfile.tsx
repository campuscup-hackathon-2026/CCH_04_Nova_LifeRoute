import React from 'react';
import { User, Car, ShieldCheck, Award, PhoneCall, Mail, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { DEMO_DRIVERS, MOCK_AMBULANCES } from '../../data/mockData';

export const DriverProfile: React.FC = () => {
  const { user } = useAuthStore();
  const driver = (user as any) || DEMO_DRIVERS[0];
  const ambulance = MOCK_AMBULANCES[0];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
          Paramedic & Driver Profile
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Government certifications, emergency response credentials, and assigned vehicle telematics
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-navy-900 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
              {driver.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{driver.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Verified Paramedic
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{driver.email} • {driver.phone}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 uppercase font-bold">Lifetime Driver Rating</div>
            <div className="text-2xl font-black text-slate-900">⭐ {driver.rating || 4.95} / 5.0</div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block mb-1">State License Number</span>
            <span className="font-mono font-bold text-slate-800 text-sm">
              {driver.licenseNumber || 'DL-MED-992014'}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block mb-1">Field Experience</span>
            <span className="font-bold text-slate-800 text-sm">{driver.experienceYears || 7} Years</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block mb-1">Total Verified Runs</span>
            <span className="font-bold text-healthcare-700 text-sm">{driver.totalTrips || 428} Emergency Trips</span>
          </div>
        </div>

        {/* Assigned Ambulance Specs */}
        <div className="p-5 rounded-2xl bg-healthcare-50/60 border border-healthcare-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-healthcare-600" />
              <h4 className="font-bold text-sm text-healthcare-900">
                Assigned Vehicle: {ambulance.registrationNumber}
              </h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-healthcare-600 text-white">
              {ambulance.type} Unit
            </span>
          </div>
          <p className="text-xs text-healthcare-800">
            Model: <b>{ambulance.model}</b> • Hospital Base: <b>{ambulance.hospitalName}</b>
          </p>
          <div className="flex flex-wrap gap-2 text-xs pt-1">
            <span className="px-2 py-1 rounded bg-white text-slate-700 font-semibold border border-healthcare-200">
              Fuel: {ambulance.fuelLevelPercent}%
            </span>
            <span className="px-2 py-1 rounded bg-white text-slate-700 font-semibold border border-healthcare-200">
              Oxygen: {ambulance.oxygenPressurePercent}%
            </span>
            <span className="px-2 py-1 rounded bg-white text-emerald-700 font-semibold border border-emerald-200">
              Defibrillator: Calibrated
            </span>
            <span className="px-2 py-1 rounded bg-white text-emerald-700 font-semibold border border-emerald-200">
              Ventilator: Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

