import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mic, Pause, Play, Square, RotateCcw, ArrowRight } from "lucide-react";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { Waveform } from "@/components/fx/Waveform";
import { formatDuration } from "@/lib/format";
import { useTranscriptions } from "@/context/TranscriptionsContext";
import { generateSampleTranscript } from "@/lib/transcript";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/app/record")({
  component: RecordPage,
});

function RecordPage() {
  const r = useMediaRecorder();
  const navigate = useNavigate();
  const { add } = useTranscriptions();

  const isActive = r.state === "recording";
  const isPaused = r.state === "paused";
  const isStopped = r.state === "stopped";

  const handleTranscribe = () => {
    const id = `rec-${Date.now()}`;
    add({
      id,
      title: `Recording · ${new Date().toLocaleString()}`,
      source: "recording",
      durationSec: Math.max(8, Math.floor(r.durationSec)),
      createdAt: new Date().toISOString(),
      language: "English",
      accuracy: 99.2 + Math.random(),
      segments: generateSampleTranscript(
        Math.max(8, Math.floor(r.durationSec)),
      ),
    });
    toast.success("Transcribing your recording…");
    navigate({ to: "/app/transcription/$id", params: { id } });
  };

  return (
    <div className="p-5 md:p-10 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="card-surface p-8 md:p-14"
      >
        <div className="flex flex-col items-center gap-10">
          {/* Recording button */}
          <div className="relative">
            {/* Outer ring animation when recording */}
            {isActive && (
              <div className="absolute -inset-4 rounded-full border-2 border-accent-orange/30 animate-recording-pulse" />
            )}

            <button
              onClick={() => {
                if (r.state === "idle") r.start();
                else if (isActive) r.pause();
                else if (isPaused) r.resume();
              }}
              disabled={isStopped}
              className={cn(
                "relative size-32 md:size-36 rounded-full flex items-center justify-center text-white transition-all duration-300",
                isActive
                  ? "bg-accent-orange shadow-lg shadow-accent-orange/20"
                  : isPaused
                    ? "bg-accent-coral"
                    : "bg-accent-green shadow-lg shadow-accent-green/20 hover:scale-[1.03] active:scale-[0.98]",
                isStopped && "opacity-40 cursor-not-allowed",
              )}
            >
              {isActive ? (
                <Pause className="size-10" />
              ) : isPaused ? (
                <Play className="size-10 ml-1" />
              ) : (
                <Mic className="size-10" />
              )}
            </button>
          </div>

          {/* Timer */}
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold font-mono tracking-tight text-foreground">
              {formatDuration(r.durationSec)}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {r.state === "idle" && "Tap to start recording"}
              {isActive && (
                <span className="flex items-center justify-center gap-2">
                  <span className="size-2 rounded-full bg-accent-orange animate-pulse" />
                  Recording
                </span>
              )}
              {isPaused && "Paused"}
              {isStopped && "Recording complete"}
            </div>
          </div>

          {/* Waveform */}
          <div className="w-full max-w-md">
            <Waveform
              bars={28}
              levels={r.levels}
              active={isActive}
              className="h-20"
            />
          </div>

          {/* Error */}
          {r.error && (
            <div className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3">
              {r.error}
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {(isActive || isPaused) && (
              <button
                onClick={r.stop}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-destructive/8 border border-destructive/20 text-destructive hover:bg-destructive/15 transition text-sm font-medium"
              >
                <Square className="size-4" /> Stop
              </button>
            )}
            {isStopped && (
              <>
                <button
                  onClick={r.reset}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition text-sm font-medium"
                >
                  <RotateCcw className="size-4" /> Re-record
                </button>
                <button
                  onClick={handleTranscribe}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent-green text-white shadow-sm hover:opacity-90 transition text-sm font-semibold"
                >
                  Transcribe
                  <ArrowRight className="size-4" />
                </button>
              </>
            )}
          </div>

          {/* Audio player */}
          {r.blobUrl && (
            <audio src={r.blobUrl} controls className="w-full max-w-md" />
          )}
        </div>
      </motion.div>
    </div>
  );
}
