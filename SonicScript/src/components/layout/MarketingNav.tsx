import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Dashboard", to: "/app" as const },
  { label: "Pricing", href: "#pricing" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setMobile(false), [path]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-white/90 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) =>
            "to" in l ? (
              <Link
                key={l.label}
                to={l.to}
                className="nav-link"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                className="nav-link"
              >
                {l.label}
              </a>
            ),
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-secondary-content hover:text-primary-strong transition-colors px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 bg-accent-green text-white text-sm font-semibold rounded-full hover:brightness-110 transition-all shadow-sm"
          >
            Get started
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-primary-strong"
          onClick={() => setMobile((m) => !m)}
          aria-label="Toggle menu"
        >
          {mobile ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden border-t border-border bg-white"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {LINKS.map((l) =>
                "to" in l ? (
                  <Link key={l.label} to={l.to} className="py-2 text-sm font-medium text-primary-strong">
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.label} href={l.href} className="py-2 text-sm font-medium text-primary-strong">
                    {l.label}
                  </a>
                ),
              )}
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  className="flex-1 text-center py-2.5 rounded-full border border-border font-medium text-sm text-primary-strong"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 text-center py-2.5 rounded-full bg-accent-green text-white font-semibold text-sm"
                >
                  Get started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
