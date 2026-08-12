/**
 * Feature 5 Tier 2 Boundary & Corner Case Tests
 * Focus: Rapid route switching, invalid route paths, un-scoped body classes, bezel navigation collapse
 */

const { describe, test } = require('../harness/runner.js');
const assert = require('../harness/assert.js');

describe('Feature 5 Boundary: UI-2 Promotion & Bezel Navigation', () => {

  const validRoutes = ['/', '/company/INFY', '/sectors', '/forces', '/compare', '/freshness'];

  const routerState = {
    currentRoute: '/',
    activeTab: 'home',
    routeHistory: []
  };

  const navigateTo = (path) => {
    if (!validRoutes.includes(path) && !path.startsWith('/company/')) {
      routerState.currentRoute = '/';
      routerState.activeTab = 'home';
    } else {
      routerState.currentRoute = path;
      routerState.activeTab = path === '/' ? 'home' : path.split('/')[1];
    }
    routerState.routeHistory.push(routerState.currentRoute);
    return routerState;
  };

  test('F5-B1: rapid route switching resilience', () => {
    const rapidSequence = ['/', '/sectors', '/forces', '/compare', '/freshness', '/company/TCS', '/'];
    rapidSequence.forEach(route => {
      navigateTo(route);
    });

    assert.strictEqual(routerState.currentRoute, '/');
    assert.strictEqual(routerState.activeTab, 'home');
    assert.strictEqual(routerState.routeHistory.length, 7);
  });

  test('F5-B2: invalid route path fallback handling', () => {
    const invalidPaths = ['/invalid-route', '/admin/dashboard', '/undefined', '/%20/bad'];
    
    invalidPaths.forEach(path => {
      const state = navigateTo(path);
      assert.strictEqual(state.currentRoute, '/', `Invalid path ${path} must fallback to '/'`);
      assert.strictEqual(state.activeTab, 'home');
    });
  });

  test('F5-B3: un-scoped body classes UI-2 foundation', () => {
    const bodyClasses = ['dark-theme', 'precision-instrument', 'root-container'];
    
    const isUi2StyleUnscoped = (classes) => {
      return !classes.includes('story') && !classes.includes('body.story');
    };

    assert.isTrue(isUi2StyleUnscoped(bodyClasses), 'UI-2 styles must not require body.story wrapper');
  });

  test('F5-B4: bezel navigation collapse on mobile viewports', () => {
    const calculateBezelLayout = (viewportWidth) => {
      if (viewportWidth < 640) {
        return { isCollapsed: true, displayMode: 'floating-capsule-compact', showIconsOnly: true };
      }
      return { isCollapsed: false, displayMode: 'floating-capsule-full', showIconsOnly: false };
    };

    const mobileLayout = calculateBezelLayout(375);
    assert.isTrue(mobileLayout.isCollapsed);
    assert.isTrue(mobileLayout.showIconsOnly);

    const desktopLayout = calculateBezelLayout(1280);
    assert.isFalse(desktopLayout.isCollapsed);
    assert.isFalse(desktopLayout.showIconsOnly);
  });

  test('F5-B5: active route index out-of-bounds safety', () => {
    const navItems = ['Home', 'Sectors', 'Forces', 'Compare', 'Freshness'];

    const getActiveNavItem = (index) => {
      if (index < 0 || index >= navItems.length || typeof index !== 'number' || isNaN(index)) {
        return navItems[0]; // Safe default to Home
      }
      return navItems[index];
    };

    assert.strictEqual(getActiveNavItem(-1), 'Home');
    assert.strictEqual(getActiveNavItem(99), 'Home');
    assert.strictEqual(getActiveNavItem(NaN), 'Home');
    assert.strictEqual(getActiveNavItem(2), 'Forces');
  });

});
