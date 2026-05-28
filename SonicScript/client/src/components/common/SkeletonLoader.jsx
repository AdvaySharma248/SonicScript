// ===========================================
// SkeletonLoader — Shimmer Loading Placeholders
// ===========================================

/**
 * SkeletonText — Placeholder for text lines.
 */
export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="skeleton h-4"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard — Placeholder for stat/content cards.
 */
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-card p-6 hover:transform-none hover:bg-sonic-card hover:border-sonic-border ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="skeleton w-16 h-4" />
      </div>
      <div className="skeleton w-24 h-8 mb-2" />
      <div className="skeleton w-32 h-3" />
    </div>
  );
}

/**
 * SkeletonListItem — Placeholder for list items (history, etc).
 */
export function SkeletonListItem({ className = '' }) {
  return (
    <div className={`glass-card p-5 hover:transform-none hover:bg-sonic-card hover:border-sonic-border ${className}`}>
      <div className="flex items-start gap-4">
        <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-1/2" />
        </div>
        <div className="skeleton w-8 h-8 rounded-lg flex-shrink-0" />
      </div>
    </div>
  );
}
