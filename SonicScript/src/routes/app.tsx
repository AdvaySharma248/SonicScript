import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { AppHeader } from "@/components/layout/AppHeader";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Dashboard — SonicScript" },
      { name: "description", content: "Your SonicScript workspace." },
    ],
  }),
  component: AppLayout,
});

const TITLES: Record<string, string> = {
  "/app": "Home",
  "/app/record": "Record",
  "/app/upload": "Upload",
  "/app/history": "History",
  "/app/settings": "Settings",
};

function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const title =
    TITLES[path] ??
    (path.startsWith("/app/transcription") ? "Transcription" : "SonicScript");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader
        onMenuToggle={() => setDrawerOpen(true)}
        title={title}
      />
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <main className="flex-1 pb-28 md:pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={path}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}
