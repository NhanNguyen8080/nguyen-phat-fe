import { useEffect, useRef } from 'react';

/**
 * Custom hook — triggers scroll-based reveal animations.
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport, `.is-visible` is added (once only).
 *
 * @param {IntersectionObserverInit} options - Optional override for observer config
 */
export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const threshold = options.threshold ?? 0.12;
  const rootMargin = options.rootMargin ?? '0px 0px -40px 0px';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // animate once
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
};
