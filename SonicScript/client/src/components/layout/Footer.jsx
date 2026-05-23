export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="footer" className="border-t border-sonic-border bg-sonic-darker/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sonic-accent to-sonic-cyan flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <span className="text-lg font-bold">
                <span className="gradient-text">Sonic</span>
                <span className="text-sonic-text">Script</span>
              </span>
            </div>
            <p className="text-sm text-sonic-text-dim leading-relaxed">
              Transform your voice into text with AI-powered transcription. Fast, accurate, and beautifully simple.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-sonic-text mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {['Features', 'How It Works', 'Get Started'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-sonic-text-dim hover:text-sonic-accent-light transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-sm font-semibold text-sonic-text mb-4 uppercase tracking-wider">Built With</h4>
            <div className="flex flex-wrap gap-2">
              {['React', 'Vite', 'Tailwind', 'Express', 'MongoDB', 'Deepgram'].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs text-sonic-text-dim bg-white/5 border border-sonic-border rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-sonic-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sonic-text-dim">
            © {currentYear} SonicScript. Built for learning.
          </p>
          <div className="flex items-center gap-1 text-xs text-sonic-text-dim">
            Made with
            <span className="text-sonic-pink animate-pulse mx-1">♥</span>
            using the MERN Stack
          </div>
        </div>
      </div>
    </footer>
  )
}
