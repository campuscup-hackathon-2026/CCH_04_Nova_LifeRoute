import React, { useState } from 'react';
import { Car, Fuel, Activity, CheckCircle2, AlertTriangle, Plus, Search } from 'lucide-react';
import { MOCK_AMBULANCES } from '../../data/mockData';
import { Ambulance, AmbulanceStatus } from '../../types';
import { useNotificationStore } from '../../store/useNotificationStore';

export const FleetManagement: React.FC = () => {
  const [fleet, setFleet] = useState<Ambulance[]>(MOCK_AMBULANCES);
  const [filterType, setFilterType] = useState('ALL');
  const { addNotification } = useNotificationStore();

  const handleStatusChange = (id: string, status: AmbulanceStatus) => {
    setFleet(fleet.map((a) => (a.id === id ? { ...a, status } : a)));
    addNotification({
      type: 'info',
      title: 'Ambulance Status Updated',
      message: `Unit status set to ${status}. Synced with dispatch algorithm.`,
    });
  };

  const filtered = fleet.filter((a) => filterType === 'ALL' || a.type === filterType);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
            Ambulance Fleet Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Monitor telemetry, equipment inventories, fuel levels, and dispatch statuses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-700"
          >
            <option value="ALL">All Types</option>
            <option value="ALS">Advanced Life Support (ALS)</option>
            <option value="BLS">Basic Life Support (BLS)</option>
            <option value="NEONATAL">Neonatal NICU</option>
            <option value="PCC">Patient Transport (PCC)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((amb) => {
          const isAvailable = amb.status === 'available';
          const isEnRoute = amb.status === 'en_route';

          return (
            <div
              key={amb.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-base text-slate-900">
                      {amb.registrationNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        amb.type === 'ALS'
                          ? 'bg-emergency-100 text-emergency-800'
                          : 'bg-healthcare-100 text-healthcare-800'
                      }`}
                    >
                      {amb.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{amb.model}</p>
                </div>

                <select
                  value={amb.status}
                  onChange={(e) => handleStatusChange(amb.id, e.target.value as AmbulanceStatus)}
                  className={`py-1 px-2.5 rounded-lg text-xs font-bold border focus:outline-none ${
                    isAvailable
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : isEnRoute
                      ? 'bg-healthcare-50 text-healthcare-800 border-healthcare-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  <option value="available">Available</option>
                  <option value="en_route">En Route</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              {/* Fuel and Oxygen Gauge */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 text-[10px] mb-1">
                    <span>Fuel Tank</span>
                    <Fuel className="w-3 h-3 text-healthcare-600" />
                  </div>
                  <div className="font-bold text-slate-800">{amb.fuelLevelPercent}%</div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div
                      className="bg-healthcare-600 h-full rounded-full"
                      style={{ width: `${amb.fuelLevelPercent}%` }}
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 text-[10px] mb-1">
                    <span>O₂ Oxygen</span>
                    <Activity className="w-3 h-3 text-emergency-600" />
                  </div>
                  <div className="font-bold text-slate-800">{amb.oxygenPressurePercent}%</div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div
                      className="bg-emergency-600 h-full rounded-full"
                      style={{ width: `${amb.oxygenPressurePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Paramedic Driver Info */}
              <div className="text-xs space-y-1 pt-1 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver Assigned:</span>
                  <span className="font-bold text-slate-800">{amb.driverName || 'Standby Crew'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Base Depot:</span>
                  <span className="text-slate-700 truncate max-w-[160px]">{amb.hospitalName}</span>
                </div>
              </div>

              {/* Inventory Checklist */}
              <div className="pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Critical Equipment
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      amb.equipment.defibrillator
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    Defibrillator
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      amb.equipment.ventilator
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    Ventilator
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      amb.equipment.ecgMonitor
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    ECG Monitor
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

