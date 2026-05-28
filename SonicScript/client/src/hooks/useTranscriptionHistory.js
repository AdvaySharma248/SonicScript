// ===========================================
// useTranscriptionHistory — Hook for History Page
// ===========================================
//
// Manages transcription history with:
//   - Fetching all transcriptions
//   - Search filtering (client-side)
//   - Status filtering
//   - Delete functionality
//   - Pagination
// ===========================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getTranscriptions, deleteTranscription } from '../services/transcriptionApi';

const ITEMS_PER_PAGE = 9;

const useTranscriptionHistory = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(null); // ID being deleted

  // Fetch all transcriptions
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getTranscriptions({ limit: 200 });
      const data = response?.data?.transcriptions || response?.transcriptions || [];

      // Sort newest first
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTranscriptions(sorted);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError(err.message || 'Failed to load transcription history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Filter transcriptions based on search and status
  const filteredTranscriptions = useMemo(() => {
    let filtered = [...transcriptions];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // Search filter (case-insensitive match on transcript text and filename)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (t) =>
          t.transcript?.toLowerCase().includes(query) ||
          t.audioFileName?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [transcriptions, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredTranscriptions.length / ITEMS_PER_PAGE);
  const paginatedTranscriptions = filteredTranscriptions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Delete a transcription
  const deleteItem = useCallback(async (id) => {
    setDeleteLoading(id);
    try {
      await deleteTranscription(id);
      setTranscriptions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Failed to delete transcription:', err);
      throw err; // Let the component handle the error toast
    } finally {
      setDeleteLoading(null);
    }
  }, []);

  return {
    transcriptions: paginatedTranscriptions,
    allTranscriptions: filteredTranscriptions,
    totalCount: filteredTranscriptions.length,
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
    refresh: fetchHistory,
  };
};

export default useTranscriptionHistory;
