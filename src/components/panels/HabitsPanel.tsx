import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  weekly: number[]; // 0: none, 1: partial, 2: done
  monthlyData: { [key: string]: number[] }; // key: "YYYY-MM", value: 31 days
}

const getMonthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const DEFAULT_HABITS: Habit[] = [
  { 
    id: 'deep-work', 
    name: 'Deep work (90 min)', 
    weekly: [2, 2, 0, 2, 2, 1, 0],
    monthlyData: { [getMonthKey(new Date())]: Array(31).fill(0).map(() => Math.floor(Math.random() * 3)) }
  },
  { 
    id: 'walking', 
    name: 'Walking 7k steps', 
    weekly: [2, 1, 2, 2, 1, 2, 0],
    monthlyData: { [getMonthKey(new Date())]: Array(31).fill(0).map(() => Math.floor(Math.random() * 3)) }
  },
  { 
    id: 'reading', 
    name: 'Reading (analog)', 
    weekly: [1, 2, 2, 1, 2, 1, 0],
    monthlyData: { [getMonthKey(new Date())]: Array(31).fill(0).map(() => Math.floor(Math.random() * 3)) }
  },
  { 
    id: 'cucufate', 
    name: 'Cucufate work', 
    weekly: [0, 0, 2, 1, 0, 0, 0],
    monthlyData: { [getMonthKey(new Date())]: Array(31).fill(0).map(() => Math.floor(Math.random() * 3)) }
  },
  { 
    id: 'lota', 
    name: 'Lota Kopi ops', 
    weekly: [2, 2, 1, 2, 2, 1, 0],
    monthlyData: { [getMonthKey(new Date())]: Array(31).fill(0).map(() => Math.floor(Math.random() * 3)) }
  },
];

const STORAGE_KEY = 'dione_habits_v4';

export default function HabitsPanel() {
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');
  const [viewDate, setViewDate] = useState(new Date());
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_HABITS;
      }
    }
    return DEFAULT_HABITS;
  });

  const [currentDay] = useState(() => {
    const day = new Date().getDay(); // 0 is Sunday
    return day === 0 ? 6 : day - 1; // Map to 0-6 (Mon-Sun)
  });

  const [currentDate] = useState(() => new Date().getDate() - 1); // 0-indexed day of month
  const todayKey = getMonthKey(new Date());
  const viewKey = getMonthKey(viewDate);
  
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Map Sun(0) to 6, Mon(1) to 0

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const toggleDay = (habitId: string, index: number) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        if (view === 'weekly') {
          const newWeekly = [...habit.weekly];
          newWeekly[index] = (newWeekly[index] + 1) % 3;
          return { ...habit, weekly: newWeekly };
        } else {
          const currentMonthly = habit.monthlyData[viewKey] || Array(31).fill(0);
          const newMonthly = [...currentMonthly];
          newMonthly[index] = (newMonthly[index] + 1) % 3;
          return { 
            ...habit, 
            monthlyData: { 
              ...habit.monthlyData, 
              [viewKey]: newMonthly 
            } 
          };
        }
      }
      return habit;
    }));
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    setViewDate(newDate);
  };

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-lota'; // Partial (Orange)
      case 2: return 'bg-cucu'; // Done (Green)
      default: return 'bg-paper-3'; // None (Gray)
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1: return 'Partial';
      case 2: return 'Done';
      default: return 'Not started';
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex bg-paper-2 p-1 rounded-full">
          <button 
            onClick={() => setView('weekly')}
            className={`px-3 py-1 text-[9px] uppercase tracking-widest rounded-full transition-all ${view === 'weekly' ? 'bg-paper text-ink shadow-sm font-bold' : 'text-ink-3 hover:text-ink-2'}`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setView('monthly')}
            className={`px-3 py-1 text-[9px] uppercase tracking-widest rounded-full transition-all ${view === 'monthly' ? 'bg-paper text-ink shadow-sm font-bold' : 'text-ink-3 hover:text-ink-2'}`}
          >
            Monthly
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          {view === 'monthly' && (
            <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-paper-2 rounded-full transition-colors text-ink-3 hover:text-ink">
              <ChevronLeft size={14} />
            </button>
          )}
          <div className="text-[10px] text-ink-3 font-mono uppercase tracking-tight min-w-[100px] text-center">
            {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          {view === 'monthly' && (
            <button onClick={() => changeMonth(1)} className="p-1 hover:bg-paper-2 rounded-full transition-colors text-ink-3 hover:text-ink">
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-[2px] mb-4 border-b border-paper-3 pb-1">
        {dayLabels.map((label, i) => (
          <div 
            key={i} 
            className={`text-[9px] text-center uppercase tracking-tighter ${(view === 'weekly' && i === currentDay) ? 'text-ink font-bold' : 'text-ink-3'}`}
          >
            {label}
          </div>
        ))}
      </div>

      {habits.map((habit) => {
        const monthlyArray = habit.monthlyData[viewKey] || Array(31).fill(0);
        
        return (
          <div key={habit.id} className="mb-6 group">
            <div className="flex justify-between items-center mb-2">
              <div className="text-[11px] font-medium text-ink-2 group-hover:text-ink transition-colors">{habit.name}</div>
              <div className="text-[9px] text-ink-3 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                {view === 'weekly' 
                  ? `${habit.weekly.filter(d => d === 2).length}F / ${habit.weekly.filter(d => d === 1).length}P`
                  : `${monthlyArray.filter((d, idx) => idx < daysInMonth && d === 2).length}F / ${monthlyArray.filter((d, idx) => idx < daysInMonth && d === 1).length}P`
                }
              </div>
            </div>
            
            {view === 'weekly' ? (
              <div className="grid grid-cols-7 gap-1.5">
                {habit.weekly.map((status, i) => (
                  <button
                    key={i}
                    onClick={() => toggleDay(habit.id, i)}
                    className={`
                      h-5 rounded-[2px] transition-all duration-200 cursor-pointer
                      ${getStatusColor(status)}
                      ${i === currentDay ? 'ring-1 ring-ink/30 ring-offset-1 ring-offset-paper' : ''}
                      ${status > 0 ? 'opacity-100 shadow-sm' : 'opacity-20 hover:opacity-40'}
                      hover:scale-105 active:scale-95
                    `}
                    title={`${dayLabels[i]}: ${getStatusLabel(status)}`}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {/* Empty spaces for offset */}
                {Array(startOffset).fill(0).map((_, i) => (
                  <div key={`offset-${i}`} className="h-3.5" />
                ))}
                {/* Days of the month */}
                {monthlyArray.slice(0, daysInMonth).map((status, i) => (
                  <button
                    key={i}
                    onClick={() => toggleDay(habit.id, i)}
                    className={`
                      h-3.5 rounded-[1px] transition-all duration-200 cursor-pointer
                      ${getStatusColor(status)}
                      ${(viewKey === todayKey && i === currentDate) ? 'ring-1 ring-ink/30 ring-offset-1 ring-offset-paper' : ''}
                      ${status > 0 ? 'opacity-100 shadow-sm' : 'opacity-20 hover:opacity-40'}
                      hover:scale-110 active:scale-95
                    `}
                    title={`Day ${i + 1}: ${getStatusLabel(status)}`}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-6 pt-4 border-t border-paper-3">
        <div className="flex justify-between items-center mb-2">
          <div className="text-[9px] text-ink-3 uppercase tracking-widest">Legend</div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-[1px] bg-cucu"></div>
              <span className="text-[9px] text-ink-3 uppercase">Done</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-[1px] bg-lota"></div>
              <span className="text-[9px] text-ink-3 uppercase">Partial</span>
            </div>
          </div>
        </div>
        <div className="text-[10px] text-ink-2 leading-relaxed italic">
          "Consistency over intensity. Small blocks of deep work build the empire."
        </div>
      </div>
    </div>
  );
}
