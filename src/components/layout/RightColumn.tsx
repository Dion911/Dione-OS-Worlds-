import React, { useState } from 'react';
import { useOS } from '../../store/OSContext';

export default function RightColumn() {
  const { logs, addLog } = useOS();
  const [captureInput, setCaptureInput] = useState('');

  const handleLog = () => {
    if (!captureInput.trim()) return;
    addLog(captureInput);
    setCaptureInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLog();
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
          <div className="text-[13px] text-[rgba(245,240,232,0.72)] leading-[1.7] relative z-10">
            Two manifestos written. Lota Kopi faces outward — neighborhood, people, joy. Cucufate faces inward — memory, intention, legacy. Same soul. Two expressions. That's rare.
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
      <div className="px-3.5 py-3 border-t border-paper-3 flex-1">
        <div className="text-[13px] tracking-[0.14em] uppercase text-ink-3 mb-2">Vision Milestones</div>
        <div className="flex flex-col gap-[5px]">
          <div className="flex gap-[7px] items-center text-[13px]">
            <div className="w-[5px] h-[5px] rounded-full shrink-0 bg-lota"></div>
            <div className="text-ink-2">Lota Kopi · manifesto written</div>
          </div>
          <div className="flex gap-[7px] items-center text-[13px]">
            <div className="w-[5px] h-[5px] rounded-full shrink-0 bg-lota"></div>
            <div className="text-ink-2">Lota Kopi · brand book complete</div>
          </div>
          <div className="flex gap-[7px] items-center text-[13px]">
            <div className="w-[5px] h-[5px] rounded-full shrink-0 bg-cucu"></div>
            <div className="text-ink-2">Cucufate · manifesto written</div>
          </div>
          <div className="flex gap-[7px] items-center text-[13px]">
            <div className="w-[5px] h-[5px] rounded-full shrink-0 bg-gold"></div>
            <div className="text-ink-2">Dione OS · v2 unified dashboard</div>
          </div>
          <div className="flex gap-[7px] items-center text-[13px]">
            <div className="w-[5px] h-[5px] rounded-full shrink-0 bg-ink-3"></div>
            <div className="text-ink-3">Cucufate · 2nd location scouted</div>
          </div>
          <div className="flex gap-[7px] items-center text-[13px]">
            <div className="w-[5px] h-[5px] rounded-full shrink-0 bg-ink-3"></div>
            <div className="text-ink-3">CL · portfolio case study published</div>
          </div>
          <div className="flex gap-[7px] items-center text-[13px]">
            <div className="w-[5px] h-[5px] rounded-full shrink-0 bg-ink-3"></div>
            <div className="text-ink-3">Dione OS · shipped as PWA</div>
          </div>
          <div className="flex gap-[7px] items-center text-[13px]">
            <div className="w-[5px] h-[5px] rounded-full shrink-0 bg-ink-3"></div>
            <div className="text-ink-3">Leave corporate · full studio income</div>
          </div>
        </div>
      </div>

      {/* Quick capture */}
      <div className="px-3.5 py-3 border-t border-paper-3 mt-auto">
        <div className="text-[13px] tracking-[0.14em] uppercase text-ink-3 mb-2">Quick Capture</div>
        <input 
          type="text" 
          className="w-full font-sans text-[13px] bg-paper-2 border-[0.5px] border-paper-3 rounded-[6px] px-[9px] py-[6px] text-ink outline-none focus:border-ink-3"
          placeholder="idea / note / intent..."
          value={captureInput}
          onChange={e => setCaptureInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex gap-[5px] mt-[5px]">
          <button 
            onClick={handleLog}
            className="flex-1 font-sans text-[12px] tracking-[0.08em] px-[6px] py-[5px] rounded-[6px] cursor-pointer border-none transition-opacity hover:opacity-75 bg-ink text-paper"
          >
            LOG
          </button>
          <button 
            onClick={() => setCaptureInput('')}
            className="flex-1 font-sans text-[12px] tracking-[0.08em] px-[6px] py-[5px] rounded-[6px] cursor-pointer transition-opacity hover:opacity-75 bg-transparent text-ink border-[0.5px] border-ink-3"
          >
            ASK ↗
          </button>
        </div>
        <div className="mt-[6px] text-[12px] text-ink-3 leading-[1.7]">
          {logs.map((log, i) => (
            <div key={i}>— {log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
