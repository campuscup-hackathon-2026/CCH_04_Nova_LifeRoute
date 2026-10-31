import React from 'react';
import { Cpu, Info, ShieldCheck } from 'lucide-react';

interface SimulationBannerProps {
  className?: string;
  compact?: boolean;
}

export const SimulationBanner: React.FC<SimulationBannerProps> = ({ className = '', compact = false }) => {
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs ${className}`}>
        <Cpu className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span>ML Dispatch Simulator (v4.2 Active)</span>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-navy-900 via-navy-800 to-healthcare-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between border-b border-white/10 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-slate-100">SIMULATION MODE:</span>
        <span className="text-slate-300">
          ML ETA predictions, GPS telemetry & traffic models are running on local simulated services.
        </span>
      </div>
      <div className="flex items-center gap-3 text-slate-300 mt-1 sm:mt-0">
        <span className="flex items-center gap-1 text-[11px] bg-white/10 px-2 py-0.5 rounded">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          FastAPI Ready
        </span>
        <span className="flex items-center gap-1 text-[11px] bg-white/10 px-2 py-0.5 rounded">
          <Cpu className="w-3 h-3 text-healthcare-300" />
          PostGIS / Redis Architecture
        </span>
      </div>
    </div>
  );
};

