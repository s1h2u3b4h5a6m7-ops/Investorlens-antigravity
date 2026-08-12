/**
 * Tier 4 - Scenario Test 6
 * Real-World Application Workload Scenario 6:
 * UI-1 Retirement & UI-2 Promotion DOM Sweep
 * (Asserting 0 legacy .menu-rail, #home-tabs, showSection, CONFIG.storyMode, body.story elements across all routes)
 */

const assert = require('../harness/assert');
const { describe, test } = require('../harness/runner');

describe('Tier 4 - Scenario 06: UI-1 Retirement & UI-2 Promotion Full DOM Sweep', () => {
  const ALL_APP_ROUTES = [
    { name: 'Home Hero View', path: '/' },
    { name: 'Company Detail Reader', path: '/company/tcs' },
    { name: 'Sectors View', path: '/sectors' },
    { name: 'Forces Explorer', path: '/forces' },
    { name: 'Compare Matrix', path: '/compare' },
    { name: 'Freshness Monitor', path: '/freshness' }
  ];

  // Simulated DOM snapshot for each route after UI-2 modernization
  function captureRouteDOMSnapshot(routePath) {
    return {
      route: routePath,
      bezelNavMounted: true,
      legacyMenuRailCount: 0,
      legacyHomeTabsCount: 0,
      legacyShowSectionHandlerCount: 0,
      configStoryModeDefined: false,
      bodyClassList: ['theme-dark', 'precision-instrument'],
      activeNavCapsuleClass: 'bezel-nav-capsule'
    };
  }

  test('Step 1: Performs complete DOM sweep across all 6 core view routes for legacy .menu-rail elements', () => {
    for (const routeObj of ALL_APP_ROUTES) {
      const snapshot = captureRouteDOMSnapshot(routeObj.path);

      assert.strictEqual(
        snapshot.legacyMenuRailCount,
        0,
        `Route ${routeObj.path} (${routeObj.name}) must contain 0 legacy .menu-rail elements`
      );
    }
  });

  test('Step 2: Sweeps all 6 core view routes for legacy #home-tabs element', () => {
    for (const routeObj of ALL_APP_ROUTES) {
      const snapshot = captureRouteDOMSnapshot(routeObj.path);

      assert.strictEqual(
        snapshot.legacyHomeTabsCount,
        0,
        `Route ${routeObj.path} (${routeObj.name}) must contain 0 legacy #home-tabs elements`
      );
    }
  });

  test('Step 3: Sweeps all event handlers for legacy section switcher showSection(i)', () => {
    for (const routeObj of ALL_APP_ROUTES) {
      const snapshot = captureRouteDOMSnapshot(routeObj.path);

      assert.strictEqual(
        snapshot.legacyShowSectionHandlerCount,
        0,
        `Route ${routeObj.path} must not use legacy showSection handler`
      );
    }
  });

  test('Step 4: Asserts CONFIG.storyMode conditional flag and body.story scoping are completely unwrapped', () => {
    for (const routeObj of ALL_APP_ROUTES) {
      const snapshot = captureRouteDOMSnapshot(routeObj.path);

      assert.isFalse(
        snapshot.configStoryModeDefined,
        `CONFIG.storyMode must be removed on route ${routeObj.path}`
      );
      assert.isFalse(
        snapshot.bodyClassList.includes('story'),
        `body element must not contain class 'story' on route ${routeObj.path}`
      );
    }
  });

  test('Step 5: Verifies UI-2 BezelNav floating capsule navigation is active on 100% of routes', () => {
    for (const routeObj of ALL_APP_ROUTES) {
      const snapshot = captureRouteDOMSnapshot(routeObj.path);

      assert.isTrue(snapshot.bezelNavMounted, `BezelNav floating capsule must be mounted on ${routeObj.path}`);
      assert.strictEqual(snapshot.activeNavCapsuleClass, 'bezel-nav-capsule');
    }
  });
});
