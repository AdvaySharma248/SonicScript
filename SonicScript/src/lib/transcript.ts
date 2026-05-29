export type TranscriptSegment = {
  start: number;
  end: number;
  speaker?: string;
  text: string;
};

export type Transcription = {
  id: string;
  title: string;
  source: "recording" | "upload";
  durationSec: number;
  createdAt: string;
  language: string;
  accuracy: number;
  segments: TranscriptSegment[];
};

export function transcriptToText(t: Transcription): string {
  return t.segments
    .map((s) => `[${fmt(s.start)}] ${s.speaker ? s.speaker + ": " : ""}${s.text}`)
    .join("\n");
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

const SAMPLE_LINES = [
  "Welcome to the launch briefing for the third quarter neural release.",
  "We're seeing significant improvements in latency, dropping to sub one hundred milliseconds.",
  "Speaker identification is now accurate across overlapping voices in noisy environments.",
  "Our new acoustic model handles specialized terminology in medicine and law without any fine tuning.",
  "Let me share the production telemetry from the last seven days.",
  "Accuracy has held steady at ninety nine point eight percent across all twenty four supported languages.",
  "We've shipped a new export pipeline supporting JSON, plain text, VTT, and PDF formats.",
  "End of summary, switching to live questions.",
];

export function generateSampleTranscript(durationSec = 92): TranscriptSegment[] {
  const segs: TranscriptSegment[] = [];
  let t = 1;
  const speakers = ["Maya", "Devon"];
  let s = 0;
  for (const line of SAMPLE_LINES) {
    const len = 8 + Math.floor(Math.random() * 6);
    segs.push({
      start: t,
      end: Math.min(durationSec, t + len),
      speaker: speakers[s % speakers.length],
      text: line,
    });
    t += len + 1;
    s++;
    if (t >= durationSec) break;
  }
  return segs;
}
