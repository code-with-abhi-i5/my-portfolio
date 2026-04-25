import { useState } from 'react';

const GHIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LIIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22,2 15,22 11,13 2,9" />
  </svg>
);

const INIT = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form,   setForm]   = useState(INIT);
  const [status, setStatus] = useState(null);
  const [load,   setLoad]   = useState(false);

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoad(true); setStatus(null);
    // Replace with your real API / EmailJS / Formspree call
    await new Promise((r) => setTimeout(r, 1500));
    setStatus('success');
    setForm(INIT);
    setLoad(false);
  };

  return (
    <div className="container">
      <div className="section-header reveal">
        <p className="section-label">Get In Touch</p>
        <h2 className="section-title">Let&apos;s <span>Connect</span></h2>
      </div>

      <div className="contact-grid">

        {/* Left: Info */}
        <div>
          <p className="contact-tagline reveal">
            I&apos;m actively looking for <strong>new opportunities</strong>. Whether you
            have a project in mind, a role to fill, or just want to say hello — my inbox
            is always open.
          </p>

          <div className="contact-details">
            {[
              { ico: '📧', lbl: 'Email',    val: 'abhijeet@email.com',  href: 'mailto:abhijeet@email.com' },
              { ico: '📱', lbl: 'Phone',    val: '+91 99999 99999',     href: 'tel:+919999999999' },
              { ico: '📍', lbl: 'Location', val: 'India 🇮🇳',           href: null },
            ].map(({ ico, lbl, val, href }) => {
              const Tag = href ? 'a' : 'div';
              return (
                <Tag
                  key={lbl}
                  href={href}
                  className="contact-detail-item reveal reveal-delay-1"
                >
                  <div className="detail-icon">{ico}</div>
                  <div>
                    <div className="detail-label">{lbl}</div>
                    <div className="detail-value">{val}</div>
                  </div>
                </Tag>
              );
            })}
          </div>

          <div className="social-row reveal reveal-delay-2">
            <a href="https://github.com/abhijeet" target="_blank" rel="noopener noreferrer" className="social-link">
              <GHIcon /> GitHub
            </a>
            <a href="https://linkedin.com/in/abhijeet" target="_blank" rel="noopener noreferrer" className="social-link">
              <LIIcon /> LinkedIn
            </a>
          </div>
        </div>

        {/* Right: Form */}
        <form className="contact-form reveal reveal-delay-2" onSubmit={submit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" className="form-input" placeholder="Your name" value={form.name} onChange={change} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={change} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" className="form-input" placeholder="What's this about?" value={form.subject} onChange={change} required />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" className="form-textarea" placeholder="Tell me about your project or opportunity..." value={form.message} onChange={change} required />
          </div>

          {status && (
            <div className={`form-status ${status}`}>
              {status === 'success'
                ? "✅ Message sent! I'll get back to you soon."
                : '❌ Something went wrong. Please try again.'}
            </div>
          )}

          <button type="submit" className="form-submit" disabled={load}>
            <span>{load ? 'Sending...' : 'Send Message'}</span>
            {!load && <SendIcon />}
          </button>
        </form>

      </div>
    </div>
  );
}