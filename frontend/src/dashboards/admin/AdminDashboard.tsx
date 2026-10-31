import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Siren,
  Car,
  Building2,
  Activity,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BarChart3,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { MLBadge } from '../../components/common/MLBadge';
import { FleetOverviewMap } from '../../components/map/FleetOverviewMap';
import {
  MOCK_AMBULANCES,
  DEMO_HOSPITALS,
  MOCK_AUDIT_LOGS,
  MOCK_ML_PERFORMANCE,
  DEFAULT_CENTER_COORDS,
} from '../../data/mockData';
import { useEmergencyStore } from '../../store/useEmergencyStore';

export const AdminDashboard: React.FC = () => {
  const [ambulances] = useState(MOCK_AMBULANCES);
  const [hospitals] = useState(DEMO_HOSPITALS);
  const [auditLogs] = useState(MOCK_AUDIT_LOGS);
  const { activeEmergency } = useEmergencyStore();

  return (
    <div className="space-y-6">
      {/* Top Welcome / Command Center Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-healthcare-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-navy-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold text-healthcare-300 uppercase tracking-wider">
              Metropolitan Command AI v4.2
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Emergency Dispatch & Fleet Oversight
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time multi-criteria machine learning dispatch, traffic green corridor coordination, and institutional network supervision.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/admin/analytics"
            className="px-4 py-2.5 rounded-xl bg-healthcare-600 hover:bg-healthcare-700 text-white text-xs font-bold shadow flex items-center gap-2 transition"
          >
            <BarChart3 className="w-4 h-4" />
            <span>ML Analytics</span>
          </Link>
          <Link
            to="/dashboard/admin/logs"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 flex items-center gap-2 transition"
          >
            <FileText className="w-4 h-4" />
            <span>Audit Trail</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Emergencies"
          value={activeEmergency ? '4 Active' : '3 Active'}
          change="+1 in last 10m"
          trend="up"
          icon={Siren}
          variant="emergency"
        />
        <StatCard
          title="Fleet On Duty"
          value={`${ambulances.filter((a) => a.status === 'available' || a.status === 'en_route').length} / ${ambulances.length}`}
          subtitle="83% Operational Readiness"
          icon={Car}
          variant="healthcare"
        />
        <StatCard
          title="Avg Dispatch Response"
          value="5.2 min"
          change="-4.6m vs legacy 911"
          trend="down"
          icon={Clock}
          variant="default"
        />
        <StatCard
          title="ML ETA Accuracy"
          value={`${MOCK_ML_PERFORMANCE.accuracy}%`}
          subtitle="XGBoost & Graph Routing"
          icon={Sparkles}
          variant="navy"
        />
      </div>

      {/* City Fleet Interactive Map */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-navy-900 text-base">
              Metropolitan Live Fleet & Emergency Hotspots
            </h3>
            <p className="text-xs text-slate-500">
              Interactive map displaying active ambulances, hospitals, and emergency dispatch points
            </p>
          </div>
          <MLBadge label="Real-time Telemetry" score={98.8} variant="blue" />
        </div>

        <FleetOverviewMap
          ambulances={ambulances}
          hospitals={hospitals}
          center={DEFAULT_CENTER_COORDS}
          className="min-h-[440px]"
        />
      </div>

      {/* Active Incidents Feed & Verification Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Emergency Feed */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Live Priority Dispatch Incidents
            </h3>
            <span className="text-xs text-slate-500">Continuous feed</span>
          </div>

          <div className="space-y-3">
            {activeEmergency && (
              <div className="p-4 rounded-2xl bg-emergency-50/70 border border-emergency-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emergency-600 animate-ping"></span>
                    <span className="font-mono font-bold text-slate-900">{activeEmergency.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emergency-600 text-white">
                      {activeEmergency.severity}
                    </span>
                  </div>
                  <span className="font-bold text-healthcare-700">
                    ML ETA: ~{activeEmergency.estimatedArrivalMinutes}m
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800">
                  {activeEmergency.chiefComplaint}
                </p>
                <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                  <span>Unit: {activeEmergency.assignedAmbulanceReg}</span>
                  <span>Target: {activeEmergency.destinationHospitalName}</span>
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-healthcare-500"></span>
                  <span className="font-mono font-bold text-slate-900">emg-2024-9038</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
                    HIGH
                  </span>
                </div>
                <span className="font-semibold text-slate-600">En Route to Hospital</span>
              </div>
              <p className="font-medium text-slate-700">
                Compound femur fracture from two-wheeler collision
              </p>
              <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                <span>Unit: MED-EMG-0102 (Elena Rostova)</span>
                <span>Target: St. Jude Super Specialty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Verifications Widget */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Verification Queues
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              2 Pending Review
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <span>Northside Cardiac & Trauma Hospital</span>
                </div>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                  Hospital License
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                License ID: HOSP-REG-44919 • 15 ICU beds, 6 ambulances
              </p>
              <div className="pt-1 flex items-center gap-2">
                <Link
                  to="/dashboard/admin/hospitals"
                  className="px-3 py-1.5 rounded-lg bg-healthcare-600 text-white font-bold text-[11px] hover:bg-healthcare-700"
                >
                  Review Application
                </Link>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Car className="w-4 h-4 text-emerald-600" />
                  <span>Ravi Varma (Paramedic Driver)</span>
                </div>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                  Driver License
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                DL-MED-849102 • 4 years ALS driving experience
              </p>
              <div className="pt-1 flex items-center gap-2">
                <Link
                  to="/dashboard/admin/drivers"
                  className="px-3 py-1.5 rounded-lg bg-healthcare-600 text-white font-bold text-[11px] hover:bg-healthcare-700"
                >
                  Inspect Credentials
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

