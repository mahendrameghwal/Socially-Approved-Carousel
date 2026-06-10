import { useState, useCallback } from 'react';
import { likeVideo, shareVideo } from '../services/api';

/**
 * Handles like and share mutations with optimistic updates.
 *
 * @param {Object}   video        - The video object from the video list
 * @param {Function} updateVideo  - Patcher from useVideos to sync the list
 * @returns {{
 *   likes: number,
 *   shares: number,
 *   likedByUser: boolean,
 *   isLiking: boolean,
 *   isSharing: boolean,
 *   handleLike: Function,
 *   handleShare: Function,
 * }}
 */
export function useLikeShare(video, updateVideo) {
  const [likes, setLikes] = useState(video?.likes ?? 0);
  const [shares, setShares] = useState(video?.shares ?? 0);
  const [likedByUser, setLikedByUser] = useState(video?.likedByUser ?? false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleLike = useCallback(async () => {
    if (isLiking || !video?.id) return;

    // Optimistic update
    const newLiked = !likedByUser;
    const newLikes = newLiked ? likes + 1 : Math.max(0, likes - 1);
    setLikedByUser(newLiked);
    setLikes(newLikes);
    updateVideo?.(video.id, { likes: newLikes, likedByUser: newLiked });

    setIsLiking(true);
    try {
      const result = await likeVideo(video.id);
      // Reconcile with server truth
      setLikes(result.likes);
      setLikedByUser(result.likedByUser);
      updateVideo?.(video.id, { likes: result.likes, likedByUser: result.likedByUser });
    } catch {
      // Rollback on error
      setLikedByUser(!newLiked);
      setLikes(likes);
      updateVideo?.(video.id, { likes, likedByUser });
    } finally {
      setIsLiking(false);
    }
  }, [isLiking, video?.id, likedByUser, likes, updateVideo]);

  const handleShare = useCallback(async () => {
    if (isSharing || !video?.id) return;

    const videoUrl = `${window.location.origin}?v=${video.id}`;

    // Try native share sheet (mobile), fall back to clipboard
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, url: videoUrl });
      } else {
        await navigator.clipboard.writeText(videoUrl);
      }
    } catch {
      // User cancelled share or clipboard not available — still fire API
    }

    // Optimistic update
    const newShares = shares + 1;
    setShares(newShares);
    updateVideo?.(video.id, { shares: newShares });

    setIsSharing(true);
    try {
      const result = await shareVideo(video.id);
      setShares(result.shares);
      updateVideo?.(video.id, { shares: result.shares });
    } catch {
      setShares(shares);
      updateVideo?.(video.id, { shares });
    } finally {
      setIsSharing(false);
    }
  }, [isSharing, video, shares, updateVideo]);

  return { likes, shares, likedByUser, isLiking, isSharing, handleLike, handleShare };
}
