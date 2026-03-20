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
  X
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

  const hours = format(currentTime, 'h');
  const minutes = format(currentTime, 'mm');
  const ampm = format(currentTime, 'a');
  const dayName = format(currentTime, 'EEE').toUpperCase();
  const dayNum = format(currentTime, 'd');

  return (
    <div className="animate-in fade-in duration-500 h-full flex flex-col items-center p-4 overflow-y-auto">
      <div className="bg-black rounded-[20px] md:rounded-[32px] w-full max-w-[480px] aspect-[2/1] relative overflow-hidden flex items-center px-4 sm:px-6 md:px-10 shadow-2xl border-[3px] md:border-[5px] border-[#1c1c1e] shrink-0 mt-4">
        
        {/* Top center dots (camera/sensor cutout simulation) */}
        <div className="absolute top-2 md:top-3 left-1/2 -translate-x-1/2 flex gap-1 bg-[#1c1c1e] px-2 md:px-3 py-1 md:py-1.5 rounded-full">
          <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/20"></div>
          <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/20"></div>
          <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/20"></div>
          <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/20"></div>
        </div>

        {/* Left Side: Huge Digital Clock */}
        <div className="flex-1 flex items-baseline justify-center tracking-tighter pr-2 sm:pr-4" style={{ color: '#8fb4f9' }}>
          <span className="text-[60px] sm:text-[84px] md:text-[102px] font-semibold leading-none">{hours}</span>
          <span className="text-[60px] sm:text-[84px] md:text-[102px] font-semibold leading-none relative -top-[0.05em] md:-top-2">:</span>
          <span className="text-[60px] sm:text-[84px] md:text-[102px] font-semibold leading-none">{minutes}</span>
        </div>

        {/* Right Side: Date, Temp, Alarm */}
        <div className="w-[60px] sm:w-[90px] md:w-[110px] flex flex-col justify-between h-[70%] md:h-[60%] py-1 md:py-2">
          
          {/* Date & Temp */}
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-1 sm:gap-1.5 md:gap-2">
              <span className="text-[12px] sm:text-[18px] md:text-[24px] font-semibold text-[#8fb4f9]">{dayName}</span>
              <span className="text-[12px] sm:text-[18px] md:text-[24px] font-semibold text-white">{dayNum}</span>
            </div>
            <div className="text-[14px] sm:text-[22px] md:text-[28px] font-medium text-white mt-0 md:mt-0.5">
              37°
            </div>
          </div>

          {/* Alarm */}
          <div className="flex flex-col items-end gap-0.5">
            <Clock className="text-[#8fb4f9] mb-0.5 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            <div className="flex items-baseline gap-0.5 text-white">
              <span className="text-[11px] sm:text-[16px] md:text-[20px] font-medium">7:30</span>
              <span className="text-[8px] sm:text-[10px] md:text-[13px] font-medium uppercase">{ampm}</span>
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
