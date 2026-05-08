import { useState, useEffect } from 'react';
import resumePdf from '../assets/Abhijeet Ghosh.pdf';
import Magnetic from './Magnetic.jsx';

const NAV_ITEMS = [
  { id: 'home', num: '01', label: 'Home' },
  { id: 'about', num: '02', label: 'About' },
  { id: 'projects', num: '03', label: 'Projects' },
  { id: 'contact', num: '04', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    setIsDarkMode(!document.documentElement.classList.contains('light'));
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
      }
      return next;
    });
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      ['home', 'about', 'projects', 'contact'].forEach((id) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 130) setActive(id);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-inner">
        <div className="navbar-logo-container" onClick={() => go('home')}>
          <Magnetic strength={0.2}>
            <div className="signature-wrapper">
              <span className="signature-logo">Abhijeet.</span>
              <svg className="signature-underline" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 10 Q 50 20 100 5" fill="none" stroke="url(#sig-grad)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="sig-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </Magnetic>
        </div>
        <button
          className={`hamburger${open ? ' open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <ul className={`navbar-links${open ? ' open' : ''}`}>
          {NAV_ITEMS.map(({ id, num, label }) => (
            <li key={id}>
              <Magnetic strength={0.4}>
                <span
                  className={`nav-link${active === id ? ' active' : ''}`}
                  onClick={() => go(id)}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <span className="nav-num">{num}.</span>
                  {label}
                </span>
              </Magnetic>
            </li>
          ))}
          <li>
            <Magnetic strength={0.5}>
              <button
                onClick={toggleTheme}
                className="theme-toggle-btn"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>
            </Magnetic>
          </li>
          <li>
            <Magnetic strength={0.3}>
              <a href={resumePdf} target="_blank" rel="noopener noreferrer" className="nav-cta" style={{ textDecoration: 'none' }}>Resume</a>
            </Magnetic>
          </li>
        </ul>
      </div>
    </nav>
  );
}