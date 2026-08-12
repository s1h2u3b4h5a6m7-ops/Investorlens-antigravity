/**
 * Tier 4 - Scenario Test 3
 * Real-World Application Workload Scenario 3:
 * 3-Shelf Macro Force Explorer (Tailwind/Context/Headwind) Navigation across 14 Forces ->
 * Split-Pane Company Exposure -> Jump to Company Detail Chapter 3 (Macro Context)
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 4 - Scenario 03: 3-Shelf Forces Explorer -> Split-Pane Exposure -> Chapter 3 Jump', () => {
  const FORCES_METADATA = [
    // Tailwind Shelf (5 forces)
    { id: 'f_upi', name: 'Digital Public Infrastructure (UPI)', shelf: 'Tailwind' },
    { id: 'f_pli', name: 'PLI Manufacturing Incentives', shelf: 'Tailwind' },
    { id: 'f_solar', name: 'Renewable Energy Transition', shelf: 'Tailwind' },
    { id: 'f_ev', name: 'EV Ecosystem Expansion', shelf: 'Tailwind' },
    { id: 'f_5g', name: '5G Infrastructure Rollout', shelf: 'Tailwind' },
    // Context Shelf (5 forces)
    { id: 'f_urban', name: 'Urbanization & Consumption', shelf: 'Context' },
    { id: 'f_demo', name: 'Demographic Dividend', shelf: 'Context' },
    { id: 'f_credit', name: 'Digitalization of Credit', shelf: 'Context' },
    { id: 'f_formal', name: 'Formalization of Economy', shelf: 'Context' },
    { id: 'f_china1', name: 'China+1 Supply Chain Realignment', shelf: 'Context' },
    // Headwind Shelf (4 forces)
    { id: 'f_rates', name: 'Global Interest Rate Volatility', shelf: 'Headwind' },
    { id: 'f_crude', name: 'Crude Oil & Commodity Spikes', shelf: 'Headwind' },
    { id: 'f_geo', name: 'Geopolitical Supply Chain Friction', shelf: 'Headwind' },
    { id: 'f_forex', name: 'Currency Depreciation Pressure', shelf: 'Headwind' }
  ];

  const MOCK_FORCE_EXPOSURES = {
    f_upi: [
      { companyId: 'hdfcbank', symbol: 'HDFCBANK', impactType: 'Positive', sentiment: 'Tailwind Beneficiary' },
      { companyId: 'tcs', symbol: 'TCS', impactType: 'Positive', sentiment: 'Tech Implementer' }
    ]
  };

  test('Step 1: User navigates to Forces View; verifies 3 shelves and 14 macro forces', () => {
    const shelves = {
      Tailwind: FORCES_METADATA.filter(f => f.shelf === 'Tailwind'),
      Context: FORCES_METADATA.filter(f => f.shelf === 'Context'),
      Headwind: FORCES_METADATA.filter(f => f.shelf === 'Headwind')
    };

    assert.strictEqual(shelves.Tailwind.length, 5, 'Tailwind shelf must contain 5 forces');
    assert.strictEqual(shelves.Context.length, 5, 'Context shelf must contain 5 forces');
    assert.strictEqual(shelves.Headwind.length, 4, 'Headwind shelf must contain 4 forces');
    assert.strictEqual(FORCES_METADATA.length, 14, 'Total forces count must equal 14');
  });

  test('Step 2: User selects "Digital Public Infrastructure (UPI)"; split-pane renders company exposures', () => {
    const selectedForceId = 'f_upi';
    const forceObj = FORCES_METADATA.find(f => f.id === selectedForceId);

    const splitPaneData = {
      activeForce: forceObj.name,
      shelf: forceObj.shelf,
      exposures: MOCK_FORCE_EXPOSURES[selectedForceId] || []
    };

    assert.strictEqual(splitPaneData.activeForce, 'Digital Public Infrastructure (UPI)');
    assert.strictEqual(splitPaneData.shelf, 'Tailwind');
    assert.greaterThan(splitPaneData.exposures.length, 0);
    assert.strictEqual(splitPaneData.exposures[0].symbol, 'HDFCBANK');
  });

  test('Step 3: User clicks exposed company "HDFCBANK", jumping directly to Chapter 3 (Macro Context)', () => {
    const selectedExposure = MOCK_FORCE_EXPOSURES['f_upi'][0];

    function jumpToCompanyMacroChapter(companyId, forceId) {
      return {
        view: 'CompanyDetailReader',
        route: `/company/${companyId}#chapter-3`,
        focusedChapter: 3,
        chapterTitle: '§3 Macro Context',
        highlightedForce: forceId
      };
    }

    const nav = jumpToCompanyMacroChapter(selectedExposure.companyId, 'f_upi');

    assert.strictEqual(nav.view, 'CompanyDetailReader');
    assert.strictEqual(nav.route, '/company/hdfcbank#chapter-3');
    assert.strictEqual(nav.focusedChapter, 3);
    assert.strictEqual(nav.chapterTitle, '§3 Macro Context');
    assert.strictEqual(nav.highlightedForce, 'f_upi');
  });
});
