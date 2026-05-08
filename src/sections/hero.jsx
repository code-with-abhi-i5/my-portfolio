import { useState, useEffect, useRef, useMemo } from 'react';
import Magnetic from '../ui/Magnetic.jsx';
import AvatarWithEffect from '../3d/AvatarWithEffect.jsx';
import resumePdf from '../assets/Abhijeet Ghosh.pdf';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './hero.css';

gsap.registerPlugin(ScrollTrigger);

const ROLES = [
  'Frontend Developer',
  'Three.js Enthusiast',
  'Problem Solver',
];

const STATS = [
  { n: 15, l: 'Projects', suffix: '+' },
  { n: 1.5, l: 'Years Experience', suffix: '+' },
  { n: 10, l: 'Technologies', suffix: '+' },
];

function useTyping(words) {
  const [txt, setTxt] = useState('');
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index];
    let timeout;

    if (!deleting && txt === current) {
      timeout = setTimeout(() => setDeleting(true), 1900);
    } else if (deleting && txt === '') {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        setTxt((prev) =>
          deleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)
        );
      }, deleting ? 48 : 80);
    }
    return () => clearTimeout(timeout);
  }, [txt, deleting, index, words]);

  return txt;
}

export default function Hero() {
  const typed = useTyping(ROLES);
  const containerRef = useRef(null);
  const statsRef = useRef([]);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  // Memoize name letters to prevent re-renders from breaking GSAP
  const abhijeetLetters = useMemo(() => {
    return 'Abhijeet'.split('').map((char, i) => (
      <span key={`a-${i}`} className="name-letter">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  }, []);

  const ghoshLetters = useMemo(() => {
    return 'Ghosh'.split('').map((char, i) => (
      <span key={`g-${i}`} className="name-letter">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  }, []);

  useGSAP(() => {
    // 1. Coordinated Elite Entrance
    const tl = gsap.timeline();

    tl.from('.hero-eyebrow', { opacity: 0, y: -20, duration: 0.8, ease: 'power3.out' })
      .from('.name-letter', { 
        opacity: 0, 
        y: 60, 
        rotateX: -90,
        stagger: 0.04, 
        duration: 1, 
        ease: 'elastic.out(1, 0.8)' 
      }, '-=0.4')
      .from(['.hero-typing-wrap', '.hero-bio'], { 
        opacity: 0, 
        y: 20, 
        stagger: 0.2, 
        duration: 0.8, 
        ease: 'power3.out' 
      }, '-=0.6')
      .from('.hero-actions', { 
        opacity: 0, 
        scale: 0.8, 
        duration: 0.6, 
        ease: 'back.out(1.7)' 
      }, '-=0.4')
      .from('.hero-visual', { 
        opacity: 0, 
        x: 40, 
        rotateY: -20,
        duration: 1.2, 
        ease: 'power4.out' 
      }, '-=1')
      .from('.hero-stats', { 
        opacity: 0, 
        y: 20, 
        duration: 0.8, 
        ease: 'power3.out' 
      }, '-=0.8');

    // 2. 3D Mouse Parallax for Hero Visual
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5);
      const yPos = (clientY / window.innerHeight - 0.5);

      gsap.to('.avatar-wrapper', { 
        rotateY: xPos * 20, 
        rotateX: -yPos * 20, 
        duration: 1.2, 
        ease: 'power2.out' 
      });

      gsap.to('.avatar-ring', { 
        x: xPos * 40, 
        y: yPos * 40, 
        duration: 1, 
        ease: 'power1.out' 
      });

      gsap.to('.float-badge', { 
        x: (i) => (i + 1) * xPos * 30, 
        y: (i) => (i + 1) * yPos * 20, 
        duration: 1.5, 
        ease: 'power2.out',
        stagger: 0.1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 3. Smooth Stats Count-up
    statsRef.current.forEach((el, i) => {
      if (!el) return;
      const target = STATS[i].n;
      
      ScrollTrigger.create({
        trigger: el,
        start: 'top 95%',
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2.5,
            ease: 'power4.out',
            onUpdate: () => {
              el.innerText = target % 1 === 0 ? Math.floor(obj.val) : obj.val.toFixed(1);
            }
          });
        }
      });
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, { scope: containerRef });

  return (
    <div className="hero" ref={containerRef}>
      <div className="hero-container">

        {/* Left: Content */}
        <div>
          <div className="hero-eyebrow">
            <span className="status-dot" />
            Available for opportunities
          </div>

          <h1 className="hero-name">
            <span className="first">{abhijeetLetters}</span>
            <span className="last">{ghoshLetters}</span>
          </h1>

          <div className="hero-typing-wrap">
            <span className="hero-typing-prefix">{'>'}_</span>
            <span className="hero-typing-text">
              {typed}<span className="hero-cursor" />
            </span>
          </div>

          <p className="hero-bio">
            Crafting <strong>high-performance</strong> web experiences and turning{' '}
            <strong>ideas</strong> into elegant frontends. Passionate about
            clean code, beautiful UI, and scalable architecture.
          </p>

          <div className="hero-actions">
            <Magnetic strength={0.3}>
              <button className="btn-primary" onClick={() => go('projects')}>
                View Projects
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </Magnetic>
            
            <Magnetic strength={0.3}>
              <a href={resumePdf} download="Abhijeet_Ghosh_Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-resume">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <polyline points="9 15 12 18 15 15"></polyline>
                </svg>
                Resume
              </a>
            </Magnetic>
          </div>

          <div style={{ marginTop: '28px', maxWidth: '350px' }}>
            <iframe
              title="My Spotify Playlist"
              src="https://open.spotify.com/embed/playlist/6jYidIe2YU5me3aEJfUjGn?utm_source=generator&theme=0"
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="eager"
              style={{ borderRadius: '12px', display: 'block', boxShadow: '0 4px 20px rgba(0, 212, 255, 0.15)' }}
            />
            <p style={{ marginTop: '14px', fontSize: '15px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span>🎧</span> Enjoy the music while exploring my portfolio — 
              <strong style={{ 
                background: 'linear-gradient(135deg, var(--cyan), var(--neon))', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '700',
                fontStyle: 'normal',
                letterSpacing: '0.5px'
              }}>
                yahan vibe bhi hai aur skills bhi! ✨🚀
              </strong>
            </p>
          </div>

          <div className="hero-stats">
            {STATS.map((s, i) => (
              <div key={s.l}>
                <div className="stat-number">
                  <span ref={(el) => (statsRef.current[i] = el)}>0</span>
                  {s.suffix}
                </div>
                <div className="stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Avatar */}
        <div className="hero-visual">
          <div className="avatar-wrapper">
            <div className="avatar-ring" />
            <div className="avatar-ring avatar-ring-2" />

            <div className="avatar-img" style={{ padding: 0, overflow: 'hidden', border: 'none', background: 'transparent' }}>
              <AvatarWithEffect />
            </div>

            <div className="float-badge float-badge-1">
              <span className="badge-dot" />React &amp; TypeScript
            </div>
            <div className="float-badge float-badge-2">
              <span className="badge-dot" />Frontend Architecture
            </div>
            <div className="float-badge float-badge-3">
              <span className="badge-dot" />Open to Work
            </div>
          </div>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <span className="scroll-label">Scroll</span>
        <div className="scroll-line" />
      </div>
    </div>
  );
}