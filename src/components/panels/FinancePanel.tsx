import React from 'react';

export default function FinancePanel() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center text-[11px] py-[5px] border-b border-paper-3">
        <div className="text-ink-2">Monthly income (CL)</div>
        <div className="font-serif text-[14px] text-corp">₱ —</div>
      </div>
      <div className="flex justify-between items-center text-[11px] py-[5px] border-b border-paper-3 mt-1">
        <div className="flex-1">
          <div className="text-ink-2">Lota Kopi monthly revenue</div>
          <div className="h-[2px] bg-paper-3 rounded-[1px] mt-[3px] overflow-hidden">
            <div className="h-full rounded-[1px] w-[62%] bg-lota"></div>
          </div>
        </div>
        <div className="font-serif text-[14px] text-lota ml-2.5">62%</div>
      </div>
      <div className="flex justify-between items-center text-[11px] py-[5px] border-b border-paper-3">
        <div className="flex-1">
          <div className="text-ink-2">Cucufate studio fund</div>
          <div className="h-[2px] bg-paper-3 rounded-[1px] mt-[3px] overflow-hidden">
            <div className="h-full rounded-[1px] w-[18%] bg-cucu"></div>
          </div>
        </div>
        <div className="font-serif text-[14px] text-cucu ml-2.5">18%</div>
      </div>
      <div className="flex justify-between items-center text-[11px] py-[5px] border-b border-paper-3">
        <div className="flex-1">
          <div className="text-ink-2">6-month runway target</div>
          <div className="h-[2px] bg-paper-3 rounded-[1px] mt-[3px] overflow-hidden">
            <div className="h-full rounded-[1px] w-[8%] bg-gold"></div>
          </div>
        </div>
        <div className="font-serif text-[14px] text-gold ml-2.5">8%</div>
      </div>
      <div className="mt-2 text-[10px] text-ink-3">Connect accounts to populate live data →</div>
    </div>
  );
}
