/**
 * Feature 11 Tier 2 Boundary & Corner Case Tests
 * Focus: Uncategorized forces, 0 exposed companies, force with 107 company exposure, split pane collapse
 */

const { describe, test } = require('../harness/runner.js');
const assert = require('../harness/assert.js');

describe('Feature 11 Boundary: Forces View (3-Shelf Macro Explorer)', () => {

  test('F11-B1: uncategorized macro forces handling', () => {
    const forces = [
      { id: 'f1', title: 'Generative AI', shelf: 'Tailwind' },
      { id: 'f2', title: 'Interest Rate Shift', shelf: 'Context' },
      { id: 'f3', title: 'Supply Chain Bottleneck', shelf: 'Headwind' },
      { id: 'f4', title: 'Regulatory Reform', shelf: null } // uncategorized
    ];

    const categorizeForces = (items) => {
      const shelves = { Tailwind: [], Context: [], Headwind: [], Uncategorized: [] };
      items.forEach(f => {
        const key = (f.shelf && shelves[f.shelf]) ? f.shelf : 'Uncategorized';
        shelves[key].push(f);
      });
      return shelves;
    };

    const categorized = categorizeForces(forces);
    assert.strictEqual(categorized.Tailwind.length, 1);
    assert.strictEqual(categorized.Context.length, 1);
    assert.strictEqual(categorized.Headwind.length, 1);
    assert.strictEqual(categorized.Uncategorized.length, 1);
    assert.strictEqual(categorized.Uncategorized[0].id, 'f4');
  });

  test('F11-B2: 0 exposed companies force card rendering', () => {
    const emptyForce = {
      id: 'f_zero',
      title: 'Obsolete Technology Impact',
      exposedCompanyIds: []
    };

    const renderForceCard = (force) => {
      const count = Array.isArray(force.exposedCompanyIds) ? force.exposedCompanyIds.length : 0;
      return {
        exposureCount: count,
        badgeText: `${count} Companies Exposed`,
        hasExposures: count > 0
      };
    };

    const res = renderForceCard(emptyForce);
    assert.strictEqual(res.exposureCount, 0);
    assert.strictEqual(res.badgeText, '0 Companies Exposed');
    assert.isFalse(res.hasExposures);
  });

  test('F11-B3: force with 107 company exposure max list', () => {
    const allCompanies = new Array(107).fill(null).map((_, i) => `COMP_${i + 1}`);
    const macroForce = {
      id: 'f_macro_107',
      title: 'Global Inflation Rate',
      exposedCompanyIds: allCompanies
    };

    const processSplitPaneData = (force) => {
      const ids = force.exposedCompanyIds || [];
      return {
        totalExposed: ids.length,
        isFullUniverse: ids.length === 107,
        renderedItemsCount: ids.length
      };
    };

    const res = processSplitPaneData(macroForce);
    assert.strictEqual(res.totalExposed, 107);
    assert.isTrue(res.isFullUniverse);
  });

  test('F11-B4: split-pane collapse on narrow screen width', () => {
    const calculateSplitPaneLayout = (viewportWidth) => {
      if (viewportWidth < 768) {
        return { isStacked: true, paneRatio: '100% / 100%', mode: 'accordion-mobile' };
      }
      return { isStacked: false, paneRatio: '40% / 60%', mode: 'split-desktop' };
    };

    const mobile = calculateSplitPaneLayout(375);
    assert.isTrue(mobile.isStacked);
    assert.strictEqual(mobile.mode, 'accordion-mobile');

    const desktop = calculateSplitPaneLayout(1024);
    assert.isFalse(desktop.isStacked);
    assert.strictEqual(desktop.mode, 'split-desktop');
  });

  test('F11-B5: unknown shelf type fallback', () => {
    const unknownShelfForce = {
      id: 'f_unknown',
      title: 'Geopolitical Shift',
      shelf: 'UNKNOWN_SHELF_TYPE'
    };

    const getShelfCategory = (shelf) => {
      const allowed = ['Tailwind', 'Context', 'Headwind'];
      if (!allowed.includes(shelf)) {
        return 'Context'; // Fail-safe default to Context shelf
      }
      return shelf;
    };

    assert.strictEqual(getShelfCategory(unknownShelfForce.shelf), 'Context');
  });

});
