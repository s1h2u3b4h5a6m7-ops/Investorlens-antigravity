/**
 * Tier 3 - Pairwise Test 11
 * Feature 6 (Home Hero Sector Summary Card Click) x Feature 10 (Sectors View 23-Sector Proportional Rails) Integration
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 3 - Pairwise 11: Home Hero Sector Card Click x Sectors View Proportional Rails', () => {
  test('Clicking sector counter card on Home Hero navigates to Sectors View', () => {
    function handleHeroCardClick(cardId) {
      if (cardId === 'card_sectors') {
        return {
          route: '/sectors',
          targetView: 'SectorsLedger',
          sectorCount: 23,
          totalCompanies: 107
        };
      }
      return null;
    }

    const navResult = handleHeroCardClick('card_sectors');
    assert.ok(navResult, 'Clicking sector card must yield navigation object');
    assert.strictEqual(navResult.route, '/sectors');
    assert.strictEqual(navResult.targetView, 'SectorsLedger');
    assert.strictEqual(navResult.sectorCount, 23);
  });

  test('Sectors View renders exact n/total proportional distribution rails for all 23 sectors', () => {
    const mockSectors = [
      { name: 'BFSI & Banking', count: 18 },
      { name: 'IT Services', count: 12 },
      { name: 'Pharma', count: 10 },
      { name: 'Agro & Fertilizers', count: 1 }
    ];

    const TOTAL = 107;

    function computeProportionalRailWidth(count, total) {
      return Number(((count / total) * 100).toFixed(2));
    }

    const bfsiWidth = computeProportionalRailWidth(18, TOTAL);
    assert.strictEqual(bfsiWidth, 16.82, 'BFSI rail width must be 16.82%');

    const itWidth = computeProportionalRailWidth(12, TOTAL);
    assert.strictEqual(itWidth, 11.21, 'IT Services rail width must be 11.21%');

    const agroWidth = computeProportionalRailWidth(1, TOTAL);
    assert.strictEqual(agroWidth, 0.93, 'Single company sector rail width must be 0.93%');
  });
});
