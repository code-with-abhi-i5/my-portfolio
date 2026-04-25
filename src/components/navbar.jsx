import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { id: 'home',     num: '01', label: 'Home' },
  { id: 'about',    num: '02', label: 'About' },
  { id: 'projects', num: '03', label: 'Projects' },
  { id: 'contact',  num: '04', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active,   setActive]   = useState('home');
  const [open,     setOpen]     = useState(false);
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
    const onResize = () => { if (window.innerWidth > 900) setOpen(false); };
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
        <span className="navbar-logo" onClick={() => go('home')}>AB.</span>

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
              <span
                className={`nav-link${active === id ? ' active' : ''}`}
                onClick={() => go(id)}
              >
                <span className="nav-num">{num}.</span>
                {label}
              </span>
            </li>
          ))}
          <li>
            <button
              onClick={toggleTheme}
              className="ml-1 mr-1 p-2 rounded-full hover:bg-gray-500/20 transition-all duration-300 flex items-center justify-center text-[var(--text-primary)]"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
          </li>
          <li>
            <span className="nav-cta" onClick={() => go('contact')}>Hire Me</span>
          </li>
        </ul>
      </div>
    </nav>
  );
}