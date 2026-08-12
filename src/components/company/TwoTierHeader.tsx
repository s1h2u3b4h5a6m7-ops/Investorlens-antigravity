import React, { useEffect } from 'react';

export interface TwoTierHeaderProps {
  activeChapterId: number;
  onSelectChapter: (chapterId: number) => void;
}

export const CHAPTER_LIST = [
  { id: 1, title: '§1 Overview', shortTitle: 'Overview', tier: 'business' },
  { id: 2, title: '§2 Business DNA', shortTitle: 'DNA', tier: 'business' },
  { id: 3, title: '§3 Value Chain', shortTitle: 'Value Chain', tier: 'business' },
  { id: 4, title: '§4 Quality Metrics', shortTitle: 'Metrics', tier: 'business' },
  { id: 5, title: '§5 Management', shortTitle: 'Management', tier: 'judgement' },
  { id: 6, title: '§6 Moat', shortTitle: 'Moat', tier: 'judgement' },
  { id: 7, title: '§7 Risks', shortTitle: 'Risks', tier: 'judgement' },
  { id: 8, title: '§8 Growth', shortTitle: 'Growth', tier: 'judgement' },
  { id: 9, title: '§9 Valuation', shortTitle: 'Valuation', tier: 'judgement' },
  { id: 10, title: '§10 News Pulse', shortTitle: 'News Pulse', tier: 'judgement' },
];

export const TwoTierHeader: React.FC<TwoTierHeaderProps> = ({
  activeChapterId,
  onSelectChapter,
}) => {
  const currentTier = activeChapterId <= 4 ? 'The Business' : 'The Judgement';

  // Scroll-Spy Observer logic with 62% viewport threshold ratio (SPY = 0.62)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const SCROLLSPY_THRESHOLD_RATIO = 0.62;
          const triggerLine = window.scrollY + window.innerHeight * SCROLLSPY_THRESHOLD_RATIO;
          let active = 1;

          for (let i = 1; i <= 10; i++) {
            const el = document.getElementById(`chapter-${i}`);
            if (el) {
              const rect = el.getBoundingClientRect();
              const elementTop = rect.top + window.scrollY;
              if (triggerLine >= elementTop) {
                active = i;
              }
            }
          }

          if (active !== activeChapterId) {
            onSelectChapter(active);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeChapterId, onSelectChapter]);

  const handleJumpToChapter = (chapterId: number) => {
    const clampedId = Math.min(Math.max(chapterId, 1), 10);
    onSelectChapter(clampedId);
    const targetElement = document.getElementById(`chapter-${clampedId}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectTier = (tierName: 'The Business' | 'The Judgement') => {
    const targetChapter = tierName === 'The Business' ? 1 : 5;
    handleJumpToChapter(targetChapter);
  };

  return (
    <div
      className="two-tier-header"
      style={{
        position: 'sticky',
        top: '4.5rem',
        zIndex: 100,
        backgroundColor: 'rgba(10, 14, 23, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.75rem 1rem',
        marginBottom: '1.5rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Tier 1: Category Tabs */}
      <div
        className="tier1-category-tabs"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '0.5rem',
          marginBottom: '0.6rem',
        }}
      >
        <button
          onClick={() => handleSelectTier('The Business')}
          className={`tier1-tab ${currentTier === 'The Business' ? 'is-active' : ''}`}
          style={{
            background: 'none',
            border: 'none',
            color: currentTier === 'The Business' ? 'var(--accent)' : 'var(--text-2)',
            fontFamily: 'var(--font-sora)',
            fontSize: '0.9rem',
            fontWeight: currentTier === 'The Business' ? 700 : 500,
            cursor: 'pointer',
            padding: '0.2rem 0.5rem',
            position: 'relative',
            transition: 'all 150ms ease',
          }}
        >
          The Business <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>(§§1–4)</span>
          {currentTier === 'The Business' && (
            <span
              style={{
                position: 'absolute',
                bottom: '-0.55rem',
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: 'var(--accent)',
                borderRadius: '1px',
              }}
            />
          )}
        </button>

        <button
          onClick={() => handleSelectTier('The Judgement')}
          className={`tier1-tab ${currentTier === 'The Judgement' ? 'is-active' : ''}`}
          style={{
            background: 'none',
            border: 'none',
            color: currentTier === 'The Judgement' ? 'var(--accent)' : 'var(--text-2)',
            fontFamily: 'var(--font-sora)',
            fontSize: '0.9rem',
            fontWeight: currentTier === 'The Judgement' ? 700 : 500,
            cursor: 'pointer',
            padding: '0.2rem 0.5rem',
            position: 'relative',
            transition: 'all 150ms ease',
          }}
        >
          The Judgement <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>(§§5–10)</span>
          {currentTier === 'The Judgement' && (
            <span
              style={{
                position: 'absolute',
                bottom: '-0.55rem',
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: 'var(--accent)',
                borderRadius: '1px',
              }}
            />
          )}
        </button>
      </div>

      {/* Tier 2: Chapter Navigation Pills */}
      <div
        className="tier2-chapter-pills"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          overflowX: 'auto',
          paddingBottom: '0.2rem',
          scrollbarWidth: 'none',
        }}
      >
        {CHAPTER_LIST.map((ch) => {
          const isActive = activeChapterId === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => handleJumpToChapter(ch.id)}
              className={`chapter-pill ${isActive ? 'is-active' : ''}`}
              style={{
                padding: '0.35rem 0.7rem',
                borderRadius: 'var(--radius-capsule)',
                border: '1px solid',
                borderColor: isActive ? 'var(--accent)' : 'rgba(255, 255, 255, 0.08)',
                backgroundColor: isActive ? 'var(--accent-dim)' : 'var(--panel-2)',
                color: isActive ? 'var(--accent)' : 'var(--text-2)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: isActive ? 600 : 400,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {ch.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};
