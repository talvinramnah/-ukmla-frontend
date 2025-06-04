'use client';

import React from 'react';

interface WeeklySummaryProps {
  passed: number;
  failed: number;
  actionPoints: string[];
  userName?: string;
}

export default function WeeklySummary({
  passed,
  failed,
  actionPoints,
  userName = 'Anon_name',
}: WeeklySummaryProps) {
  // Determine greeting based on local time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#000',
    border: '4px solid #d77400',
    borderRadius: 24,
    padding: '32px 48px',
    color: '#ffd5a6',
    fontFamily: 'VT323',
    maxWidth: 800,
    width: '90%',
    margin: '0 auto',
    boxSizing: 'border-box',
  };

  const headerStyle: React.CSSProperties = {
    fontSize: 28,
    marginBottom: 16,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 2fr',
    columnGap: 32,
    rowGap: 16,
    alignItems: 'start',
  };

  const bigNumber: React.CSSProperties = {
    fontSize: 64,
    color: '#fff',
    textAlign: 'center' as const,
    marginBottom: 8,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 20,
    textAlign: 'center' as const,
  };

  const listStyle: React.CSSProperties = {
    fontSize: 20,
    lineHeight: 1.4,
    paddingInlineStart: 20,
  };

  return (
    <div style={{ marginTop: -50, marginBottom: 40 }}>
      <div style={headerStyle}>{greeting}, {userName}</div>
      <div style={cardStyle}>
        <div style={gridStyle}>
          {/* Passed */}
          <div>
            <div style={bigNumber}>{passed}</div>
            <div style={labelStyle}>Cases passed</div>
          </div>
          {/* Failed */}
          <div>
            <div style={bigNumber}>{failed}</div>
            <div style={labelStyle}>Cases failed</div>
          </div>
          {/* Action points */}
          <div>
            <div style={{ fontSize: 22, marginBottom: 12 }}>Action points</div>
            <ul style={listStyle}>
              {actionPoints.map((pt, idx) => (
                <li key={idx}>{pt}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 