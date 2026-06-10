import { useState, useCallback, useEffect } from 'react';
import VideoCarousel from '../components/carousel/VideoCarousel';
import VideoModal from '../components/modal/VideoModal';
import { useVideos } from '../hooks/useVideos';

/**
 * FeedPage
 * The main page — shows the header and video grid.
 * Manages modal open/close state and which video to open.
 */
export default function FeedPage() {
  const { videos, isLoading, isFetching, hasMore, error, loadMore, updateVideo } =
    useVideos(12);

  const [modalOpen, setModalOpen]       = useState(false);
  const [activeIndex, setActiveIndex]   = useState(0);

  // Load the first page on mount
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once

  const handleOpen = useCallback((video, index) => {
    setActiveIndex(index);
    setModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-surface)' }}>
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-center px-6 py-4"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <img
          src="https://www.driptrip.in/cdn/shop/files/driptrip_logo_b46b979a-0e20-4569-bce5-b8e33759a27a.png?v=1676718431&width=225"
          alt="DripTrip Logo"
          style={{ height: '32px', objectFit: 'contain' }}
        />
      </header>

      {/* ── Main feed ── */}
      <main className="pt-4 flex-grow flex-1">
        <VideoCarousel
          videos={videos}
          isLoading={isLoading}
          isFetching={isFetching}
          hasMore={hasMore}
          error={error}
          onLoadMore={loadMore}
          onOpen={handleOpen}
          updateVideo={updateVideo}
        />
      </main>

      {/* ── Footer ── */}
      <footer
        className="w-full py-6 flex items-center justify-center border-t mt-8"
        style={{
          borderTopColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
          Design by Mahendra Solanki
        </p>
      </footer>

      {/* ── Modal ── */}
      <VideoModal
        isOpen={modalOpen}
        onClose={handleClose}
        videos={videos}
        startIndex={activeIndex}
        updateVideo={updateVideo}
      />
    </div>
  );
}
