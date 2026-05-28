// ===========================================
// HistoryPage — Transcription History Browser
// ===========================================
//
// Features:
//   - Search with glow effect
//   - Status filter tabs
//   - Transcription cards with actions
//   - Delete confirmation modal
//   - Pagination
//   - Skeleton loaders & empty state
// ===========================================

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  HiSearch,
  HiTrash,
  HiClipboardCopy,
  HiDownload,
  HiMicrophone,
  HiUpload,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import PageTransition from '../components/common/PageTransition';
import { SkeletonListItem } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import useTranscriptionHistory from '../hooks/useTranscriptionHistory';
import { copyToClipboard, downloadAsText } from '../utils/downloadTranscript';
import { formatDate } from '../utils/formatTime';

// Filter tabs
const filterTabs = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'processing', label: 'Processing' },
  { key: 'failed', label: 'Failed' },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function HistoryPage() {
  const {
    transcriptions,
    totalCount,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    deleteItem,
    deleteLoading,
    refresh,
  } = useTranscriptionHistory();

  // Modal state for delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Handle copy
  const handleCopy = useCallback(async (text) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success('Copied to clipboard');
    } else {
      toast.error('Failed to copy');
    }
  }, []);

  // Handle download
  const handleDownload = useCallback((text, filename) => {
    downloadAsText(text, filename || 'transcript.txt');
    toast.success('Downloaded transcript');
  }, []);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem(deleteTarget._id);
      toast.success('Transcription deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete');
    }
  }, [deleteTarget, deleteItem]);

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">
            <span className="gradient-text">Transcription History</span>
          </h2>
          <p className="text-sm text-sonic-text-dim">
            Browse, search, and manage your past transcriptions.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          {/* Search Bar */}
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sonic-border bg-white/[0.02] search-glow transition-all duration-200">
            <HiSearch className="w-4 h-4 text-sonic-text-dim flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transcriptions..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-sonic-text placeholder:text-sonic-text-dim"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-sonic-border">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  statusFilter === tab.key
                    ? 'bg-sonic-accent/15 text-sonic-accent-light'
                    : 'text-sonic-text-dim hover:text-sonic-text hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-xs text-sonic-text-dim mb-4">
            {totalCount} {totalCount === 1 ? 'result' : 'results'}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400">
            {error}
            <button onClick={refresh} className="ml-3 underline hover:text-red-300">Retry</button>
          </div>
        )}

        {/* Transcription List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <SkeletonListItem key={i} />
            ))}
          </div>
        ) : transcriptions.length === 0 ? (
          <EmptyState
            icon="🔍"
            title={searchQuery ? 'No results found' : 'No transcriptions yet'}
            description={
              searchQuery
                ? 'Try adjusting your search or filters.'
                : 'Start recording or upload an audio file to build your history.'
            }
          />
        ) : (
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {transcriptions.map((item) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                className="glass-card p-5 group"
              >
                <div className="flex items-start gap-4">
                  {/* Source Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
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
                    <p className="text-sm text-sonic-text leading-relaxed mb-2">
                      {item.transcript?.slice(0, 200) || 'No transcript available'}
                      {item.transcript?.length > 200 ? '...' : ''}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-sonic-text-dim">
                      <span>{formatDate(item.createdAt)}</span>
                      {item.wordCount > 0 && <span>{item.wordCount} words</span>}
                      {item.audioDuration > 0 && (
                        <span>{Math.round(item.audioDuration)}s</span>
                      )}
                      {item.confidence > 0 && (
                        <span>{Math.round(item.confidence * 100)}% confidence</span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          item.status === 'completed'
                            ? 'bg-sonic-success/10 text-sonic-success'
                            : item.status === 'failed'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => handleCopy(item.transcript)}
                      className="p-2 text-sonic-text-dim hover:text-sonic-text rounded-lg hover:bg-white/5 transition-colors"
                      title="Copy transcript"
                    >
                      <HiClipboardCopy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(item.transcript, `transcript-${item._id}.txt`)}
                      className="p-2 text-sonic-text-dim hover:text-sonic-text rounded-lg hover:bg-white/5 transition-colors"
                      title="Download transcript"
                    >
                      <HiDownload className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 text-sonic-text-dim hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-colors"
                      title="Delete"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-sonic-border text-sonic-text-dim hover:text-sonic-text hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  currentPage === i + 1
                    ? 'bg-sonic-accent/15 text-sonic-accent-light border border-sonic-accent/30'
                    : 'text-sonic-text-dim hover:text-sonic-text hover:bg-white/5 border border-transparent'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-sonic-border text-sonic-text-dim hover:text-sonic-text hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Transcription"
        >
          <p className="text-sm text-sonic-text-dim mb-6">
            Are you sure you want to delete this transcription? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 text-sm font-medium text-sonic-text-dim border border-sonic-border rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={!!deleteLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
}
