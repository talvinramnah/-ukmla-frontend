'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import LeaderboardTable from '../../components/LeaderboardTable';
import { fetchUserLeaderboard, fetchSchoolLeaderboard, getCachedSchools, setCachedSchools, getCachedYearGroups, setCachedYearGroups, getCachedWards, setCachedWards } from '../../components/leaderboardApi';
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

// Copy MED_SCHOOLS and YEARS constants from OnboardingModal (not exported)
const MED_SCHOOLS = [
    "University of Aberdeen School of Medicine and Dentistry",
    "Anglia Ruskin University School of Medicine",
    "Aston University Medical School",
    "Queen Mary University of London",
    "University of Birmingham College of Medical and Dental Sciences",
    "Brighton and Sussex Medical School",
    "University of Bristol Medical School",
    "University of Buckingham Medical School",
    "University of Cambridge School of Clinical Medicine",
    "Cardiff University School of Medicine",
    "University of Dundee School of Medicine",
    "Edge Hill University Medical School",
    "The University of Edinburgh Medical School",
    "University of Exeter Medical School",
    "University of Glasgow School of Medicine",
    "Hull York Medical School",
    "Imperial College London Faculty of Medicine",
    "Keele University School of Medicine",
    "Kent and Medway Medical School",
    "King's College London GKT School of Medical Education",
    "Lancaster University Medical School",
    "University of Leeds School of Medicine",
    "University of Leicester Medical School",
    "University of Liverpool School of Medicine",
    "London School of Hygiene & Tropical Medicine",
    "University of Manchester Medical School",
    "Newcastle University School of Medical Education",
    "University of East Anglia, Norwich Medical School",
    "University of Nottingham School of Medicine",
    "University of Nottingham - Lincoln Medical School",
    "University of Oxford Medical Sciences Division",
    "Plymouth University Peninsula Schools of Medicine and Dentistry",
    "Queen's University Belfast School of Medicine",
    "University of Sheffield Medical School",
    "University of Southampton School of Medicine",
    "University of St Andrews School of Medicine",
    "St George's, University of London",
    "University of Sunderland School of Medicine",
    "Swansea University Medical School",
    "University of Central Lancashire School of Medicine",
    "University of Warwick Medical School",
    "Brunel University London, Brunel Medical School",
    "Ulster University, School of Medicine",
    "University of Chester Medical School",
    "Three Counties Medical School",
    "University College London",
    "North Wales Medical School, Bangor University",
    "Pears Cumbria School of Medicine",
];
const YEARS = [
    "1st year",
    "2nd year",
    "3rd year",
    "4th year",
    "5th year",
];

export default function LeaderboardPage() {
  const [view, setView] = useState<'user' | 'school'>('user');
  const [sortKey, setSortKey] = useState<'cases_passed' | 'total_cases' | 'pass_rate' | 'rank'>('cases_passed');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [timePeriod, setTimePeriod] = useState<'all' | 'day' | 'week' | 'month' | 'season'>('all');
  const [season, setSeason] = useState<'winter' | 'spring' | 'summer' | 'autumn'>('winter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRows, setUserRows] = useState<UserLeaderboardRow[]>([]);
  const [userRow, setUserRow] = useState<UserLeaderboardRow | null>(null);
  const [schoolRows, setSchoolRows] = useState<SchoolLeaderboardRow[]>([]);
  const [schoolRow, setSchoolRow] = useState<SchoolLeaderboardRow | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [schoolOptions, setSchoolOptions] = useState<string[]>([]);
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [wardOptions, setWardOptions] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  // Infinite scroll state
  const [userPage, setUserPage] = useState(1);
  const [schoolPage, setSchoolPage] = useState(1);
  const [hasMoreUserRows, setHasMoreUserRows] = useState(true);
  const [hasMoreSchoolRows, setHasMoreSchoolRows] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleSort = (key: keyof UserLeaderboardRow | keyof SchoolLeaderboardRow) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key as 'cases_passed' | 'total_cases' | 'pass_rate' | 'rank');
      setSortOrder('desc');
    }
  };

  // Responsive: detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Load filter options (schools, years, wards)
  useEffect(() => {
    // Schools
    let schools = getCachedSchools() || [];
    if (schools.length === 0) {
      schools = MED_SCHOOLS;
      setCachedSchools(schools);
    }
    setSchoolOptions(schools);
    // Years
    let years = getCachedYearGroups() || [];
    if (years.length === 0) {
      years = YEARS;
      setCachedYearGroups(years);
    }
    setYearOptions(years);
    // Wards (for now, just use empty or placeholder)
    let wards = getCachedWards() || [];
    if (wards.length === 0) {
      wards = [];
      setCachedWards(wards);
    }
    setWardOptions(wards);
  }, []);

  // Infinite scroll fetch logic
  const fetchMoreRows = useCallback(() => {
    if (loading) return;
    if (view === 'user' && hasMoreUserRows) {
      setLoading(true);
      fetchUserLeaderboard({
        sort_by: sortKey,
        sort_order: sortOrder,
        time_period: timePeriod,
        ...(timePeriod === 'season' ? { season } : {}),
        medical_school: selectedSchool || undefined,
        year_group: selectedYear || undefined,
        ward: selectedWard || undefined,
        page: userPage + 1,
        page_size: 25,
      })
        .then(res => {
          if (res.results.length === 0) setHasMoreUserRows(false);
          setUserRows(prev => [...prev, ...res.results]);
          setUserPage(prev => prev + 1);
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    } else if (view === 'school' && hasMoreSchoolRows) {
      setLoading(true);
      fetchSchoolLeaderboard({
        sort_by: sortKey as 'cases_passed' | 'total_cases' | 'pass_rate',
        sort_order: sortOrder,
        time_period: timePeriod,
        ...(timePeriod === 'season' ? { season } : {}),
        page: schoolPage + 1,
        page_size: 25,
      })
        .then(res => {
          if (res.results.length === 0) setHasMoreSchoolRows(false);
          setSchoolRows(prev => [...prev, ...res.results]);
          setSchoolPage(prev => prev + 1);
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [loading, view, sortKey, sortOrder, timePeriod, season, selectedSchool, selectedYear, selectedWard, userPage, schoolPage, hasMoreUserRows, hasMoreSchoolRows]);

  // Reset rows and page when filters change
  useEffect(() => {
    setUserRows([]);
    setSchoolRows([]);
    setUserPage(1);
    setSchoolPage(1);
    setHasMoreUserRows(true);
    setHasMoreSchoolRows(true);
  }, [view, sortKey, sortOrder, timePeriod, season, selectedSchool, selectedYear, selectedWard]);

  // Initial fetch and on filter change
  useEffect(() => {
    setLoading(true);
    setError(null);
    if (view === 'user') {
      fetchUserLeaderboard({
        sort_by: sortKey,
        sort_order: sortOrder,
        time_period: timePeriod,
        ...(timePeriod === 'season' ? { season } : {}),
        medical_school: selectedSchool || undefined,
        year_group: selectedYear || undefined,
        ward: selectedWard || undefined,
        page: 1,
        page_size: 25,
      })
        .then(res => {
          setUserRows(res.results);
          setUserRow(res.user_row);
          setHasMoreUserRows(res.results.length === 25);
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    } else {
      fetchSchoolLeaderboard({
        sort_by: sortKey as 'cases_passed' | 'total_cases' | 'pass_rate',
        sort_order: sortOrder,
        time_period: timePeriod,
        ...(timePeriod === 'season' ? { season } : {}),
        page: 1,
        page_size: 25,
      })
        .then(res => {
          setSchoolRows(res.results);
          setSchoolRow(res.user_school_row);
          setHasMoreSchoolRows(res.results.length === 25);
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [view, sortKey, sortOrder, timePeriod, season, selectedSchool, selectedYear, selectedWard]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchMoreRows();
      }
    }, { threshold: 1 });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [fetchMoreRows]);

  // Floating user row logic
  function renderFloatingUserRow() {
    if (view === 'user' && userRow && !userRows.some(r => r.rank === userRow.rank)) {
      return (
        <div style={{ 
          background: '#222', 
          border: '2px solid #d77400', 
          borderRadius: 12, 
          padding: 16, 
          color: '#ffd5a6', 
          fontFamily: 'VT323', 
          marginBottom: 8,
          wordBreak: 'break-word' as const,
          lineHeight: 1.3,
        }}>
          <b>Your Rank:</b> {userRow.rank} | <b>Username:</b> {userRow.username} | <b>School:</b> {userRow.med_school} | <b>Cases Passed:</b> {userRow.cases_passed} | <b>Pass Rate:</b> {userRow.pass_rate}%
        </div>
      );
    }
    if (view === 'school' && schoolRow && !schoolRows.some(r => r.rank === schoolRow.rank)) {
      return (
        <div style={{ 
          background: '#222', 
          border: '2px solid #d77400', 
          borderRadius: 12, 
          padding: 16, 
          color: '#ffd5a6', 
          fontFamily: 'VT323', 
          marginBottom: 8,
          wordBreak: 'break-word' as const,
          lineHeight: 1.3,
        }}>
          <b>Your School Rank:</b> {schoolRow.rank} | <b>School:</b> {schoolRow.medical_school} | <b>Cases Passed:</b> {schoolRow.cases_passed} | <b>Pass Rate:</b> {schoolRow.pass_rate}%
        </div>
      );
    }
    return null;
  }

  // Retry logic for error state
  const retryLeaderboardFetch = () => {
    setLoading(true);
    setError(null);
    if (view === 'user') {
      fetchUserLeaderboard({
        sort_by: sortKey,
        sort_order: sortOrder,
        time_period: timePeriod,
        ...(timePeriod === 'season' ? { season } : {}),
        medical_school: selectedSchool || undefined,
        year_group: selectedYear || undefined,
        ward: selectedWard || undefined,
        page: userPage,
        page_size: 25,
      })
        .then(res => {
          setUserRows(res.results);
          setUserRow(res.user_row);
          setHasMoreUserRows(res.results.length === 25);
        })
        .catch(e => {
          if (e.message && e.message.includes('401')) {
            setError('Session expired. Please log in again.');
          } else {
            setError(e.message || 'An error occurred.');
          }
        })
        .finally(() => setLoading(false));
    } else {
      fetchSchoolLeaderboard({
        sort_by: sortKey as 'cases_passed' | 'total_cases' | 'pass_rate',
        sort_order: sortOrder,
        time_period: timePeriod,
        ...(timePeriod === 'season' ? { season } : {}),
        page: schoolPage,
        page_size: 25,
      })
        .then(res => {
          setSchoolRows(res.results);
          setSchoolRow(res.user_school_row);
          setHasMoreSchoolRows(res.results.length === 25);
        })
        .catch(e => {
          if (e.message && e.message.includes('401')) {
            setError('Session expired. Please log in again.');
          } else {
            setError(e.message || 'An error occurred.');
          }
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div style={{ padding: 32, fontFamily: 'VT323', color: '#ffd5a6', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <h2 style={{ fontSize: 32, marginBottom: 24 }}>Leaderboard</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
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
        {/* Filter Bar: Desktop only */}
        {!isMobile && (
          <>
            <select value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)} style={{ fontFamily: 'VT323', fontSize: 18, padding: '4px 12px', borderRadius: 6, border: '1px solid #d77400', background: '#181818', color: '#ffd5a6' }}>
              <option value="">All Schools</option>
              {schoolOptions.map(school => <option key={school} value={school}>{school}</option>)}
            </select>
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={{ fontFamily: 'VT323', fontSize: 18, padding: '4px 12px', borderRadius: 6, border: '1px solid #d77400', background: '#181818', color: '#ffd5a6' }}>
              <option value="">All Years</option>
              {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
            <select value={selectedWard} onChange={e => setSelectedWard(e.target.value)} style={{ fontFamily: 'VT323', fontSize: 18, padding: '4px 12px', borderRadius: 6, border: '1px solid #d77400', background: '#181818', color: '#ffd5a6' }}>
              <option value="">All Wards</option>
              {wardOptions.map(ward => <option key={ward} value={ward}>{ward}</option>)}
            </select>
          </>
        )}
        {/* Time Period filter (always shown) */}
        <select 
          value={timePeriod} 
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTimePeriod(e.target.value as 'all' | 'day' | 'week' | 'month' | 'season')} 
          style={{ fontFamily: 'VT323', fontSize: 18, padding: '4px 12px', borderRadius: 6, border: '1px solid #d77400', background: '#181818', color: '#ffd5a6' }}
        >
          <option value="all">All Time</option>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="season">Season</option>
        </select>
        {timePeriod === 'season' && (
          <select 
            value={season} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSeason(e.target.value as 'winter' | 'spring' | 'summer' | 'autumn')} 
            style={{ fontFamily: 'VT323', fontSize: 18, padding: '4px 12px', borderRadius: 6, border: '1px solid #d77400', background: '#181818', color: '#ffd5a6' }}
          >
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="autumn">Autumn</option>
          </select>
        )}
      </div>
      {view === 'user' ? (
        <>
          <LeaderboardTable<UserLeaderboardRow>
            columns={USER_COLUMNS}
            rows={userRows}
            loading={loading}
            error={error}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={handleSort}
            floatingUserRow={renderFloatingUserRow()}
            mobileColumns={['username', 'cases_passed']}
            onRetry={retryLeaderboardFetch}
          />
          <div ref={loaderRef} style={{ height: 40 }} />
          {loading && hasMoreUserRows && <div style={{ textAlign: 'center', color: '#ffd5a6', margin: 16 }}>Loading more…</div>}
        </>
      ) : (
        <>
          <LeaderboardTable<SchoolLeaderboardRow>
            columns={SCHOOL_COLUMNS}
            rows={schoolRows}
            loading={loading}
            error={error}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={handleSort}
            floatingUserRow={renderFloatingUserRow()}
            mobileColumns={['medical_school', 'cases_passed']}
            onRetry={retryLeaderboardFetch}
          />
          <div ref={loaderRef} style={{ height: 40 }} />
          {loading && hasMoreSchoolRows && <div style={{ textAlign: 'center', color: '#ffd5a6', margin: 16 }}>Loading more…</div>}
        </>
      )}
    </div>
  );
} 