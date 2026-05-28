// ===========================================
// LandingPage — Home / Marketing Page
// ===========================================
//
// Day 5+6: Added Testimonials and DemoPreview sections.
// CTA buttons now link to /app/* routes.
// ===========================================

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/features/Hero';
import Features from '../components/features/Features';
import DemoPreview from '../components/features/DemoPreview';
import HowItWorks from '../components/features/HowItWorks';
import Testimonials from '../components/features/Testimonials';
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
          <DemoPreview />
          <HowItWorks />
          <Testimonials />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
