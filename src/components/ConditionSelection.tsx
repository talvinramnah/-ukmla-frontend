import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTokens } from './TokenContext';

interface ConditionSelectionProps {
  ward: string;
}

export default function ConditionSelection({ ward }: ConditionSelectionProps) {
  const { accessToken, refreshToken } = useTokens();
  const [conditions, setConditions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken || !refreshToken || !ward) return;
    const fetchConditions = async () => {
      try {
        const res = await fetch('https://ukmla-case-tutor-api.onrender.com/wards', {
          headers: { Authorization: `Bearer ${accessToken}` },
          credentials: 'include',
        });
        const data = await res.json();
        const wardConditions: string[] = data.wards?.[ward] || [];
        setConditions(wardConditions);
      } catch (err) {
        console.error('Error fetching conditions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConditions();
  }, [accessToken, refreshToken, ward]);

  if (loading) return <p style={{ color: '#ffd5a6', fontFamily: 'VT323', padding: 32 }}>Loading…</p>;

  const handleSelectCondition = (condition: string) => {
    router.push(`/${encodeURIComponent(ward)}/${encodeURIComponent(condition)}`);
  };

  return (
    <div style={{ padding: 32, fontFamily: 'VT323', color: '#ffd5a6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 28 }}>Select a Condition in {ward.replace(/_/g, ' ')}</h2>
        <button
          onClick={() => router.replace('/wards')}
          style={{
            background: '#d77400',
            border: '2px solid #000',
            padding: '6px 16px',
            borderRadius: 10,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 20,
            fontFamily: 'VT323',
          }}
        >
          ← Back to Wards
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {conditions.map((c) => (
          <button
            key={c}
            onClick={() => handleSelectCondition(c)}
            style={{
              background: '#d77400',
              border: '3px solid #000',
              padding: '12px 20px',
              borderRadius: 12,
              color: '#fff',
              cursor: 'pointer',
              fontSize: 20,
              fontFamily: 'VT323',
              minWidth: 140,
            }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
} 