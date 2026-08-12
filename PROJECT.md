# Project: InvestorLens India Modernization

## Architecture
- Tech Stack: Vite + React (TypeScript)
- Design System: "Precision Instrument" dark design system (`--void`, `--panel`, `--accent`, `--border`, `--up`, `--down`, `--stale`, `--chain`) with self-hosted variable fonts (`Sora`, `Inter`, `JetBrains Mono`).
- Backend & Data: Supabase PostgreSQL (`https://uhqyhsniwlgivdlxbpoj.supabase.co`) with 10-table data model.
- Integrity: Startup self-test diagnostic engine verifying 107 companies, 492 metric bindings, 14 macro forces, and executive profiles with 100% pass threshold.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Project Setup & Build Infrastructure | Vite + React + TS, self-hosted fonts, build scripts, directory layout | M1 | survey |
| 2 | Supabase Client & 10-Table Data Model | Supabase connection to 10 tables (`companies`, `metric_snapshots`, `chain_nodes`, `tech_geo_tags`, `bull_bear_cases`, `mgmt_profiles`, `cross_company_narratives`, `valuation_inputs`, `news_items`, `forces`) | M1 | survey |
| 3 | Startup Self-Test Integrity Engine | Self-test diagnostic engine asserting 107 companies, 492 metrics, 14 forces, executive profiles (100% pass rate) | M1 | survey |
| 4 | Legacy UI-1 Retirement | Purge legacy `.menu-rail`, `#home-tabs`, `#panel-*`, `showSection(i)` | M2 | survey |
| 5 | UI-2 Promotion & Design System | Remove `CONFIG.storyMode`, unwrap `body.story` scoping, establish floating capsule bezel (`BezelNav`) | M2 | survey |
| 6 | Home Hero View | Symmetric Aperture 3D hero, universal omnibox search, 6 animated live counter cards, integrity readout | M3 | survey |
| 7 | Freshness Monitor View | Dual-tab monitor (data currency ledger with stale flags + 60-item headline river) | M3 | survey |
| 8 | Company Detail 10-Chapter Reader | Continuous 10-chapter scroll reader, 2-tier sticky header (*The Business* §§1–4 vs *The Judgement* §§5–10), 62% scroll-spy observer | M4 | survey |
| 9 | Company Detail Digest Panel | Desktop right-hand Digest panel with `niceBand()` quantile algorithm & best-value markers | M4 | survey |
| 10 | Sectors View | 23-sector ledger with exact `n / total` proportional distribution rails | M5 | survey |
| 11 | Forces View | 3-shelf macro explorer (*Tailwind · Context · Headwind*) with split-pane exposure across 14 forces | M5 | survey |
| 12 | Compare Mode | Side-by-side metric comparison matrix across 27 peer groups | M5 | survey |
| 13 | Final E2E Suite & Adversarial Hardening | Pass 100% of Tiers 1-4 E2E tests and Tier 5 white-box coverage hardening | M6 | survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Infrastructure & Data Layer | Vite/React/TS setup, Supabase client, 10-table data services, Startup Self-Test engine | None | DONE |
| M2 | UI-1 Retirement & UI-2 Promotion | Purge UI-1 structures, unwrap `body.story`, implement `BezelNav` floating capsule navigation | M1 | DONE |
| M3 | Home Hero & Freshness Views | Aperture hero with omnibox & 6 live cards, Freshness dual-tab monitor | M2 | IN_PROGRESS |
| M4 | Company Detail Reader View | 10-chapter continuous scroll, 2-tier header bar, 62% scroll-spy, Digest panel (`niceBand()`) | M2 | IN_PROGRESS |
| M5 | Sectors, Forces & Compare Views | 23-sector proportional rails, 3-shelf forces explorer, 27 peer group compare matrix | M2 | IN_PROGRESS |
| M6 | Final E2E Testing & Hardening | Pass Tier 1-4 E2E tests, Tier 5 adversarial coverage hardening, clean build verify | M3, M4, M5 | PLANNED |

## Interface Contracts
### Data Service ↔ UI Components
- `getCompanies(): Promise<Company[]>` — Returns all 107 companies with metrics and tags.
- `getCompanyDetail(id: string): Promise<CompanyDetailData>` — Returns full 10-chapter data for §§1–10.
- `runStartupSelfTest(): SelfTestResult` — Returns `{ passed: boolean, assertions: { companies: 107, metrics: 492, forces: 14, mgmt: boolean } }`. Must pass 100%.
- `niceBand(low: number, high: number): QuantileBand` — Calculates peer quantile tracks without edge clipping.

## Continuous Verification & Build Health
- Mandatory clean build check via `npm run build`.
- Zero runtime exceptions and 100% test pass rate across all tiers.

## Code Layout
```
src/
├── assets/
│   ├── fonts/               # Sora, Inter, JetBrains Mono woff2 font files
│   └── styles/
│       ├── theme.css        # Precision Instrument design tokens
│       └── components.css   # Native component styles
├── components/
│   ├── layout/
│   │   ├── BezelNav.tsx     # Floating capsule navigation bezel
│   │   └── AppHeader.tsx
│   ├── home/
│   │   ├── ApertureHero.tsx # Omnibox search & 3D aperture logo
│   │   └── CounterCards.tsx # 6 live counter cards
│   ├── company/
│   │   ├── ChapterReader.tsx# Continuous 10-chapter reader (62% scroll-spy)
│   │   ├── TwoTierHeader.tsx# Two-tier header (Business vs Judgement)
│   │   └── RightHandDigest.tsx # Digest panel (niceBand() algorithm)
│   ├── sectors/
│   │   └── SectorLedger.tsx # 23-sector ledger with n/total rails
│   ├── forces/
│   │   └── ForcesExplorer.tsx# 3-shelf explorer (Tailwind, Context, Headwind)
│   ├── compare/
│   │   └── CompareMatrix.tsx# 27 peer group matrix
│   └── freshness/
│       └── FreshnessMonitor.tsx # Data currency ledger + 60-item headline river
├── services/
│   ├── supabase.ts          # Supabase client (`https://uhqyhsniwlgivdlxbpoj.supabase.co`)
│   ├── dataService.ts       # 10-table query & data transformation
│   └── selftest.ts          # Startup self-test integrity engine
└── App.tsx                  # Root application router & layout container
```
