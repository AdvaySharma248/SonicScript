// ===========================================
// Navbar — Enhanced with Framer Motion & Dashboard Link
// ===========================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Demo', href: '#demo' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
  ]

  return (
    <motion.nav
      id="navbar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-sonic-darker/80 backdrop-blur-xl border-b border-sonic-border shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" id="logo-link">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sonic-accent to-sonic-cyan flex items-center justify-center transition-transform group-hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Sonic</span>
              <span className="text-sonic-text">Script</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                className="relative px-4 py-2 text-sm text-sonic-text-dim hover:text-sonic-text rounded-lg transition-colors duration-200 hover:bg-white/5 group"
              >
                {link.label}
                {/* Hover underline animation */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-sonic-accent to-sonic-cyan rounded-full transition-all duration-300 group-hover:w-3/4" />
              </a>
            ))}
            <Link
              to="/app"
              id="nav-dashboard"
              className="ml-2 px-4 py-2 text-sm text-sonic-text-dim hover:text-sonic-text rounded-lg transition-colors duration-200 hover:bg-white/5"
            >
              Dashboard
            </Link>
            <Link
              to="/app/record"
              id="nav-try-now"
              className="ml-3 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-sonic-accent to-sonic-cyan rounded-xl hover:opacity-90 transition-all duration-200 hover:shadow-lg hover:shadow-sonic-accent-glow"
            >
              Try Now — Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden p-2 text-sonic-text-dim hover:text-sonic-text rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-80 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1 pt-2 border-t border-sonic-border">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-3 text-sm text-sonic-text-dim hover:text-sonic-text rounded-lg transition-colors hover:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/app"
              className="px-4 py-3 text-sm text-sonic-text-dim hover:text-sonic-text rounded-lg transition-colors hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/app/record"
              className="mx-2 mt-2 px-5 py-2.5 text-sm font-medium text-center text-white bg-gradient-to-r from-sonic-accent to-sonic-cyan rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Try Now — Free
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
