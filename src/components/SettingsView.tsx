import React, { useState } from 'react';
import { Settings, ShieldCheck, RefreshCw, AlertCircle, Sparkles, Server, Check } from 'lucide-react';

interface SettingsViewProps {
  onResetData: () => void;
  onClearAllData: () => void;
  transactionsCount: number;
}

export default function SettingsView({ onResetData, onClearAllData, transactionsCount }: SettingsViewProps) {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('qevora_username') || localStorage.getItem('portly_username') || 'Davide';
  });
  const [tier, setTier] = useState(() => {
    return localStorage.getItem('qevora_tier') || localStorage.getItem('portly_tier') || 'Piano Free';
  });

  const [savedUserFeedback, setSavedUserFeedback] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = userName.trim() || 'Davide';
    localStorage.setItem('qevora_username', cleanName);
    localStorage.setItem('portly_username', cleanName);
    localStorage.setItem('qevora_tier', tier);
    localStorage.setItem('portly_tier', tier);
    setSavedUserFeedback(true);
    setTimeout(() => {
      setSavedUserFeedback(false);
      // Trigger a light refresh so upper welcome texts reflect the change!
      window.dispatchEvent(new Event('storage'));
    }, 1500);
  };

  const [confirmAction, setConfirmAction] = useState<'reset' | 'clear' | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleResetConfirm = () => {
    setConfirmAction('reset');
  };

  const handleClearConfirm = () => {
    setConfirmAction('clear');
  };

  const executeReset = () => {
    onResetData();
    setConfirmAction(null);
    setSuccessToast("Dati ripristinati correttamente con il database Demo!");
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const executeClear = () => {
    onClearAllData();
    setConfirmAction(null);
    setSuccessToast("Portafoglio svuotato con successo! Puoi iniziare da zero.");
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const isGeminiAvailable = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-wider font-mono">
          Impostazioni Sistema & Configurazione
        </h2>
        <p className="text-xs text-gray-500 font-mono mt-0.5">
          Gestione profilazione, connettività server e ripristino dei parametri di fabbrica
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        
        {/* COLUMN A (7 COLS): PROFILE & DETAILS CONFIG */}
        <div className="md:col-span-7 bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border flex flex-col justify-between">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1a2332]/60 pb-3">
              <Settings className="h-4.5 w-4.5 text-[#00c2ff]" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                Profilo Utente
              </h3>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                  Nome Profilo
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-[#07090f] border border-[#1a2332] text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-[#00c2ff]/60 font-mono"
                  placeholder="Inserisci il tuo nome"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                  Piano Tariffario
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full bg-[#07090f] border border-[#1a2332] text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-[#00c2ff]/60"
                >
                  <option value="Piano Free">Piano Free (Default)</option>
                  <option value="Piano Premium Elite">Piano Premium Elite (Massima Analitica)</option>
                  <option value="Quantum Institution">Quantum Institution (API dedicate)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#1a2332]/40">
              <button
                type="submit"
                className="bg-[#00c2ff] hover:bg-[#00c2ff]/90 text-slate-900 font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition duration-150 flex items-center gap-1.5 cursor-pointer"
              >
                {savedUserFeedback ? (
                  <>
                    <Check className="h-4 w-4" />
                    Profilo Salvato!
                  </>
                ) : (
                  "Salva Modifiche"
                )}
              </button>
            </div>
          </form>

          <p className="text-[10px] text-gray-500 font-mono mt-4 italic">
            Nota: I dati inseriti sono salvati in localStorage locale per garantire assoluta privacy.
          </p>
        </div>

        {/* COLUMN B (5 COLS): CONNECTION DIAGNOSTICS & RESET SYSTEM */}
        <div className="md:col-span-5 space-y-6">
          
          {/* DIAGNOSTIC API CARD */}
          <div className="bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1a2332]/60 pb-3">
              <Server className="h-4.5 w-4.5 text-[#00e5a0]" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                Diagnostica Connessione
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center bg-[#07090f] p-2 rounded">
                <span className="text-gray-400 text-[10px]">Stato Client-Server:</span>
                <span className="text-[#00e5a0] flex items-center gap-1 font-bold text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a0] inline-block animate-pulse" />
                  ONLINE
                </span>
              </div>

              <div className="flex justify-between items-center bg-[#07090f] p-2 rounded">
                <span className="text-gray-400 text-[10px]">Gemini AI Engine:</span>
                {isGeminiAvailable ? (
                  <span className="text-[#00c2ff] flex items-center gap-1 font-bold text-[10px]">
                    <Sparkles className="h-3 w-3" />
                    LIVE COGNITIVE
                  </span>
                ) : (
                  <span className="text-amber-500 flex items-center gap-1 font-bold text-[10px]">
                    SIMULATION MODE
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center bg-[#07090f] p-2 rounded">
                <span className="text-gray-400 text-[10px]">Latenza API:</span>
                <span className="text-gray-300 text-[10px]">21ms</span>
              </div>
            </div>
          </div>

          {/* DANGEROUS OVERLAY SYSTEM WIPE */}
          <div className="bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border space-y-4">
            <div className="flex items-center gap-2 border-b border-[#ff3d6b]/30 pb-3">
              <AlertCircle className="h-4.5 w-4.5 text-[#ff3d6b]" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                Zona di Sicurezza
              </h3>
            </div>

            {successToast && (
              <div className="bg-[#00e5a0]/15 border border-[#00e5a0]/40 text-[#00e5a0] p-3 rounded-lg text-[11px] font-mono leading-relaxed animate-pulse">
                ✓ {successToast}
              </div>
            )}

            <p className="text-[11px] leading-relaxed text-gray-400">
              Usa questi controlli per ripristinare il database demo o per iniziare completamente da zero con un portafoglio vuoto.
            </p>

            {confirmAction === 'clear' ? (
              <div className="bg-[#f59e0b]/5 border border-[#f59e0b]/30 p-3.5 rounded-xl space-y-3 font-mono text-xs">
                <span className="text-[#f59e0b] font-black uppercase text-[10px] block tracking-wider">
                  ⚠️ CONFERMA RICHIESTA
                </span>
                <p className="text-gray-300 leading-relaxed text-[10px]">
                  Sei assolutamente sicuro di voler <strong>SVUOTARE</strong> completamente il portafoglio? Tutti i movimenti inseriti andranno persi in modo definitivo.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={executeClear}
                    className="bg-[#f59e0b] hover:bg-[#f59e0b]/90 text-slate-950 font-black text-[9px] uppercase tracking-wider py-2 rounded-lg transition"
                  >
                    Sì, svuota tutto
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmAction(null)}
                    className="bg-[#1a2332] text-gray-400 hover:text-white border border-[#1d293d] font-bold text-[9px] uppercase tracking-wider py-2 rounded-lg transition"
                  >
                    Annulla
                  </button>
                </div>
              </div>
            ) : confirmAction === 'reset' ? (
              <div className="bg-[#ff3d6b]/5 border border-[#ff3d6b]/30 p-3.5 rounded-xl space-y-3 font-mono text-xs">
                <span className="text-[#ff3d6b] font-black uppercase text-[10px] block tracking-wider">
                  ⚠️ CONFERMA RESORT
                </span>
                <p className="text-gray-300 leading-relaxed text-[10px]">
                  Ripristinare i dati cancellerà le transazioni attive ricaricando l'archivio demo iniziale. Sei sicuro?
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={executeReset}
                    className="bg-[#ff3d6b] hover:bg-[#ff3d6b]/95 text-white font-black text-[9px] uppercase tracking-wider py-2 rounded-lg transition"
                  >
                    Sì, reset demo
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmAction(null)}
                    className="bg-[#1a2332] text-gray-400 hover:text-white border border-[#1d293d] font-bold text-[9px] uppercase tracking-wider py-2 rounded-lg transition"
                  >
                    Annulla
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleClearConfirm}
                  className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20 font-black text-[10px] uppercase tracking-wider py-2.5 rounded-lg transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  Svuota Portafoglio (Inizia da zero)
                </button>

                <button
                  type="button"
                  onClick={handleResetConfirm}
                  className="w-full bg-[#ff3d6b]/10 border border-[#ff3d6b]/30 text-[#ff3d6b] hover:bg-[#ff3d6b]/20 font-black text-[10px] uppercase tracking-wider py-2.5 rounded-lg transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset ai Dati Demo Iniziali
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
