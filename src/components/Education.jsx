import './Education.css';

const EDU_DATA = [
  {
    id: 1,
    degree: 'B.Tech in Computer Science',
    institution: 'Your University Name',
    duration: '2023 - 2027',
    status: 'Pursuing',
    desc: 'Focusing on Frontend Development, Data Analytics, and Software Engineering principles. Active in technical clubs and building real-world projects.',
  },
  {
    id: 2,
    degree: 'Higher Secondary (12th)',
    institution: 'Your School Name',
    duration: '2021 - 2023',
    status: 'Completed',
    desc: 'Science stream with core focus on Mathematics and Computer Science. Built foundational programming skills.',
  }
];

export default function Education() {
  return (
    <div className="education-container">
      <div className="section-header reveal">
        <h2 className="section-title">
          Education <span className="title-highlight">& Journey</span>
        </h2>
        <div className="title-line" />
      </div>

      <div className="timeline-wrapper">
        <div className="timeline-line reveal" />

        {EDU_DATA.map((item, i) => (
          <div key={item.id} className="timeline-item reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
            <div className="timeline-dot">
              <span className="dot-inner" />
            </div>

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