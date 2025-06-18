import { UserLeaderboardResponse, SchoolLeaderboardResponse } from '../types/performance';
import { getCurrentTokens } from './TokenContext';

const API_BASE = 'https://ukmla-case-tutor-api.onrender.com';

/**
 * Fetch the user leaderboard with filters, sorting, and pagination (infinite scroll).
 * @param params Query parameters for the API call
 * @returns UserLeaderboardResponse
 */
export async function fetchUserLeaderboard(params: {
  sort_by?: 'cases_passed' | 'total_cases' | 'pass_rate' | 'rank';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
  medical_school?: string;
  year_group?: string;
  ward?: string;
  time_period?: 'all' | 'day' | 'week' | 'month' | 'season';
  season?: 'winter' | 'spring' | 'summer' | 'autumn';
}): Promise<UserLeaderboardResponse> {
  const { accessToken, refreshToken } = getCurrentTokens();
  if (!accessToken || !refreshToken) throw new Error('Not authenticated');
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) query.append(k, String(v));
  });
  const res = await fetch(`${API_BASE}/leaderboard/users?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Refresh-Token': refreshToken,
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Leaderboard API error: ${res.status}`);
  return res.json();
}

/**
 * Fetch the school leaderboard with filters, sorting, and pagination (infinite scroll).
 * @param params Query parameters for the API call
 * @returns SchoolLeaderboardResponse
 */
export async function fetchSchoolLeaderboard(params: {
  sort_by?: 'cases_passed' | 'total_cases' | 'pass_rate';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
  time_period?: 'all' | 'day' | 'week' | 'month' | 'season';
  season?: 'winter' | 'spring' | 'summer' | 'autumn';
}): Promise<SchoolLeaderboardResponse> {
  const { accessToken, refreshToken } = getCurrentTokens();
  if (!accessToken || !refreshToken) throw new Error('Not authenticated');
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) query.append(k, String(v));
  });
  const res = await fetch(`${API_BASE}/leaderboard/schools?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Refresh-Token': refreshToken,
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Leaderboard API error: ${res.status}`);
  return res.json();
}

// Placeholder: client-side cache for filter options (schools, years, wards)
// In production, this could be replaced with a more robust cache or SWR/react-query
const filterCache: {
  schools?: string[];
  yearGroups?: string[];
  wards?: string[];
} = {};

export function getCachedSchools(): string[] | undefined {
  return filterCache.schools;
}
export function setCachedSchools(schools: string[]) {
  filterCache.schools = schools;
}
export function getCachedYearGroups(): string[] | undefined {
  return filterCache.yearGroups;
}
export function setCachedYearGroups(yearGroups: string[]) {
  filterCache.yearGroups = yearGroups;
}
export function getCachedWards(): string[] | undefined {
  return filterCache.wards;
}
export function setCachedWards(wards: string[]) {
  filterCache.wards = wards;
} 