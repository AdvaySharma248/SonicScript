// ===========================================
// useDashboardStats — Hook for Dashboard Data
// ===========================================
//
// Fetches all transcriptions and computes aggregate stats:
//   - Total count
//   - Upload count
//   - Total duration
//   - Average confidence
//   - Recent activity (last 5)
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import { getTranscriptions } from '../services/transcriptionApi';

const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalTranscriptions: 0,
    audioUploaded: 0,
    totalDuration: 0,
    avgConfidence: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getTranscriptions({ limit: 100 });
      const transcriptions = response?.data?.transcriptions || response?.transcriptions || [];

      // Compute aggregate stats from transcription data
      const totalTranscriptions = transcriptions.length;
      const audioUploaded = transcriptions.filter((t) => t.source === 'upload').length;
      const totalDuration = transcriptions.reduce((sum, t) => sum + (t.audioDuration || 0), 0);

      // Average confidence (only from entries that have a confidence score)
      const withConfidence = transcriptions.filter((t) => t.confidence != null && t.confidence > 0);
      const avgConfidence = withConfidence.length > 0
        ? withConfidence.reduce((sum, t) => sum + t.confidence, 0) / withConfidence.length
        : 0;

      setStats({
        totalTranscriptions,
        audioUploaded,
        totalDuration,
        avgConfidence: Math.round(avgConfidence * 100) / 100,
      });

      // Recent activity — last 5 entries sorted by date
      const sorted = [...transcriptions].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentActivity(sorted.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, recentActivity, loading, error, refresh: fetchStats };
};

export default useDashboardStats;
