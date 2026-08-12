import React from 'react';
import { CompanyDetailData, niceBand } from '../../services/dataService';

export interface RightHandDigestProps {
  detailData: CompanyDetailData | null;
  activeChapterId?: number;
}

interface MetricTrack {
  name: string;
  val: number;
  unit: string;
  lowerIsBetter: boolean;
  peerVals: number[];
}

export const RightHandDigest: React.FC<RightHandDigestProps> = ({
  detailData,
  activeChapterId = 1,
}) => {
  if (!detailData || !detailData.company) {
    return (
      <div
        className="digest-panel-fallback"
        style={{
          backgroundColor: 'var(--panel)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          color: 'var(--text-3)',
          fontSize: '0.85rem',
        }}
      >
        No company digest dataset available.
      </div>
    );
  }

  const company = detailData.company;
  const peers = detailData.moat?.peers || [];
  const valuation = detailData.valuation;

  // Prepare Peer Quantile Tracks Data
  const tracks: MetricTrack[] = [
    {
      name: 'P/E Ratio',
      val: company.pe_ratio,
      unit: 'x',
      lowerIsBetter: true,
      peerVals: peers.map((p) => p.pe_ratio),
    },
    {
      name: 'ROCE',
      val: company.roce,
      unit: '%',
      lowerIsBetter: false,
      peerVals: peers.map((p) => p.roce),
    },
    {
      name: 'ROE',
      val: company.roe,
      unit: '%',
      lowerIsBetter: false,
      peerVals: peers.map((p) => p.roe),
    },
  ];

  // Helper to get chapter-aware highlight text
  const getChapterHighlight = (chId: number): string => {
    switch (chId) {
      case 1:
        return 'Executive Overview: High-level business summary, sector positioning, and core valuation multiples.';
      case 2:
        return 'Business DNA: Geographical distribution & tech capability revenue breakdown.';
      case 3:
        return 'Value Chain: Strategic dependency linkages across key suppliers and enterprise customers.';
      case 4:
        return 'Quality Metrics: Balance sheet strength, margin resilience, and cash flow predictability.';
      case 5:
        return 'Management: Executive tenure, capital allocation record, and governance integrity.';
      case 6:
        return 'Economic Moat: Competitive moat durability and peer group relative advantages.';
      case 7:
        return 'Risks & Headwinds: Key bear case catalysts, margin sensitivity, and downside risks.';
      case 8:
        return 'Growth Drivers: Bull case expansion thesis, market share expansion, and compounding triggers.';
      case 9:
        return 'Valuation: DCF intrinsic value range, WACC assumptions, and margin of safety.';
      case 10:
        return 'News Pulse: Algorithmic sentiment monitoring and real-time news stream.';
      default:
        return 'Company Digest: Continuous analysis across 10 structured investment chapters.';
    }
  };

  return (
    <div
      className="digest-panel"
      style={{
        backgroundColor: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* 1. Executive Snapshot */}
      <div
        className="digest-snapshot"
        style={{
          borderBottom: '1px solid var(--border)',
          paddingBottom: '1rem',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
            fontWeight: 600,
            textTransform: 'uppercase',
            marginBottom: '0.2rem',
          }}
        >
          Executive Digest Snapshot
        </div>
        <h3
          style={{
            fontSize: '1.1rem',
            fontFamily: 'var(--font-sora)',
            margin: '0 0 0.25rem 0',
            color: 'var(--text)',
          }}
        >
          {company.name} ({company.ticker})
        </h3>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
          {company.sector} · Market Cap ₹{(company.market_cap || 0).toLocaleString()} Cr
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            marginTop: '0.75rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--panel-2)',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>Price</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
              ₹{company.current_price}
            </div>
          </div>
          <div
            style={{
              backgroundColor: 'var(--panel-2)',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>P/E</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
              {company.pe_ratio}x
            </div>
          </div>
        </div>
      </div>

      {/* 2. Peer Quantile Tracks (niceBand Algorithm) */}
      <div
        className="digest-quantile-tracks"
        style={{
          borderBottom: '1px solid var(--border)',
          paddingBottom: '1rem',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-3)',
            fontWeight: 600,
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          Peer Range Tracks (niceBand)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {tracks.map((t, idx) => {
            const allVals = [t.val, ...t.peerVals].filter(
              (v) => typeof v === 'number' && !isNaN(v) && isFinite(v)
            );

            const lowVal = allVals.length > 0 ? Math.min(...allVals) : t.val;
            const highVal = allVals.length > 0 ? Math.max(...allVals) : t.val;

            // Calculate niceBand quantile bounds
            const band = niceBand(lowVal, highVal);
            const bandSpread = band.max - band.min;

            // Normalized percentage position clipped [0, 100]
            const posPct =
              bandSpread <= 0
                ? 50
                : Math.max(
                    0,
                    Math.min(100, ((t.val - band.min) / bandSpread) * 100)
                  );

            // Best Value marker logic
            const bestValInGroup = t.lowerIsBetter ? lowVal : highVal;
            const isBestValue = t.val === bestValInGroup;

            return (
              <div key={idx} className="quantile-track-item">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.78rem',
                    marginBottom: '0.3rem',
                  }}
                >
                  <span style={{ color: 'var(--text-2)', fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
                    {t.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        color: 'var(--accent)',
                      }}
                    >
                      {t.val}
                      {t.unit}
                    </span>
                    {isBestValue && (
                      <span
                        className="best-value"
                        style={{
                          fontSize: '0.65rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--accent)',
                          backgroundColor: 'var(--accent-dim)',
                          border: '1px solid var(--accent)',
                          padding: '0.05rem 0.35rem',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 700,
                        }}
                      >
                        BEST VALUE
                      </span>
                    )}
                  </div>
                </div>

                {/* Track visual bar */}
                <div
                  style={{
                    position: 'relative',
                    height: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '3px',
                    margin: '0.4rem 0',
                  }}
                >
                  {/* Min and Max fill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: '0%',
                      right: '0%',
                      backgroundColor: 'rgba(84, 207, 218, 0.15)',
                      borderRadius: '3px',
                    }}
                  />
                  {/* Current Company Pin Indicator */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      left: `${posPct}%`,
                      transform: 'translateX(-50%)',
                      width: '12px',
                      height: '14px',
                      backgroundColor: 'var(--accent)',
                      borderRadius: '2px',
                      boxShadow: '0 0 8px var(--accent)',
                    }}
                  />
                </div>

                {/* Ticks readouts */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.68rem',
                    color: 'var(--text-3)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <span>Min: {band.min}</span>
                  <span>Mid: {band.midTick}</span>
                  <span>Max: {band.max}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Valuation Inputs */}
      {valuation && (
        <div
          className="digest-valuation"
          style={{
            borderBottom: '1px solid var(--border)',
            paddingBottom: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-3)',
              fontWeight: 600,
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            Valuation Inputs
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-2)' }}>Target Price:</span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{valuation.target_price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-2)' }}>Fair Value Range:</span>
              <span style={{ color: 'var(--text)' }}>₹{valuation.fair_value_low} – ₹{valuation.fair_value_high}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-2)' }}>Margin of Safety:</span>
              <span style={{ color: 'var(--up)', fontWeight: 600 }}>{valuation.margin_of_safety_pct}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem' }}>
              <span style={{ color: 'var(--text-2)' }}>Recommendation:</span>
              <span
                style={{
                  color: valuation.recommendation === 'BUY' ? 'var(--up)' : 'var(--accent)',
                  fontWeight: 700,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {valuation.recommendation}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Chapter-Aware Dynamic Highlights */}
      <div className="digest-dynamic-highlight">
        <div
          style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
            fontWeight: 600,
            textTransform: 'uppercase',
            marginBottom: '0.4rem',
          }}
        >
          Active Chapter Insights (§{activeChapterId})
        </div>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-2)',
            lineHeight: '1.45',
            margin: 0,
            backgroundColor: 'var(--panel-2)',
            padding: '0.65rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
          }}
        >
          {getChapterHighlight(activeChapterId)}
        </p>
      </div>
    </div>
  );
};
