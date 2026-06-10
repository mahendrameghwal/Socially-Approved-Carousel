import axios from 'axios';

// Generate a stable session ID for this browser tab (for like tracking)
const SESSION_ID = (() => {
  const stored = sessionStorage.getItem('vc_session_id');
  if (stored) return stored;
  const id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  sessionStorage.setItem('vc_session_id', id);
  return id;
})();

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'x-session-id': SESSION_ID,
  },
  withCredentials: true,
});

// ── Video API calls ─────────────────────────────────────────────────────────

/**
 * Fetch paginated video list
 * @param {number} page  - 1-based page number
 * @param {number} limit - records per page (default 12)
 */
export const fetchVideos = (page = 1, limit = 12) =>
  api.get(`/v1/videos`, { params: { page, limit } }).then((r) => r.data);

/**
 * Fetch a single video by ID
 */
export const fetchVideoById = (id) =>
  api.get(`/v1/videos/${id}`).then((r) => r.data);

/**
 * Toggle like on a video. Returns { id, likes, likedByUser }
 */
export const likeVideo = (id) =>
  api.post(`/v1/videos/${id}/like`).then((r) => r.data);

/**
 * Increment share count. Returns { id, shares }
 */
export const shareVideo = (id) =>
  api.post(`/v1/videos/${id}/share`).then((r) => r.data);

/**
 * Increment view count. Returns { id, views }
 */
export const viewVideo = (id) =>
  api.post(`/v1/videos/${id}/view`).then((r) => r.data);

export default api;
