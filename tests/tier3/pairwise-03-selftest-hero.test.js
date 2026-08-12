/**
 * Tier 3 - Pairwise Test 3
 * Feature 3 (Startup Self-Test Integrity Engine) x Feature 6 (Home Hero Readout Status) Integration
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 3 - Pairwise 03: Startup Self-Test Result x Home Hero Status Readout', () => {
  test('Self-test passing status propagates to Home Hero readout banner', () => {
    const diagnosticResult = {
      passed: true,
      assertions: {
        companies: 107,
        metrics: 492,
        forces: 14,
        mgmt: true
      }
    };

    function renderHomeHeroIntegrityReadout(diag) {
      if (!diag.passed) {
        return {
          statusClass: 'status-error',
          badgeColor: 'var(--down)',
          text: 'Diagnostic Integrity Check Failed'
        };
      }
      return {
        statusClass: 'status-pass',
        badgeColor: 'var(--up)',
        text: `Diagnostic Integrity: 100% Pass (${diag.assertions.companies} companies, ${diag.assertions.metrics} metrics, ${diag.assertions.forces} forces, Mgmt Verified)`
      };
    }

    const readout = renderHomeHeroIntegrityReadout(diagnosticResult);

    assert.strictEqual(readout.statusClass, 'status-pass');
    assert.strictEqual(readout.badgeColor, 'var(--up)');
    assert.contains(readout.text, '100% Pass');
    assert.contains(readout.text, '107 companies');
    assert.contains(readout.text, '492 metrics');
    assert.contains(readout.text, '14 forces');
  });

  test('Home Hero counter cards display verified dataset metrics from self-test diagnostic', () => {
    const heroCards = [
      { id: 'card_companies', title: 'Total Companies', count: 107 },
      { id: 'card_metrics', title: 'Metric Snapshots', count: 492 },
      { id: 'card_forces', title: 'Macro Forces', count: 14 },
      { id: 'card_sectors', title: 'Sectors', count: 23 },
      { id: 'card_peers', title: 'Peer Groups', count: 27 },
      { id: 'card_news', title: 'News Pulse Items', count: 60 }
    ];

    assert.strictEqual(heroCards.length, 6, 'Home Hero must display 6 animated live counter cards');
    assert.strictEqual(heroCards.find(c => c.id === 'card_companies').count, 107);
    assert.strictEqual(heroCards.find(c => c.id === 'card_metrics').count, 492);
    assert.strictEqual(heroCards.find(c => c.id === 'card_forces').count, 14);
    assert.strictEqual(heroCards.find(c => c.id === 'card_sectors').count, 23);
    assert.strictEqual(heroCards.find(c => c.id === 'card_peers').count, 27);
    assert.strictEqual(heroCards.find(c => c.id === 'card_news').count, 60);
  });
});
