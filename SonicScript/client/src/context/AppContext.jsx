// ===========================================
// AppContext — Global Application State
// ===========================================
//
// Provides shared state that multiple components need:
//   - Sidebar collapsed/expanded state
//   - Global notification preferences
//
// WHY CONTEXT?
// ------------
// Instead of "prop drilling" (passing props through 5+ levels),
// Context lets any component access shared state directly.
// ===========================================

import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

/**
 * AppProvider — Wraps the app and provides global state.
 */
export function AppProvider({ children }) {
  // Sidebar state — persisted in localStorage for user preference
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sonic-sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Mobile sidebar open state (overlay drawer)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Toggle sidebar collapsed state
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sonic-sidebar-collapsed', String(next));
      } catch {
        // localStorage unavailable — ignore
      }
      return next;
    });
  }, []);

  // Toggle mobile sidebar
  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen((prev) => !prev);
  }, []);

  // Close mobile sidebar
  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  const value = {
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
    mobileSidebarOpen,
    toggleMobileSidebar,
    closeMobileSidebar,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * useApp — Convenience hook for consuming AppContext.
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
