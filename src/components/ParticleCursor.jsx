import React, { useEffect, useRef } from 'react';
import { particlesCursor } from 'threejs-toys';

export default function ParticleCursor() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let pc;

    // Initialize the exact effect from threejs-toys image
    try {
      pc = particlesCursor({
        el: mount,
        gpgpuSize: 256, // Reduced from 512 so it doesn't clutter the screen
        colors: [0x00fffc, 0x00fffc], 
        color: 0xffffff,
        coordScale: 0.5,
        noiseIntensity: 0.002, // Less noise so it stays like a beam
        noiseTimeCoef: 0.0001,
        pointSize: 2,
        pointDecay: 0.005, // Decays faster
        sleepRadiusX: 0, // 0 removes the huge background cloud
        sleepRadiusY: 0, // 0 removes the huge background cloud
        sleepTimeCoefX: 0.001,
        sleepTimeCoefY: 0.002
      });
    } catch (e) {
      console.error("Error initializing particlesCursor:", e);
    }

    // Cleanup
    return () => {
      // Clean up the DOM element since threejs-toys appends a canvas to it
      if (pc && typeof pc.destroy === 'function') {
        pc.destroy();
      }
      if (mount) {
        mount.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="particle-cursor-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999, // Overlay on top of everything
        pointerEvents: 'none', // Lets clicks pass through to app
        mixBlendMode: 'screen', // Makes the black background completely transparent!
      }}
    />
  );
}
