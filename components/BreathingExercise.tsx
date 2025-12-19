import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

export const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [instruction, setInstruction] = useState('آماده‌اید؟');

  useEffect(() => {
    let interval: any;
    if (isActive) {
      // 4-7-8 Breathing Technique Loop (simplified)
      let counter = 0;
      
      const runCycle = () => {
        const step = counter % 4;
        if (step === 0) {
          setPhase('Inhale');
          setInstruction('دم بگیرید...');
        } else if (step === 1) {
          setPhase('Hold');
          setInstruction('نگه دارید...');
        } else if (step === 2) {
          setPhase('Exhale');
          setInstruction('بازدم کنید...');
        } else {
          setPhase('Hold');
          setInstruction('نگه دارید...');
        }
        counter++;
      };

      runCycle();
      interval = setInterval(runCycle, 4000); // 4 seconds per phase
    } else {
      setInstruction('شروع کنید');
      setPhase('Inhale');
    }

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-6">
      <div className="text-center mb-8">
        <span className="text-[10px] font-bold text-teal-600/60 uppercase tracking-[0.2em] mb-1 block">آسوکا</span>
        <h2 className="text-2xl font-bold text-slate-800">تمرین تنفس آرام‌بخش</h2>
      </div>
      
      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Animated Circles */}
        <div 
          className={`absolute w-full h-full rounded-full border-4 border-teal-200 transition-all duration-[4000ms] ease-linear ${
            isActive 
              ? phase === 'Inhale' ? 'scale-100 opacity-100' 
              : phase === 'Exhale' ? 'scale-50 opacity-50' 
              : 'scale-100 opacity-80' // Hold
              : 'scale-75'
          }`}
        />
        
        <div 
          className={`absolute w-48 h-48 bg-teal-500 rounded-full shadow-2xl flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${
             isActive 
              ? phase === 'Inhale' ? 'scale-110' 
              : phase === 'Exhale' ? 'scale-75' 
              : 'scale-100' // Hold
              : 'scale-90'
          }`}
        >
          <span className="text-white text-xl font-semibold animate-fade-in">
            {instruction}
          </span>
        </div>
      </div>

      <button
        onClick={() => setIsActive(!isActive)}
        className="mt-12 flex items-center space-x-2 px-8 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors shadow-lg"
      >
        {isActive ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
        <span>{isActive ? 'توقف تمرین' : 'شروع تمرین'}</span>
      </button>

      <p className="mt-6 text-slate-500 text-sm text-center max-w-xs">
        این تمرین ساده به شما کمک می‌کند تا ضربان قلب خود را کاهش دهید و آرامش را به ذهن خود بازگردانید. دایره را دنبال کنید.
      </p>
    </div>
  );
};