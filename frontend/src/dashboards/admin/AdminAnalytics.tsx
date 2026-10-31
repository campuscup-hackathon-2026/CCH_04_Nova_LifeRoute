import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';
import {
  MOCK_HOURLY_INCIDENTS,
  MOCK_EMERGENCY_TYPES,
  MOCK_ML_PERFORMANCE,
} from '../../data/mockData';
import { Sparkles, Brain, Cpu, TrendingDown, Clock, ShieldCheck } from 'lucide-react';
import { MLBadge } from '../../components/common/MLBadge';
import { StatCard } from '../../components/common/StatCard';

export const AdminAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
            Machine Learning Dispatch & Performance Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time evaluation of traffic regression models, response time reduction, and green corridors
          </p>
        </div>

        <div className="flex items-center gap-2">
          <MLBadge label="Ensemble XGBoost + Dijkstra Graph" score={98.4} variant="green" />
        </div>
      </div>

      {/* Model KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Model ETA Accuracy"
          value={`${MOCK_ML_PERFORMANCE.accuracy}%`}
          change="+1.2% this week"
          trend="up"
          icon={Brain}
          variant="healthcare"
        />
        <StatCard
          title="Time Saved per Trip"
          value={`-${MOCK_ML_PERFORMANCE.responseTimeReductionMinutes} min`}
          subtitle="Dynamic traffic routing"
          icon={TrendingDown}
          variant="emergency"
        />
        <StatCard
          title="Total ML Dispatches"
          value={MOCK_ML_PERFORMANCE.totalDispatchesToday}
          subtitle="Today across metropolitan core"
          icon={Cpu}
          variant="navy"
        />
        <StatCard
          title="Green Corridors"
          value={MOCK_ML_PERFORMANCE.greenCorridorsActivated}
          subtitle="Signal priority synchronized"
          icon={ShieldCheck}
          variant="default"
        />
      </div>

      {/* Chart: ML Predicted vs Target Response Time */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
              ML Response Time vs Traditional Dispatch Baseline (Minutes)
            </h3>
            <p className="text-xs text-slate-500">
              Blue area depicts actual ML response times; dashed gray line depicts traditional 8.0m standard
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Avg 4.8 min reduction
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_HOURLY_INCIDENTS}>
              <defs>
                <linearGradient id="colorEta" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis
                domain={[4, 12]}
                tick={{ fontSize: 11, fill: '#64748B' }}
                unit="m"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="avgEta"
                stroke="#2563EB"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorEta)"
                name="ML Response Time"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#94A3B8"
                strokeDasharray="5 5"
                strokeWidth={2}
                name="Legacy Baseline"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Incident Volume and Urgency Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            24-Hour Emergency Incident Density
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_HOURLY_INCIDENTS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="incidents" fill="#DC2626" radius={[4, 4, 0, 0]} name="Emergencies" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance weights */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            ML Feature Importance Weights
          </h3>
          <p className="text-xs text-slate-500">
            Relative weight contribution to optimal ambulance selection model
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Haversine & Road Distance</span>
                <span>40%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-healthcare-600 h-full rounded-full" style={{ width: '40%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Real-Time Traffic Congestion Index</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '30%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>ALS / BLS Equipment Fit</span>
                <span>15%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emergency-600 h-full rounded-full" style={{ width: '15%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Driver Shift Readiness & Fuel</span>
                <span>15%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

