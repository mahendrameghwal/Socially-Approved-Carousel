import { useRef } from 'react';
import VideoCard from './VideoCard';
import CarouselSkeleton from './CarouselSkeleton';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * VideoCarousel
 * Renders a premium horizontal scrolling carousel of VideoCard tiles.
 * - Displays left/right navigation arrows for desktop sliding.
 * - Supports touch scrolling on mobile.
 * - Triggers infinite loading horizontally when scrolling near the end.
 */
export default function VideoCarousel({ videos, isLoading, isFetching, hasMore, error, onLoadMore, onOpen, updateVideo }) {
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);

  // Trigger horizontal loadMore when the sentinel at the end of the carousel scroll enters the viewport
  useIntersectionObserver(sentinelRef, onLoadMore, {
    threshold: 0.1,
    rootMargin: '300px', // trigger load before reaching the absolute end
  });

  const handleScroll = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollRight = container.scrollWidth - container.scrollLeft - container.clientWidth;
      if (scrollRight < 500) { // trigger when 500px from the end
        if (hasMore && !isFetching) {
          onLoadMore();
        }
      }
    }
  };

  const scroll = (direction) => {
    if (containerRef.current) {
      const cardWidth = 236; // 220px width + 16px gap
      const visibleWidth = containerRef.current.clientWidth;
      
      // Proactively trigger load more when scrolling right near the end
      const scrollRight = containerRef.current.scrollWidth - containerRef.current.scrollLeft - containerRef.current.clientWidth;
      if (direction === 'right' && scrollRight < 450) {
        if (hasMore && !isFetching) {
          onLoadMore();
        }
      }

      // Scroll by exactly 2 cards for a more controlled, smooth movement
      const scrollAmount = cardWidth * 2;
      
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 py-4">
        <CarouselSkeleton count={5} />
      </div>
    );
  }

  if (error && videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>
          Failed to load videos.
        </p>
        <button
          onClick={onLoadMore}
          className="px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
          style={{
            backgroundColor: 'var(--color-brand)',
            color: '#fff',
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!isLoading && videos.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-base" style={{ color: 'var(--color-text-muted)' }}>
          No videos found.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Video carousel" className="relative group px-6 py-2">
      {/* ── Left Navigation Arrow ── */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/80 hover:bg-white text-black border border-black/10 backdrop-blur-md shadow-md hover:shadow-lg transition-all active:scale-95 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        style={{ cursor: 'pointer' }}
        aria-label="Scroll left"
      >
        <ChevronLeft size={22} strokeWidth={2.5} />
      </button>

      {/* ── Scrollable Horizontal List ── */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-proximity py-3 px-2 scroll-smooth"
        style={{ scrollPadding: '8px' }}
      >
        {videos.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            index={index}
            onOpen={onOpen}
            updateVideo={updateVideo}
          />
        ))}

        {/* ── Sentinel & Infinite Loader inside the horizontal stream ── */}
        <div
          ref={sentinelRef}
          className="flex-shrink-0 flex items-center justify-center w-28 h-auto snap-start cursor-pointer hover:bg-black/5 rounded-xl transition-all duration-150 active:scale-95"
          onClick={() => {
            if (hasMore && !isFetching) {
              onLoadMore();
            }
          }}
          style={{ cursor: 'pointer' }}
          aria-hidden="true"
        >
          {isFetching ? (
            <div className="flex flex-col items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <Loader2 size={20} className="animate-spin" style={{ color: 'var(--color-brand)' }} />
              <span>Loading...</span>
            </div>
          ) : hasMore ? (
            <div className="text-xs text-center font-medium hover:text-[var(--color-brand)] px-2" style={{ color: 'var(--color-text-muted)' }}>
              Load More
            </div>
          ) : (
            <div className="text-xs text-center px-2" style={{ color: 'var(--color-text-muted)' }}>
              All loaded
            </div>
          )}
        </div>
      </div>

      {/* ── Right Navigation Arrow ── */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white/80 hover:bg-white text-black border border-black/10 backdrop-blur-md shadow-md hover:shadow-lg transition-all active:scale-95 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        style={{ cursor: 'pointer' }}
        aria-label="Scroll right"
      >
        <ChevronRight size={22} strokeWidth={2.5} />
      </button>
    </section>
  );
}
