import { useState, useEffect } from 'react';

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
            <button className="btn-outline" onClick={() => go('contact')}>
              Hire Me
            </button>
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

            <div className="avatar-img">
              {/* 
                Apni photo lagani ho toh:
                1. Photo public/ folder mein rakho (e.g. public/photo.jpg)
                2. Neeche ki line uncomment karo aur span hatao
              */}
              {/* <img src="/photo.jpg" alt="Abhijeet" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> */}
              <span className="avatar-initials">AB</span>
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