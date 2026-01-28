
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Pricing from './components/Pricing';
import { PlanType } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('landing');
  
  // Persistent login and plan state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('trades_ai_logged_in') === 'true';
  });
  
  const [userPlan, setUserPlan] = useState<PlanType>(() => {
    const saved = localStorage.getItem('trades_ai_user_plan');
    return (saved as PlanType) || PlanType.FREE;
  });

  // Effects to save state changes
  useEffect(() => {
    localStorage.setItem('trades_ai_logged_in', isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('trades_ai_user_plan', userPlan);
  }, [userPlan]);

  // Routing Logic
  useEffect(() => {
    // If logged in and at landing, automatically move to dashboard
    if (isLoggedIn && activeTab === 'landing') {
      setActiveTab('dashboard');
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    if (activeTab === 'landing' || activeTab === 'pricing') {
      setActiveTab('dashboard');
    }
  };

  const handleSelectPlan = (plan: PlanType) => {
    setUserPlan(plan);
    if (!isLoggedIn) {
      handleLogin();
    }
    setActiveTab('dashboard');
  };

  // Dashboard context routing
  const isDashboardActive = ['dashboard', 'home', 'marketplace', 'history', 'subscription', 'scanner', 'notifications', 'analyzer-result', 'journal'].includes(activeTab);

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 selection:bg-emerald-500/30">
      {!isDashboardActive && (
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
          userPlan={userPlan}
        />
      )}
      
      <main className="transition-all duration-500">
        {activeTab === 'landing' && (
          <Landing onGetStarted={() => setActiveTab('pricing')} />
        )}
        
        {isDashboardActive && (
          <Dashboard 
            activeSection={activeTab === 'dashboard' ? 'home' : activeTab}
            setActiveSection={setActiveTab}
            userPlan={userPlan} 
            isLoggedIn={isLoggedIn} 
            onShowLogin={handleLogin}
            onLogout={() => { 
              setIsLoggedIn(false); 
              localStorage.removeItem('trades_ai_logged_in');
              setActiveTab('landing'); 
            }}
          />
        )}

        {activeTab === 'pricing' && (
          <Pricing onSelectPlan={handleSelectPlan} />
        )}
      </main>

      {activeTab === 'landing' && (
        <footer className="py-20 border-t border-gray-900 bg-black/40">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <i className="fas fa-chart-line text-white"></i>
              </div>
              <div className="leading-none">
                <span className="text-xl font-black text-white">trades <span className="text-emerald-400">AI</span></span>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Institutional Intelligence</p>
              </div>
            </div>
            
            <div className="flex gap-12 text-xs text-gray-500 font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Risk Disclaimer</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terminal Support</a>
            </div>
            
            <div className="flex gap-4">
              {['twitter', 'telegram', 'discord'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-full glass border border-gray-800 flex items-center justify-center hover:bg-emerald-500/10 transition-all text-gray-400 hover:text-emerald-400">
                  <i className={`fab fa-${social}`}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-12 text-center text-[10px] text-gray-600 uppercase tracking-[4px] font-black">
            &copy; {new Date().getFullYear()} trades AI. All Rights Reserved.
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
