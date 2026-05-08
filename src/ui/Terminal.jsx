import { useState, useEffect, useRef } from 'react';
import './Terminal.css';

const LOG_MESSAGES = [
  { type: 'info', text: '> Initializing portfolio_v2.0.0...' },
  { type: 'success', text: '> System check: OK' },
  { type: 'info', text: '> Loading core modules: React, GSAP, Three.js' },
  { type: 'success', text: '> Module injection successful.' },
  { type: 'info', text: '> Fetching developer metadata...' },
  { type: 'data', text: '  { name: "Abhijeet Ghosh", role: "Frontend Developer" }' },
  { type: 'info', text: '> Scanning proficiency levels...' },
  { type: 'success', text: '> React: 85% | JavaScript: 90% | CSS: 88%' },
  { type: 'info', text: '> Synchronizing GitHub repositories...' },
  { type: 'warn', text: '> API request sent. Waiting for response...' },
  { type: 'success', text: '> 15+ Projects identified and loaded.' },
  { type: 'info', text: '> Compiling academic journey...' },
  { type: 'success', text: '> Status: Open to opportunities.' },
  { type: 'info', text: '> System idle. Awaiting user interaction...' }
];

export default function Terminal() {
  const [logs, setLogs] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (currentIdx < LOG_MESSAGES.length) {
      const timeout = setTimeout(() => {
        setLogs(prev => [...prev, LOG_MESSAGES[currentIdx]]);
        setCurrentIdx(prev => prev + 1);
      }, Math.random() * 800 + 400); // Random typing speed
      return () => clearTimeout(timeout);
    }
  }, [currentIdx]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="terminal-title">system_logs — bash</div>
      </div>
      <div className="terminal-body" ref={scrollRef}>
        {logs.map((log, i) => (
          <div key={i} className={`terminal-line ${log.type}`}>
            {log.text}
          </div>
        ))}
        {currentIdx < LOG_MESSAGES.length && (
          <div className="terminal-cursor">_</div>
        )}
      </div>
    </div>
  );
}
