import React, { useState } from 'react';
import { Users, Search, Filter, CheckCircle2, XCircle, ShieldCheck, User } from 'lucide-react';
import { DEMO_PATIENTS, DEMO_DRIVERS, DEMO_HOSPITALS, DEMO_ADMINS } from '../../data/mockData';
import { User as UserType } from '../../types';
import { useNotificationStore } from '../../store/useNotificationStore';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([
    ...DEMO_PATIENTS,
    ...DEMO_DRIVERS,
    ...DEMO_HOSPITALS,
    ...DEMO_ADMINS,
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const { addNotification } = useNotificationStore();

  const handleToggleVerify = (id: string) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, isVerified: !u.isVerified } : u))
    );
    addNotification({
      type: 'success',
      title: 'User Status Updated',
      message: 'Account verification state modified successfully.',
    });
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
          User & Identity Management
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Supervise citizen accounts, certified paramedic drivers, and verified hospital personnel
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email or mobile..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-healthcare-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white text-slate-700"
        >
          <option value="ALL">All Roles</option>
          <option value="patient">Patient / Citizen</option>
          <option value="driver">Ambulance Driver</option>
          <option value="hospital">Hospital Staff</option>
          <option value="admin">Administrator</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <span>{user.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{user.email}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">{user.phone}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        user.role === 'admin'
                          ? 'bg-navy-100 text-navy-800'
                          : user.role === 'hospital'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'driver'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-healthcare-100 text-healthcare-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {user.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700">
                        <XCircle className="w-3.5 h-3.5" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleVerify(user.id)}
                      className="text-xs font-semibold text-healthcare-600 hover:text-healthcare-800 underline"
                    >
                      {user.isVerified ? 'Revoke' : 'Verify'}
                    </button>
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

