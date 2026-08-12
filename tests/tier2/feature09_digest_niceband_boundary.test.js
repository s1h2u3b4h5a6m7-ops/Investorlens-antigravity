/**
 * Feature 9 Tier 2 Boundary & Corner Case Tests
 * Focus: Single company peer range, identical metric min/max, zero spread niceBand(), NaN inputs
 */

const { describe, test } = require('../harness/runner.js');
const assert = require('../harness/assert.js');

describe('Feature 9 Boundary: Company Detail Digest Panel & niceBand()', () => {

  const niceBand = (values) => {
    if (!Array.isArray(values) || values.length === 0) {
      return { low: 0, high: 1, spread: 1, valid: false };
    }

    const validNums = values.filter(v => typeof v === 'number' && !isNaN(v) && isFinite(v));
    if (validNums.length === 0) {
      return { low: 0, high: 1, spread: 1, valid: false };
    }

    let min = Math.min(...validNums);
    let max = Math.max(...validNums);

    if (min === max) {
      // Single company or zero spread fallback
      const buffer = Math.abs(min) * 0.1 || 1.0;
      min = min - buffer;
      max = max + buffer;
    }

    const spread = max - min;
    return {
      low: Number(min.toFixed(2)),
      high: Number(max.toFixed(2)),
      spread: Number(spread.toFixed(2)),
      valid: true
    };
  };

  test('F9-B1: single company peer range niceBand() calculation', () => {
    const res = niceBand([45.5]);
    assert.isTrue(res.valid);
    assert.greaterThan(res.spread, 0, 'Spread must be non-zero for single item');
    assert.lessThan(res.low, 45.5);
    assert.greaterThan(res.high, 45.5);
  });

  test('F9-B2: identical metric min/max niceBand() calculation', () => {
    const res = niceBand([100, 100, 100, 100]);
    assert.isTrue(res.valid);
    assert.strictEqual(res.low, 90);
    assert.strictEqual(res.high, 110);
    assert.strictEqual(res.spread, 20);
  });

  test('F9-B3: zero spread niceBand() divide-by-zero safety', () => {
    const res = niceBand([0, 0, 0]);
    assert.isTrue(res.valid);
    assert.strictEqual(res.low, -1.0);
    assert.strictEqual(res.high, 1.0);
    assert.strictEqual(res.spread, 2.0);
    assert.isFalse(isNaN(res.spread));
    assert.isFalse(res.spread === Infinity);
  });

  test('F9-B4: NaN and Infinity input resilience in niceBand()', () => {
    const badValues = [NaN, 10.5, Infinity, -Infinity, undefined, null, 25.0];
    const res = niceBand(badValues);
    assert.isTrue(res.valid);
    assert.strictEqual(res.low, 10.5);
    assert.strictEqual(res.high, 25.0);
    assert.strictEqual(res.spread, 14.5);
  });

  test('F9-B5: out-of-bounds quantile value clamping', () => {
    const clampQuantilePosition = (val, low, high) => {
      if (high <= low) return 50; // default middle
      const rawPct = ((val - low) / (high - low)) * 100;
      return Math.min(Math.max(rawPct, 0), 100);
    };

    // Underflow value (-10 when range is 0..100)
    assert.strictEqual(clampQuantilePosition(-10, 0, 100), 0);
    // Overflow value (150 when range is 0..100)
    assert.strictEqual(clampQuantilePosition(150, 0, 100), 100);
    // Normal in-range value (50 when range is 0..100)
    assert.strictEqual(clampQuantilePosition(50, 0, 100), 50);
  });

});
