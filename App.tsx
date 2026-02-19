
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DailyGuide from './pages/DailyGuide';
import Groups from './pages/Groups';
import Journey from './pages/Journey';
import Stats from './pages/Stats';
import SettingsPage from './pages/Settings';
import { UserStats, UserLevel, PrayerKey, AppSettings, DailyChallenge, PrayerDetail } from './types';
import { DEFAULT_REMINDERS, ADHKAR_LIST, LEVELS } from './constants';
import { generateDailyChallenge } from './services/geminiService';

// Points estimation: 1 letter = 10 Hasanat. 
// Approx 500 letters per page -> 5000 points per page.
// Approx 20 pages per Juz -> 100,000 points per Juz.
const POINTS_PER_PAGE = 5000;
const POINTS_PER_JUZ = 100000;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('userStats');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.completedAdhkarIds) parsed.completedAdhkarIds = {};
      return parsed;
    }
    return {
      detailedPrayers: {
        fajr: { completed: false, isJamaah: false },
        dhuhr: { completed: false, isJamaah: false },
        asr: { completed: false, isJamaah: false },
        maghrib: { completed: false, isJamaah: false },
        isha: { completed: false, isJamaah: false },
      },
      adhkarAfterPrayer: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
      qiyamRakats: 0,
      witrCompleted: false,
      nawafilRakats: 0,
      goodDeeds: { iftar: false, sadaqah: false, general: false },
      prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
      adhkar: { morning: false, evening: false, afterPrayer: false, beforeSleep: false },
      completedAdhkarIds: {},
      quranPages: 0,
      quranJuz: 0,
      streak: 3,
      points: 2900,
      level: UserLevel.BEGINNER
    };
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('appSettings');
    const parsed = saved ? JSON.parse(saved) : {
      isDarkMode: true,
      reminders: DEFAULT_REMINDERS,
      selectedAdhkar: ADHKAR_LIST.map(a => a.id),
      adhkarOrder: ADHKAR_LIST.map(a => a.id),
      customAdhkar: [],
      notificationSound: 'gentle'
    };
    parsed.isDarkMode = true;
    return parsed;
  });

  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      const challenge = await generateDailyChallenge(stats.points);
      setDailyChallenge({ ...challenge, completed: false });
    };
    fetchChallenge();
  }, []);

  useEffect(() => {
    // Level management
    const currentPoints = stats.points;
    let newLevel = stats.level;
    for (const lvl of [...LEVELS].reverse()) {
      if (currentPoints >= lvl.minPoints) {
        newLevel = lvl.name;
        break;
      }
    }
    if (newLevel !== stats.level) {
      setStats(prev => ({ ...prev, level: newLevel }));
    }
    localStorage.setItem('userStats', JSON.stringify(stats));
  }, [stats.points]);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    document.documentElement.classList.add('dark');
  }, [settings]);

  const updateDetailedPrayer = (key: PrayerKey, completed: boolean, isJamaah: boolean) => {
    setStats(prev => {
      const oldVal = prev.detailedPrayers[key];
      const oldPoints = oldVal.completed ? (oldVal.isJamaah ? 135 : 5) : 0;
      const newPoints = completed ? (isJamaah ? 135 : 5) : 0;
      return {
        ...prev,
        detailedPrayers: { ...prev.detailedPrayers, [key]: { completed, isJamaah } },
        points: prev.points - oldPoints + newPoints
      };
    });
  };

  const updateAdhkarAfterPrayer = (key: PrayerKey) => {
    setStats(prev => {
      const newVal = !prev.adhkarAfterPrayer[key];
      const ptsChange = newVal ? 15 : -15;
      return {
        ...prev,
        adhkarAfterPrayer: { ...prev.adhkarAfterPrayer, [key]: newVal },
        points: prev.points + ptsChange
      };
    });
  };

  const updateQiyam = (rakats: number, witr: boolean) => {
    setStats(prev => {
      const oldPts = (prev.qiyamRakats / 2) * 8 + (prev.witrCompleted ? 10 : 0);
      const newPts = (rakats / 2) * 8 + (witr ? 10 : 0);
      return {
        ...prev,
        qiyamRakats: rakats,
        witrCompleted: witr,
        points: prev.points - oldPts + newPts
      };
    });
  };

  const updateNawafil = (rakats: number) => {
    setStats(prev => {
      const oldPts = (prev.nawafilRakats / 2) * 10;
      const newPts = (rakats / 2) * 10;
      return {
        ...prev,
        nawafilRakats: rakats,
        points: prev.points - oldPts + newPts
      };
    });
  };

  const updateGoodDeed = (key: keyof UserStats['goodDeeds']) => {
    setStats(prev => {
      const newVal = !prev.goodDeeds[key];
      let pts = 0;
      if (key === 'iftar') pts = 200;
      if (key === 'sadaqah') pts = 100;
      if (key === 'general') pts = 50;
      const change = newVal ? pts : -pts;
      return {
        ...prev,
        goodDeeds: { ...prev.goodDeeds, [key]: newVal },
        points: prev.points + change
      };
    });
  };

  const toggleAdhkar = (category: keyof UserStats['adhkar']) => {
    setStats(prev => {
      const newState = { ...prev.adhkar, [category]: !prev.adhkar[category] };
      const pointDiff = newState[category] ? 50 : -50;
      return { ...prev, adhkar: newState, points: prev.points + pointDiff };
    });
  };

  const toggleIndividualAdhkar = (id: string) => {
    setStats(prev => {
      const isCompleted = prev.completedAdhkarIds[id];
      const ptsChange = isCompleted ? -5 : 5;
      return {
        ...prev,
        completedAdhkarIds: { ...prev.completedAdhkarIds, [id]: !isCompleted },
        points: prev.points + ptsChange
      };
    });
  };

  const updateQuran = (pages: number) => {
    setStats(prev => {
      const diff = pages - prev.quranPages;
      return { ...prev, quranPages: pages, points: Math.max(0, prev.points + (diff * POINTS_PER_PAGE)) };
    });
  };

  const updateQuranJuz = (juz: number) => {
    setStats(prev => {
      const diff = juz - prev.quranJuz;
      return { ...prev, quranJuz: juz, points: Math.max(0, prev.points + (diff * POINTS_PER_JUZ)) };
    });
  };

  const completeChallenge = () => {
    if (dailyChallenge && !dailyChallenge.completed) {
      setDailyChallenge(prev => prev ? { ...prev, completed: true } : null);
      setStats(prev => ({ ...prev, points: prev.points + (dailyChallenge.points || 100) }));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Dashboard 
            stats={stats} 
            updateDetailedPrayer={updateDetailedPrayer}
            updateAdhkarAfterPrayer={updateAdhkarAfterPrayer}
            updateQiyam={updateQiyam}
            updateNawafil={updateNawafil}
            updateGoodDeed={updateGoodDeed}
            updateQuran={updateQuran} 
            updateQuranJuz={updateQuranJuz}
            challenge={dailyChallenge}
            completeChallenge={completeChallenge}
          />
        );
      case 'guide':
        return (
          <DailyGuide 
            stats={stats} 
            toggleAdhkar={toggleAdhkar} 
            toggleIndividualAdhkar={toggleIndividualAdhkar}
            updateQuran={updateQuran} 
            updateQuranJuz={updateQuranJuz}
            selectedAdhkarIds={settings.selectedAdhkar}
            adhkarOrder={settings.adhkarOrder}
            customAdhkar={settings.customAdhkar}
          />
        );
      case 'groups':
        return <Groups userPoints={stats.points} />;
      case 'journey':
        return <Journey points={stats.points} level={stats.level} stats={stats} />;
      case 'stats':
        return <Stats stats={stats} />;
      case 'settings':
        return <SettingsPage settings={settings} setSettings={setSettings} />;
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={true}>
      {renderContent()}
    </Layout>
  );
};

export default App;
