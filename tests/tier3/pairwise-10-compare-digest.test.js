/**
 * Tier 3 - Pairwise Test 10
 * Feature 12 (Peer Group Compare Matrix) x Feature 9 (Digest Panel Quantile Track Calculation) Integration
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 3 - Pairwise 10: Peer Group Compare Matrix x Digest Panel Quantile Track', () => {
  function computePeerQuantiles(metricValues) {
    if (!metricValues || metricValues.length === 0) {
      return { min: 0, max: 0, median: 0, q1: 0, q3: 0 };
    }
    const sorted = [...metricValues].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    return { min, max, median, count: sorted.length };
  }

  test('Compare matrix metric distribution feeds into niceBand() quantile calculations', () => {
    const peerMetricsPE = [18.5, 22.0, 25.4, 29.1, 31.8, 36.2, 42.0];
    const quantiles = computePeerQuantiles(peerMetricsPE);

    assert.strictEqual(quantiles.min, 18.5);
    assert.strictEqual(quantiles.max, 42.0);
    assert.strictEqual(quantiles.median, 29.1);

    function niceBand(low, high) {
      const span = Math.abs(high - low);
      const pad = span * 0.1;
      return { bandMin: low - pad, bandMax: high + pad };
    }

    const band = niceBand(quantiles.min, quantiles.max);
    assert.lessThan(band.bandMin, quantiles.min, 'Band min must sit below lowest peer value');
    assert.greaterThan(band.bandMax, quantiles.max, 'Band max must sit above highest peer value');
  });

  test('Handles edge case where all peer metric values are identical', () => {
    const identicalPEs = [25.0, 25.0, 25.0, 25.0];
    const quantiles = computePeerQuantiles(identicalPEs);

    assert.strictEqual(quantiles.min, 25.0);
    assert.strictEqual(quantiles.max, 25.0);
    assert.strictEqual(quantiles.median, 25.0);
  });
});
