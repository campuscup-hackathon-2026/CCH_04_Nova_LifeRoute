import React, { useState } from 'react';
import { FileText, Search, Filter, ShieldCheck, AlertCircle, Download } from 'lucide-react';
import { MOCK_AUDIT_LOGS } from '../../data/mockData';
import { AuditLog } from '../../types';

export const AuditLogs: React.FC = () => {
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || log.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `smartpulse-audit-logs-${Date.now()}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
            Security & Dispatch Audit Trail
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable log of machine learning dispatches, system authorizations, and institutional verifications
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportLogs}
          className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export JSON Log</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by actor, IP or incident action..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-healthcare-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-700"
        >
          <option value="ALL">All Categories</option>
          <option value="DISPATCH">DISPATCH</option>
          <option value="AUTH">AUTH</option>
          <option value="SYSTEM">SYSTEM</option>
          <option value="VERIFICATION">VERIFICATION</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Log ID</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Actor / System</th>
                <th className="py-3.5 px-4">Details</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 font-sans">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{log.id}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{log.action}</td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <div>{log.actorName}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{log.actorRole}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-sm truncate text-xs">
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {log.status}
                    </span>
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

