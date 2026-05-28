// ===========================================
// DashboardNavbar — Top Navigation for App Pages
// ===========================================

import { useLocation } from 'react-router-dom';
import { HiMenu, HiSearch } from 'react-icons/hi';
import { useApp } from '../../context/AppContext';

// Map route paths to page titles
const pageTitles = {
  '/app': 'Dashboard',
  '/app/record': 'Recording Studio',
  '/app/upload': 'Upload Audio',
  '/app/history': 'Transcription History',
  '/app/settings': 'Settings',
};

export default function DashboardNavbar() {
  const location = useLocation();
  const { toggleMobileSidebar } = useApp();

  // Get current page title
  const pageTitle = pageTitles[location.pathname] || 'SonicScript';

  return (
    <header
      id="dashboard-navbar"
      className="sticky top-0 z-30 bg-sonic-dark/80 backdrop-blur-xl border-b border-sonic-border"
    >
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Left: Mobile menu toggle + Page title */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-sidebar-toggle"
            className="lg:hidden p-2 text-sonic-text-dim hover:text-sonic-text rounded-lg hover:bg-white/5 transition-colors"
            onClick={toggleMobileSidebar}
            aria-label="Open sidebar"
          >
            <HiMenu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-sonic-text">{pageTitle}</h1>
          </div>
        </div>

        {/* Right: Search + User Avatar */}
        <div className="flex items-center gap-3">
          {/* Search (desktop only) */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-sonic-border bg-white/[0.02] search-glow transition-all duration-200">
            <HiSearch className="w-4 h-4 text-sonic-text-dim" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-sonic-text placeholder:text-sonic-text-dim w-40 focus:w-56 transition-all duration-300"
            />
          </div>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sonic-accent to-sonic-cyan flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:shadow-lg hover:shadow-sonic-accent-glow/30 transition-shadow">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
