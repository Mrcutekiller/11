
import React from 'react';
import { PlanType } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  userPlan: PlanType;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isLoggedIn, onLogin, userPlan }) => {
  const links = [
    { id: 'features', label: 'Features' },
    { id: 'signals', label: 'Signals' },
    { id: 'scanner', label: 'Neural Scanner' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'how-to-use', label: 'How to Use' },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass rounded-full px-8 py-3 flex items-center justify-between border border-white/5 shadow-2xl">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setActiveTab('landing')}
        >
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
             <i className="fas fa-chart-line text-white text-xs"></i>
          </div>
          <div className="leading-none">
            <span className="text-lg font-black tracking-tighter text-white">trades <span className="text-emerald-400">AI</span></span>
            <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">AI Signal Studio</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-8">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id === 'signals' || link.id === 'scanner' ? 'dashboard' : link.id === 'pricing' ? 'pricing' : 'landing')}
              className="text-xs font-bold text-gray-400 hover:text-white transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <button 
                onClick={onLogin}
                className="text-xs font-bold text-white px-6 py-2 rounded-xl hover:bg-white/5 transition-colors border border-gray-800"
              >
                Sign In
              </button>
              <button 
                onClick={onLogin}
                className="bg-emerald-400 hover:bg-emerald-300 text-black px-6 py-2 rounded-xl text-xs font-black transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Get Started
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                 {userPlan} Plan
               </span>
               <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                 <i className="fas fa-user text-xs text-gray-400"></i>
               </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
