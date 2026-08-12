/**
 * Feature 3 Tier 2 Boundary & Corner Case Tests
 * Focus: Partial data mismatches, zero metrics, single company edge cases, missing forces threshold, malformed profiles
 */

const { describe, test } = require('../harness/runner.js');
const assert = require('../harness/assert.js');

describe('Feature 3 Boundary: Startup Self-Test Integrity Engine', () => {

  const runDiagnosticCheck = (dataset) => {
    const { companies = [], metrics = [], forces = [], mgmtProfiles = [] } = dataset;
    const errors = [];

    if (companies.length !== 107) {
      errors.push(`Company count mismatch: expected 107, got ${companies.length}`);
    }
    if (metrics.length !== 492) {
      errors.push(`Metric count mismatch: expected 492, got ${metrics.length}`);
    }
    if (forces.length !== 14) {
      errors.push(`Forces count mismatch: expected 14, got ${forces.length}`);
    }
    const validMgmt = mgmtProfiles.filter(p => p && p.company_id && p.name && p.designation);
    if (validMgmt.length === 0 && mgmtProfiles.length > 0) {
      errors.push(`Executive profiles malformed or invalid`);
    }

    return {
      passed: errors.length === 0,
      assertions: {
        companies: companies.length,
        metrics: metrics.length,
        forces: forces.length,
        mgmtValid: validMgmt.length > 0
      },
      errors
    };
  };

  test('F3-B1: partial data mismatch assertion failure', () => {
    // Truncated datasets
    const partialDataset = {
      companies: new Array(100).fill({ id: 'comp' }), // Only 100 instead of 107
      metrics: new Array(492).fill({ id: 'met' }),
      forces: new Array(14).fill({ id: 'force' }),
      mgmtProfiles: [{ company_id: 'c1', name: 'CEO', designation: 'Chief' }]
    };

    const res = runDiagnosticCheck(partialDataset);
    assert.isFalse(res.passed, 'Self-test must fail on company count mismatch');
    assert.strictEqual(res.assertions.companies, 100);
    assert.contains(res.errors[0], 'Company count mismatch');
  });

  test('F3-B2: zero metrics binding diagnostic handling', () => {
    const zeroMetricsDataset = {
      companies: new Array(107).fill({ id: 'comp' }),
      metrics: [], // 0 metrics
      forces: new Array(14).fill({ id: 'force' }),
      mgmtProfiles: [{ company_id: 'c1', name: 'CEO', designation: 'Chief' }]
    };

    const res = runDiagnosticCheck(zeroMetricsDataset);
    assert.isFalse(res.passed);
    assert.strictEqual(res.assertions.metrics, 0);
    assert.ok(res.errors.some(e => e.includes('Metric count mismatch')));
  });

  test('F3-B3: single company edge cases in self-test dataset', () => {
    const singleCompanyDataset = {
      companies: [{ id: 'single_co' }],
      metrics: [{ id: 'm1' }],
      forces: [{ id: 'f1' }],
      mgmtProfiles: [{ company_id: 'single_co', name: 'CEO', designation: 'Chief Exec' }]
    };

    const res = runDiagnosticCheck(singleCompanyDataset);
    assert.isFalse(res.passed);
    assert.strictEqual(res.errors.length, 3); // company count, metrics count, forces count all fail
  });

  test('F3-B4: missing forces threshold assertion failure', () => {
    const missingForcesDataset = {
      companies: new Array(107).fill({ id: 'comp' }),
      metrics: new Array(492).fill({ id: 'met' }),
      forces: new Array(12).fill({ id: 'force' }), // 12 instead of 14
      mgmtProfiles: [{ company_id: 'c1', name: 'CEO', designation: 'Chief' }]
    };

    const res = runDiagnosticCheck(missingForcesDataset);
    assert.isFalse(res.passed);
    assert.strictEqual(res.assertions.forces, 12);
    assert.ok(res.errors.some(e => e.includes('Forces count mismatch')));
  });

  test('F3-B5: malformed management profile handling', () => {
    const badMgmtDataset = {
      companies: new Array(107).fill({ id: 'comp' }),
      metrics: new Array(492).fill({ id: 'met' }),
      forces: new Array(14).fill({ id: 'force' }),
      mgmtProfiles: [{ company_id: null, name: '', designation: undefined }] // corrupt profile
    };

    const res = runDiagnosticCheck(badMgmtDataset);
    assert.isFalse(res.passed);
    assert.isFalse(res.assertions.mgmtValid);
    assert.ok(res.errors.some(e => e.includes('Executive profiles malformed')));
  });

});
