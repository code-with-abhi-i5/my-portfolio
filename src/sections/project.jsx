import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../ui/Magnetic.jsx';

import './project.css';

gsap.registerPlugin(ScrollTrigger);

const GITHUB_API = 'https://api.github.com/users/code-with-abhi-i5/repos?per_page=100&type=all';
const GITHUB_PROFILE = 'https://github.com/code-with-abhi-i5';

const GHIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const ExtIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15,3 21,3 21,9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);


function ProjectCard({ repo, index }) {
  const cardRef = useRef(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    // Advanced 3D Tilt with quickTo
    const xTo = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power3.out' });

    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);

      const xPercent = (x / rect.width - 0.5) * 15;
      const yPercent = (y / rect.height - 0.5) * -15;

      xTo(xPercent);
      yTo(yPercent);
    };

    const handleLeave = () => {
      xTo(0);
      yTo(0);
    };

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);

    // Perspective Scroll Effect
    gsap.fromTo(card, 
      { rotateX: 15, y: 50, opacity: 0 },
      {
        rotateX: 0,
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          end: 'top center',
          scrub: 1
        }
      }
    );

    return () => {
      card.removeEventListener('mousemove', handleMove);
      card.removeEventListener('mouseleave', handleLeave);
    };
  }, { scope: cardRef });

  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('react')) return '⚛️';
    if (n.includes('node')) return '🚀';
    if (n.includes('web')) return '🌐';
    if (n.includes('app')) return '📱';
    if (n.includes('design')) return '🎨';
    return '📂';
  };

  return (
    <div
      ref={cardRef}
      className={`project-card ${index < 2 ? 'featured' : ''}`}
    >
      <div className="project-card-border" />
      {index < 2 && <span className="feat-badge">Featured Project</span>}

      <div className="card-header">
        <div className="card-icon-wrapper">
          {getIcon(repo.name)}
        </div>
        <div className="card-links">
          <Magnetic strength={0.1}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="card-link" title="GitHub">
              <GHIcon />
            </a>
          </Magnetic>
          {repo.homepage && (
            <Magnetic strength={0.1}>
              <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="card-link" title="Live Demo">
                <ExtIcon />
              </a>
            </Magnetic>
          )}
        </div>
      </div>

      <div className="card-content">
        <span className="card-number">Project {String(index + 1).padStart(2, '0')}</span>
        <h3 className="card-title">{repo.name.replace(/-/g, ' ')}</h3>
        <p className="card-desc">{repo.description || 'A premium web application built with modern technologies and best practices.'}</p>
      </div>

      <div className="card-stack">
        {(repo.allLanguages || []).slice(0, 3).map((lang) => (
          <span className="stack-tag" key={lang}>{lang}</span>
        ))}
        {repo.stargazers_count > 0 && (
          <span className="stack-tag">⭐ {repo.stargazers_count}</span>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchRepos() {
      try {
        const headers = {
          Authorization: `token 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`,
        };
        const res = await fetch(GITHUB_API, { headers });
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        const data = await res.json();

        const topRepos = data
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 8);

        const reposWithLangs = await Promise.all(
          topRepos.map(async (repo) => {
            try {
              const langRes = await fetch(repo.languages_url, { headers });
              const langData = langRes.ok ? await langRes.json() : {};
              return { ...repo, allLanguages: Object.keys(langData) };
            } catch {
              return { ...repo, allLanguages: repo.language ? [repo.language] : [] };
            }
          })
        );

        if (!cancelled) {
          setProjects(reposWithLangs);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }
    fetchRepos();
    return () => { cancelled = true; };
  }, []);

  useGSAP(() => {
    if (loading || projects.length === 0) return;

    gsap.from('.project-card', {
      opacity: 0,
      y: 60,
      skewY: 5,
      scale: 0.9,
      duration: 1,
      stagger: {
        each: 0.15,
        grid: 'auto',
        from: 'start'
      },
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 85%',
      }
    });

    gsap.from('.projects-footer', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.projects-footer',
        start: 'top 90%',
      }
    });
  }, [loading, projects]);

  return (
    <div className="container" ref={containerRef}>
      <div className="section-header">
        <p className="section-label">What I&apos;ve Built</p>
        <h2 className="section-title">Selected <span>Projects</span></h2>
      </div>

      {loading && (
        <p style={{ textAlign: 'center', color: 'var(--cyan)', padding: '3rem 0' }}>
          Loading projects...
        </p>
      )}

      {error && (
        <p style={{ textAlign: 'center', color: '#ff6b6b', padding: '3rem 0' }}>
          Failed to load projects — {error}
        </p>
      )}

      {!loading && !error && (
        <div className="projects-grid">
          {projects.map((repo, i) => (
            <ProjectCard key={repo.id} repo={repo} index={i} />
          ))}
        </div>
      )}

      <div className="projects-footer">
        <p>More projects on GitHub</p>
        <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer" className="btn-outline">
          <GHIcon /> View GitHub Profile
        </a>
      </div>
    </div>
  );
}