export interface OverallStats {
  total_cases: number;
  total_passes: number;
  pass_rate: number; // percentage 0-100
  total_badges: number;
}

export interface LevelStats {
  total_cases: number;
  total_passes: number;
  pass_rate: number; // percentage 0-100
}

export interface RecentCase {
  condition: string;
  ward: string;
  case_variation: number;
  result: boolean;
  feedback_summary: string;
  feedback_positives: string[];
  feedback_improvements: string[];
  chat_transcript: { role: string; content: string }[];
  created_at: string; // ISO 8601
}

export interface Badge {
  ward: string;
  badge_name: string;
  earned_at: string; // ISO 8601
}

export interface ProgressData {
  overall: OverallStats;
  ward_stats: Record<string, LevelStats>;
  condition_stats: Record<string, LevelStats>;
  recent_cases: RecentCase[];
  badges: Badge[];
}

export interface WeeklyDashboardStats {
  cases_passed: number;
  cases_failed: number;
  action_points: {
    text: string;
    ward: string | null;
    condition: string | null;
  }[];
  next_refresh_in_cases: number;
}

// Leaderboard API types

export interface UserLeaderboardRow {
  rank: number;
  username: string;
  med_school: string;
  year_group: string;
  cases_passed: number;
  total_cases: number;
  pass_rate: number;
}

export interface UserLeaderboardResponse {
  results: UserLeaderboardRow[];
  total_users: number;
  page: number;
  page_size: number;
  user_row: UserLeaderboardRow;
}

export interface SchoolLeaderboardRow {
  rank: number;
  medical_school: string;
  num_users: number;
  cases_passed: number;
  total_cases: number;
  pass_rate: number;
}

export interface SchoolLeaderboardResponse {
  results: SchoolLeaderboardRow[];
  total_schools: number;
  page: number;
  page_size: number;
  user_school_row: SchoolLeaderboardRow;
} 