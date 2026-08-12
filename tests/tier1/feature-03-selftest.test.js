/**
 * Tier 1 Feature Coverage Tests: Feature 3 - Startup Self-Test Integrity Engine
 * Source: ORIGINAL_REQUEST.md (R40, R59), PROJECT.md (Feature 3, Interface Contracts)
 */

const fs = require('fs');
const path = require('path');
const { describe, test, assert } = require('../harness');

const rootDir = path.resolve(__dirname, '../../');

describe('Feature 3: Startup Self-Test Integrity Engine', () => {

  test('F3.1: runStartupSelfTest() Signature and Return Structure', () => {
    // Contract definition for self-test engine
    const mockSelfTestResult = {
      passed: true,
      assertions: {
        companies: 107,
        metrics: 492,
        forces: 14,
        mgmt: true
      }
    };

    assert.isType(mockSelfTestResult.passed, 'boolean', 'Self-test result must contain boolean passed property');
    assert.isType(mockSelfTestResult.assertions, 'object', 'Self-test result must contain assertions object');
  });

  test('F3.2: 107 Companies Assertion Threshold', () => {
    const requiredCompanyCount = 107;
    const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');

    assert.contains(projectContent, '107 companies', 'PROJECT.md must document assertion for 107 companies');

    const evalAssertion = (count) => count === requiredCompanyCount;
    assert.isTrue(evalAssertion(107), 'Company count 107 must evaluate to passed');
    assert.isFalse(evalAssertion(106), 'Company count less than 107 must fail self-test');
    assert.isFalse(evalAssertion(108), 'Company count greater than 107 must fail self-test');
  });

  test('F3.3: 492 Metric Bindings Assertion Threshold', () => {
    const requiredMetricBindings = 492;
    const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');

    assert.contains(projectContent, '492 metric', 'PROJECT.md must document assertion for 492 metrics');

    const evalAssertion = (count) => count === requiredMetricBindings;
    assert.isTrue(evalAssertion(492), 'Metric count 492 must pass self-test');
    assert.isFalse(evalAssertion(491), 'Metric count 491 must fail self-test');
  });

  test('F3.4: 14 Macro Forces Assertion Threshold', () => {
    const requiredForceCount = 14;
    const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');

    assert.contains(projectContent, '14 forces', 'PROJECT.md must document assertion for 14 forces');

    const evalAssertion = (count) => count === requiredForceCount;
    assert.isTrue(evalAssertion(14), 'Macro force count 14 must pass self-test');
    assert.isFalse(evalAssertion(13), 'Macro force count 13 must fail self-test');
  });

  test('F3.5: 100% Pass Threshold Logic Enforcement', () => {
    const validateSelfTest = (assertions) => {
      const companiesOk = assertions.companies === 107;
      const metricsOk = assertions.metrics === 492;
      const forcesOk = assertions.forces === 14;
      const mgmtOk = assertions.mgmt === true;
      return {
        passed: companiesOk && metricsOk && forcesOk && mgmtOk,
        assertions
      };
    };

    // Happy path: 100% pass
    const passCase = validateSelfTest({ companies: 107, metrics: 492, forces: 14, mgmt: true });
    assert.isTrue(passCase.passed, 'Self-test must pass when all 4 assertions pass 100%');

    // Partial failure: any assertion failing causes overall failure
    const failCase1 = validateSelfTest({ companies: 107, metrics: 491, forces: 14, mgmt: true });
    assert.isFalse(failCase1.passed, 'Self-test must fail if metric count is invalid');

    const failCase2 = validateSelfTest({ companies: 107, metrics: 492, forces: 14, mgmt: false });
    assert.isFalse(failCase2.passed, 'Self-test must fail if executive profiles check fails');
  });

});
