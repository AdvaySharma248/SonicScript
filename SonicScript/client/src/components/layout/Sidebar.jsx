// ===========================================
// Sidebar — Dashboard Navigation Sidebar
// ===========================================
//
// Collapsible sidebar with:
//   - SonicScript logo
//   - Navigation items with active route indicators
//   - Collapse/expand toggle
//   - Mobile overlay drawer mode
//
// RESPONSIVE BEHAVIOR:
//   Desktop: Push sidebar (content shifts)
//   Mobile: Overlay drawer with backdrop
// ===========================================

import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiHome,
  HiMicrophone,
  HiUpload,
  HiClock,
  HiCog,
  HiChevronLeft,
  HiChevronRight,
  HiX,
} from 'react-icons/hi';
import { useApp } from '../../context/AppContext';

// Navigation items configuration
const navItems = [
  { label: 'Dashboard', path: '/app', icon: HiHome, exact: true },
  { label: 'Record Audio', path: '/app/record', icon: HiMicrophone },
  { label: 'Upload Audio', path: '/app/upload', icon: HiUpload },
  { label: 'History', path: '/app/history', icon: HiClock },
  { label: 'Settings', path: '/app/settings', icon: HiCog },
];

export default function Sidebar() {
  const location = useLocation();
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileSidebarOpen,
    closeMobileSidebar,
  } = useApp();

  // Check if a nav item is active
  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="px-4 py-5 flex items-center justify-between border-b border-sonic-border/50">
        <Link to="/" className="flex items-center gap-2.5 group" onClick={closeMobileSidebar}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sonic-accent to-sonic-cyan flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="text-lg font-bold whitespace-nowrap"
            >
              <span className="gradient-text">Sonic</span>
              <span className="text-sonic-text">Script</span>
            </motion.span>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          className="lg:hidden p-1.5 text-sonic-text-dim hover:text-sonic-text rounded-lg hover:bg-white/5 transition-colors"
          onClick={closeMobileSidebar}
          aria-label="Close sidebar"
        >
          <HiX className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              id={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'active text-sonic-accent-light'
                  : 'text-sonic-text-dim hover:text-sonic-text'
              }`}
              onClick={closeMobileSidebar}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${active ? 'text-sonic-accent-light' : ''}`} />
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
              {/* Active indicator dot (collapsed mode) */}
              {sidebarCollapsed && active && (
                <motion.div
                  layoutId="sidebar-active-dot"
                  className="absolute right-2 w-1.5 h-1.5 rounded-full bg-sonic-accent"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle (desktop only) */}
      <div className="hidden lg:block px-3 py-4 border-t border-sonic-border/50">
        <button
          id="sidebar-collapse-toggle"
          onClick={toggleSidebar}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sonic-text-dim hover:text-sonic-text hover:bg-white/5 transition-all duration-200"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <HiChevronRight className="w-5 h-5 flex-shrink-0" />
          ) : (
            <>
              <HiChevronLeft className="w-5 h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar — always visible, push layout */}
      <aside
        id="sidebar"
        className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40 bg-sonic-darker/90 backdrop-blur-xl border-r border-sonic-border transition-all duration-300 ${
          sidebarCollapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar — overlay drawer with backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 modal-backdrop lg:hidden"
              onClick={closeMobileSidebar}
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-sonic-darker/95 backdrop-blur-xl border-r border-sonic-border lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
