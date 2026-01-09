import React, { useState, useEffect, useRef } from 'react';
import { supabase } from "./supabase"; // Ensure you have created src/supabase.js
import { 
  Palette, 
  Layout, 
  Smartphone, 
  Video, 
  Mail, 
  Linkedin, 
  Github, 
  Monitor, 
  PenTool, 
  Film, 
  Download,
  ExternalLink,
  Menu,
  X,
  Play,
  Layers,
  Moon,
  Sun,
  Send,
  Sparkles,
  MessageCircle,
  Bot,
  Zap,
  CheckCircle2,
  ArrowRight,
  Settings,
  Save,
  Lock,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';

const ADMIN_PIN = "2427";

/* ========================================
   DEFAULT DATA (Fallback)
   ========================================
*/
const DEFAULT_DATA = {
  profile: {
    name: "Janikashree R S",
    roles: ["UI/UX Designer", "Video Editor", "Graphic Designer", "Animator"], 
    shortBio: "Transforming ideas into digital reality. I blend technical precision with creative flair to build immersive user experiences and compelling visual stories.",
    email: "janikashreersj@gmail.com",
    linkedin: "https://www.linkedin.com/in/janikashree-r-s-b9867a294",
    location: "Namakkal, Tamil Nadu",
    resumeLink: "#" 
  },
  services: [
    {
      id: "uiux",
      title: "UI/UX Design",
      desc: "User-centered interfaces for web & mobile apps. Wireframing to high-fidelity prototyping.",
      icon: "layout" 
    },
    {
      id: "video",
      title: "Video Editing",
      desc: "Cinematic cuts, color grading, and storytelling for promotional and social content.",
      icon: "film"
    },
    {
      id: "graphic",
      title: "Graphic Design",
      desc: "Brand identity, marketing collateral, posters, and social media visuals.",
      icon: "palette"
    },
    {
      id: "motion",
      title: "Motion & Animation",
      desc: "Bringing static visuals to life with Alight Motion, FlipaClip and After Effects.",
      icon: "play"
    }
  ],
  software: [
    { name: "Figma", category: "Design", level: 95 },
    { name: "Adobe Photoshop", category: "Design", level: 90 },
    { name: "Adobe Illustrator", category: "Design", level: 85 },
    { name: "DaVinci Resolve", category: "Video", level: 75 },
    { name: "Alight Motion", category: "Video", level: 85 },
    { name: "Canva", category: "Design", level: 95 }
  ],
  portfolio: [
    {
      id: 1,
      title: "Mobile App Prototype",
      category: "uiux",
      image: "https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&q=80&w=800",
      desc: "A clean, user-friendly mobile application design focusing on intuitive navigation.",
      process: [
        { title: "User Research", desc: "Analyzed target audience needs and pain points through surveys." },
        { title: "Wireframing", desc: "Created low-fidelity sketches to establish core user flows." },
        { title: "High-Fidelity Design", desc: "Applied color theory and typography for the final UI in Figma." }
      ]
    },
    {
      id: 2,
      title: "Brand Identity Pack",
      category: "graphic",
      image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800",
      desc: "Complete logo and stationery design for a tech startup.",
      process: []
    }
  ],
  stats: [
    { label: "Years Exp", value: "2+" },
    { label: "Projects", value: "15+" },
    { label: "Tools", value: "8+" }
  ]
};

// Icon Mapping
const ICON_MAP = {
  layout: <Layout className="w-8 h-8" />,
  film: <Film className="w-8 h-8" />,
  palette: <Palette className="w-8 h-8" />,
  play: <Play className="w-8 h-8" />,
  video: <Video className="w-6 h-6" />,
  design: <Palette className="w-6 h-6" />,
  layers: <Layers className="w-6 h-6" />
};

// AI Helper Function
const callGemini = async (prompt, systemPrompt = "") => {
  const apiKey = ""; // Insert Key Here if needed
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) throw new Error("API Request Failed");
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI services. Please try again later.";
  }
};

/* ========================================
   COMPONENTS
   ======================================== */

// Admin Panel
const AdminPanel = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState(data);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const updateProfile = (field, value) => {
    setFormData(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
    }));
  };

  const updateStats = (index, value) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], value };
    setFormData(prev => ({ ...prev, stats: newStats }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: "New Project",
      category: "uiux",
      image: "https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&q=80&w=800",
      desc: "Project description goes here.",
      process: []
    };
    setFormData(prev => ({
      ...prev,
      portfolio: [newProject, ...prev.portfolio]
    }));
  };

  const deleteProject = (id) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter(p => p.id !== id)
    }));
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from("portfolio")
      .update({ data: formData })
      .eq("id", 1);

    if (error) {
      alert("Save failed: " + error.message);
    } else {
      alert("Saved successfully");
      if (onSave) onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex overflow-hidden border border-gray-200 dark:border-gray-800">
        
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-slate-950 border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-2">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" /> Settings
          </h2>
          {['profile', 'projects', 'skills', 'stats'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <div className="mt-auto space-y-2">
            <button onClick={handleSave} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold">Save Changes</button>
            <button onClick={onClose} className="w-full py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-bold">Cancel</button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-4">Edit Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input value={formData.profile.name} onChange={(e) => updateProfile('name', e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-slate-800 rounded-lg" placeholder="Name"/>
                <input value={formData.profile.email} onChange={(e) => updateProfile('email', e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-slate-800 rounded-lg" placeholder="Email"/>
                <textarea value={formData.profile.shortBio} onChange={(e) => updateProfile('shortBio', e.target.value)} rows={4} className="col-span-2 w-full p-3 bg-gray-100 dark:bg-slate-800 rounded-lg" placeholder="Bio"/>
                <input value={formData.profile.linkedin} onChange={(e) => updateProfile('linkedin', e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-slate-800 rounded-lg" placeholder="LinkedIn URL"/>
                <input value={formData.profile.resumeLink} onChange={(e) => updateProfile('resumeLink', e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-slate-800 rounded-lg" placeholder="Resume URL"/>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
             <div className="space-y-6">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-bold">Manage Projects</h3>
                 <button onClick={addProject} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"><Plus size={16} /> Add New</button>
               </div>
               <div className="space-y-4">
                 {formData.portfolio.map((project, idx) => (
                   <div key={project.id} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
                     <div className="flex justify-between items-start mb-4">
                       <h4 className="font-bold">Project #{idx + 1}</h4>
                       <button onClick={() => deleteProject(project.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg"><Trash2 size={16} /></button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <input value={project.title} onChange={(e) => { const newP = [...formData.portfolio]; newP[idx].title = e.target.value; setFormData({...formData, portfolio: newP}); }} className="p-2 bg-white dark:bg-slate-900 rounded border border-gray-200 dark:border-gray-700" placeholder="Title"/>
                       <select value={project.category} onChange={(e) => { const newP = [...formData.portfolio]; newP[idx].category = e.target.value; setFormData({...formData, portfolio: newP}); }} className="p-2 bg-white dark:bg-slate-900 rounded border border-gray-200 dark:border-gray-700">
                         <option value="uiux">UI/UX</option><option value="video">Video</option><option value="graphic">Graphic</option><option value="animation">Animation</option>
                       </select>
                       <input value={project.image} onChange={(e) => { const newP = [...formData.portfolio]; newP[idx].image = e.target.value; setFormData({...formData, portfolio: newP}); }} className="col-span-2 p-2 bg-white dark:bg-slate-900 rounded border border-gray-200 dark:border-gray-700" placeholder="Image URL"/>
                       <textarea value={project.desc} onChange={(e) => { const newP = [...formData.portfolio]; newP[idx].desc = e.target.value; setFormData({...formData, portfolio: newP}); }} className="col-span-2 p-2 bg-white dark:bg-slate-900 rounded border border-gray-200 dark:border-gray-700" placeholder="Description"/>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-4">Edit Statistics</h3>
              <div className="grid grid-cols-3 gap-6">
                {formData.stats.map((stat, i) => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <label className="block text-sm font-semibold mb-2">{stat.label}</label>
                    <input value={stat.value} onChange={(e) => updateStats(i, e.target.value)} className="w-full p-2 bg-white dark:bg-slate-900 rounded border border-gray-200 dark:border-gray-700 text-center font-bold"/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Edit Skills</h3>
                <button onClick={() => setFormData(prev => ({ ...prev, software: [...prev.software, { name: "New", category: "Design", level: 50 }] }))} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"><Plus size={16} /> Add</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.software.map((tool, idx) => (
                  <div key={idx} className="flex gap-2 items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <input value={tool.name} onChange={(e) => { const newS = [...formData.software]; newS[idx].name = e.target.value; setFormData({ ...formData, software: newS }); }} className="flex-1 p-2 bg-white dark:bg-slate-900 rounded" />
                    <input type="number" value={tool.level} onChange={(e) => { const newS = [...formData.software]; newS[idx].level = parseInt(e.target.value); setFormData({ ...formData, software: newS }); }} className="w-20 p-2 bg-white dark:bg-slate-900 rounded" />
                    <button onClick={() => { const newS = formData.software.filter((_, i) => i !== idx); setFormData({ ...formData, software: newS }); }} className="text-red-500 p-2"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// FadeIn Component
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setIsVisible(true); });
    }, { threshold: 0.1 });
    const currentElement = domRef.current;
    if (currentElement) observer.observe(currentElement);
    return () => { if (currentElement) observer.unobserve(currentElement); };
  }, []);

  return (
    <div ref={domRef} className={`transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

// Navbar Component
const Navbar = ({ darkMode, setDarkMode, onAdminTrigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div onClick={onAdminTrigger} className="text-2xl font-black tracking-tighter bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-all cursor-pointer select-none">JANIKASHREE</div>
        <div className="hidden md:flex items-center gap-8">
          {['About', 'Services', 'Portfolio', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 transition-colors relative group">{item}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span></a>
          ))}
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
          <a href="#contact" className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-bold hover:scale-105 transition-all shadow-lg">Let's Talk</a>
        </div>
        <button className="md:hidden text-gray-800 dark:text-white" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 p-4 absolute w-full shadow-xl">
          <div className="flex flex-col gap-4">
            {['About', 'Services', 'Portfolio', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-800 dark:text-gray-200">{item}</a>
            ))}
            <button onClick={() => { setDarkMode(!darkMode); setIsOpen(false); }} className="text-left font-medium text-gray-800 dark:text-gray-200">{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</button>
          </div>
        </div>
      )}
    </nav>
  );
};

// AI Chat Widget
const AIChatWidget = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'model', text: "Hi! I'm J. ✨ Ask me anything about Janikashree's design skills, tools, or projects!" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    const systemContext = `You are a helpful AI portfolio assistant for ${data.profile.name}. Use the following data: ${JSON.stringify(data)}.`;
    const aiResponseText = await callGemini(input, systemContext);
    setMessages(prev => [...prev, { role: 'model', text: aiResponseText }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[500px]">
          <div className="p-4 bg-purple-600 text-white flex justify-between items-center"><div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-300" /><span className="font-bold">J</span></div><button onClick={() => setIsOpen(false)}><X size={18} /></button></div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 shadow-sm'}`}>{m.text}</div>
              </div>
            ))}
            {loading && <div className="text-gray-500 text-sm p-2">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800 flex gap-2">
            <input className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none" placeholder="Ask about my skills..." value={input} onChange={(e) => setInput(e.target.value)} />
            <button type="submit" disabled={loading} className="bg-purple-600 text-white p-2 rounded-xl hover:bg-purple-700"><Send size={18} /></button>
          </form>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="group flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-4 rounded-full shadow-lg transition-all hover:scale-110">
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />} {!isOpen && <span className="font-bold pr-1">Ask AI</span>}
      </button>
    </div>
  );
};

// Project Card & Modal
const ProjectCard = ({ project, onClick }) => (
  <div onClick={onClick} className="group relative overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-900 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
    <div className="aspect-[4/3] overflow-hidden">
      <img src={project.image} alt={project.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <span className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">{project.category}</span>
        <h3 className="text-white text-xl font-bold">{project.title}</h3>
      </div>
    </div>
  </div>
);

const ProjectDetailModal = ({ project, onClose }) => {
  if (!project) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-950 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-800">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/10 dark:bg-white/10 rounded-full hover:bg-black/20"><X size={24} className="text-gray-900 dark:text-white" /></button>
        <div className="h-64 md:h-80 relative overflow-hidden"><img src={project.image} alt={project.title} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" /><div className="absolute bottom-6 left-6 text-white"><span className="px-3 py-1 bg-purple-600 rounded-full text-xs font-bold uppercase mb-3 inline-block">{project.category}</span><h2 className="text-3xl md:text-5xl font-black">{project.title}</h2></div></div>
        <div className="p-6 md:p-10">
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">{project.desc}</p>
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><Layers className="text-purple-600" /> Work Process</h3>
          <div className="space-y-8">{project.process?.map((step, idx) => (<div key={idx} className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-gray-800 shadow-sm"><h4 className="font-bold text-lg mb-2">{step.title}</h4><p className="text-gray-500 dark:text-gray-400 text-sm">{step.desc}</p></div>))}</div>
        </div>
      </div>
    </div>
  );
};

/* ========================================
   MAIN APP COMPONENT
   ======================================== */
const App = () => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(true); 
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Admin State
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // 1. Data Loader (Safe)
  useEffect(() => {
    const load = async () => {
      const { data: dbData, error } = await supabase
        .from("portfolio")
        .select("data")
        .single();

      if (dbData?.data?.profile) {
        setData(dbData.data);
      }
    };
    load();
  }, []);

  // 2. Role Rotator (Safe)
  useEffect(() => {
    if (!data?.profile?.roles || data.profile.roles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentRoleIndex(prev => (prev + 1) % data.profile.roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [data]);

  // Admin Trigger
  const handleLogoClick = () => {
    setAdminClickCount(prev => prev + 1);
    if (adminClickCount + 1 === 3) {
      if (!isAdmin) setShowPinModal(true);
      else setShowAdminPanel(true);
      setAdminClickCount(0);
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAdmin(true);
      setShowPinModal(false);
      setShowAdminPanel(true);
      setPinInput("");
    } else {
      alert("Incorrect PIN");
    }
  };

  // 3. Loading Guard (Prevents White Screen)
  if (!data || !data.profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-black text-purple-600 font-bold text-xl">
        Loading Portfolio...
      </div>
    );
  }

  const filteredProjects = activeCategory === 'all' ? data.portfolio : data.portfolio.filter(p => p.category === activeCategory);

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <style>{`
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: 0.5s; }
        .btn-shine:hover::after { left: 100%; }
      `}</style>
      
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 font-sans selection:bg-purple-500 selection:text-white">
        
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} onAdminTrigger={handleLogoClick} />

        <main className="pt-20">
          <section id="about" className="relative py-20 lg:py-32 overflow-hidden">
            <div className="absolute top-20 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[4000ms]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[5000ms]" />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 animate-in slide-in-from-left duration-1000 fade-in">
                  <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                    Hello, I'm <br/>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                      {data?.profile?.name ? data.profile.name.split(" ")[0] : "Janikashree"}
                    </span>
                  </h1>
                  <div className="h-8 md:h-12 overflow-hidden">
                    <p className="text-2xl md:text-4xl font-bold text-gray-400 dark:text-gray-500 transition-all duration-500 transform translate-y-0">
                      I am a {data?.profile?.roles && data.profile.roles.length > 0 ? data.profile.roles[currentRoleIndex] : "Creative Designer"}
                    </p>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">{data.profile.shortBio}</p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <a href={data.profile.resumeLink} className="btn-shine flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-bold hover:scale-105 transition-transform shadow-xl"><Download size={20} /> Resume</a>
                    <div className="flex gap-2">
                      <a href={data.profile.linkedin} className="p-4 rounded-full border border-gray-200 dark:border-gray-800 hover:border-purple-500 transition-colors"><Linkedin size={20} /></a>
                      <a href={`mailto:${data.profile.email}`} className="p-4 rounded-full border border-gray-200 dark:border-gray-800 hover:border-purple-500 transition-colors"><Mail size={20} /></a>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100 dark:border-gray-800/50">
                    {data.stats.map((stat, i) => (
                      <div key={i}>
                        <h4 className="text-3xl font-black">{stat.value}</h4>
                        <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative hidden lg:block animate-in slide-in-from-right duration-1000 fade-in delay-200">
                  <div className="relative aspect-square w-full max-w-lg mx-auto animate-float">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-[3rem] rotate-6 opacity-20 animate-pulse" />
                    <div className="absolute inset-4 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 shadow-2xl flex items-center justify-center overflow-hidden">
                       <Layers className="w-24 h-24 text-purple-500 drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="services" className="py-24 bg-gray-50 dark:bg-gray-900/50">
             <div className="max-w-7xl mx-auto px-6">
                <FadeIn>
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-6">My Creative Arsenal</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">I wear multiple hats to ensure your project looks great.</p>
                  </div>
                </FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data.services.map((service, i) => (
                    <FadeIn key={service.id} delay={i * 100}>
                      <div className="p-8 h-full rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-purple-500 transition-all hover:shadow-xl group hover:-translate-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                           {ICON_MAP[service.icon] || <Layout />}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{service.desc}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
                <FadeIn delay={300}>
                  <div className="mt-20">
                    <h3 className="text-xl font-bold text-center mb-12 text-gray-400 uppercase tracking-widest text-sm">Software Proficiency</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 justify-items-center">
                      {data.software.map((tool, idx) => (
                        <div key={idx} className="group flex flex-col items-center justify-center gap-4 cursor-pointer">
                          <div className="relative w-28 h-28 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                            <div className="absolute inset-0 rounded-full border border-dashed border-gray-300 dark:border-gray-700 animate-[spin_10s_linear_infinite]"></div>
                            <div className="relative z-10 w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm group-hover:bg-purple-50 transition-all border border-gray-100 dark:border-gray-700">
                               {tool.category === 'Video' ? <Video className="w-6 h-6 text-gray-400 group-hover:text-purple-500" /> : <Palette className="w-6 h-6 text-gray-400 group-hover:text-pink-500" />}
                            </div>
                          </div>
                          <span className="block font-bold text-base text-gray-900 dark:text-white group-hover:text-purple-500">{tool.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeIn>
             </div>
          </section>

          <section id="portfolio" className="py-24">
            <div className="max-w-7xl mx-auto px-6">
              <FadeIn>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black mb-4">Featured Work</h2>
                    <p className="text-gray-500">A selection of my best projects.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'uiux', 'video', 'graphic', 'animation'].map((cat) => (
                      <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full text-sm font-bold capitalize transition-all ${activeCategory === cat ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                        {cat === 'uiux' ? 'UI/UX' : cat}
                      </button>
                    ))}
                  </div>
                </div>
              </FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, i) => (
                  <FadeIn key={project.id} delay={i * 100}>
                    <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="py-24 bg-gray-900 dark:bg-black text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
              <FadeIn>
                <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Let's Create <span className="text-purple-500">Magic.</span></h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                   <a href={`mailto:${data.profile.email}`} className="btn-shine w-full md:w-auto px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-3"><Mail size={22} /> {data.profile.email}</a>
                </div>
              </FadeIn>
            </div>
          </section>
        </main>
        
        <AIChatWidget data={data} />
        {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

        {showPinModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold flex items-center gap-2"><Lock className="text-purple-600" /> Admin Access</h3><button onClick={() => setShowPinModal(false)}><X /></button></div>
              <form onSubmit={handlePinSubmit}>
                <input type="password" autoFocus placeholder="Enter PIN (Default: 2427)" value={pinInput} onChange={(e) => setPinInput(e.target.value)} className="w-full p-4 text-center text-2xl tracking-[0.5em] font-bold bg-gray-100 dark:bg-slate-800 rounded-xl mb-6 focus:ring-2 focus:ring-purple-600 outline-none"/>
                <button type="submit" className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors">Unlock Editor</button>
              </form>
            </div>
          </div>
        )}

        {isAdmin && !showAdminPanel && (
          <button onClick={() => setShowAdminPanel(true)} className="fixed bottom-24 right-6 z-40 bg-slate-900 text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2 font-bold"><Edit2 size={16} /> Edit Portfolio</button>
        )}

        <AdminPanel 
          isOpen={showAdminPanel} 
          onClose={() => setShowAdminPanel(false)}
          data={data}
          onSave={(newData) => setData(newData)}
        />
      </div>
    </div>
  );
};

export default App;