
export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerDetail {
  completed: boolean;
  isJamaah: boolean;
}

export interface UserStats {
  detailedPrayers: Record<PrayerKey, PrayerDetail>;
  adhkarAfterPrayer: Record<PrayerKey, boolean>;
  qiyamRakats: number;
  witrCompleted: boolean;
  nawafilRakats: number;
  goodDeeds: {
    iftar: boolean;
    sadaqah: boolean;
    general: boolean;
  };
  adhkar: {
    morning: boolean;
    evening: boolean;
    afterPrayer: boolean;
    beforeSleep: boolean;
  };
  completedAdhkarIds: Record<string, boolean>; // Tracks individual adhkar IDs completed today
  quranPages: number;
  quranJuz: number;
  streak: number;
  points: number;
  level: UserLevel;
}

export enum UserLevel {
  BEGINNER = 'مبتدئ',
  REGULAR = 'منتظم',
  DILIGENT = 'مجتهد',
  FIRM = 'ثابت',
  ROLE_MODEL = 'قدوة'
}

export interface DailyChallenge {
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

export interface ReminderSettings {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
}

export interface CustomAdhkar {
  id: string;
  category: string;
  text: string;
  count: number;
}

export interface AppSettings {
  isDarkMode: boolean;
  reminders: ReminderSettings[];
  selectedAdhkar: string[]; // IDs of selected Adhkar
  adhkarOrder: string[]; // List of IDs in custom order
  customAdhkar: CustomAdhkar[]; // User added Adhkar
  notificationSound: string; // "gentle", "nature", "digital"
}
