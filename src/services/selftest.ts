import { dataService, Company, MetricSnapshot, Force, MgmtProfile, MACRO_FORCES_CATALOG } from './dataService';

export interface AssertionDetail {
  id: string;
  name: string;
  expected: number | boolean | string;
  actual: number | boolean | string;
  passed: boolean;
  message: string;
  diagnostics?: string[];
}

export interface SelfTestDataInput {
  companies: Company[];
  metricSnapshots: MetricSnapshot[];
  forces: Force[];
  mgmtProfiles: MgmtProfile[];
}

export interface SelfTestResult {
  passed: boolean;          // True ONLY if passRate === 100.0
  passRate: number;        // Percentage (0.0 to 100.0)
  passedCount: number;     // Number of passed assertions (e.g. 4)
  totalCount: number;      // Total assertions evaluated (4)
  timestamp: string;       // ISO 8601 UTC timestamp
  durationMs: number;      // Test execution duration in milliseconds
  assertions: {
    companies: AssertionDetail;
    metrics: AssertionDetail;
    forces: AssertionDetail;
    mgmtProfiles: AssertionDetail;
  };
  summary: string;
}

export function runStartupSelfTest(inputData?: Partial<SelfTestDataInput>): SelfTestResult {
  const startTime = performance.now();
  const timestamp = new Date().toISOString();

  // If inputData is incomplete or missing, use provided or default validation set
  const forces = inputData?.forces || MACRO_FORCES_CATALOG;
  const companies = inputData?.companies || [];
  const metricSnapshots = inputData?.metricSnapshots || [];
  const mgmtProfiles = inputData?.mgmtProfiles || [];

  // Assertion 1: Company Count (107)
  const compCount = companies?.length || 0;
  const invalidCompIds = companies?.filter(c => !c.id || !c.name || !c.ticker || !c.sector).map(c => c.id || 'unknown') || [];
  const compPassed = compCount === 107 && invalidCompIds.length === 0;
  const companiesAssertion: AssertionDetail = {
    id: 'A1_COMPANIES',
    name: 'Companies Registry Count',
    expected: 107,
    actual: compCount,
    passed: compPassed,
    message: compPassed
      ? 'Verified 107 companies loaded cleanly.'
      : `Company count mismatch. Expected 107, got ${compCount}.${invalidCompIds.length ? ` Invalid entries: ${invalidCompIds.join(', ')}` : ''}`,
    diagnostics: invalidCompIds
  };

  // Assertion 2: Metric Bindings (492)
  const metricCount = metricSnapshots?.length || 0;
  const nullMetrics = metricSnapshots?.filter(m => !m.company_id || m.value === null || m.value === undefined) || [];
  const metricsPassed = metricCount === 492 && nullMetrics.length === 0;
  const metricsAssertion: AssertionDetail = {
    id: 'A2_METRIC_BINDINGS',
    name: 'Metric Snapshots Binding Count',
    expected: 492,
    actual: metricCount,
    passed: metricsPassed,
    message: metricsPassed
      ? 'Verified 492 metric bindings across 107 companies.'
      : `Metric bindings mismatch. Expected 492, got ${metricCount}.${nullMetrics.length ? ` Null bindings count: ${nullMetrics.length}` : ''}`,
    diagnostics: nullMetrics.map(m => `ID: ${m.id}, Company: ${m.company_id}, Metric: ${m.metric_key || m.metric_name}`)
  };

  // Assertion 3: Macro Forces Count (14)
  const forcesCount = forces?.length || 0;
  const invalidForces = forces?.filter(f => !f.id || !f.name || !['Tailwind', 'Context', 'Headwind'].includes(f.category)) || [];
  const forcesPassed = forcesCount === 14 && invalidForces.length === 0;
  const forcesAssertion: AssertionDetail = {
    id: 'A3_MACRO_FORCES',
    name: 'Macro Forces Classification Count',
    expected: 14,
    actual: forcesCount,
    passed: forcesPassed,
    message: forcesPassed
      ? 'Verified 14 macro forces categorised cleanly into Tailwind, Context, Headwind.'
      : `Macro forces mismatch. Expected 14, got ${forcesCount}.`,
    diagnostics: invalidForces.map(f => `Invalid force ID: ${f.id}`)
  };

  // Assertion 4: Verified Executive Profiles Coverage (All 107 companies covered)
  const companyIdsWithMgmt = new Set(mgmtProfiles?.map(p => (p.company_id || p.ticker || '').toLowerCase()) || []);
  const missingMgmtCompIds = companies?.filter(c => !companyIdsWithMgmt.has(c.id.toLowerCase()) && !companyIdsWithMgmt.has(c.ticker.toLowerCase())).map(c => c.id) || [];
  const mgmtPassed = missingMgmtCompIds.length === 0 && (companies?.length || 0) > 0;
  const mgmtAssertion: AssertionDetail = {
    id: 'A4_MGMT_PROFILES',
    name: 'Verified Executive Profile Coverage',
    expected: 107,
    actual: companyIdsWithMgmt.size,
    passed: mgmtPassed,
    message: mgmtPassed
      ? 'Verified executive profile records for all 107 companies.'
      : `Missing executive profiles for ${missingMgmtCompIds.length} companies: ${missingMgmtCompIds.slice(0, 5).join(', ')}${missingMgmtCompIds.length > 5 ? '...' : ''}`,
    diagnostics: missingMgmtCompIds
  };

  const assertionsList = [companiesAssertion, metricsAssertion, forcesAssertion, mgmtAssertion];
  const passedCount = assertionsList.filter(a => a.passed).length;
  const totalCount = assertionsList.length;
  const passRate = (passedCount / totalCount) * 100.0;
  const passed = passRate === 100.0;
  const durationMs = Math.round(performance.now() - startTime);

  const result: SelfTestResult = {
    passed,
    passRate,
    passedCount,
    totalCount,
    timestamp,
    durationMs,
    assertions: {
      companies: companiesAssertion,
      metrics: metricsAssertion,
      forces: forcesAssertion,
      mgmtProfiles: mgmtAssertion
    },
    summary: passed
      ? `100% PASSED (4/4 assertions verified in ${durationMs}ms: 107 companies, 492 metrics, 14 forces, 107 mgmt profiles)`
      : `SELF-TEST FAILED (${passedCount}/${totalCount} passed, ${passRate.toFixed(1)}%): See diagnostics for details.`
  };

  if (passed) {
    console.log(`[SelfTest Engine] ✓ ${result.summary}`);
  } else {
    console.error(`[SelfTest Engine] ❌ ${result.summary}`, result.assertions);
  }

  return result;
}
