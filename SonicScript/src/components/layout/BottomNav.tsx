import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Mic, Upload, Clock, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", to: "/app" as const, icon: Home, exact: true },
  { label: "Record", to: "/app/record" as const, icon: Mic },
  { label: "Upload", to: "/app/upload" as const, icon: Upload },
  { label: "History", to: "/app/history" as const, icon: Clock },
  { label: "Settings", to: "/app/settings" as const, icon: Settings },
];

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");

  return (
    <nav
      id="bottom-nav"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 px-2 py-2 rounded-full bg-white/80 backdrop-blur-xl border border-border shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)]"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.to, item.exact);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
              active
                ? "text-accent-green"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.div
                layoutId="bottomnav-active"
                className="absolute inset-0 bg-accent-green/8 rounded-full"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
            <item.icon className="size-[18px] relative z-10" />
            <motion.span
              className="relative z-10"
              initial={false}
              animate={{
                width: active ? "auto" : 0,
                opacity: active ? 1 : 0,
                marginLeft: active ? 0 : -8,
              }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden", whiteSpace: "nowrap" }}
            >
              {item.label}
            </motion.span>
          </Link>
        );
      })}
    </nav>
  );
}
