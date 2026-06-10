import { useEffect, useRef } from 'react';

/**
 * Attaches an IntersectionObserver to `ref`.
 * Calls `onIntersect` when the element enters the viewport.
 *
 * @param {React.RefObject} ref         - Ref to the sentinel/target element
 * @param {Function}        onIntersect - Callback when element becomes visible
 * @param {Object}          options     - IntersectionObserver options
 */
export function useIntersectionObserver(
  ref,
  onIntersect,
  options = { threshold: 0.1, rootMargin: '200px' }
) {
  const callbackRef = useRef(onIntersect);

  // Keep callback ref fresh without re-creating the observer
  useEffect(() => {
    callbackRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callbackRef.current();
      }
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
