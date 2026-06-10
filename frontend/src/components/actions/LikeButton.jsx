import { Heart } from 'lucide-react';

/**
 * Compact number formatter
 */
function fmt(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/**
 * LikeButton
 * Heart icon with count. Fills red when liked.
 *
 * @param {number}   likes       - current like count
 * @param {boolean}  likedByUser - whether current session has liked
 * @param {boolean}  isLiking    - request in flight
 * @param {Function} onLike      - click handler
 */
export default function LikeButton({ likes, likedByUser, isLiking, onLike }) {
  return (
    <button
      aria-label={likedByUser ? 'Unlike' : 'Like'}
      onClick={onLike}
      disabled={isLiking}
      className="flex flex-col items-center gap-1 group"
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <div
        className="flex items-center justify-center w-11 h-11 rounded-full transition-all duration-150"
        style={{
          backgroundColor: likedByUser
            ? 'rgba(255,77,109,0.15)'
            : 'rgba(255,255,255,0.1)',
          transform: isLiking ? 'scale(0.92)' : 'scale(1)',
        }}
      >
        <Heart
          size={22}
          fill={likedByUser ? 'var(--color-like)' : 'none'}
          color={likedByUser ? 'var(--color-like)' : 'rgba(255,255,255,0.85)'}
          style={{ transition: 'fill 0.15s ease, color 0.15s ease' }}
        />
      </div>
      <span
        className="text-xs tabular-nums font-medium"
        style={{ color: likedByUser ? 'var(--color-like)' : 'rgba(255,255,255,0.7)' }}
      >
        {fmt(likes)}
      </span>
    </button>
  );
}
