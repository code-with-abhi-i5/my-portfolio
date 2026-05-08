import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Magnetic from './Magnetic.jsx';
import './VoiceChatbot.css';

const GITHUB_TOKEN = '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';

async function getAIResponse(text) {
  try {
    const prompt = `You are AB Assistant, the AI assistant for Abhijeet Ghosh's portfolio website. 
    Here is some info about Abhijeet:
    - Skilled in React, JavaScript, TypeScript, HTML/CSS, Python, Tailwind, Git, Vite, Data Analytics tools (Power BI, Excel).
    - Built 15+ projects including web apps, dashboards.
    - 3+ years of coding experience.
    - Open to new job opportunities.
    
    User message: "${text}"
    
    Respond in a helpful, friendly, and professional tone. Keep it short (1-2 sentences maximum). 
    IMPORTANT: If the user asks in Hindi or Hinglish, reply in Hinglish (Hindi written in English letters, DO NOT use Devanagari script). If the user asks in English, reply in English.`;

    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI API Error:", error);
    return "Sorry, my brain is taking a break right now. Please explore the portfolio or contact Abhijeet directly!";
  }
}

const SpeechRecognition = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null;

export default function VoiceChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm AB Assistant 🤖 Ask me anything about Abhijeet — skills, projects, contact..." }
  ]);
  const [liveText, setLiveText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [textInput, setTextInput] = useState('');

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const panelRef = useRef(null);
  const containerRef = useRef(null);
  const supportsVoice = !!SpeechRecognition;

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveText]);

  // Panel Animation
  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(panelRef.current, 
        { 
          opacity: 0, 
          scale: 0.5, 
          y: 50, 
          rotate: -5,
          display: 'flex' 
        },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          rotate: 0,
          duration: 0.8, 
          ease: 'elastic.out(1, 0.75)' 
        }
      );
    } else {
      gsap.to(panelRef.current, {
        opacity: 0,
        scale: 0.5,
        y: 50,
        rotate: 5,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => gsap.set(panelRef.current, { display: 'none' })
      });
    }
  }, [isOpen]);

  // Floating Fab Pulsing
  useGSAP(() => {
    gsap.to('.vc-fab-ring', {
      scale: 2.2,
      opacity: 0,
      duration: 2,
      repeat: -1,
      stagger: 1,
      ease: 'power1.out'
    });

    gsap.to('.vc-avatar.speaking', {
      boxShadow: '0 0 20px #00d4ff',
      repeat: -1,
      yoyo: true,
      duration: 0.4
    });
  }, []);

  // Animate new messages
  useEffect(() => {
    const lastMsg = containerRef.current?.querySelector('.vc-msg:last-child');
    if (lastMsg) {
      gsap.fromTo(lastMsg, 
        { opacity: 0, y: 15, scale: 0.8, rotate: -2 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          duration: 0.5,
          ease: 'back.out(2)'
        }
      );
    }
  }, [messages.length]);

  // Speak response
  const speak = useCallback((text) => {
    if (!voiceOn || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN';
    u.rate = 1; u.pitch = 1; u.volume = 0.9;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [voiceOn]);

  const processMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    setLiveText('');
    setMessages(prev => [...prev, { from: 'bot', text: '...', isTyping: true }]);
    const reply = await getAIResponse(text);
    setMessages(prev => {
      const newMsgs = [...prev];
      if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].isTyping) newMsgs.pop();
      return [...newMsgs, { from: 'bot', text: reply }];
    });
    speak(reply);
  }, [speak]);

  const startListening = useCallback(() => {
    if (!supportsVoice) return;
    window.speechSynthesis?.cancel();
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (e) => {
      let interim = '', final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t; else interim += t;
      }
      setLiveText(interim || final);
      if (final) { processMessage(final); setIsListening(false); }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [supportsVoice, processMessage]);

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    processMessage(textInput.trim());
    setTextInput('');
  };

  return (
    <div ref={containerRef}>
      {/* ── Floating Mic Button ── */}
      <Magnetic strength={0.5}>
        <button
          className={`vc-fab ${isListening ? 'listening' : ''}`}
          onClick={() => setIsOpen(o => !o)}
          aria-label="Voice Assistant"
        >
          {isOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          )}
          <span className="vc-fab-ring" />
          <span className="vc-fab-ring vc-fab-ring-2" />
        </button>
      </Magnetic>

      {/* ── Chat Panel ── */}
      <div className="vc-panel" ref={panelRef} style={{ display: 'none' }}>
        <div className="vc-header">
          <div className="vc-header-left">
            <div className={`vc-avatar ${isSpeaking ? 'speaking' : ''}`}>AB</div>
            <div>
              <div className="vc-title">AB Assistant</div>
              <div className="vc-subtitle">{isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Speaking...' : 'Online'}</div>
            </div>
          </div>
          <button className={`vc-voice-toggle ${voiceOn ? 'on' : ''}`} onClick={() => { setVoiceOn(v => !v); window.speechSynthesis?.cancel(); }}>
            {voiceOn ? '🔊' : '🔇'}
          </button>
        </div>

        <div className="vc-messages">
          {messages.map((m, i) => (
            <div key={i} className={`vc-msg ${m.from}`}>
              <div className="vc-msg-bubble">
                {m.isTyping ? (
                  <div className="vc-typing-dots">
                    <span className="vc-dot"></span>
                    <span className="vc-dot"></span>
                    <span className="vc-dot"></span>
                  </div>
                ) : (
                  m.text
                )}
              </div>
            </div>
          ))}
          {liveText && (
            <div className="vc-msg user">
              <div className="vc-msg-bubble vc-live">{liveText}</div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="vc-input-area">
          {supportsVoice && (
            <button
              className={`vc-mic-btn ${isListening ? 'active' : ''}`}
              onClick={isListening ? stopListening : startListening}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
            </button>
          )}
          <form className="vc-text-form" onSubmit={handleTextSubmit}>
            <input
              className="vc-text-input"
              type="text"
              placeholder="Type a message..."
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
            />
            <button className="vc-send-btn" type="submit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
