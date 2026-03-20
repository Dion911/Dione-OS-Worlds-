import React, { useState } from 'react';
import { useOS, World } from '../../store/OSContext';
import { X } from 'lucide-react';

export default function QuickAddModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { addLog, addFocusItem, showToast } = useOS();
  const [text, setText] = useState('');
  const [type, setType] = useState<'task' | 'note'>('task');
  const [world, setWorld] = useState<World>('lota');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      if (type === 'note') {
        addLog(text);
        showToast('Note added to Quick Capture');
      } else {
        addFocusItem(text, world);
        showToast("Task added to Today's Focus");
      }
      setText('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm">
      <div className="bg-paper border border-paper-3 rounded-lg w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-start p-6 border-b border-paper-3 bg-paper-2">
            <div>
              <h3 className="font-serif text-[24px] text-ink">Add Entry</h3>
              <p className="text-[14px] tracking-wider uppercase text-ink-3 mt-1">Capture a new task or note.</p>
            </div>
            <button type="button" onClick={onClose} className="text-ink-3 hover:text-ink transition-colors">
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex gap-4 border-b border-paper-3 pb-2">
              <button
                type="button"
                onClick={() => setType('task')}
                className={`text-[14px] tracking-wider uppercase pb-2 -mb-[9px] border-b-2 transition-colors ${type === 'task' ? 'border-ink text-ink' : 'border-transparent text-ink-3 hover:text-ink-2'}`}
              >
                Focus Task
              </button>
              <button
                type="button"
                onClick={() => setType('note')}
                className={`text-[14px] tracking-wider uppercase pb-2 -mb-[9px] border-b-2 transition-colors ${type === 'note' ? 'border-ink text-ink' : 'border-transparent text-ink-3 hover:text-ink-2'}`}
              >
                Quick Note
              </button>
            </div>

            {type === 'task' && (
              <div className="flex flex-col gap-2">
                <label className="text-[14px] tracking-wider uppercase text-ink-2">Select World</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setWorld('lota')}
                    className={`py-2 px-3 text-[14px] border rounded-md transition-colors ${world === 'lota' ? 'bg-lota/10 border-lota text-ink' : 'bg-paper border-paper-3 text-ink-3 hover:border-ink-3'}`}
                  >
                    Lota Kopi
                  </button>
                  <button
                    type="button"
                    onClick={() => setWorld('cucu')}
                    className={`py-2 px-3 text-[14px] border rounded-md transition-colors ${world === 'cucu' ? 'bg-cucu/10 border-cucu text-ink' : 'bg-paper border-paper-3 text-ink-3 hover:border-ink-3'}`}
                  >
                    Cucufate
                  </button>
                  <button
                    type="button"
                    onClick={() => setWorld('corp')}
                    className={`py-2 px-3 text-[14px] border rounded-md transition-colors ${world === 'corp' ? 'bg-corp/10 border-corp text-ink' : 'bg-paper border-paper-3 text-ink-3 hover:border-ink-3'}`}
                  >
                    Corporate
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[14px] tracking-wider uppercase text-ink-2">
                {type === 'task' ? 'Task Description' : 'Note Content'}
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-paper border border-paper-3 p-3 text-[17px] focus:outline-none focus:border-ink resize-none h-24 rounded-md"
                placeholder={type === 'task' ? "What needs to be done?" : "What's on your mind?"}
                autoFocus
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 p-6 border-t border-paper-3 bg-paper-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[14px] tracking-wider uppercase text-ink-3 hover:text-ink transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-ink text-paper px-6 py-2 text-[14px] tracking-wider uppercase hover:bg-ink-2 transition-colors rounded-md">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
