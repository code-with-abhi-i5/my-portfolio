import { useState, useEffect } from 'react';
import './Loader.css';

export default function Loader({ onFinish }) {
  const [phase, setPhase] = useState('enter'); // enter → hold → exit

  useEffect(() => {
    // Phase 1: Logo animates in (already via CSS)
    // Phase 2: Hold for a moment
    const holdTimer = setTimeout(() => setPhase('exit'), 2400);
    // Phase 3: Fade out and unmount
    const exitTimer = setTimeout(() => onFinish?.(), 3200);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
    };
  }, [onFinish]);

  return (
    <div className={`loader-overlay ${phase}`}>
      {/* Background blobs */}
      <div className="loader-blob loader-blob-1" />
      <div className="loader-blob loader-blob-2" />
      <div className="loader-blob loader-blob-3" />

      {/* Center content */}
      <div className="loader-content">
        {/* Logo */}
        <div className="loader-logo">
          <span className="loader-logo-text">AB</span>
          <div className="loader-logo-ring" />
        </div>

        {/* Brand name */}
        <div className="loader-brand">
          {'Abhijeet Ghosh'.split('').map((ch, i) => (
            <span
              key={i}
              className="loader-letter"
              style={{ animationDelay: `${0.6 + i * 0.05}s` }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </div>

        {/* Loading text */}
        <div className="loader-status">
          <span className="loader-status-dot" />
          <span className="loader-status-text">Loading Portfolio</span>
          <span className="loader-dots">
            <span style={{ animationDelay: '0s' }}>.</span>
            <span style={{ animationDelay: '0.2s' }}>.</span>
            <span style={{ animationDelay: '0.4s' }}>.</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="loader-progress-track">
          <div className="loader-progress-bar" />
        </div>
      </div>
    </div>
  );
}
