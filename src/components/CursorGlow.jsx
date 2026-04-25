import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Disable on smaller screens for performance and UX
    if (window.innerWidth <= 768) return;

    const onMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="hidden md:block pointer-events-none fixed top-[-150px] left-[-150px] w-[300px] h-[300px] rounded-full z-[9999]"
      style={{
        background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15), transparent 70%)',
        filter: 'blur(30px)',
        willChange: 'transform',
      }}
    />
  );
}
