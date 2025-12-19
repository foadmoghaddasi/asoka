import React, { useState, useMemo, useRef, useEffect } from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';

export const StressTracker: React.FC = () => {
  // View State
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('yearly');
  const [year, setYear] = useState(1403);
  const [monthIndex, setMonthIndex] = useState(6); // Default to Mehr (Autumn)
  const [showDatePicker, setShowDatePicker] = useState(false);

  const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  // Logic to navigate backwards (Past)
  const handlePrev = () => {
    if (viewMode === 'yearly') {
      setYear(y => y - 1);
    } else {
      if (monthIndex === 0) {
        setMonthIndex(11);
        setYear(y => y - 1);
      } else {
        setMonthIndex(m => m - 1);
      }
    }
  };

  // Logic to navigate forwards (Future)
  const handleNext = () => {
    if (viewMode === 'yearly') {
      setYear(y => y + 1);
    } else {
      if (monthIndex === 11) {
        setMonthIndex(0);
        setYear(y => y + 1);
      } else {
        setMonthIndex(m => m + 1);
      }
    }
  };

  // Generate Dummy Data dynamically based on selection
  const chartData = useMemo(() => {
    if (viewMode === 'yearly') {
      // Yearly View: 12 months data
      return months.map((m, i) => {
        // Pseudo-random generation based on year index to make it look different per year
        const baseValue = 40 + (year % 10) * 2; 
        const randomVar = Math.floor(Math.random() * 20);
        const seasonalEffect = (i > 6) ? 10 : 0; // Higher in second half of year for demo
        
        return {
          name: m,
          value: Math.min(100, baseValue + randomVar + seasonalEffect),
          color: i < 6 ? '#fcd34d' : '#fb923c' // Spring/Summer (Yellow), Autumn/Winter (Orange)
        };
      });
    } else {
      // Monthly View: ~30 days data
      const daysInMonth = monthIndex < 6 ? 31 : (monthIndex === 11 ? 29 : 30);
      return Array.from({ length: daysInMonth }, (_, i) => ({
        name: (i + 1).toString(),
        value: Math.floor(Math.random() * 50) + 30, // Random stress level 30-80
        color: '#2dd4bf' // Teal for daily entries
      }));
    }
  }, [viewMode, year, monthIndex]);

  // --- DATE PICKER MODAL ---
  const DatePickerModal = () => {
    // Local state for the modal before confirming
    const [tempYear, setTempYear] = useState(year);
    const [tempMonthIndex, setTempMonthIndex] = useState(monthIndex);
    const [selectionMode, setSelectionMode] = useState<'month' | 'year'>('month');
    const yearsListRef = useRef<HTMLDivElement>(null);

    // Range of years for the list (e.g., 1350 to 1450)
    const years = Array.from({ length: 101 }, (_, i) => 1350 + i);

    const handleConfirmDate = () => {
      setYear(tempYear);
      setMonthIndex(tempMonthIndex);
      setShowDatePicker(false);
    };

    // Auto-scroll to selected year when switching to year mode
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
            {/* Header / Year Selector */}
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

            {/* Content Area */}
            <div className="overflow-y-auto mb-6 custom-scrollbar">
              {selectionMode === 'month' ? (
                /* Months Grid */
                <div className="grid grid-cols-3 gap-3">
                  {months.map((m, idx) => (
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
                /* Year List */
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

            {/* Actions */}
            <div className="flex gap-3 shrink-0 pt-2 border-t border-slate-50 mt-auto">
              <button 
                onClick={() => setShowDatePicker(false)}
                className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
              >
                انصراف
              </button>
              <button 
                onClick={handleConfirmDate}
                className="flex-[2] py-3 bg-teal-600 text-white rounded-xl font-bold shadow-xl shadow-teal-100 active:scale-95 transition-transform"
              >
                تایید تاریخ
              </button>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="p-6 h-full overflow-y-auto pb-28 bg-slate-50 relative">
      {/* Date Picker Overlay */}
      {showDatePicker && <DatePickerModal />}

      <header className="mb-6 flex justify-between items-center mt-2">
        <div>
          <span className="text-[10px] font-bold text-teal-600/60 uppercase tracking-[0.2em] mb-1 block">آسوکا</span>
          <h2 className="text-lg font-medium text-slate-500">آمار سلامتی</h2>
          <h1 className="text-2xl font-bold text-slate-800">پیشرفت شما</h1>
        </div>
      </header>

      {/* Chart Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm mb-8">
        
        {/* Controls Header */}
        <div className="flex flex-col gap-6 mb-8">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-700">نمودار استرس</h3>
                {/* View Toggle */}
                <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-bold">
                    <button 
                        onClick={() => setViewMode('monthly')} 
                        className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'monthly' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        ماهانه
                    </button>
                    <button 
                        onClick={() => setViewMode('yearly')} 
                        className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'yearly' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        سالانه
                    </button>
                </div>
            </div>

            {/* Date Navigator */}
            <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-2xl p-2 px-2">
                {/* Next Button (Left in RTL) */}
                <button onClick={handleNext} className="p-3 text-slate-400 hover:text-teal-600 hover:bg-white rounded-xl transition-all active:scale-95">
                    <ChevronLeft size={20} /> 
                </button>
                
                <button 
                  onClick={() => setShowDatePicker(true)}
                  className="flex-1 text-center hover:bg-white hover:shadow-sm rounded-xl py-2 transition-all group"
                >
                   <div className="flex items-center justify-center gap-2">
                      <span className="font-bold text-slate-800 text-lg">
                          {viewMode === 'yearly' ? `سال ${year}` : months[monthIndex]}
                      </span>
                      <ChevronDown size={16} className="text-slate-400 group-hover:text-teal-600 transition-colors" />
                   </div>
                   {viewMode === 'monthly' && (
                     <span className="block text-xs text-slate-400 font-medium">{year}</span>
                   )}
                </button>

                {/* Prev Button (Right in RTL) */}
                <button onClick={handlePrev} className="p-3 text-slate-400 hover:text-teal-600 hover:bg-white rounded-xl transition-all active:scale-95">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
        
        {/* Chart Area */}
        <div className="h-80 w-full"> 
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'yearly' ? (
              <AreaChart 
                data={chartData} 
                margin={{ top: 20, right: 10, left: 10, bottom: 70 }}
              >
                <defs>
                  <linearGradient id="colorStressYearly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <YAxis 
                  hide 
                  domain={['dataMin - 10', 'dataMax + 10']} 
                />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  interval={0} 
                  tick={{
                    fill: '#94a3b8', 
                    fontSize: 11, 
                    fontFamily: 'Vazirmatn',
                    angle: -90, 
                    textAnchor: 'end', 
                    dominantBaseline: 'middle',
                    dy: 10, 
                    dx: 0 
                  }} 
                  height={90} 
                  padding={{ left: 10, right: 10 }}
                />
                <Tooltip 
                  cursor={{stroke: '#fb923c', strokeWidth: 2, strokeDasharray: '5 5'}}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)', 
                    textAlign: 'right', 
                    direction: 'rtl',
                    fontFamily: 'Vazirmatn',
                    padding: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#fb923c" 
                  strokeWidth={3} 
                  fill="url(#colorStressYearly)" 
                  animationDuration={1500}
                />
              </AreaChart>
            ) : (
              <AreaChart 
                data={chartData} 
                margin={{ top: 20, right: 10, left: 10, bottom: 30 }}
              >
                <defs>
                  <linearGradient id="colorStressMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <YAxis 
                  hide 
                  domain={['dataMin - 5', 'dataMax + 5']} 
                />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  interval={2} // Show every 3rd label to avoid clutter
                  tick={{
                    fill: '#94a3b8', 
                    fontSize: 10, 
                    fontFamily: 'Vazirmatn',
                    angle: 0, 
                    textAnchor: 'middle', 
                    dominantBaseline: 'middle',
                    dy: 15, 
                    dx: 0 
                  }} 
                  height={50} 
                  padding={{ left: 10, right: 10 }}
                />
                <Tooltip 
                  cursor={{stroke: '#2dd4bf', strokeWidth: 2, strokeDasharray: '5 5'}}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)', 
                    textAlign: 'right', 
                    direction: 'rtl',
                    fontFamily: 'Vazirmatn',
                    padding: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2dd4bf" 
                  strokeWidth={3} 
                  fill="url(#colorStressMonthly)" 
                  animationDuration={1500}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Card */}
      <div className="bg-teal-50 p-6 rounded-3xl border border-teal-100">
        <h3 className="font-bold text-teal-800 mb-2">بینش‌ها</h3>
        <p className="text-sm text-teal-600 leading-relaxed">
           {viewMode === 'yearly' 
             ? `در سال ${year}، نوسانات استرس شما در ماه‌های پایانی سال بیشتر قابل مشاهده است. تمرینات تنفسی را افزایش دهید.`
             : `در ${months[monthIndex]} ${year}، میانگین استرس شما در حد نرمال بوده است. روند مدیتیشن خود را حفظ کنید.`
           }
        </p>
      </div>
    </div>
  );
};