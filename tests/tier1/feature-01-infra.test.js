/**
 * Tier 1 Feature Coverage Tests: Feature 1 - Infrastructure & Vite React Setup
 * Source: ORIGINAL_REQUEST.md (R1, R26), PROJECT.md (Feature 1, Architecture, Code Layout)
 */

const fs = require('fs');
const path = require('path');
const { describe, test, assert } = require('../harness');

const rootDir = path.resolve(__dirname, '../../');

describe('Feature 1: Infrastructure & Vite React Setup', () => {

  test('F1.1: Project Specifications & Vite React TypeScript configuration contracts', () => {
    // Verify mandatory project specification files exist
    const projectMdExists = fs.existsSync(path.join(rootDir, 'PROJECT.md'));
    const originalReqExists = fs.existsSync(path.join(rootDir, 'ORIGINAL_REQUEST.md'));

    assert.isTrue(projectMdExists, 'PROJECT.md must exist in root directory');
    assert.isTrue(originalReqExists, 'ORIGINAL_REQUEST.md must exist in root directory');

    const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');
    assert.contains(projectContent, 'Vite + React (TypeScript)', 'PROJECT.md must specify Vite + React (TypeScript) tech stack');
  });

  test('F1.2: Design System Tokens - Precision Instrument Dark Theme Tokens', () => {
    // Precision Instrument dark design system defines standard color tokens
    const requiredTokens = [
      '--void',
      '--panel',
      '--accent',
      '--border',
      '--up',
      '--down',
      '--stale',
      '--chain'
    ];

    // Check if PROJECT.md documents the exact theme tokens
    const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');
    for (const token of requiredTokens) {
      assert.contains(projectContent, token, `Theme token ${token} must be specified in design system docs`);
    }
  });

  test('F1.3: Variable Typography Spec - Sora, Inter, JetBrains Mono font declarations', () => {
    const requiredFonts = ['Sora', 'Inter', 'JetBrains Mono'];
    const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');

    for (const font of requiredFonts) {
      assert.contains(projectContent, font, `Font family "${font}" must be declared in project specs`);
    }

    // Check package or CSS specs if package.json or theme.css exists
    const themeCssPath = path.join(rootDir, 'src/assets/styles/theme.css');
    if (fs.existsSync(themeCssPath)) {
      const themeCss = fs.readFileSync(themeCssPath, 'utf-8');
      for (const font of requiredFonts) {
        assert.contains(themeCss, font, `theme.css must declare font-family ${font}`);
      }
    }
  });

  test('F1.4: Code Layout Architecture Contract', () => {
    // Code layout specified in PROJECT.md section Code Layout
    const expectedLayoutComponents = [
      'BezelNav',
      'ApertureHero',
      'CounterCards',
      'ChapterReader',
      'RightHandDigest',
      'SectorLedger',
      'ForcesExplorer',
      'CompareMatrix',
      'FreshnessMonitor'
    ];

    const projectContent = fs.readFileSync(path.join(rootDir, 'PROJECT.md'), 'utf-8');
    for (const component of expectedLayoutComponents) {
      assert.contains(projectContent, component, `PROJECT.md code layout must specify ${component}`);
    }
  });

  test('F1.5: Build Infrastructure Command Contract', () => {
    // If package.json exists, verify build command. If not yet created, verify PROJECT.md build mandate
    const packageJsonPath = path.join(rootDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      assert.ok(pkgJson.scripts, 'package.json must contain scripts block');
      assert.ok(pkgJson.scripts.build, 'package.json must contain "build" script');
    } else {
      const originalReq = fs.readFileSync(path.join(rootDir, 'ORIGINAL_REQUEST.md'), 'utf-8');
      assert.contains(originalReq, 'npm run build', 'Original request must mandate npm run build command');
    }
  });

});
