import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sonic-border bg-white/5 backdrop-blur-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-sonic-success animate-pulse" />
          <span className="text-xs sm:text-sm text-sonic-text-dim font-medium">
            Free AI Transcription — No API Keys Needed
          </span>
        </div>

        {/* Heading */}
        <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
          Transform your{' '}
          <span className="gradient-text">voice</span>
          <br />
          into text, instantly
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up-delay-1 text-base sm:text-lg md:text-xl text-sonic-text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
          Record or upload audio and get accurate transcriptions in seconds. 
          Built with the MERN stack and powered by cutting-edge AI.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up-delay-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/record"
            id="hero-cta-primary"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-sonic-accent to-sonic-cyan rounded-2xl hover:opacity-90 transition-all duration-300 hover:shadow-xl hover:shadow-sonic-accent-glow hover:-translate-y-0.5 animate-pulse-glow"
          >
            🎤 Start Transcribing
          </Link>
          <a
            href="#how-it-works"
            id="hero-cta-secondary"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-sonic-text border border-sonic-border rounded-2xl hover:bg-white/5 hover:border-sonic-border-hover transition-all duration-300 hover:-translate-y-0.5"
          >
            See How It Works →
          </a>
        </div>

        {/* Waveform Animation */}
        <div className="animate-fade-in-up-delay-3 flex items-center justify-center gap-1.5 mt-16">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="waveform-bar"
              style={{ height: '12px' }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
