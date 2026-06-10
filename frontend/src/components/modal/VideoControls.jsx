import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

/**
 * Formats seconds → mm:ss
 */
function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/**
 * VideoControls
 * Overlay control bar shown at the bottom of the VideoPlayer.
 */
export default function VideoControls({
  isPlaying,
  isMuted,
  currentTime,
  duration,
  onTogglePlay,
  onToggleMute,
  onFullscreen,
}) {
  return (
    <div
      className="absolute bottom-4 left-4 right-4 flex items-center gap-3"
      style={{ zIndex: 25 }}
    >
      {/* Play / Pause */}
      <button
        aria-label={isPlaying ? 'Pause' : 'Play'}
        onClick={onTogglePlay}
        className="flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-100"
        style={{
          backgroundColor: 'rgba(255,255,255,0.15)',
          color: '#fff',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
      >
        {isPlaying
          ? <Pause size={16} fill="white" />
          : <Play  size={16} fill="white" />}
      </button>

      {/* Time display */}
      <span
        className="text-xs tabular-nums select-none"
        style={{ color: 'rgba(255,255,255,0.8)', minWidth: 80 }}
      >
        {fmt(currentTime)} / {fmt(duration)}
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Mute / Unmute */}
      <button
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        onClick={onToggleMute}
        className="flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-100"
        style={{
          backgroundColor: 'rgba(255,255,255,0.15)',
          color: '#fff',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
      >
        {isMuted
          ? <VolumeX size={16} />
          : <Volume2 size={16} />}
      </button>

      {/* Fullscreen */}
      <button
        aria-label="Fullscreen"
        onClick={onFullscreen}
        className="flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-100"
        style={{
          backgroundColor: 'rgba(255,255,255,0.15)',
          color: '#fff',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
      >
        <Maximize2 size={16} />
      </button>
    </div>
  );
}
