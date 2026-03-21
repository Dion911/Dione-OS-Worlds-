import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  X,
  Bell,
  Thermometer,
  Settings,
  ChevronUp,
  ChevronDown,
  AlarmClock,
  Moon
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isToday
} from 'date-fns';

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  color: string;
  completed: boolean;
}

const INITIAL_EVENTS: TimelineEvent[] = [
  { id: '1', time: '06:00', title: 'Morning systems review + coffee ritual', color: '#D4AF37', completed: false },
  { id: '2', time: '08:00', title: 'Deep work block · Cucufate / Dione OS', color: '#2D5A27', completed: false },
  { id: '3', time: '10:00', title: 'Cebu Landmasters · project reviews', color: '#1A237E', completed: false },
  { id: '4', time: '13:00', title: 'Lota Kopi · operations + barista shift', color: '#A0522D', completed: false },
  { id: '5', time: '17:00', title: 'Walk + analog thinking time', color: '#757575', completed: false },
  { id: '6', time: '20:00', title: 'Reflection log + next day intent', color: '#D4AF37', completed: false },
];

export default function TimelinePanel() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [events, setEvents] = useState<TimelineEvent[]>(INITIAL_EVENTS);
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({ time: '', title: '' });

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleEvent = (id: string) => {
    setEvents(events.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleAddEvent = () => {
    if (!newEvent.time || !newEvent.title) return;
    const event: TimelineEvent = {
      id: Math.random().toString(36).substr(2, 9),
      time: newEvent.time,
      title: newEvent.title,
      color: '#D4AF37',
      completed: false
    };
    setEvents([...events, event].sort((a, b) => a.time.localeCompare(b.time)));
    setNewEvent({ time: '', title: '' });
    setIsAdding(false);
  };

  return (
    <div className="animate-in fade-in duration-500 h-full flex flex-col items-center p-4 overflow-y-auto">
      
      {/* NEW LCD CLOCK */}
      <div className="bg-[#222] p-4 md:p-6 rounded-[24px] md:rounded-[32px] w-full max-w-[500px] shadow-2xl border-[4px] md:border-[8px] border-[#111] shrink-0 mt-4 mx-auto">
        <div className="bg-[#a3b096] rounded-lg p-3 md:p-4 flex flex-col border-[2px] md:border-[3px] border-[#0a0a0a] shadow-[inset_0_0_15px_rgba(0,0,0,0.15)] text-[#1a1a1a]">
          
          {/* Top Row: Day */}
          <div className="flex justify-between items-start border-b-[2px] border-[#1a1a1a] pb-1 md:pb-2 relative">
            <span className="text-[10px] md:text-[12px] font-bold tracking-wider absolute top-0 left-0">DAY</span>
            <div className="w-full text-center">
              <span className="font-mono text-[28px] md:text-[40px] tracking-[0.15em] uppercase leading-none" style={{ fontFamily: '"DS-Digital", sans-serif', fontWeight: 600 }}>
                {format(currentTime, 'EEEE')}
              </span>
            </div>
          </div>

          {/* Middle Row: Time */}
          <div className="flex justify-between items-center border-b-[2px] border-[#1a1a1a] py-2 md:py-3 relative">
            <span className="text-[10px] md:text-[12px] font-bold tracking-wider absolute top-2 left-0">TIME</span>
            <div className="w-full text-center flex justify-center items-baseline gap-1 md:gap-2">
              <span className="font-mono text-[64px] md:text-[96px] leading-none tracking-tight" style={{ fontFamily: '"DS-Digital", sans-serif', fontWeight: 700 }}>
                {format(currentTime, 'HH')}:{format(currentTime, 'mm')}
              </span>
              <span className="font-mono text-[32px] md:text-[48px] leading-none tracking-tight" style={{ fontFamily: '"DS-Digital", sans-serif', fontWeight: 700 }}>
                :{format(currentTime, 'ss')}
              </span>
            </div>
          </div>

          {/* Bottom Row: Date, Month, Temp */}
          <div className="flex justify-between items-center pt-2 md:pt-3 relative">
            {/* Date */}
            <div className="flex flex-col items-center relative pl-1 md:pl-2">
              <div className="relative flex items-center justify-center w-[45px] md:w-[60px] h-[55px] md:h-[70px]">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path d="M2 2 H 42 L 58 18 V 68 H 2 Z" stroke="#1a1a1a" strokeWidth="3" fill="transparent" />
                  <path d="M42 2 V 18 H 58" stroke="#1a1a1a" strokeWidth="3" fill="transparent" />
                </svg>
                <span className="font-mono text-[24px] md:text-[36px] leading-none relative z-10 -mt-2" style={{ fontFamily: '"DS-Digital", sans-serif', fontWeight: 700 }}>
                  {format(currentTime, 'd')}
                </span>
                <span className="absolute bottom-1.5 left-2 text-[8px] md:text-[10px] font-bold z-10">DATE</span>
              </div>
            </div>

            {/* Month */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] md:text-[12px] font-bold tracking-wider mb-0.5 md:mb-1">MONTH</span>
              <span className="font-mono text-[28px] md:text-[40px] tracking-[0.15em] uppercase leading-none" style={{ fontFamily: '"DS-Digital", sans-serif', fontWeight: 600 }}>
                {format(currentTime, 'MMMM')}
              </span>
            </div>

            {/* Temp */}
            <div className="flex flex-col items-end border-l-[2px] border-[#1a1a1a] pl-2 md:pl-4">
              <span className="text-[10px] md:text-[12px] font-bold tracking-wider mb-0.5 md:mb-1">TEMP</span>
              <div className="flex items-center gap-1 md:gap-2">
                <span className="font-mono text-[28px] md:text-[40px] leading-none" style={{ fontFamily: '"DS-Digital", sans-serif', fontWeight: 700 }}>34</span>
                <div className="flex flex-col items-center">
                  <Thermometer className="w-4 h-4 md:w-6 md:h-6" />
                  <span className="font-mono text-[12px] md:text-[16px] leading-none font-bold">°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="flex justify-between items-center mt-3 md:mt-4 px-2 md:px-6">
            <div className="flex flex-col items-center gap-0.5">
              <div className="border-[2px] border-[#1a1a1a] rounded-full p-0.5 md:p-1">
                <Settings className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              <span className="text-[7px] md:text-[9px] font-bold uppercase">SET</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="border-[2px] border-[#1a1a1a] rounded-full p-0.5 md:p-1">
                <ChevronUp className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              <span className="text-[7px] md:text-[9px] font-bold uppercase">UP</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="border-[2px] border-[#1a1a1a] rounded-full p-0.5 md:p-1">
                <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              <span className="text-[7px] md:text-[9px] font-bold uppercase">DOWN</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="border-[2px] border-[#1a1a1a] rounded-full p-0.5 md:p-1">
                <AlarmClock className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              <span className="text-[7px] md:text-[9px] font-bold uppercase">ALARM</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="border-[2px] border-[#1a1a1a] rounded-full p-0.5 md:p-1">
                <Moon className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              <span className="text-[7px] md:text-[9px] font-bold uppercase">SNOOZE</span>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM SECTION: DAILY RHYTHM */}
      <div className="w-full max-w-[600px] mt-12 flex flex-col pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h3 className="font-serif text-[20px] text-ink mb-0.5">Daily Rhythm</h3>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-ink-3 uppercase tracking-[0.2em] font-medium">{format(currentTime, 'EEEE, MMMM do')}</span>
              <div className="w-1 h-1 rounded-full bg-paper-4"></div>
              <span className="text-[11px] font-mono text-gold uppercase tracking-widest">{format(currentTime, 'HH:mm')}</span>
            </div>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-[11px] uppercase tracking-widest font-bold transition-all border
              ${isAdding ? 'bg-ink text-paper border-ink' : 'bg-paper text-ink-2 border-paper-3 hover:bg-paper-2'}
            `}
          >
            {isAdding ? <X size={12} /> : <Plus size={12} />}
            {isAdding ? 'Cancel' : 'Add Event'}
          </button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-paper-2 p-4 rounded-xl border border-paper-3 flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-ink-3 font-bold">Time</label>
                    <input 
                      type="time" 
                      value={newEvent.time}
                      onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                      className="bg-white border border-paper-3 px-3 py-2 text-[13px] rounded-md outline-none focus:border-ink transition-colors"
                    />
                  </div>
                  <div className="md:col-span-3 flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-ink-3 font-bold">Event Description</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Strategy Meeting"
                      value={newEvent.title}
                      onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                      className="bg-white border border-paper-3 px-3 py-2 text-[13px] rounded-md outline-none focus:border-ink transition-colors"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleAddEvent}
                  className="w-full py-2.5 bg-ink text-paper text-[11px] uppercase tracking-widest font-bold rounded-md hover:bg-ink-2 transition-all shadow-sm"
                >
                  Add to Timeline
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex flex-col gap-2">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[19px] top-6 bottom-6 w-[1px] bg-paper-3"></div>

          {events.map((event, index) => {
            const isNext = !event.completed && events.slice(0, index).every(e => e.completed);
            
            return (
              <motion.div 
                key={event.id}
                layout
                className={`group relative flex gap-4 items-start p-4 rounded-xl transition-all border
                  ${event.completed ? 'opacity-40 grayscale border-transparent' : 'border-transparent'}
                  ${isNext ? 'bg-paper-2 border-paper-3 shadow-sm' : 'hover:bg-paper-2/50'}
                `}
              >
                <div className="relative z-10 flex flex-col items-center">
                  <button 
                    onClick={() => toggleEvent(event.id)}
                    className={`transition-all duration-300 p-1.5 rounded-full bg-paper border-2 
                      ${event.completed ? 'text-emerald-500 border-emerald-500' : 'text-ink-3 border-paper-3 hover:border-ink hover:text-ink'}
                    `}
                  >
                    {event.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  </button>
                </div>

                <div className="flex-1 pt-0.5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-[16px] text-ink leading-none tracking-tight">{event.time}</span>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.color }}></div>
                      {isNext && (
                        <span className="text-[9px] uppercase tracking-[0.2em] bg-gold text-ink px-2 py-0.5 rounded-sm font-bold">
                          Active Now
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => deleteEvent(event.id)}
                      className="opacity-0 group-hover:opacity-100 text-ink-3 hover:text-red-500 transition-all p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className={`text-[14px] leading-relaxed ${event.completed ? 'line-through text-ink-3' : 'text-ink-2 font-medium'}`}>
                    {event.title}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {events.length === 0 && (
            <div className="text-center py-24 text-ink-3 italic text-[14px] bg-paper-2/30 rounded-2xl border border-dashed border-paper-3">
              No events scheduled for today.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
