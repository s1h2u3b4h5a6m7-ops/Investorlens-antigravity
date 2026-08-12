/**
 * InvestorLens Test Suite - In-Memory Execution Verification
 * Verifies that all test files load properly, 65 tests execute, and 100% pass.
 */

const path = require('path');
const { runner, Reporter, TestLoader } = require('./harness');

async function runVerification() {
  const loader = new TestLoader(path.resolve(__dirname));
  const testFiles = loader.discoverTiers(['tier1']);

  console.log(`Discovered ${testFiles.length} test files in tier1:`);
  testFiles.forEach(f => console.log(` - ${path.basename(f)}`));

  loader.loadTestFiles(testFiles);

  const results = await runner.runAll();

  const reporter = new Reporter({ useColors: false, verbose: true });
  reporter.report(results);

  console.log('\n--- VERIFICATION STATS ---');
  console.log(`Discovered files: ${testFiles.length}`);
  console.log(`Total tests run: ${results.totalTests}`);
  console.log(`Passed tests: ${results.passed}`);
  console.log(`Failed tests: ${results.failed}`);
  console.log(`Skipped tests: ${results.skipped}`);

  if (results.failed === 0 && results.totalTests >= 65) {
    console.log(`\n✅ VERIFICATION SUCCESS: All ${results.totalTests} Tier 1 tests passed 100% cleanly!`);
  } else {
    console.error(`\n❌ VERIFICATION FAILED: Total=${results.totalTests}, Passed=${results.passed}, Failed=${results.failed}`);
  }

  return results;
}

runVerification().catch(err => {
  console.error('Error running verification:', err);
});
