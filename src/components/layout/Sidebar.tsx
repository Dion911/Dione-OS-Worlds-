import React from 'react';
import { useOS, Tab } from '../../store/OSContext';
import { Target, Clock, Activity, Wallet, Download, Upload } from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab } = useOS();
  
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'focus', label: 'Focus', icon: <Target size={16} /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock size={16} /> },
    { id: 'habits', label: 'Habits', icon: <Activity size={16} /> },
    { id: 'finance', label: 'Finance', icon: <Wallet size={16} /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[218px] border-r border-paper-3 bg-paper-2 h-full shrink-0">
      <div className="p-6 border-b border-paper-3">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-ink text-paper flex items-center justify-center font-serif text-[20px] rounded-sm">D</div>
          <div>
            <h1 className="font-serif text-[14px] tracking-widest uppercase text-ink">Dione OS</h1>
            <p className="text-[12px] text-ink-3 tracking-wider uppercase">Personal System</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-[12px] tracking-wider uppercase transition-colors rounded-md ${
              activeTab === tab.id ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-paper-3'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-paper-3 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-[12px] tracking-wider uppercase text-ink-3 hover:text-ink transition-colors rounded-md hover:bg-paper-3">
          <Download size={16} />
          Export Data
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-[12px] tracking-wider uppercase text-ink-3 hover:text-ink transition-colors rounded-md hover:bg-paper-3">
          <Upload size={16} />
          Import Data
        </button>
      </div>
    </aside>
  );
}
