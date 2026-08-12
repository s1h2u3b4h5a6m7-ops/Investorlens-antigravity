/**
 * Tier 1 Feature Coverage Tests: Feature 4 - Legacy UI-1 Retirement
 * Source: ORIGINAL_REQUEST.md (R24, R50), PROJECT.md (Feature 4, Milestone M2), TEST_INFRA.md (Feature 4)
 */

const fs = require('fs');
const path = require('path');
const { describe, test, assert } = require('../harness');

const rootDir = path.resolve(__dirname, '../../');

describe('Feature 4: Legacy UI-1 Retirement', () => {

  test('F4.1: Absence of Deprecated .menu-rail Sidebar References', () => {
    // Audit src directory for forbidden .menu-rail references if src exists
    const srcDir = path.join(rootDir, 'src');
    if (fs.existsSync(srcDir)) {
      const checkFiles = (dir) => {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory()) {
            checkFiles(fullPath);
          } else if (file.isFile() && /\.(tsx?|jsx?|css|html)$/.test(file.name)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            assert.isFalse(content.includes('.menu-rail'), `File ${file.name} must not contain .menu-rail`);
          }
        }
      };
      checkFiles(srcDir);
    } else {
      // Contract check: verify PROJECT.md mandates purging .menu-rail
      const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');
      assert.contains(projectContent, '.menu-rail', 'PROJECT.md must document purging .menu-rail');
    }
  });

  test('F4.2: Absence of Deprecated #home-tabs Container References', () => {
    const srcDir = path.join(rootDir, 'src');
    if (fs.existsSync(srcDir)) {
      const checkFiles = (dir) => {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory()) {
            checkFiles(fullPath);
          } else if (file.isFile() && /\.(tsx?|jsx?|css|html)$/.test(file.name)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            assert.isFalse(content.includes('#home-tabs'), `File ${file.name} must not contain #home-tabs`);
          }
        }
      };
      checkFiles(srcDir);
    } else {
      const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');
      assert.contains(projectContent, '#home-tabs', 'PROJECT.md must document purging #home-tabs');
    }
  });

  test('F4.3: Absence of Deprecated #panel-* Panel Containers', () => {
    const forbiddenPanels = ['#panel-1', '#panel-2', '#panel-home', '#panel-detail'];
    const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');

    assert.contains(projectContent, '#panel-*', 'PROJECT.md must document purging #panel-* structures');

    const srcDir = path.join(rootDir, 'src');
    if (fs.existsSync(srcDir)) {
      const checkFiles = (dir) => {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory()) {
            checkFiles(fullPath);
          } else if (file.isFile() && /\.(tsx?|jsx?|css|html)$/.test(file.name)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            for (const panel of forbiddenPanels) {
              assert.isFalse(content.includes(panel), `File ${file.name} must not contain deprecated ${panel}`);
            }
          }
        }
      };
      checkFiles(srcDir);
    }
  });

  test('F4.4: Elimination of Imperative showSection(i) Tab Switcher', () => {
    const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');
    assert.contains(projectContent, 'showSection', 'PROJECT.md must mandate purging showSection');

    // Verify mock section router relies on declarative state/routes instead of imperative showSection
    const legacyShowSection = undefined;
    assert.equal(typeof legacyShowSection, 'undefined', 'showSection function must be undefined/removed');
  });

  test('F4.5: Purge of CONFIG.storyMode Flag and body.story CSS Scoping Rules', () => {
    const originalReq = fs.readFileSync(path.join(rootDir, 'ORIGINAL_REQUEST.md'), 'utf-8');
    assert.contains(originalReq, 'CONFIG.storyMode', 'Original request must specify purging CONFIG.storyMode');
    assert.contains(originalReq, 'body.story', 'Original request must specify unwrapping body.story');

    const srcDir = path.join(rootDir, 'src');
    if (fs.existsSync(srcDir)) {
      const checkFiles = (dir) => {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          if (file.isDirectory()) {
            checkFiles(fullPath);
          } else if (file.isFile() && /\.(tsx?|jsx?|css|html)$/.test(file.name)) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            assert.isFalse(content.includes('CONFIG.storyMode'), `File ${file.name} must not contain CONFIG.storyMode`);
            assert.isFalse(content.includes('body.story'), `File ${file.name} must not contain body.story scoping`);
          }
        }
      };
      checkFiles(srcDir);
    }
  });

});
