const express = require('express');
const cors = require('cors');
const yahooFinance = require('yahoo-finance2').default;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SYMBOLS = [
  { symbol: 'AAPL',  name: 'Apple' },
  { symbol: 'TSLA',  name: 'Tesla' },
  { symbol: 'AMD',   name: 'AMD' },
  { symbol: 'GOOGL', name: 'Google' },
  { symbol: 'AMZN',  name: 'Amazon' },
  { symbol: 'GEV',   name: 'GE Vernova' },
  { symbol: 'NEM',   name: 'Newmont' },
  { symbol: 'AXP',   name: 'Amex' },
  { symbol: 'MU',    name: 'Micron' },
  { symbol: 'SMCI',  name: 'SMCI' },
];

// Suppress Yahoo Finance survey notice


// --- Quote endpoint (single or all) ---
app.get('/api/quotes', async (req, res) => {
  try {
    const symbols = SYMBOLS.map(s => s.symbol);
    const results = await Promise.all(
      symbols.map(async (sym) => {
        try {
          const quote = await yahooFinance.quote(sym);
          const meta = SYMBOLS.find(s => s.symbol === sym);
          return {
            symbol: sym,
            name: meta?.name || sym,
            price: quote.regularMarketPrice,
            previousClose: quote.regularMarketPreviousClose,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            open: quote.regularMarketOpen,
            dayHigh: quote.regularMarketDayHigh,
            dayLow: quote.regularMarketDayLow,
            volume: quote.regularMarketVolume,
            marketCap: quote.marketCap,
            fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
            fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
            marketState: quote.marketState,
            currency: quote.currency || 'USD',
          };
        } catch (err) {
          return { symbol: sym, error: err.message };
        }
      })
    );
    res.json({ success: true, data: results, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Historical chart data ---
app.get('/api/chart/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const { period = '1mo' } = req.query;

  const periodMap = {
    '1d':  { period1: daysAgo(1),   interval: '5m'  },
    '1w':  { period1: daysAgo(7),   interval: '1h'  },
    '1mo': { period1: daysAgo(30),  interval: '1d'  },
    '3mo': { period1: daysAgo(90),  interval: '1d'  },
    '6mo': { period1: daysAgo(180), interval: '1wk' },
    '1y':  { period1: daysAgo(365), interval: '1wk' },
  };

  const config = periodMap[period] || periodMap['1mo'];

  try {
    const result = await yahooFinance.chart(symbol, {
      period1: config.period1,
      interval: config.interval,
    });

    const quotes = result.quotes || [];
    const chartData = quotes
      .filter(q => q.close !== null)
      .map(q => ({
        date: new Date(q.date).toISOString(),
        open: q.open,
        high: q.high,
        low: q.low,
        close: q.close,
        volume: q.volume,
      }));

    res.json({ success: true, symbol, period, data: chartData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Symbols list ---
app.get('/api/symbols', (req, res) => {
  res.json({ success: true, data: SYMBOLS });
});

// --- Health check ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Catch-all for SPA ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

app.listen(PORT, () => {
  console.log(`📈 Stock Tracker running on port ${PORT}`);
});
