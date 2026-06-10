import { Video, PaginatedVideos } from '../models/video.model';
import { seedVideos } from '../utils/seed';

// ── In-memory store ────────────────────────────────────────────────────────────
// Seeded once at module load; persists for the lifetime of the Node process.
let videos: Video[] = seedVideos();

// Per-session like tracking: Map<videoId, Set<sessionId>>
// (sessionId is sent by the client as a UUID cookie / header)
const likedBy: Map<string, Set<string>> = new Map();

// ── Helpers ────────────────────────────────────────────────────────────────────
function findVideoById(id: string): Video | undefined {
  return videos.find((v) => v.id === id);
}

function ensureLikeSet(videoId: string): Set<string> {
  if (!likedBy.has(videoId)) likedBy.set(videoId, new Set());
  return likedBy.get(videoId)!;
}

// ── Service functions ──────────────────────────────────────────────────────────

/**
 * Returns a paginated slice of the video list.
 * @param page  1-based page number
 * @param limit records per page (capped at 20)
 */
export function getVideos(page: number, limit: number): PaginatedVideos {
  const safeLimit = Math.min(limit, 20);
  const safePage = Math.max(page, 1);
  const start = (safePage - 1) * safeLimit;
  const slice = videos.slice(start, start + safeLimit);

  return {
    data: slice,
    page: safePage,
    limit: safeLimit,
    total: videos.length,
    hasMore: start + safeLimit < videos.length,
  };
}

/**
 * Returns a single video by ID.
 */
export function getVideoById(id: string): Video | null {
  return findVideoById(id) ?? null;
}

/**
 * Toggles the like on a video for the given session.
 * Returns updated like count and the new liked state.
 */
export function toggleLike(
  videoId: string,
  sessionId: string
): { id: string; likes: number; likedByUser: boolean } | null {
  const video = findVideoById(videoId);
  if (!video) return null;

  const likers = ensureLikeSet(videoId);
  let likedByUser: boolean;

  if (likers.has(sessionId)) {
    likers.delete(sessionId);
    video.likes = Math.max(0, video.likes - 1);
    likedByUser = false;
  } else {
    likers.add(sessionId);
    video.likes += 1;
    likedByUser = true;
  }

  return { id: video.id, likes: video.likes, likedByUser };
}

/**
 * Increments the share count on a video.
 */
export function incrementShare(
  videoId: string
): { id: string; shares: number } | null {
  const video = findVideoById(videoId);
  if (!video) return null;

  video.shares += 1;
  return { id: video.id, shares: video.shares };
}

/**
 * Increments the view count on a video.
 * Called when the client starts playing a video.
 */
export function incrementView(
  videoId: string
): { id: string; views: number } | null {
  const video = findVideoById(videoId);
  if (!video) return null;

  video.views += 1;
  return { id: video.id, views: video.views };
}
