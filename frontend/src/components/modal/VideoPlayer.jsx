import { useEffect, useRef } from 'react';
import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import { useLikeShare } from '../../hooks/useLikeShare';
import VideoSpinner from './VideoSpinner';
import ProgressBar from './ProgressBar';
import VideoControls from './VideoControls';
import LikeButton from '../actions/LikeButton';
import ShareButton from '../actions/ShareButton';

/**
 * VideoPlayer
 * Full-featured video player used inside the modal.
 * Contains the <video> element, all overlays, controls, like/share.
 *
 * @param {Object}   video        - Video data object
 * @param {boolean}  isActive     - Whether this is the currently displayed slide
 * @param {Function} updateVideo  - Patcher from useVideos
 * @param {Function} onShowToast  - Shows a brief toast message
 */
export default function VideoPlayer({ video, isActive, updateVideo, onShowToast }) {
  const {
    videoRef,
    isPlaying,
    isMuted,
    isBuffering,
    currentTime,
    duration,
    progress,
    play,
    pause,
    togglePlay,
    toggleMute,
    seek,
  } = useVideoPlayer(video.id);

  const { likes, shares, likedByUser, isLiking, isSharing, handleLike, handleShare } =
    useLikeShare(video, updateVideo);

  // Auto-play when this slide becomes active, pause when it doesn't
  useEffect(() => {
    if (isActive) {
      play();
    } else {
      pause();
    }
  }, [isActive, play, pause]);

  // Fullscreen handler
  const containerRef = useRef(null);
  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  };

  // Share with toast feedback
  const handleShareWithToast = async () => {
    await handleShare();
    onShowToast?.('Link copied to clipboard!');
  };

  // Like with toast feedback (only on first like)
  const handleLikeWithToast = async () => {
    const wasLiked = likedByUser;
    await handleLike();
    if (!wasLiked) onShowToast?.('Added to your likes ♥');
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#000' }}
    >
      {/* ── Video element ── */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        muted
        playsInline
        preload="auto"
        loop
        onClick={togglePlay}
        className="w-full h-full object-contain"
        style={{ cursor: 'pointer', maxHeight: '100%' }}
      />

      {/* ── Buffering spinner ── */}
      {isBuffering && <VideoSpinner />}

      {/* ── Top gradient for readability ── */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: 120,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
        }}
      />

      {/* ── Bottom gradient ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 160,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        }}
      />

      {/* ── Right-side action buttons (like/share) ── */}
      <div
        className="absolute right-4 flex flex-col items-center gap-5"
        style={{ bottom: 80, zIndex: 30 }}
      >
        <LikeButton
          likes={likes}
          likedByUser={likedByUser}
          isLiking={isLiking}
          onLike={handleLikeWithToast}
        />
        <ShareButton
          shares={shares}
          isSharing={isSharing}
          onShare={handleShareWithToast}
        />
      </div>

      {/* ── Video info (bottom left) ── */}
      <div
        className="absolute left-4 flex flex-col gap-1.5"
        style={{ bottom: 56, right: 72, zIndex: 30 }}
      >
        <div className="flex items-center gap-2">
          <img
            src={video.author.avatarUrl}
            alt={video.author.name}
            className="w-7 h-7 rounded-full object-cover"
            style={{ border: '1.5px solid rgba(255,255,255,0.4)' }}
          />
          <span
            className="text-sm font-semibold"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {video.author.name}
          </span>
        </div>
        <p
          className="text-sm font-medium line-clamp-2"
          style={{ color: 'rgba(255,255,255,0.85)' }}
        >
          {video.title}
        </p>
        <p
          className="text-xs line-clamp-2"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          {video.description}
        </p>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {video.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs"
              style={{
                backgroundColor: 'rgba(108,99,255,0.25)',
                color: 'var(--color-brand)',
                border: '1px solid rgba(108,99,255,0.3)',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Control bar ── */}
      <VideoControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        currentTime={currentTime}
        duration={duration}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onFullscreen={handleFullscreen}
      />

      {/* ── Progress bar ── */}
      <ProgressBar progress={progress} duration={duration} onSeek={seek} />
    </div>
  );
}
