import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Download,
  FileJson,
  FileText,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useTranscriptions } from "@/context/TranscriptionsContext";
import { transcriptToText } from "@/lib/transcript";
import { downloadJSON, downloadText } from "@/lib/download";
import { useTypewriter } from "@/hooks/useTypewriter";
import { formatDuration } from "@/lib/format";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/app/transcription/$id")({
  component: TranscriptionPage,
  notFoundComponent: () => (
    <div className="p-10 text-center text-muted-foreground">
      Transcription not found.{" "}
      <Link to="/app/history" className="text-accent-green font-medium">
        View history →
      </Link>
    </div>
  ),
});

function TranscriptionPage() {
  const { id } = Route.useParams();
  const { get } = useTranscriptions();
  const t = get(id);

  if (!t) throw notFound();

  const fullText = useMemo(() => transcriptToText(t), [t]);
  const [active, setActive] = useState(true);
  const { displayed, done } = useTypewriter(fullText, active, {
    chunkSize: 5,
    intervalMs: 28,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayed]);

  useEffect(() => {
    if (done) setActive(false);
  }, [done]);

  const copy = async () => {
    await navigator.clipboard.writeText(fullText);
    toast.success("Transcript copied");
  };

  return (
    <div className="p-5 md:p-10 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-3"
      >
        <Link
          to="/app/history"
          className="size-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold tracking-tight truncate">
            {t.title}
          </h2>
          <div className="text-xs text-muted-foreground mt-0.5">
            {formatDuration(t.durationSec)} · {t.language} ·{" "}
            {t.accuracy.toFixed(1)}% accuracy
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copy}
            className="px-3 py-2 rounded-lg bg-card border border-border hover:bg-secondary text-sm flex items-center gap-2 transition font-medium"
          >
            <Copy className="size-3.5" /> Copy
          </button>
          <button
            onClick={() => {
              downloadText(`${t.title}.txt`, fullText);
              toast.success("TXT downloaded");
            }}
            className="px-3 py-2 rounded-lg bg-card border border-border hover:bg-secondary text-sm flex items-center gap-2 transition font-medium"
          >
            <FileText className="size-3.5" /> TXT
          </button>
          <button
            onClick={() => {
              downloadJSON(`${t.title}.json`, t);
              toast.success("JSON downloaded");
            }}
            className="px-3 py-2 rounded-lg bg-card border border-border hover:bg-secondary text-sm flex items-center gap-2 transition font-medium"
          >
            <FileJson className="size-3.5" /> JSON
          </button>
        </div>
      </motion.div>

      {/* Transcript body */}
      <div className="card-surface overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <span className="text-xs font-medium text-muted-foreground">
            Transcript
          </span>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            {active ? (
              <>
                <Loader2 className="size-3 animate-spin text-accent-green" />
                Processing
              </>
            ) : (
              <>
                <span className="size-1.5 rounded-full bg-accent-green" />
                Complete
              </>
            )}
          </div>
        </div>
        <div
          ref={scrollRef}
          className="p-6 font-mono text-sm leading-relaxed text-foreground/85 max-h-[60vh] overflow-y-auto whitespace-pre-wrap"
        >
          {displayed}
          {active && (
            <span className="inline-block w-[2px] h-4 bg-accent-green ml-1 align-middle animate-blink" />
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-3">
        <Stat label="Segments" value={String(t.segments.length)} />
        <Stat
          label="Speakers"
          value={String(
            new Set(t.segments.map((s) => s.speaker)).size,
          )}
        />
        <Stat label="Words" value={String(fullText.split(/\s+/).length)} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface p-4 text-center">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
}
