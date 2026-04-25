import { useState } from 'react';

const PROJECTS = [
  {
    id: 1, title: 'Smart Campus Portal',
    desc: 'Full-featured campus management frontend with React & TypeScript, centralized error handling, role-based auth, and real-time API integration.',
    icon: '🏛️', stack: ['React', 'TypeScript', 'Axios', 'Vite'],
    github: 'https://github.com/abhijeet', live: null, cat: 'React', feat: true,
  },
  {
    id: 2, title: 'Foodie — Restaurant App',
    desc: 'Responsive restaurant discovery app with mobile-first design, glassmorphism UI, dynamic menus, and smooth CSS animations.',
    icon: '🍜', stack: ['HTML5', 'CSS3', 'JavaScript'],
    github: 'https://github.com/abhijeet', live: null, cat: 'Web', feat: true,
  },
  {
    id: 3, title: 'Data Analytics Dashboard',
    desc: 'Interactive visualization dashboard powered by Python and Pandas. Raw datasets transformed into meaningful charts and KPI metrics.',
    icon: '📊', stack: ['Python', 'Pandas', 'Matplotlib', 'Streamlit'],
    github: 'https://github.com/abhijeet', live: null, cat: 'Data', feat: false,
  },
  {
    id: 4, title: 'DevConnect Platform',
    desc: 'Developer-focused social network with post feed, user profiles, real-time notifications, and GitHub OAuth integration.',
    icon: '🌐', stack: ['React', 'Node.js', 'REST API', 'CSS3'],
    github: 'https://github.com/abhijeet', live: null, cat: 'React', feat: false,
  },
  {
    id: 5, title: 'ML Price Predictor',
    desc: 'Machine learning model for housing price prediction with feature engineering, model tuning, and a Streamlit UI.',
    icon: '🤖', stack: ['Python', 'Scikit-learn', 'Pandas', 'Streamlit'],
    github: 'https://github.com/abhijeet', live: null, cat: 'Data', feat: false,
  },
  {
    id: 6, title: 'Portfolio v1',
    desc: 'Previous portfolio — pure HTML/CSS/JS with minimal design, CSS animations, and full mobile responsiveness.',
    icon: '🎨', stack: ['HTML5', 'CSS3', 'JavaScript'],
    github: 'https://github.com/abhijeet', live: null, cat: 'Web', feat: false,
  },
];

const FILTERS = ['All', 'React', 'Web', 'Data'];

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

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const shown = filter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.cat === filter);

  return (
    <div className="container">
      <div className="section-header reveal">
        <p className="section-label">What I&apos;ve Built</p>
        <h2 className="section-title">Selected <span>Projects</span></h2>
      </div>

      {/* Filters */}
      <div className="projects-filter reveal">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="projects-grid">
        {shown.map((p, i) => (
          <div
            key={p.id}
            className={`project-card reveal reveal-delay-${(i % 4) + 1}${p.feat ? ' featured' : ''}`}
          >
            {p.feat && <span className="feat-badge">★ Featured</span>}

            <div className="card-header">
              <div className="card-icon">{p.icon}</div>
              <div className="card-links">
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="card-link" title="GitHub">
                    <GHIcon />
                  </a>
                )}
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="card-link" title="Live Demo">
                    <ExtIcon />
                  </a>
                )}
              </div>
            </div>

            <div className="card-number">
              {String(i + 1).padStart(2, '0')} / {String(shown.length).padStart(2, '0')}
            </div>

            <h3 className="card-title">{p.title}</h3>
            <p className="card-desc">{p.desc}</p>

            <div className="card-stack">
              {p.stack.map((t) => <span className="stack-tag" key={t}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="projects-footer reveal">
        <p>// More projects on GitHub</p>
        <a href="https://github.com/abhijeet" target="_blank" rel="noopener noreferrer" className="btn-outline">
          <GHIcon /> View GitHub Profile
        </a>
      </div>
    </div>
  );
}