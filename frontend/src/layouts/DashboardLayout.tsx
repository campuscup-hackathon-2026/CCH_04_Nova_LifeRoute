import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import { SimulationBanner } from '../components/common/SimulationBanner';
import { NotificationToast } from '../components/common/NotificationToast';
import { useAuthStore } from '../store/useAuthStore';

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/patient/history')) return 'Emergency History & Dispatches';
    if (path.includes('/patient/profile')) return 'Emergency Medical ID & Profile';
    if (path.includes('/patient')) return 'Patient Emergency Command';

    if (path.includes('/driver/navigate')) return 'Active Turn-By-Turn Navigation';
    if (path.includes('/driver/trips')) return 'Paramedic Trip Records';
    if (path.includes('/driver/profile')) return 'Driver & Vehicle Profile';
    if (path.includes('/driver')) return 'Ambulance Driver Terminal';

    if (path.includes('/hospital/fleet')) return 'Hospital Fleet & Vehicles';
    if (path.includes('/hospital/drivers')) return 'Paramedic Roster';
    if (path.includes('/hospital/beds')) return 'Live Bed Availability & Sync';
    if (path.includes('/hospital/analytics')) return 'Emergency Intake Analytics';
    if (path.includes('/hospital')) return 'Emergency Department Desk';

    if (path.includes('/admin/map')) return 'City-Wide Live Fleet Map';
    if (path.includes('/admin/users')) return 'Citizen & Staff User Management';
    if (path.includes('/admin/hospitals')) return 'Hospital Network Verification';
    if (path.includes('/admin/drivers')) return 'Driver License Verification';
    if (path.includes('/admin/analytics')) return 'Machine Learning Performance Metrics';
    if (path.includes('/admin/logs')) return 'Security & Dispatch Audit Logs';
    if (path.includes('/admin')) return 'Central Command & Administration';

    return 'Dashboard';
  };

  const getPageSubtitle = () => {
    const path = location.pathname;
    if (path.includes('/patient')) return 'Request immediate ALS/BLS assistance, track arriving units, and manage health vitals';
    if (path.includes('/driver')) return 'Accept emergency dispatches, monitor turn-by-turn route, and update patient triage handoffs';
    if (path.includes('/hospital')) return 'Manage ambulance fleet readiness, sync critical care beds, and admit incoming ambulances';
    if (path.includes('/admin')) return 'Oversee metropolitan emergency dispatch, verify institutions, and inspect ML routing models';
    return undefined;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      <SimulationBanner />

      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
          <Header
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            title={getPageTitle()}
            subtitle={getPageSubtitle()}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
            <Outlet />
          </main>
        </div>
      </div>

      <NotificationToast />
    </div>
  );
};

