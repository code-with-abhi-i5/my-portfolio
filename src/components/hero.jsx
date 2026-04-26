import { useState, useEffect } from 'react';
import AvatarWithEffect from './AvatarWithEffect.jsx';

const ROLES = [
  'Frontend Developer',
  'Data Analyst',
  'UI Enthusiast',
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

const STATS = [
  { n: '15+', l: 'Projects' },
  { n: '3+', l: 'Years Coding' },
  { n: '10+', l: 'Technologies' },
];

export default function Hero() {
  const typed = useTyping(ROLES);
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="hero">
      <div className="hero-container">

        {/* Left: Content */}
        <div>
          <div className="hero-eyebrow fade-in">
            <span className="status-dot" />
            Available for opportunities
          </div>

          <h1 className="hero-name fade-in-2">
            <span className="first">Abhijeet</span>
            <span className="last">Ghosh</span>
          </h1>

          <div className="hero-typing-wrap fade-in-3">
            <span className="hero-typing-prefix">{'>'}_</span>
            <span className="hero-typing-text">
              {typed}<span className="hero-cursor" />
            </span>
          </div>

          <p className="hero-bio fade-in-3">
            Crafting <strong>high-performance</strong> web experiences and turning{' '}
            <strong>complex data</strong> into elegant frontends. Passionate about
            clean code, beautiful UI, and scalable architecture.
          </p>

          <div className="hero-actions fade-in-4">
            <button className="btn-primary" onClick={() => go('projects')}>
              View Projects
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-resume">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <polyline points="9 15 12 18 15 15"></polyline>
              </svg>
              Resume
            </a>
          </div>

          <div className="hero-stats fade-in-5">
            {STATS.map((s) => (
              <div key={s.l}>
                <div className="stat-number">{s.n}</div>
                <div className="stat-label">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Avatar */}
        <div className="hero-visual fade-in-3">
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
              <span className="badge-dot" />Data Analytics
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