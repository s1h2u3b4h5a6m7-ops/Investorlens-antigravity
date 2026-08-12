import React from 'react';
import {
  Building2,
  PieChart,
  Zap,
  GitCompare,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';

export type ViewTab = 'home' | 'detail' | 'sectors' | 'forces' | 'compare' | 'freshness';

export interface BezelNavProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  selfTestPassed?: boolean | null;
  selfTestSummary?: string;
  onLogoClick?: () => void;
}

export interface TabItem {
  id: ViewTab;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

export const BezelNav: React.FC<BezelNavProps> = ({
  activeTab,
  onTabChange,
  selfTestPassed = null,
  selfTestSummary,
  onLogoClick
}) => {
  const tabs: TabItem[] = [
    { id: 'home', label: 'Home / Companies', shortLabel: 'Companies', icon: <Building2 size={15} /> },
    { id: 'sectors', label: 'Sectors', shortLabel: 'Sectors', icon: <PieChart size={15} /> },
    { id: 'forces', label: 'Forces', shortLabel: 'Forces', icon: <Zap size={15} /> },
    { id: 'compare', label: 'Compare', shortLabel: 'Compare', icon: <GitCompare size={15} /> },
    { id: 'freshness', label: 'Freshness', shortLabel: 'Freshness', icon: <Activity size={15} /> },
  ];

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      onTabChange('home');
    }
  };

  return (
    <nav className="st-bezel" aria-label="Primary Navigation">
      {/* Brand Identity */}
      <button 
        className="st-brand" 
        onClick={handleLogoClick}
        title="InvestorLens India Home"
        aria-label="InvestorLens India Home"
      >
        <span className="st-brand-mark">◈</span>
        <span className="st-brand-name">
          InvestorLens <span className="st-brand-accent">India</span>
        </span>
      </button>

      {/* View Tabs Row */}
      <div className="st-tabrow" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              aria-controls={`shell-${tab.id}`}
              id={`tab-${tab.id}`}
              className={`st-tab ${isActive ? 'is-active active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="st-tab-icon">{tab.icon}</span>
              <span className="st-tab-label-full">{tab.label}</span>
              <span className="st-tab-label-short">{tab.shortLabel}</span>
              {isActive && <span className="st-tab-indicator" />}
            </button>
          );
        })}
      </div>

      {/* Startup Self-Test Integrity Status Badge */}
      <div 
        className={`st-status-pill ${selfTestPassed === true ? 'is-pass' : selfTestPassed === false ? 'is-fail' : 'is-loading'}`}
        title={selfTestSummary || 'Startup Self-Test Diagnostic Engine'}
      >
        {selfTestPassed === true ? (
          <>
            <CheckCircle2 size={13} className="st-status-icon pass" />
            <span className="st-status-text">Self-Test 100%</span>
          </>
        ) : selfTestPassed === false ? (
          <>
            <AlertTriangle size={13} className="st-status-icon fail" />
            <span className="st-status-text">Self-Test Fail</span>
          </>
        ) : (
          <>
            <Loader2 size={13} className="st-status-icon loading spin" />
            <span className="st-status-text">Testing...</span>
          </>
        )}
      </div>
    </nav>
  );
};

export default BezelNav;
