export default function CTA() {
  return (
    <section id="cta" className="py-20 sm:py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card relative overflow-hidden p-8 sm:p-12 md:p-16 text-center hover:transform-none">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sonic-accent via-sonic-cyan to-sonic-pink" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-sonic-accent/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-sonic-cyan/10 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sonic-accent/20 bg-sonic-accent/5 mb-6">
              <span className="text-sm">🎉</span>
              <span className="text-xs sm:text-sm text-sonic-accent-light font-medium">
                $200 Free Credits — No credit card required
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">
              Ready to start{' '}
              <span className="gradient-text">transcribing</span>?
            </h2>

            <p className="text-sonic-text-dim text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join thousands of users turning speech into text with SonicScript. 
              Set up takes less than 2 minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="cta-get-started"
                className="w-full sm:w-auto px-10 py-4 text-base font-semibold text-white bg-gradient-to-r from-sonic-accent to-sonic-cyan rounded-2xl hover:opacity-90 transition-all duration-300 hover:shadow-xl hover:shadow-sonic-accent-glow hover:-translate-y-0.5 cursor-pointer"
              >
                Get Started Free →
              </button>
              <a
                href="https://github.com/AdvaySharma248/SonicScript"
                id="cta-github"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-sonic-text border border-sonic-border rounded-2xl hover:bg-white/5 hover:border-sonic-border-hover transition-all duration-300 hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
