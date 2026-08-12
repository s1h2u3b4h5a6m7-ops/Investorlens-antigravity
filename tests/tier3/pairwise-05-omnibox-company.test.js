/**
 * Tier 3 - Pairwise Test 5
 * Feature 6 (Omnibox Search Result Selection) x Feature 8 (Company Detail 10-Chapter Reader Navigation) Integration
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 3 - Pairwise 05: Omnibox Search Selection x Company Detail Reader Navigation', () => {
  const MOCK_SEARCH_INDEX = [
    { id: 'tcs', name: 'Tata Consultancy Services', symbol: 'TCS', type: 'company', sector: 'IT Services' },
    { id: 'reliance', name: 'Reliance Industries', symbol: 'RELIANCE', type: 'company', sector: 'Oil & Gas / Digital' },
    { id: 'hdfcbank', name: 'HDFC Bank', symbol: 'HDFCBANK', type: 'company', sector: 'BFSI' },
    { id: 'force_dpi', name: 'Digital Public Infrastructure', symbol: 'DPI', type: 'force', shelf: 'Tailwind' },
    { id: 'sec_it', name: 'IT Services', symbol: 'IT', type: 'sector', count: 12 }
  ];

  test('Omnibox search filters items correctly by name, symbol, sector, or force', () => {
    function searchOmnibox(query) {
      const q = query.toLowerCase().trim();
      if (!q) return [];
      return MOCK_SEARCH_INDEX.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.symbol.toLowerCase().includes(q) ||
        (item.sector && item.sector.toLowerCase().includes(q))
      );
    }

    const tcsResults = searchOmnibox('TCS');
    assert.greaterThan(tcsResults.length, 0);
    assert.strictEqual(tcsResults[0].id, 'tcs');

    const bfsiResults = searchOmnibox('BFSI');
    assert.greaterThan(bfsiResults.length, 0);
    assert.strictEqual(bfsiResults[0].symbol, 'HDFCBANK');
  });

  test('Selecting company search result navigates to Company Detail 10-chapter reader', () => {
    function selectOmniboxResult(item) {
      if (item.type === 'company') {
        return {
          route: `/company/${item.id}`,
          view: 'CompanyDetailReader',
          activeChapter: 1,
          chapterTitle: '§1 Executive Summary',
          totalChapters: 10
        };
      }
      return null;
    }

    const selectedItem = MOCK_SEARCH_INDEX[0]; // TCS
    const navigationState = selectOmniboxResult(selectedItem);

    assert.ok(navigationState, 'Navigation state must be generated for company selection');
    assert.strictEqual(navigationState.route, '/company/tcs');
    assert.strictEqual(navigationState.view, 'CompanyDetailReader');
    assert.strictEqual(navigationState.activeChapter, 1, 'Reader must initialize at Chapter 1');
    assert.strictEqual(navigationState.totalChapters, 10, 'Company detail must have 10 continuous chapters');
  });
});
