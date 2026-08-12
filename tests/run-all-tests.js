#!/usr/bin/env node

/**
 * InvestorLens - Master Test Runner CLI
 * Discovers and runs test suites across Tier 1, Tier 2, Tier 3, Tier 4.
 *
 * Usage:
 *   node tests/run-all-tests.js
 *   node tests/run-all-tests.js --tier=tier1
 *   node tests/run-all-tests.js --tier=tier1,tier2
 *   node tests/run-all-tests.js --filter=feature-01
 *   node tests/run-all-tests.js --verbose
 */

const path = require('path');
const { runner, Reporter, TestLoader } = require('./harness');

async function main() {
  const args = process.argv.slice(2);
  let tierFilter = null;
  let nameFilter = null;
  let verbose = false;
  let useColors = true;

  for (const arg of args) {
    if (arg.startsWith('--tier=')) {
      tierFilter = arg.split('=')[1].split(',');
    } else if (arg.startsWith('--filter=')) {
      nameFilter = arg.split('=')[1];
    } else if (arg === '--verbose') {
      verbose = true;
    } else if (arg === '--no-color') {
      useColors = false;
    }
  }

  const loader = new TestLoader(path.resolve(__dirname));
  let testFiles = loader.discoverTiers(tierFilter);

  if (nameFilter) {
    testFiles = testFiles.filter(f => f.includes(nameFilter));
  }

  if (testFiles.length === 0) {
    console.log('\n[InvestorLens Test Runner] No test files found matching criteria.');
    process.exit(0);
  }

  console.log(`\n[InvestorLens Test Runner] Discovered ${testFiles.length} test suite file(s). Loading...`);
  loader.loadTestFiles(testFiles);

  const results = await runner.runAll();

  const reporter = new Reporter({ useColors, verbose });
  reporter.report(results);

  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error during test execution:', err);
  process.exit(1);
});
