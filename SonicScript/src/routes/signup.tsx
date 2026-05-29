import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, EyeOff, Github, Mail, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { AuthInput } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — SonicScript" },
      {
        name: "description",
        content: "Create your free SonicScript account.",
      },
      { property: "og:title", content: "Create account — SonicScript" },
    ],
  }),
  component: SignupPage,
});

const PERKS = [
  "Unlimited recordings",
  "Real-time live transcription",
  "Export to TXT, JSON, VTT",
  "End-to-end encrypted history",
];

function SignupPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left visual */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-accent-orange overflow-hidden">
        <Logo className="[&_span]:text-white [&_div]:bg-white/20" />

        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-white max-w-sm leading-tight">
            Join 12,400+ teams building with voice.
          </h2>
          <ul className="mt-6 space-y-3 max-w-sm">
            {PERKS.map((p) => (
              <li
                key={p}
                className="flex items-center gap-3 text-sm text-white/70"
              >
                <span className="size-5 rounded-full bg-white/15 flex items-center justify-center">
                  <Check className="size-3 text-white" />
                </span>
                {p}
              </li>
            ))}
          </ul>
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
            Create your account
          </h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Free to use. No credit card needed.
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
            <AuthInput label="Full name" type="text" name="name" />
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
            <button
              type="submit"
              className="w-full py-3 bg-accent-green text-white font-semibold rounded-xl shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
            >
              Create account
              <ArrowRight className="size-4 group-hover:translate-x-0.5 transition" />
            </button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent-green hover:text-accent-green/80 transition font-semibold"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
