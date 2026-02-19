
import React, { useState, useEffect } from 'react';
import { UserStats, PrayerKey, DailyChallenge, PrayerDetail } from '../types';
import { PRAYERS } from '../constants';
import { 
  CheckCircle2, Circle, Flame, Sparkles, BookOpen, 
  Plus, Minus, Check, Trophy, ChevronDown, 
  ChevronUp, Users, Heart, Coins, Utensils, Star
} from 'lucide-react';
import { getDailyInspiration } from '../services/geminiService';

interface DashboardProps {
  stats: UserStats;
  updateDetailedPrayer: (key: PrayerKey, completed: boolean, isJamaah: boolean) => void;
  updateAdhkarAfterPrayer: (key: PrayerKey) => void;
  updateQiyam: (rakats: number, witr: boolean) => void;
  updateNawafil: (rakats: number) => void;
  updateGoodDeed: (key: keyof UserStats['goodDeeds']) => void;
  updateQuran: (pages: number) => void;
  updateQuranJuz: (juz: number) => void;
  challenge: DailyChallenge | null;
  completeChallenge: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  stats, updateDetailedPrayer, updateAdhkarAfterPrayer, updateQiyam, 
  updateNawafil, updateGoodDeed, updateQuran, updateQuranJuz, 
  challenge, completeChallenge 
}) => {
  const [inspiration, setInspiration] = useState('جارٍ استحضار السكينة...');
  const [isEditingQuran, setIsEditingQuran] = useState(false);
  const [editMode, setEditMode] = useState<'pages' | 'juz'>('pages');
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  useEffect(() => {
    getDailyInspiration().then(setInspiration);
  }, []);

  const progress = ((Object.values(stats.detailedPrayers) as PrayerDetail[]).filter(p => p.completed).length / 5) * 100;

  const toggleGroup = (group: string) => {
    setExpandedGroup(expandedGroup === group ? null : group);
  };

  // 1 letter = 10 Hasanat. 1 page ~ 500 letters.
  const quranHasanat = (stats.quranPages * 5000) + (stats.quranJuz * 100000);

  const dailyDeedPoints = () => {
    let pts = 0;
    Object.keys(stats.detailedPrayers).forEach(k => {
      const p = stats.detailedPrayers[k as PrayerKey];
      if (p.completed) pts += (p.isJamaah ? 135 : 5);
      if (stats.adhkarAfterPrayer[k as PrayerKey]) pts += 15;
    });
    pts += (stats.qiyamRakats / 2) * 8 + (stats.witrCompleted ? 10 : 0);
    pts += (stats.nawafilRakats / 2) * 10;
    if (stats.goodDeeds.iftar) pts += 200;
    if (stats.goodDeeds.sadaqah) pts += 100;
    if (stats.goodDeeds.general) pts += 50;
    
    const individualAdhkarPts = Object.values(stats.completedAdhkarIds || {}).filter(Boolean).length * 5;
    pts += individualAdhkarPts;

    Object.values(stats.adhkar).forEach(v => { if (v) pts += 50; });
    if (challenge?.completed) pts += challenge.points;
    
    // Quran points are huge now, adding them to daily points visual
    pts += (stats.quranPages * 5000) + (stats.quranJuz * 100000);

    return pts;
  };

  return (
    <div className="p-4 space-y-6">
      {/* Status Card */}
      <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-200 dark:shadow-emerald-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={120} />
        </div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-emerald-100 text-sm font-medium">مستوى الالتزام</p>
            <h2 className="text-3xl font-bold">{stats.level}</h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span className="font-bold">{stats.streak} أيام</span>
            </div>
            <div className="bg-emerald-500/50 border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm text-[10px] font-bold">
              {dailyDeedPoints().toLocaleString()} حسنة اليوم ✨
            </div>
          </div>
        </div>
        
        <div className="mt-8 relative z-10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-emerald-100 text-sm font-medium">إجمالي النقاط: {stats.points.toLocaleString()}</span>
            <span className="text-white font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-white/80 via-white to-white/90 transition-all duration-1000 cubic-bezier(0.65, 0, 0.35, 1) relative" 
              style={{ width: `${progress}%` }} 
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/30 to-transparent w-full h-full -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Deeds Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500 w-5 h-5" /> الأعمال اليومية بالنقاط
          </h3>
          <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full">
            مجموع اليوم: {dailyDeedPoints().toLocaleString()} ن
          </span>
        </div>

        {/* Grouping UI elements for better layout */}
        <div className="grid grid-cols-1 gap-3">
          {/* Detailed Prayers Group */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <button onClick={() => toggleGroup('prayers')} className="w-full p-4 flex items-center justify-between text-right">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-500">
                  <Users size={18} />
                </div>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">الصلوات الخمس</span>
              </div>
              {expandedGroup === 'prayers' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedGroup === 'prayers' && (
              <div className="px-4 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                {PRAYERS.map(p => (
                  <div key={p.key} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-sm font-bold dark:text-slate-200">{p.label}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateDetailedPrayer(p.key, !stats.detailedPrayers[p.key].completed || stats.detailedPrayers[p.key].isJamaah, false)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${stats.detailedPrayers[p.key].completed && !stats.detailedPrayers[p.key].isJamaah ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-600 text-slate-400'}`}
                      >فرد</button>
                      <button 
                        onClick={() => updateDetailedPrayer(p.key, !stats.detailedPrayers[p.key].completed || !stats.detailedPrayers[p.key].isJamaah, true)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${stats.detailedPrayers[p.key].completed && stats.detailedPrayers[p.key].isJamaah ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-600 text-slate-400'}`}
                      >جماعة</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Adhkar After Prayer Group */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <button onClick={() => toggleGroup('adhkar')} className="w-full p-4 flex items-center justify-between text-right">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center text-amber-500">
                  <Sparkles size={18} />
                </div>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">أذكار بعد الصلاة</span>
              </div>
              {expandedGroup === 'adhkar' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedGroup === 'adhkar' && (
              <div className="px-4 pb-4 grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-200">
                {PRAYERS.map(p => (
                  <button 
                    key={p.key}
                    onClick={() => updateAdhkarAfterPrayer(p.key)}
                    className={`p-3 rounded-xl flex items-center justify-between transition-all ${stats.adhkarAfterPrayer[p.key] ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-700/50 border-transparent'} border`}
                  >
                    <span className="text-xs font-bold dark:text-slate-200">{p.label}</span>
                    {stats.adhkarAfterPrayer[p.key] ? <Check size={14} className="text-emerald-500" /> : <Circle size={14} className="text-slate-300" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Qiyam Group */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <button onClick={() => toggleGroup('qiyam')} className="w-full p-4 flex items-center justify-between text-right">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center text-indigo-500">
                  <Sparkles size={18} />
                </div>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">صلاة القيام</span>
              </div>
              {expandedGroup === 'qiyam' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedGroup === 'qiyam' && (
              <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold dark:text-slate-300">عدد الركعات</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQiyam(Math.max(0, stats.qiyamRakats - 2), stats.witrCompleted)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center"><Minus size={14} /></button>
                    <span className="w-6 text-center font-bold">{stats.qiyamRakats}</span>
                    <button onClick={() => updateQiyam(stats.qiyamRakats + 2, stats.witrCompleted)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center"><Plus size={14} /></button>
                  </div>
                </div>
                <button 
                  onClick={() => updateQiyam(stats.qiyamRakats, !stats.witrCompleted)}
                  className={`w-full p-3 rounded-xl flex items-center justify-between transition-all ${stats.witrCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-700/50 text-slate-500'}`}
                >
                  <span className="text-xs font-bold">صلاة الوتر</span>
                  {stats.witrCompleted && <Check size={14} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Daily Challenge Section */}
      {challenge && (
        <div className={`p-5 rounded-3xl relative overflow-hidden transition-all duration-300 ${challenge.completed ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'}`}>
          {!challenge.completed && <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy size={80} /></div>}
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <h3 className={`font-bold flex items-center gap-2 ${challenge.completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-white'}`}>
                {challenge.completed ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
                تحدي اليوم
              </h3>
              {!challenge.completed && <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">+{challenge.points} ن</span>}
            </div>
            <h4 className={`text-lg font-bold mb-1 ${challenge.completed ? 'text-slate-800 dark:text-slate-200' : 'text-white'}`}>{challenge.title}</h4>
            <p className={`text-sm mb-4 leading-relaxed ${challenge.completed ? 'text-slate-500 dark:text-slate-400' : 'text-indigo-100'}`}>
              {challenge.description}
            </p>
            {!challenge.completed ? (
              <button 
                onClick={completeChallenge}
                className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-bold shadow-md hover:bg-slate-50 active:scale-95 transition-all"
              >
                تم الإنجاز بنجاح
              </button>
            ) : (
              <div className="text-center font-bold text-emerald-600 dark:text-emerald-400 text-sm">أحسنت! تم الحصول على {challenge.points} نقطة</div>
            )}
          </div>
        </div>
      )}

      {/* Daily Inspiration */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm leading-relaxed">
        <h3 className="text-slate-400 text-xs font-bold mb-2 flex items-center gap-1">
          <Sparkles size={14} className="text-amber-400" /> حكمة اليوم
        </h3>
        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{inspiration}</p>
      </div>

      {/* Quran Card - Enhanced for Hasanat Visualization */}
      <div className="bg-slate-900 border border-indigo-500/30 p-6 rounded-[2.5rem] shadow-xl overflow-hidden relative group">
        <div className="absolute -right-6 -top-6 bg-indigo-500/10 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <BookOpen size={32} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-white">ورد القرآن الكريم</h4>
                <div className="flex gap-2 mt-1">
                   <span className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-lg border border-indigo-500/10">الحرف بـ 10 حسنات</span>
                </div>
              </div>
            </div>
            
            {!isEditingQuran && (
              <button onClick={() => setIsEditingQuran(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                تعديل الورد
              </button>
            )}
          </div>

          <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-3xl border border-slate-700">
             <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">إجمالي الحسنات المكتسبة</p>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-emerald-400 leading-none">{quranHasanat.toLocaleString()}</span>
                   <span className="text-xs text-emerald-500/80 font-bold">حسنة ✨</span>
                </div>
             </div>
             <div className="text-left">
                <div className="flex items-center gap-1 text-slate-300 font-bold text-sm">
                   {stats.quranJuz} <span className="text-[10px] text-slate-500">جزء</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300 font-bold text-sm">
                   {stats.quranPages} <span className="text-[10px] text-slate-500">صفحة</span>
                </div>
             </div>
          </div>

          {isEditingQuran && (
            <div className="p-4 bg-slate-800 rounded-3xl space-y-4 animate-in slide-in-from-top-4 duration-300">
               <div className="flex justify-between items-center px-2">
                  <div className="flex bg-slate-900 p-1 rounded-xl">
                    <button onClick={() => setEditMode('pages')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${editMode === 'pages' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>صفحات</button>
                    <button onClick={() => setEditMode('juz')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${editMode === 'juz' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>أجزاء</button>
                  </div>
                  <button onClick={() => setIsEditingQuran(false)} className="text-slate-400 hover:text-white transition-colors"><ChevronUp size={20}/></button>
               </div>
               
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-4">
                    <button onClick={() => editMode === 'pages' ? updateQuran(Math.max(0, stats.quranPages - 1)) : updateQuranJuz(Math.max(0, stats.quranJuz - 1))} className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white border border-slate-700 active:scale-90 transition-transform"><Minus size={20}/></button>
                    <div className="text-center min-w-[60px]">
                       <span className="text-2xl font-bold text-white leading-none">{editMode === 'pages' ? stats.quranPages : stats.quranJuz}</span>
                       <p className="text-[10px] text-slate-500 mt-1">{editMode === 'pages' ? 'صفحة' : 'جزء'}</p>
                    </div>
                    <button onClick={() => editMode === 'pages' ? updateQuran(stats.quranPages + 1) : updateQuranJuz(stats.quranJuz + 1)} className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white border border-slate-700 active:scale-90 transition-transform"><Plus size={20}/></button>
                  </div>
                  <button onClick={() => setIsEditingQuran(false)} className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"><Check size={24}/></button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
