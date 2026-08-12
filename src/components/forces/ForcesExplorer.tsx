import React, { useState, useMemo } from 'react';
import { Force, Company } from '../../services/dataService';
import { Zap, Search, TrendingUp, Layers, AlertTriangle, ArrowRight, ShieldAlert, Building2 } from 'lucide-react';

export interface ForcesExplorerProps {
  forces?: Force[];
  companies?: Company[];
  onSelectCompany?: (companyId: string, chapterId?: string) => void;
  initialForceId?: string;
  initialShelfFilter?: 'ALL' | 'Tailwind' | 'Context' | 'Headwind';
}

export type ImpactClassification = 'high_positive' | 'moderate_positive' | 'neutral' | 'moderate_negative' | 'high_negative';

/**
 * Classifies numerical impact score into sentiment levels.
 */
export function classifyImpact(score: number): ImpactClassification {
  if (typeof score !== 'number' || isNaN(score)) return 'neutral';
  if (score >= 0.5) return 'high_positive';
  if (score > 0) return 'moderate_positive';
  if (score === 0) return 'neutral';
  if (score > -0.5) return 'moderate_negative';
  return 'high_negative';
}

/**
 * Normalizes shelf category safely to Tailwind, Context, or Headwind.
 */
export function getShelfCategory(shelf?: string | null): 'Tailwind' | 'Context' | 'Headwind' {
  const valid = ['Tailwind', 'Context', 'Headwind'];
  if (!shelf || !valid.includes(shelf)) return 'Context';
  return shelf as 'Tailwind' | 'Context' | 'Headwind';
}

export interface ExposedCompanyMeta {
  companyId: string;
  companyName: string;
  ticker: string;
  sector: string;
  impactScore: number;
  impactType: ImpactClassification;
}

export const ForcesExplorer: React.FC<ForcesExplorerProps> = ({
  forces = [],
  companies = [],
  onSelectCompany,
  initialForceId,
  initialShelfFilter = 'ALL'
}) => {
  const [activeShelf, setActiveShelf] = useState<'ALL' | 'Tailwind' | 'Context' | 'Headwind'>(initialShelfFilter);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Safe default force selection
  const [selectedForceId, setSelectedForceId] = useState<string>(() => {
    if (initialForceId && forces.some(f => f.id === initialForceId)) return initialForceId;
    return forces.length > 0 ? forces[0].id : 'FORCE-01';
  });

  const validShelfFilter = (shelf: string): boolean => {
    return ['ALL', 'Tailwind', 'Context', 'Headwind'].includes(shelf);
  };

  const handleShelfChange = (shelf: 'ALL' | 'Tailwind' | 'Context' | 'Headwind') => {
    if (validShelfFilter(shelf)) {
      setActiveShelf(shelf);
    }
  };

  // Filter forces catalog based on active shelf and search query
  const filteredForces = useMemo(() => {
    return forces.filter(f => {
      const category = getShelfCategory(f.category);
      const matchesShelf = activeShelf === 'ALL' || category === activeShelf;
      
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        (f.affected_sectors && f.affected_sectors.some(s => s.toLowerCase().includes(q)));

      return matchesShelf && matchesSearch;
    });
  }, [forces, activeShelf, searchQuery]);

  // Active force object
  const activeForce = useMemo(() => {
    return forces.find(f => f.id === selectedForceId) || filteredForces[0] || forces[0] || null;
  }, [forces, selectedForceId, filteredForces]);

  // Synthesize exposed company details for active force
  const exposedCompaniesList = useMemo<ExposedCompanyMeta[]>(() => {
    if (!activeForce) return [];
    
    // Check if force object already contains structured exposedCompanies
    const rawExposed = (activeForce as any).exposedCompanies;
    if (Array.isArray(rawExposed) && rawExposed.length > 0) {
      return rawExposed.map(e => ({
        companyId: e.companyId || e.id || '',
        companyName: e.companyName || e.name || 'Unknown Enterprise',
        ticker: e.ticker || e.companyId || 'N/A',
        sector: e.sector || 'General',
        impactScore: typeof e.impactScore === 'number' ? e.impactScore : 0,
        impactType: e.impactType || classifyImpact(e.impactScore || 0)
      }));
    }

    const companyIds = activeForce.affected_company_ids || [];
    const forceCategory = getShelfCategory(activeForce.category);
    
    let defaultScore = 0;
    if (forceCategory === 'Tailwind') defaultScore = activeForce.impact_level === 'high' ? 0.7 : 0.4;
    if (forceCategory === 'Headwind') defaultScore = activeForce.impact_level === 'high' ? -0.7 : -0.3;

    return companyIds.map(cId => {
      const comp = companies.find(c => c.id === cId || c.ticker === cId);
      const score = defaultScore;
      return {
        companyId: comp ? comp.id : cId,
        companyName: comp ? comp.name : cId,
        ticker: comp ? comp.ticker : cId,
        sector: comp ? comp.sector : 'General',
        impactScore: score,
        impactType: classifyImpact(score)
      };
    });
  }, [activeForce, companies]);

  return (
    <div className="forces-view" style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Header Section */}
      <div style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Zap size={22} color="var(--accent)" />
              <h1 style={{ fontSize: 'var(--t-h2)', margin: 0, fontFamily: 'var(--font-sora)' }}>
                3-Shelf Categorized Macro Forces Explorer
              </h1>
            </div>
            <p style={{ color: 'var(--text-2)', margin: 0, fontSize: '0.95rem' }}>
              14 structural macro forces analyzed across 3 shelves: Tailwind (Positive), Context (Neutral), and Headwind (Risk).
            </p>
          </div>
        </div>

        {/* Controls Row: Shelf Filters & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
          {/* 3-Shelf Filter Tabs */}
          <div className="frc-filter-tabs" style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--void)', padding: '0.25rem', borderRadius: 'var(--radius-capsule)', border: '1px solid var(--border)' }}>
            {(['ALL', 'Tailwind', 'Context', 'Headwind'] as const).map(shelf => {
              const count = shelf === 'ALL' 
                ? forces.length 
                : forces.filter(f => getShelfCategory(f.category) === shelf).length;
              const isActive = activeShelf === shelf;

              return (
                <button
                  key={shelf}
                  onClick={() => handleShelfChange(shelf)}
                  style={{
                    padding: '0.4rem 0.9rem',
                    borderRadius: 'var(--radius-capsule)',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--accent-dim)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-2)',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  {shelf === 'Tailwind' && <TrendingUp size={14} color="var(--up)" />}
                  {shelf === 'Context' && <Layers size={14} color="var(--neutral)" />}
                  {shelf === 'Headwind' && <AlertTriangle size={14} color="var(--down)" />}
                  {shelf} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '280px' }}>
            <Search size={16} color="var(--text-3)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="st-q"
              placeholder="Search forces or sectors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '100%', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      {/* Split-Pane Exposure Explorer Container */}
      <div className="frc-split-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Pane: Macro Force Catalog List */}
        <div className="frc-left-pane" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'grid', gap: '0.85rem', maxHeight: '720px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginBottom: '0.25rem' }}>
            Macro Forces Catalog ({filteredForces.length} Forces)
          </div>

          {filteredForces.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-2)', fontSize: '0.9rem' }}>
              No macro forces match the current criteria.
            </div>
          ) : (
            filteredForces.map(force => {
              const isSelected = activeForce?.id === force.id;
              const category = getShelfCategory(force.category);
              const exposedCount = (force.affected_company_ids || (force as any).exposedCompanies || []).length;

              let badgeColor = 'var(--neutral)';
              let badgeBg = 'rgba(120, 140, 160, 0.12)';
              if (category === 'Tailwind') { badgeColor = 'var(--up)'; badgeBg = 'rgba(86, 200, 150, 0.12)'; }
              if (category === 'Headwind') { badgeColor = 'var(--down)'; badgeBg = 'rgba(255, 107, 107, 0.12)'; }

              return (
                <div
                  key={force.id}
                  onClick={() => setSelectedForceId(force.id)}
                  style={{
                    backgroundColor: isSelected ? 'var(--panel-2)' : 'var(--void)',
                    border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 12px var(--accent-dim)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: badgeBg,
                      color: badgeColor,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {category}
                    </span>

                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                      {exposedCount} {exposedCount === 1 ? 'Company' : 'Companies'} Exposed
                    </span>
                  </div>

                  <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.95rem', fontFamily: 'var(--font-sora)', color: isSelected ? 'var(--accent)' : 'var(--text)' }}>
                    {force.name}
                  </h4>

                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-2)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {force.description}
                  </p>

                  {force.affected_sectors && force.affected_sectors.length > 0 && (
                    <div style={{ marginTop: '0.6rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {force.affected_sectors.map(sec => (
                        <span key={sec} style={{ fontSize: '0.7rem', color: 'var(--text-3)', backgroundColor: 'var(--panel)', padding: '0.1rem 0.4rem', borderRadius: '2px', border: '1px solid var(--border)' }}>
                          {sec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Pane: Split-Pane Company Exposure Detail */}
        <div className="frc-right-pane" style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          {activeForce ? (
            <div>
              {/* Force Summary Header */}
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)' }}>
                    {activeForce.id} · {getShelfCategory(activeForce.category)} Shelf
                  </div>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--panel-2)',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: activeForce.impact_level === 'high' ? 'var(--accent)' : 'var(--text-2)'
                  }}>
                    Impact Level: {activeForce.impact_level ? activeForce.impact_level.toUpperCase() : 'MEDIUM'}
                  </span>
                </div>

                <h2 style={{ margin: '0 0 0.6rem', fontSize: '1.25rem', fontFamily: 'var(--font-sora)' }}>
                  {activeForce.name}
                </h2>
                
                <p style={{ margin: 0, color: 'var(--text-2)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {activeForce.description}
                </p>

                {activeForce.affected_sectors && activeForce.affected_sectors.length > 0 && (
                  <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Affected Sectors:</span>
                    {activeForce.affected_sectors.map(sec => (
                      <span key={sec} style={{ fontSize: '0.75rem', color: 'var(--accent)', backgroundColor: 'var(--accent-dim)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                        {sec}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Exposed Companies Grid */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'var(--font-sora)' }}>
                    Exposed Companies ({exposedCompaniesList.length})
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                    Click company to inspect Chapter 3 (Macro Context)
                  </span>
                </div>

                {exposedCompaniesList.length === 0 ? (
                  <div style={{ backgroundColor: 'var(--panel-2)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', color: 'var(--text-3)' }}>
                    <ShieldAlert size={24} style={{ marginBottom: '0.5rem', color: 'var(--text-3)' }} />
                    <div>0 Companies Exposed</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>No individual enterprises currently flagged for direct exposure to this force.</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {exposedCompaniesList.map(item => {
                      let impactBadgeStyle = { bg: 'rgba(120, 140, 160, 0.12)', color: 'var(--text-2)', label: 'Neutral Exposure' };
                      if (item.impactType === 'high_positive') {
                        impactBadgeStyle = { bg: 'rgba(86, 200, 150, 0.2)', color: 'var(--up)', label: 'High Tailwind (+)' };
                      } else if (item.impactType === 'moderate_positive') {
                        impactBadgeStyle = { bg: 'rgba(86, 200, 150, 0.12)', color: 'var(--up)', label: 'Moderate Tailwind (+)' };
                      } else if (item.impactType === 'moderate_negative') {
                        impactBadgeStyle = { bg: 'rgba(255, 107, 107, 0.12)', color: 'var(--down)', label: 'Moderate Headwind (-)' };
                      } else if (item.impactType === 'high_negative') {
                        impactBadgeStyle = { bg: 'rgba(255, 107, 107, 0.2)', color: 'var(--down)', label: 'High Headwind (-)' };
                      }

                      return (
                        <div
                          key={item.companyId}
                          style={{
                            backgroundColor: 'var(--panel-2)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.85rem 1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.75rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Building2 size={18} color="var(--accent)" />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent)', fontSize: '0.85rem' }}>
                                  {item.ticker}
                                </span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                  {item.companyName}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.1rem' }}>
                                Sector: {item.sector}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <span style={{
                              padding: '0.2rem 0.55rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: impactBadgeStyle.bg,
                              color: impactBadgeStyle.color,
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}>
                              {impactBadgeStyle.label}
                            </span>

                            {onSelectCompany && (
                              <button
                                onClick={() => onSelectCompany(item.companyId, 'chapter-3')}
                                style={{
                                  backgroundColor: 'var(--accent-dim)',
                                  border: '1px solid var(--accent)',
                                  color: 'var(--accent)',
                                  borderRadius: 'var(--radius-sm)',
                                  padding: '0.3rem 0.7rem',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                Macro Context <ArrowRight size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-2)' }}>
              Select a force from the left catalog to inspect exposure details.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ForcesExplorer;
