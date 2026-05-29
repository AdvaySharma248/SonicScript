import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  generateSampleTranscript,
  type Transcription,
} from "@/lib/transcript";

type Ctx = {
  transcriptions: Transcription[];
  add: (t: Transcription) => void;
  update: (id: string, patch: Partial<Transcription>) => void;
  remove: (id: string) => void;
  get: (id: string) => Transcription | undefined;
};

const TranscriptionsContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "sonicscript:transcriptions";

function seed(): Transcription[] {
  const now = Date.now();
  const mk = (
    i: number,
    title: string,
    source: Transcription["source"],
    dur: number,
    daysAgo: number,
  ): Transcription => ({
    id: `seed-${i}`,
    title,
    source,
    durationSec: dur,
    createdAt: new Date(now - daysAgo * 86400_000).toISOString(),
    language: "English",
    accuracy: 98 + Math.random() * 1.8,
    segments: generateSampleTranscript(dur),
  });

  return [
    mk(1, "Q3 product launch briefing", "recording", 92, 0),
    mk(2, "Design review — Luminal Stream", "upload", 1830, 1),
    mk(3, "Customer interview · Acme Labs", "recording", 2410, 2),
    mk(4, "Weekly engineering standup", "recording", 720, 4),
    mk(5, "Podcast — Future of Ambient AI", "upload", 3260, 6),
    mk(6, "Voice memo · pricing ideas", "recording", 184, 7),
  ];
}

export function TranscriptionsProvider({ children }: { children: ReactNode }) {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setTranscriptions(JSON.parse(raw));
        return;
      }
    } catch {
      /* ignore */
    }
    setTranscriptions(seed());
  }, []);

  useEffect(() => {
    if (transcriptions.length === 0) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transcriptions));
    } catch {
      /* ignore */
    }
  }, [transcriptions]);

  const add = useCallback((t: Transcription) => {
    setTranscriptions((prev) => [t, ...prev]);
  }, []);

  const update = useCallback((id: string, patch: Partial<Transcription>) => {
    setTranscriptions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setTranscriptions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const get = useCallback(
    (id: string) => transcriptions.find((t) => t.id === id),
    [transcriptions],
  );

  const value = useMemo(
    () => ({ transcriptions, add, update, remove, get }),
    [transcriptions, add, update, remove, get],
  );

  return (
    <TranscriptionsContext.Provider value={value}>
      {children}
    </TranscriptionsContext.Provider>
  );
}

export function useTranscriptions() {
  const ctx = useContext(TranscriptionsContext);
  if (!ctx) throw new Error("useTranscriptions must be used inside provider");
  return ctx;
}
