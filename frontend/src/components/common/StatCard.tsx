import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  subtitle?: string;
  badge?: string;
  variant?: 'default' | 'emergency' | 'healthcare' | 'navy';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  subtitle,
  badge,
  variant = 'default',
  className = '',
}) => {
  const iconColors = {
    default: 'bg-slate-100 text-slate-700',
    emergency: 'bg-emergency-50 text-emergency-600',
    healthcare: 'bg-healthcare-50 text-healthcare-600',
    navy: 'bg-navy-100 text-navy-800',
  };

  return (
    <div
      className={`bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${iconColors[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(change || subtitle || badge) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {change && (
            <div className="flex items-center gap-1 font-medium">
              {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
              {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-emergency-600" />}
              {trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
              <span
                className={
                  trend === 'up'
                    ? 'text-emerald-700'
                    : trend === 'down'
                    ? 'text-emergency-700'
                    : 'text-slate-600'
                }
              >
                {change}
              </span>
            </div>
          )}
          {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-healthcare-50 text-healthcare-700 border border-healthcare-200">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

