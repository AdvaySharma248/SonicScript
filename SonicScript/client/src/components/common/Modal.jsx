// ===========================================
// Modal — Reusable Overlay Dialog
// ===========================================

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';

/**
 * Modal — Glassmorphism overlay dialog with backdrop blur.
 *
 * Props:
 *   - isOpen: boolean — whether the modal is visible
 *   - onClose: function — called when backdrop is clicked or close button pressed
 *   - title: string — modal heading
 *   - children: content
 *   - maxWidth: string — Tailwind max-width class (default: 'max-w-md')
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 modal-backdrop"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative ${maxWidth} w-full glass-card p-6 hover:transform-none hover:bg-sonic-card hover:border-sonic-border`}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-sonic-text">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1.5 text-sonic-text-dim hover:text-sonic-text rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="Close modal"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Body */}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
