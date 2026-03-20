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

  const overallProgress = Math.round(state.foundations.reduce((acc, f) => acc + f.progress, 0) / state.foundations.length);

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
        <h2 className="text-[11px] tracking-[0.2em] uppercase text-ink-3 mb-6 font-sans">Launch Arc</h2>
        <div className="relative px-2">
          <div className="absolute top-[5px] left-0 right-0 h-[1px] bg-paper-3"></div>
          <div className="flex justify-between relative z-10">
            {state.timeline.map((event: TimelineEvent) => (
              <div key={event.id} className="flex flex-col items-center text-center max-w-[80px]">
                <div className={`w-[11px] h-[11px] rounded-full mb-3 transition-all ${
                  event.status === 'past' ? 'bg-cucu' : 
                  event.status === 'current' ? 'bg-gold ring-4 ring-paper ring-offset-0' : 
                  'bg-paper border border-paper-3'
                }`}></div>
                <div className="font-serif text-[14px] text-ink leading-tight mb-1">{event.title}</div>
                <div className="font-sans text-[10px] uppercase tracking-wider text-ink-3">{event.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GAP ANALYSIS */}
      <section>
        <h2 className="text-[11px] tracking-[0.2em] uppercase text-ink-3 mb-4 font-sans">Gap Analysis</h2>
        <div className="space-y-0.5">
          {state.gaps.map((gap: GapItem) => (
            <div key={gap.id} className="flex gap-4 items-start py-4 border-b border-paper-3 last:border-none">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[14px] shrink-0 mt-0.5 ${
                gap.type === 'warn' ? 'bg-warn text-white' : 
                gap.type === 'gold' ? 'bg-gold text-white' : 
                'bg-cucu text-white'
              }`}>
                {gap.type === 'warn' ? '!' : gap.type === 'gold' ? '~' : '✓'}
              </div>
              <div>
                <div className="font-serif text-[16px] text-ink mb-1">{gap.title}</div>
                <div className="font-sans text-[13px] text-ink-2 leading-relaxed">{gap.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEXT 90 DAYS */}
      <section>
        <h2 className="text-[11px] tracking-[0.2em] uppercase text-ink-3 mb-4 font-sans">Next 90 Days</h2>
        <div className="space-y-0.5">
          {state.roadmap.map((item: RoadmapItem) => (
            <div key={item.id} className="flex gap-4 py-4 border-b border-paper-3 last:border-none">
              <div className="font-sans text-[11px] text-ink-3 min-w-[70px] pt-1 uppercase tracking-wider">{item.period}</div>
              <div className="flex-1">
                <div className="font-serif text-[16px] text-ink mb-1">{item.title}</div>
                <div className="font-sans text-[13px] text-ink-2 leading-relaxed">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES & PRICING */}
      <section>
        <h2 className="text-[11px] tracking-[0.2em] uppercase text-ink-3 mb-4 font-sans">Services & Pricing</h2>
        <div className="grid grid-cols-1 gap-3">
          {state.services?.map((service: any) => (
            <div key={service.id} className="bg-paper-2 p-4 border border-paper-3 rounded-md flex justify-between items-start group hover:bg-paper-3 transition-colors">
              <div className="flex-1">
                <div className="font-serif text-[16px] text-ink mb-1">{service.title}</div>
                <div className="font-sans text-[12px] text-ink-2 leading-relaxed max-w-md">{service.description}</div>
              </div>
              <div className="font-serif italic text-cucu text-[15px] ml-4 whitespace-nowrap">{service.price}</div>
            </div>
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

  const addFoundationItem = (foundationId: string) => {
    const text = prompt('Enter task text:');
    if (!text) return;
    setState((prev: any) => {
      const newFoundations = prev.foundations.map((f: any) => {
        if (f.id === foundationId) {
          const newItem = { id: Date.now().toString(), text, completed: false };
          const newItems = [...f.items, newItem];
          const completedCount = newItems.filter(i => i.completed).length;
          const progress = Math.round((completedCount / newItems.length) * 100);
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

  const addService = () => {
    const title = prompt('Service Title:');
    if (!title) return;
    const price = prompt('Price:');
    const description = prompt('Description:');
    setState((prev: any) => ({
      ...prev,
      services: [...(prev.services || []), { id: Date.now().toString(), title, price, description }]
    }));
  };

  const addGap = () => {
    const title = prompt('Gap Title:');
    if (!title) return;
    const description = prompt('Description:');
    const type = prompt('Type (warn, gold, cucu):', 'gold') as any;
    setState((prev: any) => ({
      ...prev,
      gaps: [...(prev.gaps || []), { id: Date.now().toString(), type: type || 'gold', title, description }]
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
            {state.foundations.map((f: Foundation) => (
              <div key={f.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-[14px] font-bold uppercase tracking-wider text-cucu">{f.title}</h4>
                  <button onClick={() => addFoundationItem(f.id)} className="text-cucu hover:text-cucu-2">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-1">
                  {f.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-paper-3 group">
                      <span className="text-[14px] text-ink">{item.text}</span>
                      <button 
                        onClick={() => removeFoundationItem(f.id, item.id)}
                        className="text-ink-3 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-4">
            {state.timeline.map((event: TimelineEvent, idx: number) => (
              <div key={event.id} className="p-3 bg-white rounded-lg border border-paper-3 space-y-2">
                <div className="flex gap-2">
                  <input 
                    value={event.title}
                    onChange={e => {
                      setState((prev: any) => {
                        const newTimeline = [...prev.timeline];
                        newTimeline[idx] = { ...newTimeline[idx], title: e.target.value };
                        return { ...prev, timeline: newTimeline };
                      });
                    }}
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
                    className="w-20 bg-paper-2 border border-paper-3 px-2 py-1 text-[14px] rounded"
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
            {state.roadmap.map((item: RoadmapItem, idx: number) => (
              <div key={item.id} className="p-3 bg-white rounded-lg border border-paper-3 space-y-2">
                <div className="flex gap-2">
                  <input 
                    value={item.period}
                    onChange={e => {
                      setState((prev: any) => {
                        const newRoadmap = [...prev.roadmap];
                        newRoadmap[idx] = { ...newRoadmap[idx], period: e.target.value };
                        return { ...prev, roadmap: newRoadmap };
                      });
                    }}
                    className="w-20 bg-paper-2 border border-paper-3 px-2 py-1 text-[14px] rounded"
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
                <div className="flex gap-2">
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
                <div className="flex gap-2">
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
