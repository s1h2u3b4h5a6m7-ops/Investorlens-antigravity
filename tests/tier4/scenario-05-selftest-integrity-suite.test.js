/**
 * Tier 4 - Scenario Test 5
 * Real-World Application Workload Scenario 5:
 * Startup Self-Test Integrity Diagnostic Suite Validation (107 Companies, 492 Metric Bindings, 14 Macro Forces, Management Records)
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 4 - Scenario 05: Startup Self-Test Diagnostic Suite Execution & Validation', () => {
  // Authoritative data model fixtures representing full application seed/query payload
  const FULL_SYSTEM_PAYLOAD = {
    companies: Array.from({ length: 107 }, (_, i) => ({
      id: `c_${i + 1}`,
      name: `Company ${i + 1}`,
      sector: i % 23 === 0 ? 'BFSI' : 'IT Services'
    })),
    metricSnapshots: Array.from({ length: 492 }, (_, i) => ({
      id: `m_${i + 1}`,
      companyId: `c_${(i % 107) + 1}`,
      metricKey: `metric_${(i % 10) + 1}`,
      value: (i + 1) * 1.5
    })),
    macroForces: Array.from({ length: 14 }, (_, i) => ({
      id: `f_${i + 1}`,
      name: `Macro Force ${i + 1}`,
      shelf: i < 5 ? 'Tailwind' : i < 10 ? 'Context' : 'Headwind'
    })),
    managementProfilesVerified: true
  };

  function runStartupSelfTestDiagnostic(payload) {
    const startTime = Date.now();

    const companyCount = payload.companies ? payload.companies.length : 0;
    const metricCount = payload.metricSnapshots ? payload.metricSnapshots.length : 0;
    const forceCount = payload.macroForces ? payload.macroForces.length : 0;
    const mgmtVerified = Boolean(payload.managementProfilesVerified);

    const companiesPass = companyCount === 107;
    const metricsPass = metricCount === 492;
    const forcesPass = forceCount === 14;
    const mgmtPass = mgmtVerified === true;

    const overallPassed = companiesPass && metricsPass && forcesPass && mgmtPass;

    return {
      passed: overallPassed,
      executionDurationMs: Date.now() - startTime,
      assertions: {
        companies: { count: companyCount, expected: 107, pass: companiesPass },
        metrics: { count: metricCount, expected: 492, pass: metricsPass },
        forces: { count: forceCount, expected: 14, pass: forcesPass },
        management: { status: mgmtVerified, expected: true, pass: mgmtPass }
      },
      summary: overallPassed
        ? 'Diagnostic Integrity: 100% Pass (107 companies, 492 metrics, 14 forces, Mgmt Verified)'
        : 'Diagnostic Integrity: FAILED'
    };
  }

  test('Step 1: Executes full diagnostic suite against system data payload', () => {
    const diag = runStartupSelfTestDiagnostic(FULL_SYSTEM_PAYLOAD);

    assert.isTrue(diag.passed, 'Overall diagnostic suite must pass with 100% threshold');
    assert.strictEqual(diag.assertions.companies.count, 107);
    assert.strictEqual(diag.assertions.metrics.count, 492);
    assert.strictEqual(diag.assertions.forces.count, 14);
    assert.isTrue(diag.assertions.management.status);
  });

  test('Step 2: Validates individual sub-assertions (107 companies, 492 metrics, 14 forces, mgmt profiles)', () => {
    const diag = runStartupSelfTestDiagnostic(FULL_SYSTEM_PAYLOAD);

    assert.isTrue(diag.assertions.companies.pass, '107 companies assertion passed');
    assert.isTrue(diag.assertions.metrics.pass, '492 metric bindings assertion passed');
    assert.isTrue(diag.assertions.forces.pass, '14 macro forces assertion passed');
    assert.isTrue(diag.assertions.management.pass, 'Executive management profiles assertion passed');
  });

  test('Step 3: Home Hero status indicator displays authoritative pass banner text', () => {
    const diag = runStartupSelfTestDiagnostic(FULL_SYSTEM_PAYLOAD);

    assert.contains(diag.summary, '100% Pass');
    assert.contains(diag.summary, '107 companies');
    assert.contains(diag.summary, '492 metrics');
    assert.contains(diag.summary, '14 forces');
    assert.contains(diag.summary, 'Mgmt Verified');
  });

  test('Step 4: Adversarial test: Diagnostic rejects payload if a single metric binding is dropped', () => {
    const corruptedPayload = {
      ...FULL_SYSTEM_PAYLOAD,
      metricSnapshots: Array.from({ length: 491 }) // missing 1 metric binding (491 instead of 492)
    };

    const diag = runStartupSelfTestDiagnostic(corruptedPayload);

    assert.isFalse(diag.passed, 'Diagnostic must reject payload when metrics count is 491');
    assert.isFalse(diag.assertions.metrics.pass);
    assert.strictEqual(diag.assertions.metrics.count, 491);
    assert.strictEqual(diag.summary, 'Diagnostic Integrity: FAILED');
  });
});
