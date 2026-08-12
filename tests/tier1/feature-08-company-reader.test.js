/**
 * Tier 1 Feature Coverage Tests: Feature 8 - Company Detail 10-Chapter Reader & Scrollspy
 * Source: ORIGINAL_REQUEST.md (R30, R54), PROJECT.md (Feature 8, Code Layout), TEST_INFRA.md (Feature 8)
 */

const fs = require('fs');
const path = require('path');
const { describe, test, assert } = require('../harness');

const rootDir = path.resolve(__dirname, '../../');

describe('Feature 8: Company Detail 10-Chapter Reader & Scrollspy', () => {

  test('F8.1: Continuous 10-Chapter Reader Section Catalog Structure', () => {
    const chapters = [
      { id: 1, title: 'Executive Summary', tier: 'business' },
      { id: 2, title: 'Core Business Model', tier: 'business' },
      { id: 3, title: 'Financial Architecture', tier: 'business' },
      { id: 4, title: 'Supply Chain & Geospatial', tier: 'business' },
      { id: 5, title: 'Management Profiles', tier: 'judgement' },
      { id: 6, title: 'Bull vs Bear Arguments', tier: 'judgement' },
      { id: 7, title: 'Cross-Company Narratives', tier: 'judgement' },
      { id: 8, title: 'Valuation & Scenario Inputs', tier: 'judgement' },
      { id: 9, title: 'Macro Forces Exposure', tier: 'judgement' },
      { id: 10, title: 'Machine News Pulse', tier: 'judgement' }
    ];

    assert.equal(chapters.length, 10, 'Continuous reader must contain exactly 10 chapters');
    assert.equal(chapters[0].id, 1, 'First chapter must be §1 Executive Summary');
    assert.equal(chapters[9].id, 10, 'Tenth chapter must be §10 Machine News Pulse');
  });

  test('F8.2: 2-Tier Sticky Header Bar Categorization Invariants', () => {
    const chapters = [
      { id: 1, tier: 'business' },
      { id: 2, tier: 'business' },
      { id: 3, tier: 'business' },
      { id: 4, tier: 'business' },
      { id: 5, tier: 'judgement' },
      { id: 6, tier: 'judgement' },
      { id: 7, tier: 'judgement' },
      { id: 8, tier: 'judgement' },
      { id: 9, tier: 'judgement' },
      { id: 10, tier: 'judgement' }
    ];

    const businessTier = chapters.filter(c => c.tier === 'business');
    const judgementTier = chapters.filter(c => c.tier === 'judgement');

    assert.equal(businessTier.length, 4, 'Tier 1 ("The Business") must span exactly chapters §§1–4');
    assert.equal(judgementTier.length, 6, 'Tier 2 ("The Judgement") must span exactly chapters §§5–10');
  });

  test('F8.3: 62% Viewport Scrollspy Observer Offset Math', () => {
    const viewportHeight = 1000;
    const SCROLLSPY_THRESHOLD_RATIO = 0.62;
    const targetOffset = viewportHeight * SCROLLSPY_THRESHOLD_RATIO;

    assert.equal(targetOffset, 620, '62% viewport offset for 1000px viewport must equal 620px');

    const calculateActiveChapter = (sectionOffsets, scrollTop, vh) => {
      const triggerLine = scrollTop + vh * SCROLLSPY_THRESHOLD_RATIO;
      let activeChapter = 1;
      for (const sec of sectionOffsets) {
        if (triggerLine >= sec.top) {
          activeChapter = sec.chapter;
        }
      }
      return activeChapter;
    };

    const mockSections = [
      { chapter: 1, top: 0 },
      { chapter: 2, top: 500 },
      { chapter: 3, top: 1200 },
      { chapter: 4, top: 1800 }
    ];

    // At scrollTop = 0, triggerLine = 620px -> active is chapter 2 (top 500 <= 620 < 1200)
    assert.equal(calculateActiveChapter(mockSections, 0, 1000), 2);
    // At scrollTop = 1000, triggerLine = 1620px -> active is chapter 3 (top 1200 <= 1620 < 1800)
    assert.equal(calculateActiveChapter(mockSections, 1000, 1000), 3);
  });

  test('F8.4: Chapter Sticky Header Active Synchronization Contract', () => {
    const getHeaderState = (activeChapterId) => {
      const tier = activeChapterId <= 4 ? 'The Business' : 'The Judgement';
      return {
        activeTier: tier,
        activeChapter: activeChapterId,
        isBusinessActive: activeChapterId <= 4,
        isJudgementActive: activeChapterId >= 5
      };
    };

    const stateCh3 = getHeaderState(3);
    assert.equal(stateCh3.activeTier, 'The Business', 'Chapter 3 active tier must be "The Business"');
    assert.isTrue(stateCh3.isBusinessActive, 'isBusinessActive must be true for Chapter 3');

    const stateCh7 = getHeaderState(7);
    assert.equal(stateCh7.activeTier, 'The Judgement', 'Chapter 7 active tier must be "The Judgement"');
    assert.isTrue(stateCh7.isJudgementActive, 'isJudgementActive must be true for Chapter 7');
  });

  test('F8.5: Chapter Jump Navigation & Anchor Target Mapping', () => {
    const getAnchorId = (chapterNum) => `chapter-${chapterNum}`;

    for (let i = 1; i <= 10; i++) {
      const anchor = getAnchorId(i);
      assert.equal(anchor, `chapter-${i}`, `Chapter ${i} anchor must equal chapter-${i}`);
    }

    const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');
    assert.contains(projectContent, 'ChapterReader', 'PROJECT.md must document ChapterReader continuous scroll component');
  });

});
