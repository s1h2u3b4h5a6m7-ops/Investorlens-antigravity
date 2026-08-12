import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: 'var(--void, #090C12)',
          color: 'var(--text, #F0F2F5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'var(--font-sans, system-ui, sans-serif)'
        }}>
          <div style={{
            maxWidth: '640px',
            width: '100%',
            backgroundColor: 'var(--panel, #0F1219)',
            border: '1px solid var(--border, #1F2332)',
            borderRadius: '12px',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 107, 107, 0.12)',
              border: '1px solid var(--down, #FF6B6B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <AlertTriangle size={28} color="var(--down, #FF6B6B)" />
            </div>

            <h2 style={{ fontSize: '1.4rem', margin: '0 0 0.75rem', fontFamily: 'var(--font-sora, sans-serif)' }}>
              Precision Interface Resilience Mode
            </h2>

            <p style={{ color: 'var(--text-2, #A6ABB8)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              An unexpected render anomaly occurred in a component sub-tree. The system has safely isolated the failure.
            </p>

            {this.state.error && (
              <div style={{
                backgroundColor: 'var(--void, #090C12)',
                border: '1px solid var(--border, #1F2332)',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'left',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.8rem',
                color: 'var(--accent, #54CFDA)',
                overflowX: 'auto',
                marginBottom: '1.5rem'
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.reload();
              }}
              style={{
                backgroundColor: 'var(--accent, #54CFDA)',
                color: '#090C12',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.65rem 1.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <RefreshCw size={16} /> Recover Interface
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
