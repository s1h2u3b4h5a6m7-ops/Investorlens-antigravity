/**
 * InvestorLens Tier 2 Suite Index
 * Imports and executes all 65 Boundary & Corner Case Tests (Features 1-13).
 */

const { runner } = require('../harness/runner.js');

// Import all 13 Feature Boundary Test Files
require('./feature01_infra_boundary.test.js');
require('./feature02_supabase_boundary.test.js');
require('./feature03_selftest_boundary.test.js');
require('./feature04_legacy_retirement_boundary.test.js');
require('./feature05_ui2_bezel_boundary.test.js');
require('./feature06_home_hero_boundary.test.js');
require('./feature07_freshness_boundary.test.js');
require('./feature08_company_reader_boundary.test.js');
require('./feature09_digest_niceband_boundary.test.js');
require('./feature10_sectors_ledger_boundary.test.js');
require('./feature11_forces_explorer_boundary.test.js');
require('./feature12_compare_matrix_boundary.test.js');
require('./feature13_build_health_boundary.test.js');

async function runTier2() {
  console.log('====================================================');
  console.log('  RUNNING TIER 2: BOUNDARY & CORNER CASE TEST SUITE  ');
  console.log('====================================================\n');

  const results = await runner.runAll();

  console.log('\n----------------------------------------------------');
  console.log(`Suites executed : ${results.totalSuites}`);
  console.log(`Total tests     : ${results.totalTests}`);
  console.log(`Passed          : ${results.passed}`);
  console.log(`Failed          : ${results.failed}`);
  console.log(`Skipped         : ${results.skipped}`);
  console.log(`Duration        : ${results.durationMs}ms`);
  console.log('----------------------------------------------------');

  if (results.failed > 0) {
    console.error('\n❌ TIER 2 SUITE FAILED with ' + results.failed + ' failing test(s).');
    process.exitCode = 1;
  } else {
    console.log('\n✅ ALL TIER 2 TESTS PASSED 100%!');
    process.exitCode = 0;
  }

  return results;
}

if (require.main === module) {
  runTier2();
}

module.exports = {
  runTier2,
  runner
};
