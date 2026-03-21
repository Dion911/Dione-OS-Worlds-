import React, { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, CheckCircle2, Circle, ArrowRight, Save, X, Edit3, Briefcase, Target, TrendingUp, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FoundationItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Foundation {
  id: string;
  title: string;
  status: 'Strong' | 'Needs Work' | 'Not Started';
  progress: number;
  items: FoundationItem[];
}

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  status: 'past' | 'current' | 'future';
}

interface GapItem {
  id: string;
  type: 'warn' | 'gold' | 'cucu';
  title: string;
  description: string;
}

interface RoadmapItem {
  id: string;
  period: string;
  title: string;
  description: string;
}

interface StudioProfile {
  name: string;
  tagline: string;
  manifesto: string;
  originStory: string;
}

const STORAGE_KEY = 'cucu_studio_state_v1';

const INITIAL_STATE = {
  profile: {
    name: 'Cucufate',
    tagline: 'Named for your mother. Built for your legacy.',
    manifesto: 'We build things that last. We honor the craft. We tell the truth.',
    originStory: 'Founded on the principles of maternal wisdom and generational legacy.'
  },
  foundations: [
    {
      id: 'identity',
      title: 'Identity',
      status: 'Strong',
      progress: 85,
      items: [
        { id: 'i1', text: 'Studio name defined', completed: true },
        { id: 'i2', text: 'Origin story (your mother)', completed: true },
        { id: 'i3', text: 'Manifesto written', completed: true },
        { id: 'i4', text: 'Visual identity / mark', completed: false },
      ]
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      status: 'Strong',
      progress: 75,
      items: [
        { id: 'p1', text: 'CL project case studies', completed: true },
        { id: 'p2', text: 'Lota Kopi as brand proof', completed: true },
        { id: 'p3', text: 'Cucufate-branded presentation', completed: false },
        { id: 'p4', text: 'Website / folio live', completed: false },
      ]
    },
    {
      id: 'revenue',
      title: 'Revenue',
      status: 'Needs Work',
      progress: 20,
      items: [
        { id: 'r1', text: 'First client signal exists', completed: true },
        { id: 'r2', text: 'Pricing / service structure', completed: false },
        { id: 'r3', text: '6-month runway saved', completed: false },
        { id: 'r4', text: '1 paid project completed', completed: false },
      ]
    },
    {
      id: 'ops',
      title: 'Operations',
      status: 'Not Started',
      progress: 5,
      items: [
        { id: 'o1', text: 'Business registration', completed: false },
        { id: 'o2', text: 'Contract / proposal templates', completed: false },
        { id: 'o3', text: 'Project management system', completed: false },
        { id: 'o4', text: 'Studio email + tools', completed: false },
      ]
    }
  ],
  timeline: [
    { id: 't1', title: 'Concept & Story', date: 'Now', status: 'past' },
    { id: 't2', title: 'Identity & Folio', date: 'Q2 2026', status: 'current' },
    { id: 't3', title: 'First Project', date: 'Q3 2026', status: 'future' },
    { id: 't4', title: 'Runway Built', date: 'Q3 2026', status: 'future' },
    { id: 't5', title: 'Public Launch', date: 'Q1 2027', status: 'future' },
  ],
  gaps: [
    { id: 'g1', type: 'warn', title: 'Financial runway is the critical blocker', description: 'You cannot leave CL without 6 months saved. Start a dedicated Cucufate fund today.' },
    { id: 'g2', type: 'gold', title: "Portfolio exists but isn't Cucufate-branded yet", description: 'CL + Lota Kopi work is strong proof. Re-frame 3 pieces under the Cucufate lens.' },
    { id: 'g3', type: 'gold', title: 'Time protection is at risk', description: 'Corporate + Lota Kopi can consume 100% of your week. Cucufate requires a non-negotiable 90-min daily block.' },
    { id: 'g4', type: 'cucu', title: 'Story and soul are already there', description: "The name, the origin, the manifesto — most studios never have this. You already do." },
  ],
  roadmap: [
    { id: 'r1', period: 'Apr 2026', title: 'Open the Studio Fund', description: 'Separate account. Fixed contribution. Name it Cucufate.' },
    { id: 'r2', period: 'Apr–May', title: 'Reframe 3 portfolio pieces', description: 'Take best CL + Lota Kopi work. Write as Cucufate case studies.' },
    { id: 'r3', period: 'May 2026', title: 'Visual identity / mark', description: 'Define color, mark direction, and type pairing for the studio.' },
    { id: 'r4', period: 'Jun 2026', title: 'Convert first client signal', description: 'Even ₱20k — validates the studio before official launch.' },
  ],
  services: [
    { id: 's1', title: 'Brand Identity', price: '₱45,000+', description: 'Full visual system, mark, and guidelines.' },
    { id: 's2', title: 'Digital Experience', price: '₱60,000+', description: 'Web design and development for modern brands.' },
    { id: 's3', title: 'Strategic Advisory', price: '₱15,000/mo', description: 'Ongoing brand and business growth consulting.' },
  ]
};

export default function CucuPanel() {
  const [isEditing, setIsEditing] = useState(false);
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleItem = (foundationId: string, itemId: string) => {
    setState(prev => {
      const newFoundations = prev.foundations.map(f => {
        if (f.id === foundationId) {
          const newItems = f.items.map(i => i.id === itemId ? { ...i, completed: !i.completed } : i);
          const completedCount = newItems.filter(i => i.completed).length;
          const progress = Math.round((completedCount / newItems.length) * 100);
          let status: Foundation['status'] = 'Not Started';
          if (progress > 70) status = 'Strong';
          else if (progress > 0) status = 'Needs Work';
          return { ...f, items: newItems, progress, status };
        }
        return f;
      });
      return { ...prev, foundations: newFoundations };
    });
  };

  const overallProgress = state.foundations.length > 0 
    ? Math.round(state.foundations.reduce((acc: number, f: Foundation) => acc + f.progress, 0) / state.foundations.length)
    : 0;

  return (
    <div className="animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-10 border-b border-paper-3 pb-6">
        <div>
          <h1 className="font-serif text-[32px] text-ink leading-tight">{state.profile.name}</h1>
          <p className="font-sans text-[11px] text-ink-3 uppercase tracking-[0.2em] mt-1">{state.profile.tagline}</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 hover:bg-paper-2 rounded-full transition-colors text-ink-3"
        >
          {isEditing ? <X size={16} /> : <Settings size={16} />}
        </button>
      </div>

      {isEditing ? (
        <CucuEditor state={state} setState={setState} setIsEditing={setIsEditing} />
      ) : (
        <CucuDashboard state={state} overallProgress={overallProgress} toggleItem={toggleItem} setState={setState} />
      )}
    </div>
  );
}

function CucuDashboard({ state, overallProgress, toggleItem, setState }: { state: any, overallProgress: number, toggleItem: any, setState: any }) {
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState('');

  const [addingGap, setAddingGap] = useState(false);
  const [newGap, setNewGap] = useState({ type: 'gold', title: '', description: '' });

  const [addingRoadmap, setAddingRoadmap] = useState(false);
  const [newRoadmap, setNewRoadmap] = useState({ period: '', title: '', description: '' });

  const [addingTimeline, setAddingTimeline] = useState(false);
  const [newTimeline, setNewTimeline] = useState({ title: '', date: '', status: 'future' });

  const [addingService, setAddingService] = useState(false);
  const [newService, setNewService] = useState({ title: '', price: '', description: '' });

  const [editingTimelineId, setEditingTimelineId] = useState<string | null>(null);
  const [editTimeline, setEditTimeline] = useState({ title: '', date: '', status: 'future' });

  const [editingGapId, setEditingGapId] = useState<string | null>(null);
  const [editGap, setEditGap] = useState({ type: 'gold', title: '', description: '' });

  const [editingRoadmapId, setEditingRoadmapId] = useState<string | null>(null);
  const [editRoadmap, setEditRoadmap] = useState({ period: '', title: '', description: '' });

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editService, setEditService] = useState({ title: '', price: '', description: '' });

  const handleAddItem = (foundationId: string) => {
    if (!newItemText.trim()) {
      setAddingTo(null);
      return;
    }
    
    setState((prev: any) => {
      const newFoundations = prev.foundations.map((f: any) => {
        if (f.id === foundationId) {
          const newItem = { id: Date.now().toString(), text: newItemText.trim(), completed: false };
          const newItems = [...f.items, newItem];
          const completedCount = newItems.filter(i => i.completed).length;
          const progress = Math.round((completedCount / newItems.length) * 100);
          let status: Foundation['status'] = 'Not Started';
          if (progress > 70) status = 'Strong';
          else if (progress > 0) status = 'Needs Work';
          return { ...f, items: newItems, progress, status };
        }
        return f;
      });
      return { ...prev, foundations: newFoundations };
    });
    
    setNewItemText('');
    setAddingTo(null);
  };

  const handleAddGap = () => {
    if (!newGap.title.trim()) {
      setAddingGap(false);
      return;
    }
    setState((prev: any) => ({
      ...prev,
      gaps: [...(prev.gaps || []), { id: Date.now().toString(), ...newGap }]
    }));
    setNewGap({ type: 'gold', title: '', description: '' });
    setAddingGap(false);
  };

  const handleAddRoadmap = () => {
    if (!newRoadmap.title.trim()) {
      setAddingRoadmap(false);
      return;
    }
    setState((prev: any) => ({
      ...prev,
      roadmap: [...(prev.roadmap || []), { id: Date.now().toString(), ...newRoadmap }]
    }));
    setNewRoadmap({ period: '', title: '', description: '' });
    setAddingRoadmap(false);
  };

  const handleAddTimeline = () => {
    if (!newTimeline.title.trim()) {
      setAddingTimeline(false);
      return;
    }
    setState((prev: any) => ({
      ...prev,
      timeline: [...(prev.timeline || []), { id: Date.now().toString(), ...newTimeline }]
    }));
    setNewTimeline({ title: '', date: '', status: 'future' });
    setAddingTimeline(false);
  };

  const handleAddService = () => {
    if (!newService.title.trim()) {
      setAddingService(false);
      return;
    }
    setState((prev: any) => ({
      ...prev,
      services: [...(prev.services || []), { id: Date.now().toString(), ...newService }]
    }));
    setNewService({ title: '', price: '', description: '' });
    setAddingService(false);
  };

  const handleDeleteTimeline = (id: string) => {
    setState((prev: any) => ({ ...prev, timeline: prev.timeline.filter((t: any) => t.id !== id) }));
  };

  const handleDeleteGap = (id: string) => {
    setState((prev: any) => ({ ...prev, gaps: prev.gaps.filter((g: any) => g.id !== id) }));
  };

  const handleDeleteRoadmap = (id: string) => {
    setState((prev: any) => ({ ...prev, roadmap: prev.roadmap.filter((r: any) => r.id !== id) }));
  };

  const handleDeleteService = (id: string) => {
    setState((prev: any) => ({ ...prev, services: prev.services.filter((s: any) => s.id !== id) }));
  };

  const handleSaveTimeline = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      timeline: prev.timeline.map((t: any) => t.id === id ? { ...t, ...editTimeline } : t)
    }));
    setEditingTimelineId(null);
  };

  const handleSaveGap = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      gaps: prev.gaps.map((g: any) => g.id === id ? { ...g, ...editGap } : g)
    }));
    setEditingGapId(null);
  };

  const handleSaveRoadmap = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      roadmap: prev.roadmap.map((r: any) => r.id === id ? { ...r, ...editRoadmap } : r)
    }));
    setEditingRoadmapId(null);
  };

  const handleSaveService = (id: string) => {
    setState((prev: any) => ({
      ...prev,
      services: prev.services.map((s: any) => s.id === id ? { ...s, ...editService } : s)
    }));
    setEditingServiceId(null);
  };

  const removeFoundationItem = (foundationId: string, itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setState((prev: any) => {
      const newFoundations = prev.foundations.map((f: any) => {
        if (f.id === foundationId) {
          const newItems = f.items.filter((i: any) => i.id !== itemId);
          const completedCount = newItems.filter(i => i.completed).length;
          const progress = newItems.length > 0 ? Math.round((completedCount / newItems.length) * 100) : 0;
          let status: Foundation['status'] = 'Not Started';
          if (progress > 70) status = 'Strong';
          else if (progress > 0) status = 'Needs Work';
          return { ...f, items: newItems, progress, status };
        }
        return f;
      });
      return { ...prev, foundations: newFoundations };
    });
  };

  return (
    <div className="space-y-8 pb-8">
      {/* LAUNCH READINESS */}
      <section>
        <h2 className="text-[11px] tracking-[0.2em] uppercase text-ink-3 mb-4 font-sans">Launch Readiness</h2>
        <div className="flex items-center gap-6 px-5 py-4 bg-paper-2 rounded-md border border-paper-3">
          <div className="shrink-0 flex flex-col items-center">
            <svg width="90" height="56" viewBox="0 0 110 70">
              <path d="M10 65 A 50 50 0 0 1 100 65" fill="none" stroke="var(--color-paper-3)" strokeWidth="5" strokeLinecap="round"/>
              <path 
                d="M10 65 A 50 50 0 0 1 100 65" 
                fill="none" 
                stroke="var(--color-cucu)" 
                strokeWidth="5" 
                strokeLinecap="round" 
                strokeDasharray="157" 
                strokeDashoffset={157 - (157 * overallProgress / 100)}
                className="transition-all duration-1000 ease-out"
              />
              <text x="55" y="50" textAnchor="middle" fill="var(--color-cucu)" fontSize="24" fontFamily="Cormorant Garamond,serif" fontWeight="500">{overallProgress}%</text>
            </svg>
          </div>
          <div className="font-sans text-[13px] text-ink-2 leading-relaxed flex-1">
            {overallProgress < 50 ? (
              <>You have the hardest things: <strong className="text-ink font-medium">the name, the story, and the vision.</strong> What remains is structural — runway, identity mark, and one public moment.</>
            ) : (
              <>The structure is forming. <strong className="text-ink font-medium">Identity and Portfolio are solidifying.</strong> Focus now on the financial runway and operational templates to ensure a clean break.</>
            )}
          </div>
        </div>
      </section>

      {/* FOUNDATIONS GRID */}
      <section>
        <h2 className="text-[11px] tracking-[0.2em] uppercase text-ink-3 mb-4 font-sans">Foundations</h2>
        <div className="grid grid-cols-2 gap-3">
          {state.foundations.map((f: Foundation) => (
            <div key={f.id} className="bg-paper-2 p-4 rounded-md border border-paper-3">
              <div className="flex justify-between items-center mb-3">
                <div className="font-serif text-[16px] text-ink">{f.title}</div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setAddingTo(addingTo === f.id ? null : f.id)}
                    className={`w-6 h-6 flex items-center justify-center rounded-full transition-all ${addingTo === f.id ? 'bg-ink text-white rotate-45' : 'bg-paper text-ink-3 hover:bg-cucu hover:text-white border border-paper-3'}`}
                  >
                    <Plus size={12} />
                  </button>
                  <span className={`font-sans text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm ${
                    f.status === 'Strong' ? 'bg-cucu-3 text-cucu-2' : 
                    f.status === 'Needs Work' ? 'bg-[#fdf0e0] text-[#7a4a00]' : 
                    'bg-paper-3 text-ink-3'
                  }`}>{f.status}</span>
                </div>
              </div>
              <div className="h-[2px] bg-paper-3 rounded-full overflow-hidden mb-4">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    f.status === 'Strong' ? 'bg-cucu' : 
                    f.status === 'Needs Work' ? 'bg-gold' : 
                    'bg-paper-4'
                  }`} 
                  style={{ width: `${f.progress}%` }}
                ></div>
              </div>
              
              <AnimatePresence>
                {addingTo === f.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3 overflow-hidden"
                  >
                    <div className="flex gap-2">
                      <input 
                        autoFocus
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem(f.id)}
                        placeholder="New item..."
                        className="flex-1 bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu"
                      />
                      <button 
                        onClick={() => handleAddItem(f.id)}
                        className="bg-cucu text-white px-3 py-1.5 rounded font-sans text-[11px] uppercase tracking-wider font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                {f.items.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => toggleItem(f.id, item.id)}
                    className={`flex gap-3 font-sans text-[12px] py-1 leading-relaxed cursor-pointer group transition-colors ${item.completed ? 'text-cucu' : 'text-ink-3 hover:text-ink-2'}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 transition-colors ${item.completed ? 'bg-cucu' : 'bg-paper-3 group-hover:bg-paper-4'}`}></div>
                    <span className="flex-1">{item.text}</span>
                    <button 
                      onClick={(e) => removeFoundationItem(f.id, item.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-ink-3 hover:text-red-500 transition-opacity p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LAUNCH ARC */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[11px] tracking-[0.2em] uppercase text-ink-3 font-sans">Launch Arc</h2>
          <button onClick={() => setAddingTimeline(!addingTimeline)} className="text-ink-3 hover:text-cucu transition-colors p-1">
            <Plus size={14} className={`transition-transform ${addingTimeline ? "rotate-45" : ""}`} />
          </button>
        </div>

        <AnimatePresence>
          {addingTimeline && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
              <div className="bg-paper-2 p-3 rounded-md border border-paper-3 space-y-2">
                <div className="flex gap-2">
                  <select value={newTimeline.status} onChange={e => setNewTimeline({...newTimeline, status: e.target.value as any})} className="bg-paper border border-paper-3 rounded px-2 py-1.5 font-sans text-[12px] outline-none focus:border-cucu">
                    <option value="past">Completed</option>
                    <option value="current">Active</option>
                    <option value="future">Upcoming</option>
                  </select>
                  <input autoFocus value={newTimeline.title} onChange={e => setNewTimeline({...newTimeline, title: e.target.value})} placeholder="Event Title" className="flex-1 bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu" />
                  <input value={newTimeline.date} onChange={e => setNewTimeline({...newTimeline, date: e.target.value})} placeholder="Date (e.g. Q3 2026)" className="w-32 bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu" />
                </div>
                <div className="flex justify-end">
                  <button onClick={handleAddTimeline} className="bg-cucu text-white px-4 py-1.5 rounded font-sans text-[11px] uppercase tracking-wider font-medium">Add Event</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative px-2 mt-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="min-w-full relative">
            <div className="absolute top-[5px] left-0 right-0 h-[1px] bg-paper-3"></div>
            <div className="flex justify-between relative z-10 gap-8 min-w-max">
              {state.timeline.map((event: TimelineEvent) => (
                editingTimelineId === event.id ? (
                  <div key={event.id} className="flex flex-col items-center w-32 shrink-0 bg-paper-2 p-2 rounded-md border border-paper-3 z-20">
                    <select value={editTimeline.status} onChange={e => setEditTimeline({...editTimeline, status: e.target.value as any})} className="w-full mb-1 bg-paper border border-paper-3 rounded px-1 py-1 font-sans text-[10px] outline-none focus:border-cucu">
                      <option value="past">Completed</option>
                      <option value="current">Active</option>
                      <option value="future">Upcoming</option>
                    </select>
                    <input autoFocus value={editTimeline.title} onChange={e => setEditTimeline({...editTimeline, title: e.target.value})} placeholder="Title" className="w-full mb-1 bg-paper border border-paper-3 rounded px-1 py-1 font-sans text-[11px] outline-none focus:border-cucu text-center" />
                    <input value={editTimeline.date} onChange={e => setEditTimeline({...editTimeline, date: e.target.value})} placeholder="Date" className="w-full mb-2 bg-paper border border-paper-3 rounded px-1 py-1 font-sans text-[10px] outline-none focus:border-cucu text-center" />
                    <div className="flex gap-1 w-full">
                      <button onClick={() => setEditingTimelineId(null)} className="flex-1 bg-paper-3 text-ink-2 py-1 rounded font-sans text-[10px] uppercase font-medium">Cancel</button>
                      <button onClick={() => handleSaveTimeline(event.id)} className="flex-1 bg-cucu text-white py-1 rounded font-sans text-[10px] uppercase font-medium">Save</button>
                    </div>
                  </div>
                ) : (
                  <div 
                    key={event.id} 
                    className="flex flex-col items-center text-center w-24 shrink-0 group relative cursor-pointer"
                    onClick={() => {
                      setEditTimeline({ title: event.title, date: event.date, status: event.status });
                      setEditingTimelineId(event.id);
                    }}
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteTimeline(event.id); }}
                      className="absolute -top-6 text-ink-3 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div className={`w-[11px] h-[11px] rounded-full mb-4 transition-all ${
                      event.status === 'past' ? 'bg-cucu' : 
                      event.status === 'current' ? 'bg-gold ring-4 ring-paper ring-offset-0' : 
                      'bg-paper border border-paper-3'
                    }`}></div>
                    <div className="font-serif text-[15px] text-ink leading-tight mb-1 group-hover:text-cucu transition-colors">{event.title}</div>
                    <div className="font-sans text-[10px] uppercase tracking-wider text-ink-3">{event.date}</div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GAP ANALYSIS */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[11px] tracking-[0.2em] uppercase text-ink-3 font-sans">Gap Analysis</h2>
          <button onClick={() => setAddingGap(!addingGap)} className="text-ink-3 hover:text-cucu transition-colors p-1">
            <Plus size={14} className={`transition-transform ${addingGap ? "rotate-45" : ""}`} />
          </button>
        </div>
        
        <AnimatePresence>
          {addingGap && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
              <div className="bg-paper-2 p-3 rounded-md border border-paper-3 space-y-2">
                <div className="flex gap-2">
                  <select value={newGap.type} onChange={e => setNewGap({...newGap, type: e.target.value as any})} className="bg-paper border border-paper-3 rounded px-2 py-1.5 font-sans text-[12px] outline-none focus:border-cucu">
                    <option value="warn">Warning</option>
                    <option value="gold">Insight</option>
                    <option value="cucu">Success</option>
                  </select>
                  <input autoFocus value={newGap.title} onChange={e => setNewGap({...newGap, title: e.target.value})} placeholder="Gap Title" className="flex-1 bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu" />
                </div>
                <textarea value={newGap.description} onChange={e => setNewGap({...newGap, description: e.target.value})} placeholder="Description" rows={2} className="w-full bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu resize-none" />
                <div className="flex justify-end">
                  <button onClick={handleAddGap} className="bg-cucu text-white px-4 py-1.5 rounded font-sans text-[11px] uppercase tracking-wider font-medium">Add Gap</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-0.5">
          {state.gaps.map((gap: GapItem) => (
            editingGapId === gap.id ? (
              <div key={gap.id} className="bg-paper-2 p-3 rounded-md border border-paper-3 space-y-2 mb-2">
                <div className="flex gap-2">
                  <select value={editGap.type} onChange={e => setEditGap({...editGap, type: e.target.value as any})} className="bg-paper border border-paper-3 rounded px-2 py-1.5 font-sans text-[12px] outline-none focus:border-cucu">
                    <option value="warn">Warning</option>
                    <option value="gold">Insight</option>
                    <option value="cucu">Success</option>
                  </select>
                  <input autoFocus value={editGap.title} onChange={e => setEditGap({...editGap, title: e.target.value})} placeholder="Gap Title" className="flex-1 bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu" />
                </div>
                <textarea value={editGap.description} onChange={e => setEditGap({...editGap, description: e.target.value})} placeholder="Description" rows={2} className="w-full bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu resize-none" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditingGapId(null)} className="bg-paper-3 text-ink-2 px-4 py-1.5 rounded font-sans text-[11px] uppercase tracking-wider font-medium">Cancel</button>
                  <button onClick={() => handleSaveGap(gap.id)} className="bg-cucu text-white px-4 py-1.5 rounded font-sans text-[11px] uppercase tracking-wider font-medium">Save</button>
                </div>
              </div>
            ) : (
              <div 
                key={gap.id} 
                className="flex gap-4 items-start py-4 border-b border-paper-3 last:border-none group cursor-pointer hover:bg-paper-2 -mx-2 px-2 rounded transition-colors"
                onClick={() => {
                  setEditGap({ type: gap.type, title: gap.title, description: gap.description });
                  setEditingGapId(gap.id);
                }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[14px] shrink-0 mt-0.5 ${
                  gap.type === 'warn' ? 'bg-warn text-white' : 
                  gap.type === 'gold' ? 'bg-gold text-white' : 
                  'bg-cucu text-white'
                }`}>
                  {gap.type === 'warn' ? '!' : gap.type === 'gold' ? '~' : '✓'}
                </div>
                <div className="flex-1">
                  <div className="font-serif text-[16px] text-ink mb-1 group-hover:text-cucu transition-colors">{gap.title}</div>
                  <div className="font-sans text-[13px] text-ink-2 leading-relaxed">{gap.description}</div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteGap(gap.id); }}
                  className="opacity-0 group-hover:opacity-100 text-ink-3 hover:text-red-500 transition-opacity p-2"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          ))}
        </div>
      </section>

      {/* NEXT 90 DAYS */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[11px] tracking-[0.2em] uppercase text-ink-3 font-sans">Next 90 Days</h2>
          <button onClick={() => setAddingRoadmap(!addingRoadmap)} className="text-ink-3 hover:text-cucu transition-colors p-1">
            <Plus size={14} className={`transition-transform ${addingRoadmap ? "rotate-45" : ""}`} />
          </button>
        </div>

        <AnimatePresence>
          {addingRoadmap && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
              <div className="bg-paper-2 p-3 rounded-md border border-paper-3 space-y-2">
                <div className="flex gap-2">
                  <input autoFocus value={newRoadmap.period} onChange={e => setNewRoadmap({...newRoadmap, period: e.target.value})} placeholder="Period (e.g. Q3)" className="w-24 bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu" />
                  <input value={newRoadmap.title} onChange={e => setNewRoadmap({...newRoadmap, title: e.target.value})} placeholder="Roadmap Title" className="flex-1 bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu" />
                </div>
                <textarea value={newRoadmap.description} onChange={e => setNewRoadmap({...newRoadmap, description: e.target.value})} placeholder="Description" rows={2} className="w-full bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu resize-none" />
                <div className="flex justify-end">
                  <button onClick={handleAddRoadmap} className="bg-cucu text-white px-4 py-1.5 rounded font-sans text-[11px] uppercase tracking-wider font-medium">Add Item</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-0.5">
          {state.roadmap.map((item: RoadmapItem) => (
            editingRoadmapId === item.id ? (
              <div key={item.id} className="bg-paper-2 p-3 rounded-md border border-paper-3 space-y-2 mb-2">
                <div className="flex gap-2">
                  <input autoFocus value={editRoadmap.period} onChange={e => setEditRoadmap({...editRoadmap, period: e.target.value})} placeholder="Period (e.g. Q3)" className="w-24 bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu" />
                  <input value={editRoadmap.title} onChange={e => setEditRoadmap({...editRoadmap, title: e.target.value})} placeholder="Roadmap Title" className="flex-1 bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu" />
                </div>
                <textarea value={editRoadmap.description} onChange={e => setEditRoadmap({...editRoadmap, description: e.target.value})} placeholder="Description" rows={2} className="w-full bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu resize-none" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditingRoadmapId(null)} className="bg-paper-3 text-ink-2 px-4 py-1.5 rounded font-sans text-[11px] uppercase tracking-wider font-medium">Cancel</button>
                  <button onClick={() => handleSaveRoadmap(item.id)} className="bg-cucu text-white px-4 py-1.5 rounded font-sans text-[11px] uppercase tracking-wider font-medium">Save</button>
                </div>
              </div>
            ) : (
              <div 
                key={item.id} 
                className="flex gap-4 py-4 border-b border-paper-3 last:border-none group cursor-pointer hover:bg-paper-2 -mx-2 px-2 rounded transition-colors"
                onClick={() => {
                  setEditRoadmap({ period: item.period, title: item.title, description: item.description });
                  setEditingRoadmapId(item.id);
                }}
              >
                <div className="font-sans text-[11px] text-ink-3 min-w-[70px] pt-1 uppercase tracking-wider">{item.period}</div>
                <div className="flex-1">
                  <div className="font-serif text-[16px] text-ink mb-1 group-hover:text-cucu transition-colors">{item.title}</div>
                  <div className="font-sans text-[13px] text-ink-2 leading-relaxed">{item.description}</div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteRoadmap(item.id); }}
                  className="opacity-0 group-hover:opacity-100 text-ink-3 hover:text-red-500 transition-opacity p-2"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          ))}
        </div>
      </section>

      {/* SERVICES & PRICING */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[11px] tracking-[0.2em] uppercase text-ink-3 font-sans">Services & Pricing</h2>
          <button onClick={() => setAddingService(!addingService)} className="text-ink-3 hover:text-cucu transition-colors p-1">
            <Plus size={14} className={`transition-transform ${addingService ? "rotate-45" : ""}`} />
          </button>
        </div>

        <AnimatePresence>
          {addingService && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
              <div className="bg-paper-2 p-3 rounded-md border border-paper-3 space-y-2">
                <div className="flex gap-2">
                  <input autoFocus value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} placeholder="Service Title" className="flex-1 bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu" />
                  <input value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} placeholder="Price" className="w-24 bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu" />
                </div>
                <textarea value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} placeholder="Description" rows={2} className="w-full bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu resize-none" />
                <div className="flex justify-end">
                  <button onClick={handleAddService} className="bg-cucu text-white px-4 py-1.5 rounded font-sans text-[11px] uppercase tracking-wider font-medium">Add Service</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-3">
          {state.services?.map((service: any) => (
            editingServiceId === service.id ? (
              <div key={service.id} className="bg-paper-2 p-3 rounded-md border border-paper-3 space-y-2 mb-2">
                <div className="flex gap-2">
                  <input autoFocus value={editService.title} onChange={e => setEditService({...editService, title: e.target.value})} placeholder="Service Title" className="flex-1 bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu" />
                  <input value={editService.price} onChange={e => setEditService({...editService, price: e.target.value})} placeholder="Price" className="w-24 bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu" />
                </div>
                <textarea value={editService.description} onChange={e => setEditService({...editService, description: e.target.value})} placeholder="Description" rows={2} className="w-full bg-paper border border-paper-3 rounded px-3 py-1.5 font-sans text-[12px] outline-none focus:border-cucu resize-none" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditingServiceId(null)} className="bg-paper-3 text-ink-2 px-4 py-1.5 rounded font-sans text-[11px] uppercase tracking-wider font-medium">Cancel</button>
                  <button onClick={() => handleSaveService(service.id)} className="bg-cucu text-white px-4 py-1.5 rounded font-sans text-[11px] uppercase tracking-wider font-medium">Save</button>
                </div>
              </div>
            ) : (
              <div 
                key={service.id} 
                className="bg-paper-2 p-4 border border-paper-3 rounded-md flex justify-between items-start group hover:bg-paper-3 transition-colors relative cursor-pointer"
                onClick={() => {
                  setEditService({ title: service.title, price: service.price, description: service.description });
                  setEditingServiceId(service.id);
                }}
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteService(service.id); }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-ink-3 hover:text-red-500 transition-opacity p-1"
                >
                  <Trash2 size={14} />
                </button>
                <div className="flex-1 pr-6">
                  <div className="font-serif text-[16px] text-ink mb-1 group-hover:text-cucu transition-colors">{service.title}</div>
                  <div className="font-sans text-[12px] text-ink-2 leading-relaxed max-w-md">{service.description}</div>
                </div>
                <div className="font-serif italic text-cucu text-[15px] ml-4 whitespace-nowrap">{service.price}</div>
              </div>
            )
          ))}
        </div>
      </section>
    </div>
  );
}

function CucuEditor({ state, setState, setIsEditing }: { state: any, setState: any, setIsEditing: (val: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'foundations' | 'timeline' | 'roadmap' | 'services' | 'gaps'>('profile');

  const updateProfile = (field: string, value: string) => {
    setState((prev: any) => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
  };

  const addFoundationCategory = () => {
    setState((prev: any) => ({
      ...prev,
      foundations: [...(prev.foundations || []), { id: Date.now().toString(), title: 'New Category', status: 'Not Started', progress: 0, items: [] }]
    }));
  };

  const addFoundationItem = (foundationId: string) => {
    setState((prev: any) => {
      const newFoundations = prev.foundations.map((f: any) => {
        if (f.id === foundationId) {
          const newItem = { id: Date.now().toString(), text: '', completed: false };
          const newItems = [...f.items, newItem];
          const completedCount = newItems.filter(i => i.completed).length;
          const progress = newItems.length > 0 ? Math.round((completedCount / newItems.length) * 100) : 0;
          return { ...f, items: newItems, progress };
        }
        return f;
      });
      return { ...prev, foundations: newFoundations };
    });
  };

  const removeFoundationItem = (foundationId: string, itemId: string) => {
    setState((prev: any) => {
      const newFoundations = prev.foundations.map((f: any) => {
        if (f.id === foundationId) {
          const newItems = f.items.filter((i: any) => i.id !== itemId);
          const completedCount = newItems.filter(i => i.completed).length;
          const progress = newItems.length > 0 ? Math.round((completedCount / newItems.length) * 100) : 0;
          return { ...f, items: newItems, progress };
        }
        return f;
      });
      return { ...prev, foundations: newFoundations };
    });
  };

  const addTimelineEvent = () => {
    setState((prev: any) => ({
      ...prev,
      timeline: [...(prev.timeline || []), { id: Date.now().toString(), title: '', date: '', status: 'future' }]
    }));
  };

  const addRoadmapItem = () => {
    setState((prev: any) => ({
      ...prev,
      roadmap: [...(prev.roadmap || []), { id: Date.now().toString(), period: '', title: '', description: '' }]
    }));
  };

  const addService = () => {
    setState((prev: any) => ({
      ...prev,
      services: [...(prev.services || []), { id: Date.now().toString(), title: '', price: '', description: '' }]
    }));
  };

  const addGap = () => {
    setState((prev: any) => ({
      ...prev,
      gaps: [...(prev.gaps || []), { id: Date.now().toString(), type: 'gold', title: '', description: '' }]
    }));
  };

  return (
    <div className="bg-paper-2 rounded-xl border border-paper-3 overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="flex border-b border-paper-3 bg-paper overflow-x-auto scrollbar-hide">
        {(['profile', 'foundations', 'timeline', 'roadmap', 'services', 'gaps'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[80px] py-2 text-[12px] uppercase tracking-widest font-bold transition-colors ${activeTab === tab ? 'text-cucu bg-cucu-3' : 'text-ink-3 hover:text-ink-2'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-4 max-h-[400px] overflow-y-auto">
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div>
              <label className="text-[12px] uppercase tracking-widest text-ink-3 mb-1 block">Studio Name</label>
              <input 
                value={state.profile.name}
                onChange={e => updateProfile('name', e.target.value)}
                className="w-full bg-white border border-paper-3 px-3 py-2 rounded-lg text-[14px] outline-none focus:border-cucu"
              />
            </div>
            <div>
              <label className="text-[12px] uppercase tracking-widest text-ink-3 mb-1 block">Tagline</label>
              <input 
                value={state.profile.tagline}
                onChange={e => updateProfile('tagline', e.target.value)}
                className="w-full bg-white border border-paper-3 px-3 py-2 rounded-lg text-[14px] outline-none focus:border-cucu"
              />
            </div>
            <div>
              <label className="text-[12px] uppercase tracking-widest text-ink-3 mb-1 block">Manifesto</label>
              <textarea 
                value={state.profile.manifesto}
                onChange={e => updateProfile('manifesto', e.target.value)}
                rows={3}
                className="w-full bg-white border border-paper-3 px-3 py-2 rounded-lg text-[14px] outline-none focus:border-cucu resize-none"
              />
            </div>
            <div>
              <label className="text-[12px] uppercase tracking-widest text-ink-3 mb-1 block">Origin Story</label>
              <textarea 
                value={state.profile.originStory}
                onChange={e => updateProfile('originStory', e.target.value)}
                rows={3}
                className="w-full bg-white border border-paper-3 px-3 py-2 rounded-lg text-[14px] outline-none focus:border-cucu resize-none"
              />
            </div>
          </div>
        )}

        {activeTab === 'foundations' && (
          <div className="space-y-6">
            <button 
              onClick={addFoundationCategory}
              className="w-full py-2 border-2 border-dashed border-paper-3 text-ink-3 text-[13px] uppercase tracking-widest font-bold hover:border-cucu hover:text-cucu transition-all rounded-lg"
            >
              + Add Category
            </button>
            {state.foundations.map((f: Foundation, fIdx: number) => (
              <div key={f.id} className="space-y-2 p-3 bg-white rounded-lg border border-paper-3 relative group/cat">
                <button 
                  onClick={() => {
                    setState((prev: any) => ({
                      ...prev,
                      foundations: prev.foundations.filter((cat: any) => cat.id !== f.id)
                    }));
                  }}
                  className="absolute top-3 right-3 text-ink-3 hover:text-red-500 opacity-0 group-hover/cat:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
                <div className="flex justify-between items-center pr-8">
                  <input 
                    value={f.title}
                    onChange={e => {
                      setState((prev: any) => {
                        const newFoundations = [...prev.foundations];
                        newFoundations[fIdx] = { ...newFoundations[fIdx], title: e.target.value };
                        return { ...prev, foundations: newFoundations };
                      });
                    }}
                    placeholder="Category Title"
                    className="text-[14px] font-bold uppercase tracking-wider text-cucu bg-transparent outline-none border-b border-transparent focus:border-cucu-3 w-full"
                  />
                </div>
                <div className="space-y-1 mt-2">
                  {f.items.map((item, iIdx) => (
                    <div key={item.id} className="flex items-center gap-2 group">
                      <input 
                        value={item.text}
                        onChange={e => {
                          setState((prev: any) => {
                            const newFoundations = [...prev.foundations];
                            const newItems = [...newFoundations[fIdx].items];
                            newItems[iIdx] = { ...newItems[iIdx], text: e.target.value };
                            newFoundations[fIdx] = { ...newFoundations[fIdx], items: newItems };
                            return { ...prev, foundations: newFoundations };
                          });
                        }}
                        placeholder="Task description"
                        className="flex-1 text-[14px] text-ink bg-paper-2 border border-paper-3 px-2 py-1 rounded outline-none focus:border-cucu"
                      />
                      <button 
                        onClick={() => removeFoundationItem(f.id, item.id)}
                        className="text-ink-3 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => addFoundationItem(f.id)} 
                    className="text-[12px] text-ink-3 hover:text-cucu flex items-center gap-1 mt-2 py-1"
                  >
                    <Plus size={12} /> Add Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <button 
              onClick={addTimelineEvent}
              className="w-full py-2 border-2 border-dashed border-paper-3 text-ink-3 text-[13px] uppercase tracking-widest font-bold hover:border-cucu hover:text-cucu transition-all rounded-lg"
            >
              + Add Timeline Event
            </button>
            {state.timeline.map((event: TimelineEvent, idx: number) => (
              <div key={event.id} className="p-3 bg-white rounded-lg border border-paper-3 space-y-2 relative group">
                <button 
                  onClick={() => {
                    setState((prev: any) => ({
                      ...prev,
                      timeline: prev.timeline.filter((t: any) => t.id !== event.id)
                    }));
                  }}
                  className="absolute top-2 right-2 text-ink-3 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
                <div className="flex gap-2 pr-6">
                  <input 
                    value={event.title}
                    onChange={e => {
                      setState((prev: any) => {
                        const newTimeline = [...prev.timeline];
                        newTimeline[idx] = { ...newTimeline[idx], title: e.target.value };
                        return { ...prev, timeline: newTimeline };
                      });
                    }}
                    placeholder="Event Title"
                    className="flex-1 bg-paper-2 border border-paper-3 px-2 py-1 text-[14px] rounded"
                  />
                  <input 
                    value={event.date}
                    onChange={e => {
                      setState((prev: any) => {
                        const newTimeline = [...prev.timeline];
                        newTimeline[idx] = { ...newTimeline[idx], date: e.target.value };
                        return { ...prev, timeline: newTimeline };
                      });
                    }}
                    placeholder="Date/Time"
                    className="w-24 bg-paper-2 border border-paper-3 px-2 py-1 text-[14px] rounded"
                  />
                </div>
                <select 
                  value={event.status}
                  onChange={e => {
                    setState((prev: any) => {
                      const newTimeline = [...prev.timeline];
                      newTimeline[idx] = { ...newTimeline[idx], status: e.target.value as any };
                      return { ...prev, timeline: newTimeline };
                    });
                  }}
                  className="w-full bg-paper-2 border border-paper-3 px-2 py-1 text-[14px] rounded"
                >
                  <option value="past">Completed</option>
                  <option value="current">Active</option>
                  <option value="future">Upcoming</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="space-y-4">
            <button 
              onClick={addRoadmapItem}
              className="w-full py-2 border-2 border-dashed border-paper-3 text-ink-3 text-[13px] uppercase tracking-widest font-bold hover:border-cucu hover:text-cucu transition-all rounded-lg"
            >
              + Add Roadmap Item
            </button>
            {state.roadmap.map((item: RoadmapItem, idx: number) => (
              <div key={item.id} className="p-3 bg-white rounded-lg border border-paper-3 space-y-2 relative group">
                <button 
                  onClick={() => {
                    setState((prev: any) => ({
                      ...prev,
                      roadmap: prev.roadmap.filter((r: any) => r.id !== item.id)
                    }));
                  }}
                  className="absolute top-2 right-2 text-ink-3 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
                <div className="flex gap-2 pr-6">
                  <input 
                    value={item.period}
                    onChange={e => {
                      setState((prev: any) => {
                        const newRoadmap = [...prev.roadmap];
                        newRoadmap[idx] = { ...newRoadmap[idx], period: e.target.value };
                        return { ...prev, roadmap: newRoadmap };
                      });
                    }}
                    placeholder="Period (e.g. Q3)"
                    className="w-24 bg-paper-2 border border-paper-3 px-2 py-1 text-[14px] rounded"
                  />
                  <input 
                    value={item.title}
                    onChange={e => {
                      setState((prev: any) => {
                        const newRoadmap = [...prev.roadmap];
                        newRoadmap[idx] = { ...newRoadmap[idx], title: e.target.value };
                        return { ...prev, roadmap: newRoadmap };
                      });
                    }}
                    placeholder="Title"
                    className="flex-1 bg-paper-2 border border-paper-3 px-2 py-1 text-[14px] rounded"
                  />
                </div>
                <textarea 
                  value={item.description}
                  onChange={e => {
                    setState((prev: any) => {
                      const newRoadmap = [...prev.roadmap];
                      newRoadmap[idx] = { ...newRoadmap[idx], description: e.target.value };
                      return { ...prev, roadmap: newRoadmap };
                    });
                  }}
                  placeholder="Description"
                  rows={2}
                  className="w-full bg-paper-2 border border-paper-3 px-2 py-1 text-[13px] rounded resize-none"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-4">
            <button 
              onClick={addService}
              className="w-full py-2 border-2 border-dashed border-paper-3 text-ink-3 text-[13px] uppercase tracking-widest font-bold hover:border-cucu hover:text-cucu transition-all rounded-lg"
            >
              + Add Service
            </button>
            {state.services?.map((service: any, idx: number) => (
              <div key={service.id} className="p-3 bg-white rounded-lg border border-paper-3 space-y-2 group relative">
                <button 
                  onClick={() => {
                    setState((prev: any) => ({
                      ...prev,
                      services: prev.services.filter((s: any) => s.id !== service.id)
                    }));
                  }}
                  className="absolute top-2 right-2 text-ink-3 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
                <div className="flex gap-2 pr-6">
                  <input 
                    value={service.title}
                    onChange={e => {
                      setState((prev: any) => {
                        const newServices = [...prev.services];
                        newServices[idx] = { ...newServices[idx], title: e.target.value };
                        return { ...prev, services: newServices };
                      });
                    }}
                    placeholder="Service Title"
                    className="flex-1 bg-paper-2 border border-paper-3 px-2 py-1 text-[14px] rounded"
                  />
                  <input 
                    value={service.price}
                    onChange={e => {
                      setState((prev: any) => {
                        const newServices = [...prev.services];
                        newServices[idx] = { ...newServices[idx], price: e.target.value };
                        return { ...prev, services: newServices };
                      });
                    }}
                    placeholder="Price"
                    className="w-24 bg-paper-2 border border-paper-3 px-2 py-1 text-[14px] rounded"
                  />
                </div>
                <textarea 
                  value={service.description}
                  onChange={e => {
                    setState((prev: any) => {
                      const newServices = [...prev.services];
                      newServices[idx] = { ...newServices[idx], description: e.target.value };
                      return { ...prev, services: newServices };
                    });
                  }}
                  placeholder="Description"
                  rows={2}
                  className="w-full bg-paper-2 border border-paper-3 px-2 py-1 text-[13px] rounded resize-none"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'gaps' && (
          <div className="space-y-4">
            <button 
              onClick={addGap}
              className="w-full py-2 border-2 border-dashed border-paper-3 text-ink-3 text-[13px] uppercase tracking-widest font-bold hover:border-cucu hover:text-cucu transition-all rounded-lg"
            >
              + Add Gap Analysis Item
            </button>
            {state.gaps?.map((gap: any, idx: number) => (
              <div key={gap.id} className="p-3 bg-white rounded-lg border border-paper-3 space-y-2 group relative">
                <button 
                  onClick={() => {
                    setState((prev: any) => ({
                      ...prev,
                      gaps: prev.gaps.filter((g: any) => g.id !== gap.id)
                    }));
                  }}
                  className="absolute top-2 right-2 text-ink-3 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
                <div className="flex gap-2 pr-6">
                  <select 
                    value={gap.type}
                    onChange={e => {
                      setState((prev: any) => {
                        const newGaps = [...prev.gaps];
                        newGaps[idx] = { ...newGaps[idx], type: e.target.value as any };
                        return { ...prev, gaps: newGaps };
                      });
                    }}
                    className="w-24 bg-paper-2 border border-paper-3 px-2 py-1 text-[14px] rounded"
                  >
                    <option value="warn">Warning</option>
                    <option value="gold">Insight</option>
                    <option value="cucu">Success</option>
                  </select>
                  <input 
                    value={gap.title}
                    onChange={e => {
                      setState((prev: any) => {
                        const newGaps = [...prev.gaps];
                        newGaps[idx] = { ...newGaps[idx], title: e.target.value };
                        return { ...prev, gaps: newGaps };
                      });
                    }}
                    placeholder="Gap Title"
                    className="flex-1 bg-paper-2 border border-paper-3 px-2 py-1 text-[14px] rounded"
                  />
                </div>
                <textarea 
                  value={gap.description}
                  onChange={e => {
                    setState((prev: any) => {
                      const newGaps = [...prev.gaps];
                      newGaps[idx] = { ...newGaps[idx], description: e.target.value };
                      return { ...prev, gaps: newGaps };
                    });
                  }}
                  placeholder="Description"
                  rows={2}
                  className="w-full bg-paper-2 border border-paper-3 px-2 py-1 text-[13px] rounded resize-none"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-paper border-t border-paper-3 flex justify-end">
        <button 
          onClick={() => setIsEditing(false)}
          className="flex items-center gap-2 px-4 py-2 bg-cucu text-white rounded-lg text-[14px] uppercase tracking-widest font-bold hover:bg-cucu-2 transition-colors"
        >
          <Save size={14} />
          Save Dashboard
        </button>
      </div>
    </div>
  );
}
