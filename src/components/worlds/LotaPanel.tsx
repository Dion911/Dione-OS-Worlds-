import React, { useState } from 'react';
import { useOS } from '../../store/OSContext';
import { Edit2, Check, Plus, Trash2, GripVertical } from 'lucide-react';

type Phase = {
  id: string;
  name: string;
  isActive: boolean;
  items: string[];
};

type MilestoneStatus = 'DONE' | 'ACTIVE' | 'NEXT' | 'PARKING';

type Milestone = {
  id: string;
  text: string;
  status: MilestoneStatus;
};

type CurrentPhaseData = {
  goal: string;
  progress: number;
  avgSales: string;
};

const INITIAL_PHASES: Phase[] = [
  {
    id: 'p1',
    name: 'HOME LAB',
    isActive: true,
    items: ['Validate menu', 'Test pricing', 'Build repeat customers', 'Refine operations']
  },
  {
    id: 'p2',
    name: 'STABILITY',
    isActive: false,
    items: ['Consistent daily sales', 'Strong best-sellers', 'Simple systems (inventory, prep)', 'Brand clarity']
  },
  {
    id: 'p3',
    name: 'EXPANSION READINESS',
    isActive: false,
    items: ['Scalable menu', 'Staff training system', 'Capital planning', 'Location scouting']
  },
  {
    id: 'p4',
    name: 'CITY MOVE',
    isActive: false,
    items: ['Lease decision', 'Fit-out', 'Launch']
  }
];

const INITIAL_MILESTONES: Milestone[] = [
  { id: 'm1', text: 'Brand book complete', status: 'DONE' },
  { id: 'm2', text: 'Manifesto written', status: 'DONE' },
  { id: 'm3', text: 'Egg waffle variation', status: 'ACTIVE' },
  { id: 'm4', text: 'Pricing adjustments', status: 'ACTIVE' },
  { id: 'm5', text: 'Merch line', status: 'NEXT' },
  { id: 'm6', text: 'Cold brew wholesale', status: 'PARKING' },
  { id: 'm7', text: 'Loyalty program', status: 'PARKING' },
  { id: 'm8', text: 'Scout 2nd location', status: 'PARKING' },
];

export default function LotaPanel() {
  const { setActiveTab } = useOS();
  
  const [phases, setPhases] = useState<Phase[]>(INITIAL_PHASES);
  const [currentPhaseData, setCurrentPhaseData] = useState<CurrentPhaseData>({
    goal: 'Validate café system at home before scaling',
    progress: 60,
    avgSales: '₱8,420'
  });
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  
  // Edit states
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [editingCurrentPhase, setEditingCurrentPhase] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [newMilestoneStatus, setNewMilestoneStatus] = useState<MilestoneStatus | null>(null);
  const [newMilestoneText, setNewMilestoneText] = useState('');

  // Drag and drop state
  const [draggedMilestoneId, setDraggedMilestoneId] = useState<string | null>(null);

  // --- Handlers ---
  
  const handlePhaseChange = (id: string, field: 'name' | 'items', value: string | string[]) => {
    setPhases(phases.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handlePhaseItemChange = (phaseId: string, index: number, value: string) => {
    setPhases(phases.map(p => {
      if (p.id === phaseId) {
        const newItems = [...p.items];
        newItems[index] = value;
        return { ...p, items: newItems };
      }
      return p;
    }));
  };

  const handleAddPhaseItem = (phaseId: string) => {
    setPhases(phases.map(p => p.id === phaseId ? { ...p, items: [...p.items, 'New item'] } : p));
  };

  const handleRemovePhaseItem = (phaseId: string, index: number) => {
    setPhases(phases.map(p => {
      if (p.id === phaseId) {
        const newItems = [...p.items];
        newItems.splice(index, 1);
        return { ...p, items: newItems };
      }
      return p;
    }));
  };

  const handleSetActivePhase = (id: string) => {
    setPhases(phases.map(p => ({ ...p, isActive: p.id === id })));
  };

  const handleAddMilestone = (status: MilestoneStatus) => {
    if (newMilestoneText.trim()) {
      setMilestones([...milestones, { id: Date.now().toString(), text: newMilestoneText, status }]);
      setNewMilestoneText('');
      setNewMilestoneStatus(null);
    }
  };

  const handleUpdateMilestone = (id: string, text: string) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, text } : m));
    setEditingMilestoneId(null);
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedMilestoneId(id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      const el = document.getElementById(`milestone-${id}`);
      if (el) el.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, id: string) => {
    setDraggedMilestoneId(null);
    const el = document.getElementById(`milestone-${id}`);
    if (el) el.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: MilestoneStatus) => {
    e.preventDefault();
    if (draggedMilestoneId) {
      setMilestones(milestones.map(m => 
        m.id === draggedMilestoneId ? { ...m, status } : m
      ));
    }
  };

  const activePhase = phases.find(p => p.isActive) || phases[0];
  const activePhaseIndex = phases.findIndex(p => p.isActive);

  const renderMilestoneSection = (status: MilestoneStatus, colorClass: string, dotColorClass: string, title: string) => {
    const sectionMilestones = milestones.filter(m => m.status === status);
    const isAdding = newMilestoneStatus === status;

    return (
      <div 
        className="mb-6"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <div className={`text-[10px] tracking-widest font-bold ${colorClass} mb-2.5 flex justify-between items-center`}>
          <span>{title}</span>
          <button 
            onClick={() => { setNewMilestoneStatus(status); setNewMilestoneText(''); }}
            className="p-1 hover:bg-paper-3 rounded text-ink-3 transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>
        
        <div className="flex flex-col gap-2 min-h-[20px]">
          {sectionMilestones.map(m => (
            <div 
              key={m.id} 
              id={`milestone-${m.id}`}
              draggable
              onDragStart={(e) => handleDragStart(e, m.id)}
              onDragEnd={(e) => handleDragEnd(e, m.id)}
              className="flex items-start gap-2 group cursor-grab active:cursor-grabbing hover:bg-paper-2 p-1 -ml-1 rounded transition-colors"
            >
              <div className="mt-1 opacity-0 group-hover:opacity-50 cursor-grab">
                <GripVertical size={12} className="text-ink-3" />
              </div>
              <div className={`w-1.5 h-1.5 rounded-full ${dotColorClass} mt-1.5 shrink-0 ${status === 'DONE' ? 'opacity-50' : ''}`}></div>
              
              {editingMilestoneId === m.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input 
                    autoFocus
                    type="text" 
                    defaultValue={m.text}
                    onBlur={(e) => handleUpdateMilestone(m.id, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateMilestone(m.id, e.currentTarget.value)}
                    className="flex-1 bg-white border border-lota/30 rounded px-2 py-0.5 text-[13px] text-ink outline-none focus:border-lota"
                  />
                </div>
              ) : (
                <div className={`flex-1 text-[13px] ${status === 'DONE' ? 'text-ink-3 line-through' : status === 'ACTIVE' ? 'text-ink font-medium' : 'text-ink-2'}`}>
                  {m.text}
                </div>
              )}
              
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                <button onClick={() => setEditingMilestoneId(m.id)} className="p-1 text-ink-3 hover:text-lota rounded hover:bg-paper-3">
                  <Edit2 size={12} />
                </button>
                <button onClick={() => handleDeleteMilestone(m.id)} className="p-1 text-ink-3 hover:text-red-500 rounded hover:bg-paper-3">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}

          {isAdding && (
            <div className="flex items-start gap-2 p-1 -ml-1">
              <div className="w-1.5 h-1.5 rounded-full bg-transparent mt-1.5 shrink-0"></div>
              <div className="flex-1 flex items-center gap-2">
                <input 
                  autoFocus
                  type="text" 
                  value={newMilestoneText}
                  onChange={(e) => setNewMilestoneText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddMilestone(status);
                    if (e.key === 'Escape') setNewMilestoneStatus(null);
                  }}
                  onBlur={() => {
                    if (newMilestoneText.trim()) handleAddMilestone(status);
                    else setNewMilestoneStatus(null);
                  }}
                  placeholder="New milestone..."
                  className="flex-1 bg-white border border-lota/30 rounded px-2 py-0.5 text-[13px] text-ink outline-none focus:border-lota"
                />
              </div>
            </div>
          )}
          
          {sectionMilestones.length === 0 && !isAdding && (
            <div className="text-[11px] text-ink-3/50 italic px-6 py-1 border border-dashed border-paper-3 rounded-md">
              Drop milestones here
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-300 pb-6">
      {/* HEADER */}
      <div className="bg-lota px-4 py-3 -mx-4 -mt-4 mb-6 relative overflow-hidden">
        <div className="absolute right-2 -bottom-2 text-5xl text-white/10">★</div>
        <div className="text-[18px] font-bold tracking-[0.1em] text-white">LOTA KOPI</div>
        <div className="text-[12px] text-white/70 mt-[2px] tracking-[0.06em]">Feel-good coffee & food · Playful & creative spirit</div>
      </div>
      
      {/* PHASES (TOP LAYER) */}
      <div className="mb-8">
        <div className="text-[10px] tracking-[0.15em] text-ink-3 uppercase mb-4 font-bold">Phases (Top Layer — Always Visible)</div>
        <div className="flex items-start justify-between text-[11px] font-medium text-center">
          {phases.map((phase, i) => (
            <React.Fragment key={phase.id}>
              <div 
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => handleSetActivePhase(phase.id)}
              >
                <div className={`px-2.5 py-1 rounded-md border shadow-sm transition-colors ${
                  phase.isActive 
                    ? 'text-lota bg-lota-3 border-lota/20' 
                    : 'text-ink-3 bg-transparent border-transparent hover:bg-paper-2'
                }`}>
                  {phase.name}
                </div>
                {phase.isActive && <div className="text-[9px] text-lota font-bold mt-1.5">↑ ACTIVE</div>}
              </div>
              {i < phases.length - 1 && <div className="flex-1 h-[1px] bg-paper-3 mt-3 mx-2"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* PHASE DEFINITION */}
      <div className="mb-8">
        <div className="text-[10px] tracking-[0.15em] text-ink-3 uppercase mb-3 font-bold border-b border-paper-3 pb-1.5 flex justify-between items-center">
          <span>Phase Definition (Strategic Layer)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {phases.map((phase, i) => {
            const isEditing = editingPhaseId === phase.id;
            return (
              <div 
                key={phase.id} 
                className={`p-3.5 rounded-xl border border-paper-3 transition-opacity relative group ${
                  phase.isActive ? 'bg-paper-2 shadow-sm opacity-100' : 'bg-paper-2 opacity-60 hover:opacity-100'
                }`}
              >
                <button 
                  onClick={() => setEditingPhaseId(isEditing ? null : phase.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-paper-3 text-ink-3 opacity-0 group-hover:opacity-100 hover:text-lota transition-opacity"
                >
                  {isEditing ? <Check size={12} /> : <Edit2 size={12} />}
                </button>

                {isEditing ? (
                  <input 
                    type="text"
                    value={phase.name}
                    onChange={(e) => handlePhaseChange(phase.id, 'name', e.target.value)}
                    className="text-[10px] font-bold text-lota mb-2.5 tracking-wider bg-white border border-lota/30 rounded px-1.5 py-0.5 w-full outline-none focus:border-lota"
                  />
                ) : (
                  <div className={`text-[10px] font-bold mb-2.5 tracking-wider ${phase.isActive ? 'text-lota' : 'text-ink-2'}`}>
                    PHASE {i + 1} — {phase.name} {phase.isActive && '(NOW)'}
                  </div>
                )}
                
                <ul className="text-[12px] text-ink-2 leading-relaxed space-y-1.5">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 group/item">
                      <span className={`${phase.isActive ? 'text-lota' : 'text-ink-3'} mt-0.5`}>•</span>
                      {isEditing ? (
                        <div className="flex-1 flex items-center gap-1">
                          <input 
                            type="text"
                            value={item}
                            onChange={(e) => handlePhaseItemChange(phase.id, j, e.target.value)}
                            className="flex-1 bg-white border border-paper-3 rounded px-1 py-0.5 text-[12px] outline-none focus:border-lota/50"
                          />
                          <button onClick={() => handleRemovePhaseItem(phase.id, j)} className="text-red-400 hover:text-red-600 p-0.5">
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ) : (
                        <span>{item}</span>
                      )}
                    </li>
                  ))}
                  {isEditing && (
                    <li>
                      <button 
                        onClick={() => handleAddPhaseItem(phase.id)}
                        className="text-[10px] text-lota hover:underline flex items-center gap-1 mt-1"
                      >
                        <Plus size={10} /> Add Item
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* CURRENT PHASE CARD */}
      <div className="mb-8">
        <div className="text-[10px] tracking-[0.15em] text-ink-3 uppercase mb-3 font-bold border-b border-paper-3 pb-1.5 flex justify-between items-center">
          <span>Current Phase Card (Focus)</span>
          <button 
            onClick={() => setEditingCurrentPhase(!editingCurrentPhase)}
            className="p-1 hover:bg-paper-2 rounded text-ink-3 hover:text-lota transition-colors"
          >
            {editingCurrentPhase ? <Check size={12} /> : <Edit2 size={12} />}
          </button>
        </div>
        <div className="bg-lota-3 border border-lota/20 p-5 rounded-xl shadow-sm relative">
          <div className="flex justify-between items-start mb-4">
            <div className="text-[14px] font-bold text-lota tracking-wide uppercase">PHASE {activePhaseIndex + 1} — {activePhase.name}</div>
            <div className="text-[9px] uppercase tracking-widest bg-lota text-white px-2 py-1 rounded-md font-bold">Active</div>
          </div>
          
          <div className="text-[13px] text-lota-2 mb-5 leading-relaxed flex items-start gap-2">
            <strong className="text-lota font-bold mt-0.5">Goal:</strong>
            {editingCurrentPhase ? (
              <textarea 
                value={currentPhaseData.goal}
                onChange={(e) => setCurrentPhaseData({...currentPhaseData, goal: e.target.value})}
                className="flex-1 bg-white border border-lota/30 rounded px-2 py-1 text-[13px] outline-none focus:border-lota resize-none"
                rows={2}
              />
            ) : (
              <span>{currentPhaseData.goal}</span>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="text-[11px] text-lota-2 font-bold w-20 uppercase tracking-wider">Progress</div>
              {editingCurrentPhase ? (
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={currentPhaseData.progress}
                  onChange={(e) => setCurrentPhaseData({...currentPhaseData, progress: parseInt(e.target.value)})}
                  className="flex-1 accent-lota"
                />
              ) : (
                <div className="flex-1 h-2.5 bg-lota/20 rounded-full overflow-hidden">
                  <div className="h-full bg-lota rounded-full transition-all duration-500" style={{ width: `${currentPhaseData.progress}%` }}></div>
                </div>
              )}
              <div className="text-[11px] text-lota font-bold w-8 text-right">{currentPhaseData.progress}%</div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-[11px] text-lota-2 font-bold w-20 uppercase tracking-wider">Avg Sales</div>
              {editingCurrentPhase ? (
                <input 
                  type="text" 
                  value={currentPhaseData.avgSales}
                  onChange={(e) => setCurrentPhaseData({...currentPhaseData, avgSales: e.target.value})}
                  className="bg-white border border-lota/30 rounded px-2 py-0.5 text-[13px] font-bold text-lota outline-none focus:border-lota w-32"
                />
              ) : (
                <div className="text-[13px] text-lota font-bold">{currentPhaseData.avgSales}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MILESTONES */}
      <div className="mb-6">
        <div className="text-[10px] tracking-[0.15em] text-ink-3 uppercase mb-4 font-bold border-b border-paper-3 pb-1.5 flex justify-between items-center">
          <span>Milestones (Execution Layer)</span>
        </div>
        
        <div className="flex flex-col gap-2">
          {renderMilestoneSection('DONE', 'text-ink-3', 'bg-ink-3', 'DONE')}
          {renderMilestoneSection('ACTIVE', 'text-lota', 'bg-lota', 'ACTIVE')}
          {renderMilestoneSection('NEXT', 'text-gold', 'bg-gold', 'NEXT')}
          {renderMilestoneSection('PARKING', 'text-ink-3', 'bg-paper-3', 'PARKING')}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-8 flex gap-3 border-t border-paper-3 pt-5">
        <button 
          onClick={() => {
            setNewMilestoneStatus('NEXT');
            setTimeout(() => {
              const inputs = document.querySelectorAll('input[placeholder="New milestone..."]');
              if (inputs.length > 0) (inputs[0] as HTMLInputElement).focus();
            }, 50);
          }}
          className="flex-1 font-sans text-[12px] tracking-[0.08em] bg-paper-2 text-ink-2 border border-paper-3 rounded-[8px] px-3 py-3 cursor-pointer hover:bg-paper-3 transition-colors text-center font-bold flex items-center justify-center gap-2"
        >
          <Plus size={14} /> Add Milestone
        </button>
        <button 
          onClick={() => setActiveTab('sales')}
          className="flex-1 font-sans text-[12px] tracking-[0.08em] bg-lota text-white border-none rounded-[8px] px-3 py-3 cursor-pointer hover:opacity-90 transition-opacity text-center font-bold shadow-sm"
        >
          Open Sales Tracker ↗
        </button>
      </div>
    </div>
  );
}


