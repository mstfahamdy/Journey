
import React, { useState } from 'react';
import { UserStats, CustomAdhkar } from '../types';
import { ADHKAR_CATEGORIES, ADHKAR_LIST } from '../constants';
import { Check, ChevronLeft, BookOpen, Minus, Plus, X, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';

interface DailyGuideProps {
  stats: UserStats;
  toggleAdhkar: (cat: keyof UserStats['adhkar']) => void;
  toggleIndividualAdhkar: (id: string) => void;
  updateQuran: (pages: number) => void;
  updateQuranJuz: (juz: number) => void;
  selectedAdhkarIds: string[];
  adhkarOrder: string[];
  customAdhkar: CustomAdhkar[];
}

const DailyGuide: React.FC<DailyGuideProps> = ({ stats, toggleAdhkar, toggleIndividualAdhkar, updateQuran, updateQuranJuz, selectedAdhkarIds, adhkarOrder, customAdhkar }) => {
  const [quranMode, setQuranMode] = useState<'pages' | 'juz'>('pages');
  const [readingCategory, setReadingCategory] = useState<string | null>(null);

  // Merge default and custom list
  const allAdhkar = [...ADHKAR_LIST, ...customAdhkar];

  // Sort based on custom order, then filter
  const getSortedSelectedAdhkarForCategory = (categoryId: string) => {
    const list = [...allAdhkar].sort((a, b) => {
      const indexA = adhkarOrder.indexOf(a.id);
      const indexB = adhkarOrder.indexOf(b.id);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
    return list.filter(a => a.category === categoryId && selectedAdhkarIds.includes(a.id));
  };

  const openAdhkarReader = (categoryId: string) => {
    setReadingCategory(categoryId);
  };

  const currentReadingList = readingCategory ? getSortedSelectedAdhkarForCategory(readingCategory) : [];
  const activeCategoryData = readingCategory ? ADHKAR_CATEGORIES.find(c => c.id === readingCategory) : null;

  return (
    <div className="p-4 space-y-6">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">يوم المسلم</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">خطواتك اليومية من الاستيقاظ حتى المنام</p>
      </header>

      {/* Adhkar Sections */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-r-4 border-emerald-500 pr-3">
          <h3 className="font-bold text-slate-800 dark:text-slate-200">حصن المسلم</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {ADHKAR_CATEGORIES.map((cat) => {
            const selectedAdhkar = getSortedSelectedAdhkarForCategory(cat.id);
            if (selectedAdhkar.length === 0) return null;

            const completedCount = selectedAdhkar.filter(a => stats.completedAdhkarIds[a.id]).length;

            return (
              <div 
                key={cat.id} 
                onClick={() => openAdhkarReader(cat.id)}
                className="bg-white dark:bg-slate-800/40 p-4 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-200 dark:hover:border-slate-600 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-800 dark:text-slate-200">
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">{cat.title}</h4>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
                        {completedCount}/{selectedAdhkar.length}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-2">{cat.time}</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedAdhkar.slice(0, 3).map((a, i) => (
                        <span key={i} className={`text-[9px] px-2 py-1 rounded-lg transition-all border ${stats.completedAdhkarIds[a.id] ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-50 dark:bg-slate-700/60 text-slate-400 dark:text-slate-400 border dark:border-slate-600/50'}`}>
                          {a.text.slice(0, 18)}...
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    stats.adhkar[cat.id as keyof UserStats['adhkar']]
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700'
                  }`}
                >
                  {stats.adhkar[cat.id as keyof UserStats['adhkar']] ? <Check size={20} /> : <ChevronLeft size={20} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quran Tracker */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-100 dark:shadow-none overflow-hidden relative">
        <div className="absolute -top-10 -left-10 opacity-10">
          <MessageCircle size={200} />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">تلاوة القرآن</h3>
              <p className="text-indigo-100 text-xs mt-1">اجعل للقرآن نصيباً من يومك</p>
            </div>
            <div className="bg-white/20 p-1 rounded-2xl flex backdrop-blur-sm border border-white/10">
              <button 
                onClick={(e) => { e.stopPropagation(); setQuranMode('juz'); }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${quranMode === 'juz' ? 'bg-white text-indigo-600 shadow-md' : 'text-white/80'}`}
              >أجزاء</button>
              <button 
                onClick={(e) => { e.stopPropagation(); setQuranMode('pages'); }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${quranMode === 'pages' ? 'bg-white text-indigo-600 shadow-md' : 'text-white/80'}`}
              >صفحات</button>
            </div>
          </div>

          <div className="flex items-center justify-between px-4">
            <button 
              onClick={() => quranMode === 'pages' ? updateQuran(stats.quranPages + 1) : updateQuranJuz(stats.quranJuz + 1)}
              className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all active:scale-90 border border-white/20"
            >
              <Plus size={24} />
            </button>
            
            <div className="text-center min-w-[100px] animate-in zoom-in duration-300">
              <span className="text-6xl font-bold block leading-none">
                {quranMode === 'pages' ? stats.quranPages : stats.quranJuz}
              </span>
              <p className="text-sm mt-3 font-bold text-indigo-100 uppercase tracking-widest">
                {quranMode === 'pages' ? 'صفحة' : 'جزء'}
              </p>
            </div>

            <button 
              onClick={() => quranMode === 'pages' ? updateQuran(Math.max(0, stats.quranPages - 1)) : updateQuranJuz(Math.max(0, stats.quranJuz - 1))}
              className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all active:scale-90 border border-white/20"
            >
              <Minus size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Adhkar Reader Modal */}
      {readingCategory && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md h-[95vh] rounded-t-[3rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-full duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
            {/* Header */}
            <div className="p-8 border-b dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-500">
                  {activeCategoryData?.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{activeCategoryData?.title}</h3>
                  <p className="text-xs text-slate-400 font-medium">أذكار صحيحة ثابتة عن النبي ﷺ</p>
                </div>
              </div>
              <button 
                onClick={() => setReadingCategory(null)}
                className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all active:rotate-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scroll">
              {currentReadingList.map((item, index) => (
                <div key={item.id} className="group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 80}ms` }}>
                  <div className={`p-5 rounded-3xl border-2 transition-all ${stats.completedAdhkarIds[item.id] ? 'bg-emerald-500/5 border-emerald-500 shadow-lg shadow-emerald-500/5' : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}>
                    <div className="flex items-start gap-5">
                      <button 
                        onClick={() => toggleIndividualAdhkar(item.id)}
                        className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center transition-all ${stats.completedAdhkarIds[item.id] ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-300'}`}
                      >
                        {stats.completedAdhkarIds[item.id] ? <Check size={20} strokeWidth={3} /> : <span className="text-xs font-bold">{index + 1}</span>}
                      </button>
                      <div className="flex-1 space-y-3">
                        <p className="text-xl leading-[2.2] text-slate-800 dark:text-slate-200 font-medium text-right font-tajawal">
                          {item.text}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">الأجر: +5 حسنات</span>
                          {item.count > 1 && (
                            <span className="text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-2xl border border-amber-100 dark:border-amber-800/50">
                              كرر {item.count} مرات
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="py-16 text-center space-y-4 opacity-30">
                <Sparkles size={32} className="mx-auto text-emerald-500" />
                <p className="text-sm font-medium">وصلت لنهاية الأذكار الصحيحة</p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-t-[3rem] border-t dark:border-slate-800">
              <button 
                onClick={() => {
                  toggleAdhkar(readingCategory as any);
                  setReadingCategory(null);
                }}
                className={`w-full py-5 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${
                  stats.adhkar[readingCategory as keyof UserStats['adhkar']]
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shadow-none'
                    : 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/20'
                }`}
              >
                {stats.adhkar[readingCategory as keyof UserStats['adhkar']] ? (
                  <>تم الإنجاز بنجاح <Check size={24} /></>
                ) : (
                  <>إتمام المجموعة والحصول على مكافأة <ArrowRight size={24} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyGuide;
