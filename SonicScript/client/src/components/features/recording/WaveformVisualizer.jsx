// ===========================================
// WaveformVisualizer — Animated Audio Bars
// ===========================================
//
// A row of animated bars that simulate an audio waveform.
// When the user is speaking, bars dance with random heights
// using Framer Motion spring physics. When idle, bars shrink
// to a flat line for a clean resting state.
//
// WHY FRAMER MOTION SPRING?
// --------------------------
// Spring animations feel more natural than linear or ease animations
// because they simulate real-world physics (bouncing, overshooting).
// This makes the waveform feel "alive" rather than mechanical.
// ===========================================

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

/**
 * WaveformVisualizer — Animated bars that react to listening state.
 *
 * @param {Object} props
 * @param {boolean} props.isListening - Whether speech recognition is active
 * @param {boolean} props.isPaused - Whether recording is paused
 */
export default function WaveformVisualizer({ isListening, isPaused }) {
  // Number of bars in the waveform
  const barCount = 14;

  // Random heights for each bar (updated continuously while listening)
  const [heights, setHeights] = useState(Array(barCount).fill(8));

  // Generate new random heights to simulate waveform movement
  const generateHeights = useCallback(() => {
    return Array.from({ length: barCount }, () =>
      // Random height between 8px (min) and 48px (max)
      Math.random() * 40 + 8
    );
  }, [barCount]);

  // Continuously update bar heights while listening
  useEffect(() => {
    if (isListening && !isPaused) {
      // Update heights every 150ms for smooth animation
      const interval = setInterval(() => {
        setHeights(generateHeights());
      }, 150);

      return () => clearInterval(interval);
    } else {
      // When not listening, reset to flat line
      setHeights(Array(barCount).fill(8));
    }
  }, [isListening, isPaused, generateHeights, barCount]);

  return (
    <div
      id="waveform-visualizer"
      className="flex items-center justify-center gap-[3px] h-14"
    >
      {heights.map((height, index) => (
        <motion.div
          key={index}
          className="w-[3px] rounded-full"
          style={{
            // Gradient from purple to cyan, matching the design system
            background: `linear-gradient(to top, var(--color-sonic-accent), var(--color-sonic-cyan))`,
            // When paused, show a dimmed version
            opacity: isPaused ? 0.3 : isListening ? 0.9 : 0.25,
          }}
          // Animate height changes with spring physics
          animate={{
            height: isListening && !isPaused ? height : 8,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,    // How "snappy" the spring is
            damping: 15,       // How quickly it stops bouncing
            mass: 0.5,         // How "heavy" the bar feels
          }}
        />
      ))}
    </div>
  );
}
