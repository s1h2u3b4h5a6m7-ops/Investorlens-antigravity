# E2E Test Infra: InvestorLens India Modernization

## Test Philosophy
- Opaque-box, requirement-driven testing derived from `ORIGINAL_REQUEST.md`.
- Zero coupling to internal module implementation details.
- Systematic 4-tier test methodology: Category-Partition, Boundary Value Analysis (BVA), Pairwise Combinatorial Testing, and Real-World Application Workload Scenarios.

## Feature Inventory & Test Distribution
| # | Feature | Requirement Source | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---------|-------------------|:------:|:------:|:------:|:------:|
| 1 | Infrastructure & Vite React Setup | R1 | 5 | 5 | ✓ | ✓ |
| 2 | Supabase 10-Table Connection | R3 | 5 | 5 | ✓ | ✓ |
| 3 | Startup Self-Test Integrity Engine | R3 | 5 | 5 | ✓ | ✓ |
| 4 | Legacy UI-1 Retirement (.menu-rail, #home-tabs, showSection) | R1 | 5 | 5 | ✓ | ✓ |
| 5 | UI-2 Promotion & Bezel Navigation | R1 | 5 | 5 | ✓ | ✓ |
| 6 | Home Hero View (Aperture, Omnibox, 6 Cards, Readout) | R2 | 5 | 5 | ✓ | ✓ |
| 7 | Freshness View (Stale Ledger, 60-item Headline River) | R2 | 5 | 5 | ✓ | ✓ |
| 8 | Company Detail 10-Chapter Continuous Reader (62% Scrollspy, Two-Tier Header) | R2 | 5 | 5 | ✓ | ✓ |
| 9 | Company Detail Digest Panel (niceBand() Algorithm, Best-Value Markers) | R2 | 5 | 5 | ✓ | ✓ |
| 10 | Sectors View (23-Sector Ledger with n/total Proportional Rails) | R2 | 5 | 5 | ✓ | ✓ |
| 11 | Forces View (3-Shelf Tailwind/Context/Headwind Explorer, 14 Forces) | R2 | 5 | 5 | ✓ | ✓ |
| 12 | Compare Mode (Side-by-Side Matrix, 27 Peer Groups) | R2 | 5 | 5 | ✓ | ✓ |
| 13 | Build Health & No Runtime Exceptions (`npm run build`) | R4 | 5 | 5 | ✓ | ✓ |
| **Total** | | | **65** | **65** | **13** | **7** |

## Test Architecture
- Test Runner: Node test suite / Vitest / Playwright test harness executing against built assets.
- Input & Output Verification: HTTP/DOM assertion, API contract checks, data model assertions.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Omnibox search to Company Detail 10-chapter scroll with scroll-spy tab updates | F6, F8, F9 | High |
| 2 | Sector Ledger filter to Peer Group Compare Matrix across 27 groups | F10, F12 | Medium |
| 3 | 3-Shelf Macro Force Explorer navigation to Split-Pane Company Exposure | F11, F8 | Medium |
| 4 | Freshness Monitor Data Currency stale flag check & 60-item headline river | F7, F2 | Medium |
| 5 | Startup Self-Test Integrity diagnostic suite validation (107 companies, 492 metrics, 14 forces) | F3, F2 | High |
| 6 | Verification of 0 legacy UI-1 DOM elements (`.menu-rail`, `#home-tabs`, `body.story`) | F4, F5 | High |
| 7 | Full navigation journey across all 6 core views without console errors or runtime exceptions | F1, F5, F6, F7, F8, F10, F11, F12 | High |

## Coverage Thresholds
- Tier 1 (Feature Coverage): 65 test cases (5 per feature)
- Tier 2 (Boundary & Corner Cases): 65 test cases (5 per feature)
- Tier 3 (Cross-Feature Pairwise): 13 pairwise integration tests
- Tier 4 (Real-World Application): 7 end-to-end application scenarios
- **Total Minimum Test Cases**: 150 test cases
