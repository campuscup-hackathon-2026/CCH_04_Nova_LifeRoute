import React, { useState } from 'react';
import { AlertTriangle, Siren, Flame, PhoneCall } from 'lucide-react';

interface EmergencySOSButtonProps {
  onTrigger: () => void;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  isLoading?: boolean;
  className?: string;
  showConfirmModal?: boolean;
}

export const EmergencySOSButton: React.FC<EmergencySOSButtonProps> = ({
  onTrigger,
  size = 'lg',
  isLoading = false,
  className = '',
  showConfirmModal = true,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = () => {
    if (showConfirmModal) {
      setIsConfirming(true);
    } else {
      onTrigger();
    }
  };

  const confirmSOS = () => {
    setIsConfirming(false);
    onTrigger();
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-bold',
    hero: 'w-44 h-44 rounded-full flex-col justify-center text-xl font-extrabold tracking-wide',
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        aria-label="Trigger Emergency SOS"
        className={`relative group inline-flex items-center justify-center font-bold text-white transition-all duration-300 active:scale-95 shadow-xl hover:shadow-emergency-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${
          size === 'hero'
            ? 'rounded-full bg-gradient-to-tr from-emergency-700 via-emergency-600 to-emergency-500 border-4 border-emergency-300/40'
            : 'rounded-xl bg-emergency-600 hover:bg-emergency-700 border border-emergency-500'
        } ${className}`}
      >
        {/* Pulsing ring animation */}
        <span className="absolute -inset-1 rounded-full bg-emergency-500 opacity-40 animate-ping group-hover:opacity-75 duration-1000"></span>
        <span className="absolute -inset-3 rounded-full bg-emergency-400 opacity-20 animate-pulse"></span>

        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>DISPATCHING...</span>
            </div>
          ) : size === 'hero' ? (
            <div className="flex flex-col items-center">
              <Siren className="w-12 h-12 mb-1 animate-bounce text-white drop-shadow-md" />
              <span className="text-2xl font-black tracking-widest text-white">SOS</span>
              <span className="text-[11px] font-semibold text-emergency-100 uppercase tracking-tight mt-0.5">
                Instant Dispatch
              </span>
            </div>
          ) : (
            <>
              <Siren className="w-5 h-5 animate-pulse text-white" />
              <span>EMERGENCY SOS</span>
            </>
          )}
        </span>
      </button>

      {/* Confirmation Modal */}
      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-emergency-200">
            <div className="w-14 h-14 rounded-full bg-emergency-100 text-emergency-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">
              Confirm Immediate SOS Dispatch
            </h3>

            <p className="text-sm text-center text-slate-600 mb-6">
              You are about to dispatch an Advanced Life Support (ALS) ambulance to your current detected location via SmartPulse AI.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 mb-6 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-semibold">Priority 1 Medical Emergency</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ML Estimated Response:</span>
                <span className="font-semibold text-healthcare-700">~5-7 Minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nearest Unit:</span>
                <span className="font-semibold text-emerald-700">MED-EMG-0101 (Online)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                className="flex-1 px-3 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition"
              >
                Cancel
              </button>
              <a
                href="tel:109"
                className="px-3 py-2.5 rounded-lg bg-emergency-50 hover:bg-emergency-100 text-emergency-700 border border-emergency-200 font-bold text-xs flex items-center gap-1.5 transition shrink-0"
                title="Dial 109 Direct Emergency Line"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emergency-600" />
                Dial 109
              </a>
              <button
                type="button"
                onClick={confirmSOS}
                className="flex-1 px-3 py-2.5 rounded-lg bg-emergency-600 hover:bg-emergency-700 text-white font-bold text-xs sm:text-sm shadow transition flex items-center justify-center gap-1.5"
              >
                <Siren className="w-3.5 h-3.5" />
                Confirm SOS
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

