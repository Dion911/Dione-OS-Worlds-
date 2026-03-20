import React from 'react';
import { useOS, World } from '../../store/OSContext';

export default function WorldNav() {
  const { activeWorld, setActiveWorld, setActiveTab } = useOS();

  const handleActivate = (w: World) => {
    setActiveWorld(w);
    setActiveTab('focus');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 border-b border-paper-3">
      <div 
        onClick={() => handleActivate('lota')}
        className={`px-4 py-[9px] cursor-pointer transition-colors border-l-[3px] relative ${activeWorld === 'lota' ? 'bg-paper-2 border-l-lota' : 'border-l-transparent hover:bg-paper-2'} border-r border-paper-3`}
      >
        <div className="text-[14px] tracking-[0.06em] text-ink mb-[1px]">Lota Kopi</div>
        <div className="text-[12px] text-ink-3">Café Brand · Culture</div>
        <div className="h-[2px] mt-[5px] rounded-[1px] bg-paper-3 overflow-hidden">
          <div className="h-full rounded-[1px] bg-lota w-[62%]"></div>
        </div>
      </div>
      
      <div 
        onClick={() => handleActivate('cucu')}
        className={`px-4 py-[9px] cursor-pointer transition-colors border-l-[3px] relative ${activeWorld === 'cucu' ? 'bg-paper-2 border-l-cucu' : 'border-l-transparent hover:bg-paper-2'} border-r border-paper-3`}
      >
        <div className="text-[14px] tracking-[0.06em] text-ink mb-[1px]">Cucufate</div>
        <div className="text-[12px] text-ink-3">Design Studio · Legacy</div>
        <div className="h-[2px] mt-[5px] rounded-[1px] bg-paper-3 overflow-hidden">
          <div className="h-full rounded-[1px] bg-cucu w-[42%]"></div>
        </div>
      </div>

      <div 
        onClick={() => handleActivate('corp')}
        className={`px-4 py-[9px] cursor-pointer transition-colors border-l-[3px] relative ${activeWorld === 'corp' ? 'bg-paper-2 border-l-corp' : 'border-l-transparent hover:bg-paper-2'} border-r border-paper-3`}
      >
        <div className="text-[14px] tracking-[0.06em] text-ink mb-[1px]">Corporate</div>
        <div className="text-[12px] text-ink-3">Interior Design · CL</div>
        <div className="h-[2px] mt-[5px] rounded-[1px] bg-paper-3 overflow-hidden">
          <div className="h-full rounded-[1px] bg-corp w-[75%]"></div>
        </div>
      </div>

      <div 
        onClick={() => handleActivate('pse')}
        className={`px-4 py-[9px] cursor-pointer transition-colors border-l-[3px] relative ${activeWorld === 'pse' ? 'bg-paper-2 border-l-gold' : 'border-l-transparent hover:bg-paper-2'}`}
      >
        <div className="text-[14px] tracking-[0.06em] text-ink mb-[1px]">PSE Stocks</div>
        <div className="text-[12px] text-ink-3">Investments · Philippine Equity</div>
        <div className="h-[2px] mt-[5px] rounded-[1px] bg-paper-3 overflow-hidden">
          <div className="h-full rounded-[1px] bg-gold w-[55%]"></div>
        </div>
      </div>
    </div>
  );
}
