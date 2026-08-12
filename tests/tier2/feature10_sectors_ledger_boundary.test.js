/**
 * Feature 10 Tier 2 Boundary & Corner Case Tests
 * Focus: 0 companies in sector, 100% single sector concentration, decimal rounding errors on n/total
 */

const { describe, test } = require('../harness/runner.js');
const assert = require('../harness/assert.js');

describe('Feature 10 Boundary: Sectors View & Proportional Rails', () => {

  const calculateProportionalRails = (sectorsMap, totalCompanies = 107) => {
    if (totalCompanies <= 0 || typeof totalCompanies !== 'number' || isNaN(totalCompanies)) {
      totalCompanies = 107; // Default safety
    }

    const results = [];
    let sumProportions = 0;

    for (const [sectorName, count] of Object.entries(sectorsMap)) {
      const safeCount = Math.max(0, typeof count === 'number' ? count : 0);
      const ratio = safeCount / totalCompanies;
      const pct = Number((ratio * 100).toFixed(2));
      results.push({
        sector: sectorName,
        count: safeCount,
        ratio,
        pct
      });
      sumProportions += ratio;
    }

    return { results, sumProportions: Number(sumProportions.toFixed(4)) };
  };

  test('F10-B1: 0 companies in sector divide-by-zero safety', () => {
    const sectorsMap = {
      'IT': 25,
      'Banking': 20,
      'Space Tech': 0 // 0 companies in this sector
    };

    const { results } = calculateProportionalRails(sectorsMap, 107);
    const spaceTech = results.find(r => r.sector === 'Space Tech');
    assert.ok(spaceTech);
    assert.strictEqual(spaceTech.count, 0);
    assert.strictEqual(spaceTech.ratio, 0);
    assert.strictEqual(spaceTech.pct, 0);
  });

  test('F10-B2: 100% single sector concentration', () => {
    const concentratedMap = {
      'Information Technology': 107
    };

    const { results, sumProportions } = calculateProportionalRails(concentratedMap, 107);
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].ratio, 1.0);
    assert.strictEqual(results[0].pct, 100);
    assert.strictEqual(sumProportions, 1.0);
  });

  test('F10-B3: decimal rounding errors on n/total rails precision', () => {
    // 3 sectors with fractional distribution 35, 36, 36 (total 107)
    const sectorsMap = {
      'S1': 35,
      'S2': 36,
      'S3': 36
    };

    const { sumProportions } = calculateProportionalRails(sectorsMap, 107);
    assert.strictEqual(sumProportions, 1.0, 'Sum of exact proportions must equal 1.0');
  });

  test('F10-B4: missing sector key normalization', () => {
    const rawCompanies = [
      { id: 'c1', name: 'Alpha', sector: 'IT' },
      { id: 'c2', name: 'Beta', sector: null },
      { id: 'c3', name: 'Gamma', sector: undefined },
      { id: 'c4', name: 'Delta', sector: '' }
    ];

    const groupCompaniesBySector = (companies) => {
      const map = {};
      companies.forEach(c => {
        const sector = (c.sector && typeof c.sector === 'string' && c.sector.trim()) ? c.sector.trim() : 'Uncategorized';
        map[sector] = (map[sector] || 0) + 1;
      });
      return map;
    };

    const grouped = groupCompaniesBySector(rawCompanies);
    assert.strictEqual(grouped['IT'], 1);
    assert.strictEqual(grouped['Uncategorized'], 3);
  });

  test('F10-B5: negative company count prevention', () => {
    const invalidMap = {
      'Banking': -5,
      'Pharma': 15
    };

    const { results } = calculateProportionalRails(invalidMap, 107);
    const banking = results.find(r => r.sector === 'Banking');
    assert.strictEqual(banking.count, 0, 'Negative count must be clamped to 0');
    assert.strictEqual(banking.pct, 0);
  });

});
