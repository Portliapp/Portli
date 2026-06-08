export default function PortfolioKpis() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Patrimomio Totale */}
      <div className="card flex flex-col justify-between">
        <div className="text-[10px] uppercase font-mono tracking-widest text-textSecondary mb-4">PATRIMONIO TOTALE</div>
        <div className="text-3xl font-bold font-mono text-white mb-6">€0,00</div>
        
        <div className="mt-auto">
          <div className="flex justify-between text-[10px] text-textSecondary mb-2 font-mono">
            <span>Ripartizione Asset</span>
            <span>EQ: 0% - ETF: 0% - CRY: 0% - LIQ: 0%</span>
          </div>
          <div className="w-full h-1 bg-background rounded-full overflow-hidden flex">
             {/* Vuoto */}
          </div>
        </div>
      </div>

      {/* Capitale Investito */}
      <div className="card flex flex-col justify-between">
        <div className="text-[10px] uppercase font-mono tracking-widest text-textSecondary mb-4">CAPITALE INVESTITO</div>
        <div className="text-3xl font-bold font-mono text-white mb-6">€0,00</div>
        
        <div className="mt-auto flex justify-between items-end border-t border-borderAccent pt-3">
          <div className="text-[10px] text-textSecondary font-mono">Rendimento Assoluto Virtuale</div>
          <div className="text-sm font-bold font-mono text-profit border-b border-dashed border-profit/30 pb-0.5">▲ €0,00</div>
        </div>
      </div>

      {/* Profitabilità Attuale */}
      <div className="card flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="text-[10px] uppercase font-mono tracking-widest text-textSecondary w-1/2">PROFITABILITÀ ATTUALE (PNL)</div>
          <div className="border border-borderAccent rounded px-2 py-1 text-textSecondary font-mono text-[10px]">
            +0.00%
          </div>
        </div>
        <div className="text-center text-textSecondary text-xs font-mono my-auto">
          Nessun asset inserito nel portafoglio
        </div>
      </div>
    </div>
  )
}
