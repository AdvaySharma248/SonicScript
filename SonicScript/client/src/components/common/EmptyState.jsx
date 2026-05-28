// ===========================================
// EmptyState — Placeholder for Empty Data Views
// ===========================================

import { motion } from 'framer-motion';

/**
 * EmptyState — Displays a friendly empty state with icon, title, description, and optional action.
 */
export default function EmptyState({
  icon,
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      {/* Icon */}
      {icon && (
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-sonic-border flex items-center justify-center mb-6 animate-float">
          <span className="text-3xl">{icon}</span>
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-sonic-text mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-sonic-text-dim max-w-sm leading-relaxed mb-6">
          {description}
        </p>
      )}

      {/* Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-sonic-accent to-sonic-cyan rounded-xl hover:opacity-90 transition-all duration-200 hover:shadow-lg hover:shadow-sonic-accent-glow"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
