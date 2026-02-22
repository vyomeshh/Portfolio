import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, X, User, GraduationCap, Code, 
  Briefcase, Award, Terminal, Cpu, Github, Linkedin, 
  ChevronDown, ExternalLink, Loader2, Mail, Phone, Sparkles
} from 'lucide-react';

// --- PURE CSS STYLES ---
const customStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --bg-color: #030305;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --accent-yellow: #ffb400;
  --accent-yellow-hover: #e6a200;
  --gradient-gold: linear-gradient(135deg, #ffb400 0%, #f59e0b 100%);
  --card-bg: rgba(255, 255, 255, 0.02);
  --card-border: rgba(255, 255, 255, 0.05);
  --card-hover: rgba(255, 255, 255, 0.04);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'Inter', sans-serif; background-color: var(--bg-color); color: var(--text-main); line-height: 1.6; overflow-x: hidden; }
::selection { background: rgba(255, 180, 0, 0.3); color: #fff; }

/* Utilities */
.text-yellow { color: var(--accent-yellow); }
.text-gradient { background: var(--gradient-gold); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.text-blue { color: #3b82f6; }
.text-purple { color: #a855f7; }
.text-muted { color: var(--text-muted); }
.mb-15 { margin-bottom: 15px; }

/* Layout & Animated Background */
.portfolio-root { position: relative; min-height: 100vh; overflow: hidden; }
.bg-glow { position: fixed; width: 60vw; height: 60vw; border-radius: 50%; filter: blur(140px); z-index: -1; pointer-events: none; opacity: 0.15; animation: floatBlob 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); }
.bg-glow-yellow { top: -10%; left: -10%; background: var(--accent-yellow); }
.bg-glow-blue { bottom: -10%; right: -10%; background: #3b82f6; animation-delay: -10s; }

@keyframes floatBlob {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(5vw, 5vh) scale(1.1); }
  66% { transform: translate(-2vw, 8vh) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

/* Navbar */
.navbar { position: sticky; top: 0; z-index: 40; background: rgba(3, 3, 5, 0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.05); transition: all 0.3s ease; }
.nav-container { max-width: 1152px; margin: 0 auto; height: 70px; padding: 0 24px; display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 1.4rem; font-weight: 900; letter-spacing: -0.5px; display: flex; align-items: center; gap: 4px;}
.nav-links { display: flex; gap: 32px; }
.nav-links a, .nav-socials a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.3s ease; }
.nav-links a:hover, .nav-socials a:hover { color: var(--accent-yellow); }
.nav-socials { display: flex; gap: 16px; }

/* Hero Section */
.hero { min-height: 90vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 80px 24px; position: relative; }
.badge { background: rgba(255, 180, 0, 0.1); border: 1px solid rgba(255, 180, 0, 0.2); color: var(--accent-yellow); padding: 6px 16px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; display: flex; align-items: center; gap: 6px; animation: fadeInDown 0.8s ease forwards; }
.hero-title { font-size: clamp(3.5rem, 8vw, 6rem); font-weight: 900; line-height: 1.1; margin-bottom: 20px; letter-spacing: -2px; animation: fadeInUp 0.8s ease forwards 0.2s; opacity: 0; }
.hero-subtitle { font-size: clamp(1.2rem, 3vw, 1.6rem); color: var(--text-muted); max-width: 700px; margin-bottom: 40px; animation: fadeInUp 0.8s ease forwards 0.4s; opacity: 0; height: 35px; }
.hero-actions { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; animation: fadeInUp 0.8s ease forwards 0.6s; opacity: 0; }

.btn-primary, .btn-secondary { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 16px 36px; border-radius: 14px; font-size: 1.05rem; font-weight: 700; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); text-decoration: none; }
.btn-primary { background: var(--gradient-gold); color: #000; border: none; box-shadow: 0 4px 15px rgba(255, 180, 0, 0.2); }
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(255, 180, 0, 0.4); }
.btn-secondary { background: rgba(255, 255, 255, 0.03); color: var(--text-main); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); }
.btn-secondary:hover { background: rgba(255, 255, 255, 0.08); transform: translateY(-3px); border-color: rgba(255,255,255,0.2); }
.scroll-icon { margin-top: 80px; color: #475569; animation: bounce 2s infinite, fadeIn 1s forwards 1s; opacity: 0; }

/* Main Content & Cards */
.main-container { max-width: 1152px; margin: 0 auto; padding: 0 24px 100px 24px; display: flex; flex-direction: column; gap: 140px; }
.section-header { display: flex; align-items: center; gap: 16px; margin-bottom: 40px; }
.section-header h2 { font-size: 2.2rem; font-weight: 800; letter-spacing: -0.5px; }
.icon-wrapper { padding: 14px; border-radius: 18px; display: flex; align-items: center; justify-content: center; }
.icon-yellow { background: rgba(255, 180, 0, 0.1); border: 1px solid rgba(255, 180, 0, 0.2); color: var(--accent-yellow); box-shadow: 0 0 20px rgba(255,180,0,0.1); }
.icon-blue { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); color: #3b82f6; box-shadow: 0 0 20px rgba(59,130,246,0.1); }
.icon-green { background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); color: #22c55e; box-shadow: 0 0 20px rgba(34,197,94,0.1); }
.icon-orange { background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.2); color: #f97316; }
.icon-red { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #ef4444; }

/* Interactive Cards */
.card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 24px; padding: 36px; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); text-decoration: none; color: inherit; display: block; position: relative; overflow: hidden; }
.card::before { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent); transition: left 0.7s ease; transform: skewX(-20deg); pointer-events: none; }
.card:hover::before { left: 150%; }

.card.project-card:hover { background: var(--card-hover); border-color: rgba(255, 180, 0, 0.3); transform: translateY(-8px); box-shadow: 0 15px 35px rgba(0,0,0,0.4), 0 0 20px rgba(255,180,0,0.05); }
.card.skill-card:hover { border-color: rgba(255, 255, 255, 0.15); transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }

.grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
.grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 32px; }
.gap-large { gap: 64px; }

/* Specific Sections */
.about-card { font-size: 1.15rem; color: #cbd5e1; line-height: 1.9; }
.about-card span { color: var(--text-main); font-weight: 700; background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 6px; }
.skill-card h3 { font-size: 1.3rem; margin-bottom: 20px; font-weight: 700; }
.tags { display: flex; flex-wrap: wrap; gap: 10px; }
.tag { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255,255,255,0.08); padding: 8px 14px; border-radius: 10px; font-size: 0.85rem; color: #e2e8f0; font-weight: 500; transition: all 0.3s; }
.card:hover .tag { background: rgba(255, 255, 255, 0.06); border-color: rgba(255,255,255,0.15); }

.project-card { display: flex; flex-direction: column; height: 100%; cursor: pointer; }
.project-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.project-header h3 { font-size: 1.3rem; font-weight: 700; transition: color 0.3s; }
.project-card:hover .project-header h3 { color: var(--accent-yellow); }
.project-card:hover .external-icon { color: var(--accent-yellow); transform: translate(2px, -2px); }
.external-icon { transition: transform 0.3s, color 0.3s; }
.project-card p { color: var(--text-muted); flex-grow: 1; margin-bottom: 28px; font-size: 1rem; line-height: 1.7; }
.project-link { color: var(--accent-yellow); font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; gap: 6px; transition: gap 0.3s; }
.project-card:hover .project-link { gap: 12px; }

.timeline { display: flex; flex-direction: column; gap: 32px; }
.timeline-item { position: relative; padding-left: 36px; border-left: 2px solid rgba(255,255,255,0.1); padding-bottom: 10px; transition: all 0.3s; }
.timeline-item:hover { border-left-color: rgba(255,255,255,0.3); }
.timeline-item:last-child { border-left-color: transparent; }
.timeline-item::before { content: ''; position: absolute; left: -7px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: #334155; transition: all 0.3s; }
.timeline-item:hover::before { background: #cbd5e1; box-shadow: 0 0 10px rgba(255,255,255,0.3); }
.timeline-item.active::before { background: var(--accent-yellow); box-shadow: 0 0 0 4px rgba(255, 180, 0, 0.2); }
.timeline-item.active:hover::before { box-shadow: 0 0 15px rgba(255, 180, 0, 0.5), 0 0 0 4px rgba(255, 180, 0, 0.3); }
.timeline-item h4 { font-size: 1.2rem; margin-bottom: 6px; font-weight: 700; }
.timeline-item p { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 16px; line-height: 1.6;}
.year-badge { background: rgba(255, 180, 0, 0.08); border: 1px solid rgba(255,180,0,0.15); color: var(--accent-yellow); padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; display: inline-block; }

.certs-list { display: flex; flex-direction: column; gap: 16px; }
.cert-card { display: flex; justify-content: space-between; align-items: center; padding: 24px; border-radius: 18px; }
.cert-card h4 { font-size: 1.05rem; font-weight: 600; }
.cert-card:hover h4 { color: var(--accent-yellow); }

/* Footer */
.footer { border-top: 1px solid var(--card-border); padding: 50px 24px; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); }
.footer-content { max-width: 1152px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; align-items: center; text-align: center; color: var(--text-muted); font-size: 0.95rem; }
.footer-links { display: flex; gap: 32px; flex-wrap: wrap; justify-content: center; }
.footer-links a { color: #cbd5e1; text-decoration: none; display: flex; align-items: center; gap: 10px; transition: all 0.3s ease; font-weight: 500; }
.footer-links a:hover { color: var(--accent-yellow); transform: translateY(-2px); }
@media (min-width: 768px) { .footer-content { flex-direction: row; justify-content: space-between; text-align: left; } }

/* Chatbot UI */
.chat-fab { position: fixed; bottom: 30px; right: 30px; z-index: 50; width: 65px; height: 65px; border-radius: 50%; border: none; background: var(--gradient-gold); color: #000; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 10px 30px rgba(255, 180, 0, 0.3); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); animation: pulseBot 2.5s infinite; }
.chat-fab:hover { transform: scale(1.1) rotate(5deg); box-shadow: 0 15px 40px rgba(255, 180, 0, 0.4); animation: none; }
.chatbot-window { position: fixed; bottom: 30px; right: 30px; z-index: 60; width: 400px; max-width: calc(100vw - 40px); height: 550px; max-height: calc(100vh - 100px); background: rgba(10, 10, 15, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 28px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255,180,0,0.1); transform: translateY(20px) scale(0.95); opacity: 0; pointer-events: none; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.chatbot-window.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: all; }
.chat-header { background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; }
.chat-title { display: flex; align-items: center; gap: 14px; }
.chat-avatar { width: 40px; height: 40px; background: var(--gradient-gold); border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: 800; font-size: 0.9rem; color: #000; box-shadow: 0 4px 10px rgba(255,180,0,0.3); }
.chat-title h3 { font-size: 1.1rem; font-weight: 800; color: #fff; line-height: 1.2; }
.chat-title p { font-size: 0.75rem; font-weight: 600; color: var(--accent-yellow); display: flex; align-items: center; gap: 4px; }
.chat-close { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); cursor: pointer; color: #fff; padding: 8px; border-radius: 50%; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; }
.chat-close:hover { background: rgba(255,255,255,0.15); transform: rotate(90deg); }
.chat-body { flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 18px; }
.chat-message-row { display: flex; width: 100%; }
.chat-message-row.user { justify-content: flex-end; }
.chat-message-row.bot { justify-content: flex-start; }
.chat-bubble { max-width: 85%; padding: 14px 18px; border-radius: 20px; font-size: 0.95rem; white-space: pre-wrap; line-height: 1.6; }
.chat-bubble.user { background: var(--gradient-gold); color: #000; font-weight: 600; border-top-right-radius: 4px; box-shadow: 0 4px 15px rgba(255,180,0,0.2); }
.chat-bubble.bot { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-main); border-top-left-radius: 4px; }
.chat-bubble.loading { display: flex; align-items: center; gap: 10px; color: var(--accent-yellow); font-weight: 600; background: transparent; border: none;}
.spinner { animation: spin 1s linear infinite; }
.chat-input-area { padding: 20px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 12px; }
.chat-input-area input { flex: 1; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255,255,255,0.1); padding: 14px 20px; border-radius: 14px; color: white; outline: none; font-size: 0.95rem; transition: all 0.3s ease; }
.chat-input-area input:focus { border-color: rgba(255, 180, 0, 0.5); background: rgba(255,255,255,0.06); box-shadow: 0 0 0 4px rgba(255,180,0,0.1); }
.chat-input-area button { background: var(--gradient-gold); color: #000; border: none; width: 50px; border-radius: 14px; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(255,180,0,0.2); }
.chat-input-area button:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 6px 15px rgba(255,180,0,0.4); }
.chat-input-area button:disabled { opacity: 0.5; cursor: not-allowed; }

/* Scroll Animations */
.reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.5, 0, 0, 1); }
.reveal.active { opacity: 1; transform: translateY(0); }

/* Animations & Responsive */
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
@keyframes pulseBot { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 180, 0, 0.4); } 70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(255, 180, 0, 0); } 100% { transform: scale(1); } }
@keyframes spin { 100% { transform: rotate(360deg); } }
@media (max-width: 768px) { .nav-links { display: none; } .main-container { padding: 0 20px 80px 20px; gap: 80px; } .chatbot-window { bottom: 20px; right: 20px; width: calc(100vw - 40px); } .chat-fab { bottom: 20px; right: 20px; } }
`;

// --- TYPES ---
interface Message {
  role: 'user' | 'bot';
  text: string;
}

// --- TYPEWRITER HOOK ---
const useTypewriter = (words: string[], speed = 100, pause = 2000) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));
        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setText(currentWord.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, speed, pause]);

  return text;
};

// --- SCROLL REVEAL COMPONENT ---
const RevealOnScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${isVisible ? 'active' : ''}`}>
      {children}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi! I'm Vyomesh's AI assistant. 👋 Ask me anything about his resume, projects, or experience!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Use the new typing effect for the subtitle
  const typingText = useTypewriter(["Software Developer", "Data Analyst", "AI Enthusiast", "Problem Solver"]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- TRUE AI CHATBOT LOGIC ---
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setIsLoading(true);

    try {
      // 1. ATTEMPT PYTHON BACKEND FIRST
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });

      if (!response.ok) throw new Error("Backend unavailable");
      const data = await response.json();
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);

    } catch (error) {
      // 2. TRUE AI FALLBACK (Uses Gemini directly in Canvas)
      try {
        const apiKey = ""; // Provided by execution environment
        const systemPrompt = `You are a highly intelligent, professional AI assistant for Vyomesh Mishra's portfolio website.
        Answer questions about Vyomesh based ONLY on this data. Be conversational, friendly, and concise. 

        Vyomesh's Profile:
        - B.Tech Computer Science & Engineering at Galgotias University (2023-2027)
        - Contact: mishravyomesh14@gmail.com | (+91) 7651950803
        - Links: GitHub (github.com/vyomeshh), LinkedIn (linkedin.com/in/vyomesh-mishra)
        - Skills: Python (Expert), Java, C++, C, JavaScript, Data Structures, Algorithms, OOP, MySQL, OS.
        - Experience: 
          1. Google Data Analytics Intern (2024) - Architected data pipelines and visualizations.
          2. Technical Mentor at HCL GUVI (Apr-Aug 2025) - Mentored students on programming.
          3. Club Coordinator at Galgotias Tech Council (2023-Present).
        - Projects: 
          1. AI Smart File Assistant (Python, NLP, ML)
          2. Student Score Predictor (Python, Scikit-Learn)
          3. Hospital Management System (Java, SQL)
          4. Cloudinfo Weather App (Python, APIs)
        - Achievements: LeetCode Rating 1589 (Top 15%), Google Analytics Certification, Tata GenAI Simulation.`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: userText }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        });

        if (!geminiRes.ok) throw new Error("AI API failed");
        
        const data = await geminiRes.json();
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (botReply) {
          setMessages(prev => [...prev, { role: "bot", text: botReply }]);
        } else {
          throw new Error("Invalid AI response");
        }
      } catch (aiError) {
        setMessages(prev => [...prev, { role: "bot", text: "My AI servers are currently resting! Please start the Python backend (localhost:8000) to chat with me." }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="portfolio-root">
        
        {/* Background Effects */}
        <div className="bg-glow bg-glow-yellow"></div>
        <div className="bg-glow bg-glow-blue"></div>

        {/* --- NAVIGATION --- */}
        <nav className="navbar">
          <div className="nav-container">
            <span className="logo">
              VYOMESH<span className="text-yellow">.</span>
            </span>
            <div className="nav-links">
              <a href="#about">About</a>
              <a href="#experience">Experience</a>
              <a href="#skills">Skills</a>
              <a href="#projects">Projects</a>
            </div>
            <div className="nav-socials">
              <a href="https://github.com/vyomeshh" target="_blank" rel="noopener noreferrer"><Github size={20}/></a>
              <a href="https://linkedin.com/in/vyomesh-mishra" target="_blank" rel="noopener noreferrer"><Linkedin size={20}/></a>
            </div>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <section className="hero">

          <h1 className="hero-title text-gradient">Vyomesh Mishra</h1>
          <p className="hero-subtitle">
            B.Tech CSE | <span>{typingText}</span><span className="cursor-blink">|</span>
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setIsChatOpen(true)}>
              <MessageSquare size={18} /> Chat with AI Resume
            </button>
            <a href="https://github.com/vyomeshh" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <Github size={18} /> View GitHub
            </a>
          </div>
          <div className="scroll-icon">
            <ChevronDown size={32} />
          </div>
        </section>

        {/* --- MAIN CONTENT --- */}
        <main className="main-container">
          
          <RevealOnScroll>
            <section id="about">
              <div className="section-header">
                <div className="icon-wrapper icon-yellow"><User size={24} /></div>
                <h2>About Me</h2>
              </div>
              <div className="card about-card">
                <p>
                  Computer Science undergraduate demonstrating advanced analytical capabilities alongside a comprehensive foundation in <span>Python, Java, and data analytics</span> methodologies. Evidenced proficiency in engineering artificial intelligence-driven predictive models and architecting robust applications. Passionate about solving complex problems through clean, efficient code and actively seeking software development opportunities in a collaborative environment.
                </p>
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section id="experience">
              <div className="section-header">
                <div className="icon-wrapper icon-blue"><Briefcase size={24} /></div>
                <h2>Experience</h2>
              </div>
              <div className="timeline">
                <TimelineItem 
                  title="Google Data Analytics Intern" 
                  subtitle="Google (Remote) - Architected data processing pipelines and advanced visualization methodologies." 
                  rightText="2024" 
                  active 
                />
                <TimelineItem 
                  title="Technical Mentor" 
                  subtitle="HCL GUVI (HCL Jigsaw) - Administered comprehensive technical mentorship to diverse student cohorts on programming principles." 
                  rightText="Apr 2025 – Aug 2025" 
                />
                <TimelineItem 
                  title="Club Coordinator" 
                  subtitle="Galgotias Tech Council - Directed the strategic implementation of departmental technical initiatives and coding events." 
                  rightText="2023 – Present" 
                />
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section id="skills">
              <div className="section-header">
                <div className="icon-wrapper icon-blue"><Terminal size={24} /></div>
                <h2>Technical Arsenal</h2>
              </div>
              <div className="grid-3">
                <SkillCard 
                  title="Languages" 
                  icon={<Code className="text-yellow mb-15" size={28} />}
                  skills={["Python (Expert)", "Java", "C++", "C", "JavaScript"]}
                />
                <SkillCard 
                  title="Core Concepts" 
                  icon={<Cpu className="text-blue mb-15" size={28} />}
                  skills={["DSA", "OOP", "MySQL", "OS", "Distributed Systems"]}
                />
                <SkillCard 
                  title="Tools & APIs" 
                  icon={<Terminal className="text-purple mb-15" size={28} />}
                  skills={["Git", "GitHub", "VS Code", "IntelliJ", "Google Analytics"]}
                />
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section id="projects">
              <div className="section-header">
                <div className="icon-wrapper icon-green"><Code size={24} /></div>
                <h2>Featured Projects</h2>
              </div>
              <div className="grid-2">
                <ProjectCard 
                  title="AI-Driven Smart File Assistant" 
                  desc="Intelligent document querying architecture leveraging advanced NLP methodologies and Machine Learning."
                  link="https://github.com/vyomeshh/AI-File-Manager"
                />
                <ProjectCard 
                  title="Student Score Predictor" 
                  desc="Machine learning regression model built with Python, Scikit-Learn, and Pandas to forecast academic performance."
                  link="https://github.com/vyomeshh/Student_Score_Predictor"
                />
                <ProjectCard 
                  title="Hospital Management System" 
                  desc="Comprehensive digital system for patient records with a secure SQL backend and responsive Java/JS frontend."
                  link="https://github.com/vyomeshh/Hospital_Management_System"
                />
                <ProjectCard 
                  title="Cloudinfo Weather App" 
                  desc="Real-time meteorological tracking application built with Python, PyQt5, QThread, and OpenWeatherMap API."
                  link="https://github.com/vyomeshh/Projects/blob/main/CloudInfo.py"
                />
              </div>
            </section>
          </RevealOnScroll>

          <div className="grid-2 gap-large">
            <RevealOnScroll>
              <section id="education">
                <div className="section-header">
                  <div className="icon-wrapper icon-orange"><GraduationCap size={24} /></div>
                  <h2>Education</h2>
                </div>
                <div className="timeline">
                  <TimelineItem title="B.Tech Computer Science" subtitle="Galgotias University" rightText="2023 – 2027" active />
                  <TimelineItem title="Class XII (CBSE)" subtitle="Lucknow Public School" rightText="89.4%" />
                  <TimelineItem title="Class X (CBSE)" subtitle="Lucknow Public School" rightText="93.6%" />
                </div>
              </section>
            </RevealOnScroll>

            <RevealOnScroll>
              <section id="certs">
                <div className="section-header">
                  <div className="icon-wrapper icon-red"><Award size={24} /></div>
                  <h2>Achievements</h2>
                </div>
                <div className="certs-list">
                  <div className="card cert-card">
                    <h4>LeetCode Rating: 1589 (Top 15%)</h4>
                    <Award size={20} className="text-muted" />
                  </div>
                  <div className="card cert-card">
                    <h4>Google Analytics Certification</h4>
                    <Award size={20} className="text-muted" />
                  </div>
                  <div className="card cert-card">
                    <h4>Tata GenAI Data Analytics Simulation</h4>
                    <Award size={20} className="text-muted" />
                  </div>
                  <div className="card cert-card">
                    <h4>GUVI Python & Java DSA Certified</h4>
                    <Award size={20} className="text-muted" />
                  </div>
                </div>
              </section>
            </RevealOnScroll>
          </div>
        </main>

        {/* --- FOOTER --- */}
        <footer className="footer">
          <div className="footer-content">
            <p>© 2026 Vyomesh Mishra</p>
            <div className="footer-links">
              <a href="mailto:mishravyomesh14@gmail.com"><Mail size={16}/> mishravyomesh14@gmail.com</a>
              <a href="tel:+917651950803"><Phone size={16}/> (+91) 7651950803</a>
              <a href="https://linkedin.com/in/vyomesh-mishra" target="_blank" rel="noopener noreferrer"><Linkedin size={16}/> LinkedIn</a>
              <a href="https://github.com/vyomeshh" target="_blank" rel="noopener noreferrer"><Github size={16}/> GitHub</a>
            </div>
          </div>
        </footer>

        {/* --- CHATBOT WINDOW --- */}
        <div className={`chatbot-window ${isChatOpen ? 'open' : ''}`}>
          <div className="chat-header">
            <div className="chat-title">
              <div className="chat-avatar"><Sparkles size={20} color="#000" /></div>
              <div>
                <h3>Resume Assistant</h3>
                <p><span className="w-2 h-2 rounded-full bg-green-400 inline-block mr-1"></span> AI Online</p>
              </div>
            </div>
            <button className="chat-close" onClick={() => setIsChatOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message-row ${msg.role}`}>
                <div className={`chat-bubble ${msg.role}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message-row bot">
                <div className="chat-bubble bot loading">
                  <Loader2 size={16} className="spinner" /> Generating response...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSend}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my experience..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* FLOATING CHAT BUTTON */}
        {!isChatOpen && (
          <button onClick={() => setIsChatOpen(true)} className="chat-fab">
            <MessageSquare size={26} />
          </button>
        )}
      </div>
    </>
  );
};

// --- SUB-COMPONENTS ---

const SkillCard: React.FC<{ title: string; icon: React.ReactNode; skills: string[] }> = ({ title, icon, skills }) => (
  <div className="card skill-card">
    {icon}
    <h3>{title}</h3>
    <div className="tags">
      {skills.map((skill, i) => (
        <span key={i} className="tag">{skill}</span>
      ))}
    </div>
  </div>
);

const ProjectCard: React.FC<{ title: string; desc: string; link: string }> = ({ title, desc, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="card project-card">
    <div className="project-header">
      <h3 className="text-main">{title}</h3>
      <ExternalLink size={20} className="external-icon text-muted" />
    </div>
    <p>{desc}</p>
    <div className="project-link">
      View on GitHub <span style={{fontSize: '1.2rem'}}>→</span>
    </div>
  </a>
);

const TimelineItem: React.FC<{ title: string; subtitle: string; rightText: string; active?: boolean }> = ({ title, subtitle, rightText, active }) => (
  <div className={`timeline-item ${active ? 'active' : ''}`}>
    <h4>{title}</h4>
    <p>{subtitle}</p>
    <span className="year-badge">{rightText}</span>
  </div>
);

export default App;