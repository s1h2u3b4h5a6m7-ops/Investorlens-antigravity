/**
 * Tier 3 - Pairwise Test 9
 * Feature 11 (Forces Explorer 3-Shelf Macro Selection) x Feature 8 (Company Detail Chapter 3 Macro Context) Integration
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 3 - Pairwise 09: Forces Explorer 3-Shelf Selection x Company Detail Chapter 3 Integration', () => {
  const FORCES_14 = [
    { id: 'f1', name: 'Digital Public Infrastructure (UPI)', shelf: 'Tailwind', impact: 'High Positive' },
    { id: 'f2', name: 'PLI Manufacturing Schemes', shelf: 'Tailwind', impact: 'Positive' },
    { id: 'f3', name: 'Renewable Energy Transition', shelf: 'Tailwind', impact: 'Positive' },
    { id: 'f4', name: 'EV Ecosystem Adoption', shelf: 'Tailwind', impact: 'Positive' },
    { id: 'f5', name: '5G Infrastructure Rollout', shelf: 'Tailwind', impact: 'Positive' },
    { id: 'f6', name: 'Urbanization & Consumption', shelf: 'Context', impact: 'Neutral' },
    { id: 'f7', name: 'Demographic Dividend', shelf: 'Context', impact: 'Neutral' },
    { id: 'f8', name: 'Digitalization of Credit', shelf: 'Context', impact: 'Neutral' },
    { id: 'f9', name: 'Formalization of Economy', shelf: 'Context', impact: 'Neutral' },
    { id: 'f10', name: 'Global Supply Chain Shift (China+1)', shelf: 'Context', impact: 'Neutral' },
    { id: 'f11', name: 'Global Interest Rate Volatility', shelf: 'Headwind', impact: 'Negative' },
    { id: 'f12', name: 'Crude Oil & Commodity Spikes', shelf: 'Headwind', impact: 'Negative' },
    { id: 'f13', name: 'Geopolitical Supply Chain Friction', shelf: 'Headwind', impact: 'Negative' },
    { id: 'f14', name: 'Currency Depreciation Pressure', shelf: 'Headwind', impact: 'Negative' }
  ];

  test('3-shelf macro explorer categorizes all 14 macro forces into Tailwind, Context, or Headwind', () => {
    assert.strictEqual(FORCES_14.length, 14, 'Forces explorer must contain exactly 14 macro forces');

    const tailwinds = FORCES_14.filter(f => f.shelf === 'Tailwind');
    const contexts = FORCES_14.filter(f => f.shelf === 'Context');
    const headwinds = FORCES_14.filter(f => f.shelf === 'Headwind');

    assert.strictEqual(tailwinds.length, 5, 'Tailwind shelf contains 5 forces');
    assert.strictEqual(contexts.length, 5, 'Context shelf contains 5 forces');
    assert.strictEqual(headwinds.length, 4, 'Headwind shelf contains 4 forces');
  });

  test('Selecting force exposure item jumps directly to Company Detail Chapter 3 (Macro Context)', () => {
    function jumpToCompanyMacroContext(companyId, forceId) {
      const force = FORCES_14.find(f => f.id === forceId);
      return {
        targetRoute: `/company/${companyId}#chapter-3`,
        companyId,
        chapterNum: 3,
        chapterTitle: '§3 Macro Context',
        activeForceContext: force ? force.name : null
      };
    }

    const jumpState = jumpToCompanyMacroContext('tcs', 'f1');
    assert.strictEqual(jumpState.targetRoute, '/company/tcs#chapter-3');
    assert.strictEqual(jumpState.chapterNum, 3);
    assert.strictEqual(jumpState.activeForceContext, 'Digital Public Infrastructure (UPI)');
  });
});
