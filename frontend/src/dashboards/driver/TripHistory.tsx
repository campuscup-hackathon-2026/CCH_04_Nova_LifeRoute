import React, { useState } from 'react';
import { Car, Clock, CheckCircle2, Search, Download, ChevronRight } from 'lucide-react';
import { MOCK_BOOKING_HISTORY } from '../../data/mockData';

export const TripHistory: React.FC = () => {
  const [trips] = useState(MOCK_BOOKING_HISTORY);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
          Paramedic Trip & Dispatch Records
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Historical log of emergency runs, response times, and patient handoff certificates
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Trip ID</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Incident Nature</th>
                <th className="py-3.5 px-4">Hospital Hand-off</th>
                <th className="py-3.5 px-4">Response Time</th>
                <th className="py-3.5 px-4">Distance</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-healthcare-700">{trip.id}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{trip.chiefComplaint}</td>
                  <td className="py-3.5 px-4 text-slate-700">{trip.destinationHospitalName}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    {trip.estimatedArrivalMinutes || 6} mins
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{trip.distanceKm || 3.2} km</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Handoff Verified
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

