/**
 * Card — Reusable glassmorphism card component.
 *
 * Props:
 *   - children: Card content
 *   - className: Additional CSS classes
 *   - hoverable: Whether to show hover effects (default: true)
 *   - padding: 'sm' | 'md' | 'lg' (default: 'md')
 */
export default function Card({
  children,
  className = '',
  hoverable = true,
  padding = 'md',
}) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-12',
  }

  return (
    <div
      className={`
        glass-card ${paddings[padding]}
        ${hoverable ? '' : 'hover:transform-none hover:bg-sonic-card hover:border-sonic-border'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
