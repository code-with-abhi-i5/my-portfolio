import { useEffect, useRef } from 'react';

const SKILLS = [
  {
    cat: 'Frontend',
    skills: [
      { n: 'React', i: '⚛️' }, { n: 'TypeScript', i: '🔷' },
      { n: 'JavaScript', i: '🌟' }, { n: 'HTML5', i: '🧱' },
      { n: 'CSS3', i: '🎨' }, { n: 'Vite', i: '⚡' }, { n: 'Tailwind', i: '💨' },
    ],
  },
  {
    cat: 'Data & Backend',
    skills: [
      { n: 'Python', i: '🐍' }, { n: 'Pandas', i: '📊' },
      { n: 'SQL', i: '🗄️' }, { n: 'Node.js', i: '🟢' },
      { n: 'REST APIs', i: '🔗' }, { n: 'Axios', i: '📡' },
    ],
  },
  {
    cat: 'Tools',
    skills: [
      { n: 'Git', i: '🌿' }, { n: 'GitHub', i: '🐙' },
      { n: 'VS Code', i: '💻' }, { n: 'Figma', i: '🎭' }, { n: 'Linux', i: '🐧' },
    ],
  },
];

const PROFS = [
  { n: 'React / TypeScript', p: 90 },
  { n: 'Data Analysis', p: 82 },
  { n: 'CSS / UI Design', p: 88 },
  { n: 'Python', p: 78 },
  { n: 'APIs & Integration', p: 85 },
];

const INFO = [
  { l: 'Name', v: 'Abhijeet Bhosale' },
  { l: 'Role', v: 'Frontend Developer' },
  { l: 'Location', v: 'India 🇮🇳' },
  { l: 'Status', v: '✅ Open to Work' },
];

export default function About() {
  const bars = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('animated'); }),
      { threshold: 0.3 }
    );
    bars.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="container">
      <div className="section-header reveal">
        <p className="section-label">Who I Am</p>
        <h2 className="section-title">About <span>Me</span></h2>
      </div>

      <div className="about-grid">

        {/* Left: Bio */}
        <div>
          <p className="about-text reveal">
            I&apos;m a <strong>Frontend Developer &amp; UI/UX Designer</strong> with a passion
            for creating seamless digital experiences. I specialize in building scalable
            React apps with TypeScript and transforming raw data into meaningful insights.
          </p>

          <p className="about-quote reveal reveal-delay-1">
            &ldquo;Great software lives at the intersection of clean code, thoughtful
            design, and data-driven decisions.&rdquo;
          </p>

          <p className="about-text reveal reveal-delay-2">
            When I&apos;m not pushing pixels or wrangling datasets, I&apos;m exploring
            open-source projects and staying up-to-date with the latest in the React ecosystem.
          </p>

          <div className="info-grid">
            {INFO.map(({ l, v }) => (
              <div className="info-item reveal reveal-delay-3" key={l}>
                <div className="info-label">{l}</div>
                <div className="info-value">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Skills */}
        <div>
          {SKILLS.map(({ cat, skills }, si) => (
            <div className={`skill-category reveal reveal-delay-${si + 1}`} key={cat}>
              <div className="skill-cat-label">// {cat}</div>
              <div className="skill-tags">
                {skills.map(({ n, i }) => (
                  <span className="skill-tag" key={n}>
                    <span>{i}</span>{n}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="reveal reveal-delay-4">
            <div className="proficiency-label">// Proficiency</div>
            {PROFS.map(({ n, p }, i) => (
              <div className="prof-item" key={n}>
                <div className="prof-header">
                  <span>{n}</span>
                  <span className="prof-percent">{p}%</span>
                </div>
                <div className="bar-bg">
                  <div
                    className="bar-fill"
                    style={{ width: `${p}%` }}
                    ref={(el) => (bars.current[i] = el)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}