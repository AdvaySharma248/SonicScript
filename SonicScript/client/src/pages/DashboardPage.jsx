// ===========================================
// DashboardPage — Main Dashboard Overview
// ===========================================
//
// Shows aggregate stats and recent activity.
// Uses the useDashboardStats hook for data fetching.
// ===========================================

import { motion } from 'framer-motion';
import {
  HiDocumentText,
  HiUpload,
  HiClock,
  HiSparkles,
  HiMicrophone,
  HiArrowRight,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { SkeletonCard, SkeletonListItem } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import useDashboardStats from '../hooks/useDashboardStats';
import { formatTime, formatDate } from '../utils/formatTime';

// Stat card configuration
const statConfig = [
  {
    key: 'totalTranscriptions',
    label: 'Total Transcriptions',
    icon: HiDocumentText,
    gradient: 'from-sonic-accent to-purple-600',
    format: (v) => v,
  },
  {
    key: 'audioUploaded',
    label: 'Audio Uploaded',
    icon: HiUpload,
    gradient: 'from-sonic-cyan to-blue-600',
    format: (v) => v,
  },
  {
    key: 'totalDuration',
    label: 'Recording Time',
    icon: HiClock,
    gradient: 'from-sonic-pink to-rose-600',
    format: (v) => formatTime(v),
  },
  {
    key: 'avgConfidence',
    label: 'Avg. Confidence',
    icon: HiSparkles,
    gradient: 'from-sonic-success to-emerald-600',
    format: (v) => (v > 0 ? `${Math.round(v * 100)}%` : '—'),
  },
];

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function DashboardPage() {
  const { stats, recentActivity, loading, error, refresh } = useDashboardStats();

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">
            Welcome back <span className="gradient-text-animated">👋</span>
          </h2>
          <p className="text-sm text-sonic-text-dim">
            Here's your transcription activity at a glance.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400"
          >
            {error}
            <button
              onClick={refresh}
              className="ml-3 text-red-300 underline hover:text-red-200 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Stat Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : statConfig.map((stat) => {
                const Icon = stat.icon;
                const value = stats[stat.key];

                return (
                  <motion.div
                    key={stat.key}
                    variants={itemVariants}
                    className="glass-card stat-card p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-sonic-text mb-1">
                      {stat.format(value)}
                    </div>
                    <div className="text-xs text-sonic-text-dim">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Link
              to="/app/record"
              className="glass-card p-6 flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sonic-accent to-sonic-cyan flex items-center justify-center text-white transition-transform group-hover:scale-110">
                <HiMicrophone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-sonic-text mb-0.5">
                  Start Recording
                </h3>
                <p className="text-xs text-sonic-text-dim">
                  Record audio and get live transcription
                </p>
              </div>
              <HiArrowRight className="w-5 h-5 text-sonic-text-dim group-hover:text-sonic-accent transition-colors group-hover:translate-x-1 duration-200" />
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              to="/app/upload"
              className="glass-card p-6 flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sonic-pink to-rose-600 flex items-center justify-center text-white transition-transform group-hover:scale-110">
                <HiUpload className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-sonic-text mb-0.5">
                  Upload Audio
                </h3>
                <p className="text-xs text-sonic-text-dim">
                  Drag & drop audio files for transcription
                </p>
              </div>
              <HiArrowRight className="w-5 h-5 text-sonic-text-dim group-hover:text-sonic-pink transition-colors group-hover:translate-x-1 duration-200" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-sonic-text">
              Recent Activity
            </h3>
            {recentActivity.length > 0 && (
              <Link
                to="/app/history"
                className="text-xs text-sonic-accent-light hover:text-sonic-accent transition-colors"
              >
                View all →
              </Link>
            )}
          </motion.div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <SkeletonListItem key={i} />
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <EmptyState
              icon="📝"
              title="No transcriptions yet"
              description="Start recording or upload an audio file to see your activity here."
              actionLabel="Start Recording"
              onAction={() => window.location.href = '/app/record'}
            />
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item, index) => (
                <motion.div
                  key={item._id}
                  variants={itemVariants}
                  className="glass-card p-4 flex items-center gap-4"
                >
                  {/* Source Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      item.source === 'upload'
                        ? 'bg-sonic-cyan/10 text-sonic-cyan'
                        : 'bg-sonic-accent/10 text-sonic-accent-light'
                    }`}
                  >
                    {item.source === 'upload' ? (
                      <HiUpload className="w-5 h-5" />
                    ) : (
                      <HiMicrophone className="w-5 h-5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-sonic-text truncate">
                      {item.transcript?.slice(0, 80) || 'No transcript'}
                      {item.transcript?.length > 80 ? '...' : ''}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-sonic-text-dim">
                        {formatDate(item.createdAt)}
                      </span>
                      {item.wordCount > 0 && (
                        <span className="text-xs text-sonic-text-dim">
                          {item.wordCount} words
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium flex-shrink-0 ${
                      item.status === 'completed'
                        ? 'bg-sonic-success/10 text-sonic-success'
                        : item.status === 'failed'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
