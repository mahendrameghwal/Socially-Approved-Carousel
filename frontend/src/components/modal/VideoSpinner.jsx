/**
 * VideoSpinner
 * Centered buffering indicator overlaid on the video player.
 * Shown when isBuffering === true.
 */
export default function VideoSpinner() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 10 }}
      aria-label="Buffering"
      role="status"
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.15)',
          borderTopColor: 'var(--color-brand)',
          animation: 'spin 0.7s linear infinite',
        }}
      />
    </div>
  );
}
