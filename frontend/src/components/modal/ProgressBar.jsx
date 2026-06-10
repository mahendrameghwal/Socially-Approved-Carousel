import { useRef, useCallback } from 'react';

/**
 * ProgressBar
 * Thin seekable progress bar at the bottom of the video player.
 *
 * @param {number}   progress  - 0–100 fill percentage
 * @param {number}   duration  - total duration in seconds
 * @param {Function} onSeek    - called with absolute time in seconds
 */
export default function ProgressBar({ progress, duration, onSeek }) {
  const barRef = useRef(null);

  const handleClick = useCallback(
    (e) => {
      const bar = barRef.current;
      if (!bar || !duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onSeek(ratio * duration);
    },
    [duration, onSeek]
  );

  // Drag-seek support
  const handleMouseMove = useCallback(
    (e) => {
      if (e.buttons !== 1) return; // only while mouse button held
      handleClick(e);
    },
    [handleClick]
  );

  return (
    <div
      ref={barRef}
      role="slider"
      aria-label="Video progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      className="absolute bottom-0 left-0 right-0 cursor-pointer group"
      style={{ height: 20, display: 'flex', alignItems: 'flex-end', zIndex: 20 }}
    >
      {/* Track */}
      <div
        className="w-full"
        style={{
          height: 3,
          backgroundColor: 'rgba(255,255,255,0.2)',
          transition: 'height 0.1s ease',
        }}
        ref={(el) => {
          if (el) {
            const parent = el.closest('[role="slider"]');
            if (parent) {
              parent.addEventListener('mouseenter', () => { el.style.height = '5px'; });
              parent.addEventListener('mouseleave', () => { el.style.height = '3px'; });
            }
          }
        }}
      >
        {/* Fill */}
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: 'var(--color-brand)',
            borderRadius: '0 2px 2px 0',
            transition: 'width 0.1s linear',
            position: 'relative',
          }}
        >
          {/* Scrubber dot */}
          <div
            style={{
              position: 'absolute',
              right: -5,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: 'var(--color-brand)',
              opacity: 0,
              transition: 'opacity 0.1s',
            }}
            className="group-hover:opacity-100"
          />
        </div>
      </div>
    </div>
  );
}
