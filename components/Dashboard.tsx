import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppView } from '../types';
import { ChevronDown, Search, Bell, Calendar as CalendarIcon, X, Check, Smile, Meh, Frown, Sun, CloudRain, ChevronLeft, ChevronRight, FileText, Clock, Trash2, Info, LogOut } from 'lucide-react';

interface DashboardProps {
  setView: (view: AppView) => void;
  onLogout?: () => void;
}

interface JournalEntry {
  mood: 'happy' | 'calm' | 'neutral' | 'sad' | 'stressed';
  text: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'reminder' | 'success';
}

const MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export const Dashboard: React.FC<DashboardProps> = ({ setView, onLogout }) => {
  // Date State
  const [year, setYear] = useState(1402);
  const [monthIndex, setMonthIndex] = useState(6); // Mehr (Index 6)
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Search State
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'وقت مدیتیشن', message: 'جلسه تمرین تنفس روزانه خود را فراموش نکنید.', time: '۱۰ دقیقه پیش', type: 'reminder' },
    { id: 2, title: 'ثبت حال روزانه', message: 'امروز چطور گذشت؟ احساسات خود را ثبت کنید.', time: '۲ ساعت پیش', type: 'info' },
    { id: 3, title: 'تبریک!', message: 'شما ۳ روز متوالی وضعیت خود را ثبت کردید.', time: 'دیروز', type: 'success' },
  ]);

  // Selection State (Journal)
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Data State
  const [entries, setEntries] = useState<Record<number, JournalEntry>>({
    2: { mood: 'happy', text: 'امروز پروژه را عالی پیش بردم.' },
    5: { mood: 'calm', text: 'یک روز آرام با پیاده‌روی طولانی.' },
    12: { mood: 'stressed', text: 'جلسه سنگینی داشتیم و کمی خسته‌ام.' },
    18: { mood: 'neutral', text: 'روز معمولی بود، کار خاصی نکردم.' },
  });

  // Editor State
  const [tempNote, setTempNote] = useState('');
  const [tempMood, setTempMood] = useState<JournalEntry['mood']>('neutral');

  // Generate calendar days (31 days)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentDay = 24; // Simulated today
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    if (entries[day]) {
      setTempNote(entries[day].text);
      setTempMood(entries[day].mood);
    } else {
      setTempNote('');
      setTempMood('neutral');
    }
  };

  const handleSave = () => {
    if (selectedDay) {
      if (tempNote.trim() === '') {
        const newEntries = { ...entries };
        delete newEntries[selectedDay];
        setEntries(newEntries);
      } else {
        setEntries({
          ...entries,
          [selectedDay]: { mood: tempMood, text: tempNote }
        });
      }
      setSelectedDay(null);
    }
  };

  const clearNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Helper for Mood Colors and Icons
  const moods = [
    { id: 'happy', label: 'عالی', icon: '🤩', color: 'bg-yellow-400', ring: 'ring-yellow-200', bgSoft: 'bg-yellow-50', score: 5 },
    { id: 'calm', label: 'آرام', icon: '😌', color: 'bg-teal-400', ring: 'ring-teal-200', bgSoft: 'bg-teal-50', score: 4 },
    { id: 'neutral', label: 'معمولی', icon: '😐', color: 'bg-slate-300', ring: 'ring-slate-200', bgSoft: 'bg-slate-50', score: 3 },
    { id: 'sad', label: 'غمگین', icon: '😔', color: 'bg-blue-300', ring: 'ring-blue-200', bgSoft: 'bg-blue-50', score: 2 },
    { id: 'stressed', label: 'مضطرب', icon: '😣', color: 'bg-orange-400', ring: 'ring-orange-200', bgSoft: 'bg-orange-50', score: 1 },
  ] as const;

  const currentMoodObj = moods.find(m => m.id === tempMood) || moods[2];

  // Search Logic
  const filteredEntries = (Object.entries(entries) as [string, JournalEntry][]).filter(([day, entry]) => 
    entry.text.includes(searchQuery)
  );

  // Calculate Average Mood
  const averageMoodScore = useMemo(() => {
    const entryValues = Object.values(entries) as JournalEntry[];
    if (entryValues.length === 0) return 0;
    
    const total = entryValues.reduce((acc, entry) => {
      const moodObj = moods.find(m => m.id === entry.mood);
      return acc + (moodObj ? moodObj.score : 3);
    }, 0);
    
    return total / entryValues.length;
  }, [entries]);

  const getAverageMoodLabel = (score: number) => {
    if (score === 0) return '---';
    if (score >= 4.2) return 'عالی';
    if (score >= 3.4) return 'خوب';
    if (score >= 2.6) return 'معمولی';
    if (score >= 1.8) return 'پایین';
    return 'مضطرب';
  };

  // --- NOTIFICATION MODAL ---
  const NotificationModal = () => {
    return (
      <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-end sm:items-start justify-end animate-in fade-in duration-200">
        <div 
          className="bg-white w-full sm:w-96 sm:m-4 h-[60vh] sm:h-auto sm:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0 z-10">
             <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800">اعلانات</h3>
                {notifications.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                    {notifications.length}
                  </span>
                )}
             </div>
             <div className="flex gap-2">
                {notifications.length > 0 && (
                  <button 
                    onClick={clearAllNotifications}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="پاک کردن همه"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="p-2 bg-slate-50 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
             </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative group animate-in slide-in-from-right-4 fade-in duration-300">
                   <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                        notif.type === 'reminder' ? 'bg-orange-400' :
                        notif.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                      }`} />
                      <div className="flex-1">
                         <h4 className="font-bold text-slate-800 text-sm mb-1">{notif.title}</h4>
                         <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                         <span className="text-[10px] text-slate-300 mt-2 block flex items-center gap-1">
                           <Clock size={10} /> {notif.time}
                         </span>
                      </div>
                      <button 
                        onClick={() => clearNotification(notif.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 transition-all absolute top-2 left-2"
                      >
                        <X size={14} />
                      </button>
                   </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Bell size={24} className="opacity-50" />
                </div>
                <p className="text-sm font-medium">هیچ اعلان جدیدی ندارید</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Backdrop click to close */}
        <div className="absolute inset-0 -z-10" onClick={() => setShowNotifications(false)} />
      </div>
    );
  };

  // --- DATE PICKER MODAL ---
  const DatePickerModal = () => {
    const [tempYear, setTempYear] = useState(year);
    const [tempMonthIndex, setTempMonthIndex] = useState(monthIndex);
    const [selectionMode, setSelectionMode] = useState<'month' | 'year'>('month');
    const yearsListRef = useRef<HTMLDivElement>(null);
    const years = Array.from({ length: 101 }, (_, i) => 1350 + i);

    const handleConfirmDate = () => {
      setYear(tempYear);
      setMonthIndex(tempMonthIndex);
      setShowDatePicker(false);
    };

    useEffect(() => {
      if (selectionMode === 'year' && yearsListRef.current) {
        const selectedEl = yearsListRef.current.querySelector(`[data-year="${tempYear}"]`);
        if (selectedEl) {
          selectedEl.scrollIntoView({ block: 'center', behavior: 'instant' });
        }
      }
    }, [selectionMode]);

    return (
      <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
         <div className="bg-white w-full max-w-sm mx-4 mb-4 sm:mb-0 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4 shrink-0">
              {selectionMode === 'month' && (
                <button 
                  onClick={() => setTempYear(y => y + 1)}
                  className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              )}
              <button 
                onClick={() => setSelectionMode(selectionMode === 'month' ? 'year' : 'month')}
                className="flex items-center gap-2 text-xl font-bold text-slate-800 hover:text-teal-600 transition-colors mx-auto"
              >
                <span>سال {tempYear}</span>
                <ChevronDown size={20} className={`text-slate-400 transition-transform ${selectionMode === 'year' ? 'rotate-180' : ''}`} />
              </button>
              {selectionMode === 'month' && (
                <button 
                  onClick={() => setTempYear(y => y - 1)}
                  className="p-2 bg-slate-50 rounded-full hover:bg-teal-50 hover:text-teal-600 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
            </div>
            <div className="overflow-y-auto mb-6 custom-scrollbar">
              {selectionMode === 'month' ? (
                <div className="grid grid-cols-3 gap-3">
                  {MONTHS.map((m, idx) => (
                    <button
                      key={m}
                      onClick={() => setTempMonthIndex(idx)}
                      className={`py-3 text-sm font-bold rounded-xl transition-all ${
                        tempMonthIndex === idx 
                          ? 'bg-teal-500 text-white shadow-lg shadow-teal-200 scale-105' 
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              ) : (
                <div ref={yearsListRef} className="flex flex-col gap-2 h-64 px-2">
                  {years.map((y) => (
                    <button
                      key={y}
                      data-year={y}
                      onClick={() => {
                        setTempYear(y);
                        setSelectionMode('month');
                      }}
                      className={`py-3 text-lg font-bold rounded-xl transition-all shrink-0 ${
                        tempYear === y
                          ? 'bg-teal-500 text-white shadow-md'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 shrink-0 pt-2 border-t border-slate-50 mt-auto">
              <button onClick={() => setShowDatePicker(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">انصراف</button>
              <button onClick={handleConfirmDate} className="flex-[2] py-3 bg-teal-600 text-white rounded-xl font-bold shadow-xl shadow-teal-100 active:scale-95 transition-transform">تایید تاریخ</button>
            </div>
         </div>
      </div>
    );
  };

  // --- EDITOR VIEW ---
  if (selectedDay !== null) {
    return (
      <div className={`fixed inset-0 z-[60] flex flex-col transition-colors duration-500 ${currentMoodObj.bgSoft}`}>
        <div className="flex justify-between items-center p-6 pt-8 pb-4">
          <button onClick={() => setSelectedDay(null)} className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
          <div className="text-center">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{MONTHS[monthIndex]} {year}</span>
            <span className="text-2xl font-bold text-slate-800">{selectedDay} اُم</span>
          </div>
          <button onClick={handleSave} className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-all active:scale-95 bg-teal-600">
            <Check size={24} />
          </button>
        </div>
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="mb-8">
            <label className="block text-center text-sm font-bold text-slate-500 mb-6">امروز چطور گذشت؟</label>
            <div className="flex justify-between items-center px-2">
              {moods.map((m) => (
                <button key={m.id} onClick={() => setTempMood(m.id as any)} className={`relative flex flex-col items-center gap-2 transition-all duration-300 ${tempMood === m.id ? 'scale-110 -translate-y-2' : 'opacity-60 scale-90 hover:opacity-100 hover:scale-100'}`}>
                  <div className={`text-4xl transition-transform ${tempMood === m.id ? 'animate-bounce-short' : ''}`}>{m.icon}</div>
                  {tempMood === m.id && <span className="absolute -bottom-6 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white shadow-sm text-slate-600 animate-in fade-in slide-in-from-bottom-2">{m.label}</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 relative animate-in slide-in-from-bottom-4 duration-500">
             <textarea value={tempNote} onChange={(e) => setTempNote(e.target.value)} placeholder="از افکار و اتفاقات امروز بنویس..." className="w-full h-full resize-none outline-none text-slate-700 text-lg leading-relaxed placeholder:text-slate-300 bg-transparent" autoFocus />
             <div className="absolute bottom-6 left-6 text-xs font-medium text-slate-300 pointer-events-none">{tempNote.length} کاراکتر</div>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD ---
  return (
    <div className="p-6 pb-28 h-full overflow-y-auto bg-slate-50 relative">
      {showDatePicker && <DatePickerModal />}
      {showNotifications && <NotificationModal />}

      <header className="flex justify-between items-center mb-8 pt-2">
        <div>
          <span className="text-[10px] font-bold text-teal-600/60 uppercase tracking-[0.2em] mb-1 block">آسوکا</span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">یادداشت‌های روزانه</h1>
          <p className="text-slate-500 text-sm">مسیر خود را دنبال کنید</p>
        </div>
        <div className="flex items-center gap-2">
          {onLogout && (
            <button 
              onClick={onLogout}
              className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
              title="خروج"
            >
              <LogOut size={18} />
            </button>
          )}
          <button 
            onClick={() => setShowNotifications(true)}
            className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-teal-600 transition-colors relative"
          >
            <Bell size={20} />
            {notifications.length > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
          </button>
        </div>
      </header>

      {isSearchActive ? (
         <div className="flex gap-3 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex-1 relative">
               <input type="text" autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="جستجو در یادداشت‌ها..." className="w-full h-12 pr-12 pl-4 rounded-2xl border-2 border-teal-500 bg-white shadow-lg shadow-teal-100/50 outline-none text-slate-800 placeholder:text-slate-400 transition-all" />
               <Search className="absolute right-4 top-3.5 text-teal-500" size={20} />
            </div>
            <button onClick={() => { setIsSearchActive(false); setSearchQuery(''); }} className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-red-500 transition-colors shadow-sm">
              <X size={20} />
            </button>
         </div>
      ) : (
         <div className="flex gap-3 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <button onClick={() => setShowDatePicker(true)} className="flex-1 flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-700 font-medium hover:border-teal-200 transition-colors group">
            <div className="flex items-center gap-2">
              <CalendarIcon size={18} className="text-teal-500 group-hover:scale-110 transition-transform" />
              <span>{MONTHS[monthIndex]} {year}</span>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>
          <button onClick={() => setIsSearchActive(true)} className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-200 hover:bg-teal-600 transition-colors">
            <Search size={20} />
          </button>
        </div>
      )}

      {!isSearchActive ? (
        <>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6">
            <div className="grid grid-cols-7 gap-2 mb-4 text-center">
              {weekDays.map((d, i) => <div key={i} className="text-xs font-semibold text-slate-400">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => {
                const isToday = day === currentDay;
                const entry = entries[day];
                let moodColorClass = 'bg-slate-50 text-slate-600 hover:bg-slate-100';
                let dotColor = 'bg-slate-300';
                if (entry) {
                    const m = moods.find(x => x.id === entry.mood);
                    if (m) { moodColorClass = `bg-white border border-slate-100 shadow-sm ${m.ring} hover:ring-2 text-slate-800`; dotColor = m.color; }
                }
                if (isToday) { moodColorClass = 'bg-teal-500 text-white shadow-md shadow-teal-200'; dotColor = 'bg-white'; }
                return (
                  <div key={day} onClick={() => handleDayClick(day)} className={`aspect-[4/5] rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all relative group cursor-pointer ${isToday ? 'scale-105 z-10' : ''} ${moodColorClass}`}>
                     <span className={`mb-1 ${isToday ? 'font-bold' : ''}`}>{day}</span>
                     {(entry || isToday) && <div className={`w-1.5 h-1.5 rounded-full ${dotColor} ${isToday ? 'opacity-80' : ''}`}></div>}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
               <div className="text-2xl font-bold text-orange-500 mb-1">{Object.keys(entries).length}</div>
               <div className="text-xs font-medium text-orange-800/60">یادداشت‌های {MONTHS[monthIndex]}</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex flex-col justify-between">
               <div className="flex justify-between items-start">
                 <div className="text-2xl font-bold text-indigo-500 mb-1">{averageMoodScore > 0 ? averageMoodScore.toFixed(1) : '-'}</div>
                 {averageMoodScore > 0 && <span className="text-lg animate-in zoom-in">{moods.find(m => Math.round(averageMoodScore) === m.score)?.icon || '😐'}</span>}
               </div>
               <div className="text-xs font-medium text-indigo-800/60 flex justify-between items-end">
                  <span>میانگین حال</span>
                  {averageMoodScore > 0 && <span className="font-bold text-indigo-600">{getAverageMoodLabel(averageMoodScore)}</span>}
               </div>
            </div>
          </div>
        </>
      ) : (
        <div className="animate-in fade-in duration-300">
           <h3 className="text-sm font-bold text-slate-500 mb-4 px-2">{searchQuery ? `نتایج برای "${searchQuery}"` : 'همه یادداشت‌ها'}</h3>
           <div className="space-y-3">
             {filteredEntries.length > 0 ? filteredEntries.map(([day, entry]) => {
                 const mood = moods.find(m => m.id === entry.mood) || moods[2];
                 return (
                   <button key={day} onClick={() => handleDayClick(Number(day))} className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-teal-200 transition-all text-right group">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${mood.bgSoft}`}>{mood.icon}</div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-800">{day} {MONTHS[monthIndex]}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${mood.bgSoft} text-slate-600`}>{mood.label}</span>
                         </div>
                         <p className="text-sm text-slate-500 truncate group-hover:text-slate-700 transition-colors">{entry.text}</p>
                      </div>
                      <div className="self-center text-slate-300 group-hover:text-teal-500 transition-colors"><ChevronLeft size={18} /></div>
                   </button>
                 );
               }) : (
               <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400"><FileText size={24} /></div>
                  <p className="text-slate-400 font-medium">هیچ یادداشتی با این عنوان پیدا نشد.</p>
               </div>
             )}
           </div>
        </div>
      )}
    </div>
  );
};