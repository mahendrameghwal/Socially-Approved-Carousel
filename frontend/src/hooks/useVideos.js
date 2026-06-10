import { useState, useCallback } from 'react';
import { fetchVideos } from '../services/api';

/**
 * Manages paginated video fetching with infinite-scroll support.
 *
 * Returns:
 *  - videos      : accumulated array of all fetched videos
 *  - isLoading   : true on initial load (no videos yet)
 *  - isFetching  : true when loading more (already have some videos)
 *  - hasMore     : whether more pages are available
 *  - error       : error message string or null
 *  - loadMore    : function to fetch the next page
 *  - updateVideo : locally patch one video's fields (for optimistic updates)
 */
export function useVideos(limit = 12) {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const loadMore = useCallback(async () => {
    // Prevent duplicate concurrent fetches
    if (isFetching || !hasMore) return;

    const isFirst = !initialized;
    if (isFirst) setIsLoading(true);
    else setIsFetching(true);

    try {
      const data = await fetchVideos(page, limit);
      setVideos((prev) => {
        // Deduplicate by id (safety against StrictMode double-invoke)
        const existingIds = new Set(prev.map((v) => v.id));
        const newOnes = data.data.filter((v) => !existingIds.has(v.id));
        return [...prev, ...newOnes];
      });
      setHasMore(data.hasMore);
      setPage((p) => p + 1);
      setInitialized(true);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load videos');
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [page, limit, hasMore, isFetching, initialized]);

  /**
   * Patch a single video's fields in the local array.
   * Used by LikeButton / ShareButton for optimistic updates.
   */
  const updateVideo = useCallback((id, patch) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...patch } : v))
    );
  }, []);

  return { videos, isLoading, isFetching, hasMore, error, loadMore, updateVideo };
}
