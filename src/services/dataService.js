import { supabase } from '../lib/supabase'

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY

// Recupera il prezzo corrente da Finnhub
export async function fetchFinnhubQuote(ticker) {
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`)
    if (!res.ok) throw new Error('Errore nella chiamata a Finnhub')
    const data = await res.json()
    return {
      price: data.c,
      changePercent: data.dp
    }
  } catch (err) {
    console.error(`Errore fetchFinnhubQuote per ${ticker}:`, err)
    return null
  }
}

// Aggiorna la cache su Supabase
export async function updatePriceCache(ticker, price, changePercent) {
  if (!price) return
  const { error } = await supabase
    .from('market_prices')
    .upsert({ 
      ticker: ticker, 
      current_price: price, 
      change_percent: changePercent,
      last_updated: new Date().toISOString()
    })
  
  if (error) {
    console.error("Errore aggiornamento market_prices:", error)
  }
}

// Simuliamo il portafoglio dell'utente e andiamo a prendere i dati REALI da Finnhub/Supabase
export async function getLiveMockAssets() {
  const mockPortfolio = [
    { ticker: 'AAPL', name: 'Apple Inc.', type: 'STOCK', quantity: 15, avgPrice: 150.00 },
    { ticker: 'TSLA', name: 'Tesla Inc.', type: 'STOCK', quantity: 20, avgPrice: 190.00 },
    { ticker: 'NVDA', name: 'Nvidia Corp.', type: 'STOCK', quantity: 5, avgPrice: 90.00 },
    { ticker: 'MSFT', name: 'Microsoft Corp.', type: 'STOCK', quantity: 10, avgPrice: 380.00 },
  ]

  const assetsWithPrices = await Promise.all(mockPortfolio.map(async (asset) => {
    // 1. Controlla la cache in Supabase
    const { data: cacheData } = await supabase
      .from('market_prices')
      .select('*')
      .eq('ticker', asset.ticker)
      .single()

    let currentPrice = asset.avgPrice
    let changePercent = 0

    // 2. Se non in cache o vogliamo aggiornare, chiama Finnhub
    if (!cacheData) {
      const liveData = await fetchFinnhubQuote(asset.ticker)
      if (liveData && liveData.price) {
        currentPrice = liveData.price
        changePercent = liveData.changePercent
        // 3. Salva nel database Supabase
        await updatePriceCache(asset.ticker, currentPrice, changePercent)
      }
    } else {
      currentPrice = cacheData.current_price
      changePercent = cacheData.change_percent
    }

    // 4. Matematica Esatta della vecchia versione di Portli (Total Value, PNL)
    const totalValue = currentPrice * asset.quantity
    const invested = asset.avgPrice * asset.quantity
    const pnl = totalValue - invested
    const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0

    return {
      ...asset,
      currentPrice,
      changePercent,
      totalValue,
      pnl,
      pnlPercent
    }
  }))

  return assetsWithPrices.sort((a, b) => b.totalValue - a.totalValue)
}
