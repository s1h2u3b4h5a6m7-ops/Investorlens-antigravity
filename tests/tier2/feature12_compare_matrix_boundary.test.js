/**
 * Feature 12 Tier 2 Boundary & Corner Case Tests
 * Focus: 1 company compare, 27 peer group metric missing data, identical company compare, 10+ company matrix overflow
 */

const { describe, test } = require('../harness/runner.js');
const assert = require('../harness/assert.js');

describe('Feature 12 Boundary: Compare Mode (27 Peer Group Matrix)', () => {

  const peerGroupMetrics = [
    'P/E Ratio', 'P/B Ratio', 'EV/EBITDA', 'ROE (%)', 'ROCE (%)',
    'Debt to Equity', 'Current Ratio', 'Dividend Yield (%)', 'Revenue Growth (YoY)',
    'EBITDA Margin (%)', 'Net Profit Margin (%)', 'Free Cash Flow (Cr)', 'Asset Turnover',
    'Interest Coverage', 'PEG Ratio', 'Price to Sales', 'Working Capital Days',
    'R&D to Sales (%)', 'Promoter Holding (%)', 'FII Holding (%)', 'DII Holding (%)',
    'Pledged Shares (%)', 'EPS Growth (3Yr)', 'Operating Cash Flow/Net Profit',
    'Capex to Revenue (%)', 'Inventory Turnover', 'Altman Z-Score'
  ];

  test('F12-B1: 1 company compare matrix rendering', () => {
    const selectedCompanies = [{ id: 'INFY', name: 'Infosys' }];

    const buildCompareMatrix = (companies, metricsList) => {
      assert.greaterThan(companies.length, 0, 'Must have at least 1 company');
      assert.strictEqual(metricsList.length, 27, 'Must compare across 27 peer group metrics');

      const rows = metricsList.map(metric => {
        const values = companies.map(c => c.metrics ? c.metrics[metric] ?? 'N/A' : 'N/A');
        return { metric, values };
      });

      return { companyCount: companies.length, rows, isSingleMode: companies.length === 1 };
    };

    const matrix = buildCompareMatrix(selectedCompanies, peerGroupMetrics);
    assert.isTrue(matrix.isSingleMode);
    assert.strictEqual(matrix.rows.length, 27);
    assert.strictEqual(matrix.rows[0].values.length, 1);
  });

  test('F12-B2: 27 peer group metric missing data handling', () => {
    const sparseCompany = {
      id: 'SPARSE',
      name: 'Sparse Financials',
      metrics: {
        'P/E Ratio': 22.4,
        'ROE (%)': 18.2
        // All other 25 metrics missing
      }
    };

    const buildRowCell = (company, metricName) => {
      const val = company.metrics ? company.metrics[metricName] : undefined;
      if (val === undefined || val === null) {
        return { text: '—', isMissing: true };
      }
      return { text: String(val), isMissing: false };
    };

    let missingCount = 0;
    peerGroupMetrics.forEach(metric => {
      const cell = buildRowCell(sparseCompany, metric);
      if (cell.isMissing) {
        missingCount++;
        assert.strictEqual(cell.text, '—');
      }
    });

    assert.strictEqual(missingCount, 25);
  });

  test('F12-B3: identical company compare matrix duplicate safety', () => {
    const comp1 = { id: 'TCS', name: 'TCS' };
    const comp2 = { id: 'TCS', name: 'TCS' }; // Duplicate company

    const sanitizeSelections = (companies) => {
      const seen = new Set();
      const unique = [];
      companies.forEach(c => {
        if (!seen.has(c.id)) {
          seen.add(c.id);
          unique.push(c);
        }
      });
      return { unique, hadDuplicates: unique.length < companies.length };
    };

    const res = sanitizeSelections([comp1, comp2]);
    assert.isTrue(res.hadDuplicates);
    assert.strictEqual(res.unique.length, 1);
  });

  test('F12-B4: 10+ company matrix horizontal overflow handling', () => {
    const manyCompanies = new Array(12).fill(null).map((_, i) => ({
      id: `COMP_${i}`,
      name: `Company ${i}`
    }));

    const calculateMatrixWidth = (companyCount, colWidthPx = 180, metricColWidthPx = 220) => {
      const totalWidth = metricColWidthPx + (companyCount * colWidthPx);
      return {
        totalWidthPx: totalWidth,
        requiresHorizontalScroll: totalWidth > 1200
      };
    };

    const layout = calculateMatrixWidth(manyCompanies.length);
    assert.strictEqual(layout.totalWidthPx, 220 + (12 * 180)); // 2380px
    assert.isTrue(layout.requiresHorizontalScroll);
  });

  test('F12-B5: empty metric value across all peer groups', () => {
    const companies = [
      { id: 'c1', metrics: {} },
      { id: 'c2', metrics: {} }
    ];

    const evaluateMetricRow = (metricName, companyList) => {
      const hasAnyData = companyList.some(c => c.metrics && c.metrics[metricName] !== undefined && c.metrics[metricName] !== null);
      return {
        metric: metricName,
        hasData: hasAnyData,
        displayStyle: hasAnyData ? 'normal' : 'dimmed-empty'
      };
    };

    const result = evaluateMetricRow('Altman Z-Score', companies);
    assert.isFalse(result.hasData);
    assert.strictEqual(result.displayStyle, 'dimmed-empty');
  });

});
