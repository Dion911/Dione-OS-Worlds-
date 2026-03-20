import React from 'react';
import { useOS } from '../../store/OSContext';
import { CheckSquare, LayoutDashboard, PenLine } from 'lucide-react';

export default function MobileNav() {
  const { mobileView, setMobileView } = useOS();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-paper border-t border-paper-3 flex items-center justify-around lg:hidden z-50">
      <button 
        onClick={() => setMobileView('tasks')}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${mobileView === 'tasks' ? 'text-ink' : 'text-ink-3 hover:text-ink-2'}`}
      >
        <CheckSquare size={20} strokeWidth={1.5} />
        <span className="text-[13px] tracking-[0.1em] uppercase">Tasks</span>
      </button>
      
      <button 
        onClick={() => setMobileView('dashboard')}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${mobileView === 'dashboard' ? 'text-ink' : 'text-ink-3 hover:text-ink-2'}`}
      >
        <LayoutDashboard size={20} strokeWidth={1.5} />
        <span className="text-[13px] tracking-[0.14em] uppercase">Dashboard</span>
      </button>
      
      <button 
        onClick={() => setMobileView('capture')}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${mobileView === 'capture' ? 'text-ink' : 'text-ink-3 hover:text-ink-2'}`}
      >
        <PenLine size={20} strokeWidth={1.5} />
        <span className="text-[13px] tracking-[0.1em] uppercase">Capture</span>
      </button>
    </div>
  );
}
