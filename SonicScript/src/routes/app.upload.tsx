import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, FileAudio, X, CheckCircle2, ArrowRight } from "lucide-react";
import { formatBytes } from "@/lib/format";
import { useTranscriptions } from "@/context/TranscriptionsContext";
import { generateSampleTranscript } from "@/lib/transcript";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const Route = createFileRoute("/app/upload")({
  component: UploadPage,
});

const ACCEPT = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-m4a",
  "audio/mp4",
  "audio/webm",
];

function UploadPage() {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const { add } = useTranscriptions();

  const handleFile = (f: File) => {
    if (!ACCEPT.includes(f.type) && !/\.(mp3|wav|m4a)$/i.test(f.name)) {
      toast.error("Unsupported format. Use MP3, WAV, or M4A.");
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      toast.error("File too large. Max 50MB.");
      return;
    }
    setFile(f);
    setProgress(0);
    setDone(false);
    const id = setInterval(() => {
      setProgress((p) => {
        const n = p + 6 + Math.random() * 10;
        if (n >= 100) {
          clearInterval(id);
          setDone(true);
          return 100;
        }
        return n;
      });
    }, 180);
  };

  const handleTranscribe = () => {
    if (!file) return;
    const id = `up-${Date.now()}`;
    const dur = 60 + Math.floor(Math.random() * 200);
    add({
      id,
      title: file.name.replace(/\.[^.]+$/, ""),
      source: "upload",
      durationSec: dur,
      createdAt: new Date().toISOString(),
      language: "English",
      accuracy: 99.1 + Math.random(),
      segments: generateSampleTranscript(dur),
    });
    toast.success("Transcribing your file…");
    navigate({ to: "/app/transcription/$id", params: { id } });
  };

  return (
    <div className="p-5 md:p-10 max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h2 className="text-2xl font-bold tracking-tight">Upload audio</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Supports MP3, WAV, M4A · Max 50MB
        </p>
      </motion.div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        className={cn(
          "relative block rounded-2xl border-2 border-dashed p-14 md:p-20 text-center cursor-pointer transition-all duration-200",
          drag
            ? "border-accent-green bg-accent-green/5"
            : "border-border bg-card hover:border-muted-foreground/30 hover:bg-secondary/30",
        )}
      >
        <input
          type="file"
          accept=".mp3,.wav,.m4a,audio/*"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && handleFile(e.target.files[0])
          }
        />
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "size-14 rounded-2xl flex items-center justify-center transition-all",
              drag
                ? "bg-accent-green/15 text-accent-green scale-110"
                : "bg-secondary text-muted-foreground",
            )}
          >
            <Upload className="size-6" />
          </div>
          <div>
            <div className="text-base font-semibold">
              {drag ? "Drop to upload" : "Drag & drop your audio file"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              or{" "}
              <span className="text-accent-green font-medium">
                click to browse
              </span>
            </div>
          </div>
        </div>
      </label>

      {/* File card */}
      {file && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-surface p-5 flex items-center gap-4"
        >
          <div className="size-11 rounded-xl bg-accent-green/10 flex items-center justify-center text-accent-green shrink-0">
            <FileAudio className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium text-sm truncate">{file.name}</div>
              <div className="text-xs font-mono text-muted-foreground shrink-0">
                {formatBytes(file.size)}
              </div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  done ? "bg-accent-green" : "animate-progress-shimmer",
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
              {done ? (
                <>
                  <CheckCircle2 className="size-3.5 text-accent-green" />{" "}
                  Upload complete · ready to transcribe
                </>
              ) : (
                `${Math.floor(progress)}% · uploading…`
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setFile(null);
              setProgress(0);
              setDone(false);
            }}
            className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary shrink-0 transition"
          >
            <X className="size-4" />
          </button>
        </motion.div>
      )}

      {/* Transcribe button */}
      {done && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleTranscribe}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-green text-white shadow-sm hover:opacity-90 transition font-semibold"
        >
          Transcribe now
          <ArrowRight className="size-4" />
        </motion.button>
      )}
    </div>
  );
}
