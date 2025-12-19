import React, { useState } from 'react';
import { AuthStep } from '../types';
import { Eye, EyeOff, Monitor, Briefcase, Coffee } from 'lucide-react';

interface AuthFlowProps {
  onComplete: () => void;
}

export const AsokaLogo = ({ className = "" }: { className?: string }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <div className="text-center">
      <h1 className="text-6xl font-extrabold text-slate-800 tracking-tighter font-vazir drop-shadow-sm transition-all duration-500">
        آسوکا
      </h1>
      <div className="flex items-center justify-center gap-2 mt-2">
        <div className="h-[2px] w-6 bg-gradient-to-r from-transparent to-teal-400"></div>
        <p className="text-[12px] text-teal-700 font-bold uppercase tracking-[0.2em] opacity-80">
          توازن ذهن و کار
        </p>
        <div className="h-[2px] w-6 bg-gradient-to-l from-transparent to-teal-400"></div>
      </div>
    </div>
  </div>
);

export const AuthFlow: React.FC<AuthFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<AuthStep>(AuthStep.ONBOARDING);
  const [showPassword, setShowPassword] = useState(false);

  const renderStep = () => {
    switch (step) {
      case AuthStep.ONBOARDING:
        return (
          <div className="h-full flex flex-col items-center justify-center px-10 py-12 text-center animate-in fade-in duration-700">
            <div className="mb-16">
               <AsokaLogo />
            </div>
            
            <div className="space-y-4 mb-24">
              <p className="text-2xl font-bold text-slate-800 leading-snug">
                مسیر آرامش در محیط کار
              </p>
              <p className="text-slate-500 leading-loose text-sm max-w-[280px] mx-auto">
                یک لحظه مکث، یک لبخند، و استرس دور می‌شود. با آسوکا بهره‌وری و آرامش را همزمان داشته باشید.
              </p>
            </div>

            <button 
              onClick={() => setStep(AuthStep.LOGIN)}
              className="w-full py-5 bg-teal-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-teal-100 active:scale-95 transition-all"
            >
              شروع تجربه
            </button>
          </div>
        );

      case AuthStep.LOGIN:
        return (
          <div className="h-full flex flex-col animate-in slide-in-from-bottom duration-500">
            <div className="bg-teal-600 pt-16 pb-20 px-8 rounded-b-[4rem] flex flex-col items-center shadow-xl">
              <div className="bg-white p-6 rounded-3xl shadow-lg mb-6">
                 <h1 className="text-3xl font-black text-teal-700">آسوکا</h1>
              </div>
              <h2 className="text-white text-2xl font-bold">ورود به حساب</h2>
            </div>
            <div className="flex-1 px-8 pt-12">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 mr-2">شماره تلفن</label>
                  <input type="tel" className="w-full h-14 bg-slate-100 rounded-2xl px-6 outline-none focus:ring-2 ring-teal-500/20 text-right" placeholder="۰۹۱۲۰۰۰۰۰۰۰" />
                </div>
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-400 mb-2 mr-2">رمز عبور</label>
                  <input type={showPassword ? "text" : "password"} className="w-full h-14 bg-slate-100 rounded-2xl px-6 outline-none focus:ring-2 ring-teal-500/20 text-right" placeholder="۱۲۳۴۵۶" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute left-4 bottom-4 text-slate-400">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button 
                onClick={onComplete}
                className="w-full py-4 bg-teal-600 text-white rounded-full font-bold text-lg mt-12 shadow-lg active:scale-95 transition-all"
              >
                ورود
              </button>
              <button 
                onClick={() => setStep(AuthStep.SIGNUP)}
                className="w-full py-4 text-teal-600 text-sm font-bold mt-4"
              >
                حساب کاربری ندارید؟ <span className="underline">ثبت‌نام کنید</span>
              </button>
            </div>
          </div>
        );

      case AuthStep.SIGNUP:
        return (
          <div className="h-full flex flex-col px-8 pt-16 animate-in slide-in-from-left duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-12 text-center">ساخت حساب کاربری</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">نام و نام خانوادگی</label>
                <input type="text" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 outline-none focus:border-teal-500 text-right" placeholder="نام شما" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">شماره تلفن</label>
                <input type="tel" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 outline-none focus:border-teal-500 text-right" placeholder="۰۹۱۲۰۰۰۰۰۰۰" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">رمز عبور</label>
                <input type="password" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 outline-none focus:border-teal-500 text-right" placeholder="••••••••" />
              </div>
            </div>
            <button 
              onClick={() => setStep(AuthStep.VERIFY)}
              className="w-full py-4 bg-teal-600 text-white rounded-full font-bold text-lg mt-12 shadow-lg active:scale-95 transition-all"
            >
              ادامه
            </button>
            <button 
              onClick={() => setStep(AuthStep.LOGIN)}
              className="w-full py-4 text-slate-400 text-sm mt-4"
            >
              قبلاً ثبت‌نام کرده‌اید؟ <span className="text-teal-500 font-bold">وارد شوید</span>
            </button>
          </div>
        );

      case AuthStep.VERIFY:
        return (
          <div className="h-full flex flex-col px-8 pt-24 animate-in slide-in-from-right duration-500">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">تایید شماره</h2>
              <p className="text-slate-500 text-sm">کد تایید برای شماره ۰۹۱۲۰۰۰۰۰۰۰ پیامک شد</p>
            </div>
            <div className="flex justify-center gap-4 mb-12" dir="ltr">
              {[1, 2, 3, 4].map((i) => (
                <input 
                  key={i}
                  type="text" 
                  maxLength={1} 
                  className="w-14 h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-2xl font-bold focus:border-teal-500 outline-none transition-all"
                  autoFocus={i === 1}
                />
              ))}
            </div>
            <button 
              onClick={onComplete}
              className="w-full py-4 bg-teal-600 text-white rounded-full font-bold text-lg shadow-lg active:scale-95 transition-all"
            >
              تایید
            </button>
            <button className="w-full py-6 text-teal-600 text-sm font-bold">ارسال مجدد کد</button>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="h-full bg-white">{renderStep()}</div>;
};