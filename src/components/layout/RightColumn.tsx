import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { useOS } from '../../store/OSContext';

const INSIGHTS = {
  lota: [
    "Lota Kopi faces outward — neighborhood, people, joy. Keep the community engaged.",
    "Coffee is just the medium. The real product is the space and the feeling it gives.",
    "Your brand book is solidifying. Ensure every new barista understands the core manifesto.",
    "The neighborhood is responding. What's the next small delight you can offer them?"
  ],
  cucu: [
    "Cucufate faces inward — memory, intention, legacy. Same soul. Two expressions. That's rare.",
    "The name, the origin, the manifesto — most studios never have this. You already do.",
    "Your portfolio exists but isn't Cucufate-branded yet. Re-frame your past work under the new lens.",
    "Legacy isn't built in a day. Protect your 90-minute daily block for the studio."
  ],
  corp: [
    "Corporate life provides the runway. Protect your energy here so you can build your legacy outside.",
    "Treat your day job as your first angel investor. It funds the studio.",
    "Maintain boundaries. 9-to-5 pays the bills, 5-to-9 builds the empire.",
    "Extract the skills, leave the stress. Every corporate project is a lesson in operations."
  ],
  pse: [
    "Markets are emotional; your strategy shouldn't be. Stick to the plan.",
    "Risk management is more important than stock picking. Protect the downside.",
    "Patience pays. Wait for the setup, don't force the trade.",
    "Review your recent trades. What did the losers have in common?"
  ]
};

export default function RightColumn() {
  const { logs, addLog, updateLog, deleteLog, activeWorld, milestones, toggleMilestone, showToast, addFocusItem } = useOS();
  const [captureInput, setCaptureInput] = useState('');
  const [currentInsight, setCurrentInsight] = useState(INSIGHTS.cucu[0]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const worldInsights = INSIGHTS[activeWorld] || INSIGHTS.cucu;
    const randomInsight = worldInsights[Math.floor(Math.random() * worldInsights.length)];
    setCurrentInsight(randomInsight);
  }, [activeWorld]);

  const handleLog = () => {
    if (!captureInput.trim()) return;
    addLog(captureInput);
    setCaptureInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLog();
  };

  const startEditing = (index: number, value: string) => {
    setEditingIndex(index);
    setEditValue(value);
  };

  const saveEdit = (index: number) => {
    if (!editValue.trim()) return;
    updateLog(index, editValue);
    setEditingIndex(null);
    showToast("Capture updated");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  return (
    <div className="bg-paper flex flex-col p-0 h-full">
      {/* AI box */}
      <div className="px-3.5 py-3 pb-0">
        <div className="bg-ink text-paper px-[13px] py-[11px] rounded-[6px] mb-[1px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(196,164,74,0.07)_0%,transparent_70%)]"></div>
          <div className="text-[12px] tracking-[0.14em] uppercase text-gold mb-[5px] flex items-center gap-[5px] relative z-10">
            <span className="relative w-[5px] h-[5px] rounded-full bg-gold shrink-0">
              <span className="absolute -inset-[3px] rounded-full border border-gold animate-[ping_2s_ease-out_infinite] opacity-80"></span>
            </span> 
            AI Insight
          </div>
          <div className="text-[13px] text-[rgba(245,240,232,0.72)] leading-[1.7] relative z-10 transition-opacity duration-300">
            {currentInsight}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-[1px] bg-paper-3">
        <div className="bg-paper px-2 py-[9px] text-center cursor-pointer hover:bg-paper-2 transition-colors">
          <div className="font-serif text-[29px] font-medium text-corp">3</div>
          <div className="text-[11px] tracking-[0.1em] uppercase text-ink-3 mt-[1px]">Active Worlds</div>
        </div>
        <div className="bg-paper px-2 py-[9px] text-center cursor-pointer hover:bg-paper-2 transition-colors">
          <div className="font-serif text-[29px] font-medium text-cucu">42%</div>
          <div className="text-[11px] tracking-[0.1em] uppercase text-ink-3 mt-[1px]">Studio Launch</div>
        </div>
        <div className="bg-paper px-2 py-[9px] text-center cursor-pointer hover:bg-paper-2 transition-colors">
          <div className="font-serif text-[29px] font-medium text-gold">72%</div>
          <div className="text-[11px] tracking-[0.1em] uppercase text-ink-3 mt-[1px]">Week Energy</div>
        </div>
      </div>

      {/* Vision milestones */}
      <div className="px-3.5 py-3 border-t border-paper-3 flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-center mb-2">
          <div className="text-[13px] tracking-[0.14em] uppercase text-ink-3">Vision Milestones</div>
          <div className="text-[10px] font-mono text-gold">
            {milestones.filter(m => m.completed).length}/{milestones.length}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-[2px] w-full bg-paper-3 mb-4 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(milestones.filter(m => m.completed).length / milestones.length) * 100}%` }}
            className="h-full bg-gold"
          />
        </div>

        <div className="flex flex-col gap-[5px]">
          {milestones.map((milestone) => (
            <motion.div 
              key={milestone.id}
              whileHover={{ x: 2 }}
              onClick={() => toggleMilestone(milestone.id)}
              className="flex gap-[7px] items-center text-[13px] cursor-pointer group"
            >
              <div className={`w-[6px] h-[6px] rounded-full shrink-0 transition-all duration-300 ${
                milestone.completed 
                  ? 'bg-gold ring-2 ring-gold/20' 
                  : `bg-paper-3 group-hover:bg-ink-3`
              }`}></div>
              <div className={`transition-all duration-300 ${
                milestone.completed ? 'text-ink-3 line-through opacity-60' : 'text-ink-2'
              }`}>
                {milestone.text}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick capture */}
      <div className="px-3.5 py-3 border-t border-paper-3 mt-auto bg-paper-2/30">
        <div className="flex justify-between items-center mb-2">
          <div className="text-[11px] tracking-[0.2em] uppercase text-ink-3 font-bold">Quick Capture</div>
          {logs.length > 0 && (
            <button 
              onClick={() => {
                showToast("Logs are synced to your vision");
              }}
              className="text-[9px] uppercase tracking-widest text-ink-3 hover:text-ink transition-colors"
            >
              Recent
            </button>
          )}
        </div>
        
        <div className="relative group">
          <input 
            type="text" 
            className="w-full font-sans text-[13px] bg-paper border border-paper-3 rounded-[6px] px-[11px] py-[8px] text-ink outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all placeholder:text-ink-3/50"
            placeholder="idea / note / intent..."
            value={captureInput}
            onChange={e => setCaptureInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity">
            <span className="text-[9px] font-mono text-ink-3 bg-paper-2 px-1 rounded border border-paper-3">↵</span>
          </div>
        </div>

        <div className="flex gap-[6px] mt-2">
          <button 
            onClick={handleLog}
            disabled={!captureInput.trim()}
            className="flex-1 font-sans text-[11px] tracking-[0.12em] font-bold px-[6px] py-[7px] rounded-[6px] cursor-pointer border-none transition-all hover:bg-ink-2 bg-ink text-paper disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            LOG
          </button>
          <button 
            onClick={() => {
              if (captureInput.trim()) {
                showToast(`Querying: ${captureInput}`);
                setCaptureInput('');
              }
            }}
            className="flex-1 font-sans text-[11px] tracking-[0.12em] font-bold px-[6px] py-[7px] rounded-[6px] cursor-pointer transition-all hover:bg-paper-2 bg-paper text-ink border border-paper-3 flex items-center justify-center gap-1"
          >
            ASK <span className="text-[10px]">↗</span>
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <AnimatePresence initial={false}>
            {logs.map((log, i) => (
              <motion.div 
                key={`${log}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex flex-col gap-1 py-1 border-b border-transparent hover:border-paper-3 transition-all"
              >
                {editingIndex === i ? (
                  <div className="flex items-center gap-2 w-full">
                    <input 
                      autoFocus
                      className="flex-1 bg-paper border border-paper-3 rounded px-2 py-1 text-[12px] outline-none focus:border-gold/50"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEdit(i);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <button onClick={() => saveEdit(i)} className="text-emerald-600"><Check size={14}/></button>
                    <button onClick={cancelEdit} className="text-red-600"><X size={14}/></button>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-[12px] text-ink-2 leading-[1.5]">
                    <span className="text-gold mt-0.5 shrink-0">—</span>
                    <span className="flex-1">{log}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEditing(i, log)}
                        title="Edit capture"
                        className="p-1 hover:text-ink transition-colors"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button 
                        onClick={() => {
                          addFocusItem(log, activeWorld);
                          showToast("Promoted to task");
                        }}
                        title="Promote to task"
                        className="p-1 hover:text-gold transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <button 
                        onClick={() => {
                          deleteLog(i);
                          showToast("Capture deleted");
                        }}
                        title="Delete capture"
                        className="p-1 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {logs.length === 0 && (
            <div className="text-[11px] text-ink-3 italic py-2 opacity-50">
              No recent captures.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
