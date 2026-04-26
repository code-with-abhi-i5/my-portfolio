import { useState, useEffect, useRef } from 'react';

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

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const gridRef = useRef(null);

  // Fetch repos from GitHub
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

        // Fetch all languages for each repo using token
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

  // Re-observe .reveal elements after cards are rendered
  // (App.jsx's observer runs once on mount, before API data loads)
  useEffect(() => {
    if (loading || error || projects.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const container = gridRef.current;
    if (container) {
      container.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, [loading, error, projects]);

  return (
    <div className="container">
      <div className="section-header reveal">
        <p className="section-label">What I&apos;ve Built</p>
        <h2 className="section-title">Selected <span>Projects</span></h2>
      </div>

      {/* Loading State */}
      {loading && (
        <p style={{ textAlign: 'center', color: 'var(--accent, #00f0ff)', padding: '3rem 0', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
          Loading projects...
        </p>
      )}

      {/* Error State */}
      {error && (
        <p style={{ textAlign: 'center', color: '#ff6b6b', padding: '3rem 0', fontSize: '1rem' }}>
          Failed to load projects — {error}
        </p>
      )}

      {/* Grid */}
      {!loading && !error && (
        <div className="projects-grid" ref={gridRef}>
          {projects.map((repo, i) => (
            <div
              key={repo.id}
              className={`project-card reveal reveal-delay-${(i % 4) + 1}${i < 2 ? ' featured' : ''}`}
            >
              {i < 2 && <span className="feat-badge">★ Featured</span>}

              <div className="card-header">
                <div className="card-icon">📂</div>
                <div className="card-links">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="card-link" title="GitHub">
                    <GHIcon />
                  </a>
                  {repo.homepage && (
                    <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="card-link" title="Live Demo">
                      <ExtIcon />
                    </a>
                  )}
                </div>
              </div>

              <div className="card-number">
                {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </div>

              <h3 className="card-title">{repo.name}</h3>
              <p className="card-desc">{repo.description || 'No description provided.'}</p>

              <div className="card-stack">
                {(repo.allLanguages || []).map((lang) => (
                  <span className="stack-tag" key={lang}>{lang}</span>
                ))}
                {repo.stargazers_count > 0 && (
                  <span className="stack-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <StarIcon /> {repo.stargazers_count}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="projects-footer reveal">
        <p>More projects on GitHub</p>
        <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer" className="btn-outline">
          <GHIcon /> View GitHub Profile
        </a>
      </div>
    </div>
  );
}