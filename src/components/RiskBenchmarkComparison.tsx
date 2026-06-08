import React, { useState, useMemo } from 'react';
import { PortfolioAsset, AssetType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Target, 
  Sparkles, 
  Info, 
  AlertCircle, 
  CheckCircle, 
  ChevronRight, 
  TrendingUp,
  Sliders,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip 
} from 'recharts';

interface RiskBenchmarkComparisonProps {
  assets: PortfolioAsset[];
  totalValue: number;
}

const T = {
  card: '#111927',
  border: '#1a2332',
  surface: '#07090f',
  accent: '#00c2ff', // Neon Blue
  green: '#00e5a0',  // Mint Green
  red: '#ff3d6b',    // Neon Red
  yellow: '#f59e0b', // Gold
  violet: '#a78bfa', // Purple
  text: '#f8fafc',
  muted: '#64748b',
  muted2: '#475569'
};

type BenchmarkKey = 'prudenziale' | 'moderato' | 'speculativo';

interface BenchmarkProfile {
  name: string;
  STOCK: number;
  ETF: number;
  CRYPTO: number;
  CASH: number;
  desc: string;
  badge: string;
  badgeBg: string;
  badgeTextColor: string;
}

const BENCHMARKS: Record<BenchmarkKey, BenchmarkProfile> = {
  prudenziale: {
    name: "Prudenziale (Conservativo 20/80)",
    STOCK: 15,
    ETF: 55,
    CRYPTO: 0,
    CASH: 30,
    desc: "Ottimizzato per la massima tutela del capitale. Forte dominanza del coefficiente azionario passivo (ETF) ed abbondante liquidità compensativa. Volatilità contenuta.",
    badge: "Basso Rischio",
    badgeBg: "bg-[#00e5a0]/10 border-[#00e5a0]/30",
    badgeTextColor: "text-[#00e5a0]"
  },
  moderato: {
    name: "Moderato (Bilanciato Standard)",
    STOCK: 40,
    ETF: 45,
    CRYPTO: 5,
    CASH: 10,
    desc: "Il benchmark istituzionale di riferimento per la crescita sostenibile nel medio termine. Ottimale rapporto rischio/rendimento corretto per la covarianza.",
    badge: "Rischio Medio",
    badgeBg: "bg-[#00c2ff]/10 border-[#00c2ff]/30",
    badgeTextColor: "text-[#00c2ff]"
  },
  speculativo: {
    name: "Speculativo (Aggressiva Crescita)",
    STOCK: 60,
    ETF: 15,
    CRYPTO: 20,
    CASH: 5,
    desc: "Proiettato alla ricapitalizzazione veloce. Ottimizzato per wallet ad alta tolleranza alle perdite, con esposizione crittografica e azionaria preminente.",
    badge: "Alto Rischio",
    badgeBg: "bg-[#ff3d6b]/10 border-[#ff3d6b]/30",
    badgeTextColor: "text-[#ff3d6b]"
  }
};

export default function RiskBenchmarkComparison({ assets, totalValue }: RiskBenchmarkComparisonProps) {
  const [selectedBenchmarkKey, setSelectedBenchmarkKey] = useState<BenchmarkKey>('moderato');

  // Compute actual weights of each asset class in the active portfolio
  const actualWeights = useMemo(() => {
    const weights: Record<AssetType, number> = { STOCK: 0, ETF: 0, CRYPTO: 0, CASH: 0 };
    if (assets.length === 0 || totalValue === 0) {
      return weights;
    }
    
    // Accumulate actual monetary values
    const allocations: Record<AssetType, number> = { STOCK: 0, ETF: 0, CRYPTO: 0, CASH: 0 };
    assets.forEach(a => {
      allocations[a.assetType] = (allocations[a.assetType] || 0) + a.currentValue;
    });

    // Translate to fractions of total
    (Object.keys(allocations) as AssetType[]).forEach(type => {
      weights[type] = allocations[type] / totalValue;
    });

    return weights;
  }, [assets, totalValue]);

  const activeBenchmark = BENCHMARKS[selectedBenchmarkKey];

  // Recharts structured Radar data
  const chartData = useMemo(() => {
    const labelsMap: Record<AssetType, string> = {
      STOCK: 'Azioni (STOCK)',
      ETF: 'Fondi (ETF)',
      CRYPTO: 'Cripto (CRYPTO)',
      CASH: 'Liquidità (CASH)'
    };

    return (['STOCK', 'ETF', 'CRYPTO', 'CASH'] as AssetType[]).map(type => {
      const actualVal = parseFloat((actualWeights[type] * 100).toFixed(1));
      const benchmarkVal = activeBenchmark[type];

      return {
        subject: labelsMap[type],
        'Il Tuo Portafoglio (%)': actualVal,
        'Benchmark Target (%)': benchmarkVal,
      };
    });
  }, [actualWeights, activeBenchmark]);

  // Compute divergence index: Sum of absolute differences (0% - 200% maximum bounds)
  const divergenceAnalysis = useMemo(() => {
    const classes: AssetType[] = ['STOCK', 'ETF', 'CRYPTO', 'CASH'];
    let totalAbsDiff = 0;

    classes.forEach(type => {
      const userPct = actualWeights[type] * 100;
      const targetPct = activeBenchmark[type];
      totalAbsDiff += Math.abs(userPct - targetPct);
    });

    // We can translate this into a "Similarity Score" from 0% (total mismatch) to 100% (perfect mirror)
    // Absolute difference bounds: up to 200 (if one is 100% and another has different 100%).
    const similarityScore = Math.round(100 - (totalAbsDiff / 2));
    const clampedSimilarity = Math.max(0, Math.min(100, similarityScore));

    let rating = 'Elevato Decentramento';
    let ratingColor = T.red;
    let explanation = 'La tua distribuzione strutturale devia marcatamente rispetto al benchmark selezionato. Considera un attento ribilanciamento.';

    if (clampedSimilarity >= 85) {
      rating = 'Allineamento Armonico';
      ratingColor = T.green;
      explanation = 'Il tuo portafoglio è in eccellente armonia strategica con il benchmark di riferimento selezionato.';
    } else if (clampedSimilarity >= 60) {
      rating = 'Scostamento Moderato';
      ratingColor = T.accent;
      explanation = 'Sono presenti marginali scostamenti di esposizione. Alcuni ribilanciamenti mirati possono perfezionare la replica storica.';
    }

    // List of active optimization recommendations
    const recommendations = classes.map(type => {
      const userPct = actualWeights[type] * 100;
      const targetPct = activeBenchmark[type];
      const difference = userPct - targetPct; // positive means overweight, negative means underweight

      return {
        type,
        difference,
        userPct,
        targetPct
      };
    }).filter(rec => Math.abs(rec.difference) >= 4.0); // Only highlight meaningful deviations

    return {
      similarity: clampedSimilarity,
      rating,
      ratingColor,
      explanation,
      recommendations
    };
  }, [actualWeights, activeBenchmark]);

  // Beautiful custom Tooltip inside the Benchmarks chart
  const BenchmarkTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b1223]/95 border border-[#1a2332] p-4 rounded-xl shadow-2xl text-[10.5px] font-mono leading-relaxed select-none backdrop-blur-md">
          <p className="font-extrabold text-white mb-2.5 pb-1 border-b border-[#1a2332]/50 text-xs">
            {payload[0].payload.subject}
          </p>
          <div className="space-y-1.5 font-bold">
            <p className="flex justify-between gap-6 text-[#00c2ff]">
              Tuo Portafoglio: 
              <span>{payload[0].payload['Il Tuo Portafoglio (%)']}%</span>
            </p>
            <p className="flex justify-between gap-6 text-[#ff3d6b]">
              Benchmark Target: 
              <span>{payload[1].payload['Benchmark Target (%)']}%</span>
            </p>
            <p className="flex justify-between gap-6 text-gray-400 font-normal mt-1 border-t border-[#1a2332]/25 pt-1 text-[9.5px]">
              Variazione Netta: 
              <span className={payload[0].payload['Il Tuo Portafoglio (%)'] - payload[1].payload['Benchmark Target (%)'] >= 0 ? "text-[#00e5a0]" : "text-[#ff3d6b]"}>
                {(payload[0].payload['Il Tuo Portafoglio (%)'] - payload[1].payload['Benchmark Target (%)']).toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const hasEmptyPortfolio = assets.length === 0;

  return (
    <div className="bg-[#111927] border border-[#1a2332] rounded-xl p-6 ai-glow neon-border flex flex-col relative overflow-hidden group/benchmark">
      {/* Visual aesthetic highlight */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00c2ff] to-transparent opacity-30 group-hover/benchmark:opacity-75 transition duration-500" />

      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-[#1a2332]/60 pb-4 mb-5">
        <div className="flex items-center gap-2.5 font-mono">
          <Compass className="h-5 w-5 text-[#00c2ff] animate-spin-slow" />
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              ANALISI DI CONCORDANZA COI BENCHMARK DI MERCATO
            </h3>
            <span className="text-[9.5px] text-gray-500 lowercase">
              Parametrizzazione dinamica dell'inefficienza strutturale rispetto ai modelli standard di allocazione
            </span>
          </div>
        </div>

        {/* Dynamic benchmark select pill controllers */}
        <div className="flex bg-[#07090f]/80 border border-[#14233c] p-1 rounded-xl font-mono text-[9px] font-extrabold cursor-pointer">
          {(Object.keys(BENCHMARKS) as BenchmarkKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedBenchmarkKey(key)}
              className={`px-3 py-1.5 rounded-lg transition-colors font-mono relative ${
                selectedBenchmarkKey === key
                  ? 'bg-[#14233c] text-[#00c2ff]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {key === 'prudenziale' ? 'Prudenziale' : key === 'moderato' ? 'Bilanciato' : 'Speculativo'}
            </button>
          ))}
        </div>
      </div>

      {hasEmptyPortfolio ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-[#ff3d6b] opacity-75 mb-2 animate-pulse" />
          <span className="text-xs text-gray-300 font-mono font-bold">Analisi Benchmark Indisponibile</span>
          <p className="text-[10px] text-gray-500 mt-1 max-w-sm font-mono leading-relaxed">
            Nessun asset attivo rilevato. Aggiungi asset o depositi nella dashboard principale per confrontare le tue finanze con i benchmark istituzionali globali.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* RADAR CONTAINER (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center relative min-h-[260px] bg-[#07090f]/30 border border-[#14233c]/40 rounded-2xl p-4">
            
            {/* Metadata floaters on top of radar */}
            <div className="absolute top-3 left-3 flex flex-col font-mono">
              <span className="text-[8px] text-gray-500 uppercase font-black">Indice Similitudine</span>
              <div className="h-5 overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.span 
                    key={`similarity-${selectedBenchmarkKey}-${divergenceAnalysis.similarity}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="text-sm font-black block"
                    style={{ color: divergenceAnalysis.ratingColor }}
                  >
                    {divergenceAnalysis.similarity}%
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="absolute top-3 right-3 flex flex-col font-mono text-right">
              <span className="text-[8px] text-gray-500 uppercase font-black">Grado Rating</span>
              <div className="h-5 overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.span 
                    key={`rating-${selectedBenchmarkKey}-${divergenceAnalysis.rating}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="text-[10px] font-bold block uppercase tracking-wider"
                    style={{ color: divergenceAnalysis.ratingColor }}
                  >
                    {divergenceAnalysis.rating}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Radar component embedded cleanly */}
            <motion.div 
              key={selectedBenchmarkKey}
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(2px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="w-full h-56 mt-4"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="82%" data={chartData}>
                  <PolarGrid stroke="#1c2c47" opacity={0.35} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: 'var(--text-dim)', fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold' }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: '#4b5563', fontSize: 7.5 }}
                    axisLine={false} 
                  />
                  
                  <Tooltip content={<BenchmarkTooltip />} />
                  <Legend 
                    iconType="circle" 
                    iconSize={8}
                    wrapperStyle={{ fontSize: '9px', fontFamily: 'monospace', bottom: 0 }} 
                  />
                  
                  <Radar
                    name="Portafoglio Attivo (%)"
                    dataKey="Il Tuo Portafoglio (%)"
                    stroke="#00c2ff"
                    fill="#00c2ff"
                    fillOpacity={0.10}
                    strokeWidth={2}
                    isAnimationActive={true}
                    animationDuration={650}
                    animationEasing="ease-out"
                  />
                  <Radar
                    name={`${activeBenchmark.name} (%)`}
                    dataKey="Benchmark Target (%)"
                    stroke="#ff3d6b"
                    fill="#ff3d6b"
                    fillOpacity={0.14}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    isAnimationActive={true}
                    animationDuration={650}
                    animationEasing="ease-out"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* ANALYSIS PANEL DETAILS (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4 font-mono">
            
            {/* Descriptive block of selected benchmark */}
            <div className="bg-[#07090f]/75 border border-[#1a2332] p-4 rounded-xl relative">
              <div className="flex justify-between items-start gap-3 border-b border-[#1a2332]/50 pb-2 mb-2">
                <span className="text-xs font-black text-white">{activeBenchmark.name}</span>
                <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded border ${activeBenchmark.badgeBg} ${activeBenchmark.badgeTextColor}`}>
                  {activeBenchmark.badge}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                {activeBenchmark.desc}
              </p>
            </div>

            {/* Similitude Summary Evaluation */}
            <div className="bg-[#050811]/90 border border-[#1a2332] p-4 rounded-xl flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {divergenceAnalysis.similarity >= 85 ? (
                  <CheckCircle className="h-5 w-5 text-[#00e5a0] animate-pulse" />
                ) : (
                  <Info className="h-5 w-5 text-amber-500 animate-pulse" />
                )}
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black block">
                  VALUTAZIONE DEL DISPOSITIVO DI SIMILITUDINE
                </span>
                <p className="text-xs font-black text-white mt-0.5" style={{ color: divergenceAnalysis.ratingColor }}>
                  Similitudine Globale: {divergenceAnalysis.similarity}% ({divergenceAnalysis.rating})
                </p>
                <p className="text-[10px] text-gray-400 leading-normal mt-1">
                  {divergenceAnalysis.explanation}
                </p>
              </div>
            </div>

            {/* DIVERGENCE ACTION SUGGESTIONS LIST */}
            <div className="border border-[#1a2332] rounded-xl overflow-hidden bg-[#07090f]/30">
              <div className="bg-[#14233c]/25 border-b border-[#1a2332] px-3.5 py-2 text-[9.5px] font-black text-[#00c2ff] uppercase flex items-center justify-between">
                <span>Ricalibrazione Suggerita per l'Allineamento</span>
                <Sliders className="h-3.5 w-3.5" />
              </div>

              <div className="divide-y divide-[#1a2332]/40 max-h-[140px] overflow-y-auto pr-1">
                {divergenceAnalysis.recommendations.length === 0 ? (
                  <div className="text-center py-5 text-gray-500 text-[10px] italic">
                    Nessun ribilanciamento critico richiesto. Il tuo portafoglio è speculare.
                  </div>
                ) : (
                  divergenceAnalysis.recommendations.map((rec) => {
                    const isOverweight = rec.difference > 0;
                    let label = 'Azioni';
                    let bulletColor = '#00c2ff';
                    if (rec.type === 'CRYPTO') {
                      label = 'Cripto';
                      bulletColor = '#ff3d6b';
                    } else if (rec.type === 'ETF') {
                      label = 'Fondi (ETF)';
                      bulletColor = '#a78bfa';
                    } else if (rec.type === 'CASH') {
                      label = 'Liquidità';
                      bulletColor = '#00e5a0';
                    }

                    return (
                      <div key={rec.type} className="px-3.5 py-2 hover:bg-[#121f37]/10 transition flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: bulletColor }} />
                          <span className="font-bold text-white">{label}</span>
                          <span className="text-gray-500">
                            (Attuale: {rec.userPct.toFixed(1)}% ➔ Target: {rec.targetPct}%)
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            isOverweight 
                              ? 'bg-[#ff3d6b]/10 text-[#ff3d6b]' 
                              : 'bg-[#00e5a0]/10 text-[#00e5a0]'
                          }`}>
                            {isOverweight 
                              ? `Riduci di ${rec.difference.toFixed(1)}%` 
                              : `Aumenta di ${Math.abs(rec.difference).toFixed(1)}%`
                            }
                          </span>
                          <ChevronRight className="h-3 w-3 text-gray-600" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Footer tips */}
            <div className="bg-[#14233c]/10 border border-[#14233c]/40 p-3 rounded-lg flex items-center gap-2 text-[9.5px] leading-relaxed text-gray-400 font-mono">
              <Sparkles className="h-3.5 w-3.5 text-[#f59e0b] shrink-0 animate-pulse" />
              <span>
                Replicare i benchmark riduce il rischio idiosincratico. Puoi simulare gli acquisti simulati nella console transazioni.
              </span>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
