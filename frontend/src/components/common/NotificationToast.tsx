import React from 'react';
import { useNotificationStore } from '../../store/useNotificationStore';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {notifications.map((notif) => {
        const isEmergency = notif.type === 'emergency';
        const isSuccess = notif.type === 'success';
        const isWarning = notif.type === 'warning';

        return (
          <div
            key={notif.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-slideUp flex items-start gap-3 ${
              isEmergency
                ? 'bg-emergency-900/95 text-white border-emergency-500 shadow-emergency-950/40'
                : isSuccess
                ? 'bg-emerald-900/95 text-white border-emerald-500 shadow-emerald-950/40'
                : isWarning
                ? 'bg-amber-900/95 text-white border-amber-500 shadow-amber-950/40'
                : 'bg-navy-900/95 text-white border-slate-700 shadow-navy-950/40'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isEmergency && <AlertCircle className="w-5 h-5 text-emergency-400 animate-pulse" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isEmergency && !isSuccess && !isWarning && (
                <Info className="w-5 h-5 text-healthcare-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold truncate">{notif.title}</h4>
                <span className="text-[10px] opacity-70 ml-2">{notif.timestamp}</span>
              </div>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">{notif.message}</p>
            </div>

            <button
              onClick={() => removeNotification(notif.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

