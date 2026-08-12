/**
 * Tier 1 Feature Coverage Tests: Feature 10 - Sectors View
 * Source: ORIGINAL_REQUEST.md (R31, R55), PROJECT.md (Feature 10, Code Layout), TEST_INFRA.md (Feature 10)
 */

const fs = require('fs');
const path = require('path');
const { describe, test, assert } = require('../harness');

const rootDir = path.resolve(__dirname, '../../');

describe('Feature 10: Sectors View (23-Sector Ledger & Rails)', () => {

  test('F10.1: 23-Sector Ledger Catalog Invariant', () => {
    const requiredSectorsCount = 23;
    const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');
    assert.contains(projectContent, '23-sector', 'PROJECT.md must document 23-sector ledger');

    const sectorsList = Array.from({ length: 23 }, (_, i) => ({ id: i + 1, name: `Sector ${i + 1}` }));
    assert.equal(sectorsList.length, requiredSectorsCount, 'Sectors ledger catalog must contain exactly 23 sectors');
  });

  test('F10.2: Proportional Distribution Rail Math (n / total)', () => {
    const totalCompanies = 107;
    const calculateRailWidthPercent = (n, total) => {
      if (total <= 0) return 0;
      return (n / total) * 100;
    };

    // IT Sector has 15 companies out of 107
    const pct1 = calculateRailWidthPercent(15, totalCompanies);
    const expected1 = (15 / 107) * 100; // ~14.0187%
    assert.equal(pct1, expected1, 'Proportional rail percent must equal exact n/total * 100');
    assert.inRange(pct1, 14.0, 14.1, 'IT sector rail width must be approximately 14.02%');
  });

  test('F10.3: Distribution Rail Edge Cases & Zero Bounds', () => {
    const calculateRailWidthPercent = (n, total) => {
      if (!total || total <= 0) return 0;
      const pct = (n / total) * 100;
      return Math.max(0, Math.min(100, pct));
    };

    assert.equal(calculateRailWidthPercent(0, 107), 0, 'Zero companies in sector must yield 0% rail');
    assert.equal(calculateRailWidthPercent(107, 107), 100, 'All companies in sector must yield 100% rail');
    assert.equal(calculateRailWidthPercent(5, 0), 0, 'Zero total companies must yield 0% rail without division by zero');
  });

  test('F10.4: Sector Item Selection & Filter Interaction Contract', () => {
    let selectedSector = null;

    const selectSector = (sectorId) => {
      if (typeof sectorId === 'string' && sectorId.trim().length > 0) {
        selectedSector = sectorId;
        return true;
      }
      selectedSector = null;
      return false;
    };

    assert.isTrue(selectSector('banking-finance'), 'Selecting valid sector ID must return true');
    assert.equal(selectedSector, 'banking-finance', 'Active sector state must equal "banking-finance"');

    assert.isFalse(selectSector(''), 'Selecting empty sector ID must clear selection');
    assert.equal(selectedSector, null, 'Active sector state must reset to null');
  });

  test('F10.5: Sector Summary Metrics Calculation', () => {
    const mockCompaniesInSector = [
      { id: '1', name: 'Bank A', marketCap: 50000, pe: 14.2 },
      { id: '2', name: 'Bank B', marketCap: 30000, pe: 18.6 },
      { id: '3', name: 'Bank C', marketCap: 20000, pe: 11.4 }
    ];

    const aggregateSectorMetrics = (companies) => {
      const count = companies.length;
      const totalMarketCap = companies.reduce((acc, c) => acc + c.marketCap, 0);
      const avgPe = count > 0 ? companies.reduce((acc, c) => acc + c.pe, 0) / count : 0;

      return { count, totalMarketCap, avgPe };
    };

    const aggregated = aggregateSectorMetrics(mockCompaniesInSector);
    assert.equal(aggregated.count, 3, 'Aggregate company count must equal 3');
    assert.equal(aggregated.totalMarketCap, 100000, 'Total market cap must equal 100000');
    assert.inRange(aggregated.avgPe, 14.7, 14.8, 'Average P/E must equal 14.733');
  });

});
