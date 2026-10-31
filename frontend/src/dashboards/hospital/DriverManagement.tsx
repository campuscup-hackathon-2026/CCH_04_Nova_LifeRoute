import React, { useState } from 'react';
import { User, PhoneCall, ShieldCheck, CheckCircle2, Car } from 'lucide-react';
import { DEMO_DRIVERS } from '../../data/mockData';

export const DriverManagement: React.FC = () => {
  const [drivers] = useState(DEMO_DRIVERS);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
          Paramedic & Driver Staff Roster
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Active shift schedules, emergency certifications, and assigned vehicles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((drv) => (
          <div
            key={drv.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-healthcare-50 text-healthcare-700 flex items-center justify-center font-bold text-lg">
                {drv.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{drv.name}</h3>
                <p className="text-xs text-slate-500">{drv.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      drv.status === 'online' ? 'bg-emerald-500' : 'bg-healthcare-500'
                    }`}
                  />
                  <span className="text-[11px] font-semibold text-slate-700 capitalize">
                    {drv.status} on Shift
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">License:</span>
                <span className="font-mono font-bold text-slate-800">{drv.licenseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Experience:</span>
                <span className="font-bold text-slate-800">{drv.experienceYears} Years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trips Driven:</span>
                <span className="font-bold text-healthcare-700">{drv.totalTrips}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rating:</span>
                <span className="font-bold text-slate-800">⭐ {drv.rating}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={`tel:${drv.phone}`}
                className="flex-1 py-2 rounded-xl bg-healthcare-50 hover:bg-healthcare-100 text-healthcare-700 border border-healthcare-200 text-xs font-bold text-center flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Staff</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

