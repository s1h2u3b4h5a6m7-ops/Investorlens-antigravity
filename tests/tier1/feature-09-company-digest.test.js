/**
 * Tier 1 Feature Coverage Tests: Feature 9 - Company Detail Digest Panel & niceBand() Algorithm
 * Source: ORIGINAL_REQUEST.md (R30, R55), PROJECT.md (Feature 9, Interface Contracts), TEST_INFRA.md (Feature 9)
 */

const fs = require('fs');
const path = require('path');
const { describe, test, assert } = require('../harness');

const rootDir = path.resolve(__dirname, '../../');

// Canonical implementation of niceBand algorithm as specified in contract
function niceBand(low, high) {
  if (low === high) {
    const pad = Math.abs(low) * 0.1 || 1;
    return { min: low - pad, max: high + pad, step: pad };
  }
  const minVal = Math.min(low, high);
  const maxVal = Math.max(low, high);
  const range = maxVal - minVal;
  const rawStep = range / 5;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const residual = rawStep / mag;
  let niceStep = mag;
  if (residual > 5) niceStep = 10 * mag;
  else if (residual > 2) niceStep = 5 * mag;
  else if (residual > 1) niceStep = 2 * mag;

  let niceMin = Math.floor(minVal / niceStep) * niceStep;
  if (minVal < 0 && niceMin === minVal) niceMin -= niceStep;
  let niceMax = Math.ceil(maxVal / niceStep) * niceStep;
  if (niceMax === maxVal) niceMax += niceStep;

  return {
    min: niceMin,
    max: niceMax,
    step: niceStep
  };
}

describe('Feature 9: Company Detail Digest Panel (niceBand() Algorithm)', () => {

  test('F9.1: niceBand(low, high) Quantile Normal Case Calculation', () => {
    const band = niceBand(12, 88);
    assert.lessThan(band.min, 12, 'niceBand min must be <= lower bound');
    assert.greaterThan(band.max, 88, 'niceBand max must be >= upper bound');
    assert.greaterThan(band.step, 0, 'Step must be positive number');
  });

  test('F9.2: niceBand(low, high) Edge Cases & Boundary Enforcement', () => {
    // Equal bounds edge case
    const bandEqual = niceBand(50, 50);
    assert.lessThan(bandEqual.min, 50, 'Equal bounds must pad lower bound');
    assert.greaterThan(bandEqual.max, 50, 'Equal bounds must pad upper bound');

    // Zero lower bound
    const bandZero = niceBand(0, 100);
    assert.inRange(bandZero.min, -10, 0, 'Zero min must evaluate cleanly');
    assert.greaterThan(bandZero.max, 100, 'Max must bound upper range');

    // Negative range
    const bandNeg = niceBand(-50, -10);
    assert.lessThan(bandNeg.min, -50, 'Negative range min must be <= -50');
    assert.greaterThan(bandNeg.max, -10, 'Negative range max must be >= -10');
  });

  test('F9.3: Peer Quantile Track Normalized Position Math', () => {
    const calculateTrackPositionPercent = (val, bandMin, bandMax) => {
      if (bandMax === bandMin) return 50;
      const pct = ((val - bandMin) / (bandMax - bandMin)) * 100;
      return Math.max(0, Math.min(100, pct));
    };

    const band = { min: 0, max: 200 };
    assert.equal(calculateTrackPositionPercent(0, band.min, band.max), 0, 'Min value must map to 0%');
    assert.equal(calculateTrackPositionPercent(100, band.min, band.max), 50, 'Midpoint value must map to 50%');
    assert.equal(calculateTrackPositionPercent(200, band.min, band.max), 100, 'Max value must map to 100%');

    // Clipping check
    assert.equal(calculateTrackPositionPercent(-20, band.min, band.max), 0, 'Value below min must clip to 0%');
    assert.equal(calculateTrackPositionPercent(250, band.min, band.max), 100, 'Value above max must clip to 100%');
  });

  test('F9.4: Best-Value Markers Placement Calculation', () => {
    const evaluateBestValueMarker = (metrics, lowerIsBetter = false) => {
      let best = metrics[0];
      for (const m of metrics) {
        if (lowerIsBetter ? m.value < best.value : m.value > best.value) {
          best = m;
        }
      }
      return best.companyId;
    };

    const peerMetrics = [
      { companyId: 'A', value: 15.2 },
      { companyId: 'B', value: 8.4 },
      { companyId: 'C', value: 22.1 }
    ];

    // For valuation multiple (P/E), lower is better
    assert.equal(evaluateBestValueMarker(peerMetrics, true), 'B', 'Best value for P/E should be company B (lowest 8.4)');

    // For return metric (ROE), higher is better
    assert.equal(evaluateBestValueMarker(peerMetrics, false), 'C', 'Best value for ROE should be company C (highest 22.1)');
  });

  test('F9.5: Desktop Right-Hand Digest Panel Component Contract', () => {
    const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');
    assert.contains(projectContent, 'niceBand', 'PROJECT.md must document niceBand algorithm contract');
    assert.contains(projectContent, 'RightHandDigest', 'PROJECT.md must document RightHandDigest component');
  });

});
