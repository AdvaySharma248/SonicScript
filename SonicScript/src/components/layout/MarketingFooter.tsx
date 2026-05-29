import { Logo } from "@/components/brand/Logo";

export function MarketingFooter() {
  return (
    <footer className="py-16 px-6 border-t border-border bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm text-secondary-content leading-relaxed">
            Simple, accurate speech-to-text for everyone. Record, upload, and
            transcribe with confidence.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-strong">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#features"
                  className="text-secondary-content hover:text-primary-strong transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-secondary-content hover:text-primary-strong transition-colors"
                >
                  API
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-secondary-content hover:text-primary-strong transition-colors"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-strong">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#"
                  className="text-secondary-content hover:text-primary-strong transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-secondary-content hover:text-primary-strong transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-secondary-content hover:text-primary-strong transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-strong">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#"
                  className="text-secondary-content hover:text-primary-strong transition-colors"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-secondary-content hover:text-primary-strong transition-colors"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-content">
        <span>© 2026 SonicScript</span>
        <span className="flex gap-6">
          <a href="#" className="text-secondary-content hover:text-primary-strong transition-colors">
            Twitter
          </a>
          <a href="#" className="text-secondary-content hover:text-primary-strong transition-colors">
            GitHub
          </a>
        </span>
      </div>
    </footer>
  );
}
