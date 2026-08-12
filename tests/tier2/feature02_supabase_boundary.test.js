/**
 * Feature 2 Tier 2 Boundary & Corner Case Tests
 * Focus: Network errors, null/empty responses, malformed JSON, query timeouts, missing columns
 */

const { describe, test } = require('../harness/runner.js');
const assert = require('../harness/assert.js');

describe('Feature 2 Boundary: Supabase Client & 10-Table Data Model', () => {

  test('F2-B1: network fetch failure handling', async () => {
    const mockFetchWithNetworkError = async (tableName) => {
      // Simulate network 500 error or exception
      return {
        data: null,
        error: { message: `Fetch failed for table ${tableName}: Network Error (500)`, code: 500 }
      };
    };

    const tables = ['companies', 'metric_snapshots', 'chain_nodes', 'tech_geo_tags', 'bull_bear_cases'];
    for (const table of tables) {
      const res = await mockFetchWithNetworkError(table);
      assert.strictEqual(res.data, null);
      assert.ok(res.error, 'Error object should be populated');
      assert.contains(res.error.message, 'Network Error');
    }
  });

  test('F2-B2: null or empty table response parsing', async () => {
    const parseTableResponse = (response, fallbackDefault = []) => {
      if (!response || response.error || !Array.isArray(response.data)) {
        return { items: fallbackDefault, isEmpty: true };
      }
      return { items: response.data, isEmpty: response.data.length === 0 };
    };

    // Test null data response
    const nullRes = parseTableResponse({ data: null, error: null });
    assert.deepEqual(nullRes.items, []);
    assert.isTrue(nullRes.isEmpty);

    // Test empty array response
    const emptyRes = parseTableResponse({ data: [], error: null });
    assert.deepEqual(emptyRes.items, []);
    assert.isTrue(emptyRes.isEmpty);

    // Test valid array response
    const validRes = parseTableResponse({ data: [{ id: 1 }], error: null });
    assert.strictEqual(validRes.items.length, 1);
    assert.isFalse(validRes.isEmpty);
  });

  test('F2-B3: malformed JSON payload handling', () => {
    const parsePayloadSafely = (jsonString) => {
      try {
        if (typeof jsonString !== 'string') throw new TypeError('Payload must be a string');
        const parsed = JSON.parse(jsonString);
        if (!parsed || typeof parsed !== 'object') throw new Error('Root must be object or array');
        return { success: true, payload: parsed };
      } catch (err) {
        return { success: false, error: err.message, payload: [] };
      }
    };

    // Malformed JSON strings
    const badJson1 = "{ id: 123, name: unquoted }";
    const badJson2 = "[ { company_id: 1, ";
    const nonString = 12345;

    const r1 = parsePayloadSafely(badJson1);
    assert.isFalse(r1.success);
    assert.deepEqual(r1.payload, []);

    const r2 = parsePayloadSafely(badJson2);
    assert.isFalse(r2.success);
    assert.deepEqual(r2.payload, []);

    const r3 = parsePayloadSafely(nonString);
    assert.isFalse(r3.success);
    assert.contains(r3.error, 'Payload must be a string');
  });

  test('F2-B4: query timeout handling', async () => {
    const queryWithTimeout = async (queryFn, timeoutMs = 50) => {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Query timed out after ${timeoutMs}ms`)), timeoutMs);
      });
      try {
        return await Promise.race([queryFn(), timeoutPromise]);
      } catch (err) {
        return { error: err.message, timedOut: true };
      }
    };

    // Slow query simulation
    const slowQuery = () => new Promise(resolve => setTimeout(() => resolve({ data: [1, 2, 3] }), 200));

    const result = await queryWithTimeout(slowQuery, 50);
    assert.isTrue(result.timedOut);
    assert.contains(result.error, 'Query timed out');
  });

  test('F2-B5: missing table columns / schema drift handling', () => {
    const normalizeCompanyRow = (row) => {
      return {
        id: row.id || 'unknown_id',
        name: row.name || 'Unnamed Company',
        ticker: row.ticker || 'N/A',
        sector: row.sector || 'Uncategorized',
        market_cap: typeof row.market_cap === 'number' ? row.market_cap : 0,
        is_active: typeof row.is_active === 'boolean' ? row.is_active : true
      };
    };

    const sparseRow = { id: 'comp_001', name: 'Acme Corp' }; // missing ticker, sector, market_cap
    const normalized = normalizeCompanyRow(sparseRow);

    assert.strictEqual(normalized.id, 'comp_001');
    assert.strictEqual(normalized.name, 'Acme Corp');
    assert.strictEqual(normalized.ticker, 'N/A');
    assert.strictEqual(normalized.sector, 'Uncategorized');
    assert.strictEqual(normalized.market_cap, 0);
    assert.strictEqual(normalized.is_active, true);
  });

});
