// ===========================================
// LandingPage — Home / Marketing Page
// ===========================================
//
// This extracts the existing landing page content from App.jsx
// into its own dedicated page component. Now that we have React
// Router, each "screen" gets its own page component.
//
// WHAT CHANGED?
// --------------
// Before: App.jsx rendered Navbar + Hero + Features + HowItWorks + CTA + Footer directly
// After:  App.jsx handles routing; LandingPage renders the marketing content
//
// The CTA buttons now link to /record instead of # anchors
// ===========================================

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/features/Hero';
import Features from '../components/features/Features';
import HowItWorks from '../components/features/HowItWorks';
import CTA from '../components/features/CTA';

/**
 * LandingPage — The marketing/home page with all landing sections.
 */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
