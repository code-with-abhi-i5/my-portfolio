import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../ui/Magnetic.jsx';
import './Education.css';

gsap.registerPlugin(ScrollTrigger);

const EDU_DATA = [
  {
    id: 1,
    degree: 'Computer Science & Engineering (B.Tech)',
    institution: 'R.V.S.C.E.T. Jamshedpur',
    duration: '2025 - 2029',
    year: '2029',
    status: 'Pursuing',
    desc: 'Focusing on Software Engineering, Data Analytics, and Web Development. Building a strong foundation in modern tech stacks.',
  },
  {
    id: 2,
    degree: '12th Intermediate (Science)',
    institution: '+2 High School, Baharagora',
    duration: '2023 - 2025',
    year: '2025',
    status: 'Completed',
    desc: 'Science stream with a core focus on Mathematics and Computer Science, establishing analytical and programming fundamentals.',
  },
  {
    id: 3,
    degree: 'Secondary School (10th)',
    institution: 'K.B. High School, Gamaria',
    duration: 'Completed in 2023',
    year: '2023',
    status: 'Completed',
    desc: 'Successfully completed early education with a strong academic record, developing a keen interest in technology and problem-solving.',
  }
];

export default function Education() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // 1. Vertical Line Drawing with Glow
    gsap.fromTo('.timeline-line', 
      { height: 0, opacity: 0 },
      {
        height: '100%',
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-wrapper',
          start: 'top 75%',
          end: 'bottom 75%',
          scrub: 1,
        }
      }
    );

    // 2. Parallax Years & Card Reveal
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      const card = item.querySelector('.timeline-content');
      const year = item.querySelector('.bg-year');

      // 3D Card Entrance
      gsap.fromTo(card, 
        { rotateX: -15, scale: 0.85, opacity: 0, y: 50 },
        {
          rotateX: 0,
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          }
        }
      );

      // Parallax Background Year
      gsap.to(year, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

  }, { scope: containerRef });

  return (
    <div className="education-container" ref={containerRef}>
      <div className="section-header">
        <h2 className="section-title">
          Education <span className="title-highlight">& Journey</span>
        </h2>
        <div className="title-line" />
      </div>

      <div className="timeline-wrapper">
        <div className="timeline-line" />

        {EDU_DATA.map((item) => (
          <div key={item.id} className="timeline-item">
            <div className="bg-year">{item.year}</div>
            
            <Magnetic strength={0.4}>
              <div className="timeline-dot">
                <span className="dot-inner" />
              </div>
            </Magnetic>

            <div className="timeline-content">
              <div className="edu-header">
                <h3 className="edu-degree">{item.degree}</h3>
                <span className={`edu-status ${item.status === 'Pursuing' ? 'active' : ''}`}>
                  {item.status}
                </span>
              </div>

              <h4 className="edu-institution">{item.institution}</h4>

              <div className="edu-duration">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {item.duration}
              </div>

              <p className="edu-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}