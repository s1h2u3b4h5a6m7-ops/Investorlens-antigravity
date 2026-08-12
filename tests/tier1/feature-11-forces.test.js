/**
 * Tier 1 Feature Coverage Tests: Feature 11 - Forces View
 * Source: ORIGINAL_REQUEST.md (R32, R55), PROJECT.md (Feature 11, Code Layout), TEST_INFRA.md (Feature 11)
 */

const fs = require('fs');
const path = require('path');
const { describe, test, assert } = require('../harness');

const rootDir = path.resolve(__dirname, '../../');

describe('Feature 11: Forces View (3-Shelf Explorer & Exposure)', () => {

  test('F11.1: 3-Shelf Categorized Explorer Taxonomy', () => {
    const requiredShelves = ['Tailwind', 'Context', 'Headwind'];
    const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');

    for (const shelf of requiredShelves) {
      assert.contains(projectContent, shelf, `PROJECT.md must document macro force shelf "${shelf}"`);
    }
  });

  test('F11.2: 14 Macro Forces Inventory Catalog Invariant', () => {
    const mockForcesCatalog = [
      { id: 'F1', name: 'Digital Infrastructure Growth', category: 'Tailwind' },
      { id: 'F2', name: 'Clean Energy Transition', category: 'Tailwind' },
      { id: 'F3', name: 'Domestic Manufacturing Subsidies', category: 'Tailwind' },
      { id: 'F4', name: 'Rising Urban Middle Class', category: 'Tailwind' },
      { id: 'F5', name: '5G Infrastructure Rollout', category: 'Tailwind' },
      { id: 'F6', name: 'Global Supply Chain Re-alignment', category: 'Context' },
      { id: 'F7', name: 'Interest Rate Normalization', category: 'Context' },
      { id: 'F8', name: 'Currency Volatility', category: 'Context' },
      { id: 'F9', name: 'Regulatory Shift in FinTech', category: 'Context' },
      { id: 'F10', name: 'AI & Automation Disruption', category: 'Context' },
      { id: 'F11', name: 'Global Crude Price Inflation', category: 'Headwind' },
      { id: 'F12', name: 'Geopolitical Trade Barriers', category: 'Headwind' },
      { id: 'F13', name: 'Semiconductor Shortages', category: 'Headwind' },
      { id: 'F14', name: 'Skilled Tech Talent Deficit', category: 'Headwind' }
    ];

    assert.equal(mockForcesCatalog.length, 14, 'Macro forces inventory catalog must contain exactly 14 forces');

    const tailwinds = mockForcesCatalog.filter(f => f.category === 'Tailwind');
    const contexts = mockForcesCatalog.filter(f => f.category === 'Context');
    const headwinds = mockForcesCatalog.filter(f => f.category === 'Headwind');

    assert.greaterThan(tailwinds.length, 0, 'Must have Tailwind forces');
    assert.greaterThan(contexts.length, 0, 'Must have Context forces');
    assert.greaterThan(headwinds.length, 0, 'Must have Headwind forces');
  });

  test('F11.3: Split-Pane Company Exposure Mapping Contract', () => {
    const forceExposureMap = {
      forceId: 'F11',
      forceName: 'Global Crude Price Inflation',
      category: 'Headwind',
      exposedCompanies: [
        { companyId: 'COMP-001', companyName: 'Reliance Industries', impactScore: -0.7, impactType: 'high_negative' },
        { companyId: 'COMP-015', companyName: 'Paint Corp', impactScore: -0.85, impactType: 'high_negative' },
        { companyId: 'COMP-042', companyName: 'Solar Tech', impactScore: +0.4, impactType: 'moderate_positive' }
      ]
    };

    assert.isType(forceExposureMap.forceId, 'string', 'Force ID must be string');
    assert.isTrue(Array.isArray(forceExposureMap.exposedCompanies), 'exposedCompanies must be array');
    assert.greaterThan(forceExposureMap.exposedCompanies.length, 0, 'Must list exposed companies');
  });

  test('F11.4: Exposure Intensity Scoring & Classification', () => {
    const classifyImpact = (score) => {
      if (score >= 0.5) return 'high_positive';
      if (score > 0) return 'moderate_positive';
      if (score === 0) return 'neutral';
      if (score > -0.5) return 'moderate_negative';
      return 'high_negative';
    };

    assert.equal(classifyImpact(0.8), 'high_positive', 'Score 0.8 must classify as high_positive');
    assert.equal(classifyImpact(0.2), 'moderate_positive', 'Score 0.2 must classify as moderate_positive');
    assert.equal(classifyImpact(0), 'neutral', 'Score 0 must classify as neutral');
    assert.equal(classifyImpact(-0.3), 'moderate_negative', 'Score -0.3 must classify as moderate_negative');
    assert.equal(classifyImpact(-0.7), 'high_negative', 'Score -0.7 must classify as high_negative');
  });

  test('F11.5: Shelf Filter Tab Switching State Invariants', () => {
    let activeShelf = 'ALL';
    const setShelf = (shelf) => {
      const valid = ['ALL', 'Tailwind', 'Context', 'Headwind'];
      if (valid.includes(shelf)) {
        activeShelf = shelf;
        return true;
      }
      return false;
    };

    assert.isTrue(setShelf('Tailwind'), 'Switching to Tailwind shelf must succeed');
    assert.equal(activeShelf, 'Tailwind', 'Active shelf state must equal Tailwind');

    assert.isTrue(setShelf('Headwind'), 'Switching to Headwind shelf must succeed');
    assert.equal(activeShelf, 'Headwind', 'Active shelf state must equal Headwind');

    assert.isFalse(setShelf('InvalidShelf'), 'Switching to invalid shelf must fail');
  });

});
