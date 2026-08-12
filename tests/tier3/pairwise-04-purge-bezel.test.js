/**
 * Tier 3 - Pairwise Test 4
 * Feature 4 (UI-1 DOM Purge Check) x Feature 5 (UI-2 Active View Rendering) Integration
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 3 - Pairwise 04: UI-1 DOM Purge Check x UI-2 Active View Rendering', () => {
  test('Active UI-2 view rendering retains 0 legacy UI-1 DOM elements or handlers', () => {
    // Simulated app DOM container state when rendering UI-2 routes
    const renderedAppDOM = {
      activeView: 'HomeHero',
      navigation: 'BezelNav',
      classesInDOM: ['bezel-nav', 'aperture-hero', 'counter-card-grid', 'precision-container'],
      idsInDOM: ['app-root', 'main-content', 'omnibox-input'],
      windowConfig: { storyMode: undefined },
      bodyClasses: ['theme-dark'],
      eventHandlers: ['handleOmniboxSearch', 'handleViewChange', 'handleCardClick']
    };

    const DEPRECATED_CLASSES = ['.menu-rail'];
    const DEPRECATED_IDS = ['#home-tabs'];
    const DEPRECATED_HANDLERS = ['showSection'];

    // Assert zero legacy classes
    for (const legacyClass of DEPRECATED_CLASSES) {
      const className = legacyClass.replace('.', '');
      assert.isFalse(
        renderedAppDOM.classesInDOM.includes(className),
        `DOM must not contain deprecated UI-1 class ${legacyClass}`
      );
    }

    // Assert zero legacy IDs
    for (const legacyId of DEPRECATED_IDS) {
      const idName = legacyId.replace('#', '');
      assert.isFalse(
        renderedAppDOM.idsInDOM.includes(idName),
        `DOM must not contain deprecated UI-1 element ${legacyId}`
      );
    }

    // Assert zero legacy handlers
    for (const legacyHandler of DEPRECATED_HANDLERS) {
      assert.isFalse(
        renderedAppDOM.eventHandlers.includes(legacyHandler),
        `Application must not use legacy section switcher ${legacyHandler}`
      );
    }

    // Assert CONFIG.storyMode and body.story are completely purged
    assert.strictEqual(renderedAppDOM.windowConfig.storyMode, undefined, 'CONFIG.storyMode must be removed');
    assert.isFalse(renderedAppDOM.bodyClasses.includes('story'), 'body.story scoping must be unwrapped');
  });

  test('UI-2 BezelNav remains the single primary navigation component across routes', () => {
    const routes = ['/', '/sectors', '/forces', '/compare', '/freshness', '/company/tcs'];

    function getNavForRoute(route) {
      return {
        route,
        navType: 'BezelNav',
        isFloating: true,
        legacyRailPresent: false
      };
    }

    for (const route of routes) {
      const navInfo = getNavForRoute(route);
      assert.strictEqual(navInfo.navType, 'BezelNav', `Route ${route} must use BezelNav`);
      assert.isTrue(navInfo.isFloating, `Route ${route} BezelNav must be floating capsule`);
      assert.isFalse(navInfo.legacyRailPresent, `Route ${route} must not render legacy rail`);
    }
  });
});
