'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LeaderboardPage() {
  const router = useRouter();
  return (
    <div style={{ padding: 32, fontFamily: 'VT323', color: '#ffd5a6' }}>
      <h2 style={{ fontSize: 32, marginBottom: 24 }}>Leaderboard (Coming Soon)</h2>
      <p style={{ fontSize: 20, marginBottom: 24 }}>
        Competitive rankings will appear here in a future update.
      </p>
      <button
        style={{
          background: '#d77400',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '12px 24px',
          fontFamily: 'VT323',
          fontSize: 20,
          cursor: 'pointer',
        }}
        onClick={() => router.push('/wards')}
      >
        ← Back to Wards
      </button>
    </div>
  );
} 