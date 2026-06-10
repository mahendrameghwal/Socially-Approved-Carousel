import { Share2 } from 'lucide-react';

/**
 * Compact number formatter
 */
function fmt(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/**
 * ShareButton
 * Triggers native share or clipboard copy via onShare.
 *
 * @param {number}   shares    - current share count
 * @param {boolean}  isSharing - request in flight
 * @param {Function} onShare   - click handler
 */
export default function ShareButton({ shares, isSharing, onShare }) {
  return (
    <button
      aria-label="Share this video"
      onClick={onShare}
      disabled={isSharing}
      className="flex flex-col items-center gap-1"
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <div
        className="flex items-center justify-center w-11 h-11 rounded-full transition-all duration-150"
        style={{
          backgroundColor: isSharing
            ? 'rgba(77,187,255,0.2)'
            : 'rgba(255,255,255,0.1)',
          transform: isSharing ? 'scale(0.92)' : 'scale(1)',
        }}
      >
        <Share2
          size={20}
          color={isSharing ? 'var(--color-share)' : 'rgba(255,255,255,0.85)'}
          style={{ transition: 'color 0.15s ease' }}
        />
      </div>
      <span
        className="text-xs tabular-nums font-medium"
        style={{ color: 'rgba(255,255,255,0.7)' }}
      >
        {fmt(shares)}
      </span>
    </button>
  );
}
