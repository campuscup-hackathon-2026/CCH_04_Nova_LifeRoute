import React, { useState } from 'react';
import { Building2, CheckCircle2, XCircle, ShieldCheck, MapPin, PhoneCall } from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';

interface PendingHospital {
  id: string;
  name: string;
  licenseNumber: string;
  address: string;
  hotline: string;
  traumaLevel: number;
  submittedAt: string;
  totalAmbulances: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const HospitalVerification: React.FC = () => {
  const { addNotification } = useNotificationStore();
  const [hospitals, setHospitals] = useState<PendingHospital[]>([
    {
      id: 'hosp-pend-1',
      name: 'Northside Cardiac & Multi-Specialty Hospital',
      licenseNumber: 'HOSP-REG-44919-KA',
      address: '22 Ring Road North, Outer Tech Corridor',
      hotline: '1-800-NORTH-ER',
      traumaLevel: 2,
      submittedAt: '2024-10-30T10:15:00Z',
      totalAmbulances: 6,
      status: 'PENDING',
    },
    {
      id: 'hosp-pend-2',
      name: 'Valley Green Memorial Emergency Center',
      licenseNumber: 'HOSP-REG-88210-BL',
      address: '104 Valley Green Avenue',
      hotline: '1-800-VALLEY-911',
      traumaLevel: 3,
      submittedAt: '2024-10-29T14:40:00Z',
      totalAmbulances: 4,
      status: 'PENDING',
    },
  ]);

  const handleAction = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setHospitals(hospitals.map((h) => (h.id === id ? { ...h, status: newStatus } : h)));
    addNotification({
      type: newStatus === 'APPROVED' ? 'success' : 'warning',
      title: `Hospital ${newStatus}`,
      message: `The institution application has been ${newStatus.toLowerCase()} and state registry notified.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
          Hospital Network Verifications
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Review state medical licenses, trauma designations, and ER fleet readiness for healthcare partners
        </p>
      </div>

      <div className="space-y-4">
        {hospitals.map((h) => (
          <div
            key={h.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{h.name}</h3>
                  <p className="text-xs text-slate-500">
                    License ID: <span className="font-mono font-bold text-slate-700">{h.licenseNumber}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1">
                <span>Trauma Level {h.traumaLevel}</span>
                <span>•</span>
                <span>Fleet: {h.totalAmbulances} units</span>
                <span>•</span>
                <span>Hotline: {h.hotline}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {h.status === 'PENDING' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleAction(h.id, 'REJECTED')}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(h.id, 'APPROVED')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Network Access
                  </button>
                </>
              ) : (
                <span
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    h.status === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-emergency-50 text-emergency-700 border border-emergency-200'
                  }`}
                >
                  {h.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

