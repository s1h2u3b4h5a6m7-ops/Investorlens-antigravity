# InvestorLens India — Precision Fundamental Research Platform

InvestorLens India is a precision financial instrument and continuous-scroll storytelling platform covering 107 major Indian equities across 23 market sectors.

---

## ⚡ Modern Architecture

* **Frontend Framework**: Vite + React 18 (TypeScript)
* **Design System**: "Precision Instrument" dark design system (`--void`, `--panel`, `--accent`, `--border`, `--up`, `--down`, `--chain`) with self-hosted variable typography (`Sora`, `Inter`, `JetBrains Mono`).
* **Navigation**: Floating capsule bezel navigation (`BezelNav`) across 6 core views.
* **Backend & Database**: Supabase PostgreSQL with live 10-table relational schema.
* **Data Guarantee**: 100% live verified corporate disclosures and market data — zero synthetic mock data.

---

## 🏛️ 6 Core Platform Views

1. **Aperture Home View**: Full-viewport Aperture hero with universal omnibox search (companies, sectors, forces, maps) and 6 animated live counter cards.
2. **Company Detail 10-Chapter Reader**: Single continuous-scroll reader with sticky headers, 62% viewport scroll-spy observer, two-tier header bar (*The Business* §§1–4 vs *The Judgement* §§5–10), and desktop right-hand Digest panel with dynamic peer-range tracks (`niceBand()` algorithm) and best-value markers.
3. **Sector Ledger**: 23-sector ledger with exact proportional distribution rails (`n / total`).
4. **Forces Explorer**: 3-shelf categorized explorer (*Tailwind · Context · Headwind*) with split-pane company exposure across 14 institutional macro forces.
5. **Compare Matrix**: Multi-company side-by-side metric comparison matrix across 27 peer groups.
6. **Freshness Monitor**: Dual-tab monitor featuring an oldest-first data currency ledger with stale verification flags and a 60-item live headline river.

---

## 🤖 ETL Bots & Automated Workflows

The platform includes GitHub Actions workflows in `.github/workflows/` that run scheduled automated pipelines:

* **`deploy.yml`**: Automatic build and deployment to **GitHub Pages**.
* **`refresh.yml`**: Nightly market metric refresh bot updating pricing, valuation ratios, and market caps from Yahoo Finance and Screener into Supabase.
* **`news.yml`**: Automated press release and market headline pulse crawler updating `news_items`.
* **`backup.yml`**: Weekly automated database snapshot photocopier.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env.local` in the root directory:
```env
VITE_SUPABASE_URL=https://uhqyhsniwlgivdlxbpoj.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Run Test Verification Suite
```bash
node tests/run-all-tests.js
```

### 5. Build for Production
```bash
npm run build
```

---

## 🌐 GitHub Pages Deployment

The repository includes a continuous deployment workflow in `.github/workflows/deploy.yml`.

To deploy:
1. Go to your repository **Settings** → **Secrets and variables** → **Actions**.
2. Add Repository Secrets:
   * `VITE_SUPABASE_URL`: Your Supabase Project URL
   * `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
3. Go to **Settings** → **Pages** → Source: **GitHub Actions**.
4. Push to `main` branch to trigger automatic build and deployment.
