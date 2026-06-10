import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

/**
 * ModalCarousel
 * Inner carousel that holds the active VideoPlayer and provides Prev/Next navigation.
 *
 * @param {Array}    videos       - Full video list
 * @param {number}   startIndex   - Index of the video that was clicked
 * @param {Function} updateVideo  - Patcher from useVideos
 * @param {Function} onShowToast  - Toast callback
 */
export default function ModalCarousel({ videos, startIndex, updateVideo, onShowToast }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [slideDirection, setSlideDirection] = useState('left'); // 'left' or 'right'

  const goTo = useCallback((index, dir) => {
    if (index < 0 || index >= videos.length) return;
    setSlideDirection(dir);
    setCurrentIndex(index);
  }, [videos.length]);

  const goPrev = useCallback(() => goTo(currentIndex - 1, 'right'), [currentIndex, goTo]);
  const goNext = useCallback(() => goTo(currentIndex + 1, 'left'), [currentIndex, goTo]);

  const currentVideo = videos[currentIndex];
  if (!currentVideo) return null;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < videos.length - 1;

  const navBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,0.06)',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(0,0,0,0.1)',
    color: '#000',
    cursor: 'pointer',
    transition: 'background-color 0.12s ease',
    flexShrink: 0,
  };

  return (
    <div className="relative flex items-center w-full h-full gap-2">
      {/* ── Previous button ── */}
      <button
        aria-label="Previous video"
        onClick={goPrev}
        disabled={!hasPrev}
        style={{
          ...navBtnStyle,
          opacity: hasPrev ? 1 : 0.25,
          pointerEvents: hasPrev ? 'auto' : 'none',
          zIndex: 40,
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.12)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.06)'; }}
      >
        <ChevronLeft size={20} />
      </button>

      {/* ── Video player area ── */}
      <div
        key={currentIndex}      // remount player to trigger slide animation
        className={`relative flex-1 overflow-hidden ${slideDirection === 'left' ? 'slide-left-in' : 'slide-right-in'}`}
        style={{
          // Portrait 9:16 aspect, capped so it fits within modal height
          maxWidth: 420,
          width: '100%',
          aspectRatio: '9/16',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        }}
      >
        <VideoPlayer
          key={currentVideo.id}      // remount player on video change
          video={currentVideo}
          isActive={true}
          updateVideo={updateVideo}
          onShowToast={onShowToast}
        />
      </div>

      {/* ── Next button ── */}
      <button
        aria-label="Next video"
        onClick={goNext}
        disabled={!hasNext}
        style={{
          ...navBtnStyle,
          opacity: hasNext ? 1 : 0.25,
          pointerEvents: hasNext ? 'auto' : 'none',
          zIndex: 40,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.12)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.06)'; }}
      >
        <ChevronRight size={20} />
      </button>

      {/* ── Index indicator ── */}
      <div
        className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs tabular-nums"
        style={{
          backgroundColor: 'rgba(0,0,0,0.06)',
          color: '#000',
          border: '1px solid rgba(0,0,0,0.08)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
        }}
      >
        {currentIndex + 1} / {videos.length}
      </div>
    </div>
  );
}
