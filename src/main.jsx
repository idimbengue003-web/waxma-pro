import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, background: '#0A1628', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui' }}>
          <h1 style={{ color: '#00E676', fontSize: 24 }}>Erreur Wakhma PRO</h1>
          <pre style={{ background: '#111D35', padding: 16, borderRadius: 12, overflow: 'auto', color: '#ff6b6b', fontSize: 13 }}>
            {this.state.error?.message || 'Erreur inconnue'}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16, background: '#00E676', color: '#0A1628', border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
            Recharger
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
