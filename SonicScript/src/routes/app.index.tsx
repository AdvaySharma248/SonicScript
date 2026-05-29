import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mic,
  Upload,
  Clock,
  FileAudio,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { useTranscriptions } from "@/context/TranscriptionsContext";
import { formatDuration, formatRelative } from "@/lib/format";
import { motion } from "framer-motion";

export const Route = createFileRoute("/app/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { transcriptions } = useTranscriptions();
  const totalSec = transcriptions.reduce((a, t) => a + t.durationSec, 0);
  const avgAcc =
    transcriptions.length === 0
      ? 0
      : transcriptions.reduce((a, t) => a + t.accuracy, 0) /
        transcriptions.length;
  const recent = transcriptions.slice(0, 5);

  return (
    <div className="p-5 md:p-10 max-w-5xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Welcome back
        </h2>
        <p className="text-muted-foreground mt-1">
          Here's what's happening in your workspace.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FileAudio className="size-4" />}
          label="Transcriptions"
          value={String(transcriptions.length)}
          accent="green"
        />
        <StatCard
          icon={<Clock className="size-4" />}
          label="Recording time"
          value={formatDuration(totalSec)}
          accent="orange"
        />
        <StatCard
          icon={<TrendingUp className="size-4" />}
          label="Avg accuracy"
          value={`${avgAcc.toFixed(1)}%`}
          accent="slate"
        />
        <StatCard
          icon={
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green" />
            </span>
          }
          label="Status"
          value="Online"
          accent="green"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/app/record"
          className="group card-surface card-surface-hover p-6 flex items-start justify-between"
        >
          <div>
            <div className="size-10 rounded-xl bg-accent-green/10 flex items-center justify-center mb-3">
              <Mic className="size-5 text-accent-green" />
            </div>
            <h3 className="font-semibold">New recording</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Capture audio with live transcription.
            </p>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground/40 group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/app/upload"
          className="group card-surface card-surface-hover p-6 flex items-start justify-between"
        >
          <div>
            <div className="size-10 rounded-xl bg-accent-orange/10 flex items-center justify-center mb-3">
              <Upload className="size-5 text-accent-orange" />
            </div>
            <h3 className="font-semibold">Upload file</h3>
            <p className="text-sm text-muted-foreground mt-1">
              MP3, WAV, M4A — drag & drop.
            </p>
          </div>
          <ArrowUpRight className="size-4 text-muted-foreground/40 group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent activity</h3>
          <Link
            to="/app/history"
            className="text-xs font-medium text-accent-green hover:text-accent-green/80 transition"
          >
            View all →
          </Link>
        </div>

        <div className="card-surface overflow-hidden divide-y divide-border">
          {recent.length === 0 && (
            <div className="p-10 text-center text-muted-foreground text-sm">
              No transcriptions yet — start a recording.
            </div>
          )}
          {recent.map((t) => (
            <Link
              key={t.id}
              to="/app/transcription/$id"
              params={{ id: t.id }}
              className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition group"
            >
              <div className="size-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                {t.source === "recording" ? (
                  <Mic className="size-4" />
                ) : (
                  <FileAudio className="size-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm truncate">{t.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {formatDuration(t.durationSec)} ·{" "}
                  {formatRelative(t.createdAt)} · {t.language}
                </div>
              </div>
              <div className="hidden sm:block text-xs font-medium text-accent-green font-mono">
                {t.accuracy.toFixed(1)}%
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground/30 group-hover:text-foreground transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "green" | "orange" | "slate";
}) {
  const iconCls = {
    green: "text-accent-green bg-accent-green/10",
    orange: "text-accent-orange bg-accent-orange/10",
    slate: "text-accent-slate bg-accent-slate/10",
  }[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-surface p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <span
          className={`size-7 rounded-lg flex items-center justify-center ${iconCls}`}
        >
          {icon}
        </span>
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
    </motion.div>
  );
}
