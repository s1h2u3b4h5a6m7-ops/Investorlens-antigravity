import React, { useState, useMemo } from 'react';
import { Company } from '../../services/dataService';
import { PieChart, Search, ArrowRight, TrendingUp, Building2 } from 'lucide-react';

export interface SectorSummary {
  id: string;
  name: string;
  count: number;
  ratio: number;
  pct: number;
  totalMarketCap: number;
  avgPe: number;
  peerGroupId: string;
  companies: Company[];
}

export interface SectorLedgerProps {
  companies?: Company[];
  onSelectSector?: (sectorId: string | null) => void;
  onNavigateToCompare?: (peerGroupId: string) => void;
  onInspectCompany?: (companyId: string) => void;
  initialSearchQuery?: string;
}

/**
 * Calculates exact proportional distribution rail percentage width.
 * Bounded between 0% and 100%, divide-by-zero protected, and negative count clamped.
 */
export function calculateRailWidthPercent(n: number, total: number = 107): number {
  if (!total || total <= 0 || typeof total !== 'number' || isNaN(total)) {
    return 0;
  }
  const safeCount = Math.max(0, typeof n === 'number' ? n : 0);
  const ratio = safeCount / total;
  const pct = Number((ratio * 100).toFixed(2));
  return Math.max(0, Math.min(100, pct));
}

/**
 * Maps raw sector names to canonical peer group IDs for cross-view navigation
 */

export function mapSectorToPeerGroupId(sectorName: string): string {
  const norm = sectorName.toLowerCase();
  if (norm.includes('banking') || norm.includes('bfsi')) return 'peer_bfsi_1';
  if (norm.includes('it services') || norm.includes('it')) return 'peer_it_1';
  if (norm.includes('pharma')) return 'peer_pharma_1';
  if (norm.includes('auto')) return 'peer_auto_1';
  if (norm.includes('fmcg') || norm.includes('consumer')) return 'peer_cpg_1';
  if (norm.includes('energy') || norm.includes('oil')) return 'peer_energy_1';
  if (norm.includes('infra') || norm.includes('real estate')) return 'peer_infra_1';
  if (norm.includes('chem')) return 'peer_chem_1';
  if (norm.includes('metal') || norm.includes('steel')) return 'peer_metal_1';
  if (norm.includes('telecom')) return 'peer_telecom_1';
  if (norm.includes('retail')) return 'peer_retail_1';
  if (norm.includes('defense') || norm.includes('defence')) return 'peer_defense_1';
  if (norm.includes('logistics')) return 'peer_logistics_1';
  if (norm.includes('cement')) return 'peer_cement_1';
  if (norm.includes('textiles')) return 'peer_textiles_1';
  if (norm.includes('media')) return 'peer_media_1';
  if (norm.includes('hotel') || norm.includes('hospitality')) return 'peer_hotel_1';
  if (norm.includes('agro')) return 'peer_agro_1';
  if (norm.includes('fintech')) return 'peer_fintech_1';
  if (norm.includes('capital')) return 'peer_capital_1';
  if (norm.includes('semicon')) return 'peer_semicon_1';
  if (norm.includes('aviation')) return 'peer_aviation_1';
  if (norm.includes('power')) return 'peer_power_1';
  
  const cleanKey = norm.replace(/[^a-z0-9]/g, '_');
  return `peer_${cleanKey}_1`;
}

/**
 * Builds sector ledger items grouped by sector from companies array.
 */
export function buildSectorLedger(companies: Company[] = [], totalCount: number = 107): SectorSummary[] {
  const map: Record<string, Company[]> = {};

  companies.forEach(c => {
    const rawSector = c?.sector;
    const sectorName = (rawSector && typeof rawSector === 'string' && rawSector.trim())
      ? rawSector.trim()
      : 'Uncategorized';
    if (!map[sectorName]) {
      map[sectorName] = [];
    }
    map[sectorName].push(c);
  });

  const total = totalCount > 0 ? totalCount : 107;

  return Object.entries(map).map(([name, sectorCompanies]) => {
    const count = Math.max(0, sectorCompanies.length);
    const ratio = count / total;
    const pct = calculateRailWidthPercent(count, total);
    const totalMarketCap = sectorCompanies.reduce((acc, comp) => acc + (comp.market_cap || 0), 0);
    const validPeCompanies = sectorCompanies.filter(comp => typeof comp.pe_ratio === 'number' && comp.pe_ratio > 0);
    const avgPe = validPeCompanies.length > 0
      ? Number((validPeCompanies.reduce((acc, comp) => acc + comp.pe_ratio, 0) / validPeCompanies.length).toFixed(1))
      : 0;
    const id = `sec_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const peerGroupId = mapSectorToPeerGroupId(name);

    return {
      id,
      name,
      count,
      ratio,
      pct,
      totalMarketCap,
      avgPe,
      peerGroupId,
      companies: sectorCompanies
    };
  }).sort((a, b) => b.count - a.count);
}

export const SectorLedger: React.FC<SectorLedgerProps> = ({
  companies = [],
  onSelectSector,
  onNavigateToCompare,
  onInspectCompany,
  initialSearchQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);

  const totalCompaniesCount = companies.length || 107;
  const sectorSummaries = useMemo(() => buildSectorLedger(companies, totalCompaniesCount), [companies, totalCompaniesCount]);

  const filteredSectors = useMemo(() => {
    if (!searchQuery.trim()) return sectorSummaries;
    const q = searchQuery.toLowerCase().trim();
    return sectorSummaries.filter(sec => 
      sec.name.toLowerCase().includes(q) ||
      sec.companies.some(c => c.name.toLowerCase().includes(q) || c.ticker.toLowerCase().includes(q))
    );
  }, [sectorSummaries, searchQuery]);

  const handleSelect = (sectorId: string) => {
    const nextId = selectedSectorId === sectorId ? null : sectorId;
    setSelectedSectorId(nextId);
    if (onSelectSector) {
      if (typeof sectorId === 'string' && sectorId.trim().length > 0) {
        onSelectSector(nextId);
      } else {
        onSelectSector(null);
      }
    }
  };

  return (
    <div className="sectors-view" style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <PieChart size={22} color="var(--accent)" />
              <h1 style={{ fontSize: 'var(--t-h2)', margin: 0, fontFamily: 'var(--font-sora)' }}>
                23-Sector Proportional Distribution Ledger
              </h1>
            </div>
            <p style={{ color: 'var(--text-2)', margin: 0, fontSize: '0.95rem' }}>
              Proportional distribution of {totalCompaniesCount} enterprises across {sectorSummaries.length} sectors with exact distribution rails.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{
              backgroundColor: 'var(--panel-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem 1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: 'var(--text-3)' }}>Total Listed: </span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{totalCompaniesCount} Companies</span>
            </div>
          </div>
        </div>

        {/* Omnibox Search Bar */}
        <div style={{ marginTop: '1.5rem', position: 'relative', maxWidth: '540px' }}>
          <Search size={18} color="var(--text-3)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="st-q"
            placeholder="Filter sectors by name or company..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.75rem', width: '100%' }}
          />
        </div>
      </div>

      {/* Sectors Distribution Grid */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredSectors.length === 0 ? (
          <div style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center', color: 'var(--text-2)' }}>
            No sectors found matching "{searchQuery}".
          </div>
        ) : (
          filteredSectors.map(sec => {
            const isExpanded = selectedSectorId === sec.id;
            return (
              <div
                key={sec.id}
                style={{
                  backgroundColor: 'var(--panel)',
                  border: isExpanded ? '1px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1.5rem',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontFamily: 'var(--font-sora)', fontWeight: 600 }}>
                      {sec.name}
                    </h3>
                    <span style={{
                      backgroundColor: 'var(--panel-2)',
                      border: '1px solid var(--border)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-2)'
                    }}>
                      {sec.count} {sec.count === 1 ? 'Enterprise' : 'Enterprises'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>Market Cap: </span>
                      <span style={{ color: 'var(--text)' }}>₹{sec.totalMarketCap.toLocaleString()} Cr</span>
                    </div>

                    <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>Avg P/E: </span>
                      <span style={{ color: 'var(--accent)' }}>{sec.avgPe ? `${sec.avgPe}x` : '—'}</span>
                    </div>

                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      minWidth: '60px',
                      textAlign: 'right'
                    }}>
                      {sec.pct.toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* Exact Proportional Rail */}
                <div className="sec-rail" style={{ marginBottom: '1rem' }}>
                  <div
                    className="sec-rail-bar"
                    style={{ width: `${sec.pct}%` }}
                    title={`${sec.name}: ${sec.count}/${totalCompaniesCount} (${sec.pct}%)`}
                  />
                </div>

                {/* Actions & Companies Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border)', fontSize: '0.85rem' }}>
                  <button
                    onClick={() => handleSelect(sec.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent)',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    <Building2 size={14} />
                    {isExpanded ? 'Hide Companies' : `View ${sec.companies.length} Companies`}
                  </button>

                  {onNavigateToCompare && (
                    <button
                      onClick={() => onNavigateToCompare(sec.peerGroupId)}
                      style={{
                        backgroundColor: 'var(--accent-dim)',
                        border: '1px solid var(--accent)',
                        color: 'var(--accent)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.3rem 0.8rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      Compare Sector <ArrowRight size={14} />
                    </button>
                  )}
                </div>

                {/* Expanded Company Cards List */}
                {isExpanded && sec.companies.length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                    {sec.companies.map(c => (
                      <div
                        key={c.id}
                        style={{
                          backgroundColor: 'var(--panel-2)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.75rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem' }}>
                            {c.ticker}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                            {c.name}
                          </div>
                        </div>

                        {onInspectCompany && (
                          <button
                            onClick={() => onInspectCompany(c.id)}
                            style={{
                              backgroundColor: 'transparent',
                              border: '1px solid var(--border)',
                              color: 'var(--text-2)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.2rem 0.5rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            Inspect
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SectorLedger;
