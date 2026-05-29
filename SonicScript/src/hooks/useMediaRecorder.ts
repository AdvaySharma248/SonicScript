import { useEffect, useRef, useState } from "react";

export type RecorderState = "idle" | "recording" | "paused" | "stopped";

type UseMediaRecorderReturn = {
  state: RecorderState;
  durationSec: number;
  levels: number[]; // 32 bars 0..1
  blob: Blob | null;
  blobUrl: string | null;
  error: string | null;
  start: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
};

const BAR_COUNT = 32;

export function useMediaRecorder(): UseMediaRecorderReturn {
  const [state, setState] = useState<RecorderState>("idle");
  const [durationSec, setDurationSec] = useState(0);
  const [levels, setLevels] = useState<number[]>(Array(BAR_COUNT).fill(0.1));
  const [blob, setBlob] = useState<Blob | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const rafRef = useRef<number>(0);
  const tickRef = useRef<number>(0);
  const startTsRef = useRef<number>(0);
  const accumRef = useRef<number>(0);

  const cleanup = () => {
    cancelAnimationFrame(rafRef.current);
    clearInterval(tickRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    analyserRef.current = null;
  };

  useEffect(() => () => cleanup(), []);

  const startLevels = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const buf = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(buf);
      const step = Math.floor(buf.length / BAR_COUNT);
      const next: number[] = [];
      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) sum += buf[i * step + j];
        next.push(Math.min(1, sum / step / 180));
      }
      setLevels(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  const start = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AC: typeof AudioContext =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AC();
      audioCtxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      analyserRef.current = analyser;

      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const b = new Blob(chunksRef.current, { type: "audio/webm" });
        setBlob(b);
        setBlobUrl(URL.createObjectURL(b));
      };
      mediaRef.current = mr;
      mr.start(250);

      accumRef.current = 0;
      startTsRef.current = Date.now();
      tickRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startTsRef.current) / 1000;
        setDurationSec(accumRef.current + elapsed);
      }, 100);

      startLevels();
      setState("recording");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Microphone access denied";
      setError(msg);
      setState("idle");
    }
  };

  const pause = () => {
    if (!mediaRef.current || state !== "recording") return;
    mediaRef.current.pause();
    accumRef.current += (Date.now() - startTsRef.current) / 1000;
    clearInterval(tickRef.current);
    cancelAnimationFrame(rafRef.current);
    setState("paused");
  };

  const resume = () => {
    if (!mediaRef.current || state !== "paused") return;
    mediaRef.current.resume();
    startTsRef.current = Date.now();
    tickRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startTsRef.current) / 1000;
      setDurationSec(accumRef.current + elapsed);
    }, 100);
    startLevels();
    setState("recording");
  };

  const stop = () => {
    if (!mediaRef.current) return;
    if (state === "recording") {
      accumRef.current += (Date.now() - startTsRef.current) / 1000;
    }
    mediaRef.current.stop();
    cleanup();
    setState("stopped");
    setLevels(Array(BAR_COUNT).fill(0.1));
  };

  const reset = () => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlob(null);
    setBlobUrl(null);
    setDurationSec(0);
    accumRef.current = 0;
    setLevels(Array(BAR_COUNT).fill(0.1));
    setState("idle");
    setError(null);
  };

  return {
    state,
    durationSec,
    levels,
    blob,
    blobUrl,
    error,
    start,
    pause,
    resume,
    stop,
    reset,
  };
}
