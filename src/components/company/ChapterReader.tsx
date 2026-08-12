import React from 'react';
import { CompanyDetailData } from '../../services/dataService';

export interface ChapterReaderProps {
  detailData: CompanyDetailData | null;
}

const FALLBACK_MESSAGE = 'No verified narrative available for this chapter.';

export const ChapterReader: React.FC<ChapterReaderProps> = ({ detailData }) => {
  const company = detailData?.company;

  const sectionStyle: React.CSSProperties = {
    scrollMarginTop: '8rem',
    backgroundColor: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.75rem',
    marginBottom: '1.5rem',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-sora)',
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '0.5rem',
  };

  const fallbackStyle: React.CSSProperties = {
    color: 'var(--text-3)',
    fontStyle: 'italic',
    fontSize: '0.9rem',
    padding: '1rem 0',
  };

  // Helper to render fallback if condition met
  const renderContentOrFallback = (hasData: boolean, contentNode: React.ReactNode) => {
    if (!detailData || !hasData) {
      return <div className="placeholder-narrative" style={fallbackStyle}>{FALLBACK_MESSAGE}</div>;
    }
    return contentNode;
  };

  return (
    <div className="chapter-reader-container">
      {/* Chapter 1: Overview */}
      <section id="chapter-1" className="chapter-section" style={sectionStyle}>
        <div style={titleStyle}>
          <span>§1 Overview</span>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', backgroundColor: 'var(--accent-dim)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
            The Business
          </span>
        </div>
        {renderContentOrFallback(
          Boolean(company && company.summary),
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600 }}>
                  {company?.ticker} · {company?.sector} ({company?.sub_sector})
                </div>
                <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-sora)', margin: '0.25rem 0' }}>
                  {company?.name}
                </h2>
              </div>
            </div>
            <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {company?.summary}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              <div style={{ backgroundColor: 'var(--panel-2)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Market Cap</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginTop: '0.2rem' }}>
                  ₹{(company?.market_cap || 0).toLocaleString()} Cr
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--panel-2)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Current Price</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text)', marginTop: '0.2rem' }}>
                  ₹{company?.current_price}
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--panel-2)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>P/E Ratio</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text)', marginTop: '0.2rem' }}>
                  {company?.pe_ratio}x
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--panel-2)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>ROCE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--up)', marginTop: '0.2rem' }}>
                  {company?.roce}%
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Chapter 2: Business DNA */}
      <section id="chapter-2" className="chapter-section" style={sectionStyle}>
        <div style={titleStyle}>
          <span>§2 Business DNA</span>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', backgroundColor: 'var(--accent-dim)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
            The Business
          </span>
        </div>
        {renderContentOrFallback(
          Boolean(detailData?.businessModel?.tags && detailData.businessModel.tags.length > 0),
          <div>
            <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Strategic technology, geographical market dynamics, and regulatory exposure vectors:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {detailData?.businessModel?.tags.map((tag) => (
                <div
                  key={tag.id}
                  style={{
                    backgroundColor: 'var(--panel-2)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.5' }}>
                    {tag.label || tag.name}
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: tag.tag_type === 'tailwind' ? 'rgba(86, 200, 150, 0.12)' : tag.tag_type === 'risk' ? 'rgba(236, 122, 110, 0.15)' : 'rgba(255,255,255,0.05)',
                    color: tag.tag_type === 'tailwind' ? 'var(--up)' : tag.tag_type === 'risk' ? 'var(--down)' : 'var(--text-2)',
                    whiteSpace: 'nowrap'
                  }}>
                    {tag.tag_type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Chapter 3: Value Chain */}
      <section id="chapter-3" className="chapter-section" style={sectionStyle}>
        <div style={titleStyle}>
          <span>§3 Value Chain</span>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', backgroundColor: 'var(--accent-dim)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
            The Business
          </span>
        </div>
        {renderContentOrFallback(
          Boolean(company?.value_chain_position || (detailData?.ecosystem?.nodes && detailData.ecosystem.nodes.length > 0)),
          <div>
            {company?.value_chain_position && (
              <div style={{ backgroundColor: 'var(--panel-2)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Value Chain Positioning
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.6' }}>
                  {company.value_chain_position}
                </p>
                {company.value_chain_note && (
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.825rem', color: 'var(--text-2)', fontStyle: 'italic' }}>
                    Note: {company.value_chain_note}
                  </p>
                )}
              </div>
            )}

            {detailData?.ecosystem?.nodes && detailData.ecosystem.nodes.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
                  Upstream & Downstream Dependencies
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                  {detailData.ecosystem.nodes.map((node) => (
                    <div
                      key={node.id}
                      style={{
                        backgroundColor: 'var(--panel-2)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textTransform: 'uppercase' }}>
                          {node.direction || node.node_type}
                        </span>
                        {node.tag && (
                          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
                            {node.tag}
                          </span>
                        )}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.3rem', color: 'var(--text)' }}>
                        {node.node_name || node.entity_name}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-2)', lineHeight: '1.5' }}>
                        {node.note || node.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Chapter 4: Quality Metrics */}
      <section id="chapter-4" className="chapter-section" style={sectionStyle}>
        <div style={titleStyle}>
          <span>§4 Quality Metrics</span>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', backgroundColor: 'var(--accent-dim)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
            The Business
          </span>
        </div>
        {renderContentOrFallback(
          Boolean(detailData?.financials?.metrics && detailData.financials.metrics.length > 0),
          <div>
            <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Operational efficiency, margin resilience, and financial architecture metrics with audit trail:
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                    <th style={{ padding: '0.6rem 0.8rem' }}>Metric Name</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>Value</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>Period</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>Audit / Note</th>
                  </tr>
                </thead>
                <tbody>
                  {detailData?.financials?.metrics.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.6rem 0.8rem', fontWeight: 500, color: 'var(--text)' }}>{m.metric_label || m.metric_name}</td>
                      <td style={{ padding: '0.6rem 0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 600 }}>
                        {m.metric_value !== null ? `${m.metric_value} ${m.metric_unit || ''}` : '—'}
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>{m.snapshot_date || m.period}</td>
                      <td style={{ padding: '0.6rem 0.8rem', fontSize: '0.78rem', color: 'var(--text-2)', maxWidth: '300px' }}>
                        {m.metric_note || (m.status === 'verified' ? '✓ Verified disclosure' : '—')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Chapter 5: Management */}
      <section id="chapter-5" className="chapter-section" style={sectionStyle}>
        <div style={titleStyle}>
          <span>§5 Management</span>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-2)', backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
            The Judgement
          </span>
        </div>
        {renderContentOrFallback(
          Boolean(detailData?.management?.profiles && detailData.management.profiles.length > 0),
          <div>
            <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Promoter shareholding, encumbrance verification, and capital allocation track record:
            </p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {detailData?.management?.profiles.map((p) => (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: 'var(--panel-2)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-sora)', color: 'var(--text)', fontSize: '1.05rem' }}>
                        {p.promoter_who || p.name}
                      </span>
                      {p.promoter_pct !== null && (
                        <span style={{ marginLeft: '0.75rem', backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>
                          {p.promoter_pct}% Promoter Stake
                        </span>
                      )}
                    </div>
                    {p.verified_on && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--up)', fontFamily: 'var(--font-mono)' }}>
                        ✓ Verified: {p.verified_on}
                      </span>
                    )}
                  </div>

                  {p.pledge_note && (
                    <div style={{ marginBottom: '0.75rem', backgroundColor: 'var(--void)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        Encumbrance / Pledge Verification
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: '1.5' }}>
                        {p.pledge_note}
                      </div>
                    </div>
                  )}

                  {p.capital_note && (
                    <div style={{ backgroundColor: 'var(--void)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        Capital Allocation Track Record
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: '1.5' }}>
                        {p.capital_note}
                      </div>
                    </div>
                  )}

                  {p.source_note && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginTop: '0.5rem' }}>
                      Source: {p.source_note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Chapter 6: Moat */}
      <section id="chapter-6" className="chapter-section" style={sectionStyle}>
        <div style={titleStyle}>
          <span>§6 Moat</span>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-2)', backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
            The Judgement
          </span>
        </div>
        {renderContentOrFallback(
          Boolean(detailData?.moat?.narrative || (detailData?.moat?.peers && detailData.moat.peers.length > 0)),
          <div>
            {detailData?.moat?.narrative && (
              <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                {detailData.moat.narrative}
              </p>
            )}
            {detailData?.moat?.peers && detailData.moat.peers.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Peer Benchmark Group
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {detailData.moat.peers.map((peer) => (
                    <div
                      key={peer.id}
                      style={{
                        backgroundColor: 'var(--panel-2)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)' }}>{peer.name} ({peer.ticker})</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                        P/E: {peer.pe_ratio}x · ROCE: {peer.roce}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Chapter 7: Risks */}
      <section id="chapter-7" className="chapter-section" style={sectionStyle}>
        <div style={titleStyle}>
          <span>§7 Risks</span>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--down)', backgroundColor: 'rgba(236,122,110,0.15)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
            The Judgement
          </span>
        </div>
        {renderContentOrFallback(
          Boolean(detailData?.bearCase && detailData.bearCase.length > 0),
          <div>
            <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Bear case scenarios, headwind exposures, and margin contraction catalysts:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {detailData?.bearCase.map((bear) => (
                <div
                  key={bear.id}
                  style={{
                    backgroundColor: 'rgba(236, 122, 110, 0.05)',
                    border: '1px solid rgba(236, 122, 110, 0.3)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--down)', fontSize: '0.95rem' }}>
                      {bear.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--down)', textTransform: 'uppercase' }}>
                      {bear.conviction} conviction
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: '1.5', marginBottom: '0.5rem' }}>
                    {bear.description}
                  </div>
                  {bear.catalyst_or_trigger && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                      Trigger: {bear.catalyst_or_trigger}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Chapter 8: Growth */}
      <section id="chapter-8" className="chapter-section" style={sectionStyle}>
        <div style={titleStyle}>
          <span>§8 Growth</span>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--up)', backgroundColor: 'rgba(86,200,150,0.15)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
            The Judgement
          </span>
        </div>
        {renderContentOrFallback(
          Boolean(detailData?.bullCase && detailData.bullCase.length > 0),
          <div>
            <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Bull case thesis, expansion vectors, and compounding catalysts:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {detailData?.bullCase.map((bull) => (
                <div
                  key={bull.id}
                  style={{
                    backgroundColor: 'rgba(86, 200, 150, 0.05)',
                    border: '1px solid rgba(86, 200, 150, 0.3)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--up)', fontSize: '0.95rem' }}>
                      {bull.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--up)', textTransform: 'uppercase' }}>
                      {bull.conviction} conviction
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: '1.5', marginBottom: '0.5rem' }}>
                    {bull.description}
                  </div>
                  {bull.catalyst_or_trigger && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                      Catalyst: {bull.catalyst_or_trigger}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Chapter 9: Valuation */}
      <section id="chapter-9" className="chapter-section" style={sectionStyle}>
        <div style={titleStyle}>
          <span>§9 Valuation</span>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', backgroundColor: 'var(--accent-dim)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
            The Judgement
          </span>
        </div>
        {renderContentOrFallback(
          Boolean(detailData?.valuation),
          detailData?.valuation && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>MODEL TYPE: </span>
                  <span style={{ fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{(detailData.valuation.valuation_model || 'DCF').toUpperCase()}</span>
                </div>
                <div style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-capsule)', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                  RECOMMENDATION: {detailData.valuation.recommendation || 'VERIFIED DISCLOSURE'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                <div style={{ backgroundColor: 'var(--panel-2)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Target Price</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginTop: '0.2rem' }}>
                    ₹{detailData.valuation.target_price}
                  </div>
                </div>
                <div style={{ backgroundColor: 'var(--panel-2)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Fair Value Range</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text)', marginTop: '0.2rem' }}>
                    ₹{detailData.valuation.fair_value_low} – ₹{detailData.valuation.fair_value_high}
                  </div>
                </div>
                <div style={{ backgroundColor: 'var(--panel-2)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Margin of Safety</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--up)', marginTop: '0.2rem' }}>
                    {detailData.valuation.margin_of_safety_pct}%
                  </div>
                </div>
                <div style={{ backgroundColor: 'var(--panel-2)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>WACC / Terminal Growth</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-2)', marginTop: '0.2rem' }}>
                    {detailData.valuation.wacc_pct}% / {detailData.valuation.terminal_growth_pct}%
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </section>

      {/* Chapter 10: News Pulse */}
      <section id="chapter-10" className="chapter-section" style={sectionStyle}>
        <div style={titleStyle}>
          <span>§10 News Pulse</span>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
            Machine News Pulse
          </span>
        </div>
        {renderContentOrFallback(
          Boolean(detailData?.machinePulse && detailData.machinePulse.length > 0),
          <div>
            <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Real-time machine gathered news sentiment and industry press intelligence:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {detailData?.machinePulse.map((news) => (
                <div
                  key={news.id}
                  style={{
                    backgroundColor: 'var(--panel-2)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                      {news.source} · {news.published_at}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: 'var(--radius-sm)',
                        color: (news.sentiment || news.tone) === 'positive' || (news.sentiment || news.tone) === 'tailwind' ? 'var(--up)' : (news.sentiment || news.tone) === 'negative' || (news.sentiment || news.tone) === 'headwind' ? 'var(--down)' : 'var(--text-3)',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                      }}
                    >
                      {((news.sentiment || news.tone) || 'neutral').toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.2rem' }}>
                    {news.headline}
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-2)' }}>
                    {news.summary}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
