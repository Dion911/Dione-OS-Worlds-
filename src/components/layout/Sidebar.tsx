import React from 'react';
import { useOS, Tab } from '../../store/OSContext';
import { Target, Clock, Activity, Wallet, Download, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Sidebar() {
  const { activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, focusItems, milestones, logs, showToast } = useOS();
  
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'focus', label: 'Focus', icon: <Target size={16} /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock size={16} /> },
    { id: 'habits', label: 'Habits', icon: <Activity size={16} /> },
    { id: 'finance', label: 'Finance', icon: <Wallet size={16} /> },
  ];

  const handleExport = () => {
    try {
      const habitsData = localStorage.getItem('dione_habits_v4');
      const exportObject = {
        exportDate: new Date().toISOString(),
        focusItems,
        milestones,
        logs,
        habits: habitsData ? JSON.parse(habitsData) : []
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `dione_os_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      showToast("Backup downloaded!");
    } catch (error) {
      console.error("Failed to export data:", error);
      showToast("Failed to export data");
    }
  };

  const sidebarContent = (
    <div className="flex flex-col w-[218px] border-r border-paper-3 bg-paper-2 h-full shrink-0">
      <div className="p-6 border-b border-paper-3 flex items-center justify-between">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-ink text-paper flex items-center justify-center font-serif text-[20px] rounded-sm">D</div>
          <div>
            <h1 className="font-serif text-[14px] tracking-widest uppercase text-ink">Dione OS</h1>
            <p className="text-[12px] text-ink-3 tracking-wider uppercase">Personal System</p>
          </div>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden text-ink-3 hover:text-ink transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setIsSidebarOpen(false);
            }}
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
        <button onClick={handleExport} className="w-full flex items-center gap-3 px-4 py-2 text-[12px] tracking-wider uppercase text-ink-3 hover:text-ink transition-colors rounded-md hover:bg-paper-3">
          <Download size={16} />
          Export Data
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-[12px] tracking-wider uppercase text-ink-3 hover:text-ink transition-colors rounded-md hover:bg-paper-3">
          <Upload size={16} />
          Import Data
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-full">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] md:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
