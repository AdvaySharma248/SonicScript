// ===========================================
// DashboardLayout — Wrapper for All App Pages
// ===========================================
//
// Provides the sidebar + top navbar shell for:
//   /app           → Dashboard
//   /app/record    → Recording Studio
//   /app/upload    → Upload Audio
//   /app/history   → History
//   /app/settings  → Settings
//
// Uses React Router's <Outlet> to render child routes.
// ===========================================

import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/layout/Sidebar';
import DashboardNavbar from '../components/layout/DashboardNavbar';

export default function DashboardLayout() {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-sonic-dark">
      {/* Sidebar — fixed on desktop, overlay on mobile */}
      <Sidebar />

      {/* Main Content Area — shifts right based on sidebar width */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        }`}
      >
        {/* Top Navigation */}
        <DashboardNavbar />

        {/* Page Content — child routes render here via <Outlet> */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
