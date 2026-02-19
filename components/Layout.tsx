
import React, { useMemo } from 'react';
import { NAVIGATION } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (id: string) => void;
  isDarkMode: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isDarkMode }) => {
  const timeBasedHeaderBg = useMemo(() => {
    const hour = new Date().getHours();
    
    // Morning: 5 AM - 11 AM (Emerald-900)
    if (hour >= 5 && hour < 12) {
      return 'from-emerald-950/90 to-slate-950/90 border-emerald-900/40';
    }
    // Afternoon: 12 PM - 5 PM (Sky-900)
    if (hour >= 12 && hour < 17) {
      return 'from-sky-950/90 to-slate-950/90 border-sky-900/40';
    }
    // Evening: 5 PM - 8 PM (Teal-900)
    if (hour >= 17 && hour < 21) {
      return 'from-teal-950/90 to-slate-950/90 border-teal-900/40';
    }
    // Night: 9 PM - 4 AM (Slate-950)
    return 'from-slate-900/90 to-slate-950/90 border-slate-800/60';
  }, []);

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto shadow-2xl relative transition-colors duration-300 bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Header with Dynamic Time-based Gradient */}
      <header className={`backdrop-blur-xl sticky top-0 z-50 p-5 border-b flex items-center justify-between transition-all duration-1000 bg-gradient-to-b ${timeBasedHeaderBg}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20 transform rotate-3">
            ج
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">رحلتي إلى الجنة</h1>
            <p className="text-[9px] text-emerald-400/80 font-medium">سعيٌ نحو الفردوس</p>
          </div>
        </div>
        <button className="w-10 h-10 bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-all active:scale-95 border border-slate-700/50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-28 overflow-y-auto custom-scroll px-1">
        {children}
      </main>

      {/* Bottom Navigation - Floating style */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[340px] z-50">
        <nav className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 px-4 py-2 flex justify-between items-center rounded-3xl shadow-2xl shadow-black/40">
          {NAVIGATION.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-slate-500 hover:text-emerald-400/60'
              }`}
            >
              <div className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'scale-100'}`}>
                {item.icon}
              </div>
              <span className={`text-[9px] font-bold transition-opacity ${activeTab === item.id ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
