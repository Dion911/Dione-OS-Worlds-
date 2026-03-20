import React, { useState } from 'react';
import ProjectTrackerModal from './ProjectTrackerModal';

export default function CorpPanel() {
  const [showProjectTracker, setShowProjectTracker] = useState(false);

  return (
    <div className="animate-in fade-in duration-300">
      {showProjectTracker && <ProjectTrackerModal onClose={() => setShowProjectTracker(false)} />}
      <div className="bg-corp-3 border-l-[2px] border-l-corp px-3 py-2 mb-3">
        <div className="text-[14px] tracking-[0.1em] text-corp uppercase font-bold">Cebu Landmasters</div>
        <div className="text-[12px] text-ink-3 mt-[1px]">Interior Design · Training Ground · Financial Engine</div>
      </div>

      <div className="bg-paper-2 border-l-[2px] border-l-corp px-3 py-[9px] mb-3 rounded-r-[6px]">
        <div className="text-[12px] tracking-[0.14em] uppercase text-corp mb-1">On Motivation</div>
        <div className="font-serif text-[14px] leading-[1.65] text-ink-2 italic">
          <strong className="text-ink font-normal not-italic">"I'm not driven by positions — I'm driven by tangible achievements."</strong><br/>
          Stay for the real projects. Build the experience. Leave when Cucufate can sustain you.
        </div>
      </div>

      <div className="flex flex-col gap-0">
        <div className="flex gap-2 items-start py-[5px] border-b border-paper-3">
          <div className="w-[6px] h-[6px] rounded-full shrink-0 mt-[3px] bg-corp"></div>
          <div className="text-[13px] text-ink-2 leading-[1.4] flex-1">
            <span className="text-ink">Showroom floor plan v3</span> — review this week
          </div>
        </div>
        <div className="flex gap-2 items-start py-[5px] border-b border-paper-3">
          <div className="w-[6px] h-[6px] rounded-full shrink-0 mt-[3px] bg-corp"></div>
          <div className="text-[13px] text-ink-2 leading-[1.4] flex-1">
            <span className="text-ink">Portfolio case study</span> — draft 1 in progress
          </div>
        </div>
        <div className="flex gap-2 items-start py-[5px] border-b border-paper-3">
          <div className="w-[6px] h-[6px] rounded-full shrink-0 mt-[3px] bg-gold"></div>
          <div className="text-[13px] text-ink-2 leading-[1.4] flex-1">
            Extract 3 projects for <span className="text-ink">Cucufate portfolio</span> <span className="text-[11px] px-[5px] py-[1px] rounded-[10px] bg-[#fdf0e0] text-[#7a4a00] ml-[3px] align-middle">reframe</span>
          </div>
        </div>
        <div className="flex gap-2 items-start py-[5px] border-b border-paper-3">
          <div className="w-[6px] h-[6px] rounded-full shrink-0 mt-[3px] bg-paper-3"></div>
          <div className="text-[13px] text-ink-2 leading-[1.4] flex-1">Define exit timeline — tied to Cucufate runway target</div>
        </div>
        <div className="flex gap-2 items-start py-[5px]">
          <div className="w-[6px] h-[6px] rounded-full shrink-0 mt-[3px] bg-paper-3"></div>
          <div className="text-[13px] text-ink-2 leading-[1.4] flex-1">Document systems + processes for handover</div>
        </div>
      </div>

      <div className="mt-2.5">
        <button 
          onClick={() => setShowProjectTracker(true)}
          className="font-sans text-[12px] tracking-[0.08em] bg-corp text-white border-none rounded-[6px] px-2.5 py-1.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          Project Status ↗
        </button>
      </div>
    </div>
  );
}
