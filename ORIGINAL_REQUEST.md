# Original User Request

## 2026-08-11T10:58:37Z

# Teamwork Project Prompt — Final

> Status: Launched
> Goal: Modernize the look, layout, styling, and overall UI/UX of InvestorLens India (Vite + React / TypeScript), retire legacy UI-1 and flag scoping, promote UI-2 as the native primary UI, and preserve all underlying routes, data layers, Supabase schemas, and business logic.

Working directory: C:\Users\tanus\.gemini\antigravity\scratch\investorlens
Integrity mode: development

Repository: https://github.com/s1h2u3b4h5a6m7-ops/investorlens
Supabase URL: https://uhqyhsniwlgivdlxbpoj.supabase.co
Supabase Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVocXloc25pd2xnaXZkbHhicG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNzIwNzgsImV4cCI6MjA5ODc0ODA3OH0.rPSGWKn2AkkV66bNhOm3COE6ojdl6lUhoe4spbI0xr0

## Core Mandate
This is a UI modernizing replacement, NOT an application rewrite. Change the appearance, layout, styling, and user experience while preserving the application's underlying functionality, routes, data layer, Supabase APIs, and business logic intact. Do not modify the database schema, data structures, APIs, or data contracts.

## Requirements

### R1. UI Modernization & Modular Framework Architecture
- Build a modern, modular web application using Vite + React (TypeScript) with modern component structure.
- Cleanly retire the legacy UI-1 layer (obsolete sidebar `.menu-rail`, `#home-tabs`, and single-section tab switchers).
- Remove the `CONFIG.storyMode` conditional flag and unwrap all CSS rules from `body.story`, establishing UI-2 styling as the native foundation.
- Retain self-hosted variable typography (Sora, Inter, JetBrains Mono) and the "Precision Instrument" dark design system.

### R2. Preservation of Views & User Experience
- **Home View**: Full-viewport symmetric Aperture hero with universal omnibox search (companies, sectors, forces, maps) and 6 animated live counter cards.
- **Company Detail**: Single continuous-scroll 10-chapter storytelling reader with sticky headers, 62% viewport scroll-spy, two-tier header bar (*The Business* §§1–4 vs *The Judgement* §§5–10), and desktop right-hand Digest panel with dynamic peer-range tracks (`niceBand()` algorithm) and best-value markers.
- **Sector View**: 23-sector ledger with exact proportional distribution rails (`n / total`).
- **Forces View**: 3-shelf categorized explorer (*Tailwind · Context · Headwind*) with split-pane company exposure.
- **Compare Mode**: Multi-company side-by-side metric comparison matrix across 27 peer groups.
- **Freshness View**: Dual-tab monitor with oldest-first data currency ledger (with stale flags) and 60-item headline river.

### R3. Data Layer & Supabase Invariant Preservation
- Connect directly to the Supabase endpoint using the provided URL and Anon Key.
- Preserve the 10-table data model (`companies`, `metric_snapshots`, `chain_nodes`, `tech_geo_tags`, `bull_bear_cases`, `mgmt_profiles`, `cross_company_narratives`, `valuation_inputs`, `news_items`).
- Preserve the strict separation between human-verified data (§§1–9) and machine-gathered news pulse (§10).
- Preserve the startup self-test integrity engine verifying all 107 companies, 492 metric bindings, 14 forces, and management records with a 100% pass rate.

### R4. Continuous Verification & Build Health
- Run a build check (`npm run build`) and verify navigation and responsiveness after every major component change.
- Ensure no runtime exceptions or broken data flows across any company or view.

## Acceptance Criteria

### Build & Architecture
- [ ] Project builds cleanly with zero errors via `npm run build`.
- [ ] Zero references to deprecated UI-1 structures (`.menu-rail`, `showSection`, `CONFIG.storyMode`, `body.story` scoping).

### Views & User Experience
- [ ] All 6 core views (Home Hero, Company Detail, Sectors Ledger, Forces Explorer, Compare Matrix, Freshness Monitor) render with polished modern UX.
- [ ] Company detail features smooth continuous scrolling with synchronized two-tier chapter tabs and right-hand digest.
- [ ] Proportional rails in the sector ledger and peer range bands in the digest render mathematically accurate bounds.

### Data & Backend Validation
- [ ] Supabase connection loads live data cleanly without rendering false zeros or missing fields.
- [ ] Startup self-test check asserts 107 companies, 492 metric bindings, 14 forces, and verified management records.
