import { useState, useEffect, useRef, useCallback } from 'react';
import './VoiceChatbot.css';

/* ── Smart keyword response engine ── */
const RESPONSES = [
  { keys: ['hello','hi','hey','sup'], reply: "Hey there! I'm Abhijeet's portfolio assistant. Ask me about his skills, projects, or how to hire him!" },
  { keys: ['skill','tech','stack','language','tools'], reply: "Abhijeet is skilled in React, JavaScript, TypeScript, HTML/CSS, Python, Tailwind, Git, Vite, and Data Analytics tools like Power BI and Excel." },
  { keys: ['project','work','portfolio','built'], reply: "Abhijeet has built 15+ projects including web apps, dashboards, and UI components using React, Vite, and modern CSS. Check the Projects section!" },
  { keys: ['about','who','background','story'], reply: "Abhijeet is a Frontend Developer and Data Analyst passionate about building high-performance web experiences with clean code and beautiful UI." },
  { keys: ['contact','hire','email','reach','connect'], reply: "You can hire Abhijeet! Scroll down to the Contact section or email him directly. He's currently open to opportunities." },
  { keys: ['experience','year','coding'], reply: "Abhijeet has 3+ years of coding experience across frontend development and data analytics." },
  { keys: ['education','study','college','degree'], reply: "Abhijeet is focused on continuous learning in web technologies and data science." },
  { keys: ['react','frontend','web'], reply: "React is Abhijeet's primary framework. He builds blazing-fast SPAs with React, Vite, and modern tooling." },
  { keys: ['name','your name','call'], reply: "I'm AB Assistant — Abhijeet's virtual portfolio guide. How can I help you?" },
  { keys: ['bye','thanks','thank','goodbye'], reply: "Thanks for visiting! Feel free to reach out to Abhijeet anytime. Have a great day! 👋" },
];

function getResponse(text) {
  const lower = text.toLowerCase();
  for (const r of RESPONSES) {
    if (r.keys.some(k => lower.includes(k))) return r.reply;
  }
  return "Interesting question! You can explore Abhijeet's portfolio sections for more details, or ask me about his skills, projects, or contact info.";
}

/* ── SpeechRecognition setup ── */
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
  const supportsVoice = !!SpeechRecognition;

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveText]);

  // Speak response
  const speak = useCallback((text) => {
    if (!voiceOn || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1; u.pitch = 1; u.volume = 0.9;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [voiceOn]);

  // Process user message
  const processMessage = useCallback((text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    setLiveText('');
    setTimeout(() => {
      const reply = getResponse(text);
      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
      speak(reply);
    }, 600);
  }, [speak]);

  // Start listening
  const startListening = useCallback(() => {
    if (!supportsVoice) return;
    window.speechSynthesis?.cancel();
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
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

  // Stop listening
  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // Text input submit
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    processMessage(textInput.trim());
    setTextInput('');
  };

  return (
    <>
      {/* ── Floating Mic Button ── */}
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

      {/* ── Chat Panel ── */}
      <div className={`vc-panel ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="vc-header">
          <div className="vc-header-left">
            <div className={`vc-avatar ${isSpeaking ? 'speaking' : ''}`}>AB</div>
            <div>
              <div className="vc-title">AB Assistant</div>
              <div className="vc-subtitle">{isListening ? '🎤 Listening...' : isSpeaking ? '🔊 Speaking...' : 'Online'}</div>
            </div>
          </div>
          <button className={`vc-voice-toggle ${voiceOn ? 'on' : ''}`} onClick={() => { setVoiceOn(v => !v); window.speechSynthesis?.cancel(); }} aria-label="Toggle voice">
            {voiceOn ? '🔊' : '🔇'}
          </button>
        </div>

        {/* Messages */}
        <div className="vc-messages">
          {messages.map((m, i) => (
            <div key={i} className={`vc-msg ${m.from}`}>
              <div className="vc-msg-bubble">{m.text}</div>
            </div>
          ))}
          {liveText && (
            <div className="vc-msg user">
              <div className="vc-msg-bubble vc-live">{liveText}</div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="vc-input-area">
          {supportsVoice && (
            <button
              className={`vc-mic-btn ${isListening ? 'active' : ''}`}
              onClick={isListening ? stopListening : startListening}
              aria-label={isListening ? 'Stop' : 'Speak'}
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
            <button className="vc-send-btn" type="submit" aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
