import { supabase } from '../lib/supabase'

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY

// Recupera il prezzo corrente da Finnhub
export async function fetchFinnhubQuote(ticker) {
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`)
    if (!res.ok) throw new Error('Errore nella chiamata a Finnhub')
    const data = await res.json()
    // c = current price, dp = percent change
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

// Recupera asset utente e relativi prezzi
export async function fetchUserAssets() {
  const { data: assets, error } = await supabase
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Errore recupero assets:", error)
    return []
  }

  // Per ogni asset, controlla la cache dei prezzi (simuliamo un Join semplificato)
  const assetsWithPrices = await Promise.all(assets.map(async (asset) => {
    // Prima controlliamo se esiste in cache
    const { data: cacheData } = await supabase
      .from('market_prices')
      .select('*')
      .eq('ticker', asset.ticker)
      .single()

    let currentPrice = 0
    let changePercent = 0

    // Se non c'è in cache o è vecchio (potremmo aggiungere logica temporale), chiamiamo Finnhub
    if (!cacheData) {
      const liveData = await fetchFinnhubQuote(asset.ticker)
      if (liveData && liveData.price) {
        currentPrice = liveData.price
        changePercent = liveData.changePercent
        // Aggiorna cache
        await updatePriceCache(asset.ticker, currentPrice, changePercent)
      }
    } else {
      currentPrice = cacheData.current_price
      changePercent = cacheData.change_percent
    }

    // Calcolo PNL Virtuale
    const totalValue = currentPrice * asset.quantity
    const invested = asset.average_price * asset.quantity
    const pnl = totalValue - invested

    return {
      ...asset,
      currentPrice,
      changePercent,
      totalValue,
      pnl
    }
  }))

  return assetsWithPrices
}

// Aggiungi un nuovo asset
export async function addAsset(userId, ticker, type, quantity, avgPrice) {
  const { data, error } = await supabase
    .from('assets')
    .insert([{
      user_id: userId,
      ticker: ticker.toUpperCase(),
      asset_type: type,
      quantity,
      average_price: avgPrice
    }])
  
  if (error) throw error
  return data
}
