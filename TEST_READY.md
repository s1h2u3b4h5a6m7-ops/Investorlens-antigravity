# E2E Test Suite Ready: InvestorLens India Modernization

> Status: Ready
> Created: 2026-08-11T11:08:15Z
> Total Test Cases: 150 (Tiers 1-4)
> Target Pass Rate: 100%

## Test Execution Commands
To execute the complete E2E test suite across all 4 tiers (150 tests):
```bash
node tests/run-all-tests.js
```

To execute a specific tier:
```bash
node tests/run-all-tests.js --tier=tier1
node tests/run-all-tests.js --tier=tier2
node tests/run-all-tests.js --tier=tier3
node tests/run-all-tests.js --tier=tier4
```

To run with verbose output or filtered by feature:
```bash
node tests/run-all-tests.js --verbose
node tests/run-all-tests.js --filter=niceband
```

## Coverage Summary
| Tier | Description | Files | Test Cases | Status |
|------|-------------|:-----:|:----------:|:------:|
| Tier 1 | Feature Coverage Suite (5 tests/feature x 13 features) | 13 | 65 | READY |
| Tier 2 | Boundary & Corner Cases Suite (5 tests/feature x 13 features) | 13 | 65 | READY |
| Tier 3 | Cross-Feature Pairwise Integration Suite | 13 | 13 | READY |
| Tier 4 | Real-World Application Scenario Suite | 7 | 7 | READY |
| **Total** | **Complete Requirement-Driven Opaque-Box E2E Suite** | **46** | **150** | **READY** |

## Feature Coverage Matrix
| # | Feature | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Total Tests |
|---|---------|:------:|:------:|:------:|:------:|:-----------:|
| 1 | Infrastructure & Vite React Setup | 5 | 5 | ✓ (Pairwise #1) | ✓ (Scenario #7) | 12 |
| 2 | Supabase 10-Table Connection | 5 | 5 | ✓ (Pairwise #2, #6) | ✓ (Scenario #4, #5) | 14 |
| 3 | Startup Self-Test Integrity Engine | 5 | 5 | ✓ (Pairwise #2, #3) | ✓ (Scenario #5) | 13 |
| 4 | Legacy UI-1 Retirement (.menu-rail, #home-tabs) | 5 | 5 | ✓ (Pairwise #4) | ✓ (Scenario #6) | 12 |
| 5 | UI-2 Promotion & Bezel Navigation | 5 | 5 | ✓ (Pairwise #1, #4) | ✓ (Scenario #6, #7) | 14 |
| 6 | Home Hero View (Aperture, Omnibox, 6 Cards) | 5 | 5 | ✓ (Pairwise #3, #5, #11) | ✓ (Scenario #1, #7) | 15 |
| 7 | Freshness View (Stale Ledger, 60-item River) | 5 | 5 | ✓ (Pairwise #6, #12) | ✓ (Scenario #4, #7) | 14 |
| 8 | Company Detail 10-Chapter Reader & Scrollspy | 5 | 5 | ✓ (Pairwise #5, #7, #9, #12) | ✓ (Scenario #1, #3, #7) | 17 |
| 9 | Company Detail Digest Panel (niceBand()) | 5 | 5 | ✓ (Pairwise #7, #10) | ✓ (Scenario #1) | 13 |
| 10 | Sectors View (23-Sector Ledger & Rails) | 5 | 5 | ✓ (Pairwise #8, #11) | ✓ (Scenario #2, #7) | 14 |
| 11 | Forces View (3-Shelf Explorer & Exposure) | 5 | 5 | ✓ (Pairwise #9) | ✓ (Scenario #3, #7) | 13 |
| 12 | Compare Mode (27 Peer Groups Matrix) | 5 | 5 | ✓ (Pairwise #8, #10) | ✓ (Scenario #2, #7) | 14 |
| 13 | Build Health & Zero Runtime Exceptions | 5 | 5 | ✓ (Pairwise #13) | ✓ (Scenario #7) | 12 |
| **Total** | | **65** | **65** | **13** | **7** | **150** |

## Test Suite Directory Architecture
```
tests/
├── harness/
│   ├── assert.js        # Zero-dependency assertion library
│   ├── runner.js        # Core test runner with lifecycle hooks & timing
│   ├── reporter.js      # Terminal reporter with colorized output & error traces
│   ├── loader.js        # Dynamic test suite discovery loader
│   └── index.js         # Test harness index export
├── tier1/               # Tier 1 Feature Coverage test files (13 files, 65 tests)
├── tier2/               # Tier 2 Boundary & Corner Case test files (13 files, 65 tests)
├── tier3/               # Tier 3 Cross-Feature Pairwise test files (13 files, 13 tests)
├── tier4/               # Tier 4 Real-World Application Scenario test files (7 files, 7 tests)
└── run-all-tests.js     # Master CLI test runner executable
```
