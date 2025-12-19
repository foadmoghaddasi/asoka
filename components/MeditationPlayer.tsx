import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Play, Trash2, Bell, ChevronRight, ChevronLeft, Plus, X, Wind, Pause, ChevronDown, Check, RefreshCcw, CloudRain, Trees, Waves, Sun, ArrowLeft, MoreVertical } from 'lucide-react';

// --- Reminder Types & Components ---

interface Reminder {
  id: number;
  title: string;
  time: string;
  frequency: string;
  active: boolean;
  days?: string[];
}

interface SwipeableItemProps {
  item: Reminder;
  onDelete: (id: number) => void;
  onEdit: (item: Reminder) => void;
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({ item, onDelete, onEdit }) => {
  const [offsetX, setOffsetX] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  // Common Handler Logic
  const handleStart = (clientX: number) => {
    startX.current = clientX;
    isDragging.current = true;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging.current) return;
    const diff = clientX - startX.current;
    
    // Allow swipe left only (negative diff) to reveal Right side
    if (diff < 0 && diff > -120) {
      setOffsetX(diff);
    }
  };

  const handleEnd = () => {
    isDragging.current = false;
    // Snap logic: Threshold 50px
    if (offsetX < -50) {
      setOffsetX(-80); // Swiped Left (Reveal Right)
    } else {
      setOffsetX(0);
    }
  };

  const resetSwipe = () => {
    if (offsetX !== 0) setOffsetX(0);
  };

  return (
    <div className="relative h-20 mb-3 w-full select-none overflow-hidden rounded-2xl group">
       {/* Background Layer (Trash Action) - Justify Start (Right in RTL) */}
       <div className="absolute inset-0 bg-red-500 flex items-center justify-start px-6 rounded-2xl">
          <Trash2 className="text-white" size={24} />
       </div>
       
       {/* Delete Trigger Button (Accessible when swiped) */}
       {offsetX === -80 && (
         <button 
           onClick={(e) => {
             e.stopPropagation();
             onDelete(item.id);
           }}
           className="absolute inset-y-0 right-0 w-24 z-10 flex items-center justify-center cursor-pointer"
           aria-label="حذف"
         />
       )}

       {/* Foreground Layer (Content) */}
       <div 
         className="absolute inset-0 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between z-20 transition-transform duration-200 ease-out"
         style={{ transform: `translateX(${offsetX}px)` }}
         
         // Touch Events
         onTouchStart={(e) => handleStart(e.touches[0].clientX)}
         onTouchMove={(e) => handleMove(e.touches[0].clientX)}
         onTouchEnd={handleEnd}

         // Mouse Events (For Desktop Testing)
         onMouseDown={(e) => handleStart(e.clientX)}
         onMouseMove={(e) => handleMove(e.clientX)}
         onMouseUp={handleEnd}
         onMouseLeave={handleEnd}

         onClick={resetSwipe}
       >
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-500">
                <Bell size={20} />
             </div>
             <div>
                <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-400">{item.frequency}</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-2xl font-light text-slate-600 ml-2">{item.time}</span>
             <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                }}
                className="p-2 text-slate-400 hover:text-teal-600 hover:bg-slate-50 rounded-full transition-all"
             >
                <MoreVertical size={20} />
             </button>
          </div>
       </div>
    </div>
  );
};

interface ReminderModalProps {
  onClose: () => void;
  onSave: (r: Partial<Reminder>) => void;
  initialData?: Reminder;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ onClose, onSave, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || 'مدیتیشن');
  const [time, setTime] = useState(initialData?.time || '09:00');
  const [days, setDays] = useState<string[]>(initialData?.days || ['ش', 'ی', 'د', 'س', 'چ']);

  const allDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  const toggleDay = (d: string) => {
    if (days.includes(d)) {
      setDays(days.filter(day => day !== d));
    } else {
      setDays([...days, d]);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600">
          <ChevronRight size={24} />
        </button>
        <h2 className="text-lg font-bold text-slate-800">{initialData ? 'ویرایش یادآور' : 'تنظیم یادآور'}</h2>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">عنوان</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold text-slate-800 border-b-2 border-slate-100 focus:border-teal-500 outline-none py-2 bg-transparent"
            placeholder="نام یادآور"
          />
        </div>

        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">زمان</label>
          <div className="flex justify-center">
            <input 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-6xl font-bold text-slate-800 bg-slate-50 rounded-2xl px-6 py-4 outline-none border-2 border-transparent focus:border-teal-500"
            />
          </div>
        </div>

        <div className="mb-8">
           <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">تکرار</label>
           <div className="flex justify-between">
             {allDays.map(d => (
               <button
                 key={d}
                 onClick={() => toggleDay(d)}
                 className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                   days.includes(d) 
                     ? 'bg-teal-500 text-white shadow-lg shadow-teal-200 scale-110' 
                     : 'bg-slate-100 text-slate-400'
                 }`}
               >
                 {d}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="p-6 pb-safe border-t border-slate-100">
        <button 
          onClick={() => {
            const freqLabel = days.length === 7 ? 'هر روز' : (days.length === 5 && !days.includes('پ') && !days.includes('ج')) ? 'روزهای هفته' : 'سفارشی';
            onSave({ title, time, days, frequency: freqLabel });
            onClose();
          }}
          className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-teal-100 active:scale-95 transition-transform"
        >
          {initialData ? 'اعمال تغییرات' : 'تایید'}
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---

type SoundType = 'sea' | 'forest' | 'rain' | 'nature';

// Fix: Initializing SOUND_URLS with all keys required by Record<SoundType, string> to resolve TS error
const SOUND_URLS: Record<SoundType, string> = {
  sea: 'https://cdn.pixabay.com/audio/2022/03/15/audio_511933c37e.mp3', // Deep sea waves, very soothing
  forest: 'https://cdn.pixabay.com/audio/2022/05/17/audio_487532304d.mp3',
  rain: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d0.mp3',
  nature: 'https://cdn.pixabay.com/audio/2022/04/27/audio_686146c602.mp3',
};

export const MeditationPlayer: React.FC = () => {
  // View State
  const [viewMode, setViewMode] = useState<'setup' | 'selection' | 'active'>('setup');
  
  // Settings State
  const [activeTab, setActiveTab] = useState<'short' | 'long'>('short');
  const [duration, setDuration] = useState(5); // Default minutes
  const [selectedSound, setSelectedSound] = useState<SoundType | null>(null);
  
  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Timer State
  const [sessionDuration, setSessionDuration] = useState(0); 
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Reminder State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  
  // Load reminders from localStorage or use defaults
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const saved = localStorage.getItem('serenify_reminders');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse reminders", e);
    }
    return [
      { id: 1, title: 'تنفس صبحگاهی', time: '08:00', frequency: 'هر روز', active: true, days: ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] },
      { id: 2, title: 'کار عمیق', time: '14:00', frequency: 'روزهای هفته', active: true, days: ['ش', 'ی', 'د', 'س', 'چ'] },
    ];
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sessionActiveRef = useRef(false);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('serenify_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { 
      stopAudio();
    };
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (viewMode === 'active' && isPlaying) {
      interval = setInterval(() => {
        setElapsedTime(prev => {
           if (prev >= sessionDuration) {
             stopAudio();
             setIsPlaying(false);
             return prev;
           }
           return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewMode, isPlaying, sessionDuration]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleStartSetup = () => {
    setViewMode('selection');
  };

  const handleSoundSelect = (sound: SoundType) => {
    setSelectedSound(sound);
    setViewMode('active');
    
    stopAudio(); // Clear previous
    
    sessionActiveRef.current = true;
    setElapsedTime(0);
    setSessionDuration(duration * 60);
    
    startRealAudio(sound);
  };

  const startRealAudio = (sound: SoundType) => {
    try {
        const audio = new Audio(SOUND_URLS[sound]);
        audio.loop = true; // IMPORTANT: Ensures the file repeats continuously
        audio.volume = 0.8;
        
        // Wait for it to be ready or just play
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.error("Playback failed:", error);
              setIsPlaying(false);
            });
        }
        
        audioRef.current = audio;
    } catch (e) {
        console.error("Error creating audio:", e);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.error(e));
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
     if (selectedSound) {
         stopAudio();
         setElapsedTime(0);
         startRealAudio(selectedSound);
     }
  };

  const handleExit = () => {
    sessionActiveRef.current = false;
    stopAudio();
    setViewMode('setup');
    setSelectedSound(null);
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setElapsedTime(Number(e.target.value));
  };

  const handleDeleteReminder = (id: number) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleEditReminder = (item: Reminder) => {
    setEditingReminder(item);
    setShowAddModal(true);
  };

  const handleSaveReminder = (r: Partial<Reminder>) => {
    if (editingReminder) {
      setReminders(prev => prev.map(rem => rem.id === editingReminder.id ? { ...rem, ...r } : rem));
      setEditingReminder(null);
    } else {
      setReminders([...reminders, { ...r, id: Date.now(), active: true } as Reminder]);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingReminder(null);
  };

  // --- Selection View ---
  if (viewMode === 'selection') {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 flex items-center border-b border-slate-100">
          <button onClick={() => setViewMode('setup')} className="p-2 -mr-2 text-slate-500 hover:text-slate-800 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold text-slate-800 mr-4">انتخاب صدای محیط</h2>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <p className="text-slate-500 mb-8 text-sm">لطفاً یک صدای زمینه برای {activeTab === 'short' ? 'مدیتیشن' : 'خواب عمیق'} {duration} دقیقه‌ای خود انتخاب کنید.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={() => handleSoundSelect('sea')}
                className="aspect-square bg-blue-50 rounded-3xl border-2 border-transparent hover:border-blue-500 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group"
            >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-md group-hover:scale-110 transition-transform">
                    <Waves size={32} />
                </div>
                <span className="font-bold text-slate-700">دریا</span>
            </button>

            <button 
                onClick={() => handleSoundSelect('forest')}
                className="aspect-square bg-green-50 rounded-3xl border-2 border-transparent hover:border-green-500 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group"
            >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-600 shadow-md group-hover:scale-110 transition-transform">
                    <Trees size={32} />
                </div>
                <span className="font-bold text-slate-700">جنگل</span>
            </button>

            <button 
                onClick={() => handleSoundSelect('rain')}
                className="aspect-square bg-slate-100 rounded-3xl border-2 border-transparent hover:border-slate-500 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group"
            >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-500 shadow-md group-hover:scale-110 transition-transform">
                    <CloudRain size={32} />
                </div>
                <span className="font-bold text-slate-700">باران</span>
            </button>

            <button 
                onClick={() => handleSoundSelect('nature')}
                className="aspect-square bg-yellow-50 rounded-3xl border-2 border-transparent hover:border-yellow-500 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group"
            >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-yellow-500 shadow-md group-hover:scale-110 transition-transform">
                    <Sun size={32} />
                </div>
                <span className="font-bold text-slate-700">طبیعت</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Active Player View ---
  if (viewMode === 'active') {
    const getIcon = () => {
        switch(selectedSound) {
            case 'sea': return <Waves size={80} className={`text-blue-400 transition-all duration-[4000ms] ${isPlaying ? 'scale-110 opacity-100' : 'scale-100 opacity-80'}`} />;
            case 'forest': return <Trees size={80} className={`text-green-500 transition-all duration-[4000ms] ${isPlaying ? 'scale-110 opacity-100' : 'scale-100 opacity-80'}`} />;
            case 'rain': return <CloudRain size={80} className={`text-slate-400 transition-all duration-[4000ms] ${isPlaying ? 'scale-110 opacity-100' : 'scale-100 opacity-80'}`} />;
            case 'nature': return <Sun size={80} className={`text-yellow-400 transition-all duration-[4000ms] ${isPlaying ? 'scale-110 opacity-100' : 'scale-100 opacity-80'}`} />;
            default: return <Wind size={80} />;
        }
    };

    const getTitle = () => {
        switch(selectedSound) {
            case 'sea': return 'صدای دریا';
            case 'forest': return 'آوای جنگل';
            case 'rain': return 'باران آرام';
            case 'nature': return 'طبیعت بکر';
            default: return activeTab === 'short' ? 'مدیتیشن' : 'خواب عمیق';
        }
    };

    const getThemeColor = () => {
        switch(selectedSound) {
            case 'sea': return 'bg-blue-500';
            case 'forest': return 'bg-green-600';
            case 'rain': return 'bg-slate-500';
            case 'nature': return 'bg-yellow-500';
            default: return 'bg-teal-500';
        }
    };
    
    const getHexColor = () => {
        switch(selectedSound) {
            case 'sea': return '#3b82f6'; // Blue 500
            case 'forest': return '#16a34a'; // Green 600
            case 'rain': return '#64748b'; // Slate 500
            case 'nature': return '#eab308'; // Yellow 500
            default: return '#14b8a6'; // Teal 500
        }
    };

    const progressPercent = sessionDuration > 0 ? (elapsedTime / sessionDuration) * 100 : 0;

    return (
      <div className="fixed inset-0 z-[100] bg-slate-900 text-white flex flex-col items-center animate-in slide-in-from-bottom duration-500">
        
        <div className="w-full p-6 flex justify-between items-center">
          <button onClick={handleExit} className="p-2 bg-slate-800 rounded-full text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
            <ChevronDown size={24} />
          </button>
          <span className="text-xs font-bold tracking-widest uppercase text-slate-400">در حال پخش</span>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-8 relative">
            <>
              <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
                 <div className={`absolute inset-0 blur-3xl rounded-full transition-all duration-[3000ms] opacity-30 ${getThemeColor()} ${isPlaying ? 'scale-110 opacity-70' : 'scale-100'}`}></div>
                 <div className="relative z-10 w-full h-full bg-slate-800 rounded-[2rem] shadow-2xl shadow-black/50 border border-slate-700/50 flex items-center justify-center">
                    {getIcon()}
                 </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">{getTitle()}</h2>
                <p className="text-slate-400">{activeTab === 'short' ? 'مدیتیشن' : 'خواب عمیق'} {duration} دقیقه‌ای</p>
              </div>

              {/* Seek Bar (Interactive Progress) */}
              <div className="w-full mb-1">
                 <input 
                   type="range"
                   min="0"
                   max={sessionDuration}
                   step="1"
                   dir="rtl"
                   value={elapsedTime}
                   onChange={handleSeek}
                   style={{
                     background: `linear-gradient(to left, ${getHexColor()} ${progressPercent}%, #1e293b ${progressPercent}%)`
                   }}
                   className="w-full h-1.5 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                 />
              </div>
              
              <div className="w-full flex justify-between text-xs font-medium text-slate-500 mb-10 mt-2">
                <span>{formatTime(elapsedTime)}</span>
                <span>{sessionDuration > 0 ? formatTime(sessionDuration) : "--:--"}</span>
              </div>

              <div className="flex items-center gap-8">
                 <button onClick={handleRestart} className="text-slate-500 hover:text-white transition-colors">
                   <RefreshCcw size={28} />
                 </button>

                 <button 
                   onClick={togglePlayPause}
                   className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all ${getThemeColor()}`}
                 >
                   {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                 </button>
                 
                 <button onClick={handleExit} className="text-slate-500 hover:text-white transition-colors">
                   <Plus size={28} className="rotate-45" /> 
                 </button>
              </div>
            </>
        </div>
      </div>
    );
  }

  // --- Setup View ---
  return (
    <div className="p-6 h-full pb-28 overflow-y-auto bg-slate-50 relative">
      {showAddModal && <ReminderModal onClose={handleCloseModal} onSave={handleSaveReminder} initialData={editingReminder || undefined} />}
      
      <header className="mb-8 pt-2">
        <span className="text-[10px] font-bold text-teal-600/60 uppercase tracking-[0.2em] mb-1 block">آسوکا</span>
        <h2 className="text-lg font-medium text-slate-500">ذهن‌آگاهی</h2>
        <h1 className="text-2xl font-bold text-slate-800">فضای مدیتیشن</h1>
      </header>

      {/* Main Action Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-32 h-32 bg-teal-50 rounded-br-full -ml-8 -mt-8 opacity-50"></div>
        
        <h3 className="font-bold text-slate-800 mb-6 relative z-10">شروع جلسه جدید</h3>
        
        {/* Toggle Type */}
        <div className="flex p-1 bg-slate-100 rounded-xl mb-6 relative z-10">
          <button 
            onClick={() => {
              setActiveTab('short');
              setDuration(5);
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'short' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
          >
            آرامش سریع
          </button>
          <button 
             onClick={() => {
               setActiveTab('long');
               setDuration(20);
             }}
             className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'long' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
          >
            خواب عمیق
          </button>
        </div>

        {/* Duration Slider */}
        <div className="mb-8 relative z-10">
           <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
             <span>مدت زمان</span>
             <span className="text-teal-600">{duration} دقیقه</span>
           </div>
           <input 
             type="range" 
             min={activeTab === 'short' ? 5 : 15} 
             max={activeTab === 'short' ? 15 : 45} 
             value={duration} 
             onChange={(e) => setDuration(parseInt(e.target.value))}
             className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-500"
             dir="ltr"
           />
        </div>

        <button 
          onClick={handleStartSetup}
          className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-teal-100 active:scale-95 transition-transform flex items-center justify-center gap-2 relative z-10"
        >
          <Play size={20} fill="currentColor" className="ml-1" />
          <span>شروع مدیتیشن</span>
        </button>
      </div>

      {/* Reminders Section */}
      <div className="flex justify-between items-end mb-4">
        <h3 className="font-bold text-slate-700">یادآورها</h3>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center hover:bg-teal-200 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-1">
        {reminders.map(reminder => (
          <SwipeableItem 
            key={reminder.id} 
            item={reminder} 
            onDelete={handleDeleteReminder} 
            onEdit={handleEditReminder}
          />
        ))}
        {reminders.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            هیچ یادآوری فعال نیست.
          </div>
        )}
      </div>
    </div>
  );
};
