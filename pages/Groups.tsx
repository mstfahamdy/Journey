
import React from 'react';
import { MOCK_GROUP } from '../constants';
import { Trophy, ShieldCheck, Heart, Share2, Users } from 'lucide-react';

const Groups: React.FC<{ userPoints: number }> = ({ userPoints }) => {
  return (
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">مجموعات الخير</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">تنافسوا في الطاعات</p>
        </div>
        <button className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-2 rounded-xl transition-colors">
          <Share2 size={20} />
        </button>
      </header>

      {/* Active Group Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">صحبة الجنة</h3>
          </div>
          <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg text-slate-500">نشط الآن</span>
        </div>

        <div className="space-y-3">
          {MOCK_GROUP.map((member) => (
            <div 
              key={member.id} 
              className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                member.isMe ? 'bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 ring-2 ring-emerald-500/10' : 'bg-slate-50 dark:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={member.avatar} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-600" />
                  {member.rank <= 3 && (
                    <div className="absolute -top-1 -right-1">
                      <Trophy size={14} className={
                        member.rank === 1 ? 'text-amber-500' : 
                        member.rank === 2 ? 'text-slate-400' : 'text-orange-500'
                      } fill="currentColor" />
                    </div>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-bold ${member.isMe ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {member.name} {member.isMe && '(أنت)'}
                  </p>
                  <p className="text-[10px] text-slate-400">المركز: {member.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{member.points}</p>
                <p className="text-[10px] text-slate-400 font-medium">نقطة</p>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 dark:shadow-emerald-900/40 active:scale-95 transition-transform">
          تحفيز المجموعة
        </button>
      </div>

      {/* Global Stats or Badges */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-pink-50 dark:bg-pink-900/10 p-4 rounded-3xl border border-pink-100 dark:border-pink-800 flex flex-col items-center text-center gap-2">
          <Heart className="text-pink-500" fill="currentColor" opacity={0.2} />
          <h4 className="text-xs font-bold text-pink-900 dark:text-pink-300">الإنجازات الجماعية</h4>
          <p className="text-[10px] text-pink-700 dark:text-pink-400">ختم 5 أجزاء جماعياً</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-3xl border border-blue-100 dark:border-blue-800 flex flex-col items-center text-center gap-2">
          <ShieldCheck className="text-blue-500" />
          <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300">تحدي الفجر</h4>
          <p className="text-[10px] text-blue-700 dark:text-blue-400">7 أيام التزام جماعي</p>
        </div>
      </div>
    </div>
  );
};

export default Groups;
