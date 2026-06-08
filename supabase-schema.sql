-- Crea la tabella per gli asset in portafoglio
CREATE TABLE IF NOT EXISTS public.assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  ticker text NOT NULL, -- es. AAPL, SPY
  asset_type text NOT NULL, -- es. STOCK, ETF, CRYPTO
  quantity numeric NOT NULL DEFAULT 0,
  average_price numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crea la tabella di cache per i prezzi di mercato (evita di saturare l'API di Finnhub)
CREATE TABLE IF NOT EXISTS public.market_prices (
  ticker text PRIMARY KEY,
  current_price numeric NOT NULL,
  change_percent numeric,
  last_updated timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sicurezza: Row Level Security (RLS)
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;

-- Policy: gli utenti vedono solo i propri asset
CREATE POLICY "Users can view their own assets" 
ON public.assets FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: tutti possono leggere i prezzi di mercato
CREATE POLICY "Anyone can read market prices" 
ON public.market_prices FOR SELECT 
USING (true);
