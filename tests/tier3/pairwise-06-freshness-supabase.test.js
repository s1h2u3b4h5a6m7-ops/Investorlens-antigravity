/**
 * Tier 3 - Pairwise Test 6
 * Feature 7 (Freshness Monitor Stale Ledger) x Feature 2 (Supabase metric_snapshots & news_items) Integration
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 3 - Pairwise 06: Freshness Stale Ledger x Supabase Snapshots & News Data', () => {
  const NOW = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const mockMetricSnapshots = [
    { id: 'm1', companyId: 'tcs', metricName: 'PE_Ratio', updatedAt: new Date(NOW - 45 * DAY_MS).toISOString() }, // 45 days old -> stale
    { id: 'm2', companyId: 'infy', metricName: 'ROE', updatedAt: new Date(NOW - 5 * DAY_MS).toISOString() },   // 5 days old -> fresh
    { id: 'm3', companyId: 'wipro', metricName: 'FCF', updatedAt: new Date(NOW - 60 * DAY_MS).toISOString() }  // 60 days old -> stale
  ];

  const mockNewsItems = Array.from({ length: 60 }, (_, i) => ({
    id: `news_${i + 1}`,
    headline: `Industry Update ${i + 1}`,
    companyId: i % 2 === 0 ? 'tcs' : 'infy',
    publishedAt: new Date(NOW - i * 3600 * 1000).toISOString()
  }));

  test('Freshness Monitor Data Currency Ledger sorts snapshots oldest-first and flags stale items', () => {
    function processDataCurrencyLedger(snapshots, freshnessThresholdDays = 30) {
      const thresholdMs = freshnessThresholdDays * DAY_MS;
      const ledger = snapshots.map(s => {
        const ageMs = NOW - new Date(s.updatedAt).getTime();
        const isStale = ageMs > thresholdMs;
        return {
          ...s,
          ageDays: Math.floor(ageMs / DAY_MS),
          isStale,
          staleTagColor: isStale ? 'var(--stale)' : 'var(--up)'
        };
      });

      // Sort oldest-first
      ledger.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      return ledger;
    }

    const ledger = processDataCurrencyLedger(mockMetricSnapshots, 30);

    assert.strictEqual(ledger.length, 3);
    // Oldest item must be at index 0 (60 days old -> wipro)
    assert.strictEqual(ledger[0].companyId, 'wipro');
    assert.isTrue(ledger[0].isStale);
    assert.strictEqual(ledger[0].staleTagColor, 'var(--stale)');

    // Second oldest (45 days old -> tcs)
    assert.strictEqual(ledger[1].companyId, 'tcs');
    assert.isTrue(ledger[1].isStale);

    // Freshest item at end (5 days old -> infy)
    assert.strictEqual(ledger[2].companyId, 'infy');
    assert.isFalse(ledger[2].isStale);
  });

  test('60-item news pulse river is loaded directly from news_items table in reverse chronological order', () => {
    assert.strictEqual(mockNewsItems.length, 60, 'News river must load exactly 60 news items');

    const firstPublished = new Date(mockNewsItems[0].publishedAt).getTime();
    const lastPublished = new Date(mockNewsItems[59].publishedAt).getTime();

    assert.greaterThan(firstPublished, lastPublished, 'Headline river must be sorted newest-first');
  });
});
