import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Mic,
  Upload,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  Clock,
  FileText,
} from "lucide-react";

import { MarketingNav } from "@/components/layout/MarketingNav";
import { MarketingFooter } from "@/components/layout/MarketingFooter";

export const Route = createFileRoute("/")(  {
  head: () => ({
    meta: [
      { title: "SonicScript — Turn Voice Into Text" },
      {
        name: "description",
        content:
          "SonicScript turns your voice into text with real-time transcription, secure history, and one-click export. Built for creators, researchers, and teams.",
      },
      { property: "og:title", content: "SonicScript — Voice to Text" },
      {
        property: "og:description",
        content:
          "Record, upload, and transcribe with remarkable accuracy. Built for creators, researchers, and teams.",
      },
    ],
  }),
  component: LandingPage,
});

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav />

      {/* HERO */}
      <section className="relative pt-36 pb-24 px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-green/20 bg-accent-green/5 text-xs font-medium text-accent-green mb-8"
          >
            <span className="size-1.5 rounded-full bg-accent-green animate-pulse" />
            Now with 24 language support
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="heading-display text-5xl sm:text-6xl md:text-7xl mb-8"
          >
            Turn voice into
            <br />
            <span className="text-hero-gradient">text, effortlessly</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-2xl mx-auto text-lg md:text-xl text-secondary-content leading-relaxed mb-12"
          >
            Record or upload audio and get accurate transcriptions in seconds.
            Built for creators, researchers, and teams who value their words.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to="/app/record"
              className="group w-full sm:w-auto px-7 py-3.5 bg-accent-green text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Mic className="size-4" />
              Start Recording
              <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
            <Link
              to="/app/upload"
              className="w-full sm:w-auto px-7 py-3.5 bg-white border border-border text-primary-strong font-semibold rounded-xl hover:bg-secondary hover:border-border transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Upload className="size-4 text-secondary-content" />
              Upload Audio
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-secondary-content font-medium"
          >
            <span className="flex items-center gap-2">
              <span className="size-1.5 bg-accent-green rounded-full" />
              99.8% accuracy
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 bg-accent-orange rounded-full" />
              24 languages
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 bg-accent-indigo rounded-full" />
              End-to-end encrypted
            </span>
          </motion.div>
        </motion.div>

        {/* Transcript preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="card-surface p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-3 rounded-full bg-accent-green/20 border-2 border-accent-green animate-pulse" />
              <span className="label-text">
                Live transcription preview
              </span>
            </div>
            <div className="space-y-3 font-mono text-sm">
              <TranscriptLine delay={0.6} time="00:01" speaker="Speaker 1">
                We're seeing significant improvements in accuracy across all
                supported languages.
              </TranscriptLine>
              <TranscriptLine delay={0.9} time="00:08" speaker="Speaker 2">
                The real-time processing handles overlapping voices without any
                issues.
              </TranscriptLine>
              <TranscriptLine delay={1.2} time="00:14" speaker="Speaker 1">
                Export is available in JSON, TXT, and VTT formats.
              </TranscriptLine>
              <TranscriptLine delay={1.5} time="00:21" active>
                Finalizing transcript...
              </TranscriptLine>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-16"
          >
            <span className="label-text text-accent-indigo uppercase tracking-wider mb-3 inline-block">Features</span>
            <h2 className="heading-section text-3xl md:text-4xl mb-4">
              Everything you need to capture words
            </h2>
            <p className="text-secondary-content max-w-xl mx-auto text-base leading-relaxed">
              Simple tools that work beautifully together. No complexity, just
              clarity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={<Mic className="size-5" />}
              title="Real-time Recording"
              desc="See your words appear as you speak. Sub-second latency with automatic punctuation."
              accent="green"
              delay={0}
            />
            <FeatureCard
              icon={<Upload className="size-5" />}
              title="Upload Any Format"
              desc="MP3, WAV, M4A — drag and drop your audio files for instant transcription."
              accent="orange"
              delay={0.05}
            />
            <FeatureCard
              icon={<Globe className="size-5" />}
              title="24 Languages"
              desc="Automatic language detection with specialized vocabulary support across domains."
              accent="indigo"
              delay={0.1}
            />
            <FeatureCard
              icon={<Clock className="size-5" />}
              title="Searchable History"
              desc="Every transcription is saved and searchable. Find any word from any session."
              accent="coral"
              delay={0.15}
            />
            <FeatureCard
              icon={<FileText className="size-5" />}
              title="One-click Export"
              desc="Download as JSON, plain text, or VTT. Copy to clipboard instantly."
              accent="green"
              delay={0.2}
            />
            <FeatureCard
              icon={<ShieldCheck className="size-5" />}
              title="Private & Encrypted"
              desc="Your recordings stay yours. End-to-end encryption in transit, AES-256 at rest."
              accent="indigo"
              delay={0.25}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-[#1F6B4F] to-[#174F3B] p-12 md:p-16 text-center"
        >
          <Zap className="size-8 text-white/70 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white font-[Sora] leading-tight">
            Start transcribing today
          </h2>
          <p className="text-white/70 max-w-md mx-auto mb-8 text-base leading-relaxed">
            Free to use. No credit card required. Set up in under a minute.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/signup"
              className="px-7 py-3.5 bg-white text-accent-green font-semibold rounded-xl hover:bg-white/90 transition-all shadow-sm"
            >
              Get started free
            </Link>
            <Link
              to="/app"
              className="px-7 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
            >
              Try the demo
            </Link>
          </div>
        </motion.div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function TranscriptLine({
  time,
  speaker,
  children,
  delay,
  active,
}: {
  time: string;
  speaker?: string;
  children: React.ReactNode;
  delay: number;
  active?: boolean;
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="text-primary-strong/80"
    >
      <span className="text-disabled mr-2">[{time}]</span>
      {speaker && (
        <span className="text-accent-green font-medium mr-2">{speaker}:</span>
      )}
      {children}
      {active && (
        <span className="inline-block w-[2px] h-4 bg-accent-green ml-1 align-middle animate-blink" />
      )}
    </motion.p>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  accent,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: "green" | "orange" | "coral" | "indigo";
  delay: number;
}) {
  const iconBg = {
    green: "bg-accent-green/10 text-accent-green",
    orange: "bg-accent-orange/10 text-accent-orange",
    coral: "bg-accent-coral/10 text-accent-coral",
    indigo: "bg-accent-indigo/10 text-accent-indigo",
  }[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="card-surface card-surface-hover p-6"
    >
      <div
        className={`size-10 rounded-xl ${iconBg} flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="heading-card text-base mb-2">{title}</h3>
      <p className="text-sm text-secondary-content leading-relaxed">{desc}</p>
    </motion.div>
  );
}
