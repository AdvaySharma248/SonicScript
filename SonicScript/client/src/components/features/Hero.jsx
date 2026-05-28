// ===========================================
// Hero — Enhanced with Framer Motion & Particles
// ===========================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Particle positions (CSS-only floating dots)
const particles = Array.from({ length: 12 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 6}s`,
  duration: `${6 + Math.random() * 6}s`,
  size: `${2 + Math.random() * 2}px`,
}));

export default function Hero() {
  return (
    <section id="hero" className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 px-4">
      {/* Floating Particles */}
      <div className="particles">
        {particles.map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sonic-border bg-white/5 backdrop-blur-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-sonic-success animate-pulse" />
          <span className="text-xs sm:text-sm text-sonic-text-dim font-medium">
            Free AI Transcription — No API Keys Needed
          </span>
        </motion.div>

        {/* Heading — Animated gradient text */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6"
        >
          Turn{' '}
          <span className="gradient-text-animated">voice</span>
          {' '}into
          <br />
          text, instantly
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-base sm:text-lg md:text-xl text-sonic-text-dim max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Record or upload audio and get accurate transcriptions in seconds.
          Built with the MERN stack and powered by cutting-edge AI.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/app/record"
            id="hero-cta-primary"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-sonic-accent to-sonic-cyan rounded-2xl hover:opacity-90 transition-all duration-300 hover:shadow-xl hover:shadow-sonic-accent-glow hover:-translate-y-0.5 animate-pulse-glow"
          >
            🎤 Start Recording
          </Link>
          <Link
            to="/app/upload"
            id="hero-cta-secondary"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-sonic-text border border-sonic-border rounded-2xl hover:bg-white/5 hover:border-sonic-border-hover transition-all duration-300 hover:-translate-y-0.5"
          >
            📁 Upload Audio
          </Link>
        </motion.div>

        {/* Waveform Animation — Framer Motion stagger */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center justify-center gap-1.5 mt-16"
        >
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="waveform-bar"
              style={{ height: '12px' }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.7 + i * 0.08 }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
