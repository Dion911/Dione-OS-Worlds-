import React from 'react';
import { useOS } from '../../store/OSContext';
import { Search, Plus, Menu } from 'lucide-react';

export default function TopBar({ onQuickAdd }: { onQuickAdd: () => void }) {
  const { activeTab, logout, user } = useOS();
  
  const titles = {
    focus: { title: 'Dashboard', subtitle: 'See everything at a glance.' },
    timeline: { title: 'Timeline', subtitle: 'Schedule and events.' },
    habits: { title: 'Habits', subtitle: 'Daily tracking.' },
    finance: { title: 'Finance', subtitle: 'Budget and transactions.' },
    sales: { title: 'Sales', subtitle: 'Lota Kopi Sales Tracker.' },
  };

  return (
    <header className="flex items-center justify-between px-5 py-4 bg-paper border-b border-paper-3 shrink-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-ink hover:text-ink-2 transition-colors">
          <Menu size={24} strokeWidth={1.5} />
        </button>
        <div className="flex flex-col gap-[2px]">
          <h2 className="font-serif text-[18px] font-medium tracking-wide text-ink capitalize">{titles[activeTab].title}</h2>
          <p className="text-[12px] text-ink-3 tracking-wider uppercase">{titles[activeTab].subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center relative">
          <Search size={14} className="absolute left-3 text-ink-3" />
          <input 
            type="search" 
            placeholder="Search current module" 
            className="bg-paper-2 border border-paper-3 pl-9 pr-4 py-2 text-[12px] text-ink focus:outline-none focus:border-ink transition-colors w-64 rounded-md placeholder:text-ink-3"
          />
        </div>
        <button 
          onClick={onQuickAdd}
          className="flex items-center gap-2 bg-ink text-paper px-4 py-2 text-[12px] tracking-wider uppercase hover:bg-ink-2 transition-colors rounded-md"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Quick Add</span>
        </button>
        {user && (
          <button 
            onClick={logout}
            className="text-[12px] tracking-[0.1em] uppercase text-ink-3 hover:text-ink transition-colors ml-2"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
