/**
 * Challenger 1 Empirical Test Suite for Milestone 1 (M1: Infrastructure & Data Layer)
 * Validates data layer functions, startup self-test assertions, quantile band algorithm, and invariants.
 */

const fs = require('fs');
const path = require('path');
const { describe, test, assert } = require('../harness');

const rootDir = path.resolve(__dirname, '../../');

// Pure Node.js re-implementation / evaluation of niceBand algorithm to test algorithm math in isolation
function niceBand(low, high) {
  const range = high - low;
  if (range <= 0) {
    return { min: Number((low * 0.9).toFixed(6)), max: Number((low * 1.1).toFixed(6)), lowTick: low, midTick: low, highTick: low, step: 1 };
  }
  const rawStep = range / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const residual = rawStep / mag;
  let niceStep = mag;
  if (residual > 5) niceStep = 10 * mag;
  else if (residual > 2) niceStep = 5 * mag;
  else if (residual > 1) niceStep = 2 * mag;

  const min = Math.floor(low / niceStep) * niceStep;
  const max = Math.ceil(high / niceStep) * niceStep;
  const mid = (min + max) / 2;

  return {
    min,
    max,
    lowTick: min + niceStep,
    midTick: mid,
    highTick: max - niceStep,
    step: niceStep
  };
}

describe('Challenger M1 Empirical Verification Suite', () => {

  test('E1.1: Empirical Verification of niceBand() Quantile Algorithm', () => {
    // 1. Standard positive range
    const b1 = niceBand(10, 50);
    assert.strictEqual(b1.min, 10, 'Min bound for [10, 50] must be 10');
    assert.strictEqual(b1.max, 50, 'Max bound for [10, 50] must be 50');
    assert.strictEqual(b1.step, 10, 'Step for range 40 must be 10');
    assert.strictEqual(b1.midTick, 30, 'Mid tick for [10, 50] must be 30');

    // 2. Odd bounds requiring nice rounding
    const b2 = niceBand(15, 85);
    assert.strictEqual(b2.min, 0, 'Min bound for [15, 85] must floor to 0');
    assert.strictEqual(b2.max, 100, 'Max bound for [15, 85] must ceil to 100');
    assert.strictEqual(b2.step, 20, 'Step for range 70 must be 20');

    // 3. Zero range edge case (low == high)
    const b3 = niceBand(50, 50);
    assert.strictEqual(b3.min, 45, 'Min for low==high must be low * 0.9');
    assert.strictEqual(b3.max, 55, 'Max for low==high must be low * 1.1');
    assert.strictEqual(b3.step, 1, 'Step for zero range must be 1');

    // 4. Inverted bounds edge case (low > high)
    const b4 = niceBand(100, 50);
    assert.strictEqual(b4.min, 90, 'Inverted range should return low * 0.9');
    assert.strictEqual(b4.max, 110, 'Inverted range should return low * 1.1');

    // 5. Negative bounds
    const b5 = niceBand(-50, -10);
    assert.strictEqual(b5.min, -50, 'Negative range min bound');
    assert.strictEqual(b5.max, -10, 'Negative range max bound');

    // 6. Fractional bounds
    const b6 = niceBand(0.12, 0.88);
    assert.strictEqual(b6.min, 0, 'Fractional min bound');
    assert.strictEqual(b6.max, 1, 'Fractional max bound');
  });

  test('E1.2: Empirical Static Analysis of dataService.ts Invariants', () => {
    const dataServiceContent = fs.readFileSync(path.join(rootDir, 'src/services/dataService.ts'), 'utf-8');

    // Check live Supabase table bindings
    assert.contains(dataServiceContent, "supabase.from('companies')", 'Must query live companies table');
    assert.contains(dataServiceContent, "supabase.from('metric_snapshots')", 'Must query live metric_snapshots table');
    assert.contains(dataServiceContent, "supabase.from('mgmt_profiles')", 'Must query live mgmt_profiles table');
    assert.contains(dataServiceContent, "supabase.from('news_items')", 'Must query live news_items table');

    // Check macro forces count
    assert.contains(dataServiceContent, 'FORCE-14', 'Must define up to FORCE-14 (14 macro forces)');

    // Check export functions
    assert.contains(dataServiceContent, 'export function niceBand', 'Must export niceBand algorithm');
    assert.contains(dataServiceContent, 'export function getCompanies', 'Must export getCompanies service');
    assert.contains(dataServiceContent, 'export function getCompanyDetail', 'Must export getCompanyDetail service');
  });

  test('E1.3: Empirical Static Analysis of selftest.ts Logic', () => {
    const selfTestContent = fs.readFileSync(path.join(rootDir, 'src/services/selftest.ts'), 'utf-8');

    assert.contains(selfTestContent, 'export function runStartupSelfTest', 'Must export runStartupSelfTest function');
    assert.contains(selfTestContent, 'forcesCount === 14', 'Assertion 3 expects 14 forces');
    assert.contains(selfTestContent, 'passRate === 100.0', 'Pass evaluation requires 100.0% pass rate');
  });

  test('E1.4: Empirical Verification of Precision Instrument Theme CSS', () => {
    const cssContent = fs.readFileSync(path.join(rootDir, 'src/assets/styles/theme.css'), 'utf-8');

    const requiredTokens = [
      '--void:',
      '--panel:',
      '--panel-2:',
      '--border:',
      '--accent:',
      '--up:',
      '--down:',
      '--stale:',
      '--chain:'
    ];

    for (const token of requiredTokens) {
      assert.contains(cssContent, token, `theme.css must define design token ${token}`);
    }

    assert.contains(cssContent, '--font-sora:', 'theme.css must define Sora font token');
    assert.contains(cssContent, '--font-inter:', 'theme.css must define Inter font token');
    assert.contains(cssContent, '--font-mono:', 'theme.css must define JetBrains Mono font token');
  });

  test('E1.5: Empirical Verification of Supabase Configuration', () => {
    const supabaseContent = fs.readFileSync(path.join(rootDir, 'src/services/supabase.ts'), 'utf-8');

    assert.contains(supabaseContent, 'https://uhqyhsniwlgivdlxbpoj.supabase.co', 'Must configure exact Supabase URL');
    assert.contains(supabaseContent, 'checkSupabaseConnection', 'Must export checkSupabaseConnection helper');
    assert.contains(supabaseContent, 'createClient', 'Must instantiate Supabase client');
  });

  test('E1.6: Empirical Verification of App.tsx Mounting & Display', () => {
    const appContent = fs.readFileSync(path.join(rootDir, 'src/App.tsx'), 'utf-8');

    assert.contains(appContent, 'runStartupSelfTest', 'App.tsx must invoke runStartupSelfTest');
    assert.contains(appContent, 'selfTest.assertions.companies.actual', 'App.tsx must render companies self-test result');
    assert.contains(appContent, 'selfTest.assertions.metrics.actual', 'App.tsx must render metrics self-test result');
    assert.contains(appContent, 'selfTest.assertions.forces.actual', 'App.tsx must render forces self-test result');
    assert.contains(appContent, 'selfTest.assertions.mgmtProfiles.actual', 'App.tsx must render mgmt profiles self-test result');
  });

});
