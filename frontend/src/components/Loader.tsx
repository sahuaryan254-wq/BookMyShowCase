import React from 'react';

export default function Loader() {
    return (
        <div className="flex items-center justify-center" style={{ height: '200px' }}>
            <div className="loader" style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                borderTopColor: 'var(--brand-primary)',
                animation: 'spin 1s ease-in-out infinite'
            }} />
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
