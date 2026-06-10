import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import ModalCarousel from './ModalCarousel';

/**
 * Toast component (inline, no library)
 */
function Toast({ message }) {
  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-sm font-medium fade-in"
      style={{
        backgroundColor: 'rgba(30,30,30,0.95)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
        pointerEvents: 'none',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

/**
 * VideoModal
 * Full-screen overlay with focus trap, keyboard nav, and backdrop dismiss.
 *
 * @param {boolean}  isOpen       - Controls visibility
 * @param {Function} onClose      - Close handler
 * @param {Array}    videos       - All videos in the feed
 * @param {number}   startIndex   - Which video to open first
 * @param {Function} updateVideo  - Optimistic update patcher
 */
export default function VideoModal({ isOpen, onClose, videos, startIndex, updateVideo }) {
  const overlayRef = useRef(null);
  const closeRef = useRef(null);

  // Toast state
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    // Lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the close button on open
    setTimeout(() => closeRef.current?.focus(), 50);

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  // Cleanup toast on unmount
  useEffect(() => {
    return () => clearTimeout(toastTimer.current);
  }, []);

  if (!isOpen || !videos?.length) return null;

  return createPortal(
    <>
      {/* ── Backdrop ── */}
      <div
        ref={overlayRef}
        className="fixed inset-0 flex items-center justify-center fade-in"
        style={{
          backgroundColor: 'rgba(226,225,223,0.96)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
        }}
        onClick={(e) => {
          // Close only when clicking the backdrop itself
          if (e.target === overlayRef.current) onClose();
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Video player"
      >
        {/* ── Close button ── */}
        <button
          ref={closeRef}
          aria-label="Close video player"
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-100"
          style={{
            backgroundColor: 'rgba(0,0,0,0.06)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(0,0,0,0.1)',
            color: '#000',
            zIndex: 1010,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.12)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.06)'; }}
        >
          <X size={18} />
        </button>

        {/* ── Inner carousel ── */}
        <div
          className="scale-in flex items-center justify-center w-full h-full px-4 py-12"
          style={{ maxWidth: 700 }}
        >
          <ModalCarousel
            videos={videos}
            startIndex={startIndex}
            updateVideo={updateVideo}
            onShowToast={showToast}
          />
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && <Toast message={toast} />}
    </>,
    document.body
  );
}
