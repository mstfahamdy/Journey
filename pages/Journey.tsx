
import React from 'react';
import { UserLevel, UserStats } from '../types';
import { LEVELS, BADGES } from '../constants';
import { Trophy, Star, ChevronRight, Lock } from 'lucide-react';

const Journey: React.FC<{ points: number; level: UserLevel; stats: UserStats }> = ({ points, level, stats }) => {
  return (
    <div className="p-4 space-y-6 pb-12">
      <header className="text-center py-4">
        <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto flex items-center justify-center text-white mb-3 shadow-xl ring-4 ring-emerald-100 dark:ring-emerald-900/40 relative">
          <Trophy size={40} />
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-emerald-500 shadow-md border-2 border-emerald-500">
            <span className="text-xs font-bold">1</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">رحلتك الإيمانية</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm italic">"وفي ذلك فليتنافس المتنافسون"</p>
      </header>

      {/* Achievement Badges Section */}
      <section className="space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 border-r-4 border-amber-500 pr-3">أوسمة الإنجاز</h3>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map(badge => {
            const isUnlocked = badge.requirement(stats);
            return (
              <div 
                key={badge.id} 
                className={`bg-white dark:bg-slate-800 p-3 rounded-2xl border flex flex-col items-center text-center gap-2 transition-all relative group ${
                  isUnlocked ? 'border-amber-200 dark:border-amber-900/40 shadow-sm' : 'border-slate-100 dark:border-slate-700 opacity-50 grayscale'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isUnlocked ? 'badge.icon' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  {isUnlocked ? badge.icon : <Lock size={20} className="text-slate-400" />}
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-100 leading-tight">{badge.title}</h4>
                  <p className="text-[8px] text-slate-400 leading-tight mt-0.5">{isUnlocked ? badge.description : 'غير مفتوح'}</p>
                </div>
                {isUnlocked && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-white dark:border-slate-800" />}
              </div>
            );
          })}
        </div>
      </section>

      {/* Roadmap */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-2">
           <h3 className="font-bold text-slate-800 dark:text-slate-200 border-r-4 border-emerald-500 pr-3">خارطة الطريق</h3>
           <span className="text-[10px] text-slate-500 font-bold">رصيدك: {points.toLocaleString()} ن</span>
        </div>
        <div className="relative pt-6 pb-12 px-6">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-700 -translate-x-1/2 rounded-full" />
          
          <div className="space-y-12 relative z-10">
            {LEVELS.map((lvl, index) => {
              const isCompleted = points >= lvl.minPoints;
              const isCurrent = level === lvl.name;
              
              return (
                <div key={lvl.name} className={`flex items-center gap-6 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse text-left'}`}>
                  {/* Node */}
                  <div className={`w-12 h-12 rounded-full border-4 shadow-md flex items-center justify-center relative transition-colors ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white border-white dark:border-slate-800' 
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 border-white dark:border-slate-800'
                  }`}>
                    {isCompleted ? <Star size={24} fill="currentColor" /> : <Lock size={20} />}
                    {isCurrent && (
                      <div className="absolute -inset-2 bg-emerald-400/20 rounded-full animate-pulse" />
                    )}
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 p-4 rounded-3xl shadow-sm border transition-colors ${
                    isCurrent 
                      ? 'bg-white dark:bg-slate-800 border-emerald-500 ring-1 ring-emerald-500' 
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                  }`}>
                    <h4 className={`font-bold ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>{lvl.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">يحتاج: {lvl.minPoints.toLocaleString()} نقطة</p>
                    {isCurrent && (
                      <div className="mt-2 text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                        أنت هنا حالياً <ChevronRight size={12} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Journey;
