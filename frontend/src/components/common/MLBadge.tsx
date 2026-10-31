import React from 'react';
import { Sparkles, Brain, Activity } from 'lucide-react';

interface MLBadgeProps {
  score?: number;
  label?: string;
  variant?: 'green' | 'blue' | 'purple' | 'red';
  showIcon?: boolean;
  className?: string;
}

export const MLBadge: React.FC<MLBadgeProps> = ({
  score = 98.4,
  label = 'ML Optimized',
  variant = 'blue',
  showIcon = true,
  className = '',
}) => {
  const colorMap = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-healthcare-50 text-healthcare-700 border-healthcare-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    red: 'bg-emergency-50 text-emergency-700 border-emergency-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${colorMap[variant]} ${className}`}
      title="Machine Learning Calculated Metric"
    >
      {showIcon && <Sparkles className="w-3.5 h-3.5 shrink-0" />}
      <span>{label}</span>
      {score !== undefined && (
        <span className="font-bold opacity-90 pl-1 border-l border-current/20">
          {score}%
        </span>
      )}
    </span>
  );
};

