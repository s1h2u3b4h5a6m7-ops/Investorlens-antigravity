/**
 * InvestorLens Test Harness - Core Runner
 * Manages suite execution, hooks, timing, and error capturing.
 */

class TestRunner {
  constructor() {
    this.suites = [];
    this.currentSuite = null;
    this.results = {
      totalSuites: 0,
      totalTests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      durationMs: 0,
      suiteResults: []
    };
  }

  reset() {
    this.suites = [];
    this.currentSuite = null;
    this.results = {
      totalSuites: 0,
      totalTests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      durationMs: 0,
      suiteResults: []
    };
  }

  describe(name, fn) {
    const parentSuite = this.currentSuite;
    const suite = {
      name,
      parent: parentSuite,
      tests: [],
      beforeEach: [],
      afterEach: [],
      beforeAll: [],
      afterAll: [],
      file: this.currentFile || 'unknown'
    };

    if (parentSuite) {
      parentSuite.suites = parentSuite.suites || [];
      parentSuite.suites.push(suite);
    } else {
      this.suites.push(suite);
    }

    this.currentSuite = suite;
    try {
      fn();
    } finally {
      this.currentSuite = parentSuite;
    }
  }

  test(name, fn, options = {}) {
    if (!this.currentSuite) {
      // Auto-wrap top-level test in an anonymous suite
      this.describe('Global', () => {
        this.test(name, fn, options);
      });
      return;
    }

    this.currentSuite.tests.push({
      name,
      fn,
      skip: options.skip || false,
      only: options.only || false,
      suite: this.currentSuite
    });
  }

  it(name, fn, options = {}) {
    this.test(name, fn, options);
  }

  beforeEach(fn) {
    if (this.currentSuite) {
      this.currentSuite.beforeEach.push(fn);
    }
  }

  afterEach(fn) {
    if (this.currentSuite) {
      this.currentSuite.afterEach.push(fn);
    }
  }

  beforeAll(fn) {
    if (this.currentSuite) {
      this.currentSuite.beforeAll.push(fn);
    }
  }

  afterAll(fn) {
    if (this.currentSuite) {
      this.currentSuite.afterAll.push(fn);
    }
  }

  async runSuite(suite) {
    const suiteResult = {
      name: suite.name,
      file: suite.file,
      passed: 0,
      failed: 0,
      skipped: 0,
      tests: [],
      durationMs: 0
    };

    const suiteStartTime = Date.now();

    // Run beforeAll hooks
    for (const hook of suite.beforeAll) {
      try {
        await hook();
      } catch (err) {
        // If beforeAll fails, fail all tests in suite
        for (const testCase of suite.tests) {
          suiteResult.failed++;
          suiteResult.tests.push({
            name: testCase.name,
            status: 'failed',
            error: new Error(`beforeAll hook failed: ${err.message}`),
            durationMs: 0
          });
        }
        suiteResult.durationMs = Date.now() - suiteStartTime;
        return suiteResult;
      }
    }

    // Run tests
    for (const testCase of suite.tests) {
      if (testCase.skip) {
        suiteResult.skipped++;
        suiteResult.tests.push({
          name: testCase.name,
          status: 'skipped',
          error: null,
          durationMs: 0
        });
        continue;
      }

      const testStartTime = Date.now();
      let testError = null;

      // Run beforeEach hooks
      let hooksFailed = false;
      for (const hook of suite.beforeEach) {
        try {
          await hook();
        } catch (err) {
          hooksFailed = true;
          testError = new Error(`beforeEach hook failed: ${err.message}`);
          break;
        }
      }

      if (!hooksFailed && testCase.fn) {
        try {
          await testCase.fn();
        } catch (err) {
          testError = err;
        }
      }

      // Run afterEach hooks
      for (const hook of suite.afterEach) {
        try {
          await hook();
        } catch (err) {
          if (!testError) {
            testError = new Error(`afterEach hook failed: ${err.message}`);
          }
        }
      }

      const testDuration = Date.now() - testStartTime;
      if (testError) {
        suiteResult.failed++;
        suiteResult.tests.push({
          name: testCase.name,
          status: 'failed',
          error: testError,
          durationMs: testDuration
        });
      } else {
        suiteResult.passed++;
        suiteResult.tests.push({
          name: testCase.name,
          status: 'passed',
          error: null,
          durationMs: testDuration
        });
      }
    }

    // Run afterAll hooks
    for (const hook of suite.afterAll) {
      try {
        await hook();
      } catch (err) {
        // Log afterAll error
      }
    }

    // Process nested child suites if any
    if (suite.suites && suite.suites.length > 0) {
      for (const childSuite of suite.suites) {
        const childResult = await this.runSuite(childSuite);
        suiteResult.passed += childResult.passed;
        suiteResult.failed += childResult.failed;
        suiteResult.skipped += childResult.skipped;
        suiteResult.tests.push(...childResult.tests);
      }
    }

    suiteResult.durationMs = Date.now() - suiteStartTime;
    return suiteResult;
  }

  async runAll() {
    const startTime = Date.now();
    this.results.totalSuites = this.suites.length;

    for (const suite of this.suites) {
      const suiteResult = await this.runSuite(suite);
      this.results.suiteResults.push(suiteResult);
      this.results.totalTests += suiteResult.tests.length;
      this.results.passed += suiteResult.passed;
      this.results.failed += suiteResult.failed;
      this.results.skipped += suiteResult.skipped;
    }

    this.results.durationMs = Date.now() - startTime;
    return this.results;
  }
}

const globalRunner = new TestRunner();

module.exports = {
  runner: globalRunner,
  describe: (name, fn) => globalRunner.describe(name, fn),
  test: (name, fn, options) => globalRunner.test(name, fn, options),
  it: (name, fn, options) => globalRunner.it(name, fn, options),
  beforeEach: (fn) => globalRunner.beforeEach(fn),
  afterEach: (fn) => globalRunner.afterEach(fn),
  beforeAll: (fn) => globalRunner.beforeAll(fn),
  afterAll: (fn) => globalRunner.afterAll(fn)
};
