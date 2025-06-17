'use client';

import React from 'react';

interface WeeklySummaryActionPoint {
  text: string;
  ward: string | null;
  condition: string | null;
}

interface WeeklySummaryProps {
  passed: number;
  failed: number;
  actionPoints: WeeklySummaryActionPoint[];
  userName?: string;
  onActionClick?: (ward: string, condition: string) => void;
}

export default function WeeklySummary({
  passed,
  failed,
  actionPoints,
  userName = 'Anon_name',
  onActionClick,
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

  const feedbackTextStyle: React.CSSProperties = {
    color: '#ffd5a6',
    fontFamily: 'VT323',
    fontSize: 20,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.5,
    letterSpacing: 0,
  };

  const tryNowButtonStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#ffd5a6',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.2s, text-decoration 0.2s',
    fontSize: 20,
    padding: 0,
    margin: 0,
    outline: 'none',
    fontFamily: 'VT323',
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
              {actionPoints.map((pt, idx) => {
                // Look for 'Try now' (case-insensitive, with or without period)
                const tryNowMatch = pt.text.match(/(.*?)(\s*Try now\.?$)/i);
                if (tryNowMatch && pt.ward && pt.condition && onActionClick) {
                  const mainText = tryNowMatch[1].trim();
                  const tryNowText = tryNowMatch[2].trim();
                  return (
                    <li key={idx} style={feedbackTextStyle}>
                      {mainText}{' '}
                      <button
                        style={tryNowButtonStyle}
                        onClick={() => onActionClick(pt.ward!, pt.condition!)}
                        onMouseOver={e => {
                          (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                          (e.currentTarget as HTMLButtonElement).style.textDecoration = 'underline';
                        }}
                        onMouseOut={e => {
                          (e.currentTarget as HTMLButtonElement).style.color = '#ffd5a6';
                          (e.currentTarget as HTMLButtonElement).style.textDecoration = 'none';
                        }}
                      >
                        {tryNowText}
                      </button>
                    </li>
                  );
                } else {
                  return (
                    <li key={idx} style={feedbackTextStyle}>{pt.text}</li>
                  );
                }
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 