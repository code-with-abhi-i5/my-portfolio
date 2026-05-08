import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Loader.css';

export default function Loader({ onFinish }) {
  useGSAP(() => {
    // Failsafe: if animation hangs, finish anyway
    const failsafe = setTimeout(() => {
      onFinish?.();
    }, 6000);

    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(failsafe);
        onFinish?.();
      }
    });

    // 1. Initial State
    gsap.set('.loader-letter', { opacity: 0, y: 30 });
    gsap.set(['.loader-status', '.loader-progress-track'], { opacity: 0 });
    gsap.set('.loader-blob', { opacity: 0, scale: 0.5 });
    gsap.set('.loader-logo', { opacity: 0, scale: 0.3, rotate: -20 });
    gsap.set('.loader-progress-bar', { width: '0%' });

    // 2. Orchestrated Animation
    tl.to('.loader-blob', {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power3.out'
    })
    .to('.loader-logo', {
      opacity: 1,
      scale: 1,
      rotate: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.6')
    .to('.loader-letter', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.04,
      ease: 'power2.out'
    }, '-=0.4')
    .to(['.loader-status', '.loader-progress-track'], {
      opacity: 1,
      duration: 0.4,
      stagger: 0.1
    }, '-=0.2')
    .to('.loader-progress-bar', {
      width: '100%',
      duration: 2,
      ease: 'power1.inOut'
    }, '-=0.4')
    .to('.loader-overlay', {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    }, '+=0.3');

    return () => clearTimeout(failsafe);
  }, [onFinish]);

  return (
    <div className="loader-overlay">
      {/* Background blobs */}
      <div className="loader-blob loader-blob-1" />
      <div className="loader-blob loader-blob-2" />
      <div className="loader-blob loader-blob-3" />

      {/* Center content */}
      <div className="loader-content">
        {/* Logo */}
        <div className="loader-logo">
          <div className="loader-logo-glow" />
          <div className="loader-logo-text-container">
            <svg viewBox="0 0 100 100" className="loader-atom">
              <defs>
                <linearGradient id="atom-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="atom-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00ff94" />
                  <stop offset="100%" stopColor="#00d4ff" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="12" className="atom-core" />
              <ellipse cx="50" cy="50" rx="42" ry="14" className="atom-orbit orbit-1" stroke="url(#atom-grad-1)" />
              <ellipse cx="50" cy="50" rx="42" ry="14" className="atom-orbit orbit-2" stroke="url(#atom-grad-2)" />
              <ellipse cx="50" cy="50" rx="42" ry="14" className="atom-orbit orbit-3" stroke="url(#atom-grad-1)" />
            </svg>
          </div>
          <div className="loader-logo-ring outer-ring" />
          <div className="loader-logo-ring inner-ring" />
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
