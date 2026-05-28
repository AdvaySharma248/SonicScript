// ===========================================
// App.jsx — Root Application Component
// ===========================================
//
// DAY 5+6 ROUTING STRUCTURE:
// ---------------------------
//   /              → LandingPage (standalone, no sidebar)
//   /app           → DashboardLayout → DashboardPage
//   /app/record    → DashboardLayout → RecordPage
//   /app/upload    → DashboardLayout → UploadPage
//   /app/history   → DashboardLayout → HistoryPage
//   /app/settings  → DashboardLayout → SettingsPage
//   /record        → Redirect to /app/record (backward compat)
//
// NESTED ROUTES:
//   All /app/* routes share DashboardLayout (sidebar + top navbar).
//   DashboardLayout uses <Outlet> to render child route components.
// ===========================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Standalone page (no sidebar)
import LandingPage from './pages/LandingPage';

// Dashboard layout wrapper
import DashboardLayout from './layouts/DashboardLayout';

// App pages (rendered inside DashboardLayout)
import DashboardPage from './pages/DashboardPage';
import RecordPage from './pages/RecordPage';
import UploadPage from './pages/UploadPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Home / Landing page — standalone, no sidebar */}
          <Route path="/" element={<LandingPage />} />

          {/* Backward compatibility: /record → /app/record */}
          <Route path="/record" element={<Navigate to="/app/record" replace />} />

          {/* Dashboard routes — all share the sidebar layout */}
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="record" element={<RecordPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
