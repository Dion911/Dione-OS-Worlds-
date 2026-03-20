import React, { useState, useEffect } from 'react';

interface Habit {
  id: string;
  name: string;
  days: number[]; // 0: none, 1: partial, 2: done
}

const DEFAULT_HABITS: Habit[] = [
  { id: 'deep-work', name: 'Deep work (90 min)', days: [2, 2, 0, 2, 2, 1, 0] },
  { id: 'walking', name: 'Walking 7k steps', days: [2, 1, 2, 2, 1, 2, 0] },
  { id: 'reading', name: 'Reading (analog)', days: [1, 2, 2, 1, 2, 1, 0] },
  { id: 'cucufate', name: 'Cucufate work', days: [0, 0, 2, 1, 0, 0, 0] },
  { id: 'lota', name: 'Lota Kopi ops', days: [2, 2, 1, 2, 2, 1, 0] },
];

const STORAGE_KEY = 'dione_habits_v2';

export default function HabitsPanel() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_HABITS;
  });

  const [currentDay] = useState(() => {
    const day = new Date().getDay(); // 0 is Sunday
    return day === 0 ? 6 : day - 1; // Map to 0-6 (Mon-Sun)
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const toggleDay = (habitId: string, dayIndex: number) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newDays = [...habit.days];
        // Cycle: 0 -> 1 -> 2 -> 0
        newDays[dayIndex] = (newDays[dayIndex] + 1) % 3;
        return { ...habit, days: newDays };
      }
      return habit;
    }));
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
      <div className="grid grid-cols-7 gap-[2px] mb-4 border-b border-paper-3 pb-1">
        {dayLabels.map((label, i) => (
          <div 
            key={i} 
            className={`text-[9px] text-center uppercase tracking-tighter ${i === currentDay ? 'text-ink font-bold' : 'text-ink-3'}`}
          >
            {label}
          </div>
        ))}
      </div>

      {habits.map((habit) => (
        <div key={habit.id} className="mb-[15px] group">
          <div className="flex justify-between items-center mb-[5px]">
            <div className="text-[10px] text-ink-2 group-hover:text-ink transition-colors">{habit.name}</div>
            <div className="text-[9px] text-ink-3 opacity-0 group-hover:opacity-100 transition-opacity">
              {habit.days.filter(d => d === 2).length} full / {habit.days.filter(d => d === 1).length} partial
            </div>
          </div>
          <div className="grid grid-cols-7 gap-[4px]">
            {habit.days.map((status, i) => (
              <button
                key={i}
                onClick={() => toggleDay(habit.id, i)}
                className={`
                  h-[15px] rounded-[2px] transition-all duration-200 cursor-pointer
                  ${getStatusColor(status)}
                  ${i === currentDay ? 'ring-1 ring-ink/20 ring-offset-1 ring-offset-paper' : ''}
                  ${status > 0 ? 'opacity-100 shadow-sm' : 'opacity-40 hover:bg-paper-4'}
                  hover:scale-110 active:scale-95
                `}
                title={`${dayLabels[i]}: ${getStatusLabel(status)}`}
              />
            ))}
          </div>
        </div>
      ))}

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
