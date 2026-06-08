import { Zap } from 'lucide-react'

export default function NewsFeed() {
  const news = [
    { source: 'Bloomberg', time: '14:22', title: 'La Federal Reserve mantiene i tassi stabili ma apre a tagli nel Q3', text: 'I mercati reagiscono positivamente con il NASDAQ in rialzo dell\'1.2%.' },
    { source: 'Reuters', time: '11:58', title: 'NVIDIA svela la nuova architettura Blackwell Ultra: forte domanda dai Cloud Provider', text: 'Pre-market alle stelle per i produttori di semiconduttori globali.' },
    { source: 'Il Sole 24 Ore', time: '08:15', title: 'L\'inflazione in Eurozona scende al 2.1%, oltre le stime degli analisti BCE', text: 'Crescono le aspettative per un taglio dei tassi di 25bps a Giugno.' },
    { source: 'CoinDesk', time: 'Ieri', title: 'Regolamentazione Crypto USA: rinnovato divieto di tenuta bilancistica per le banche', text: 'Impatto limitato sui prezzi principali.' }
  ]

  return (
    <div className="card flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-borderAccent pb-3 mb-4">
        <Zap size={12} className="text-primary" />
        <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono font-bold">SENTIMENT FLASH & MARKET FEED</div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {news.map((n, i) => (
          <div key={i} className="border-b border-borderAccent/30 pb-3 last:border-0">
            <div className="flex justify-between items-center mb-1">
              <div className="text-[9px] font-mono text-textSecondary flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-textSecondary rounded-full"></span>
                {n.source} - {n.time}
              </div>
              <div className="text-[8px] font-mono border border-primary/30 text-primary px-1 rounded">ANALISI</div>
            </div>
            <div className="text-xs font-bold mb-1 leading-tight">{n.title}</div>
            <div className="text-[10px] text-textSecondary/70 leading-snug">{n.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
