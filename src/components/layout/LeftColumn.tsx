import React from 'react';
import { useOS, World } from '../../store/OSContext';

export default function LeftColumn() {
  const { setActiveWorld, setActiveTab, focusItems, toggleFocus } = useOS();
  const d = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  
  const handleActivate = (w: World) => {
    setActiveWorld(w);
    setActiveTab('focus');
  };

  return (
    <div className="bg-paper flex flex-col p-0 h-full">
      {/* Today focus */}
      <div className="px-3.5 pt-3 pb-2">
        <div className="text-[13px] tracking-[0.14em] uppercase text-ink-3 mb-2">Today's Focus</div>
        <div className="font-serif text-[26px] font-normal text-ink leading-none">{days[d.getDay()]}</div>
        <div className="text-[13px] text-ink-3 mt-0.5">{d.getDate()} {months[d.getMonth()]} {d.getFullYear()}</div>
      </div>

      <div className="px-2 pb-2">
        <div className="flex flex-col gap-1">
          {focusItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => toggleFocus(item.id)}
              className="flex items-start gap-[7px] text-[13px] px-1.5 py-[5px] rounded-[6px] cursor-pointer transition-colors hover:bg-paper-2"
            >
              <div className={`w-[6px] h-[6px] rounded-full shrink-0 mt-[2px] ${item.color}`}></div>
              <div className={`leading-[1.4] ${item.done ? 'line-through text-ink-3' : 'text-ink-2'}`}>
                {item.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Three Worlds strips */}
      <div className="flex flex-col border-t border-paper-3 mt-[2px]">
        <div className="text-[13px] tracking-[0.14em] uppercase text-ink-3 px-3.5 pt-2 pb-1">Three Worlds</div>
        
        <div onClick={() => handleActivate('lota')} className="px-3.5 py-[7px] border-l-[2px] border-l-transparent hover:border-l-lota cursor-pointer transition-colors hover:bg-paper-2 border-b border-paper-3">
          <div className="text-[13px] tracking-[0.06em] text-ink">Lota Kopi</div>
          <div className="text-[12px] text-ink-3 mt-[1px]">Café · Brand · Community</div>
        </div>
        
        <div onClick={() => handleActivate('cucu')} className="px-3.5 py-[7px] border-l-[2px] border-l-transparent hover:border-l-cucu cursor-pointer transition-colors hover:bg-paper-2 border-b border-paper-3">
          <div className="text-[13px] tracking-[0.06em] text-ink">Cucufate</div>
          <div className="text-[12px] text-ink-3 mt-[1px]">Studio · Memory · Intention</div>
        </div>
        
        <div onClick={() => handleActivate('corp')} className="px-3.5 py-[7px] border-l-[2px] border-l-transparent hover:border-l-corp cursor-pointer transition-colors hover:bg-paper-2 border-b border-paper-3">
          <div className="text-[13px] tracking-[0.06em] text-ink">Cebu Landmasters</div>
          <div className="text-[12px] text-ink-3 mt-[1px]">Corporate · Interior Design</div>
        </div>
      </div>

      {/* Phase arc */}
      <div className="px-3.5 pt-2.5 pb-3 border-t border-paper-3 mt-auto">
        <div className="text-[13px] tracking-[0.14em] uppercase text-ink-3 mb-2">Second Creative Life</div>
        <div className="flex items-center gap-2.5">
          <div>
            <svg width="70" height="40" viewBox="0 0 70 40">
              <path fill="none" stroke="var(--color-paper-3)" strokeWidth="4" d="M8 36 A 30 30 0 0 1 62 36"/>
              <path fill="none" stroke="var(--color-gold)" strokeWidth="4" strokeLinecap="round" strokeDasharray="126" strokeDashoffset="50" d="M8 36 A 30 30 0 0 1 62 36"/>
            </svg>
            <div className="text-[12px] text-ink-3 text-center mt-[1px]">Age 48 · Peak Zone</div>
          </div>
          <div className="text-[12px] text-ink-3 leading-[1.6]">
            Experience<br/>+ Taste<br/>+ Discipline<br/>
            <span className="text-gold">= Now</span>
          </div>
        </div>
      </div>
    </div>
  );
}
