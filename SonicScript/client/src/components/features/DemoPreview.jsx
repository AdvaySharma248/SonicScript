// ===========================================
// DemoPreview — Animated Transcription Demo
// ===========================================
//
// Auto-playing animated mockup showing:
//   Recording → Processing → Transcription appearing
// Pure CSS animation loop — no real interaction.
// ===========================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Simulated transcript that types out
const demoText =
  'Hello and welcome to SonicScript. This is a live demo of our real-time transcription engine. Watch as your words appear instantly on screen with remarkable accuracy...';

export default function DemoPreview() {
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(true);

  // Typewriter effect
  useEffect(() => {
    if (charIndex < demoText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(demoText.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 40 + Math.random() * 30); // Slightly random timing for realism
      return () => clearTimeout(timeout);
    } else {
      // Reset after a pause
      const resetTimeout = setTimeout(() => {
        setDisplayText('');
        setCharIndex(0);
      }, 3000);
      return () => clearTimeout(resetTimeout);
    }
  }, [charIndex]);

  return (
    <section id="demo" className="py-20 sm:py-28 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-sonic-accent-light mb-3">
            Live Demo
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            See it in{' '}
            <span className="gradient-text">action</span>
          </h2>
        </motion.div>

        {/* Demo Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Gradient border glow */}
          <div className="absolute -inset-px rounded-2xl gradient-border-animated opacity-30" />

          <div className="relative glass-card p-6 sm:p-8 hover:transform-none hover:bg-sonic-card hover:border-sonic-border overflow-hidden">
            {/* Mock Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-sonic-border/50">
              <div className="flex items-center gap-3">
                {/* Recording indicator */}
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-sonic-text-dim/30'}`} />
                  <span className="text-xs font-medium text-sonic-text-dim">
                    {charIndex < demoText.length ? 'Recording...' : 'Complete'}
                  </span>
                </div>
              </div>

              {/* Waveform bars */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="waveform-bar"
                    style={{
                      height: charIndex < demoText.length ? undefined : '4px',
                      animationPlayState: charIndex < demoText.length ? 'running' : 'paused',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Transcription Area */}
            <div className="min-h-[120px] sm:min-h-[140px]">
              <p className="text-sm sm:text-base text-sonic-text leading-relaxed font-mono">
                {displayText}
                {charIndex < demoText.length && (
                  <span className="inline-block w-0.5 h-4 bg-sonic-accent ml-0.5 animate-cursor-blink align-middle" />
                )}
              </p>
            </div>

            {/* Bottom Stats */}
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-sonic-border/50 text-xs text-sonic-text-dim">
              <span>{displayText.split(/\s+/).filter(Boolean).length} words</span>
              <span>•</span>
              <span>English (US)</span>
              <span>•</span>
              <span className="text-sonic-success">98% confidence</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
