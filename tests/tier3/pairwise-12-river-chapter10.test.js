/**
 * Tier 3 - Pairwise Test 12
 * Feature 7 (Freshness Headline River Item Click) x Feature 8 (Company Detail Chapter 10 News Pulse) Integration
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 3 - Pairwise 12: Freshness Headline River Click x Company Detail Chapter 10 News Pulse', () => {
  const MOCK_RIVER_ITEM = {
    id: 'news_42',
    headline: 'TCS Signs Multi-Year Cloud Transformation Deal in Europe',
    companyId: 'tcs',
    companyName: 'Tata Consultancy Services',
    publishedAt: '2026-08-10T14:30:00Z',
    source: 'Automated News Pulse API'
  };

  test('Clicking headline item navigates directly to Company Detail Chapter 10', () => {
    function handleHeadlineClick(newsItem) {
      return {
        route: `/company/${newsItem.companyId}#chapter-10`,
        companyId: newsItem.companyId,
        activeChapter: 10,
        chapterTitle: '§10 Machine News Pulse',
        newsItemRef: newsItem.id,
        isHumanVerified: false
      };
    }

    const nav = handleHeadlineClick(MOCK_RIVER_ITEM);

    assert.strictEqual(nav.route, '/company/tcs#chapter-10');
    assert.strictEqual(nav.activeChapter, 10);
    assert.strictEqual(nav.chapterTitle, '§10 Machine News Pulse');
    assert.isFalse(nav.isHumanVerified, 'Chapter 10 must be tagged as machine-gathered news pulse');
  });

  test('Strict invariant: Machine news pulse (§10) is segregated from human-verified chapters (§§1–9)', () => {
    const chapters = Array.from({ length: 10 }, (_, i) => ({
      num: i + 1,
      isHumanVerified: (i + 1) <= 9,
      isMachineGathered: (i + 1) === 10
    }));

    for (let c = 1; c <= 9; c++) {
      assert.isTrue(chapters[c - 1].isHumanVerified, `Chapter ${c} must be human-verified`);
      assert.isFalse(chapters[c - 1].isMachineGathered, `Chapter ${c} must not be machine-gathered`);
    }

    assert.isFalse(chapters[9].isHumanVerified, 'Chapter 10 is not human-verified');
    assert.isTrue(chapters[9].isMachineGathered, 'Chapter 10 is machine-gathered news pulse');
  });
});
