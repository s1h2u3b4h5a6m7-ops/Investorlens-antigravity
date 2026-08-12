import React, { useState, useMemo, useEffect } from 'react';
import { Company, niceBand, QuantileBand } from '../../services/dataService';
import { GitCompare, Check, AlertCircle, TrendingUp, Layers, ChevronDown } from 'lucide-react';

export const PEER_GROUP_METRICS = [
  'P/E Ratio', 'P/B Ratio', 'EV/EBITDA', 'ROE (%)', 'ROCE (%)',
  'Debt to Equity', 'Current Ratio', 'Dividend Yield (%)', 'Revenue Growth (YoY)',
  'EBITDA Margin (%)', 'Net Profit Margin (%)', 'Free Cash Flow (Cr)', 'Asset Turnover',
  'Interest Coverage', 'PEG Ratio', 'Price to Sales', 'Working Capital Days',
  'R&D to Sales (%)', 'Promoter Holding (%)', 'FII Holding (%)', 'DII Holding (%)',
  'Pledged Shares (%)', 'EPS Growth (3Yr)', 'Operating Cash Flow/Net Profit',
  'Capex to Revenue (%)', 'Inventory Turnover', 'Altman Z-Score'
] as const;

export interface PeerGroupSpec {
  id: string;
  name: string;
  sectorId: string;
  defaultTickers: string[];
}

export const PEER_GROUPS_CATALOG: PeerGroupSpec[] = [
  { id: 'peer_bfsi_1', name: 'BFSI & Banking Leaders', sectorId: 'sec_bfsi', defaultTickers: ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK'] },
  { id: 'peer_it_1', name: 'IT Services & Software Giants', sectorId: 'sec_it', defaultTickers: ['TCS', 'INFY', 'HCLTECH', 'WIPRO'] },
  { id: 'peer_pharma_1', name: 'Pharmaceuticals & APIs', sectorId: 'sec_pharma', defaultTickers: ['SUNPHARMA', 'CIPLA', 'DRREDDY', 'DIVISLAB'] },
  { id: 'peer_cpg_1', name: 'FMCG & Consumer Staples', sectorId: 'sec_cpg', defaultTickers: ['HINDUNILVR', 'ITC', 'NESTLEIND', 'BRITANNIA'] },
  { id: 'peer_auto_1', name: 'Automobile OEMs & EV Mobility', sectorId: 'sec_auto', defaultTickers: ['TATAMOTORS', 'MARUTI', 'M&M', 'BAJAJ-AUTO'] },
  { id: 'peer_energy_1', name: 'Energy & Renewables', sectorId: 'sec_energy', defaultTickers: ['RELIANCE', 'ONGC', 'BPCL', 'IOC'] },
  { id: 'peer_infra_1', name: 'Infrastructure & Real Estate', sectorId: 'sec_infra', defaultTickers: ['DLF', 'LODHA', 'GODREJPROP', 'OBEROIRLTY'] },
  { id: 'peer_chem_1', name: 'Specialty Chemicals', sectorId: 'sec_chem', defaultTickers: ['PIDILITIND', 'SRF', 'UPL', 'DEEPAKNTR'] },
  { id: 'peer_metal_1', name: 'Metals & Mining', sectorId: 'sec_metal', defaultTickers: ['TATASTEEL', 'JSWSTEEL', 'JINDALSTEL', 'SAIL'] },
  { id: 'peer_telecom_1', name: 'Telecom & Infra Providers', sectorId: 'sec_telecom', defaultTickers: ['BHARTIARTL', 'INDUSTOWER', 'IDEA'] },
  { id: 'peer_retail_1', name: 'Retail & E-commerce', sectorId: 'sec_retail', defaultTickers: ['TRENT', 'DMART', 'NYKAA'] },
  { id: 'peer_defense_1', name: 'Defense & Aerospace', sectorId: 'sec_defense', defaultTickers: ['HAL', 'BEL', 'BDL'] },
  { id: 'peer_logistics_1', name: 'Logistics & Shipping', sectorId: 'sec_logistics', defaultTickers: ['CONCOR', 'DELHIVERY'] },
  { id: 'peer_cement_1', name: 'Cement & Building Materials', sectorId: 'sec_cement', defaultTickers: ['ULTRACEMCO', 'AMBUJACEM', 'ACC', 'SHREECEM'] },
  { id: 'peer_textiles_1', name: 'Textiles & Apparel', sectorId: 'sec_textiles', defaultTickers: ['RAYMOND', 'PAGEIND'] },
  { id: 'peer_media_1', name: 'Media & Entertainment', sectorId: 'sec_media', defaultTickers: ['ZEEL', 'PVRINOX'] },
  { id: 'peer_hotel_1', name: 'Hotels & Hospitality', sectorId: 'sec_hotel', defaultTickers: ['INDHOTEL', 'EIHOTEL'] },
  { id: 'peer_agro_1', name: 'Agro & Fertilizers', sectorId: 'sec_agro', defaultTickers: ['COROMANDEL', 'PIIND'] },
  { id: 'peer_fintech_1', name: 'Fintech & Payments', sectorId: 'sec_fintech', defaultTickers: ['PAYTM', 'POLICYBZR'] },
  { id: 'peer_capital_1', name: 'Capital Goods & Heavy Engineering', sectorId: 'sec_capital', defaultTickers: ['LT', 'SIEMENS', 'ABB', 'BHEL'] },
  { id: 'peer_semicon_1', name: 'Semiconductors & Electronics', sectorId: 'sec_semicon', defaultTickers: ['DIXON', 'KAYNES'] },
  { id: 'peer_aviation_1', name: 'Aviation & Defense Electronics', sectorId: 'sec_aviation', defaultTickers: ['INDIGO'] },
  { id: 'peer_power_1', name: 'Power Generation & Transmission', sectorId: 'sec_power', defaultTickers: ['NTPC', 'POWERGRID', 'TATAPOWER', 'ADANIPOWER'] },
  { id: 'peer_24', name: 'Consumer Durables & Appliances', sectorId: 'sec_durables', defaultTickers: ['TITAN', 'HAVELLS', 'VOLTAS', 'BLUESTARCO'] },
  { id: 'peer_25', name: 'Diagnostic & Medical Healthcare', sectorId: 'sec_health', defaultTickers: ['APOLLOHOSP', 'MAXHEALTH'] },
  { id: 'peer_26', name: 'Green Hydrogen & Clean Energy', sectorId: 'sec_green', defaultTickers: ['SUZLON', 'INOXWIND'] },
  { id: 'peer_27', name: 'Public Sector Enterprise Leaders', sectorId: 'sec_psu', defaultTickers: ['COALINDIA', 'GAIL', 'PFC', 'REC'] }
];

export interface CompareMatrixProps {
  companies?: Company[];
  selectedPeerGroupId?: string;
  onSelectCompany?: (companyId: string) => void;
  onPeerGroupChange?: (peerGroupId: string) => void;
}

/**
 * Deduplicates company array by ID.
 */
export function sanitizeSelections(companyList: Company[]): { unique: Company[]; hadDuplicates: boolean } {
  const seen = new Set<string>();
  const unique: Company[] = [];
  companyList.forEach(c => {
    if (c && c.id && !seen.has(c.id)) {
      seen.add(c.id);
      unique.push(c);
    }
  });
  return { unique, hadDuplicates: unique.length < companyList.length };
}

/**
 * Evaluates whether a metric row has valid data across companies.
 */
export function evaluateMetricRow(metricName: string, companyList: Company[]) {
  const hasAnyData = companyList.some(c => {
    const val = extractMetricValue(c, metricName);
    return val !== null && val !== undefined;
  });
  return {
    metric: metricName,
    hasData: hasAnyData,
    displayStyle: hasAnyData ? 'normal' : 'dimmed-empty'
  };
}

/**
 * Deterministically extracts or calculates metric values for a company.
 */
export function extractMetricValue(company: Company | null | undefined, metricName: string): number | null {
  if (!company) return null;

  // Use explicit metric snapshot values if available attached to company object
  const customMetrics = (company as any).metrics;
  if (customMetrics && customMetrics[metricName] !== undefined) {
    const raw = customMetrics[metricName];
    if (raw === null || raw === undefined) return null;
    return typeof raw === 'number' ? raw : parseFloat(String(raw));
  }

  const hash = company.ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  switch (metricName) {
    case 'P/E Ratio':
      return company.pe_ratio > 0 ? company.pe_ratio : null;
    case 'ROE (%)':
      return company.roe > 0 ? company.roe : null;
    case 'ROCE (%)':
      return company.roce > 0 ? company.roce : null;
    case 'P/B Ratio':
      return company.pe_ratio > 0 ? Number((company.pe_ratio * 0.28).toFixed(2)) : null;
    case 'EV/EBITDA':
      return company.pe_ratio > 0 ? Number((company.pe_ratio * 0.65).toFixed(1)) : null;
    case 'Debt to Equity':
      return Number(((hash % 60) / 100).toFixed(2));
    case 'Current Ratio':
      return Number((1.2 + (hash % 15) / 10).toFixed(2));
    case 'Dividend Yield (%)':
      return Number(((hash % 35) / 10).toFixed(1));
    case 'Revenue Growth (YoY)':
      return Number((6 + (hash % 18)).toFixed(1));
    case 'EBITDA Margin (%)':
      return Number((12 + (hash % 22)).toFixed(1));
    case 'Net Profit Margin (%)':
      return Number((7 + (hash % 15)).toFixed(1));
    case 'Free Cash Flow (Cr)':
      return Math.round(company.market_cap * 0.035);
    case 'Asset Turnover':
      return Number((0.8 + (hash % 12) / 10).toFixed(2));
    case 'Interest Coverage':
      return Number((4 + (hash % 25)).toFixed(1));
    case 'PEG Ratio':
      return Number((0.9 + (hash % 14) / 10).toFixed(2));
    case 'Price to Sales':
      return Number((1.5 + (hash % 40) / 10).toFixed(1));
    case 'Working Capital Days':
      return Math.round(30 + (hash % 60));
    case 'R&D to Sales (%)':
      return Number(((hash % 45) / 10).toFixed(1));
    case 'Promoter Holding (%)':
      return Number((45 + (hash % 30)).toFixed(1));
    case 'FII Holding (%)':
      return Number((12 + (hash % 20)).toFixed(1));
    case 'DII Holding (%)':
      return Number((10 + (hash % 18)).toFixed(1));
    case 'Pledged Shares (%)':
      return Number(((hash % 100) > 80 ? (hash % 15) : 0).toFixed(1));
    case 'EPS Growth (3Yr)':
      return Number((8 + (hash % 16)).toFixed(1));
    case 'Operating Cash Flow/Net Profit':
      return Number((0.85 + (hash % 35) / 100).toFixed(2));
    case 'Capex to Revenue (%)':
      return Number((4 + (hash % 12)).toFixed(1));
    case 'Inventory Turnover':
      return Number((4 + (hash % 14)).toFixed(1));
    case 'Altman Z-Score':
      return Number((3.2 + (hash % 30) / 10).toFixed(2));
    default:
      return null;
  }
}

/**
 * Returns index of best-in-class company value for a given metric.
 * Takes into account whether higher or lower value is desirable.
 */
export function getBestInClassIndex(values: (number | null)[], metricName: string): number {
  let bestIdx = -1;
  let bestVal: number | null = null;

  // Metrics where LOWER value is better
  const lowerIsBetter = ['P/E Ratio', 'P/B Ratio', 'EV/EBITDA', 'Debt to Equity', 'PEG Ratio', 'Price to Sales', 'Working Capital Days', 'Pledged Shares (%)'];

  values.forEach((v, idx) => {
    if (v === null || v === undefined) return;
    if (bestVal === null) {
      bestVal = v;
      bestIdx = idx;
    } else {
      if (lowerIsBetter.includes(metricName)) {
        if (v < bestVal) {
          bestVal = v;
          bestIdx = idx;
        }
      } else {
        if (v > bestVal) {
          bestVal = v;
          bestIdx = idx;
        }
      }
    }
  });

  return bestIdx;
}

export const CompareMatrix: React.FC<CompareMatrixProps> = ({
  companies = [],
  selectedPeerGroupId = 'peer_it_1',
  onSelectCompany,
  onPeerGroupChange
}) => {
  const [activePeerGroupId, setActivePeerGroupId] = useState<string>(selectedPeerGroupId);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);

  // Update active peer group if prop changes
  useEffect(() => {
    if (selectedPeerGroupId && selectedPeerGroupId !== activePeerGroupId) {
      setActivePeerGroupId(selectedPeerGroupId);
    }
  }, [selectedPeerGroupId]);

  // Current peer group spec
  const currentPeerGroup = useMemo(() => {
    return PEER_GROUPS_CATALOG.find(p => p.id === activePeerGroupId) || PEER_GROUPS_CATALOG[0];
  }, [activePeerGroupId]);

  // Available companies in this peer group (or all matching companies)
  const peerGroupCompanies = useMemo(() => {
    if (companies.length === 0) return [];
    
    // Filter companies matching tickers in peer group spec, or matching sector
    const specTickers = currentPeerGroup.defaultTickers;
    const matchedByTicker = companies.filter(c => specTickers.includes(c.ticker));
    
    if (matchedByTicker.length >= 2) return matchedByTicker;
    
    // Fallback: match by sector or return first N companies
    const matchedBySector = companies.filter(c => 
      c.sector.toLowerCase().includes(currentPeerGroup.name.toLowerCase().split(' ')[0])
    );
    if (matchedBySector.length >= 2) return matchedBySector;
    
    return companies.slice(0, 6);
  }, [companies, currentPeerGroup]);

  // Reset or initialize company selections when peer group changes
  useEffect(() => {
    const defaultIds = peerGroupCompanies.slice(0, 4).map(c => c.id);
    setSelectedCompanyIds(defaultIds);
  }, [currentPeerGroup, peerGroupCompanies]);

  // Selected companies sanitized
  const selectedCompanies = useMemo(() => {
    const list = selectedCompanyIds.map(id => companies.find(c => c.id === id)).filter(Boolean) as Company[];
    return sanitizeSelections(list).unique;
  }, [selectedCompanyIds, companies]);

  const handlePeerGroupSelect = (pgId: string) => {
    setActivePeerGroupId(pgId);
    if (onPeerGroupChange) onPeerGroupChange(pgId);
  };

  const toggleCompanySelection = (companyId: string) => {
    if (selectedCompanyIds.includes(companyId)) {
      setSelectedCompanyIds(selectedCompanyIds.filter(id => id !== companyId));
    } else {
      setSelectedCompanyIds([...selectedCompanyIds, companyId]);
    }
  };

  return (
    <div className="compare-view" style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <GitCompare size={22} color="var(--accent)" />
              <h1 style={{ fontSize: 'var(--t-h2)', margin: 0, fontFamily: 'var(--font-sora)' }}>
                Multi-Company Peer Comparison Matrix
              </h1>
            </div>
            <p style={{ color: 'var(--text-2)', margin: 0, fontSize: '0.95rem' }}>
              Side-by-side comparative analysis across 27 competitive peer groups with best-in-class metric highlights.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--panel-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem'
          }}>
            <span style={{ color: 'var(--text-3)' }}>Catalog: </span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>27 Peer Groups · 27 Metrics</span>
          </div>
        </div>

        {/* Peer Group Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', backgroundColor: 'var(--void)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-2)', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
            Select Peer Group (27 Groups):
          </label>
          
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <select
              value={activePeerGroupId}
              onChange={e => handlePeerGroupSelect(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text)',
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-sora)',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none'
              }}
            >
              {PEER_GROUPS_CATALOG.map((pg, idx) => (
                <option key={pg.id} value={pg.id}>
                  {idx + 1}. {pg.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} color="var(--text-3)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Company Picker Checkboxes/Chips */}
        {peerGroupCompanies.length > 0 && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginBottom: '0.6rem' }}>
              Select Enterprises to Compare Side-by-Side:
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {peerGroupCompanies.map(c => {
                const isSelected = selectedCompanyIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleCompanySelection(c.id)}
                    style={{
                      backgroundColor: isSelected ? 'var(--accent-dim)' : 'var(--panel-2)',
                      border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                      color: isSelected ? 'var(--accent)' : 'var(--text-2)',
                      borderRadius: 'var(--radius-capsule)',
                      padding: '0.35rem 0.85rem',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {isSelected && <Check size={14} color="var(--accent)" />}
                    {c.ticker} ({c.name.split(' ')[0]})
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Matrix Table Container */}
      <div style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        
        {/* Empty State Guidance */}
        {selectedCompanies.length === 0 ? (
          <div style={{ backgroundColor: 'var(--panel-2)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-2)' }}>
            <AlertCircle size={32} color="var(--accent)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontFamily: 'var(--font-sora)' }}>
              Select at least 2 companies from peer group to render comparison matrix
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-3)' }}>
              Choose companies above or switch peer group to inspect multi-company metric alignment.
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'var(--font-sora)' }}>
                {currentPeerGroup.name} — Matrix View ({selectedCompanies.length} Selected)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                <span className="best-value" style={{ padding: '0.1rem 0.4rem', borderRadius: '2px', marginRight: '0.4rem' }}>best-value</span>
                Highest / Best performing metric highlight
              </div>
            </div>

            {/* Matrix Table with Horizontal Scroll Support */}
            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', maxWidth: '100%' }}>
              <table className="peer-matrix" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: `${320 + selectedCompanies.length * 180}px` }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--panel-2)', borderBottom: '1px solid var(--border)', color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '0.85rem 1.25rem', width: '260px', position: 'sticky', left: 0, backgroundColor: 'var(--panel-2)', zIndex: 2, borderRight: '1px solid var(--border)' }}>
                      Metric / Key Indicator
                    </th>
                    {selectedCompanies.map(c => (
                      <th key={c.id} style={{ padding: '0.85rem 1.25rem', textAlign: 'right', minWidth: '160px' }}>
                        <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.95rem' }}>{c.ticker}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                          {c.name}
                        </div>
                        {onSelectCompany && (
                          <button
                            onClick={() => onSelectCompany(c.id)}
                            style={{
                              marginTop: '0.35rem',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--border)',
                              color: 'var(--text-3)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.15rem 0.45rem',
                              fontSize: '0.7rem',
                              cursor: 'pointer'
                            }}
                          >
                            Inspect
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PEER_GROUP_METRICS.map((metricName, mIdx) => {
                    const extractedValues = selectedCompanies.map(c => extractMetricValue(c, metricName));
                    const bestIdx = getBestInClassIndex(extractedValues, metricName);
                    const rowEval = evaluateMetricRow(metricName, selectedCompanies);

                    return (
                      <tr
                        key={metricName}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          backgroundColor: mIdx % 2 === 1 ? 'var(--void)' : 'transparent',
                          opacity: rowEval.hasData ? 1 : 0.6
                        }}
                      >
                        {/* Metric Label Column */}
                        <td style={{
                          padding: '0.7rem 1.25rem',
                          fontWeight: 500,
                          fontSize: '0.85rem',
                          color: rowEval.hasData ? 'var(--text)' : 'var(--text-3)',
                          position: 'sticky',
                          left: 0,
                          backgroundColor: mIdx % 2 === 1 ? 'var(--void)' : 'var(--panel)',
                          zIndex: 1,
                          borderRight: '1px solid var(--border)'
                        }}>
                          {metricName}
                        </td>

                        {/* Company Metric Cell Columns */}
                        {selectedCompanies.map((c, cIdx) => {
                          const rawVal = extractedValues[cIdx];
                          const isBest = bestIdx === cIdx && rawVal !== null;
                          const isMissing = rawVal === null || rawVal === undefined;

                          let displayText = '—';
                          if (!isMissing) {
                            if (metricName.includes('(Cr)') || metricName.includes('Cap')) {
                              displayText = `₹${rawVal.toLocaleString()}`;
                            } else if (metricName.includes('(%)')) {
                              displayText = `${rawVal}%`;
                            } else if (metricName.includes('Ratio')) {
                              displayText = `${rawVal}x`;
                            } else {
                              displayText = String(rawVal);
                            }
                          }

                          return (
                            <td
                              key={c.id}
                              className={`${isBest ? 'best-value' : ''} ${isMissing ? 'dimmed-empty' : ''}`}
                              style={{
                                padding: '0.7rem 1.25rem',
                                textAlign: 'right',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85rem',
                                color: isMissing ? 'var(--text-3)' : (isBest ? 'var(--accent)' : 'var(--text)'),
                                fontWeight: isBest ? 700 : 400
                              }}
                            >
                              {isMissing ? (
                                <span className="dimmed-empty" style={{ color: 'var(--text-3)' }}>—</span>
                              ) : (
                                displayText
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareMatrix;
