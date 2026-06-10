import { useState, useRef, useEffect } from 'react';
import { Play, Heart, Eye } from 'lucide-react';
import { likeVideo } from '../../services/api';

/**
 * Formats seconds to mm:ss
 */
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Compact number formatter (1200 → 1.2K)
 */
function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/**
 * VideoCard
 * Renders a single video card.
 * - Autoplays when visible in the viewport using IntersectionObserver.
 * - Displays all overlay text (title, duration, author, stats) in white.
 * - Styled with fixed width for horizontal carousel integration.
 */
export default function VideoCard({ video, index, onOpen, updateVideo }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLikeClick = async (e) => {
    e.stopPropagation(); // Prevent opening the modal
    if (isLiking || !updateVideo) return;
    setIsLiking(true);

    const wasLiked = !!video.likedByUser;
    const nextLiked = !wasLiked;
    const nextLikes = nextLiked ? video.likes + 1 : Math.max(0, video.likes - 1);

    // Optimistic Update
    updateVideo(video.id, {
      likedByUser: nextLiked,
      likes: nextLikes,
    });

    try {
      const res = await likeVideo(video.id);
      updateVideo(video.id, {
        likedByUser: res.likedByUser,
        likes: res.likes,
      });
    } catch (err) {
      console.error('Failed to like from home card', err);
      // Rollback
      updateVideo(video.id, {
        likedByUser: wasLiked,
        likes: video.likes,
      });
    } finally {
      setIsLiking(false);
    }
  };

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      {
        threshold: 0.15, // trigger when 15% visible
        rootMargin: '120px', // trigger slightly before entering
      }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <article
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={`Play ${video.title}`}
      onClick={() => onOpen(video, index)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpen(video, index); }}
      className="group relative rounded-xl overflow-hidden cursor-pointer snap-start"
      style={{
        width: 220,
        aspectRatio: '9/16',
        backgroundColor: '#1a1a19',
        outline: 'none',
        flexShrink: 0,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.18)';
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        if (videoRef.current && isIntersecting) {
          videoRef.current.play().catch(() => {});
        }
      }}
    >
      {/* ── Video / Thumbnail Area ── */}
      <div className="absolute inset-0">
        {isIntersecting ? (
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            muted
            loop
            playsInline
            autoPlay
            className="w-full h-full object-cover"
            style={{ backgroundColor: '#000' }}
          />
        ) : (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* ── Gradient overlay (always visible) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 55%, transparent 80%)',
          zIndex: 2,
        }}
      />

      {/* ── Play button (appears on hover) ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0, transition: 'opacity 0.15s ease', zIndex: 3 }}
        ref={(el) => {
          if (el) {
            const card = el.closest('article');
            if (card) {
              card.addEventListener('mouseenter', () => { el.style.opacity = '1'; });
              card.addEventListener('mouseleave', () => { el.style.opacity = '0'; });
            }
          }
        }}
      >
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full"
          style={{
            backgroundColor: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            transform: 'scale(0.9)',
            transition: 'transform 0.15s ease',
          }}
        >
          <Play size={18} fill="white" color="white" />
        </div>
      </div>

      {/* ── Duration badge (top right) ── */}
      <div
        className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-xs font-semibold"
        style={{
          backgroundColor: 'rgba(0,0,0,0.65)',
          color: '#ffffff', // Explicitly white text
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.1)',
          zIndex: 4,
        }}
      >
        {formatDuration(video.duration)}
      </div>

      {/* ── Bottom metadata (all text colored white for legibility) ── */}
      <div className="absolute bottom-0 left-0 right-0 p-4" style={{ zIndex: 4 }}>
        {/* Author */}
        <div className="flex items-center gap-2 mb-1.5">
          <img
            src={video.author.avatarUrl}
            alt={video.author.name}
            className="w-5 h-5 rounded-full object-cover border border-white/20"
            loading="lazy"
          />
          <span
            className="text-xs font-medium truncate"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            {video.author.name}
          </span>
        </div>

        {/* Title */}
        <p
          className="text-sm font-semibold leading-snug line-clamp-2 mb-2"
          style={{ color: '#ffffff' }}
        >
          {video.title}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3">
          <span
            onClick={handleLikeClick}
            className="flex items-center gap-1 text-xs hover:scale-105 active:scale-95 transition-transform"
            style={{
              color: video.likedByUser ? 'var(--color-like)' : 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
            }}
            title="Like video"
          >
            <Heart
              size={11}
              fill={video.likedByUser ? 'var(--color-like)' : 'rgba(255,255,255,0.2)'}
              color={video.likedByUser ? 'var(--color-like)' : 'currentColor'}
            />
            {formatCount(video.likes)}
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <Eye size={11} />
            {formatCount(video.views)}
          </span>
        </div>
      </div>
    </article>
  );
}
