import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOS, Tab } from '../../store/OSContext';
import LotaPanel from '../worlds/LotaPanel';
import CucuPanel from '../worlds/CucuPanel';
import CorpPanel from '../worlds/CorpPanel';
import PSEPanel from '../worlds/PSEPanel';
import TimelinePanel from '../panels/TimelinePanel';
import HabitsPanel from '../panels/HabitsPanel';
import FinancePanel from '../panels/FinancePanel';
import SalesTracker from '../worlds/SalesTracker';

export default function CenterColumn() {
  const { activeWorld, activeTab, setActiveTab } = useOS();
  const tabs: Tab[] = ['focus', 'timeline', 'habits', 'finance', 'sales'];

  return (
    <div className="bg-paper p-3.5 flex flex-col overflow-hidden h-full">
      {/* TABS */}
      <div className="flex border-b border-paper-3 -mx-3.5 px-3.5 overflow-x-auto scrollbar-hide shrink-0">
        {tabs.map(tab => (
          <div 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[13px] tracking-[0.1em] uppercase px-[11px] py-[7px] cursor-pointer border-b-[1.5px] -mb-[1px] transition-all whitespace-nowrap ${activeTab === tab ? 'text-ink border-ink' : 'text-ink-3 border-transparent hover:text-ink-2'}`}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="pt-3 flex-1 relative overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + activeWorld}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {activeTab === 'focus' && (
              <>
                {activeWorld === 'lota' && <LotaPanel />}
                {activeWorld === 'cucu' && <CucuPanel />}
                {activeWorld === 'corp' && <CorpPanel />}
                {activeWorld === 'pse' && <PSEPanel />}
              </>
            )}
            {activeTab === 'timeline' && <TimelinePanel />}
            {activeTab === 'habits' && <HabitsPanel />}
            {activeTab === 'finance' && <FinancePanel />}
            {activeTab === 'sales' && <SalesTracker />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
