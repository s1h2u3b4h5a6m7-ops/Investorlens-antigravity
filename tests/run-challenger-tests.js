const fs = require('fs');
const path = require('path');
const { runner, TestLoader } = require('./harness');

async function run() {
  const loader = new TestLoader(path.resolve(__dirname));
  const testFiles = loader.discoverTiers(['tier1', 'tier2']);

  console.log(`Discovered ${testFiles.length} test files. Running...`);
  loader.loadTestFiles(testFiles);

  const results = await runner.runAll();

  const reportPath = path.resolve(__dirname, '../.agents/challenger_m1_1/test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  console.log(`Test Execution Complete: ${results.passed} passed, ${results.failed} failed, total ${results.total}`);
}

run().catch(err => {
  console.error('Test execution error:', err);
});
