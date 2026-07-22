export interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  education: string | null;
  track: string;
  duration: string;
  motivation: string | null;
  resume_url: string | null;
  resume_filename: string | null;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
}

export const TRACKS = [
  { value: 'machine-learning', label: 'Machine Learning', icon: 'BrainCircuit', desc: 'Build intelligent models and predictive systems' },
  { value: 'data-analytics', label: 'Data Analytics', icon: 'BarChart3', desc: 'Turn raw data into actionable insights' },
  { value: 'frontend-dev', label: 'Front-End Web Development', icon: 'Code2', desc: 'Craft beautiful, responsive web experiences' },
  { value: 'nlp', label: 'Natural Language Processing (NLP)', icon: 'MessageSquareText', desc: 'Work with language models and text AI' },
  { value: 'ui-ux', label: 'UI/UX Design', icon: 'PenTool', desc: 'Design intuitive, user-centered interfaces' },
] as const;

export const DURATIONS = [
  { value: '2-weeks', label: '2 Weeks' },
  { value: '1-month', label: '1 Month' },
] as const;

export const TRACK_LABELS: Record<string, string> = {
  'machine-learning': 'Machine Learning',
  'data-analytics': 'Data Analytics',
  'frontend-dev': 'Front-End Web Development',
  'nlp': 'Natural Language Processing (NLP)',
  'ui-ux': 'UI/UX Design',
};

export const DURATION_LABELS: Record<string, string> = {
  '2-weeks': '2 Weeks',
  '1-month': '1 Month',
};

export const STATUS_LABELS: Record<string, string> = {
  'pending': 'Pending',
  'reviewed': 'Reviewed',
  'accepted': 'Accepted',
  'rejected': 'Rejected',
};

export const STATUS_COLORS: Record<string, string> = {
  'pending': 'bg-amber-100 text-amber-700 border-amber-200',
  'reviewed': 'bg-blue-100 text-blue-700 border-blue-200',
  'accepted': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'rejected': 'bg-red-100 text-red-700 border-red-200',
};
