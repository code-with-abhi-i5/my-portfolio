import { useEffect } from 'react';
import { playHoverSound, playClickSound } from '../utils/SoundEffects';

const SELECTORS =
  '.btn-primary, .btn-outline, .btn-resume, .nav-cta, .filter-btn, .form-submit, .social-link, .card-link';

/**
 * Attaches subtle hover / click sounds to all interactive buttons.
 * Uses event delegation so it works for dynamically rendered elements.
 */
export default function useSoundEffects() {
  useEffect(() => {
    let lastHover = 0;

    const onMouseOver = (e) => {
      if (!e.target.closest(SELECTORS)) return;
      const now = Date.now();
      if (now - lastHover < 120) return; // throttle
      lastHover = now;
      playHoverSound();
    };

    const onClick = (e) => {
      if (!e.target.closest(SELECTORS)) return;
      playClickSound();
    };

    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('click', onClick, { passive: true });

    return () => {
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('click', onClick);
    };
  }, []);
}
