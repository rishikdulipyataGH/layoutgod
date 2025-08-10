export interface Layout {
  id: number;
  name: string;
  slug: string;
  type: string;
  description: string;
  visual_data: LayoutVisualData;
  file_formats: Record<string, string>;
  source_url?: string;
  created_at: string;
  updated_at: string;
  recommendations?: Recommendation[];
}

export interface LayoutVisualData {
  keys: Record<string, string>;
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  issue?: string;
  description: string;
  suggestions?: string[];
  impact?: string;
}

export interface LayoutStats {
  id?: number;
  layout_id?: number;
  effort: number;
  distance: number;
  pinky_distance: number;
  pinky_off_home_pct: number;
  same_finger_bigrams_pct: number;
  skip_bigrams_pct: number;
  skip_bigrams2_pct: number;
  lateral_stretch_pct: number;
  pinky_scissors_pct: number;
  two_row_sfb_pct: number;
  two_row_jumps_pct: number;
  trigram_alt_pct: number;
  tri_redirect_pct: number;
  roll_in_pct: number;
  roll_out_pct: number;
  col5_6_pct: number;
  created_at?: string;
  updated_at?: string;
}

export interface LayoutWithStats extends Layout {
  effort?: number;
  distance?: number;
  pinky_distance?: number;
  pinky_off_home_pct?: number;
  same_finger_bigrams_pct?: number;
  skip_bigrams_pct?: number;
  skip_bigrams2_pct?: number;
  lateral_stretch_pct?: number;
  pinky_scissors_pct?: number;
  two_row_sfb_pct?: number;
  two_row_jumps_pct?: number;
  trigram_alt_pct?: number;
  tri_redirect_pct?: number;
  roll_in_pct?: number;
  roll_out_pct?: number;
  col5_6_pct?: number;
  recommendation_score?: number;
  source_url?: string;
}

export interface TypingTest {
  id: number;
  user_id: number | null;
  layout_id: number;
  timestamp: string;
  words_per_minute: number;
  accuracy: number;
  finger_loads: Record<string, number>;
  weak_fingers: string[];
  created_at: string;
}

export interface Suggestion {
  id: number;
  layout_id: number;
  suggestion_type: string;
  change_details: Record<string, any>;
  score_change: number;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KeyboardViewType {
  type: 'staggered';
  label: string;
}

export interface PreferenceType {
  value: 'comfort' | 'speed' | 'gaming' | 'programming' | 'pinky_strain';
  label: string;
  description: string;
}

export interface MetricInfo {
  key: keyof LayoutStats;
  label: string;
  description: string;
  unit?: string;
  lowerIsBetter: boolean;
  goodThreshold?: number;
  badThreshold?: number;
}

export interface FingerMapping {
  [key: string]: 'LP' | 'LR' | 'LM' | 'LI' | 'RI' | 'RM' | 'RR' | 'RP';
}

export interface KeyPosition {
  row: number;
  col: number;
}

export interface LayoutAnalysisResult {
  stats: LayoutStats;
  suggestions?: string[];
  warnings?: string[];
}
