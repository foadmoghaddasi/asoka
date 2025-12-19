
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TRACK = 'TRACK',
  BREATHE = 'BREATHE',
  MEDITATE = 'MEDITATE',
  LEARN = 'LEARN'
}

export enum AuthStep {
  SPLASH = 'SPLASH',
  ONBOARDING = 'ONBOARDING',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  VERIFY = 'VERIFY'
}

export interface StressLog {
  date: string;
  level: number;
  note: string;
}

export interface DailyTip {
  title: string;
  content: string;
  category: 'Focus' | 'Relaxation' | 'Health';
}
