// ===========================================
// App.jsx — Root Application Component
// ===========================================
//
// WHAT CHANGED IN DAY 4?
// -----------------------
// Before: App rendered all landing page sections directly
// After:  App sets up React Router with two routes:
//   /       → LandingPage (marketing page)
//   /record → RecordPage (recording studio)
//
// WHY REACT ROUTER?
// ------------------
// React Router lets us have multiple "pages" in a Single Page App.
// Instead of loading a new HTML file for each page (like traditional
// websites), React Router swaps components in and out — making
// page transitions instant and smooth.
//
// BrowserRouter — uses the browser's URL bar for navigation
// Routes — container for all route definitions
// Route — maps a URL path to a component
// ===========================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Page components — each represents a full screen
import LandingPage from './pages/LandingPage';
import RecordPage from './pages/RecordPage';

function App() {
  return (
    // BrowserRouter wraps the entire app to enable URL-based routing
    <BrowserRouter>
      <Routes>
        {/* Home / Landing page — the marketing page visitors see first */}
        <Route path="/" element={<LandingPage />} />

        {/* Recording Studio — where users transcribe speech to text */}
        <Route path="/record" element={<RecordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
