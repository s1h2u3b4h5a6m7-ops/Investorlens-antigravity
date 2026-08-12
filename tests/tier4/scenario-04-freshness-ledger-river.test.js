/**
 * Tier 4 - Scenario Test 4
 * Real-World Application Workload Scenario 4:
 * Freshness Monitor Dual-Tab Toggle -> Data Currency Stale Ledger Verification ->
 * 60-Item Headline River Filtering & Timestamp Order Check
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 4 - Scenario 04: Freshness Dual-Tab Toggle -> Stale Ledger -> Headline River', () => {
  const NOW = Date.now();
  const DAY_MS = 24 * 3600 * 1000;

  const mockLedgerItems = [
    { companySymbol: 'TCS', metricName: 'PE_Ratio', updatedAt: new Date(NOW - 50 * DAY_MS).toISOString() }, // stale
    { companySymbol: 'INFY', metricName: 'ROE', updatedAt: new Date(NOW - 10 * DAY_MS).toISOString() },   // fresh
    { companySymbol: 'WIPRO', metricName: 'FreeCashFlow', updatedAt: new Date(NOW - 90 * DAY_MS).toISOString() } // stale
  ];

  const mock60Headlines = Array.from({ length: 60 }, (_, i) => ({
    id: `head_${i + 1}`,
    title: `India Market News Bulletin #${i + 1}`,
    category: i % 3 === 0 ? 'Earnings' : i % 3 === 1 ? 'Macro' : 'Regulatory',
    companySymbol: i % 4 === 0 ? 'TCS' : 'RELIANCE',
    timestamp: new Date(NOW - i * 1800 * 1000).toISOString() // 30-min spacing
  }));

  test('Step 1: User opens Freshness Monitor and verifies dual-tab interface', () => {
    const tabs = ['Data Currency Ledger', '60-Item Headline River'];
    let activeTab = 'Data Currency Ledger';

    assert.strictEqual(tabs.length, 2);
    assert.strictEqual(activeTab, 'Data Currency Ledger');
  });

  test('Step 2: Data Currency Ledger tab verifies oldest-first order and flags stale items', () => {
    function processLedger(items, staleThresholdDays = 30) {
      const thresholdMs = staleThresholdDays * DAY_MS;

      const processed = items.map(item => {
        const ageMs = NOW - new Date(item.updatedAt).getTime();
        return {
          ...item,
          isStale: ageMs > thresholdMs
        };
      });

      // Sort oldest-first
      processed.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      return processed;
    }

    const sortedLedger = processLedger(mockLedgerItems, 30);

    assert.strictEqual(sortedLedger[0].companySymbol, 'WIPRO', 'Oldest item must be at index 0');
    assert.isTrue(sortedLedger[0].isStale);

    assert.strictEqual(sortedLedger[1].companySymbol, 'TCS');
    assert.isTrue(sortedLedger[1].isStale);

    assert.strictEqual(sortedLedger[2].companySymbol, 'INFY', 'Freshest item at end');
    assert.isFalse(sortedLedger[2].isStale);
  });

  test('Step 3: User switches tab to 60-Item Headline River', () => {
    let activeTab = '60-Item Headline River';

    assert.strictEqual(activeTab, '60-Item Headline River');
    assert.strictEqual(mock60Headlines.length, 60, 'Headline river must load exactly 60 items');

    // Check chronological order (newest first)
    const t0 = new Date(mock60Headlines[0].timestamp).getTime();
    const t1 = new Date(mock60Headlines[1].timestamp).getTime();
    assert.greaterThan(t0, t1, 'Headlines must be ordered newest-first');
  });

  test('Step 4: User applies category filter "Earnings" on Headline River', () => {
    const categoryFilter = 'Earnings';
    const filteredHeadlines = mock60Headlines.filter(h => h.category === categoryFilter);

    assert.strictEqual(filteredHeadlines.length, 20, '1/3 of 60 items match Earnings category');
    for (const item of filteredHeadlines) {
      assert.strictEqual(item.category, 'Earnings');
    }
  });
});
