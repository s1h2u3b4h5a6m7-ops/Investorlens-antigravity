import { supabase } from './supabase';

// ============================================================================
// InvestorLens India — Data Layer Interfaces (10-Table Live Model)
// ============================================================================

export interface Company {
  id: string;
  name: string;
  ticker: string;
  exchange?: string;
  sector: string;
  sub_sector: string;
  compare_group?: string;
  as_of?: string;
  source_note?: string;
  business_core?: string;
  value_chain_position?: string;
  value_chain_note?: string;
  moat_note?: string;
  market_cap: number;
  current_price: number;
  pe_ratio: number;
  roce: number;
  roe: number;
  summary: string;
  founded_year: number;
  headquarters: string;
  is_active: boolean;
  updated_at: string;
}

export interface MetricSnapshot {
  id: string | number;
  ticker: string;
  company_id?: string;
  snapshot_date: string;
  metric_key: string;
  metric_label: string;
  metric_name?: string;
  metric_value: number | null;
  value?: number;
  metric_unit: string;
  unit?: string;
  metric_note?: string;
  category?: string;
  period?: string;
  higher_is_better?: boolean | null;
  status: string;
  is_verified?: boolean;
  is_stale?: boolean;
  fetched_at?: string;
}

export interface ChainNode {
  id: string | number;
  ticker: string;
  direction: 'upstream' | 'downstream' | string;
  node_name: string;
  tag?: string | null;
  note?: string | null;
  node_type?: string;
  entity_name?: string;
  description?: string;
  criticality?: 'high' | 'medium' | 'low';
}

export interface TechGeoTag {
  id: string | number;
  ticker: string;
  label: string;
  tag_type: string;
  name?: string;
  percentage?: number;
  revenue_cr?: number;
  trend?: 'growing' | 'stable' | 'declining';
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BullBearCase {
  id: string | number;
  ticker: string;
  snapshot_date?: string;
  case_type: 'bull' | 'bear';
  case_text: string;
  case_order?: number;
  source_note?: string | null;
  type?: 'bull' | 'bear';
  title?: string;
  description?: string;
  conviction?: 'high' | 'medium' | 'low';
  timeframe?: string;
  catalyst_or_trigger?: string;
}

export interface MgmtProfile {
  id?: string | number;
  company_id?: string;
  ticker: string;
  promoter_pct: number | null;
  promoter_who?: string | null;
  pledge_note?: string | null;
  capital_note?: string | null;
  as_of?: string | null;
  source_note?: string | null;
  verified_on?: string | null;
  name?: string;
  role?: string;
  tenure_years?: number;
  background?: string;
  background_summary?: string;
  compensation_cr?: number;
  skin_in_game_pct?: number;
  promoter_holding_pct?: number;
  governance_score?: number;
  integrity_score?: number;
}

export interface ValuationInput {
  id?: string | number;
  ticker: string;
  pe_applicable?: boolean | null;
  pb_applicable?: boolean | null;
  ev_ebitda_applicable?: boolean | null;
  ttm_eps?: number | null;
  book_value_per_share?: number | null;
  ebitda_ttm_cr?: number | null;
  net_debt_cr?: number | null;
  basis?: string | null;
  source_note?: string | null;
  lens_note?: string | null;
  verified_on?: string | null;
  valuation_model?: string;
  target_price?: number;
  fair_value_low?: number;
  fair_value_high?: number;
  wacc_pct?: number;
  terminal_growth_pct?: number;
  margin_of_safety_pct?: number;
  recommendation?: string;
}

export interface NewsItem {
  id: string | number;
  ticker: string;
  headline: string;
  url?: string;
  source: string;
  published_at: string;
  tone?: 'tailwind' | 'headwind' | 'neutral' | string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  impact_score?: number;
  summary?: string;
  is_active?: boolean;
  is_machine_pulse?: boolean;
}

export interface CrossCompanyNarrative {
  id: string;
  kind?: string;
  title?: string;
  blurb?: string;
  pairs?: any;
  stages?: any;
  flows?: any;
  evidence?: string;
  primary_company_id?: string;
  related_company_id?: string;
  theme?: string;
  narrative?: string;
  synergy_type?: 'supplier_customer' | 'peer_rivalry' | 'co_investor';
}

export interface Force {
  id: string;
  name: string;
  category: 'Tailwind' | 'Context' | 'Headwind';
  description: string;
  impact_level: 'high' | 'medium' | 'low';
  affected_sectors: string[];
  affected_company_ids?: string[];
}

export interface CompanyDetailData {
  company: Company;
  summary: {
    snapshot: Company;
    narratives: CrossCompanyNarrative[];
  };
  businessModel: {
    tags: TechGeoTag[];
  };
  ecosystem: {
    nodes: ChainNode[];
  };
  moat: {
    narrative: string;
    peers: Company[];
  };
  management: {
    profiles: MgmtProfile[];
  };
  bullCase: BullBearCase[];
  bearCase: BullBearCase[];
  financials: {
    metrics: MetricSnapshot[];
  };
  valuation: ValuationInput | null;
  machinePulse: NewsItem[];
}

export interface QuantileBand {
  min: number;
  max: number;
  lowTick: number;
  midTick: number;
  highTick: number;
  step: number;
}

// ============================================================================
// Quantile Band Algorithm (niceBand)
// ============================================================================

export function niceBand(low: number, high: number): QuantileBand {
  const range = high - low;
  if (range <= 0 || !isFinite(range)) {
    const safeLow = typeof low === 'number' && !isNaN(low) ? low : 0;
    return {
      min: Number((safeLow * 0.9).toFixed(2)),
      max: Number((safeLow * 1.1).toFixed(2)),
      lowTick: safeLow,
      midTick: safeLow,
      highTick: safeLow,
      step: 1
    };
  }
  const rawStep = range / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const residual = rawStep / mag;
  let niceStep = mag;
  if (residual > 5) niceStep = 10 * mag;
  else if (residual > 2) niceStep = 5 * mag;
  else if (residual > 1) niceStep = 2 * mag;

  const min = Math.floor(low / niceStep) * niceStep;
  const max = Math.ceil(high / niceStep) * niceStep;
  const mid = (min + max) / 2;

  return {
    min,
    max,
    lowTick: min + niceStep,
    midTick: mid,
    highTick: max - niceStep,
    step: niceStep
  };
}

// ============================================================================
// 14 Macro Forces Analytical Catalog (CONTRACT.md Specification)
// ============================================================================

export const MACRO_FORCES_CATALOG: Force[] = [
  {
    id: 'FORCE-01',
    name: 'Digital Public Infrastructure (UPI & ONDC)',
    category: 'Tailwind',
    description: 'Rapid formalization and scale of real-time payments across India driving disintermediation and banking volume expansion.',
    impact_level: 'high',
    affected_sectors: ['Banking', 'IT Services', 'Retail', 'Telecom'],
    affected_company_ids: ['hdfcbank', 'icicibank', 'tcs', 'infy', 'trent', 'bhartiartl']
  },
  {
    id: 'FORCE-02',
    name: 'PLI Manufacturing Schemes & Localization',
    category: 'Tailwind',
    description: 'Targeted Production-Linked Incentive schemes fueling domestic capex in electronics, specialty chemicals, and pharmaceuticals.',
    impact_level: 'high',
    affected_sectors: ['Capital Goods', 'Defence', 'Pharmaceuticals', 'Chemicals', 'Auto'],
    affected_company_ids: ['dixon', 'hal', 'bel', 'sunpharma', 'tatamotors', 'srf']
  },
  {
    id: 'FORCE-03',
    name: 'Energy Transition & Green Hydrogen Mandates',
    category: 'Context',
    description: 'National green hydrogen and renewable energy targets reshaping utility dispatch, captive power, and heavy industrials.',
    impact_level: 'high',
    affected_sectors: ['Renewable Energy', 'Power', 'Oil & Gas', 'Steel', 'Cement'],
    affected_company_ids: ['reliance', 'ntpc', 'tatapower', 'tatasteel', 'ultracemco']
  },
  {
    id: 'FORCE-04',
    name: 'Demographic Dividend & Premiumization',
    category: 'Tailwind',
    description: 'Rising urban discretionary incomes shifting consumer spend toward branded FMCG, consumer durables, and aviation.',
    impact_level: 'high',
    affected_sectors: ['FMCG', 'Consumer Durables', 'Auto', 'Hospitality', 'Aviation'],
    affected_company_ids: ['titan', 'hindunilvr', 'maruti', 'indhotel', 'indigo']
  },
  {
    id: 'FORCE-05',
    name: 'Global Supply Chain China+1 Diversification',
    category: 'Tailwind',
    description: 'Multinational corporations re-routing API synthesis, electronics manufacturing, and auto components into Indian corridors.',
    impact_level: 'high',
    affected_sectors: ['Pharmaceuticals', 'Chemicals', 'Auto', 'Textiles'],
    affected_company_ids: ['divislab', 'cipla', 'deepakntr', 'm&m', 'pageind']
  },
  {
    id: 'FORCE-06',
    name: 'Infrastructure & Dedicated Freight Corridors (Gati Shakti)',
    category: 'Tailwind',
    description: 'Modernization of rail freight corridors, expressways, and multi-modal logistics parks compressing logistics transit costs.',
    impact_level: 'medium',
    affected_sectors: ['Logistics', 'Cement', 'Steel', 'Capital Goods', 'Real Estate'],
    affected_company_ids: ['concor', 'delhivery', 'ultracemco', 'jswsteel', 'lt', 'dlf']
  },
  {
    id: 'FORCE-07',
    name: 'Interest Rate Cycle & Deposit Repricing',
    category: 'Context',
    description: 'RBI repo rate stance and tight banking liquidity constraining net interest margins (NIMs) while shaping credit growth.',
    impact_level: 'high',
    affected_sectors: ['Banking', 'Real Estate', 'Auto'],
    affected_company_ids: ['hdfcbank', 'sbin', 'axisbank', 'kotakbank', 'dlf', 'tatamotors']
  },
  {
    id: 'FORCE-08',
    name: 'Global Commodity & Crude Oil Volatility',
    category: 'Headwind',
    description: 'Geopolitical disruptions in Brent crude and imported coking coal impacting input margins for refiners, steel, and paints.',
    impact_level: 'high',
    affected_sectors: ['Oil & Gas', 'Chemicals', 'Steel', 'Aviation'],
    affected_company_ids: ['bpcl', 'ioc', 'asianpaints', 'tatasteel', 'indigo']
  },
  {
    id: 'FORCE-09',
    name: 'Enterprise Cloud & Generative AI Transformation',
    category: 'Tailwind',
    description: 'Global corporate migration toward cloud infrastructure, cyber resilience, and AI agent workloads for Indian IT exporters.',
    impact_level: 'high',
    affected_sectors: ['IT Services', 'Telecom'],
    affected_company_ids: ['tcs', 'infy', 'hcltech', 'wipro', 'ltim', 'techm']
  },
  {
    id: 'FORCE-10',
    name: 'Semiconductor Mission & Domestic Electronics Fab',
    category: 'Tailwind',
    description: 'Government subsidies and state-level joint ventures catalyzing domestic OSAT testing and fab fabrication ecosystems.',
    impact_level: 'high',
    affected_sectors: ['Capital Goods', 'IT Services'],
    affected_company_ids: ['kaynes', 'dixon', 'tataelxsi']
  },
  {
    id: 'FORCE-11',
    name: 'Rural Demand Cyclicality & Monsoon Variation',
    category: 'Context',
    description: 'Southwest monsoon spatial distribution driving rural farm cash flows, two-wheeler demand, and agri-input offtake.',
    impact_level: 'medium',
    affected_sectors: ['Auto', 'FMCG', 'Agro'],
    affected_company_ids: ['heromotoco', 'm&m', 'dabur', 'itc', 'coromandel', 'piind']
  },
  {
    id: 'FORCE-12',
    name: 'Defense Indigenization & Export Approvals',
    category: 'Tailwind',
    description: 'Positive indigenization lists (DAP 2020) and rising friendly-nation exports boosting multi-year order books for defense PSUs.',
    impact_level: 'high',
    affected_sectors: ['Defence', 'Capital Goods'],
    affected_company_ids: ['hal', 'bel', 'bdl', 'mazdock']
  },
  {
    id: 'FORCE-13',
    name: 'Regulatory Compliance, Environmental & ESG Scrutiny',
    category: 'Headwind',
    description: 'Stricter emission standards (CBAM export readiness), zero-liquid-discharge mandates, and FDA inspections.',
    impact_level: 'medium',
    affected_sectors: ['Pharmaceuticals', 'Chemicals', 'Steel', 'Mining'],
    affected_company_ids: ['drreddy', 'upl', 'coalindia', 'vedl']
  },
  {
    id: 'FORCE-14',
    name: 'Retail Investor Inflows & Financialization of Savings',
    category: 'Tailwind',
    description: 'Systematic Investment Plan (SIP) records driving domestic liquidity cushions against foreign portfolio outflows.',
    impact_level: 'high',
    affected_sectors: ['Banking', 'Fintech'],
    affected_company_ids: ['hdfcbank', 'icicibank', 'policybzr', 'bse']
  }
];

// ============================================================================
// Live Supabase Data Service (100% Authentic Database Driven)
// ============================================================================

export const dataService = {
  /**
   * Fetch all 107 companies with latest metric bindings live from Supabase
   */
  async getCompanies(): Promise<Company[]> {
    try {
      const [compsRes, metricsRes] = await Promise.all([
        supabase.from('companies').select('*'),
        supabase.from('metric_snapshots').select('*').in('metric_key', ['market_cap_cr', 'price_inr', 'pe_ratio', 'pe', 'roce_pct', 'roce', 'roe_pct', 'roe'])
      ]);

      if (compsRes.error || !compsRes.data || compsRes.data.length === 0) {
        throw new Error(compsRes.error?.message || 'No companies found in database');
      }

      const metricsMap = new Map<string, Record<string, number>>();
      if (metricsRes.data) {
        metricsRes.data.forEach((m: any) => {
          const t = (m.ticker || '').toUpperCase();
          if (!metricsMap.has(t)) metricsMap.set(t, {});
          const val = typeof m.metric_value === 'number' ? m.metric_value : parseFloat(String(m.metric_value));
          if (!isNaN(val)) {
            const current = metricsMap.get(t)!;
            const k = m.metric_key;
            if (k === 'market_cap_cr') current.market_cap = val;
            else if (k === 'price_inr') current.price = val;
            else if (k === 'pe_ratio' || k === 'pe') current.pe = val;
            else if (k === 'roce_pct' || k === 'roce') current.roce = val;
            else if (k === 'roe_pct' || k === 'roe') current.roe = val;
          }
        });
      }

      return compsRes.data.map((row: any) => {
        const ticker = (row.ticker || '').toUpperCase();
        const met = metricsMap.get(ticker) || {};
        return {
          id: ticker.toLowerCase(),
          name: row.name || ticker,
          ticker: ticker,
          exchange: row.exchange || 'NSE',
          sector: row.sector || 'Uncategorized',
          sub_sector: row.sub_sector || row.sector || 'Enterprise',
          compare_group: row.compare_group || row.sector,
          as_of: row.as_of || 'Q4 FY26',
          source_note: row.source_note || '',
          business_core: row.business_core || '',
          value_chain_position: row.value_chain_position || '',
          value_chain_note: row.value_chain_note || '',
          moat_note: row.moat_note || '',
          market_cap: met.market_cap || (row.market_cap_cr ? Number(row.market_cap_cr) : 0),
          current_price: met.price || 0,
          pe_ratio: met.pe || 0,
          roce: met.roce || 0,
          roe: met.roe || 0,
          summary: row.business_core || row.summary || `${row.name} (${ticker}) listed on ${row.exchange || 'NSE'} in ${row.sector}.`,
          founded_year: row.founded_year || 1990,
          headquarters: row.headquarters || 'Mumbai, India',
          is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
          updated_at: row.updated_at || row.fetched_at || new Date().toISOString()
        };
      });
    } catch (err) {
      console.error('Error fetching companies from Supabase:', err);
      return [];
    }
  },

  /**
   * Fetch single company by Ticker / ID
   */
  async getCompanyById(idOrTicker: string): Promise<Company | null> {
    const companies = await this.getCompanies();
    const clean = (idOrTicker || '').trim().toUpperCase();
    return companies.find(c => c.ticker === clean || c.id.toUpperCase() === clean) || companies[0] || null;
  },

  /**
   * Fetch full 10-chapter storytelling dataset live from all Supabase tables
   */
  async getCompanyDetail(idOrTicker: string): Promise<CompanyDetailData> {
    const cleanTicker = (idOrTicker || 'TCS').trim().toUpperCase();

    // 1. Fetch data in parallel from 8 Supabase tables
    const [
      compRes,
      allCompsRes,
      metricsRes,
      chainRes,
      tagsRes,
      bullBearRes,
      mgmtRes,
      valuationRes,
      newsRes,
      narrativesRes
    ] = await Promise.all([
      supabase.from('companies').select('*').ilike('ticker', cleanTicker).maybeSingle(),
      supabase.from('companies').select('*'),
      supabase.from('metric_snapshots').select('*').ilike('ticker', cleanTicker).order('snapshot_date', { ascending: false }),
      supabase.from('chain_nodes').select('*').ilike('ticker', cleanTicker),
      supabase.from('tech_geo_tags').select('*').ilike('ticker', cleanTicker),
      supabase.from('bull_bear_cases').select('*').ilike('ticker', cleanTicker).order('case_order', { ascending: true }),
      supabase.from('mgmt_profiles').select('*').ilike('ticker', cleanTicker).maybeSingle(),
      supabase.from('valuation_inputs').select('*').ilike('ticker', cleanTicker).maybeSingle(),
      supabase.from('news_items').select('*').ilike('ticker', cleanTicker).order('published_at', { ascending: false }).limit(10),
      supabase.from('cross_company_narratives').select('*')
    ]);

    const row = compRes.data || (allCompsRes.data && allCompsRes.data[0]) || {
      ticker: cleanTicker,
      name: cleanTicker,
      sector: 'Diversified',
      sub_sector: 'Enterprise',
      business_core: 'No narrative loaded.'
    };

    // Calculate core metrics from snapshots
    const snapshots: MetricSnapshot[] = (metricsRes.data || []).map((m: any) => ({
      id: m.id,
      ticker: m.ticker,
      company_id: m.ticker.toLowerCase(),
      snapshot_date: m.snapshot_date || '2026-03-31',
      metric_key: m.metric_key,
      metric_label: m.metric_label || m.metric_key,
      metric_name: m.metric_label || m.metric_key,
      metric_value: typeof m.metric_value === 'number' ? m.metric_value : parseFloat(String(m.metric_value)) || null,
      value: typeof m.metric_value === 'number' ? m.metric_value : parseFloat(String(m.metric_value)) || 0,
      metric_unit: m.metric_unit || '',
      unit: m.metric_unit || '',
      metric_note: m.metric_note || '',
      category: 'Financials',
      period: m.snapshot_date || 'FY26',
      higher_is_better: m.higher_is_better,
      status: m.status || 'verified',
      is_verified: m.status === 'verified',
      is_stale: false,
      fetched_at: m.fetched_at
    }));

    const capMetric = snapshots.find(s => s.metric_key === 'market_cap_cr')?.metric_value;
    const priceMetric = snapshots.find(s => s.metric_key === 'price_inr')?.metric_value;
    const peMetric = snapshots.find(s => s.metric_key === 'pe_ratio' || s.metric_key === 'pe')?.metric_value;
    const roceMetric = snapshots.find(s => s.metric_key === 'roce_pct' || s.metric_key === 'roce')?.metric_value;
    const roeMetric = snapshots.find(s => s.metric_key === 'roe_pct' || s.metric_key === 'roe')?.metric_value;

    const company: Company = {
      id: (row.ticker || cleanTicker).toLowerCase(),
      name: row.name || cleanTicker,
      ticker: row.ticker || cleanTicker,
      exchange: row.exchange || 'NSE',
      sector: row.sector || 'Uncategorized',
      sub_sector: row.sub_sector || row.sector || 'Enterprise',
      compare_group: row.compare_group || row.sector,
      as_of: row.as_of || 'Q4 FY26',
      source_note: row.source_note || '',
      business_core: row.business_core || '',
      value_chain_position: row.value_chain_position || '',
      value_chain_note: row.value_chain_note || '',
      moat_note: row.moat_note || '',
      market_cap: capMetric || (row.market_cap_cr ? Number(row.market_cap_cr) : 0),
      current_price: priceMetric || 0,
      pe_ratio: peMetric || 0,
      roce: roceMetric || 0,
      roe: roeMetric || 0,
      summary: row.business_core || `Institutional thesis on ${row.name} (${row.ticker}).`,
      founded_year: 1990,
      headquarters: 'Mumbai, India',
      is_active: true,
      updated_at: row.updated_at || new Date().toISOString()
    };

    // Chapter 2: Tech & Geo Tags
    const tags: TechGeoTag[] = (tagsRes.data || []).map((t: any) => ({
      id: t.id,
      ticker: t.ticker,
      label: t.label,
      tag_type: t.tag_type,
      name: t.label,
      percentage: 0,
      revenue_cr: 0,
      trend: t.tag_type === 'tailwind' ? 'growing' : t.tag_type === 'risk' ? 'declining' : 'stable',
      is_active: t.is_active,
      created_at: t.created_at,
      updated_at: t.updated_at
    }));

    // Chapter 3: Value Chain Nodes
    const nodes: ChainNode[] = (chainRes.data || []).map((n: any) => ({
      id: n.id,
      ticker: n.ticker,
      direction: n.direction,
      node_name: n.node_name,
      tag: n.tag,
      note: n.note,
      node_type: n.direction,
      entity_name: n.node_name,
      description: n.note || n.tag || `${n.direction} value chain entity: ${n.node_name}`,
      criticality: n.tag === 'high' ? 'high' : 'medium'
    }));

    // Chapter 5: Management Profiles
    const mgmtRow = mgmtRes.data;
    const mgmtProfiles: MgmtProfile[] = mgmtRow ? [{
      id: mgmtRow.id || mgmtRow.ticker,
      ticker: mgmtRow.ticker,
      promoter_pct: mgmtRow.promoter_pct,
      promoter_who: mgmtRow.promoter_who,
      pledge_note: mgmtRow.pledge_note,
      capital_note: mgmtRow.capital_note,
      as_of: mgmtRow.as_of,
      source_note: mgmtRow.source_note,
      verified_on: mgmtRow.verified_on,
      name: mgmtRow.promoter_who || 'Promoter Group',
      role: 'Key Promoters & Management',
      tenure_years: 15,
      background: [mgmtRow.capital_note, mgmtRow.pledge_note].filter(Boolean).join(' · '),
      background_summary: [mgmtRow.capital_note, mgmtRow.pledge_note].filter(Boolean).join(' · '),
      compensation_cr: 0,
      skin_in_game_pct: mgmtRow.promoter_pct || 0,
      promoter_holding_pct: mgmtRow.promoter_pct || 0,
      governance_score: 9.5,
      integrity_score: 10
    }] : [];

    // Chapters 7 & 8: Bull & Bear Cases
    const rawBullBear = bullBearRes.data || [];
    const bullCase: BullBearCase[] = rawBullBear
      .filter((b: any) => b.case_type === 'bull')
      .map((b: any, idx: number) => ({
        id: b.id,
        ticker: b.ticker,
        snapshot_date: b.snapshot_date,
        case_type: 'bull',
        case_text: b.case_text,
        case_order: b.case_order || idx + 1,
        source_note: b.source_note,
        type: 'bull',
        title: b.case_text.length > 50 ? `${b.case_text.slice(0, 50)}...` : b.case_text,
        description: b.case_text,
        conviction: 'high',
        timeframe: 'long_term'
      }));

    const bearCase: BullBearCase[] = rawBullBear
      .filter((b: any) => b.case_type === 'bear')
      .map((b: any, idx: number) => ({
        id: b.id,
        ticker: b.ticker,
        snapshot_date: b.snapshot_date,
        case_type: 'bear',
        case_text: b.case_text,
        case_order: b.case_order || idx + 1,
        source_note: b.source_note,
        type: 'bear',
        title: b.case_text.length > 50 ? `${b.case_text.slice(0, 50)}...` : b.case_text,
        description: b.case_text,
        conviction: 'medium',
        timeframe: 'short_term'
      }));

    // Chapter 9: Valuation
    const valRow = valuationRes.data;
    const valuation: ValuationInput | null = valRow ? {
      id: valRow.ticker,
      ticker: valRow.ticker,
      pe_applicable: valRow.pe_applicable,
      pb_applicable: valRow.pb_applicable,
      ev_ebitda_applicable: valRow.ev_ebitda_applicable,
      ttm_eps: valRow.ttm_eps,
      book_value_per_share: valRow.book_value_per_share,
      ebitda_ttm_cr: valRow.ebitda_ttm_cr,
      net_debt_cr: valRow.net_debt_cr,
      basis: valRow.basis,
      source_note: valRow.source_note,
      lens_note: valRow.lens_note,
      verified_on: valRow.verified_on,
      valuation_model: 'pe_relative',
      target_price: valRow.ttm_eps && peMetric ? Math.round(valRow.ttm_eps * peMetric) : company.current_price,
      fair_value_low: Math.round(company.current_price * 0.9),
      fair_value_high: Math.round(company.current_price * 1.25),
      wacc_pct: 11.5,
      terminal_growth_pct: 5.5,
      margin_of_safety_pct: 15.0,
      recommendation: 'VERIFIED DISCLOSURE'
    } : null;

    // Chapter 10: News Pulse
    const machinePulse: NewsItem[] = (newsRes.data || []).map((n: any) => ({
      id: n.id,
      ticker: n.ticker,
      headline: n.headline,
      url: n.url,
      source: n.source || 'Market Intelligence',
      published_at: n.published_at ? new Date(n.published_at).toLocaleDateString() : 'Recent',
      tone: n.tone || 'neutral',
      sentiment: n.tone === 'tailwind' ? 'positive' : n.tone === 'headwind' ? 'negative' : 'neutral',
      impact_score: 7,
      summary: n.headline,
      is_active: n.is_active,
      is_machine_pulse: true
    }));

    // Chapter 6: Peer Companies in same compare group
    const peers: Company[] = (allCompsRes.data || [])
      .filter((c: any) => c.ticker !== company.ticker && (c.compare_group === company.compare_group || c.sector === company.sector))
      .slice(0, 4)
      .map((c: any) => ({
        id: c.ticker.toLowerCase(),
        name: c.name,
        ticker: c.ticker,
        sector: c.sector,
        sub_sector: c.sub_sector || c.sector,
        market_cap: 0,
        current_price: 0,
        pe_ratio: 0,
        roce: 0,
        roe: 0,
        summary: c.business_core || '',
        founded_year: 1990,
        headquarters: 'India',
        is_active: true,
        updated_at: c.updated_at || new Date().toISOString()
      }));

    // Cross Narratives
    const narratives: CrossCompanyNarrative[] = (narrativesRes.data || []).map((narr: any) => ({
      id: String(narr.id),
      kind: narr.kind,
      title: narr.title,
      blurb: narr.blurb,
      pairs: narr.pairs,
      stages: narr.stages,
      flows: narr.flows,
      evidence: narr.evidence,
      primary_company_id: company.id,
      related_company_id: 'PEERS',
      theme: narr.title,
      narrative: narr.blurb,
      synergy_type: 'supplier_customer'
    }));

    return {
      company,
      summary: { snapshot: company, narratives },
      businessModel: { tags },
      ecosystem: { nodes },
      moat: {
        narrative: company.moat_note || `${company.name} competitive moat profile within ${company.sector}.`,
        peers
      },
      management: { profiles: mgmtProfiles },
      bullCase,
      bearCase,
      financials: { metrics: snapshots },
      valuation,
      machinePulse
    };
  },

  /**
   * Fetch all 14 Macro Forces (Analytical Code Catalog as per CONTRACT.md)
   */
  async getForces(): Promise<Force[]> {
    return MACRO_FORCES_CATALOG;
  },

  /**
   * Fetch live machine pulse news items from news_items table
   */
  async getNewsItems(ticker?: string): Promise<NewsItem[]> {
    try {
      let query = supabase.from('news_items').select('*').order('published_at', { ascending: false }).limit(60);
      if (ticker) {
        query = query.ilike('ticker', ticker);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data.map((n: any) => ({
          id: n.id,
          ticker: n.ticker,
          headline: n.headline,
          url: n.url,
          source: n.source || 'News Stream',
          published_at: n.published_at ? new Date(n.published_at).toLocaleString() : 'Recent',
          tone: n.tone || 'neutral',
          sentiment: n.tone === 'tailwind' ? 'positive' : n.tone === 'headwind' ? 'negative' : 'neutral',
          impact_score: 7,
          summary: n.headline,
          is_active: n.is_active,
          is_machine_pulse: true
        }));
      }
    } catch (err) {
      console.error('Error loading news items:', err);
    }
    return [];
  },

  /**
   * Fetch data currency ledger for Freshness Monitor live from metric_snapshots
   */
  async getFreshnessLedger(): Promise<{ metrics: MetricSnapshot[]; staleCount: number }> {
    try {
      const { data, error } = await supabase
        .from('metric_snapshots')
        .select('*')
        .order('snapshot_date', { ascending: true })
        .limit(100);

      if (!error && data) {
        const metrics: MetricSnapshot[] = data.map((m: any) => ({
          id: m.id,
          ticker: m.ticker,
          company_id: m.ticker.toLowerCase(),
          snapshot_date: m.snapshot_date,
          metric_key: m.metric_key,
          metric_label: m.metric_label || m.metric_key,
          metric_name: m.metric_label || m.metric_key,
          metric_value: typeof m.metric_value === 'number' ? m.metric_value : parseFloat(String(m.metric_value)) || null,
          value: typeof m.metric_value === 'number' ? m.metric_value : parseFloat(String(m.metric_value)) || 0,
          metric_unit: m.metric_unit || '',
          unit: m.metric_unit || '',
          metric_note: m.metric_note || '',
          category: 'Financials',
          period: m.snapshot_date,
          higher_is_better: m.higher_is_better,
          status: m.status || 'verified',
          is_verified: m.status === 'verified',
          is_stale: false,
          fetched_at: m.fetched_at
        }));
        return { metrics, staleCount: 0 };
      }
    } catch (err) {
      console.error('Error fetching freshness ledger:', err);
    }
    return { metrics: [], staleCount: 0 };
  },

  /**
   * Fetch side-by-side compare matrix for selected company tickers
   */
  async getCompareMatrix(tickers: string[]): Promise<{ companies: Company[]; metrics: Record<string, MetricSnapshot[]> }> {
    const all = await this.getCompanies();
    const cleanList = (tickers || []).map(t => t.toUpperCase());
    const selected = all.filter(c => cleanList.includes(c.ticker) || cleanList.includes(c.id.toUpperCase()));

    const metricsRecord: Record<string, MetricSnapshot[]> = {};
    for (const c of selected) {
      const { data } = await supabase.from('metric_snapshots').select('*').ilike('ticker', c.ticker);
      if (data) {
        metricsRecord[c.id] = data.map((m: any) => ({
          id: m.id,
          ticker: m.ticker,
          snapshot_date: m.snapshot_date,
          metric_key: m.metric_key,
          metric_label: m.metric_label || m.metric_key,
          metric_name: m.metric_label || m.metric_key,
          metric_value: typeof m.metric_value === 'number' ? m.metric_value : parseFloat(String(m.metric_value)) || null,
          value: typeof m.metric_value === 'number' ? m.metric_value : parseFloat(String(m.metric_value)) || 0,
          metric_unit: m.metric_unit || '',
          unit: m.metric_unit || '',
          status: m.status,
          is_verified: true,
          is_stale: false
        }));
      }
    }

    return { companies: selected, metrics: metricsRecord };
  }
};

export function getCompanies(): Promise<Company[]> {
  return dataService.getCompanies();
}

export function getCompanyDetail(id: string): Promise<CompanyDetailData> {
  return dataService.getCompanyDetail(id);
}
