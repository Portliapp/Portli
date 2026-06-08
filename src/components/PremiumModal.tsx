import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Crown, ShieldAlert, Award, Star, Zap, Cpu } from 'lucide-react';

interface PremiumModalProps {
  onClose: () => void;
  userTier: string;
  onUpgradeSuccess: (newTier: string) => void;
}

export default function PremiumModal({ onClose, userTier, onUpgradeSuccess }: PremiumModalProps) {
  const [billingPeriod, setBillingPeriod] = useState<'MONTH' | 'YEAR'>('YEAR');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Benefits description list
  const premiumFeatures = [
    {
      title: 'Backtesting Quantistico Monte Carlo',
      desc: 'Simula 10,000 traiettorie ed analizza l\'evoluzione probabilistica dei tuoi asset.',
      icon: Cpu,
      color: 'text-[#00c2ff]'
    },
    {
      title: 'Analisi Integrale Pro (Modelli AI Sbloccati)',
      desc: 'Sblocca il modello Gemini AI avanzato per custom ticker sconosciuti con report illimitati.',
      icon: Sparkles,
      color: 'text-violet-500'
    },
    {
      title: 'Ottimizzatore efficiente di Markowitz',
      desc: 'Distribuisci le posizioni storiche per massimizzare lo Sharpe Ratio ed abbattere la volatilità.',
      icon: Award,
      color: 'text-[#00e5a0]'
    },
    {
      title: 'Esportazione Dati Avanzati & CSV',
      desc: 'Scarica lo storico dei movimenti finanziari e la reportistica di calcolo con un click.',
      icon: Check,
      color: 'text-amber-500'
    }
  ];

  const handleSubscribe = async () => {
    setLoading(true);
    // Simulate real sandbox subscription check
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      onUpgradeSuccess('Piano Premium Elite');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Backdrop with elegant blur */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#07090f]/80 backdrop-blur-md cursor-pointer"
      />

      {/* Modal Container */}
      <AnimatePresence>
        {!success ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#111927] border border-[#1a2332] rounded-2xl shadow-2xl overflow-hidden p-6 z-10 font-sans text-xs flex flex-col justify-between max-h-[90vh] overflow-y-auto duration-200"
          >
            {/* Header Badge & Title */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow shadow-amber-500/20">
                  <Crown className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-black text-amber-500 uppercase tracking-widest block">
                    PORTLI PREMIUM ELITE
                  </span>
                  <h3 className="text-[17px] font-black text-white uppercase tracking-tight font-sans">
                    Sblocca la Massima Analitica
                  </h3>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white bg-[#07090f] border border-[#1a2332] p-1.5 rounded-lg hover:border-gray-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-gray-400 leading-relaxed mb-6 font-medium">
              Supera gli standard standard di analisi ed accedi a indicatori finanziari predittivi e simulazioni Monte Carlo usate dai professionisti di Wall Street.
            </p>

            {/* Selector billing toggle */}
            <div className="bg-[#07090f] border border-[#1a2332] p-1 rounded-xl flex items-center justify-between mb-6">
              <button
                onClick={() => setBillingPeriod('MONTH')}
                className={`flex-1 py-1.5 rounded-lg text-center font-bold tracking-wider uppercase text-[10px] transition ${
                  billingPeriod === 'MONTH'
                    ? 'bg-[#111927] text-white border border-[#1a2332] font-black'
                    : 'text-gray-500 hover:text-gray-400'
                }`}
              >
                Mensile • €9.99/mese
              </button>
              <button
                onClick={() => setBillingPeriod('YEAR')}
                className={`flex-1 py-1.5 rounded-lg text-center font-bold tracking-wider uppercase text-[10px] transition relative flex items-center justify-center gap-1.5 ${
                  billingPeriod === 'YEAR'
                    ? 'bg-[#111927] text-white border border-[#1a2332] font-black'
                    : 'text-gray-500 hover:text-gray-400'
                }`}
              >
                Annuale • €5.00/mese
                <span className="text-[8px] bg-[#00e5a0]/15 border border-[#00e5a0]/30 text-[#00e5a0] px-1 py-0.2 rounded font-mono font-bold">
                  SALVA 50%
                </span>
              </button>
            </div>

            {/* List Advantages */}
            <div className="space-y-4.5 mb-6">
              {premiumFeatures.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div key={i} className="flex gap-3 text-left">
                    <div className="h-7 w-7 rounded-lg bg-[#07090f] border border-[#1a2332] flex items-center justify-center shrink-0">
                      <Icon className={`h-4 w-4 ${feat.color}`} />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-white text-[11px] leading-snug">{feat.title}</h4>
                      <p className="text-gray-500 text-[10px] leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Purchase CTA */}
            <div className="border-t border-[#1a2332]/40 pt-4 mt-2">
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-slate-950 hover:text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl transition duration-200 shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-slate-900 border-t-white animate-spin inline-block shrink-0" />
                    Collegamento Canale Pagamento...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Attiva Ora • {billingPeriod === 'YEAR' ? '€59.88 / Anno (~€5/mese)' : '€9.99 / Mese'}
                  </>
                )}
              </button>
              
              <div className="flex justify-center items-center gap-3.5 text-[9px] text-gray-600 font-mono mt-3.5 select-none">
                <span>🔒 SECURE SSL 256-BIT</span>
                <span>•</span>
                <span>ANNULLI QUANDO VUOI</span>
                <span>•</span>
                <span>GARANZIA 30 GIORNI</span>
              </div>
            </div>

          </motion.div>
        ) : (
          /* CELEBRATORY SUCCESS CARD */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md bg-[#111927] border border-amber-500/40 rounded-2xl shadow-2xl p-8 z-10 text-center flex flex-col items-center gap-5"
          >
            <div className="h-16 w-16 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center animate-bounce">
              <Crown className="h-8 w-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-[#00e5a0] font-black uppercase tracking-widest block">
                PAGAMENTO COMPLETATO
              </span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Benvenuto in Elite, {localStorage.getItem('portly_username') || localStorage.getItem('qevora_username') || 'Davide'}!
              </h3>
            </div>

            <p className="text-gray-400 text-xs leading-relaxed max-w-xs font-medium">
              Il tuo piano tariffario è stato aggiornato correttamente a <strong className="text-amber-500">Portli Premium Elite</strong>. Tutte le funzionalità quantitative, le simulazioni basate su reti AI e Markowitz sono ora sbloccate sul tuo account!
            </p>

            <button
              onClick={onClose}
              className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-xl transition duration-150 cursor-pointer shadow-lg shadow-amber-500/10"
            >
              Accedi alle Funzionalità Elite
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
