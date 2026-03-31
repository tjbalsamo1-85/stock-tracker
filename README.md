# 📈 Market Pulse — Live Stock Tracker

A sleek, real-time stock dashboard pulling live data from Yahoo Finance. Tracks **Apple, Tesla, AMD, Google, Amazon, GE Vernova, Newmont, Amex, Micron, and SMCI** with auto-refresh every 30 seconds during market hours.

## Features

- **Live quotes** — price, change, % change, volume, market cap, 52-week range
- **Interactive chart** — 1D / 1W / 1M / 3M / 6M / 1Y price history with Chart.js
- **Sparklines** — mini trend lines on each stock card
- **Full data table** — sortable by any column
- **Ticker tape** — scrolling live prices at the top
- **Market status** — shows REGULAR / PRE-MARKET / AFTER HOURS / CLOSED
- **Auto-refresh** — every 30 seconds during market hours
- **Dark terminal aesthetic** — designed for extended screen time

---

## Local Development

### Prerequisites
- Node.js 18+

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/stock-tracker.git
cd stock-tracker

# Install dependencies
npm install

# Start the server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

For development with auto-reload:
```bash
npm run dev
```

---

## Deploy to Railway

### Option A — Deploy from GitHub (recommended)

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) and log in
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your `stock-tracker` repository
5. Railway will auto-detect Node.js and deploy using the `Procfile`
6. Your app will be live at a generated URL (e.g. `stock-tracker-production.up.railway.app`)

### Option B — Railway CLI

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Environment Variables (Railway)

No environment variables are required. Railway automatically provides `PORT`.

---

## Project Structure

```
stock-tracker/
├── server.js          # Express backend + Yahoo Finance API
├── public/
│   └── index.html     # Full frontend (HTML/CSS/JS + Chart.js)
├── package.json
├── Procfile           # Railway start command
├── .gitignore
└── README.md
```

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/quotes` | All stock quotes (live) |
| `GET /api/chart/:symbol?period=1mo` | Price history for chart |
| `GET /api/symbols` | List of tracked symbols |
| `GET /health` | Health check |

**Period options:** `1d`, `1w`, `1mo`, `3mo`, `6mo`, `1y`

---

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Market Pulse stock tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/stock-tracker.git
git push -u origin main
```

---

## Notes

- Data is sourced from Yahoo Finance via the `yahoo-finance2` npm package (unofficial API)
- The 1D chart uses 5-minute intervals, longer periods use daily/weekly bars
- Market data has a ~15 minute delay from Yahoo Finance's free tier
- The app auto-refreshes every 30 seconds; you can also click ↻ REFRESH manually
