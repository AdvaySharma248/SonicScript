import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Mic,
  FileAudio,
  Trash2,
  Copy,
  Download,
  MoreHorizontal,
} from "lucide-react";
import { useTranscriptions } from "@/context/TranscriptionsContext";
import { formatDuration, formatRelative } from "@/lib/format";
import { transcriptToText } from "@/lib/transcript";
import { downloadText } from "@/lib/download";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const Route = createFileRoute("/app/history")({
  component: HistoryPage,
});

const FILTERS = ["All", "Today", "This week", "This month"] as const;
type Filter = (typeof FILTERS)[number];

function HistoryPage() {
  const { transcriptions, remove } = useTranscriptions();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    const now = Date.now();
    return transcriptions.filter((t) => {
      if (q && !t.title.toLowerCase().includes(q.toLowerCase())) return false;
      const ageDays = (now - new Date(t.createdAt).getTime()) / 86400_000;
      if (filter === "Today" && ageDays > 1) return false;
      if (filter === "This week" && ageDays > 7) return false;
      if (filter === "This month" && ageDays > 30) return false;
      return true;
    });
  }, [transcriptions, q, filter]);

  return (
    <div className="p-5 md:p-10 max-w-5xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h2 className="text-2xl font-bold tracking-tight">History</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {transcriptions.length} transcription
          {transcriptions.length === 1 ? "" : "s"} · searchable & exportable.
        </p>
      </motion.div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search transcriptions…"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border focus:border-accent-green focus:ring-2 focus:ring-accent-green/10 focus:outline-none text-sm transition-all placeholder-muted-foreground/50"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition",
                filter === f
                  ? "bg-accent-green text-white"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card-surface p-16 text-center">
          <div className="size-12 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <Search className="size-5 text-muted-foreground" />
          </div>
          <div className="font-semibold">No matches</div>
          <p className="text-sm text-muted-foreground mt-2">
            Try a different search or filter.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="group card-surface card-surface-hover p-5 relative"
            >
              {/* Left accent stripe */}
              <div
                className={cn(
                  "absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full",
                  t.source === "recording"
                    ? "bg-accent-green"
                    : "bg-accent-orange",
                )}
              />

              <div className="flex items-start justify-between mb-3 pl-3">
                <div className="size-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                  {t.source === "recording" ? (
                    <Mic className="size-4" />
                  ) : (
                    <FileAudio className="size-4" />
                  )}
                </div>
                <CardMenu
                  onCopy={async () => {
                    await navigator.clipboard.writeText(transcriptToText(t));
                    toast.success("Copied");
                  }}
                  onDownload={() => {
                    downloadText(`${t.title}.txt`, transcriptToText(t));
                    toast.success("Downloaded");
                  }}
                  onDelete={() => {
                    remove(t.id);
                    toast.success("Deleted");
                  }}
                />
              </div>
              <Link
                to="/app/transcription/$id"
                params={{ id: t.id }}
                className="block pl-3"
              >
                <div className="font-semibold text-sm truncate">{t.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDuration(t.durationSec)} ·{" "}
                  {formatRelative(t.createdAt)}
                </div>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {t.segments[0]?.text}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t.language}</span>
                  <span className="font-medium text-accent-green font-mono">
                    {t.accuracy.toFixed(1)}%
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function CardMenu({
  onCopy,
  onDownload,
  onDelete,
}: {
  onCopy: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary opacity-0 group-hover:opacity-100 transition"
      >
        <MoreHorizontal className="size-4" />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          />
          <div className="absolute right-0 top-9 z-20 w-40 card-elevated p-1">
            <MenuBtn
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCopy();
                setOpen(false);
              }}
              icon={<Copy className="size-3.5" />}
            >
              Copy
            </MenuBtn>
            <MenuBtn
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDownload();
                setOpen(false);
              }}
              icon={<Download className="size-3.5" />}
            >
              Download
            </MenuBtn>
            <MenuBtn
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
                setOpen(false);
              }}
              icon={<Trash2 className="size-3.5" />}
              destructive
            >
              Delete
            </MenuBtn>
          </div>
        </>
      )}
    </div>
  );
}

function MenuBtn({
  children,
  icon,
  onClick,
  destructive,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition",
        destructive
          ? "text-destructive hover:bg-destructive/8"
          : "text-foreground hover:bg-secondary",
      )}
    >
      {icon} {children}
    </button>
  );
}
