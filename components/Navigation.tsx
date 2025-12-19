import React from 'react';
import { NotebookPen, Zap, BarChart2, Lightbulb, Flower } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  // Order: Stats, Tips, [Action], Meditate, Journal (Home)
  const navItems = [
    { view: AppView.TRACK, icon: BarChart2, label: 'آمار' },
    { view: AppView.LEARN, icon: Lightbulb, label: 'نکات' }, 
    { view: AppView.BREATHE, icon: Zap, label: 'سریع', isMain: true },
    { view: AppView.MEDITATE, icon: Flower, label: 'مدیتیشن' },
    { view: AppView.DASHBOARD, icon: NotebookPen, label: 'خانه' }, 
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Gradient fade for content below */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />
      
      <div className="relative bg-white/80 backdrop-blur-md border-t border-slate-200/50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pb-safe rounded-t-[2rem]">
        <div className="flex justify-between items-end h-[4.5rem] max-w-md mx-auto px-6 pb-3">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            
            if (item.isMain) {
              return (
                <button
                  key={item.view}
                  onClick={() => setView(item.view)}
                  className={`relative -top-8 flex items-center justify-center w-16 h-16 rounded-full shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 group ${
                    isActive ? 'bg-teal-500 shadow-teal-200 ring-4 ring-white' : 'bg-slate-800 ring-4 ring-white'
                  }`}
                >
                  <item.icon 
                    size={30} 
                    fill="currentColor" 
                    className={`transition-colors duration-300 ${isActive ? "text-white" : "text-yellow-400 group-hover:text-yellow-300"}`} 
                  />
                  {/* Pulse effect if active */}
                  {isActive && <span className="absolute w-full h-full rounded-full bg-teal-400 opacity-30 animate-ping" />}
                </button>
              );
            }

            return (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 group ${
                  isActive ? 'text-teal-600 -translate-y-1' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-teal-50' : 'bg-transparent group-hover:bg-slate-50'}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-medium mt-1 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 h-0'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};