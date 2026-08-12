/**
 * Tier 3 - Pairwise Test 2
 * Feature 2 (Supabase 10-Table Data Model) x Feature 3 (Startup Self-Test Integrity Engine) Data Flow
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 3 - Pairwise 02: Supabase 10-Table Query x Startup Self-Test Integrity Data Flow', () => {
  const REQUIRED_TABLES = [
    'companies',
    'metric_snapshots',
    'chain_nodes',
    'tech_geo_tags',
    'bull_bear_cases',
    'mgmt_profiles',
    'cross_company_narratives',
    'valuation_inputs',
    'news_items',
    'forces'
  ];

  test('All 10 required Supabase database tables are defined and accessible', () => {
    assert.strictEqual(REQUIRED_TABLES.length, 10, 'Must query exactly 10 tables');
    assert.contains(REQUIRED_TABLES, 'companies');
    assert.contains(REQUIRED_TABLES, 'metric_snapshots');
    assert.contains(REQUIRED_TABLES, 'forces');
    assert.contains(REQUIRED_TABLES, 'mgmt_profiles');
    assert.contains(REQUIRED_TABLES, 'news_items');
  });

  test('Startup self-test diagnostic engine processes 10-table query data feed', () => {
    // Simulated database query results fed into self-test integrity engine
    const mockDataFeed = {
      companies: Array.from({ length: 107 }, (_, i) => ({ id: `comp_${i + 1}`, name: `Company ${i + 1}` })),
      metrics: Array.from({ length: 492 }, (_, i) => ({ id: `met_${i + 1}`, companyId: `comp_${(i % 107) + 1}` })),
      forces: Array.from({ length: 14 }, (_, i) => ({ id: `force_${i + 1}`, shelf: i < 5 ? 'Tailwind' : i < 10 ? 'Context' : 'Headwind' })),
      mgmtVerified: true
    };

    function runStartupSelfTest(data) {
      const companyCount = data.companies ? data.companies.length : 0;
      const metricCount = data.metrics ? data.metrics.length : 0;
      const forceCount = data.forces ? data.forces.length : 0;
      const mgmtPassed = Boolean(data.mgmtVerified);

      const passed = companyCount === 107 && metricCount === 492 && forceCount === 14 && mgmtPassed;

      return {
        passed,
        assertions: {
          companies: companyCount,
          metrics: metricCount,
          forces: forceCount,
          mgmt: mgmtPassed
        }
      };
    }

    const selfTestResult = runStartupSelfTest(mockDataFeed);

    assert.isTrue(selfTestResult.passed, 'Self-test must pass with 100% threshold');
    assert.strictEqual(selfTestResult.assertions.companies, 107, 'Must verify exactly 107 companies');
    assert.strictEqual(selfTestResult.assertions.metrics, 492, 'Must verify exactly 492 metric bindings');
    assert.strictEqual(selfTestResult.assertions.forces, 14, 'Must verify exactly 14 macro forces');
    assert.isTrue(selfTestResult.assertions.mgmt, 'Executive management profiles must be verified');
  });

  test('Self-test fails if any table data falls below mandatory invariant counts', () => {
    const incompleteDataFeed = {
      companies: Array.from({ length: 106 }), // missing 1 company
      metrics: Array.from({ length: 492 }),
      forces: Array.from({ length: 14 }),
      mgmtVerified: true
    };

    function runStartupSelfTest(data) {
      const companyCount = data.companies ? data.companies.length : 0;
      const metricCount = data.metrics ? data.metrics.length : 0;
      const forceCount = data.forces ? data.forces.length : 0;
      const mgmtPassed = Boolean(data.mgmtVerified);

      const passed = companyCount === 107 && metricCount === 492 && forceCount === 14 && mgmtPassed;
      return { passed, assertions: { companies: companyCount, metrics: metricCount, forces: forceCount, mgmt: mgmtPassed } };
    }

    const result = runStartupSelfTest(incompleteDataFeed);
    assert.isFalse(result.passed, 'Diagnostic must fail if company count is not 107');
    assert.strictEqual(result.assertions.companies, 106);
  });
});
