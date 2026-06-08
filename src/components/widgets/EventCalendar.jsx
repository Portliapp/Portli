import { Calendar } from 'lucide-react'

export default function EventCalendar() {
  return (
    <div className="card h-full flex flex-col">
      <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
        <Calendar size={12} /> Eventi & Dividendi
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary/10 border border-primary/30 flex flex-col items-center justify-center">
            <span className="text-[8px] uppercase text-primary font-bold">Giù</span>
            <span className="text-xs font-mono font-bold text-primary">12</span>
          </div>
          <div>
            <div className="text-xs font-bold">Dividendo TSLA</div>
            <div className="text-[10px] text-textSecondary font-mono">Stima: €45.20</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-background border border-borderAccent flex flex-col items-center justify-center">
            <span className="text-[8px] uppercase text-textSecondary font-bold">Giù</span>
            <span className="text-xs font-mono font-bold text-textPrimary">15</span>
          </div>
          <div>
            <div className="text-xs font-bold">Riunione FED</div>
            <div className="text-[10px] text-textSecondary font-mono">Tassi d'interesse</div>
          </div>
        </div>
      </div>
    </div>
  )
}
