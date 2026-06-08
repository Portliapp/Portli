import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Coins, 
  HelpCircle, 
  PiggyBank, 
  LineChart as ChartIcon, 
  ArrowRight, 
  Check, 
  Sparkles,
  Percent,
  TrendingDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface CompoundSimulatorProps {
  initialValue: number;
}

interface YearlySimPoint {
  year: number;
  yearLabel: string;
  principal: number;
  totalContributions: number;
  interestEarned: number;
  totalBalanceGross: number;
  totalBalanceNet: number;
  taxesPaid: number;
}

export default function CompoundSimulator({ initialValue = 12500 }: CompoundSimulatorProps) {
  // Let's set initial defaults.
  // If the user's portfolio value is extremely low or 0, let's default to a friendly initial sum of €10.000
  const portfolioBase = initialValue > 0 ? initialValue : 10000;

  const [principal, setPrincipal] = useState<number>(Math.round(portfolioBase));
  const [annualReturn, setAnnualReturn] = useState<number>(8); // 8% standard stock CAGR
  const [monthlyContribution, setMonthlyContribution] = useState<number>(300); // 300 EUR per month
  const [applyTax, setApplyTax] = useState<boolean>(true); // standard Italian CGT 26%
  const [taxRate, setTaxRate] = useState<number>(26); // percentage 26%

  // Recalculate simulation values dynamically when inputs change
  const simulationData = useMemo(() => {
    const data: YearlySimPoint[] = [];
    let currentBalanceGross = principal;
    let accumulatedContributions = 0;
    let accumulatedInterest = 0;

    // Year 0
    data.push({
      year: 0,
      yearLabel: 'Inizio',
      principal,
      totalContributions: 0,
      interestEarned: 0,
      totalBalanceGross: principal,
      totalBalanceNet: principal,
      taxesPaid: 0
    });

    const monthlyRate = annualReturn / 100 / 12;

    for (let y = 1; y <= 10; y++) {
      let principalStart = currentBalanceGross;
      let yearInterest = 0;
      let yearContributions = 0;

      // Compound monthly for high precision
      for (let m = 0; m < 12; m++) {
        // Interest gained on previous balance
        const interestThisMonth = currentBalanceGross * monthlyRate;
        yearInterest += interestThisMonth;
        currentBalanceGross += interestThisMonth;

        // Contribution added at the end of the month
        currentBalanceGross += monthlyContribution;
        yearContributions += monthlyContribution;
      }

      accumulatedContributions += yearContributions;
      accumulatedInterest += yearInterest;

      // Compute simple Italian capital gain tax (on interest earned so far upon hypothetical withdrawal)
      const taxesPaid = accumulatedInterest * (taxRate / 100);
      const totalBalanceNet = applyTax ? (currentBalanceGross - taxesPaid) : currentBalanceGross;

      data.push({
        year: y,
        yearLabel: `Anno ${y}`,
        principal,
        totalContributions: parseFloat(accumulatedContributions.toFixed(2)),
        interestEarned: parseFloat(accumulatedInterest.toFixed(2)),
        totalBalanceGross: parseFloat(currentBalanceGross.toFixed(2)),
        totalBalanceNet: parseFloat(totalBalanceNet.toFixed(2)),
        taxesPaid: parseFloat(taxesPaid.toFixed(2))
      });
    }

    const finalPoint = data[data.length - 1];
    const grossProfitPercent = principal > 0 ? ((finalPoint.totalBalanceGross - principal) / principal) * 100 : 0;
    const netProfitPercent = principal > 0 ? ((finalPoint.totalBalanceNet - principal) / principal) * 100 : 0;

    return {
      yearlyPoints: data,
      totals: {
        finalGross: finalPoint.totalBalanceGross,
        finalNet: finalPoint.totalBalanceNet,
        investedAmount: principal + accumulatedContributions,
        totalInterest: accumulatedInterest,
        totalTaxes: finalPoint.taxesPaid,
        grossProfitPercent,
        netProfitPercent
      }
    };
  }, [principal, annualReturn, monthlyContribution, applyTax, taxRate]);

  const { yearlyPoints, totals } = simulationData;

  // Reset principal back to the exact current portfolio value
  const handleResetToPortfolio = () => {
    setPrincipal(Math.round(portfolioBase));
  };

  return (
    <div id="compound-simulator-component" className="bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border flex flex-col gap-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1a2332]/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#00e5a0]/10 border border-[#00e5a0]/20">
            <Calculator className="h-4.5 w-4.5 text-[#00e5a0]" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono text-[11px] flex items-center gap-1.5">
              Simulazione Dinamica Interesse Composto (10 Anni)
              <Sparkles className="h-3 w-3 text-[#00c2ff] animate-pulse" />
            </h3>
            <p className="text-[10px] text-gray-400 font-mono">
              Calcola la crescita geometrica basandoti sui fondi correnti e l'accumulo ricorrente
            </p>
          </div>
        </div>

        {portfolioBase > 0 && Math.abs(principal - Math.round(portfolioBase)) > 1 && (
          <button
            id="sim-reset-portfolio-btn"
            onClick={handleResetToPortfolio}
            className="text-[9.5px] font-mono uppercase bg-[#00c2ff]/10 hover:bg-[#00c2ff]/20 text-[#00c2ff] border border-[#00c2ff]/20 hover:border-[#00c2ff]/40 py-1 px-2.5 rounded transition cursor-pointer select-none font-black"
          >
            Sincronizza con Portafoglio Corrente (e{Math.round(portfolioBase).toLocaleString()})
          </button>
        )}
      </div>

      {/* Main Grid: Left Controls (5 cols) & Right Plot/Insights (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* INPUT PANEL - 5 COLS */}
        <div className="lg:col-span-5 bg-[#07090f]/75 border border-[#1a2332]/75 rounded-xl p-4.5 space-y-4">
          
          {/* Principal Input */}
          <div className="space-y-1.5 font-mono">
            <div className="flex items-center justify-between text-[10px]">
              <label htmlFor="sim-input-principal" className="text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Coins className="h-3 w-3 text-amber-500" />
                Capitale Iniziale
              </label>
              <span className="text-white font-black bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[11px]">
                € {principal.toLocaleString('it-IT')}
              </span>
            </div>
            <input
              id="sim-input-range-principal"
              type="range"
              min="1000"
              max="500000"
              step="1000"
              value={principal}
              onChange={(e) => setPrincipal(parseInt(e.target.value, 10))}
              className="w-full accent-[#00e5a0] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-gray-500 font-mono">
              <span>€ 1k</span>
              <span>€ 100k</span>
              <span>€ 250k</span>
              <span>€ 500k</span>
            </div>
          </div>

          {/* Annualized Interest Rate Input */}
          <div className="space-y-1.5 font-mono">
            <div className="flex items-center justify-between text-[10px]">
              <label htmlFor="sim-input-rate" className="text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Percent className="h-3 w-3 text-[#00c2ff]" />
                Rendimento Annuo Stimato (CAGR)
              </label>
              <span className="text-[#00c2ff] font-black bg-[#00c2ff]/10 border border-[#00c2ff]/20 px-2 py-0.5 rounded text-[11px]">
                {annualReturn}%
              </span>
            </div>
            <input
              id="sim-input-range-rate"
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(parseFloat(e.target.value))}
              className="w-full accent-[#00c2ff] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-gray-500 font-mono">
              <span title="Prudente">1% (Bond)</span>
              <span title="Bilanciato">6% (Classico)</span>
              <span title="Ottimista">12% (Magnificent 7)</span>
              <span title="Speculativo">25% (High Alpha)</span>
            </div>
          </div>

          {/* Monthly Contribution PAC Input */}
          <div className="space-y-1.5 font-mono">
            <div className="flex items-center justify-between text-[10px]">
              <label htmlFor="sim-input-contribution" className="text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <PiggyBank className="h-3 w-3 text-[#00e5a0]" />
                Versamento Mensile Rinnovabile (PAC)
              </label>
              <span className="text-[#00e5a0] font-black bg-[#00e5a0]/10 border border-[#00e5a0]/20 px-2 py-0.5 rounded text-[11px]">
                € {monthlyContribution} / mese
              </span>
            </div>
            <input
              id="sim-input-range-contribution"
              type="range"
              min="0"
              max="2000"
              step="25"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(parseInt(e.target.value, 10))}
              className="w-full accent-[#00e5a0] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-gray-500 font-mono">
              <span>Nessuno (€0)</span>
              <span>€ 250</span>
              <span>€ 500</span>
              <span>€ 1.000</span>
              <span>€ 2.000</span>
            </div>
          </div>

          {/* Capital Gains Tax Configuration Box */}
          <div className="bg-[#111927]/60 border border-[#1a2332] p-3 rounded-lg space-y-2.5 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="sim-checkbox-tax"
                  type="checkbox"
                  checked={applyTax}
                  onChange={(e) => setApplyTax(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-[#00e5a0] focus:ring-[#00e5a0] h-3.5 w-3.5 cursor-pointer"
                />
                <label htmlFor="sim-checkbox-tax" className="text-[10px] font-bold text-gray-300 uppercase tracking-wide cursor-pointer select-none">
                  Detrai Imposta Sostitutiva
                </label>
              </div>
              <HelpCircle 
                className="h-3.5 w-3.5 text-gray-500 cursor-help" 
                title="Consente di calcolare l'impatto sul guadagno netto finale simulando l'aliquota sulle plusvalenze maturate. In Italia corrisponde prevalentemente al 26%." 
              />
            </div>

            {applyTax && (
              <div className="flex items-center justify-between pt-1 border-t border-[#1a2332]/30 text-[9.5px]">
                <span className="text-gray-500">Aliquota Fiscale (Capital Gain Tax):</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold">{taxRate}%</span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setTaxRate(26)}
                      className={`px-1 rounded text-[8px] border font-black ${taxRate === 26 ? 'bg-[#ff3d6b]/15 border-[#ff3d6b]/40 text-[#ff3d6b]' : 'border-slate-800 text-gray-500'}`}
                      title="Standard Azioni/Cripto Italia"
                    >
                      26% IT
                    </button>
                    <button 
                      onClick={() => setTaxRate(12.5)}
                      className={`px-1 rounded text-[8px] border font-black ${taxRate === 12.5 ? 'bg-[#00c2ff]/15 border-[#00c2ff]/40 text-[#00c2ff]' : 'border-slate-800 text-gray-500'}`}
                      title="Agevolata Titoli di Stato / Whitelist"
                    >
                      12.5% BOT
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats Explainer of CAGR growth */}
          <div className="p-3 bg-slate-900/40 border border-[#1a2332] rounded-lg text-[9px] font-mono leading-relaxed space-y-1">
            <div className="text-[#00c2ff] font-bold uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-[#00c2ff]" />
              Equazione Matematica Applicata
            </div>
            <p className="text-gray-500">
              Usa la formula mensilizzata compounding:  
              <code className="text-gray-300 block my-1 font-bold">A = P*(1+r/12)^nt + PMT * [((1+r/12)^nt - 1)/(r/12)]</code>
              dove l'interesse matura mese per mese, capitalizzandosi geometricamente. Le tasse sono stimate progressivamente sull'incremento di rendimento.
            </p>
          </div>

        </div>

        {/* CHART & RESULT DETAILED PANELS - 7 COLS */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5 bg-[#07090f]/40 border border-[#1a2332]/50 rounded-xl p-4.5">
          
          {/* Key Simulation Output Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            
            <div className="bg-[#111927]/80 border border-[#1a2332] p-2.5 rounded-xl font-mono">
              <span className="text-[8px] text-gray-500 uppercase font-black block tracking-wider">Investimento Totale</span>
              <span className="text-sm font-black text-gray-300 block mt-0.5">
                € {totals.investedAmount.toLocaleString('it-IT', { maximumFractionDigits: 0 })}
              </span>
              <span className="text-[8.5px] text-gray-500 block mt-0.5">
                Capitale + Versamenti PAC
              </span>
            </div>

            <div className="bg-[#111927]/80 border border-[#1a2332] p-2.5 rounded-xl font-mono">
              <span className="text-[8px] text-gray-500 uppercase font-black block tracking-wider">Valore Finale Lordo</span>
              <span className="text-sm font-black text-[#00e5a0] block mt-0.5">
                € {totals.finalGross.toLocaleString('it-IT', { maximumFractionDigits: 0 })}
              </span>
              <span className="text-[8.5px] text-[#00e5a0] block mt-0.5 font-bold">
                +{totals.grossProfitPercent.toFixed(0)}% Profitto Lordo
              </span>
            </div>

            <div className="bg-[#111927]/80 border border-[#1a2332] p-2.5 rounded-xl font-mono col-span-2 md:col-span-1">
              <span className="text-[8px] text-[#00c2ff] uppercase font-black block tracking-wider">Bilancio Netto Stimato</span>
              <span className="text-sm font-black text-[#00c2ff] block mt-0.5">
                € {totals.finalNet.toLocaleString('it-IT', { maximumFractionDigits: 0 })}
              </span>
              <span className="text-[8.5px] text-gray-400 block mt-0.5">
                {applyTax ? `Tasse d'uscita: -€${totals.totalTaxes.toLocaleString('it-IT', { maximumFractionDigits: 0 })}` : 'Nessuna imposta applicata'}
              </span>
            </div>

          </div>

          {/* Area Chart visualization of components */}
          <div className="w-full h-[210px] font-mono select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearlyPoints} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#475569" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#475569" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00c2ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00c2ff" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5a0" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00e5a0" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} />
                <XAxis dataKey="yearLabel" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={9} 
                  tickLine={false} 
                  tickFormatter={(val) => `€${Math.round(val/1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1223',
                    borderColor: '#1a2332',
                    borderRadius: '10px',
                    fontSize: '9.5px',
                    fontFamily: 'monospace',
                    color: '#f8fafc',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
                  }}
                  formatter={(val: any) => [`€ ${Math.round(val).toLocaleString('it-IT')}`]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }} />
                
                {/* Principal stock */}
                <Area 
                  type="monotone" 
                  dataKey="principal" 
                  name="Capitale Iniziale" 
                  stackId="1" 
                  stroke="#64748b" 
                  fill="url(#colorPrincipal)" 
                />
                
                {/* PAC Added contributions */}
                <Area 
                  type="monotone" 
                  dataKey="totalContributions" 
                  name="PAC Accumulato" 
                  stackId="1" 
                  stroke="#00c2ff" 
                  fill="url(#colorContributions)" 
                />
                
                {/* Interest earned growth */}
                <Area 
                  type="monotone" 
                  dataKey="interestEarned" 
                  name="Interessi Composti" 
                  stackId="1" 
                  stroke="#00e5a0" 
                  fill="url(#colorInterest)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Interactive Year slider / Highlights */}
          <div className="border-t border-[#1a2332]/40 pt-3 flex flex-wrap items-center justify-between text-[10px] font-mono text-gray-500 gap-3">
            <span className="flex items-center gap-1.5">
              <PiggyBank className="h-4 w-4 text-[#00e5a0]" />
              Nel solo <strong>Anno 10</strong>, il tuo capitale maturerà <strong>€ {Math.round(yearlyPoints[10].interestEarned - yearlyPoints[9].interestEarned).toLocaleString('it-IT')}</strong> di interessi aggiuntivi.
            </span>
            <div className="flex gap-1 items-center bg-[#07090f] px-2 py-1 border border-[#1a2332] rounded">
              <span className="text-gray-500">Tasso Netto Reale:</span>
              <span className="text-[#00e5a0] font-black">{(annualReturn * (applyTax ? (1 - taxRate/100) : 1)).toFixed(2)}%</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
