import React, { useState } from 'react';
import { ChevronRight, Clock, BookOpen, ArrowLeft } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  readTime: string;
  summary: string;
  fullContent: React.ReactNode;
  category: string;
}

export const Learn: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      id: 1,
      title: "علم استراحت‌های کوتاه",
      category: "بهره‌وری",
      readTime: "۲ دقیقه",
      summary: "استراحت‌های کوتاه ۱ تا ۵ دقیقه‌ای می‌توانند به طور قابل توجهی هوشیاری ذهنی را بهبود بخشیده و خستگی را کاهش دهند.",
      fullContent: (
        <>
          <p className="mb-4">
            مغز انسان برای حفظ تمرکز طولانی‌مدت طراحی نشده است. تحقیقات نشان می‌دهد که پس از ۹۰ دقیقه کار مداوم، کارایی مغز به شدت افت می‌کند. استراحت‌های کوتاه یا "Micro-breaks" راه حلی علمی برای این مشکل هستند.
          </p>
          <h4 className="font-bold text-slate-800 mb-2 text-lg">قانون ۲۰-۲۰-۲۰</h4>
          <p className="mb-4">
            برای جلوگیری از خستگی چشم و ذهن، هر ۲۰ دقیقه، به مدت ۲۰ ثانیه به جسمی در فاصله ۲۰ فوتی (۶ متری) نگاه کنید. این کار باعث استراحت عضلات چشم و بازنشانی تمرکز می‌شود.
          </p>
          <h4 className="font-bold text-slate-800 mb-2 text-lg">مزایای استراحت کوتاه</h4>
          <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700">
            <li>کاهش استرس و اضطراب لحظه‌ای</li>
            <li>بازیابی گلوکز و اکسیژن در مغز</li>
            <li>جلوگیری از دردهای عضلانی ناشی از نشستن ثابت</li>
          </ul>
        </>
      )
    },
    {
      id: 2,
      title: "حرکات کششی پشت میز",
      category: "ارگونومی",
      readTime: "۳ دقیقه",
      summary: "نشستن طولانی جریان خون را کند می‌کند. حرکات ساده کششی می‌توانند تنش‌های فیزیکی انباشته شده را آزاد کنند.",
      fullContent: (
        <>
          <p className="mb-4">
            بدن انسان برای تحرک ساخته شده است، اما محیط‌های اداری مدرن ما را به صندلی‌ها زنجیر کرده‌اند. انجام حرکات کششی ساده پشت میز می‌تواند از دردهای مزمن کمر و گردن جلوگیری کند.
          </p>
          <h4 className="font-bold text-slate-800 mb-2 text-lg">۱. چرخش گردن</h4>
          <p className="mb-4">
            صاف بنشینید. گوش راست را به سمت شانه راست نزدیک کنید و ۵ ثانیه نگه دارید. سپس به آرامی سر را به پایین بچرخانید و به سمت چپ ببرید. این کار را ۳ بار تکرار کنید.
          </p>
          <h4 className="font-bold text-slate-800 mb-2 text-lg">۲. کشش شانه‌ها</h4>
          <p className="mb-4">
            شانه‌ها را تا نزدیک گوش‌ها بالا بیاورید، ۵ ثانیه نگه دارید و سپس رها کنید. تصور کنید تمام سنگینی دنیا از روی دوشتان برداشته می‌شود.
          </p>
          <h4 className="font-bold text-slate-800 mb-2 text-lg">۳. چرخش مچ دست</h4>
          <p className="mb-4">
            برای جلوگیری از سندرم تونل کارپال، مچ دست‌ها را ۱۰ بار در جهت عقربه‌های ساعت و ۱۰ بار خلاف آن بچرخانید.
          </p>
        </>
      )
    },
    {
      id: 3,
      title: "نوشیدن آب و تمرکز",
      category: "تغذیه",
      readTime: "۱ دقیقه",
      summary: "کم‌آبی دشمن خاموش بهره‌وری است. نوشیدن آب کافی ساده‌ترین راه برای حفظ سطح انرژی و تمرکز در طول روز است.",
      fullContent: (
        <>
          <p className="mb-4">
            آیا می‌دانستید حدود ۷۵٪ مغز شما از آب تشکیل شده است؟ مغز مانند یک موتور هیدرولیک عمل می‌کند. وقتی آب کافی به آن نرسد، "مه مغزی" ایجاد می‌شود، پردازش اطلاعات کند شده و تمرکز کردن دشوار می‌شود.
          </p>
          <h4 className="font-bold text-slate-800 mb-2 text-lg">تشنگی: هشدار دیرهنگام</h4>
          <p className="mb-4">
             یک اشتباه رایج این است که صبر کنیم تا تشنه شویم. احساس تشنگی زمانی رخ می‌دهد که بدن شما *قبلاً* دچار کم‌آبی شده است. برای حفظ اوج عملکرد ذهنی، باید پیش از تشنگی آب بنوشید.
          </p>
          <h4 className="font-bold text-slate-800 mb-2 text-lg">قانون تعادل با کافئین</h4>
          <p className="mb-4">
            بسیاری از ما برای تمرکز به قهوه تکیه می‌کنیم. اما کافئین ادرارآور است و آب بدن را دفع می‌کند. قانون طلایی: به ازای هر فنجان قهوه یا چای، حتماً یک لیوان آب اضافه بنوشید تا تعادل حفظ شود.
          </p>
          <h4 className="font-bold text-slate-800 mb-2 text-lg">چگونه بیشتر آب بنوشیم؟</h4>
          <ul className="list-disc list-inside space-y-2 mb-4 text-slate-700">
            <li>همیشه یک بطری آب روی میز و در <b>میدان دید</b> خود داشته باشید.</li>
            <li>اگر طعم آب را دوست ندارید، چند برگ نعنا یا برش لیمو به آن اضافه کنید.</li>
            <li>نوشیدن آب را به عادت‌های دیگر گره بزنید (مثلاً یک لیوان بعد از هر تماس تلفنی).</li>
          </ul>
        </>
      )
    }
  ];

  // Detailed View Component
  if (selectedArticle) {
    return (
      <div className="h-full bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 p-4 flex items-center gap-2 z-10">
          <button 
            onClick={() => setSelectedArticle(null)}
            className="p-2 -mr-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors"
          >
            <ChevronRight size={24} />
          </button>
          <span className="font-bold text-slate-700">بازگشت به کتابخانه</span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-32">
          <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg mb-4">
            {selectedArticle.category}
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
            {selectedArticle.title}
          </h1>
          
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-8 border-b border-slate-100 pb-6">
            <Clock size={16} />
            <span>زمان مطالعه: {selectedArticle.readTime}</span>
          </div>

          <div className="prose prose-slate prose-lg text-slate-600 leading-8 text-justify">
            {selectedArticle.fullContent}
          </div>
        </div>
      </div>
    );
  }

  // List View Component
  return (
    <div className="p-6 pb-24 h-full overflow-y-auto bg-slate-50">
       <header className="mb-6 pt-2">
          <span className="text-[10px] font-bold text-teal-600/60 uppercase tracking-[0.2em] mb-1 block">آسوکا</span>
          <h2 className="text-lg font-medium text-slate-500">یادگیری</h2>
          <h1 className="text-2xl font-bold text-slate-800">کتابخانه سلامتی</h1>
       </header>

       <div className="grid gap-4">
         {articles.map((article) => (
           <div 
             key={article.id} 
             onClick={() => setSelectedArticle(article)}
             className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-200 transition-all cursor-pointer group active:scale-[0.98]"
           >
             <div className="flex justify-between items-start mb-3">
               <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">
                 {article.category}
               </span>
               <div className="flex items-center gap-1 text-slate-400 text-xs bg-slate-50 px-2 py-1 rounded-lg">
                 <Clock size={12} />
                 <span>{article.readTime}</span>
               </div>
             </div>
             
             <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">
               {article.title}
             </h3>
             
             <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
               {article.summary}
             </p>

             <div className="flex items-center text-teal-600 text-sm font-bold transition-all group-hover:translate-x-[-4px] duration-300">
               <span>مطالعه کامل</span>
               <ArrowLeft size={16} className="mr-2" />
             </div>
           </div>
         ))}
       </div>
       
       <div className="mt-8 p-6 bg-slate-100 border border-slate-200 rounded-2xl text-center">
         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400 shadow-sm">
            <BookOpen size={24} />
         </div>
         <p className="text-slate-500 text-sm font-medium">محتوای هوشمند بیشتر بر اساس الگوهای استرس شما به زودی اضافه می‌شود.</p>
       </div>
    </div>
  );
};