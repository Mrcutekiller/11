
import React, { useState, useMemo, useEffect } from 'react';
import { JournalEntry } from '../types';

const JournalModule: React.FC = () => {
  // Initialize state from localStorage if available
  const [initialAccountSize, setInitialAccountSize] = useState<number>(() => {
    const saved = localStorage.getItem('trades_ai_account_size');
    return saved ? Number(saved) : 10000;
  });

  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('trades_ai_journal_entries');
    return saved ? JSON.parse(saved) : [];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  
  // Calendar State
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newEntry, setNewEntry] = useState({ trades: 0, profit: 0 });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('trades_ai_account_size', initialAccountSize.toString());
  }, [initialAccountSize]);

  useEffect(() => {
    localStorage.setItem('trades_ai_journal_entries', JSON.stringify(entries));
  }, [entries]);

  const stats = useMemo(() => {
    const totalProfit = entries.reduce((acc, curr) => acc + curr.profit, 0);
    const totalTrades = entries.reduce((acc, curr) => acc + curr.tradesCount, 0);
    const winningDays = entries.filter(e => e.profit > 0).length;
    const currentBalance = initialAccountSize + totalProfit;
    const winRate = entries.length > 0 ? (winningDays / entries.length) * 100 : 0;
    const growth = initialAccountSize > 0 ? (totalProfit / initialAccountSize) * 100 : 0;

    return { totalProfit, totalTrades, currentBalance, winRate, growth };
  }, [entries, initialAccountSize]);

  const handleAddEntry = () => {
    const existingIndex = entries.findIndex(e => e.date === selectedDate);
    const entry: JournalEntry = {
      id: existingIndex >= 0 ? entries[existingIndex].id : Date.now().toString(),
      date: selectedDate,
      tradesCount: newEntry.trades,
      profit: newEntry.profit
    };

    if (existingIndex >= 0) {
      const updated = [...entries];
      updated[existingIndex] = entry;
      setEntries(updated);
    } else {
      setEntries(prev => [...prev, entry].sort((a, b) => b.date.localeCompare(a.date)));
    }
    
    setShowAddModal(false);
    setNewEntry({ trades: 0, profit: 0 });
  };

  const openDateModal = (dateStr: string) => {
    const existing = entries.find(e => e.date === dateStr);
    setSelectedDate(dateStr);
    if (existing) {
      setNewEntry({ trades: existing.tradesCount, profit: existing.profit });
    } else {
      setNewEntry({ trades: 0, profit: 0 });
    }
    setShowAddModal(true);
  };

  // Calendar Helpers
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startingDay = firstDayOfMonth(year, month);
    const days = [];
    
    // Padding for previous month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        date: dateStr,
        entry: entries.find(e => e.date === dateStr)
      });
    }
    
    return days;
  }, [viewDate, entries]);

  const changeMonth = (offset: number) => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-2 group hover:border-emerald-500/20 transition-all">
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Authorized Balance</p>
           <p className="text-3xl font-black font-mono text-white tracking-tighter">${stats.currentBalance.toLocaleString()}</p>
        </div>
        <div className={`glass p-8 rounded-[2.5rem] border ${stats.growth >= 0 ? 'border-emerald-500/10' : 'border-rose-500/10'} space-y-2 group hover:scale-[1.02] transition-all`}>
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Terminal Growth</p>
           <p className={`text-3xl font-black font-mono tracking-tighter ${stats.growth >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
             {stats.growth >= 0 ? '+' : ''}{stats.growth.toFixed(2)}%
           </p>
        </div>
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-2">
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Win Consistency</p>
           <p className="text-3xl font-black font-mono text-blue-400 tracking-tighter">{stats.winRate.toFixed(1)}%</p>
        </div>
        <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-2">
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Executions</p>
           <p className="text-3xl font-black font-mono text-gray-300 tracking-tighter">{stats.totalTrades}</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Calendar Core */}
        <div className="flex-1 glass rounded-[3rem] border border-white/5 overflow-hidden shadow-3xl">
          <div className="p-10 border-b border-gray-800 flex justify-between items-center bg-white/2">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Neural Session Planner</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-black/40 rounded-xl border border-gray-800 p-1">
                <button onClick={() => changeMonth(-1)} className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors"><i className="fas fa-chevron-left text-xs"></i></button>
                <button onClick={() => changeMonth(1)} className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-lg transition-colors"><i className="fas fa-chevron-right text-xs"></i></button>
              </div>
              <div className="flex items-center gap-3 bg-black/40 px-4 py-2.5 rounded-xl border border-gray-800">
                <span className="text-[10px] font-black text-gray-500 uppercase">A/C Size</span>
                <input 
                  type="number" 
                  value={initialAccountSize} 
                  onChange={(e) => setInitialAccountSize(Number(e.target.value))}
                  className="bg-transparent text-sm font-black font-mono text-white w-24 outline-none border-b border-transparent focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-7 gap-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-[10px] font-black text-gray-600 uppercase tracking-widest py-2">{day}</div>
              ))}
              {calendarDays.map((dayData, i) => (
                <div key={i} className="aspect-square relative">
                  {dayData ? (
                    <button 
                      onClick={() => openDateModal(dayData.date)}
                      className={`w-full h-full rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 group relative overflow-hidden ${
                        dayData.entry 
                        ? (dayData.entry.profit >= 0 ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10' : 'bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10') 
                        : 'bg-white/2 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className={`text-xs font-black ${dayData.entry ? 'text-white' : 'text-gray-500'}`}>{dayData.day}</span>
                      {dayData.entry && (
                        <div className="text-center">
                           <p className={`text-[10px] font-mono font-black ${dayData.entry.profit >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                             {dayData.entry.profit >= 0 ? '+' : ''}${Math.abs(dayData.entry.profit).toLocaleString()}
                           </p>
                           <p className="text-[8px] font-bold text-gray-500 uppercase opacity-60">{dayData.entry.tradesCount} T</p>
                        </div>
                      )}
                      {dayData.date === new Date().toISOString().split('T')[0] && (
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_8px_#60a5fa]"></div>
                      )}
                    </button>
                  ) : (
                    <div className="w-full h-full opacity-20 bg-white/2 rounded-2xl border border-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend / Sidebar */}
        <div className="w-full xl:w-80 space-y-6">
           <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Session Logic</h3>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-emerald-500"></div></div>
                    <p className="text-[11px] font-bold text-gray-400">Winning sessions are color-coded in Emerald.</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-rose-500"></div></div>
                    <p className="text-[11px] font-bold text-gray-400">Losing sessions are color-coded in Rose.</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center"><i className="fas fa-save text-[10px] text-blue-400"></i></div>
                    <p className="text-[11px] font-bold text-gray-400">Data is automatically saved to local storage.</p>
                 </div>
              </div>
           </div>

           <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-4 overflow-hidden relative">
              <div className="absolute inset-0 bg-emerald-500/5 blur-[40px] rounded-full"></div>
              <div className="relative z-10 space-y-4">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Neural Tip</p>
                <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
                  "Consistent journaling reveals hidden patterns in your trading psychology. Discipline is the only alpha."
                </p>
              </div>
           </div>
        </div>
      </div>

      {/* Record Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="glass w-full max-w-md p-10 rounded-[3rem] border border-white/10 space-y-10 shadow-3xl">
              <div className="space-y-2">
                 <h3 className="text-3xl font-black">{new Date(selectedDate).toLocaleDateString('default', { day: 'numeric', month: 'long' })}</h3>
                 <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Update Session Performance</p>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Executions Count</label>
                    <input 
                      type="number" 
                      value={newEntry.trades}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, trades: Number(e.target.value) }))}
                      className="w-full bg-black/40 border border-gray-800 rounded-2xl px-6 py-5 text-sm font-mono text-white outline-none focus:border-emerald-500 transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Profit / Loss Yield ($)</label>
                    <input 
                      type="number" 
                      value={newEntry.profit}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, profit: Number(e.target.value) }))}
                      placeholder="e.g. -500 or 1250"
                      className={`w-full bg-black/40 border border-gray-800 rounded-2xl px-6 py-5 text-sm font-mono outline-none focus:border-emerald-500 transition-all ${newEntry.profit >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}
                    />
                 </div>
              </div>
              <div className="flex gap-4 pt-4">
                 <button onClick={() => setShowAddModal(false)} className="flex-1 py-5 glass border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">Cancel</button>
                 <button onClick={handleAddEntry} className="flex-1 py-5 bg-emerald-400 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">Confirm Data</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default JournalModule;
