import { useEffect } from 'react';
import './App.css';
import Navbar from './components/navbar.jsx';
import Hero from './components/hero.jsx';
import About from './components/about.jsx';
import Projects from './components/project.jsx';
import Contact from './components/contact.jsx';
import CursorGlow from './components/CursorGlow.jsx';

function App() {
  useEffect(() => {
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
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <CursorGlow />

      <Navbar />

      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="projects">
          <Projects />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>

      <footer>
        <div className="container">
          <span className="footer-brand">Abhijeet Ghosh</span>
          <p className="footer-copy">
            Built with <span>♥</span> by Abhijeet &mdash; {new Date().getFullYear()}
          </p>
          <p className="footer-copy"><span>// </span>React + Vite</p>
        </div>
      </footer>
    </>
  );
}

export default App;