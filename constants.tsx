
import React from 'react';
import { UserLevel, PrayerKey, ReminderSettings } from './types';
import { 
  Sun, Moon, BookOpen, CheckCircle2, 
  Trophy, UserRound, House, Activity, 
  Compass, Coffee, CloudMoon, Heart, Settings2,
  Award, Zap, Star, Flame, ShieldCheck, Medal,
  Wind
} from 'lucide-react';

export const PRAYERS: { key: PrayerKey; label: string; time: string }[] = [
  { key: 'fajr', label: 'الفجر', time: '05:12' },
  { key: 'dhuhr', label: 'الظهر', time: '12:05' },
  { key: 'asr', label: 'العصر', time: '15:20' },
  { key: 'maghrib', label: 'المغرب', time: '18:45' },
  { key: 'isha', label: 'العشاء', time: '20:15' },
];

export const LEVELS = [
  { name: UserLevel.BEGINNER, minPoints: 0, color: 'bg-slate-400' },
  { name: UserLevel.REGULAR, minPoints: 2000, color: 'bg-blue-400' },
  { name: UserLevel.DILIGENT, minPoints: 10000, color: 'bg-emerald-400' },
  { name: UserLevel.FIRM, minPoints: 30000, color: 'bg-teal-500' },
  { name: UserLevel.ROLE_MODEL, minPoints: 100000, color: 'bg-amber-500' },
];

export const BADGES = [
  { id: 'b1', title: 'بداية الخير', description: 'وصلت لأول 500 نقطة', requirement: (s: any) => s.points >= 500, icon: <Star className="text-yellow-500" /> },
  { id: 'b2', title: 'صاحب الهمة', description: 'استمرارية لمدة 7 أيام', requirement: (s: any) => s.streak >= 7, icon: <Flame className="text-orange-500" /> },
  { id: 'b3', title: 'فارس الليل', description: 'المواظبة على قيام الليل', requirement: (s: any) => s.qiyamRakats >= 8, icon: <Moon className="text-indigo-500" /> },
  { id: 'b4', title: 'حافظ القرآن', description: 'قراءة جزء كامل', requirement: (s: any) => s.quranJuz >= 1, icon: <BookOpen className="text-blue-500" /> },
  { id: 'b5', title: 'المنفق الكريم', description: 'التبرع بصدقة', requirement: (s: any) => s.goodDeeds.sadaqah, icon: <Heart className="text-pink-500" /> },
  { id: 'b6', title: 'القدوة الحسنة', description: 'بلوغ مستوى قدوة', requirement: (s: any) => s.points >= 100000, icon: <Award className="text-amber-500" /> },
];

export const NAVIGATION = [
  { id: 'home', label: 'الرئيسية', icon: <House className="w-6 h-6" /> },
  { id: 'guide', label: 'يومي', icon: <Compass className="w-6 h-6" /> },
  { id: 'groups', label: 'المجموعات', icon: <UserRound className="w-6 h-6" /> },
  { id: 'journey', label: 'رحلتي', icon: <Medal className="w-6 h-6" /> },
  { id: 'stats', label: 'إحصائيات', icon: <Activity className="w-6 h-6" /> },
  { id: 'settings', label: 'الإعدادات', icon: <Settings2 className="w-6 h-6" /> },
];

export const ADHKAR_LIST = [
  // Morning
  { id: 'm1', category: 'morning', text: 'أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.', count: 1 },
  { id: 'm2', category: 'morning', text: 'اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت، وإليك النشور.', count: 1 },
  { id: 'm3', category: 'morning', text: 'سبحان الله وبحمده: عدد خلقه، ورضا نفسه، وزنة عرشه، ومداد كلماته.', count: 3 },
  { id: 'm4', category: 'morning', text: 'اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً.', count: 1 },
  { id: 'm5', category: 'morning', text: 'رضيت بالله رباً، وبالإسلام ديناً، وبمحمد صلى الله عليه وسلم نبياً.', count: 3 },
  { id: 'm6', category: 'morning', text: 'يا حي يا قيوم برحمتك أستغيث أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين.', count: 1 },
  
  // Evening
  { id: 'e1', category: 'evening', text: 'أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.', count: 1 },
  { id: 'e2', category: 'evening', text: 'اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك المصير.', count: 1 },
  { id: 'e3', category: 'evening', text: 'أعوذ بكلمات الله التامات من شر ما خلق.', count: 3 },
  { id: 'e4', category: 'evening', text: 'اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري.', count: 3 },
  { id: 'e5', category: 'evening', text: 'اللهم إني أعوذ بك من الكفر والفقر، وأعوذ بك من عذاب القبر.', count: 3 },
  
  // After Prayer
  { id: 'ap1', category: 'afterPrayer', text: 'أستغفر الله (3 مرات). اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام.', count: 1 },
  { id: 'ap2', category: 'afterPrayer', text: 'سبحان الله (33)، الحمد لله (33)، الله أكبر (33). ثم التمام: لا إله إلا الله وحده لا شريك له.', count: 1 },
  { id: 'ap3', category: 'afterPrayer', text: 'اللهم أعني على ذكرك، وشكرك، وحسن عبادتك.', count: 1 },
  { id: 'ap4', category: 'afterPrayer', text: 'قراءة آية الكرسي بعد كل صلاة.', count: 1 },
  
  // Before Sleep
  { id: 's1', category: 'beforeSleep', text: 'باسمك اللهم أموت وأحيا.', count: 1 },
  { id: 's2', category: 'beforeSleep', text: 'اللهم قني عذابك يوم تبعث عبادك.', count: 3 },
  { id: 's3', category: 'beforeSleep', text: 'سورة الملك (تلاوة).', count: 1 },
  { id: 's4', category: 'beforeSleep', text: 'اللهم أسلمت نفسي إليك، وفوضت أمري إليك، ووجهت وجهي إليك.', count: 1 },
  { id: 's5', category: 'beforeSleep', text: 'باسمك ربي وضعت جنبي، وبك أرفعه، إن أمسكت نفسي فارحمها.', count: 1 },
];

export const DEFAULT_REMINDERS: ReminderSettings[] = [
  { id: 'fajr', label: 'صلاة الفجر', time: '05:00', enabled: true },
  { id: 'morning_adhkar', label: 'أذكار الصباح', time: '06:00', enabled: true },
  { id: 'evening_adhkar', label: 'أذكار المساء', time: '17:30', enabled: true },
  { id: 'daily_challenge', label: 'تحدي اليوم', time: '10:00', enabled: true },
];

export const ADHKAR_CATEGORIES = [
  { id: 'morning', title: 'أذكار الصباح', icon: <Sun className="text-orange-400" />, time: 'بعد الفجر' },
  { id: 'evening', title: 'أذكار المساء', icon: <Moon className="text-indigo-400" />, time: 'بعد العصر' },
  { id: 'afterPrayer', title: 'أذكار بعد الصلاة', icon: <CheckCircle2 className="text-emerald-500" />, time: 'مباشرة' },
  { id: 'beforeSleep', title: 'أذكار النوم', icon: <CloudMoon className="text-blue-500" />, time: 'قبل النوم' },
];

export const MOCK_GROUP: any[] = [
  { id: '1', name: 'أحمد محمود', points: 4520, rank: 1, avatar: 'https://picsum.photos/seed/user1/100' },
  { id: '2', name: 'عمر خالد', points: 4100, rank: 2, avatar: 'https://picsum.photos/seed/user2/100' },
  { id: '3', name: 'ياسين علي', points: 3850, rank: 3, avatar: 'https://picsum.photos/seed/user3/100' },
  { id: '4', name: 'أنت', points: 2900, rank: 4, avatar: 'https://picsum.photos/seed/me/100', isMe: true },
];
