import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Mic, Download, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "audio", label: "Audio", icon: Mic },
  { id: "export", label: "Export", icon: Download },
  { id: "appearance", label: "Appearance", icon: Palette },
] as const;

function SettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("profile");

  return (
    <div className="p-5 md:p-10 max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your workspace preferences.
        </p>
      </motion.div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-secondary rounded-xl w-fit overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap",
              tab === t.id
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <t.icon className="size-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="card-surface p-6 md:p-8 space-y-6">
        {tab === "profile" && (
          <>
            <Section
              title="Profile"
              desc="How you appear across SonicScript."
            >
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-accent-green flex items-center justify-center text-lg font-semibold text-white">
                  MS
                </div>
                <button className="px-4 py-2 text-sm rounded-lg border border-border bg-card hover:bg-secondary transition font-medium">
                  Change avatar
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <SettingsInput
                  label="Full name"
                  defaultValue="Maya Singh"
                />
                <SettingsInput
                  label="Email"
                  type="email"
                  defaultValue="maya@sonicscript.app"
                />
              </div>
            </Section>
            <SaveButton />
          </>
        )}

        {tab === "audio" && (
          <>
            <Section
              title="Audio preferences"
              desc="Defaults for new recordings."
            >
              <Row
                title="Noise suppression"
                desc="Reduce background noise."
                defaultOn
              />
              <Row
                title="Echo cancellation"
                desc="Cancel echo from speakers."
                defaultOn
              />
              <Row
                title="Auto gain control"
                desc="Normalize quiet voices."
              />
              <Row
                title="Speaker diarization"
                desc="Label different voices."
                defaultOn
              />
            </Section>
            <SaveButton />
          </>
        )}

        {tab === "export" && (
          <>
            <Section
              title="Export defaults"
              desc="Configure your download preferences."
            >
              <Row
                title="Include timestamps"
                desc="Embed [mm:ss] in text exports."
                defaultOn
              />
              <Row
                title="Include speaker labels"
                desc="Prepend speaker name to segments."
                defaultOn
              />
              <Row
                title="Auto-export to email"
                desc="Send transcripts to your inbox."
              />
            </Section>
            <SaveButton />
          </>
        )}

        {tab === "appearance" && (
          <>
            <Section
              title="Appearance"
              desc="Customize how SonicScript looks."
            >
              <Row
                title="Reduced motion"
                desc="Disable non-essential animations."
              />
              <Row
                title="Compact mode"
                desc="Use tighter spacing throughout."
              />
            </Section>
            <SaveButton />
          </>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({
  title,
  desc,
  defaultOn,
}: {
  title: string;
  desc: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-t border-border first:border-0">
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}

function SettingsInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:border-accent-green focus:ring-2 focus:ring-accent-green/10 focus:outline-none transition-all"
      />
    </div>
  );
}

function SaveButton() {
  return (
    <div className="pt-4 border-t border-border flex justify-end">
      <button
        onClick={() => toast.success("Settings saved")}
        className="px-5 py-2.5 rounded-xl bg-accent-green text-white font-semibold text-sm shadow-sm hover:opacity-90 transition"
      >
        Save changes
      </button>
    </div>
  );
}
