import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, Globe, Layout, Plus, LogOut, Zap, ArrowRight, X } from 'lucide-react';
import { useOS, World, Tab } from '../../store/OSContext';

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'Navigation' | 'Actions' | 'System';
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setActiveWorld, setActiveTab, addLog, addFocusItem, logout, showToast, activeWorld } = useOS();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = [
    // NAVIGATION - WORLDS
    { id: 'nav-lota', title: 'Go to Lota Kopi', subtitle: 'Switch to Lota Kopi world', icon: <Globe size={16} className="text-lota" />, category: 'Navigation', action: () => { setActiveWorld('lota'); setActiveTab('focus'); } },
    { id: 'nav-cucu', title: 'Go to Cucufate', subtitle: 'Switch to Cucufate world', icon: <Globe size={16} className="text-cucu" />, category: 'Navigation', action: () => { setActiveWorld('cucu'); setActiveTab('focus'); } },
    { id: 'nav-corp', title: 'Go to Corporate', subtitle: 'Switch to Corporate world', icon: <Globe size={16} className="text-corp" />, category: 'Navigation', action: () => { setActiveWorld('corp'); setActiveTab('focus'); } },
    { id: 'nav-pse', title: 'Go to PSE', subtitle: 'Switch to PSE world', icon: <Globe size={16} className="text-gold" />, category: 'Navigation', action: () => { setActiveWorld('pse'); setActiveTab('focus'); } },
    
    // NAVIGATION - TABS
    { id: 'tab-focus', title: 'View Focus', subtitle: 'Switch to Focus tab', icon: <Layout size={16} />, category: 'Navigation', action: () => setActiveTab('focus') },
    { id: 'tab-timeline', title: 'View Timeline', subtitle: 'Switch to Timeline tab', icon: <Layout size={16} />, category: 'Navigation', action: () => setActiveTab('timeline') },
    { id: 'tab-habits', title: 'View Habits', subtitle: 'Switch to Habits tab', icon: <Layout size={16} />, category: 'Navigation', action: () => setActiveTab('habits') },
    { id: 'tab-finance', title: 'View Finance', subtitle: 'Switch to Finance tab', icon: <Layout size={16} />, category: 'Navigation', action: () => setActiveTab('finance') },
    { id: 'tab-sales', title: 'View Sales', subtitle: 'Switch to Sales tab', icon: <Layout size={16} />, category: 'Navigation', action: () => setActiveTab('sales') },
    
    // ACTIONS
    { id: 'act-log', title: 'Quick Log', subtitle: 'Add a new log entry', icon: <Plus size={16} />, category: 'Actions', action: () => {
      const text = query.replace(/^log\s+/i, '').trim();
      if (text) {
        addLog(text);
        showToast('Log added');
      } else {
        showToast('Type "log [message]"');
      }
    }},
    { id: 'act-focus', title: 'Add Focus', subtitle: 'Add task to current world', icon: <Plus size={16} />, category: 'Actions', action: () => {
      const text = query.replace(/^task\s+/i, '').trim();
      if (text) {
        addFocusItem(text, activeWorld);
        showToast('Task added');
      } else {
        showToast('Type "task [message]"');
      }
    }},
    
    // SYSTEM
    { id: 'sys-logout', title: 'Logout', subtitle: 'Sign out of Dione OS', icon: <LogOut size={16} />, category: 'System', action: () => logout() },
  ];

  const filteredCommands = query.trim() === '' 
    ? commands 
    : commands.filter(c => 
        c.title.toLowerCase().includes(query.toLowerCase()) || 
        c.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleAction = (command: CommandItem) => {
    command.action();
    setIsOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleAction(filteredCommands[selectedIndex]);
      }
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.children[selectedIndex] as HTMLElement;
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-[2px] z-[100]"
          />
          
          {/* PALETTE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-paper border border-paper-3 shadow-2xl rounded-xl z-[101] overflow-hidden"
          >
            <div className="flex items-center px-4 py-4 border-b border-paper-3">
              <Search size={18} className="text-ink-3 mr-3" />
              <input 
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={onKeyDown}
                placeholder="Search commands or type 'log ...' / 'task ...'"
                className="flex-1 bg-transparent border-none outline-none font-sans text-[15px] text-ink placeholder:text-ink-3"
              />
              <div className="flex items-center gap-1 px-2 py-1 bg-paper-2 rounded border border-paper-3 text-[10px] font-mono text-ink-3">
                <Command size={10} /> K
              </div>
            </div>

            <div 
              ref={listRef}
              className="max-h-[400px] overflow-y-auto scrollbar-hide py-2"
            >
              {filteredCommands.length > 0 ? (
                <>
                  {['Navigation', 'Actions', 'System'].map(category => {
                    const catCommands = filteredCommands.filter(c => c.category === category);
                    if (catCommands.length === 0) return null;

                    return (
                      <div key={category}>
                        <div className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-ink-3 font-bold bg-paper-2/50">
                          {category}
                        </div>
                        {catCommands.map((command) => {
                          const globalIndex = filteredCommands.indexOf(command);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <div 
                              key={command.id}
                              onClick={() => handleAction(command)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${isSelected ? 'bg-paper-2' : ''}`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${isSelected ? 'bg-paper text-ink' : 'bg-paper-2 text-ink-3'}`}>
                                {command.icon}
                              </div>
                              <div className="flex-1">
                                <div className={`text-[14px] font-medium ${isSelected ? 'text-ink' : 'text-ink-2'}`}>{command.title}</div>
                                <div className="text-[11px] text-ink-3">{command.subtitle}</div>
                              </div>
                              {isSelected && (
                                <ArrowRight size={14} className="text-gold animate-in slide-in-from-left-2" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="px-4 py-12 text-center">
                  <div className="text-ink-3 text-[14px] italic mb-2">No commands found for "{query}"</div>
                  <div className="text-[11px] uppercase tracking-widest text-ink-3">Try searching for worlds or tabs</div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-paper-3 bg-paper-2 flex justify-between items-center">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-[10px] text-ink-3">
                  <span className="px-1 py-0.5 bg-paper rounded border border-paper-3">↑↓</span> Navigate
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-ink-3">
                  <span className="px-1 py-0.5 bg-paper rounded border border-paper-3">Enter</span> Select
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-ink-3">
                  <span className="px-1 py-0.5 bg-paper rounded border border-paper-3">Esc</span> Close
                </div>
              </div>
              <div className="text-[10px] font-serif italic text-gold">Dione OS Command Palette</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
