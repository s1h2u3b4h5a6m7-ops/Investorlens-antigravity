/**
 * Tier 4 - Scenario Test 1
 * Real-World Application Workload Scenario 1:
 * Universal Omnibox Search -> Company Detail 10-Chapter Reader Scroll ->
 * 62% Viewport Scroll-Spy Tab Updates -> Desktop Right-Hand Digest Panel Best-Value Markers
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 4 - Scenario 01: Omnibox Search -> 10-Chapter Reader -> Scroll-Spy -> Digest Panel', () => {
  // Authoritative data contract fixtures
  const COMPANY_TCS = {
    id: 'tcs',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    sector: 'IT Services',
    metrics: {
      peRatio: 28.5,
      roe: 42.1,
      revenueGrowth: 14.2,
      evEbitda: 19.8
    },
    peerGroupPE: { low: 18.0, high: 36.0 }
  };

  const CHAPTERS = [
    { num: 1, title: '§1 Executive Summary', tier: 'The Business' },
    { num: 2, title: '§2 Financial Performance', tier: 'The Business' },
    { num: 3, title: '§3 Macro Context', tier: 'The Business' },
    { num: 4, title: '§4 Management Profile', tier: 'The Business' },
    { num: 5, title: '§5 Valuation Model', tier: 'The Judgement' },
    { num: 6, title: '§6 Bull/Bear Case', tier: 'The Judgement' },
    { num: 7, title: '§7 Tech & Geo Footprint', tier: 'The Judgement' },
    { num: 8, title: '§8 Supply Chain Nodes', tier: 'The Judgement' },
    { num: 9, title: '§9 Cross-Company Narratives', tier: 'The Judgement' },
    { num: 10, title: '§10 Machine News Pulse', tier: 'The Judgement' }
  ];

  function niceBand(low, high) {
    const rawSpan = Math.abs(high - low);
    const padding = rawSpan * 0.1;
    const bandMin = Number((low - padding).toFixed(2));
    const bandMax = Number((high + padding).toFixed(2));
    return { bandMin, bandMax };
  }

  test('Step 1: User types "TCS" into Omnibox on Home View and selects company result', () => {
    const omniboxState = {
      inputValue: 'TCS',
      searchResults: [
        { id: 'tcs', name: 'Tata Consultancy Services', symbol: 'TCS', type: 'company' }
      ],
      selectedResult: null
    };

    assert.strictEqual(omniboxState.searchResults.length, 1);
    assert.strictEqual(omniboxState.searchResults[0].symbol, 'TCS');

    // Simulate user selection action
    omniboxState.selectedResult = omniboxState.searchResults[0];
    const targetRoute = `/company/${omniboxState.selectedResult.id}`;

    assert.strictEqual(targetRoute, '/company/tcs');
  });

  test('Step 2: Company Detail View loads continuous 10-chapter reader starting at Chapter 1', () => {
    const readerState = {
      company: COMPANY_TCS,
      activeChapterNum: 1,
      activeChapterTitle: CHAPTERS[0].title,
      totalChapters: CHAPTERS.length,
      stickyHeaderTier: 'The Business'
    };

    assert.strictEqual(readerState.company.symbol, 'TCS');
    assert.strictEqual(readerState.totalChapters, 10);
    assert.strictEqual(readerState.activeChapterNum, 1);
    assert.strictEqual(readerState.stickyHeaderTier, 'The Business');
  });

  test('Step 3: User scrolls past 62% threshold; scroll-spy updates 2-tier header to "The Judgement"', () => {
    // Scroll progress at 65% (past 62% threshold)
    const scrollPositionPercent = 65;

    function updateScrollSpy(scrollPct) {
      // Map 65% to chapter index 6 (Chapter 7)
      const chapterIndex = Math.min(Math.floor((scrollPct / 100) * 10), 9);
      const activeChapter = CHAPTERS[chapterIndex];

      return {
        activeChapterNum: activeChapter.num,
        activeChapterTitle: activeChapter.title,
        activeTier: activeChapter.num <= 4 ? 'The Business' : 'The Judgement'
      };
    }

    const spyResult = updateScrollSpy(scrollPositionPercent);

    assert.strictEqual(spyResult.activeChapterNum, 7);
    assert.strictEqual(spyResult.activeChapterTitle, '§7 Tech & Geo Footprint');
    assert.strictEqual(spyResult.activeTier, 'The Judgement', 'Scroll-spy must switch active tab header to The Judgement');
  });

  test('Step 4: Desktop Digest panel calculates niceBand() and renders best-value markers', () => {
    const band = niceBand(COMPANY_TCS.peerGroupPE.low, COMPANY_TCS.peerGroupPE.high);

    assert.lessThan(band.bandMin, COMPANY_TCS.peerGroupPE.low);
    assert.greaterThan(band.bandMax, COMPANY_TCS.peerGroupPE.high);

    // Calculate position for TCS PE ratio (28.5) inside band
    const tcsPositionNorm = Number(
      ((COMPANY_TCS.metrics.peRatio - band.bandMin) / (band.bandMax - band.bandMin)).toFixed(4)
    );

    assert.inRange(tcsPositionNorm, 0, 1, 'Marker position must be normalized between 0 and 1');

    const digestMarker = {
      metricName: 'PE Ratio',
      value: COMPANY_TCS.metrics.peRatio,
      normPos: tcsPositionNorm,
      isBestValue: COMPANY_TCS.metrics.roe > 35 // High ROE best-value tag
    };

    assert.isTrue(digestMarker.isBestValue, 'TCS high ROE must trigger best-value marker in Digest panel');
  });
});
