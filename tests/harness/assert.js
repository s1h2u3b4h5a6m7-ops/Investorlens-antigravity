/**
 * InvestorLens Test Harness - Assertion Library
 * Provides robust assertions with clear error messages.
 */

class AssertionError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssertionError);
    }
  }
}

function formatValue(val) {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'function') return `[Function: ${val.name || 'anonymous'}]`;
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val);
    } catch (e) {
      return String(val);
    }
  }
  return String(val);
}

function isDeepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (a.constructor !== b.constructor) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isDeepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!isDeepEqual(a[key], b[key])) return false;
  }

  return true;
}

const assert = {
  AssertionError,

  ok(value, message) {
    if (!value) {
      throw new AssertionError(
        message || `Expected truthy value, received: ${formatValue(value)}`,
        value,
        true
      );
    }
  },

  isTrue(value, message) {
    if (value !== true) {
      throw new AssertionError(
        message || `Expected true, received: ${formatValue(value)}`,
        value,
        true
      );
    }
  },

  isFalse(value, message) {
    if (value !== false) {
      throw new AssertionError(
        message || `Expected false, received: ${formatValue(value)}`,
        value,
        false
      );
    }
  },

  equal(actual, expected, message) {
    if (actual != expected) {
      throw new AssertionError(
        message || `Expected equal values:\n  Actual:   ${formatValue(actual)}\n  Expected: ${formatValue(expected)}`,
        actual,
        expected
      );
    }
  },

  notEqual(actual, expected, message) {
    if (actual == expected) {
      throw new AssertionError(
        message || `Expected values not to equal: ${formatValue(actual)}`,
        actual,
        expected
      );
    }
  },

  strictEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new AssertionError(
        message || `Expected strictly equal values:\n  Actual:   ${formatValue(actual)}\n  Expected: ${formatValue(expected)}`,
        actual,
        expected
      );
    }
  },

  deepEqual(actual, expected, message) {
    if (!isDeepEqual(actual, expected)) {
      throw new AssertionError(
        message || `Expected deep equal objects:\n  Actual:   ${formatValue(actual)}\n  Expected: ${formatValue(expected)}`,
        actual,
        expected
      );
    }
  },

  isType(value, expectedType, message) {
    const actualType = typeof value;
    if (actualType !== expectedType) {
      throw new AssertionError(
        message || `Expected type "${expectedType}", received "${actualType}" (${formatValue(value)})`,
        actualType,
        expectedType
      );
    }
  },

  contains(container, item, message) {
    if (typeof container === 'string') {
      if (!container.includes(item)) {
        throw new AssertionError(
          message || `Expected string to contain "${item}", string was: ${formatValue(container)}`,
          container,
          item
        );
      }
    } else if (Array.isArray(container)) {
      if (!container.includes(item)) {
        throw new AssertionError(
          message || `Expected array to contain item ${formatValue(item)}`,
          container,
          item
        );
      }
    } else if (container && typeof container === 'object') {
      if (!(item in container)) {
        throw new AssertionError(
          message || `Expected object to contain property "${item}"`,
          container,
          item
        );
      }
    } else {
      throw new AssertionError(
        message || `Cannot check contains on invalid container: ${formatValue(container)}`,
        container,
        item
      );
    }
  },

  matches(string, regex, message) {
    const re = typeof regex === 'string' ? new RegExp(regex) : regex;
    if (!re.test(string)) {
      throw new AssertionError(
        message || `Expected string ${formatValue(string)} to match pattern ${re}`,
        string,
        re
      );
    }
  },

  inRange(value, min, max, message) {
    if (value < min || value > max) {
      throw new AssertionError(
        message || `Expected value ${value} to be in range [${min}, ${max}]`,
        value,
        `[${min}, ${max}]`
      );
    }
  },

  greaterThan(actual, threshold, message) {
    if (actual <= threshold) {
      throw new AssertionError(
        message || `Expected ${actual} to be greater than ${threshold}`,
        actual,
        `> ${threshold}`
      );
    }
  },

  lessThan(actual, threshold, message) {
    if (actual >= threshold) {
      throw new AssertionError(
        message || `Expected ${actual} to be less than ${threshold}`,
        actual,
        `< ${threshold}`
      );
    }
  },

  throws(fn, expectedError, message) {
    let threw = false;
    let thrownError = null;
    try {
      fn();
    } catch (err) {
      threw = true;
      thrownError = err;
    }

    if (!threw) {
      throw new AssertionError(
        message || 'Expected function to throw an error, but it executed without erroring',
        null,
        expectedError || Error
      );
    }

    if (expectedError) {
      if (typeof expectedError === 'function') {
        if (!(thrownError instanceof expectedError)) {
          throw new AssertionError(
            message || `Expected error instance of ${expectedError.name}, got ${thrownError.constructor.name}`,
            thrownError,
            expectedError
          );
        }
      } else if (typeof expectedError === 'string' || expectedError instanceof RegExp) {
        const re = typeof expectedError === 'string' ? new RegExp(expectedError) : expectedError;
        if (!re.test(thrownError.message)) {
          throw new AssertionError(
            message || `Expected error message matching ${re}, got "${thrownError.message}"`,
            thrownError.message,
            re
          );
        }
      }
    }
  },

  fail(message) {
    throw new AssertionError(message || 'Explicit failure assertion triggered', null, null);
  }
};

module.exports = assert;
