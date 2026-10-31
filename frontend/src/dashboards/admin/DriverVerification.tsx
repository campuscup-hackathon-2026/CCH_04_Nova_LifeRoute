import React, { useState } from 'react';
import { Car, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';

interface PendingDriver {
  id: string;
  name: string;
  licenseNumber: string;
  experienceYears: number;
  phone: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const DriverVerification: React.FC = () => {
  const { addNotification } = useNotificationStore();
  const [drivers, setDrivers] = useState<PendingDriver[]>([
    {
      id: 'drv-pend-1',
      name: 'Ravi Varma',
      licenseNumber: 'DL-MED-849102',
      experienceYears: 4,
      phone: '+1 (555) 333-4455',
      email: 'ravi.paramedic@gmail.com',
      status: 'PENDING',
    },
    {
      id: 'drv-pend-2',
      name: 'Samantha Grey',
      licenseNumber: 'DL-MED-771920',
      experienceYears: 6,
      phone: '+1 (555) 444-5566',
      email: 'sgrey.als@paramedic.org',
      status: 'PENDING',
    },
  ]);

  const handleAction = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setDrivers(drivers.map((d) => (d.id === id ? { ...d, status: newStatus } : d)));
    addNotification({
      type: newStatus === 'APPROVED' ? 'success' : 'warning',
      title: `Driver ${newStatus}`,
      message: `Paramedic credential verification ${newStatus.toLowerCase()}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
          Paramedic Driver Verification Queue
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Validate commercial emergency driving certifications, background clearance, and experience
        </p>
      </div>

      <div className="space-y-4">
        {drivers.map((d) => (
          <div
            key={d.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg">
                {d.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">{d.name}</h3>
                <p className="text-xs text-slate-500">
                  License: <span className="font-mono font-bold text-slate-800">{d.licenseNumber}</span> • {d.experienceYears} Years Experience
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{d.phone} • {d.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {d.status === 'PENDING' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleAction(d.id, 'REJECTED')}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(d.id, 'APPROVED')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Verify License
                  </button>
                </>
              ) : (
                <span
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    d.status === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-emergency-50 text-emergency-700 border border-emergency-200'
                  }`}
                >
                  {d.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

