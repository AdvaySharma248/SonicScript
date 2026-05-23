import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/features/Hero'
import Features from './components/features/Features'
import HowItWorks from './components/features/HowItWorks'
import CTA from './components/features/CTA'

function App() {
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
  )
}

export default App
