
import React from 'react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  userPlan: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, userPlan }) => {
  const menuItems = [
    { id: 'home', label: 'Signal Feed', icon: 'fa-tower-broadcast' },
    { id: 'scanner', label: 'Neural Scanner', icon: 'fa-microchip' },
    { id: 'journal', label: 'Trading Journal', icon: 'fa-calendar-check' },
    { id: 'history', label: 'Win Ledger', icon: 'fa-clock-rotate-left' },
    { id: 'marketplace', label: 'Alpha Hub', icon: 'fa-users-viewfinder' },
    { id: 'subscription', label: 'Plan Status', icon: 'fa-credit-card' },
  ];

  const partners = [
    { name: 'Terminal v4 Node', icon: 'fa-server' },
    { name: 'Market Vision Core', icon: 'fa-eye' },
    { name: 'Quant Flux Sync', icon: 'fa-bolt' },
  ];

  return (
    <div className="w-[280px] fixed left-4 top-4 bottom-4 glass rounded-[2.5rem] border border-white/5 flex flex-col hidden lg:flex z-40 overflow-hidden">
      <div className="p-10 flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <i className="fas fa-chart-line text-white"></i>
          </div>
          <div>
            <span className="text-xl font-black text-white">trades <span className="text-emerald-400">AI</span></span>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Intelligence Terminal</p>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[13px] font-bold tracking-tight transition-all group relative ${
                activeSection === item.id 
                ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center`}></i>
              <span>{item.label}</span>
              {activeSection === item.id && (
                 <div className="absolute right-3 w-1.5 h-1.5 bg-black/40 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Stats */}
        <div className="mt-auto space-y-6 pt-8 border-t border-white/5">
           <div className="space-y-3">
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest px-5">System Architecture</p>
              {partners.map(p => (
                 <div key={p.name} className="flex items-center gap-4 px-5 py-1 text-[11px] font-bold text-gray-500">
                   <i className={`fas ${p.icon} w-5 text-center text-[10px]`}></i>
                   <span>{p.name}</span>
                 </div>
              ))}
           </div>
           
           <div className="px-5 py-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-[9px] font-black text-emerald-400 uppercase">Engine Sync</span>
                 <span className="text-[9px] font-black text-emerald-400">92.4%</span>
              </div>
              <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[92%] animate-pulse"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
