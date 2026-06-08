export default function AssetList() {
  return (
    <div className="card h-full flex flex-col">
      <div className="flex justify-between items-center border-b border-borderAccent pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary shadow-[var(--shadow-glow-accent)]"></div>
          <div className="text-[10px] text-textSecondary uppercase tracking-widest font-mono font-bold">I MIEI ASSET CORRENTI (0)</div>
        </div>
        <button className="text-[10px] text-primary font-mono font-bold hover:underline">VEDI TUTTI →</button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center text-textSecondary text-[10px] font-mono py-12">
        Nessun asset presente. Aggiungi transazioni per popolarlo.
      </div>
      
      <div className="text-[9px] font-mono text-textSecondary/70 mt-auto pt-4 flex items-center gap-2">
        <span className="text-primary">⚡</span> Fai click sull'icona della scintilla AI per lanciare in tempo reale il report di analisi fondamentale.
      </div>
    </div>
  )
}
