/**
 * Button — Reusable button component with multiple variants.
 *
 * Props:
 *   - variant: 'primary' | 'secondary' | 'ghost' (default: 'primary')
 *   - size: 'sm' | 'md' | 'lg' (default: 'md')
 *   - children: Button content
 *   - className: Additional CSS classes
 *   - ...rest: Any other HTML button attributes (onClick, disabled, etc.)
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...rest
}) {
  // Base styles shared by all buttons
  const base = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  // Variant styles
  const variants = {
    primary:
      'text-white bg-gradient-to-r from-sonic-accent to-sonic-cyan hover:opacity-90 hover:shadow-xl hover:shadow-sonic-accent-glow hover:-translate-y-0.5',
    secondary:
      'text-sonic-text border border-sonic-border hover:bg-white/5 hover:border-sonic-border-hover hover:-translate-y-0.5',
    ghost:
      'text-sonic-text-dim hover:text-sonic-text hover:bg-white/5',
  }

  // Size styles
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
