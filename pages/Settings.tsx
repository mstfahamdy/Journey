
import React, { useState } from 'react';
import { AppSettings, ReminderSettings } from '../types';
import { ADHKAR_LIST, ADHKAR_CATEGORIES } from '../constants';
import { 
  Moon, Bell, ListChecks, ChevronUp, ChevronDown, 
  GripVertical, Plus, Trash2, Volume2, Info, Check, Play 
} from 'lucide-react';

interface SettingsPageProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, setSettings }) => {
  const [newAdhkarText, setNewAdhkarText] = useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const updateReminder = (id: string, updates: Partial<ReminderSettings>) => {
    setSettings(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const setSound = (sound: string) => {
    setSettings(prev => ({ ...prev, notificationSound: sound }));
    // Simulate playing a sound
    setIsPlaying(sound);
    setTimeout(() => setIsPlaying(null), 1000);
  };

  const toggleAdhkarSelection = (id: string) => {
    setSettings(prev => ({
      ...prev,
      selectedAdhkar: prev.selectedAdhkar.includes(id)
        ? prev.selectedAdhkar.filter(aid => aid !== id)
        : [...prev.selectedAdhkar, id]
    }));
  };

  const allAdhkar = [...ADHKAR_LIST, ...settings.customAdhkar];

  const moveAdhkar = (id: string, direction: 'up' | 'down') => {
    setSettings(prev => {
      const category = allAdhkar.find(a => a.id === id)?.category;
      if (!category) return prev;

      const order = [...prev.adhkarOrder];
      const categoryItems = order.filter(oid => {
        const item = allAdhkar.find(a => a.id === oid);
        return item && item.category === category;
      });

      const currentIndex = categoryItems.indexOf(id);
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= categoryItems.length) return prev;

      const targetId = categoryItems[targetIndex];
      const originalOrderIndex = order.indexOf(id);
      const targetOrderIndex = order.indexOf(targetId);

      const newOrder = [...order];
      newOrder[originalOrderIndex] = targetId;
      newOrder[targetOrderIndex] = id;

      return { ...prev, adhkarOrder: newOrder };
    });
  };

  const addCustomAdhkar = (categoryId: string) => {
    const text = newAdhkarText[categoryId]?.trim();
    if (!text) return;

    const newId = `custom-${Date.now()}`;
    const newEntry = {
      id: newId,
      category: categoryId,
      text: text,
      count: 1
    };

    setSettings(prev => ({
      ...prev,
      customAdhkar: [...prev.customAdhkar, newEntry],
      selectedAdhkar: [...prev.selectedAdhkar, newId],
      adhkarOrder: [...prev.adhkarOrder, newId]
    }));

    setNewAdhkarText(prev => ({ ...prev, [categoryId]: '' }));
  };

  const deleteCustomAdhkar = (id: string) => {
    setSettings(prev => ({
      ...prev,
      customAdhkar: prev.customAdhkar.filter(a => a.id !== id),
      selectedAdhkar: prev.selectedAdhkar.filter(aid => aid !== id),
      adhkarOrder: prev.adhkarOrder.filter(oid => oid !== id)
    }));
  };

  const soundOptions = [
    { id: 'gentle', label: 'تنبيه هادئ', desc: 'صوت ناعم ومريح' },
    { id: 'nature', label: 'صوت الطبيعة', desc: 'زقزقة عصافير هادئة' },
    { id: 'digital', label: 'نغمة رقمية', desc: 'تنبيه حديث ومباشر' },
  ];

  return (
    <div className="p-5 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-100">الإعدادات</h2>
        <p className="text-slate-500 text-sm font-medium">خصص رحلتك نحو الجنة</p>
      </header>

      {/* Smart Reminders Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Bell size={18} className="text-emerald-500" />
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest">التذكيرات الذكية</h3>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-[2rem] border border-slate-800/60 overflow-hidden shadow-xl">
          {settings.reminders.map((reminder, idx) => (
            <div key={reminder.id} className={`p-5 flex items-center justify-between transition-colors hover:bg-slate-800/30 ${idx !== settings.reminders.length - 1 ? 'border-b border-slate-800/40' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${reminder.enabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
                  <Bell size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-100">{reminder.label}</p>
                  <div className="relative mt-1">
                    <input 
                      type="time" 
                      value={reminder.time}
                      onChange={(e) => updateReminder(reminder.id, { time: e.target.value })}
                      className="bg-slate-800/80 rounded-lg px-2 py-1 text-xs text-emerald-400 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all border border-slate-700/50"
                    />
                  </div>
                </div>
              </div>
              <button 
                onClick={() => updateReminder(reminder.id, { enabled: !reminder.enabled })}
                className={`w-14 h-7 rounded-full transition-all relative flex items-center px-1.5 ${reminder.enabled ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ease-out ${reminder.enabled ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Notification Sounds Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Volume2 size={18} className="text-indigo-400" />
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest">صوت التنبيه</h3>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {soundOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSound(option.id)}
              className={`p-4 rounded-[1.5rem] border flex items-center justify-between transition-all active:scale-95 ${
                settings.notificationSound === option.id 
                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-100 shadow-lg shadow-indigo-500/5' 
                  : 'bg-slate-900/40 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-4 text-right">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${settings.notificationSound === option.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                  {isPlaying === option.id ? <div className="w-2 h-2 bg-white rounded-full animate-ping" /> : <Volume2 size={18} />}
                </div>
                <div>
                  <p className="font-bold text-sm">{option.label}</p>
                  <p className="text-[10px] opacity-60">{option.desc}</p>
                </div>
              </div>
              {settings.notificationSound === option.id && (
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                  <Check size={14} />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Adhkar Customization Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <ListChecks size={18} className="text-amber-400" />
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest">تخصيص وترتيب الأذكار</h3>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-800/60 shadow-xl overflow-hidden">
          {ADHKAR_CATEGORIES.map((cat, catIdx) => (
            <div key={cat.id} className={`${catIdx !== ADHKAR_CATEGORIES.length - 1 ? 'border-b border-slate-800/40' : ''}`}>
              <div className="p-5 bg-slate-800/20 flex justify-between items-center">
                <h4 className="font-bold text-sm text-slate-300 flex items-center gap-2">
                  <div className="p-1.5 bg-slate-800 rounded-lg">{cat.icon}</div>
                  {cat.title}
                </h4>
              </div>
              <div className="p-3 space-y-2">
                {allAdhkar
                  .filter(a => a.category === cat.id)
                  .sort((a, b) => settings.adhkarOrder.indexOf(a.id) - settings.adhkarOrder.indexOf(b.id))
                  .map((adhkar, idx, arr) => (
                  <div key={adhkar.id} className="group flex items-center gap-3 p-1">
                    <div className="flex flex-col gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button 
                        disabled={idx === 0}
                        onClick={() => moveAdhkar(adhkar.id, 'up')}
                        className={`p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors ${idx === 0 ? 'opacity-20 cursor-not-allowed' : ''}`}
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button 
                        disabled={idx === arr.length - 1}
                        onClick={() => moveAdhkar(adhkar.id, 'down')}
                        className={`p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors ${idx === arr.length - 1 ? 'opacity-20 cursor-not-allowed' : ''}`}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => toggleAdhkarSelection(adhkar.id)}
                      className={`flex-1 p-3.5 flex items-center justify-between text-right rounded-2xl transition-all border ${
                        settings.selectedAdhkar.includes(adhkar.id) 
                          ? 'bg-emerald-500/5 border-emerald-500/30' 
                          : 'bg-slate-950/40 border-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical size={16} className="text-slate-700 group-hover:text-slate-500" />
                        <span className={`text-xs font-medium leading-relaxed ${settings.selectedAdhkar.includes(adhkar.id) ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {adhkar.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {adhkar.id.startsWith('custom-') && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteCustomAdhkar(adhkar.id); }}
                            className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          settings.selectedAdhkar.includes(adhkar.id) 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'border-slate-700 text-transparent'
                        }`}>
                          <Check size={14} strokeWidth={3} />
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
                
                {/* Add Custom Adhkar Input */}
                <div className="p-3 mt-4">
                  <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-[1.5rem] border border-dashed border-slate-700/80 hover:border-emerald-500/50 transition-colors group">
                    <input 
                      type="text" 
                      placeholder="أضف ذكراً مخصصاً للمجموعة..."
                      className="flex-1 bg-transparent text-xs text-slate-300 focus:outline-none px-3 font-medium placeholder:text-slate-600"
                      value={newAdhkarText[cat.id] || ''}
                      onChange={(e) => setNewAdhkarText(prev => ({ ...prev, [cat.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && addCustomAdhkar(cat.id)}
                    />
                    <button 
                      onClick={() => addCustomAdhkar(cat.id)}
                      className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/10 hover:bg-emerald-500 transition-all active:scale-90"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-indigo-500/10 rounded-[2rem] p-6 border border-indigo-500/20 flex items-start gap-4">
        <Info className="text-indigo-400 shrink-0 mt-1" size={20} />
        <div>
          <h4 className="text-sm font-bold text-indigo-100">بشأن التذكيرات</h4>
          <p className="text-[10px] text-indigo-300/80 leading-relaxed mt-1">
            يتم تخزين التذكيرات محلياً على جهازك. يرجى التأكد من السماح للتطبيق بإرسال التنبيهات لضمان وصولها في وقتها المحدد.
          </p>
        </div>
      </section>

      <div className="text-center pb-12">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">تطبيق رحلتي إلى الجنة • الإصدار 1.5</p>
      </div>
    </div>
  );
};

export default SettingsPage;
