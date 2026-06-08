import React, { useState } from 'react';
import { Transaction, AssetType } from '../types';
import { PlusCircle, Trash2, Calendar, Euro, Layers, ShieldCheck, Tag } from 'lucide-react';

interface TransactionFormProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onRemoveTransaction: (id: string | string[]) => void;
}

export default function TransactionForm({
  transactions,
  onAddTransaction,
  onRemoveTransaction,
}: TransactionFormProps) {
  // Local form state
  const [ticker, setTicker] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'ACQUISTO' | 'VENDITA' | 'DEPOSITO'>('ACQUISTO');
  const [assetType, setAssetType] = useState<AssetType>('STOCK');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [fee, setFee] = useState<string>('5');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isConfirmingBatch, setIsConfirmingBatch] = useState(false);

  // Derived state to filter out any stale selectedIds that do not exist anymore
  const validSelectedIds = selectedIds.filter(id => transactions.some(tx => tx.id === id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(transactions.map((tx) => tx.id));
    } else {
      setSelectedIds([]);
    }
    setIsConfirmingBatch(false);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
    }
    setIsConfirmingBatch(false);
  };

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownAnchor, setDropdownAnchor] = useState<'ticker' | 'name' | null>(null);

  // Debounce logic for real-time stock/exchange lookup using custom server API
  React.useEffect(() => {
    const activeText = dropdownAnchor === 'ticker' ? ticker : dropdownAnchor === 'name' ? name : '';
    if (!activeText || activeText.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: activeText })
        });
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data || []);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error('Error searching asset:', err);
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [ticker, name, dropdownAnchor]);

  // Close suggestion dropdown on click outside
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectSuggestion = (item: any) => {
    setTicker(item.ticker);
    setName(item.name);
    setAssetType(item.assetType as AssetType);
    if (item.price) {
      setPrice(item.price.toString());
    }
    setShowDropdown(false);
    setDropdownAnchor(null);
  };

  // Suggested preset common assets for quick select across multiple exchanges and asset classes
  const presets = [
    { ticker: 'AAPL', name: 'Apple Inc.', assetType: 'STOCK' as const, price: 181.18 },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', assetType: 'STOCK' as const, price: 124.50 },
    { ticker: 'MC.PA', name: 'LVMH Moët Hennessy', assetType: 'STOCK' as const, price: 785.40 },
    { ticker: 'ENEL.MI', name: 'Enel S.p.A. (Borsa It)', assetType: 'STOCK' as const, price: 6.12 },
    { ticker: 'RACE.MI', name: 'Ferrari N.V. (Milano)', assetType: 'STOCK' as const, price: 385.20 },
    { ticker: 'BTC', name: 'Bitcoin', assetType: 'CRYPTO' as const, price: 95420.005 },
    { ticker: 'SWDA.MI', name: 'iShares MSCI World ETF', assetType: 'ETF' as const, price: 92.45 },
    { ticker: 'SXR8.DE', name: 'iShares S&P 500 ETF', assetType: 'ETF' as const, price: 512.40 },
    { ticker: 'EUR', name: 'Euro Cash Liquidity', assetType: 'CASH' as const, price: 1.00 }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setTicker(p.ticker);
    setName(p.name);
    setAssetType(p.assetType);
    if (p.ticker === 'EUR') {
      setType('DEPOSITO');
      setPrice('1.00');
    } else {
      setType('ACQUISTO');
      setPrice(p.price ? p.price.toString() : '');
    }
    setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic Validation
    if (!ticker.trim()) {
      setFormError('Il simbolo ticker è obbligatorio.');
      return;
    }
    if (!name.trim()) {
      setFormError('Il nome dell\'asset è obbligatorio.');
      return;
    }

    const qVal = parseFloat(quantity);
    if (isNaN(qVal) || qVal <= 0) {
      setFormError('La quantità deve essere un numero positivo.');
      return;
    }

    const pVal = parseFloat(price);
    if (isNaN(pVal) || pVal <= 0) {
      setFormError('Il prezzo stimato unitario deve essere positivo.');
      return;
    }

    const fVal = parseFloat(fee) || 0;

    // Dispatch
    onAddTransaction({
      ticker: ticker.toUpperCase().trim(),
      name: name.trim(),
      type,
      assetType,
      quantity: qVal,
      price: pVal,
      date,
      fee: fVal,
    });

    // Reset Form Input except standard values
    setTicker('');
    setName('');
    setQuantity('');
    setPrice('');
    setFormError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
      
      {/* COLUMN 1: FORM DI REGISTRAZIONE (5 COLS) */}
      <div className="lg:col-span-5 bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border flex flex-col justify-between">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1a2332]/60 pb-3">
            <PlusCircle className="h-4.5 w-4.5 text-[#00c2ff]" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
              Registra Movimento
            </h3>
          </div>

          {/* Presets Grid */}
          <div>
            <span className="text-[9px] font-mono text-gray-500 uppercase font-black block mb-2">Preset Rapidi:</span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.ticker}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="bg-[#07090f] hover:bg-[#1a2332] text-gray-400 hover:text-[#00c2ff] border border-[#1a2332] hover:border-[#00c2ff]/30 text-[9px] font-mono font-bold px-2 py-1 rounded transition duration-150"
                >
                  {p.ticker}
                </button>
              ))}
            </div>
          </div>

          {/* Form alert */}
          {formError && (
            <div className="p-2 py-1.5 bg-[#ff3d6b]/10 border border-[#ff3d6b]/20 text-[#ff3d6b] rounded text-[10px] font-medium font-mono leading-relaxed">
              ⚠️ {formError}
            </div>
          )}

          {/* Multi Grid Entries */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                Tipo Movimento
              </label>
              <select
                value={type}
                onChange={(e) => {
                  const selType = e.target.value as any;
                  setType(selType);
                  if (selType === 'DEPOSITO') {
                    setAssetType('CASH');
                    setTicker('EUR');
                    setName('Euro Cash Liquidity');
                    setPrice('1.00');
                  }
                }}
                className="w-full bg-[#07090f] border border-[#1a2332] text-white rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-[#00c2ff]/50"
              >
                <option value="ACQUISTO">BUY (Acquisto)</option>
                <option value="VENDITA">SELL (Vendita)</option>
                <option value="DEPOSITO">DEPOSIT (Deposito)</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                Asset Class
              </label>
              <select
                value={assetType}
                disabled={type === 'DEPOSITO'}
                onChange={(e) => setAssetType(e.target.value as AssetType)}
                className="w-full bg-[#07090f] border border-[#1a2332] text-white rounded-lg p-2 text-xs focus:outline-none focus:border-[#00c2ff]/50 disabled:opacity-55"
              >
                <option value="STOCK">Stock (Azione)</option>
                <option value="ETF">ETF (Indice)</option>
                <option value="CRYPTO">Crypto</option>
                <option value="CASH">Cash (Liquidità)</option>
              </select>
            </div>
          </div>

          <div className="search-container grid grid-cols-2 gap-3.5 relative">
            <div>
              <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                Simbolo Ticker
              </label>
              <input
                type="text"
                placeholder="es. TSLA o AAPL"
                value={ticker}
                disabled={type === 'DEPOSITO'}
                onFocus={() => {
                  if (ticker.trim().length >= 2) {
                    setDropdownAnchor('ticker');
                    setShowDropdown(true);
                  }
                }}
                onChange={(e) => {
                  setTicker(e.target.value.toUpperCase());
                  setDropdownAnchor('ticker');
                }}
                className="w-full bg-[#07090f] border border-[#1a2332] text-white placeholder-gray-700 rounded-lg p-2 text-xs font-mono uppercase focus:outline-none focus:border-[#00c2ff]/50 disabled:opacity-55"
              />
            </div>

            <div>
              <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                Nome Esteso Asset
              </label>
              <input
                type="text"
                placeholder="es. Tesla Inc."
                value={name}
                disabled={type === 'DEPOSITO'}
                onFocus={() => {
                  if (name.trim().length >= 2) {
                    setDropdownAnchor('name');
                    setShowDropdown(true);
                  }
                }}
                onChange={(e) => {
                  setName(e.target.value);
                  setDropdownAnchor('name');
                }}
                className="w-full bg-[#07090f] border border-[#1a2332] text-white placeholder-gray-700 rounded-lg p-2 text-xs focus:outline-none focus:border-[#00c2ff]/50 disabled:opacity-55"
              />
            </div>

            {/* FLOATING DROPDOWN SUGGESTIONS FOR MULTI-EXCHANGE AUTOCOMPLETE */}
            {showDropdown && suggestions.length > 0 && (
              <div 
                className="absolute z-50 left-0 right-0 top-[59px] bg-[#0d1521] border border-[#00c2ff]/30 shadow-2xl shadow-black rounded-lg max-h-[220px] overflow-y-auto divide-y divide-[#1a2332]/80 mt-1 animate-fade-in"
              >
                <div className="bg-[#0b111b] px-3 py-1.5 text-[8px] font-mono text-[#00c2ff] font-black uppercase tracking-wider flex justify-between items-center sticky top-0 border-b border-[#1a2332]/60 select-none">
                  <span>💡 SELEZIONA L'ASSET E LA BORSA DI RIFERIMENTO</span>
                  {isSearching && (
                    <span className="flex items-center gap-1">
                      <span className="h-1 w-1 bg-[#00c2ff] rounded-full animate-ping"></span>
                      <span>RICERCA...</span>
                    </span>
                  )}
                </div>
                {suggestions.map((item, idx) => (
                  <button
                    key={`${item.ticker}-${idx}`}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#1a2538] transition duration-150 flex items-center justify-between text-xs cursor-pointer focus:outline-none"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-[#00c2ff] bg-[#00c2ff]/10 px-1.5 py-0.5 rounded text-[10px]">
                          {item.ticker}
                        </span>
                        <span className="text-white font-bold text-[11px] truncate max-w-[170px]">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-[8px] font-mono text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                        <span className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-[3px] text-[7px] font-black">
                          {item.assetType}
                        </span>
                        <span>•</span>
                        <span>Borsa:</span> 
                        <strong className="text-gray-200">{item.exchange}</strong>
                      </div>
                    </div>
                    <div className="text-right font-mono text-[10px] space-y-0.5 pl-2">
                      {item.price && (
                        <div className="text-[#00e5a0] font-black">
                          {item.currency === 'USD' ? '$' : '€'}{item.price.toFixed(2)}
                        </div>
                      )}
                      <div className="text-[7px] text-gray-500 font-bold uppercase">{item.currency || 'EUR'}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                Quantità
              </label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-[#07090f] border border-[#1a2332] text-white placeholder-gray-700 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-[#00c2ff]/50"
              />
            </div>

            <div>
              <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                Prezzo Unit. (€)
              </label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={price}
                disabled={type === 'DEPOSITO'}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#07090f] border border-[#1a2332] text-white placeholder-gray-700 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-[#00c2ff]/50 disabled:opacity-55"
              />
            </div>

            <div>
              <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                Commissione (€)
              </label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="w-full bg-[#07090f] border border-[#1a2332] text-white placeholder-gray-700 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-[#00c2ff]/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
                Data Transazione
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#07090f] border border-[#1a2332] text-white rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-[#00c2ff]/50"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-[#00c2ff] hover:bg-[#00c2ff]/90 text-slate-900 font-extrabold text-xs uppercase tracking-wider p-2.5 rounded-lg transition duration-200 outline-none flex items-center justify-center gap-1.5 shadow-lg shadow-[#00c2ff]/10 hover:shadow-[#00c2ff]/20"
              >
                Includi Movimento
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-[#1a2332]/40 text-[9px] text-gray-500 font-mono flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-[#00e5a0]" />
          Logiche di integrazione in tempo reale e salvataggio automatico.
        </div>
      </div>

      {/* COLUMN 2: REGISTRO TRANSAZIONI STORICHE (7 COLS) */}
      <div className="lg:col-span-7 bg-[#111927] border border-[#1a2332] rounded-xl p-5 ai-glow neon-border flex flex-col justify-between">
        <div className="flex flex-col gap-3.5 h-full">
          <div className="flex justify-between items-center border-b border-[#1a2332]/60 pb-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4.5 w-4.5 text-violet-500" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                Registro dei Movimenti Inseriti ({transactions.length})
              </h3>
            </div>
            
            {validSelectedIds.length > 0 ? (
              <div className="flex items-center gap-2 animate-fade-in">
                {isConfirmingBatch ? (
                  <div className="flex items-center gap-1.5 bg-[#ff3d6b]/10 border border-[#ff3d6b]/30 p-1 px-2 rounded-lg font-mono">
                    <span className="text-[9px] font-black text-[#ff3d6b] uppercase">Confermi ({validSelectedIds.length})?</span>
                    <button
                      type="button"
                      onClick={() => {
                        onRemoveTransaction(validSelectedIds);
                        setSelectedIds([]);
                        setIsConfirmingBatch(false);
                      }}
                      className="text-[9px] bg-[#ff3d6b] hover:bg-[#ff3d6b]/90 text-white font-black py-0.5 px-1.5 rounded cursor-pointer transition duration-150"
                    >
                      Sì
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmingBatch(false)}
                      className="text-[9px] bg-slate-800 hover:bg-slate-700 text-gray-400 py-0.5 px-1.5 rounded cursor-pointer transition duration-150"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingBatch(true)}
                    className="bg-[#ff3d6b]/20 hover:bg-[#ff3d6b]/35 border border-[#ff3d6b]/40 text-[#ff3d6b] text-[10px] font-mono font-black py-1 px-2.5 rounded-lg transition duration-200 cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#ff3d6b]/5"
                  >
                    <Trash2 className="h-3.5 w-3.5 animate-pulse" />
                    Elimina Selezionati ({validSelectedIds.length})
                  </button>
                )}
              </div>
            ) : (
              <span className="text-[9px] font-mono text-gray-500 uppercase font-bold text-gray-400">
                SCROLLABILE CON SELEZIONE MULTIPLA
              </span>
            )}
          </div>

          {/* Table list */}
          <div className="overflow-y-auto max-h-[295px] pr-1 scrollbar-thin flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1a2332] text-gray-500 uppercase tracking-wider font-mono text-[9px] font-bold h-7 h-8 select-none">
                  <th className="px-2 py-1 text-center w-8">
                    <input
                      type="checkbox"
                      checked={transactions.length > 0 && validSelectedIds.length === transactions.length}
                      ref={(el) => {
                        if (el) {
                          el.indeterminate = validSelectedIds.length > 0 && validSelectedIds.length < transactions.length;
                        }
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-[#1a2332] bg-[#07090f] text-[#00c2ff] focus:ring-[#00c2ff]/30 focus:ring-offset-0 focus:outline-none cursor-pointer w-3.5 h-3.5"
                    />
                  </th>
                  <th className="px-2 py-1 font-bold">Data</th>
                  <th className="px-2 py-1 font-bold">Movimento</th>
                  <th className="px-2 py-1 font-bold">Asset/Cl</th>
                  <th className="px-2 py-1 text-right font-bold">Quantità</th>
                  <th className="px-2 py-1 text-right font-bold">Prezzo Unitário</th>
                  <th className="px-2 py-1 text-right font-bold">Comm.</th>
                  <th className="px-3 py-1 text-center font-bold">Elimina</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2332]/40">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500 font-mono">
                      Il registro movimenti è attualmente vuoto.
                    </td>
                  </tr>
                ) : (
                  [...transactions]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((tx) => {
                      const isBuy = tx.type === 'ACQUISTO';
                      const isSell = tx.type === 'VENDITA';
                      const isSelected = validSelectedIds.includes(tx.id);
                      return (
                        <tr key={tx.id} className={`hover:bg-[#1a2332]/30 transition group ${isSelected ? 'bg-[#00c2ff]/5' : ''}`}>
                          <td className="px-2 py-2 text-center w-8">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleSelectOne(tx.id, e.target.checked)}
                              className="rounded border-[#1a2332] bg-[#07090f] text-[#00c2ff] focus:ring-[#00c2ff]/30 focus:ring-offset-0 focus:outline-none cursor-pointer w-3.5 h-3.5"
                            />
                          </td>
                          <td className="px-2 py-2 font-mono text-gray-400 text-[10px] whitespace-nowrap">
                            {tx.date}
                          </td>
                          <td className="px-2 py-2 font-semibold">
                            <span
                              className={`p-1 px-1.5 rounded text-[8px] font-mono font-black ${
                                isBuy
                                  ? 'bg-[#00e5a0]/10 text-[#00e5a0]'
                                  : isSell
                                  ? 'bg-[#ff3d6b]/10 text-[#ff3d6b]'
                                  : 'bg-gray-800 text-gray-400'
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-2 py-2">
                            <div className="font-bold text-white uppercase text-[11px] font-mono leading-tight">
                              {tx.ticker}
                            </div>
                            <div className="text-[9px] text-gray-500 truncate max-w-[80px]" title={tx.name}>
                              {tx.name}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-right font-mono text-white">
                            {tx.quantity.toLocaleString('it-IT', { maximumFractionDigits: 4 })}
                          </td>
                          <td className="px-2 py-2 text-right font-mono text-white">
                            €{tx.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-2 py-2 text-right font-mono text-gray-400">
                            €{tx.fee ? tx.fee.toFixed(2) : '0.00'}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {deletingId === tx.id ? (
                              <div className="flex items-center justify-center gap-1.5 animate-fade-in">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onRemoveTransaction(tx.id);
                                    setDeletingId(null);
                                  }}
                                  className="text-[9px] bg-[#ff3d6b]/20 border border-[#ff3d6b]/40 text-[#ff3d6b] font-mono font-black py-0.5 px-1.5 rounded hover:bg-[#ff3d6b]/30 transition cursor-pointer"
                                >
                                  Sì
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingId(null)}
                                  className="text-[9px] bg-slate-800 text-gray-400 py-0.5 px-1.5 rounded hover:bg-slate-700 transition cursor-pointer"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeletingId(tx.id)}
                                aria-label={`Rimuovi movimento ${tx.ticker}`}
                                className="p-1 text-gray-500 hover:text-[#ff3d6b] hover:bg-[#ff3d6b]/10 rounded transition duration-150 inline-block cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5 cursor-pointer" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
