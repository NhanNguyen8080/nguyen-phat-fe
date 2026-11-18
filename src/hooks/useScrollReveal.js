import { useEffect, useRef } from 'react';

/**
 * Custom hook — triggers scroll-based reveal animations.
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport, `.is-visible` is added,
 * and re-triggers smoothly when jumping between full-page sections.
 *
 * @param {IntersectionObserverInit & { once?: boolean }} options
 */
export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const threshold = options.threshold ?? 0.12;
  const rootMargin = options.rootMargin ?? '0px 0px -30px 0px';
  const once = options.once ?? false;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          entry.target.classList.remove('is-visible');
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
};
