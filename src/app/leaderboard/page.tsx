'use client';

import React, { useEffect, useState } from 'react';
import LeaderboardTable from '../../components/LeaderboardTable';
import { fetchUserLeaderboard, fetchSchoolLeaderboard } from '../../components/leaderboardApi';
import { UserLeaderboardRow, SchoolLeaderboardRow } from '../../types/performance';

const USER_COLUMNS: { key: keyof UserLeaderboardRow; label: string }[] = [
  { key: 'rank', label: 'Rank' },
  { key: 'username', label: 'Username' },
  { key: 'med_school', label: 'Medical School' },
  { key: 'year_group', label: 'Year Group' },
  { key: 'cases_passed', label: 'Cases Passed' },
  { key: 'total_cases', label: 'Total Cases' },
  { key: 'pass_rate', label: 'Pass Rate' },
];
const SCHOOL_COLUMNS: { key: keyof SchoolLeaderboardRow; label: string }[] = [
  { key: 'rank', label: 'Rank' },
  { key: 'medical_school', label: 'Medical School' },
  { key: 'num_users', label: 'Users' },
  { key: 'cases_passed', label: 'Cases Passed' },
  { key: 'total_cases', label: 'Total Cases' },
  { key: 'pass_rate', label: 'Pass Rate' },
];

export default function LeaderboardPage() {
  const [view, setView] = useState<'user' | 'school'>('user');
  const [sortKey, setSortKey] = useState<keyof UserLeaderboardRow | keyof SchoolLeaderboardRow>('cases_passed');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [timePeriod, setTimePeriod] = useState<'all' | 'day' | 'week' | 'month' | 'season'>('all');
  const [season, setSeason] = useState<'winter' | 'spring' | 'summer' | 'autumn'>('winter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRows, setUserRows] = useState<UserLeaderboardRow[]>([]);
  const [userRow, setUserRow] = useState<UserLeaderboardRow | null>(null);
  const [schoolRows, setSchoolRows] = useState<SchoolLeaderboardRow[]>([]);
  const [schoolRow, setSchoolRow] = useState<SchoolLeaderboardRow | null>(null);

  // Fetch leaderboard data
  useEffect(() => {
    setLoading(true);
    setError(null);
    if (view === 'user') {
      fetchUserLeaderboard({
        sort_by: sortKey as keyof UserLeaderboardRow,
        sort_order: sortOrder,
        time_period: timePeriod,
        ...(timePeriod === 'season' ? { season } : {}),
        page: 1,
        page_size: 25,
      })
        .then(res => {
          setUserRows(res.results);
          setUserRow(res.user_row);
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    } else {
      fetchSchoolLeaderboard({
        sort_by: sortKey as keyof SchoolLeaderboardRow,
        sort_order: sortOrder,
        time_period: timePeriod,
        ...(timePeriod === 'season' ? { season } : {}),
        page: 1,
        page_size: 25,
      })
        .then(res => {
          setSchoolRows(res.results);
          setSchoolRow(res.user_school_row);
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [view, sortKey, sortOrder, timePeriod, season]);

  // Sorting handler
  const handleSort = (key: keyof UserLeaderboardRow | keyof SchoolLeaderboardRow) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  // Floating user row logic
  function renderFloatingUserRow() {
    if (view === 'user' && userRow && !userRows.some(r => r.rank === userRow.rank)) {
      return (
        <div style={{ background: '#222', border: '2px solid #d77400', borderRadius: 12, padding: 16, color: '#ffd5a6', fontFamily: 'VT323', marginBottom: 8 }}>
          <b>Your Rank:</b> {userRow.rank} | <b>Username:</b> {userRow.username} | <b>School:</b> {userRow.med_school} | <b>Cases Passed:</b> {userRow.cases_passed} | <b>Pass Rate:</b> {userRow.pass_rate}%
        </div>
      );
    }
    if (view === 'school' && schoolRow && !schoolRows.some(r => r.rank === schoolRow.rank)) {
      return (
        <div style={{ background: '#222', border: '2px solid #d77400', borderRadius: 12, padding: 16, color: '#ffd5a6', fontFamily: 'VT323', marginBottom: 8 }}>
          <b>Your School Rank:</b> {schoolRow.rank} | <b>School:</b> {schoolRow.medical_school} | <b>Cases Passed:</b> {schoolRow.cases_passed} | <b>Pass Rate:</b> {schoolRow.pass_rate}%
        </div>
      );
    }
    return null;
  }

  return (
    <div style={{ padding: 32, fontFamily: 'VT323', color: '#ffd5a6', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <h2 style={{ fontSize: 32, marginBottom: 24 }}>Leaderboard</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button
          style={{ background: view === 'user' ? '#d77400' : '#222', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontFamily: 'VT323', fontSize: 20, cursor: 'pointer' }}
          onClick={() => setView('user')}
        >
          User Leaderboard
        </button>
        <button
          style={{ background: view === 'school' ? '#d77400' : '#222', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontFamily: 'VT323', fontSize: 20, cursor: 'pointer' }}
          onClick={() => setView('school')}
        >
          School Leaderboard
        </button>
        <select value={timePeriod} onChange={e => setTimePeriod(e.target.value as any)} style={{ fontFamily: 'VT323', fontSize: 18, padding: '4px 12px', borderRadius: 6, border: '1px solid #d77400', background: '#181818', color: '#ffd5a6' }}>
          <option value="all">All Time</option>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="season">Season</option>
        </select>
        {timePeriod === 'season' && (
          <select value={season} onChange={e => setSeason(e.target.value as any)} style={{ fontFamily: 'VT323', fontSize: 18, padding: '4px 12px', borderRadius: 6, border: '1px solid #d77400', background: '#181818', color: '#ffd5a6' }}>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="autumn">Autumn</option>
          </select>
        )}
      </div>
      {view === 'user' ? (
        <LeaderboardTable<UserLeaderboardRow>
          columns={USER_COLUMNS}
          rows={userRows}
          loading={loading}
          error={error}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
          floatingUserRow={renderFloatingUserRow()}
        />
      ) : (
        <LeaderboardTable<SchoolLeaderboardRow>
          columns={SCHOOL_COLUMNS}
          rows={schoolRows}
          loading={loading}
          error={error}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
          floatingUserRow={renderFloatingUserRow()}
        />
      )}
    </div>
  );
} 