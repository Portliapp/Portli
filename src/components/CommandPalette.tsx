import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  Layers, 
  ArrowUpDown, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Settings, 
  X,
  Sparkles,
  Command,
  ArrowRight
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (section: 'dashboard' | 'holdings' | 'transazioni' | 'analytics' | 'reports' | 'impostazioni' | 'confronto') => void;
  currentSection: string;
}

interface CommandItem {
  id: 'dashboard' | 'holdings' | 'transazioni' | 'analytics' | 'reports' | 'impostazioni' | 'confronto';
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  shortcut: string;
  category: 'Spazio di Lavoro' | 'Analisi & Report' | 'Sistema';
}

export default function CommandPalette({ isOpen, onClose, onSelectSection, currentSection }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    { 
      id: 'dashboard', 
      title: 'Dashboard Principale', 
      subtitle: 'Panoramica del portafoglio, bilancio e KPI principali', 
      icon: LayoutDashboard, 
      shortcut: '1',
      category: 'Spazio di Lavoro'
    },
    { 
      id: 'holdings', 
      title: 'Holdings & Asset', 
      subtitle: 'Dettaglio allocazione e performance dei singoli investimenti', 
      icon: Layers, 
      shortcut: '2',
      category: 'Spazio di Lavoro'
    },
    { 
      id: 'transazioni', 
      title: 'Registro Transazioni', 
      subtitle: 'Aggiungi, modifica o visualizza lo storico degli scambi', 
      icon: ArrowUpDown, 
      shortcut: '3',
      category: 'Spazio di Lavoro'
    },
    { 
      id: 'analytics', 
      title: 'Analisi Quantitativa & AI', 
      subtitle: 'Simulazioni Monte Carlo e modelli previsionali complessi', 
      icon: TrendingUp, 
      shortcut: '4',
      category: 'Analisi & Report'
    },
    { 
      id: 'confronto', 
      title: 'Confronto Asset Multivariato', 
      subtitle: 'Compara asset storici e analizza la correlazione dei prezzi', 
      icon: BarChart3, 
      shortcut: '5',
      category: 'Analisi & Report'
    },
    { 
      id: 'reports', 
      title: 'Rapportatore PDF DECA', 
      subtitle: 'Genera ed esporta report certificati e audit finanziari', 
      icon: FileText, 
      shortcut: '6',
      category: 'Analisi & Report'
    },
    { 
      id: 'impostazioni', 
      title: 'Configurazioni & Account', 
      subtitle: 'Modifica il tuo profilo, imposta i prezzi custom e il tema', 
      icon: Settings, 
      shortcut: '7',
      category: 'Sistema'
    }
  ];

  // Filter items based on the search input query
  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase()) || 
    cmd.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Focus input on mount/open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Wait for transition animation frame
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keyboard navigation & Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          onSelectSection(filteredCommands[selectedIndex].id);
          onClose();
        }
      } else if (e.altKey && e.key >= '1' && e.key <= '7') {
        // Alt + Number quick key triggered standard inside dialog
        const num = parseInt(e.key, 10);
        const target = commands.find(c => c.shortcut === String(num));
        if (target) {
          e.preventDefault();
          onSelectSection(target.id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  // Handle clicking on overlay backdrop
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 bg-slate-950/80 backdrop-blur-md select-none"
      onClick={handleOverlayClick}
      id="quick-jump-overlay"
    >
      <div 
        ref={containerRef}
        id="quick-jump-container"
        className="w-full max-w-xl bg-[#0b0f19] border border-[#1a2332] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,194,255,0.18)] flex flex-col overflow-hidden max-h-[480px] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Search Field Input */}
        <div id="quick-jump-input-wrapper" className="flex items-center gap-3 px-4 py-3 border-b border-[#1a2332] bg-[#07090f]">
          <Search className="h-5 w-5 text-gray-500 shrink-0" />
          <input
            id="quick-jump-search-input"
            ref={inputRef}
            type="text"
            placeholder="Digita per cercare una sezione... (es. 'Holdings', 'PDF')"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent border-none text-white outline-none placeholder-gray-500 font-mono text-xs h-9"
          />
          <div className="flex items-center gap-1.5 shrink-0 bg-[#111927] border border-[#1a2332] px-2 py-0.8 rounded text-[9px] text-[#00c2ff] font-mono leading-none font-bold uppercase select-none">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Command entries list grouped by category */}
        <div id="quick-jump-results-list" className="flex-1 overflow-y-auto p-2 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-gray-500 font-mono text-xs flex flex-col items-center gap-2">
              <span className="text-gray-600 block text-lg">🔍</span>
              Nessuna sezione o comando corrispondente trovato
            </div>
          ) : (
            // Group and render
            ['Spazio di Lavoro', 'Analisi & Report', 'Sistema'].map(category => {
              const catCommands = filteredCommands.filter(c => c.category === category);
              if (catCommands.length === 0) return null;

              return (
                <div key={category} className="space-y-1">
                  <div className="px-2.5 py-1 text-[8px] font-mono font-black text-[#00c2ff] uppercase tracking-widest bg-[#00c2ff]/5 border-l-2 border-[#00c2ff] rounded-r">
                    {category}
                  </div>
                  
                  <div className="space-y-0.5">
                    {catCommands.map((cmd) => {
                      const actualIdx = filteredCommands.indexOf(cmd);
                      const isSelected = actualIdx === selectedIndex;
                      const isCurrent = cmd.id === currentSection;
                      const Icon = cmd.icon;

                      return (
                        <div
                          id={`quick-jump-item-${cmd.id}`}
                          key={cmd.id}
                          onClick={() => {
                            onSelectSection(cmd.id);
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(actualIdx)}
                          className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${isSelected ? 'bg-[#00c2ff]/10 border border-[#00c2ff]/30 text-white translate-x-1' : 'bg-transparent border border-transparent text-gray-400 hover:text-gray-200'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-1.8 rounded-lg shrink-0 ${isSelected ? 'bg-[#00c2ff]/20 text-white' : 'bg-[#111927] border border-[#1a2332]/50 text-gray-500'}`}>
                              <Icon className="h-4.5 w-4.5" />
                            </div>
                            <div className="text-left">
                              <span className="text-xs font-bold block leading-tight font-mono text-gray-200">
                                {cmd.title}
                                {isCurrent && (
                                  <span className="ml-2 text-[8px] tracking-widest uppercase px-1.5 py-0.2 rounded font-black font-mono border border-[#00e5a0]/40 text-[#00e5a0] bg-[#00e5a0]/5 inline-block align-middle">
                                    Corrente
                                  </span>
                                )}
                              </span>
                              <span className="text-[9.5px] text-gray-500 block leading-tight font-sans mt-0.5">
                                {cmd.subtitle}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 font-mono shrink-0">
                            {isSelected ? (
                              <div className="flex items-center gap-1.5 text-[8.5px] text-[#00e5a0] font-bold">
                                <span>INVIO</span>
                                <ArrowRight className="h-3 w-3" />
                              </div>
                            ) : (
                              <div className="text-[8px] text-gray-600 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                ALT + {cmd.shortcut}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Command Palette Interactive Sticky Footer Tips */}
        <div id="quick-jump-footer" className="bg-[#07090f] border-t border-[#1a2332] px-4 py-2 flex items-center justify-between text-[8px] font-mono text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="border border-slate-800 bg-slate-950 px-1 rounded font-bold">↑↓</span> Naviga
            </span>
            <span className="flex items-center gap-1">
              <span className="border border-slate-800 bg-slate-950 px-1.5 rounded font-bold">INVIO</span> Seleziona
            </span>
            <span className="flex items-center gap-1">
              <span className="border border-slate-800 bg-slate-950 px-1 rounded font-bold">ESC</span> Chiudi
            </span>
          </div>
          <div className="flex items-center gap-1 text-amber-500/80 font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3 shrink-0 animate-pulse text-amber-500" />
            <span>Portli Quick-Jump v2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
