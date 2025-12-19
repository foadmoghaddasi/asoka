import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { BreathingExercise } from './components/BreathingExercise';
import { MeditationPlayer } from './components/MeditationPlayer';
import { StressTracker } from './components/StressTracker';
import { Learn } from './components/Learn';
import { AuthFlow, AsokaLogo } from './components/AuthFlow';
import { AppView } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Splash timeout
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(splashTimer);
  }, []);

  // Check login status on mount
  useEffect(() => {
    const status = localStorage.getItem('asoka_logged_in');
    if (status === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginComplete = () => {
    localStorage.setItem('asoka_logged_in', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('asoka_logged_in');
    setIsLoggedIn(false);
    setCurrentView(AppView.DASHBOARD);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard setView={setCurrentView} onLogout={handleLogout} />;
      case AppView.BREATHE:
        return <BreathingExercise />;
      case AppView.MEDITATE:
        return <MeditationPlayer />;
      case AppView.TRACK:
        return <StressTracker />;
      case AppView.LEARN:
        return <Learn />;
      default:
        return <Dashboard setView={setCurrentView} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex justify-center items-center p-0 sm:p-4">
      {/* Main Container - No thick black frame anymore */}
      <div className="w-full max-w-md bg-white h-screen sm:h-[844px] shadow-2xl relative overflow-hidden sm:rounded-[2.5rem] border border-slate-100">
        <main className="h-full overflow-hidden">
          {showSplash ? (
            <div className="h-full flex items-center justify-center bg-white animate-in fade-in duration-500">
              <div className="animate-pulse">
                <AsokaLogo />
              </div>
            </div>
          ) : !isLoggedIn ? (
            <AuthFlow onComplete={handleLoginComplete} />
          ) : (
            <>
              <div className="h-full overflow-y-auto">
                {renderView()}
              </div>
              <Navigation currentView={currentView} setView={setCurrentView} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;