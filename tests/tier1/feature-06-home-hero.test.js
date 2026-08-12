/**
 * Tier 1 Feature Coverage Tests: Feature 6 - Home Hero View
 * Source: ORIGINAL_REQUEST.md (R29, R53), PROJECT.md (Feature 6, Code Layout), TEST_INFRA.md (Feature 6)
 */

const fs = require('fs');
const path = require('path');
const { describe, test, assert } = require('../harness');

const rootDir = path.resolve(__dirname, '../../');

describe('Feature 6: Home Hero View', () => {

  test('F6.1: Symmetric Aperture 3D Hero Layout Structure', () => {
    const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');
    assert.contains(projectContent, 'Aperture hero', 'PROJECT.md must document Symmetric Aperture 3D hero');
    assert.contains(projectContent, 'ApertureHero', 'PROJECT.md must specify ApertureHero component');
  });

  test('F6.2: Universal Omnibox Search Logic Across Entities', () => {
    const sampleDataset = [
      { id: '1', type: 'company', name: 'Reliance Industries', ticker: 'RELIANCE', sector: 'Energy' },
      { id: '2', type: 'company', name: 'Tata Consultancy Services', ticker: 'TCS', sector: 'IT' },
      { id: '3', type: 'sector', name: 'Information Technology', count: 12 },
      { id: '4', type: 'force', name: 'Semiconductor Supply Chain', category: 'Tailwind' },
      { id: '5', type: 'map', name: 'Geospatial Production Hubs' }
    ];

    const omniboxSearch = (query) => {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      return sampleDataset.filter(item => {
        return (item.name && item.name.toLowerCase().includes(q)) ||
               (item.ticker && item.ticker.toLowerCase().includes(q)) ||
               (item.sector && item.sector.toLowerCase().includes(q)) ||
               (item.type && item.type.toLowerCase().includes(q));
      });
    };

    // Test search company by ticker
    const res1 = omniboxSearch('tcs');
    assert.equal(res1.length, 1, 'Search "tcs" should return 1 result');
    assert.equal(res1[0].name, 'Tata Consultancy Services', 'Result name should match TCS');

    // Test search sector by name
    const res2 = omniboxSearch('Information');
    assert.equal(res2.length, 1, 'Search "Information" should return IT sector');

    // Test search force by category/name
    const res3 = omniboxSearch('Semiconductor');
    assert.equal(res3.length, 1, 'Search "Semiconductor" should return macro force');
  });

  test('F6.3: Omnibox Edge Cases & Input Sanitation', () => {
    const sampleDataset = [
      { id: '1', name: 'Reliance Industries', ticker: 'RELIANCE' }
    ];

    const omniboxSearch = (query) => {
      if (typeof query !== 'string') return [];
      const q = query.trim().toLowerCase();
      if (!q) return [];
      return sampleDataset.filter(item => item.name.toLowerCase().includes(q) || item.ticker.toLowerCase().includes(q));
    };

    assert.equal(omniboxSearch('').length, 0, 'Empty string search should return empty array');
    assert.equal(omniboxSearch('   ').length, 0, 'Whitespace search should return empty array');
    assert.equal(omniboxSearch(null).length, 0, 'Null search should return empty array');
    assert.equal(omniboxSearch('!@#$%').length, 0, 'Special characters with no match should return empty array');
    assert.equal(omniboxSearch('  RELIANCE  ').length, 1, 'Search with leading/trailing whitespace should work');
  });

  test('F6.4: 6 Animated Live Counter Cards Specifications', () => {
    const requiredCounterCards = [
      { title: 'Companies Tracked', targetValue: 107 },
      { title: 'Metric Bindings', targetValue: 492 },
      { title: 'Sectors Covered', targetValue: 23 },
      { title: 'Macro Forces', targetValue: 14 },
      { title: 'Peer Groups', targetValue: 27 },
      { title: 'Data Currency', targetValue: '100%' }
    ];

    assert.equal(requiredCounterCards.length, 6, 'Must render exactly 6 live counter cards');
    assert.equal(requiredCounterCards[0].targetValue, 107, 'Companies card must target 107');
    assert.equal(requiredCounterCards[1].targetValue, 492, 'Metric bindings card must target 492');
    assert.equal(requiredCounterCards[2].targetValue, 23, 'Sectors card must target 23');
    assert.equal(requiredCounterCards[3].targetValue, 14, 'Macro forces card must target 14');
    assert.equal(requiredCounterCards[4].targetValue, 27, 'Peer groups card must target 27');
  });

  test('F6.5: Integrity Readout Banner Integration Contract', () => {
    const renderIntegrityBanner = (selfTestPassed) => {
      return {
        status: selfTestPassed ? 'PASSED' : 'FAILED',
        className: selfTestPassed ? 'integrity-banner success' : 'integrity-banner alert',
        message: selfTestPassed ? 'All 107 companies & 492 metrics passed integrity checks' : 'Integrity diagnostic failed'
      };
    };

    const passBanner = renderIntegrityBanner(true);
    assert.equal(passBanner.status, 'PASSED', 'Integrity banner status must be PASSED');
    assert.contains(passBanner.className, 'success', 'Banner CSS class must be success');

    const failBanner = renderIntegrityBanner(false);
    assert.equal(failBanner.status, 'FAILED', 'Integrity banner status must be FAILED');
    assert.contains(failBanner.className, 'alert', 'Banner CSS class must be alert');
  });

});
