/////////////////////////////////////////////////////////////
//
// bases_on - Database Dashboard
//
// Copyright (C) 2024 - 2026, dynamicdev_
//
//////////////////////////////////////////////////////////////
import React from 'react';

export default function PgAdminLogo() {
  return (
    <div className="welcome-logo" aria-hidden="true" style={{ marginBottom: '20px' }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60">
        <defs>
          <linearGradient id="basesOnGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#B91C1C', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#7F1D1D', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <text
          x="0"
          y="45"
          style={{
            fill: 'url(#basesOnGradient)',
            fontSize: '48px',
            fontWeight: '900',
            fontFamily: 'Arial Black, sans-serif',
            letterSpacing: '2px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          BASES_ON
        </text>
      </svg>
    </div>
  );
}
