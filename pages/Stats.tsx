
import React from 'react';
import { UserStats } from '../types';
import { 
  BarChart, Bar, XAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { Calendar, Award, TrendingUp, Zap } from 'lucide-react';

const MOCK_CHART_DATA = [
  { name: 'السبت', points: 400 },
  { name: 'الأحد', points: 300 },
  { name: 'الإثنين', points: 550 },
  { name: 'الثلاثاء', points: 450 },
  { name: 'الأربعاء', points: 600 },
  { name: 'الخميس', points: 500 },
  { name: 'الجمعة', points: 700 },
];

const PIE_DATA = [
  { name: 'صلاة', value: 500, color: '#10b981' },
  { name: 'أذكار', value: 300, color: '#0ea5e9' },
  { name: 'قرآن', value: 200, color: '#6366f1' },
];

const Stats: React.FC<{ stats: UserStats }> = ({ stats }) => {
  return (
    <div className="p-4 space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">إحصائياتك الروحية</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">نظرة شاملة على تقدمك هذا الأسبوع</p>
      </header>

      {/* Overview Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
          <Zap className="text-amber-500 mb-2" size={24} fill="currentColor" />
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.streak}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">أيام متتالية</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
          <Award className="text-emerald-500 mb-2" size={24} />
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.points}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">نقطة مكتسبة</span>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-500" /> التزام الأسبوع
          </h3>
          <Calendar size={18} className="text-slate-300 dark:text-slate-600" />
        </div>
        
        <div className="h-48 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc', opacity: 0.1 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: '#1e293b', color: '#f8fafc' }}
              />
              <Bar dataKey="points" radius={[6, 6, 0, 0]}>
                {MOCK_CHART_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 6 ? '#10b981' : '#e2e8f0'} opacity={index === 6 ? 1 : 0.2} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Distribution */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-200">توزيع الأجر</h3>
        <div className="flex items-center gap-6">
          <div className="h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            {PIE_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.value} ن</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
