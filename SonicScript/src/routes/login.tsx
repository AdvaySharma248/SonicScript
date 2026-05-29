import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff, Github, Mail, ArrowRight, Mic } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — SonicScript" },
      {
        name: "description",
        content: "Sign in to your SonicScript workspace.",
      },
      { property: "og:title", content: "Sign in — SonicScript" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left visual */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-accent-green overflow-hidden">
        <Logo className="[&_span]:text-white [&_div]:bg-white/20" />

        <div className="relative z-10">
          <div className="size-20 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
            <Mic className="size-10 text-white/80" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white max-w-sm leading-tight">
            Your words, captured beautifully.
          </h2>
          <p className="mt-4 text-white/60 max-w-sm">
            Trusted by 12,400+ creators, researchers, and product teams.
          </p>
        </div>

        <p className="text-xs text-white/30 font-mono">
          © 2026 SonicScript
        </p>

        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 size-72 rounded-full bg-white/5" />
        <div className="absolute -left-10 -bottom-10 size-48 rounded-full bg-white/5" />
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="lg:hidden absolute top-6 left-6">
          <Logo />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Sign in to continue to SonicScript.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary transition text-sm font-medium">
              <Mail className="size-4" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary transition text-sm font-medium">
              <Github className="size-4" /> GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/app" });
            }}
            className="space-y-4"
          >
            <AuthInput label="Email address" type="email" name="email" />
            <AuthInput
              label="Password"
              type={showPw ? "text" : "password"}
              name="password"
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  {showPw ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              }
            />
            <div className="flex justify-between items-center text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input
                  type="checkbox"
                  className="accent-accent-green rounded"
                />{" "}
                Remember me
              </label>
              <a
                href="#"
                className="text-accent-green hover:text-accent-green/80 transition font-medium"
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-accent-green text-white font-semibold rounded-xl shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
            >
              Sign in
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition" />
            </button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-accent-green hover:text-accent-green/80 transition font-semibold"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export function AuthInput({
  label,
  suffix,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:border-accent-green focus:ring-2 focus:ring-accent-green/10 focus:outline-none transition-all"
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}
