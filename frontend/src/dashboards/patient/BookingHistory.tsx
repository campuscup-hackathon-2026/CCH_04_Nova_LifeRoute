import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, FileText, Download, CheckCircle2, ChevronRight, Search, Filter } from 'lucide-react';
import { useEmergencyStore } from '../../store/useEmergencyStore';
import { EmergencyRequest } from '../../types';

export const BookingHistory: React.FC = () => {
  const { history, fetchHistory, activeEmergency } = useEmergencyStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const allRecords = activeEmergency ? [activeEmergency, ...history] : history;

  const filtered = allRecords.filter((req) => {
    const matchesSearch =
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.destinationHospitalName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDownloadReport = (req: EmergencyRequest) => {
    const reportText = `SMARTPULSE AI - EMERGENCY DISPATCH REPORT\n` +
      `Incident ID: ${req.id}\n` +
      `Date/Time: ${req.createdAt}\n` +
      `Patient Name: ${req.patientName}\n` +
      `Severity: ${req.severity}\n` +
      `Ambulance: ${req.assignedAmbulanceReg} (${req.ambulanceTypeRequired})\n` +
      `Destination: ${req.destinationHospitalName}\n` +
      `Complaint: ${req.chiefComplaint}\n` +
      `Status: ${req.status}\n`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dispatch-Report-${req.id}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
            Emergency Dispatch History
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete audit trail of all ambulance requests, paramedic handoffs, and medical incident notes
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by incident ID, symptom or hospital..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-healthcare-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="EN_ROUTE_PICKUP">En Route</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Incident ID</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Emergency Complaint</th>
                <th className="py-3.5 px-4">Assigned Unit</th>
                <th className="py-3.5 px-4">Destination Hospital</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-healthcare-700">
                    <Link to="/track" className="hover:underline">
                      {item.id}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate">
                    {item.chiefComplaint}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-800">
                      {item.assignedAmbulanceReg || 'MED-EMG-0101'}
                    </span>
                    <span className="block text-[10px] text-slate-500">{item.ambulanceTypeRequired}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{item.destinationHospitalName}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        item.severity === 'CRITICAL'
                          ? 'bg-emergency-100 text-emergency-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-healthcare-50 text-healthcare-700 border border-healthcare-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to="/track"
                        className="p-1.5 rounded-lg text-healthcare-600 hover:bg-healthcare-50 font-bold"
                        title="Live tracking"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDownloadReport(item)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                        title="Download medical summary report"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

