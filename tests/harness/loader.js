/**
 * InvestorLens Test Harness - Dynamic Test Suite Loader
 * Discovers test files matching pattern tests/tier* / ** / *.test.js across all tiers.
 */

const fs = require('fs');
const path = require('path');
const { runner } = require('./runner');

class TestLoader {
  constructor(baseDir) {
    this.baseDir = baseDir || path.resolve(__dirname, '..');
  }

  findTestFiles(dir, pattern = /\.test\.(js|cjs)$/) {
    let results = [];
    if (!fs.existsSync(dir)) return results;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results = results.concat(this.findTestFiles(fullPath, pattern));
      } else if (entry.isFile() && pattern.test(entry.name)) {
        results.push(fullPath);
      }
    }

    return results;
  }

  discoverTiers(tiersFilter = null) {
    const tierDirs = ['tier1', 'tier2', 'tier3', 'tier4'];
    let files = [];

    for (const tier of tierDirs) {
      if (tiersFilter && !tiersFilter.includes(tier)) {
        continue;
      }

      const tierPath = path.join(this.baseDir, tier);
      if (fs.existsSync(tierPath)) {
        const found = this.findTestFiles(tierPath);
        // Sort files for consistent execution order
        found.sort();
        files = files.concat(found);
      }
    }

    return files;
  }

  loadTestFiles(filePaths) {
    const loadedSuites = [];

    for (const filePath of filePaths) {
      runner.currentFile = path.relative(path.resolve(__dirname, '../..'), filePath);
      try {
        // Clear require cache for fresh load if needed
        delete require.cache[require.resolve(filePath)];
        require(filePath);
        loadedSuites.push(filePath);
      } catch (err) {
        console.error(`Error loading test file ${filePath}:`, err);
        throw err;
      }
    }

    return loadedSuites;
  }
}

module.exports = TestLoader;
