import { useEffect, useRef } from 'react';

const SKILLS = [
  {
    cat: 'Frontend',
    skills: [
      { n: 'React', i: '⚛️' },
      { n: 'JavaScript', i: '🌟' },
      { n: 'HTML5', i: '🧱' },
      { n: 'CSS3', i: '🎨' },
      { n: 'Tailwind CSS', i: '💨' },
      { n: 'Three.js', i: '🔮' },
      { n: 'Vite', i: '⚡' },

    ],
  },
  {
    cat: 'Data & Backend',
    skills: [
      { n: 'Python', i: '🐍' },
      { n: 'SQL', i: '🗄️' },
      { n: 'REST APIs', i: '🔗' },
      { n: 'Axios', i: '📡' },
    ],
  },
  {
    cat: 'Tools',
    skills: [
      { n: 'Git', i: '🌿' },
      { n: 'GitHub', i: '🐙' },
      { n: 'VS Code', i: '💻' },
      { n: 'Cursor AI', i: '🤖' },
      { n: 'Figma', i: '🎭' },
      { n: 'Firebase', i: '🔥' },
      { n: 'Netlify', i: '🌐' },
      { n: 'Wordpress', i: '🌐' },

    ],
  },
];

const PROFS = [
  { n: 'React / JavaScript', p: 85 },
  { n: 'CSS / UI Design', p: 88 },
  { n: 'Three.js', p: 72 },
  { n: 'Python', p: 65 },
  { n: 'APIs & Integration', p: 80 },
];

const INFO = [
  { l: 'Name', v: 'Abhijeet Ghosh' },
  { l: 'Role', v: 'Frontend Developer' },
  { l: 'Location', v: 'Jamshedpur, Jharkhand 🇮🇳' },
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
            I&apos;m a <strong>Frontend Developer</strong> with a passion for building clean,
            interactive web experiences. I work with React, JavaScript, and Three.js to craft
            fast, visually engaging interfaces — backed by Python and SQL on the data side.
          </p>

          <p className="about-quote reveal reveal-delay-1">
            &ldquo;Code is craft. I write it to be readable, scalable, and worth shipping.&rdquo;
          </p>

          <p className="about-text reveal reveal-delay-2">
            When I&apos;m not building projects, I&apos;m exploring open-source repos, experimenting
            with 3D animations, and staying current with the frontend ecosystem.
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
            <div className="proficiency-label"> Proficiency</div>
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