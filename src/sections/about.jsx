import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../ui/Magnetic.jsx';
import Terminal from '../ui/Terminal.jsx';

import './about.css';

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  {
    cat: 'Frontend',
    icon: '💻',
    skills: [
      { n: 'React', i: '⚛️' },
      { n: 'JavaScript', i: '🌟' },
      { n: 'HTML5', i: '🧱' },
      { n: 'CSS3', i: '🎨' },
      { n: 'Tailwind CSS', i: '💨' },
      { n: 'Three.js', i: '🔮' },
      { n: 'Vite', i: '⚡' }
    ],
  },
  {
    cat: 'Data & Backend',
    icon: '⚙️',
    skills: [
      { n: 'Python', i: '🐍' },
      { n: 'SQL', i: '🗄️' },
      { n: 'REST APIs', i: '🔗' },
      { n: 'Axios', i: '📡' },
    ],
  },
  {
    cat: 'Tools',
    icon: '🛠️',
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
  const containerRef = useRef(null);
  const barsRef = useRef([]);

  useGSAP(() => {
    // 1. Skill Tags Pop Animation with Float
    gsap.utils.toArray('.skill-category').forEach((cat) => {
      gsap.fromTo(cat.querySelectorAll('.skill-tag'), 
        {
          opacity: 0,
          scale: 0.8,
          y: 20,
          rotate: -5
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotate: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'elastic.out(1, 0.8)',
          scrollTrigger: {
            trigger: cat,
            start: 'top 88%',
          }
        }
      );
    });

    // 2. Proficiency Bars Animation (Smoother)
    PROFS.forEach((prof, i) => {
      const bar = barsRef.current[i];
      if (!bar) return;

      gsap.fromTo(bar, 
        { width: '0%', opacity: 0 },
        {
          width: `${prof.p}%`,
          opacity: 1,
          duration: 2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 95%',
          }
        }
      );
    });

    // 3. Advanced 3D Tilt for Skills Section
    const skillsSection = containerRef.current.querySelector('.about-grid > div:last-child');
    if (skillsSection) {
      const xTo = gsap.quickTo(skillsSection, 'rotateY', { duration: 0.4, ease: 'power2.out' });
      const yTo = gsap.quickTo(skillsSection, 'rotateX', { duration: 0.4, ease: 'power2.out' });

      skillsSection.style.perspective = '1000px';

      const handleMove = (e) => {
        const rect = skillsSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = (x / rect.width - 0.5) * 8;
        const yPercent = (y / rect.height - 0.5) * -8;

        xTo(xPercent);
        yTo(yPercent);
      };

      const handleLeave = () => {
        xTo(0);
        yTo(0);
      };

      skillsSection.addEventListener('mousemove', handleMove);
      skillsSection.addEventListener('mouseleave', handleLeave);
    }

    // 4. Bio Text Reveal
    gsap.from('.about-text', {
      opacity: 0,
      y: 30,
      stagger: 0.3,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-text',
        start: 'top 90%',
      }
    });

    // 5. Ghost Icons Float Animation
    ['react', 'js', 'three', 'python'].forEach((icon) => {
      gsap.to(`.ghost-${icon}`, {
        y: '+=25',
        x: '+=15',
        rotate: '+=10',
        duration: 4 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });

  }, { scope: containerRef });

  const Keyword = ({ children, icon }) => {
    const onEnter = () => {
      gsap.to(`.ghost-${icon}`, {
        opacity: 0.15,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out'
      });
    };
    const onLeave = () => {
      gsap.to(`.ghost-${icon}`, {
        opacity: 0,
        scale: 0.3,
        filter: 'blur(10px)',
        duration: 0.6,
        ease: 'power3.in'
      });
    };
    return (
      <Magnetic strength={0.2}>
        <span className="keyword-highlight" onMouseEnter={onEnter} onMouseLeave={onLeave}>
          {children}
        </span>
      </Magnetic>
    );
  };

  return (
    <div className="container" ref={containerRef}>
      <div className="section-header">
        <p className="section-label">Who I Am</p>
        <h2 className="section-title">About <span>Me</span></h2>
      </div>

      <div className="about-grid">
        {/* Background Visuals */}
        <div className="about-visuals">
          <div className="ghost-icon ghost-react" style={{ top: '10%', right: '10%' }}>⚛️</div>
          <div className="ghost-icon ghost-js" style={{ bottom: '10%', left: '10%' }}>🌟</div>
          <div className="ghost-icon ghost-three" style={{ top: '40%', left: '30%' }}>🔮</div>
          <div className="ghost-icon ghost-python" style={{ bottom: '20%', right: '20%' }}>🐍</div>
        </div>

        {/* Left: Bio */}
        <div>
          <p className="about-text">
            I&apos;m a <strong>Frontend Developer</strong> with a passion for building clean,
            interactive web experiences. I work with <Keyword icon="react">React</Keyword>, <Keyword icon="js">JavaScript</Keyword>, and <Keyword icon="three">Three.js</Keyword> to craft
            fast, visually engaging interfaces — backed by <Keyword icon="python">Python</Keyword> and SQL on the data side.
          </p>

          <p className="about-quote">
            &ldquo;Code is craft. I write it to be readable, scalable, and worth shipping.&rdquo;
          </p>

          <p className="about-text">
            When I&apos;m not building projects, I&apos;m exploring open-source repos, experimenting
            with 3D animations, and staying current with the frontend ecosystem.
          </p>

          <div className="info-grid">
            {INFO.map(({ l, v }) => (
              <div className="info-item" key={l}>
                <div className="info-label">{l}</div>
                <div className="info-value">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Skills */}
        <div>
          {SKILLS.map(({ cat, icon, skills }) => (
            <div className="skill-category" key={cat}>
              <div className="skill-cat-label">{icon} {cat}</div>
              <div className="skill-tags">
                {skills.map(({ n, i }) => (
                  <span className="skill-tag" key={n}>
                    {i} {n}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="proficiency-section">
            <div className="proficiency-label">📈 Proficiency</div>
            {PROFS.map(({ n, p }, i) => (
              <div className="prof-item" key={n}>
                <div className="prof-header">
                  <span>{n}</span>
                  <span className="prof-percent">{p}%</span>
                </div>
                <div className="bar-bg">
                  <div
                    className="bar-fill"
                    ref={(el) => (barsRef.current[i] = el)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Terminal Section */}
      <div className="reveal" style={{ marginTop: '48px' }}>
        <Terminal />
      </div>
    </div>
  );
}