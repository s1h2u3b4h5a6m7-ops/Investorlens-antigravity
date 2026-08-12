/**
 * InvestorLens Test Harness - Reporter
 * Formats suite and test results with clean terminal output.
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m'
};

class Reporter {
  constructor(options = {}) {
    this.useColors = options.useColors !== undefined ? options.useColors : true;
    this.verbose = options.verbose || false;
  }

  c(color, text) {
    if (!this.useColors) return text;
    return `${colors[color] || ''}${text}${colors.reset}`;
  }

  report(results) {
    console.log('\n' + '='.repeat(70));
    console.log(this.c('bright', this.c('cyan', '  INVESTORLENS TEST SUITE RUNNER')));
    console.log('='.repeat(70) + '\n');

    let suiteCount = 0;
    const errorsToPrint = [];

    for (const suiteResult of results.suiteResults) {
      suiteCount++;
      const hasFailures = suiteResult.failed > 0;
      const statusSymbol = hasFailures ? this.c('red', '✖') : this.c('green', '✔');
      const suiteTitle = `${statusSymbol} ${this.c('bright', suiteResult.name)} ${this.c('dim', `(${suiteResult.durationMs}ms)`)}`;
      
      console.log(`\n[Suite ${suiteCount}/${results.suiteResults.length}] ${suiteTitle}`);
      if (suiteResult.file && suiteResult.file !== 'unknown') {
        console.log(`  File: ${this.c('dim', suiteResult.file)}`);
      }

      for (const test of suiteResult.tests) {
        if (test.status === 'passed') {
          console.log(`  ${this.c('green', '  ✓')} ${test.name} ${this.c('dim', `(${test.durationMs}ms)`)}`);
        } else if (test.status === 'skipped') {
          console.log(`  ${this.c('yellow', '  -')} ${test.name} ${this.c('dim', '(skipped)')}`);
        } else if (test.status === 'failed') {
          console.log(`  ${this.c('red', '  ✗')} ${this.c('bright', this.c('red', test.name))} ${this.c('dim', `(${test.durationMs}ms)`)}`);
          errorsToPrint.push({
            suiteName: suiteResult.name,
            testName: test.name,
            error: test.error
          });
        }
      }
    }

    if (errorsToPrint.length > 0) {
      console.log('\n' + '-'.repeat(70));
      console.log(this.c('bright', this.c('red', '  FAILURE DETAILS')));
      console.log('-'.repeat(70));

      errorsToPrint.forEach((item, index) => {
        console.log(`\n${index + 1}) ${item.suiteName} > ${item.testName}`);
        if (item.error) {
          console.log(`   ${this.c('red', item.error.message || String(item.error))}`);
          if (item.error.actual !== undefined || item.error.expected !== undefined) {
            console.log(`   ${this.c('dim', 'Actual:')}   ${JSON.stringify(item.error.actual)}`);
            console.log(`   ${this.c('dim', 'Expected:')} ${JSON.stringify(item.error.expected)}`);
          }
          if (item.error.stack) {
            const stackLines = item.error.stack.split('\n').slice(1, 6);
            console.log(`   ${this.c('dim', 'Stack trace:')}`);
            stackLines.forEach(line => console.log(`     ${this.c('dim', line.trim())}`));
          }
        }
      });
    }

    console.log('\n' + '='.repeat(70));
    console.log(this.c('bright', '  SUMMARY REPORT'));
    console.log('='.repeat(70));

    console.log(`  Suites:   ${results.suiteResults.length} total`);
    console.log(`  Tests:    ${results.totalTests} total | ` +
      `${this.c('green', `${results.passed} passed`)} | ` +
      `${results.failed > 0 ? this.c('red', `${results.failed} failed`) : '0 failed'} | ` +
      `${results.skipped > 0 ? this.c('yellow', `${results.skipped} skipped`) : '0 skipped'}`);
    console.log(`  Duration: ${results.durationMs}ms`);
    console.log('='.repeat(70) + '\n');

    if (results.failed === 0) {
      console.log(this.c('bgGreen', this.c('white', ' SUCCESS ')) + ' All tests passed cleanly 100%\n');
    } else {
      console.log(this.c('bgRed', this.c('white', ' FAILURE ')) + ` ${results.failed} test(s) failed\n`);
    }
  }
}

module.exports = Reporter;
