import { useEffect, useState, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';
import Navbar from './ui/navbar.jsx';
import Hero from './sections/hero.jsx';
import About from './sections/about.jsx';
import Education from './sections/Education.jsx';
import Projects from './sections/project.jsx';
import Contact from './sections/contact.jsx';
import CursorGlow from './cursors/ParticlesCursor.jsx';
import VoiceChatbot from './ui/VoiceChatbot.jsx';
import Loader from './ui/Loader.jsx';
import ScrollProgress from './ui/ScrollProgress.jsx';
import BackToTop from './ui/BackToTop.jsx';
import ParticleBackground from './3d/ParticleBackground.jsx';

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoaderFinish = useCallback(() => {
    setLoading(false);
  }, []);

  useGSAP(() => {
    if (loading) return;
    gsap.registerPlugin(ScrollTrigger);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return <Loader onFinish={handleLoaderFinish} />;
  }

  return (
    <>
      <ParticleBackground />
      <ScrollProgress />
      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      
      <CursorGlow />
      <VoiceChatbot />
      <BackToTop />

      <Navbar />

      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="education">
          <Education />
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
