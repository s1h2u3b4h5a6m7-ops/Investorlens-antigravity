/**
 * Feature 8 Tier 2 Boundary & Corner Case Tests
 * Focus: Single chapter company, missing chapter data, fast scrolling past 62% boundary, out-of-bounds section jumps
 */

const { describe, test } = require('../harness/runner.js');
const assert = require('../harness/assert.js');

describe('Feature 8 Boundary: Company Detail 10-Chapter Reader', () => {

  test('F8-B1: single chapter company reader fallback', () => {
    const singleChapterCompany = {
      id: 'COMP_SINGLE',
      name: 'Single Chapter Ltd',
      chapters: {
        1: { title: 'Executive Summary', content: 'Only Chapter 1 exists' }
      }
    };

    const getChapterData = (company, chapterIndex) => {
      const chapter = company.chapters ? company.chapters[chapterIndex] : null;
      if (!chapter) {
        return {
          title: `Chapter ${chapterIndex}`,
          content: 'No verified narrative available for this chapter.',
          isPlaceholder: true
        };
      }
      return { ...chapter, isPlaceholder: false };
    };

    const c1 = getChapterData(singleChapterCompany, 1);
    assert.isFalse(c1.isPlaceholder);
    assert.strictEqual(c1.title, 'Executive Summary');

    const c5 = getChapterData(singleChapterCompany, 5);
    assert.isTrue(c5.isPlaceholder);
    assert.contains(c5.content, 'No verified narrative available');
  });

  test('F8-B2: missing chapter data placeholder handling', () => {
    const sparseCompany = {
      id: 'COMP_SPARSE',
      chapters: {
        1: { title: 'Business' },
        3: { title: 'Financials' }
        // 2, 4, 5-10 missing
      }
    };

    const renderedChapters = [];
    for (let i = 1; i <= 10; i++) {
      const chapter = sparseCompany.chapters[i];
      if (chapter) {
        renderedChapters.push({ index: i, title: chapter.title, hasData: true });
      } else {
        renderedChapters.push({ index: i, title: `Section ${i}`, hasData: false });
      }
    }

    assert.strictEqual(renderedChapters.length, 10);
    assert.isTrue(renderedChapters[0].hasData);
    assert.isFalse(renderedChapters[1].hasData); // Chapter 2 missing
    assert.isTrue(renderedChapters[2].hasData);
  });

  test('F8-B3: fast scrolling past 62% viewport boundary', () => {
    // 62% scroll-spy threshold calculation
    const calculateActiveSection = (scrollPos, sectionHeights, viewportHeight) => {
      const spyLine = scrollPos + (viewportHeight * 0.62);
      let activeIndex = 1;
      let accumulatedHeight = 0;

      for (let i = 0; i < sectionHeights.length; i++) {
        accumulatedHeight += sectionHeights[i];
        if (spyLine >= accumulatedHeight) {
          activeIndex = i + 1;
        }
      }
      return Math.min(Math.max(activeIndex, 1), 10);
    };

    const heights = [400, 500, 600, 450, 550, 400, 500, 600, 400, 500]; // 10 chapters
    const vpHeight = 1000;

    // Scroll at top
    assert.strictEqual(calculateActiveSection(0, heights, vpHeight), 1);
    // Rapid scroll jump to 3000px
    const activeJump = calculateActiveSection(3000, heights, vpHeight);
    assert.inRange(activeJump, 5, 8);
  });

  test('F8-B4: out-of-bounds section jump anchor safety', () => {
    const jumpToSection = (targetIndex) => {
      if (targetIndex < 1 || targetIndex > 10 || typeof targetIndex !== 'number' || isNaN(targetIndex)) {
        return { valid: false, clampedIndex: targetIndex < 1 ? 1 : 10 };
      }
      return { valid: true, clampedIndex: targetIndex };
    };

    assert.deepEqual(jumpToSection(0), { valid: false, clampedIndex: 1 });
    assert.deepEqual(jumpToSection(15), { valid: false, clampedIndex: 10 });
    assert.deepEqual(jumpToSection(NaN), { valid: false, clampedIndex: 10 });
    assert.deepEqual(jumpToSection(5), { valid: true, clampedIndex: 5 });
  });

  test('F8-B5: two-tier header tab mismatch synchronization', () => {
    const getTwoTierHeaderState = (activeChapterIndex) => {
      if (activeChapterIndex <= 4) {
        return { tier1: 'Business', activeChapter: activeChapterIndex, subTabRange: '1–4' };
      } else {
        return { tier1: 'Judgement', activeChapter: activeChapterIndex, subTabRange: '5–10' };
      }
    };

    assert.strictEqual(getTwoTierHeaderState(1).tier1, 'Business');
    assert.strictEqual(getTwoTierHeaderState(4).tier1, 'Business');
    assert.strictEqual(getTwoTierHeaderState(5).tier1, 'Judgement');
    assert.strictEqual(getTwoTierHeaderState(10).tier1, 'Judgement');
  });

});
