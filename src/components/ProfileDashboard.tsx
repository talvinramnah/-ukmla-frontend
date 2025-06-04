'use client';

import React, { useEffect, useState } from 'react';
import { useTokens } from './TokenContext';
import { useRouter } from 'next/navigation';

// Re-use ward images from WardSelection – duplicate small map for now
const WARD_IMAGES: { [key: string]: string } = {
  Cardiology: "https://imgur.com/UITBIEP.png",
  Dermatology: "https://imgur.com/FggcQvb.png",
  Ent: "https://imgur.com/SZmjj9M.png",
  Ethics_And_Law: "https://imgur.com/NcipYSx.png",
  Medicine: "https://imgur.com/R0xe5bw.png",
  Musculoskeletal: "https://imgur.com/kwtHwD3.png",
  Orthopaedics: "https://i.imgur.com/OxuFobU.png",
  Obstetrics_and_Gynaecology: "https://imgur.com/2r7qQZp",
  Ophthalmology: "https://imgur.com/sjtXGt6.png",
  Paediatrics: "https://imgur.com/1428odG.png",
  Pharmacology: "https://imgur.com/LBDA03J.png",
  Psychiatry: "https://imgur.com/T4wXfVl.png",
  Respiratory: "https://imgur.com/XHJezEJ.png",
  Statistics: "https://imgur.com/A5Jisr0.png",
  Surgery: "https://imgur.com/DNlA9zR.png",
  Infectious_Diseases: "https://i.imgur.com/r9R223a.png",
  Breast: "https://i.imgur.com/MlX5F3N.png",
  Haematology: "https://i.imgur.com/7wxKm28.png",
  Oncology: "https://i.imgur.com/VhWN3WF.png",
  Gastroenterology: "https://i.imgur.com/09yl7kO.png",
  Endocrinology: "https://i.imgur.com/ACmbxGb.png",
  Upper_Gi_Hepatobiliary: "https://i.imgur.com/JRG2GGB.png",
  General_Surgery: "https://i.imgur.com/DNlA9zR.png",
  Obstetrics_Gynaecology: "https://i.imgur.com/2r7qQZp.png",
  Ear_Nose_And_Throat: "https://i.imgur.com/SZmjj9M.png",
  Urology: "https://i.imgur.com/YQxhgGw.png",
  Nephrology: "https://i.imgur.com/L0mcATy.png",
  Colorectal: "https://i.imgur.com/ECwQAEs.png",
  Vascular: "https://i.imgur.com/0ygPvkQ.png",
  Neurology: "https://i.imgur.com/Fnm71V8.png",
  Neurosurgery: "https://i.imgur.com/kEptxfG.png",
  Rheumatology: "https://i.imgur.com/QTDYksF.png",
};

interface Badge {
  ward: string;
  earned_at: string;
}

export default function ProfileDashboard() {
  const { accessToken, refreshToken } = useTokens();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken || !refreshToken) return;
    const fetchData = async () => {
      try {
        const [progressRes, badgeRes] = await Promise.all([
          fetch('https://ukmla-case-tutor-api.onrender.com/progress', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'X-Refresh-Token': refreshToken,
            },
          }),
          fetch('https://ukmla-case-tutor-api.onrender.com/badges', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'X-Refresh-Token': refreshToken,
            },
          }),
        ]);
        const progressJson = await progressRes.json();
        const badgeJson = await badgeRes.json();
        setStats(progressJson.overall || null);
        setBadges(badgeJson.badges || []);
      } catch (err) {
        console.error('Profile fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accessToken, refreshToken]);

  if (loading) {
    return <div style={{ padding: 32, color: '#ffd5a6', fontFamily: 'VT323' }}>Loading profile…</div>;
  }

  return (
    <div style={{ padding: 32, color: '#ffd5a6', fontFamily: 'VT323' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 32 }}>Your Profile</h2>
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

      {stats && (
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 40 }}>
          <StatCard label="Total Cases" value={stats.total_cases} />
          <StatCard label="Average Score" value={stats.average_score.toFixed(1)} />
          <StatCard label="Success Rate" value={`${stats.success_rate}%`} />
          <StatCard label="Badges Earned" value={badges.length} />
        </div>
      )}

      <h3 style={{ fontSize: 24, marginBottom: 16 }}>Badges</h3>
      {badges.length === 0 ? (
        <p style={{ fontSize: 20 }}>No badges earned yet – keep practising!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 24 }}>
          {badges.map((b, idx) => {
            const imgSrc = WARD_IMAGES[b.ward] ?? 'https://i.imgur.com/UITBIEP.png';
            return (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  background: '#000',
                  border: '3px solid #d77400',
                  padding: 8,
                  borderRadius: 12,
                }}>
                  <img src={imgSrc} alt={b.ward} style={{ width: '100%', height: 'auto', imageRendering: 'pixelated' }} />
                </div>
                <div style={{ fontSize: 14, marginTop: 8 }}>{b.ward.replace(/_/g, ' ')}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div style={{
      background: '#000',
      border: '3px solid #d77400',
      borderRadius: 16,
      padding: '16px 24px',
      minWidth: 140,
    }}>
      <div style={{ fontSize: 28, color: '#fff', marginBottom: 8, textAlign: 'center' }}>{value}</div>
      <div style={{ fontSize: 16, textAlign: 'center' }}>{label}</div>
    </div>
  );
} 