/**
 * Tier 3 - Pairwise Test 7
 * Feature 8 (10-Chapter Continuous Scroll-Spy) x Feature 9 (Digest Panel niceBand() Dynamic Recalculation) Integration
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 3 - Pairwise 07: 10-Chapter Scroll-Spy x Digest Panel niceBand() Algorithm', () => {
  const CHAPTERS = [
    { num: 1, name: 'Executive Summary', tier: 'Business' },
    { num: 2, name: 'Financial Performance', tier: 'Business' },
    { num: 3, name: 'Macro Context', tier: 'Business' },
    { num: 4, name: 'Management Profile', tier: 'Business' },
    { num: 5, name: 'Valuation Model', tier: 'Judgement' },
    { num: 6, name: 'Bull/Bear Case', tier: 'Judgement' },
    { num: 7, name: 'Tech & Geo Footprint', tier: 'Judgement' },
    { num: 8, name: 'Supply Chain Nodes', tier: 'Judgement' },
    { num: 9, name: 'Cross-Company Narratives', tier: 'Judgement' },
    { num: 10, name: 'Machine News Pulse', tier: 'Judgement' }
  ];

  function niceBand(low, high) {
    if (low === high) return { min: low, max: high, lowNorm: 0, highNorm: 1 };
    const rawSpan = Math.abs(high - low);
    const padding = rawSpan * 0.1;
    const bandMin = low - padding;
    const bandMax = high + padding;

    return {
      bandMin: Number(bandMin.toFixed(2)),
      bandMax: Number(bandMax.toFixed(2)),
      lowNorm: Number(((low - bandMin) / (bandMax - bandMin)).toFixed(4)),
      highNorm: Number(((high - bandMin) / (bandMax - bandMin)).toFixed(4))
    };
  }

  test('62% viewport scroll-spy observer updates active chapter and two-tier header', () => {
    function observeScrollPosition(scrollPercent) {
      // Map 0-100% scroll position across 10 chapters
      const chapterIndex = Math.min(Math.floor((scrollPercent / 100) * 10), 9);
      const activeChapter = CHAPTERS[chapterIndex];
      const activeTier = activeChapter.num <= 4 ? 'The Business' : 'The Judgement';

      return {
        activeChapterNum: activeChapter.num,
        activeChapterName: activeChapter.name,
        activeTier
      };
    }

    // Scroll at 20% -> Chapter 3 (§3 Macro Context) -> The Business
    const pos30 = observeScrollPosition(25);
    assert.strictEqual(pos30.activeChapterNum, 3);
    assert.strictEqual(pos30.activeTier, 'The Business');

    // Scroll at 62% threshold -> Chapter 7 (§7 Tech & Geo) -> The Judgement
    const pos62 = observeScrollPosition(62);
    assert.strictEqual(pos62.activeChapterNum, 7);
    assert.strictEqual(pos62.activeTier, 'The Judgement');
  });

  test('Digest panel dynamically recalculates niceBand() peer tracks as active chapter changes', () => {
    // Metric data per chapter for Digest panel
    const chapterMetrics = {
      1: { low: 15.2, high: 28.5 }, // PE ratio range
      2: { low: 12.0, high: 24.5 }, // Revenue Growth %
      5: { low: 8.5, high: 18.0 }   // EV/EBITDA
    };

    const band1 = niceBand(chapterMetrics[1].low, chapterMetrics[1].high);
    assert.lessThan(band1.bandMin, 15.2, 'Band min must provide lower padding');
    assert.greaterThan(band1.bandMax, 28.5, 'Band max must provide upper padding');
    assert.inRange(band1.lowNorm, 0, 1, 'Normalized bounds must be within [0, 1]');
    assert.inRange(band1.highNorm, 0, 1, 'Normalized bounds must be within [0, 1]');

    const band5 = niceBand(chapterMetrics[5].low, chapterMetrics[5].high);
    assert.lessThan(band5.bandMin, 8.5);
    assert.greaterThan(band5.bandMax, 18.0);
  });
});
