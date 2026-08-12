/**
 * Feature 6 Tier 2 Boundary & Corner Case Tests
 * Focus: Omnibox empty query, special characters search, 0-match search, extreme counter values, rapid typing
 */

const { describe, test } = require('../harness/runner.js');
const assert = require('../harness/assert.js');

describe('Feature 6 Boundary: Home Hero View', () => {

  const sampleDataset = [
    { type: 'company', symbol: 'INFY', name: 'Infosys Ltd' },
    { type: 'company', symbol: 'TCS', name: 'Tata Consultancy Services' },
    { type: 'sector', symbol: 'IT', name: 'Information Technology' },
    { type: 'force', symbol: 'AI_REVOLUTION', name: 'Artificial Intelligence Tailwind' }
  ];

  const performOmniboxSearch = (query) => {
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return { matches: sampleDataset, isDefaultState: true };
    }
    const cleanQuery = query.trim().toLowerCase();
    // Escape regex characters safely
    const escaped = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'i');
    
    const matches = sampleDataset.filter(item => 
      re.test(item.symbol) || re.test(item.name)
    );
    return { matches, isDefaultState: false };
  };

  test('F6-B1: omnibox empty or whitespace query handling', () => {
    const emptyQueries = ['', '   ', '\t\n', null, undefined];
    emptyQueries.forEach(q => {
      const res = performOmniboxSearch(q);
      assert.isTrue(res.isDefaultState);
      assert.strictEqual(res.matches.length, sampleDataset.length);
    });
  });

  test('F6-B2: omnibox special characters & script injection search', () => {
    const maliciousInputs = [
      '<script>alert(1)</script>',
      "' OR '1'='1",
      'DROP TABLE companies;',
      '.*+?^${}()|[\\]\\',
      '%20%27%22'
    ];

    maliciousInputs.forEach(input => {
      const res = performOmniboxSearch(input);
      assert.isFalse(res.isDefaultState);
      assert.isType(res.matches, 'object'); // Array is object
      assert.ok(Array.isArray(res.matches));
    });
  });

  test('F6-B3: 0-match search result empty state', () => {
    const res = performOmniboxSearch('xyz999nonexistent');
    assert.isFalse(res.isDefaultState);
    assert.strictEqual(res.matches.length, 0);
    assert.deepEqual(res.matches, []);
  });

  test('F6-B4: extreme counter values handling', () => {
    const formatCounterValue = (num) => {
      if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) return '0';
      if (num < 0) return '0';
      if (num > 1000000000) return '1B+';
      return num.toLocaleString('en-IN');
    };

    assert.strictEqual(formatCounterValue(0), '0');
    assert.strictEqual(formatCounterValue(-50), '0');
    assert.strictEqual(formatCounterValue(9999999999), '1B+');
    assert.strictEqual(formatCounterValue(NaN), '0');
    assert.strictEqual(formatCounterValue(Infinity), '0');
    assert.strictEqual(formatCounterValue(107), '107');
    assert.strictEqual(formatCounterValue(492), '492');
  });

  test('F6-B5: rapid typing search debouncing', () => {
    let callCount = 0;
    let timerId = null;

    const debouncedSearch = (query, delay = 50, callback) => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        callCount++;
        callback(performOmniboxSearch(query));
      }, delay);
    };

    // Simulate 10 rapid keystrokes within 10ms
    const keystrokes = ['I', 'IN', 'INF', 'INFY', 'INFYS', 'INFY'];
    keystrokes.forEach(str => debouncedSearch(str, 50, () => {}));

    // After 100ms, only the last search should execute
    return new Promise(resolve => {
      setTimeout(() => {
        assert.strictEqual(callCount, 1, 'Debounced search should fire exactly once for rapid typing');
        resolve();
      }, 100);
    });
  });

});
