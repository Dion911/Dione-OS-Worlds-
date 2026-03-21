import React, { useState } from 'react';
import TopBar from './components/layout/TopBar';
import Sidebar from './components/layout/Sidebar';
import WorldNav from './components/layout/WorldNav';
import LeftColumn from './components/layout/LeftColumn';
import CenterColumn from './components/layout/CenterColumn';
import RightColumn from './components/layout/RightColumn';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import QuickAddModal from './components/layout/QuickAddModal';
import CommandPalette from './components/layout/CommandPalette';
import { OSProvider, useOS } from './store/OSContext';
import { AnimatePresence, motion } from 'motion/react';

function Toast() {
  const { toastMessage } = useOS();
  
  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 lg:bottom-8 right-8 bg-ink text-paper px-6 py-3 rounded-md shadow-xl z-50 text-xs tracking-wider uppercase flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OSContent() {
  const { mobileView } = useOS();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-paper font-sans text-ink selection:bg-gold/30">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopBar onQuickAdd={() => setIsQuickAddOpen(true)} />
        
        <main className="flex-1 overflow-y-auto bg-paper-3 flex flex-col relative">
          <div className={`${mobileView === 'dashboard' ? 'block' : 'hidden'} lg:block`}>
            <WorldNav />
          </div>
          
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[204px_1fr_204px] gap-[1px]">
            <div className={`${mobileView === 'tasks' ? 'block' : 'hidden'} lg:block`}>
              <LeftColumn />
            </div>
            <div className={`${mobileView === 'dashboard' ? 'block' : 'hidden'} lg:block`}>
              <CenterColumn />
            </div>
            <div className={`${mobileView === 'capture' ? 'block' : 'hidden'} lg:block`}>
              <RightColumn />
            </div>
            
            {/* Metrics Full Width Row */}
            <div className={`lg:col-span-3 grid-cols-1 md:grid-cols-3 gap-[1px] bg-paper-3 border-t border-paper-3 ${mobileView === 'dashboard' ? 'grid' : 'hidden'} lg:grid`}>
              <div className="bg-paper p-3 md:p-4 text-center cursor-pointer hover:bg-paper-2 transition-colors">
                <div className="font-serif text-2xl md:text-3xl font-medium text-corp">3</div>
                <div className="text-[10px] tracking-[0.1em] uppercase text-ink-3 mt-1">Active Projects</div>
              </div>
              <div className="bg-paper p-3 md:p-4 text-center cursor-pointer hover:bg-paper-2 transition-colors">
                <div className="font-serif text-2xl md:text-3xl font-medium text-cucu">42%</div>
                <div className="text-[10px] tracking-[0.1em] uppercase text-ink-3 mt-1">Studio Launch</div>
              </div>
              <div className="bg-paper p-3 md:p-4 text-center cursor-pointer hover:bg-paper-2 transition-colors">
                <div className="font-serif text-2xl md:text-3xl font-medium text-gold">72%</div>
                <div className="text-[10px] tracking-[0.1em] uppercase text-ink-3 mt-1">Week Energy</div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block mt-auto">
            <Footer />
          </div>
        </main>
        
        <MobileNav />
      </div>
      
      <QuickAddModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
      <CommandPalette />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <OSProvider>
      <OSContent />
    </OSProvider>
  );
}
