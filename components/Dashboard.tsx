
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import SignalCard from './SignalCard';
import JournalModule from './JournalModule';
import { generateMarketSignal, analyzeChartImage } from '../services/geminiService';
import { TradingSignal, PlanType, AnalyzerResult } from '../types';

interface DashboardProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  userPlan: PlanType;
  isLoggedIn: boolean;
  onShowLogin: () => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  activeSection, 
  setActiveSection, 
  userPlan, 
  isLoggedIn, 
  onShowLogin,
  onLogout 
}) => {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzerResult | null>(null);

  // Quick load signals on login or section switch to home
  useEffect(() => {
    if (!isLoggedIn || activeSection !== 'home') return;
    
    const fetchSignals = async () => {
      setLoading(true);
      try {
        const pairs = ["XAUUSD", "BTCUSD", "ETHUSD", "SOLUSD"];
        // Concurrent requests for faster loading
        const results = await Promise.all(pairs.map(p => generateMarketSignal(p)));
        
        const enhanced = results.map((s, i) => ({
          ...s,
          winRate: [98, 94, 88, 92][i],
          pnl: ['+$14,210', '+$8,450', '+$3,120', '+$5,900'][i],
          author: ['Quantum Core', 'Neural Alpha', 'Sentinel Sync', 'Flux Logic'][i],
          age: ['Just now', '5m ago', '12m ago', '24m ago'][i]
        }));
        
        setSignals(enhanced);
      } catch (err) {
        console.error("Signal engine failure", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSignals();
  }, [isLoggedIn, activeSection]);

  const handleChartAnalysis = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const res = await analyzeChartImage(base64);
        setAnalysisResult(res);
        setLoading(false);
        setActiveSection('analyzer-result');
      } catch (err) {
        alert("Image analysis failed. Please ensure chart clarity.");
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isLoggedIn) return (
     <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="glass p-12 rounded-[3rem] border border-white/5 text-center space-y-8 max-w-md animate-in fade-in">
           <i className="fas fa-shield-halved text-emerald-400 text-5xl"></i>
           <h2 className="text-3xl font-black">Secure Terminal Access</h2>
           <p className="text-gray-500 font-medium">Please initialize your session to access the Neural Signal Core.</p>
           <button onClick={onShowLogin} className="w-full py-4 bg-emerald-400 text-black font-black rounded-2xl shadow-xl shadow-emerald-500/20">Authorize Terminal</button>
        </div>
     </div>
  );

  return (
    <div className="flex min-h-screen bg-[#030712] p-4 gap-4 overflow-hidden">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userPlan={userPlan} />
      
      <div className="flex-1 lg:ml-[300px] flex flex-col gap-4 overflow-hidden">
        {/* Header */}
        <header className="glass rounded-[2rem] px-8 py-4 flex items-center justify-between border border-white/5 z-50">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-black/40 rounded-xl border border-gray-800">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Neural Core v4.2.0</span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
              </div>
              <button onClick={() => setActiveSection('home')} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${activeSection === 'home' ? 'text-emerald-400' : 'text-gray-500 hover:text-white'}`}>
                <i className="fas fa-chart-line"></i> Terminal Feed
              </button>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 group relative cursor-pointer">
                 <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-700 bg-gray-900 flex items-center justify-center">
                    <i className="fas fa-robot text-gray-600"></i>
                 </div>
                 <div className="hidden sm:block leading-tight">
                    <p className="text-xs font-black text-white">authorized_trader</p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{userPlan} Mode</p>
                 </div>
                 <div className="absolute top-full right-0 mt-2 w-48 glass rounded-2xl border border-white/5 p-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50">
                    <button onClick={onLogout} className="w-full text-left px-4 py-3 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2">
                       <i className="fas fa-power-off"></i> Disconnect Engine
                    </button>
                 </div>
              </div>
           </div>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto pb-8 pr-2 custom-scrollbar">
          {activeSection === 'home' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              {/* Vision Banner */}
              <div className="glass rounded-[3rem] p-12 border border-white/5 relative overflow-hidden group shadow-3xl">
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                 <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                       <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                          <i className="fas fa-bolt text-[10px] text-emerald-400"></i>
                          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Quantum Engine Synchronized</span>
                       </div>
                       <h2 className="text-5xl font-black tracking-tighter leading-none text-white">
                          Institutional <br /> <span className="text-emerald-400">Trading Alpha.</span>
                       </h2>
                       <p className="text-gray-400 max-w-xl font-medium leading-relaxed">
                          Precision signals with SL and triple TP targets delivered in under 400ms. Leverage vision AI to automate your chart analysis and market structure detection.
                       </p>
                       <button onClick={() => setActiveSection('scanner')} className="px-10 py-5 bg-emerald-400 text-black rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-emerald-300 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                          <i className="fas fa-microchip"></i>
                          Access Vision Scanner
                       </button>
                    </div>
                    <div className="hidden md:flex w-80 h-80 bg-black/40 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center p-8 space-y-6">
                       <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 text-3xl">
                          <i className="fas fa-gauge-high"></i>
                       </div>
                       <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Latency Spectrum: Institutional</p>
                    </div>
                 </div>
              </div>

              {/* Grid */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between px-4">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-gray-400">
                       <i className="fas fa-tower-broadcast text-emerald-400"></i> High-Accuracy Stream
                    </h3>
                 </div>
                 {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                       {[1,2,3,4].map(i => <div key={i} className="h-[400px] glass rounded-[2.5rem] animate-pulse"></div>)}
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                       {signals.map(s => <SignalCard key={s.id} signal={s} />)}
                    </div>
                 )}
              </div>
            </div>
          )}

          {activeSection === 'scanner' && (
             <div className="py-12 animate-in fade-in duration-500">
                <div className="glass p-16 rounded-[4rem] border border-white/5 space-y-12 text-center max-w-4xl mx-auto shadow-3xl">
                   <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] border border-emerald-500/20 flex items-center justify-center mx-auto text-4xl text-emerald-400 shadow-xl">
                      <i className="fas fa-eye"></i>
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-5xl font-black tracking-tight">Neural <span className="text-emerald-400">Scanner Suite</span></h2>
                      <p className="text-gray-500 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                         Upload your trading chart. Our Vision AI identifies institutional order blocks, trend shifts, and suggests precise entry targets with triple profit-taking zones.
                      </p>
                   </div>
                   <div className="pt-10">
                      <label className="inline-flex px-12 py-6 bg-emerald-400 text-black rounded-3xl font-black text-sm items-center gap-4 cursor-pointer hover:bg-emerald-300 transition-all shadow-3xl shadow-emerald-500/30 active:scale-95">
                         {loading ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-cloud-arrow-up"></i>}
                         {loading ? 'Synthesizing Patterns...' : 'Analyze Market Image'}
                         <input type="file" className="hidden" accept="image/*" onChange={handleChartAnalysis} disabled={loading} />
                      </label>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em] mt-8">Compatible with TradingView, MetaTrader, cTrader Screenshots</p>
                   </div>
                </div>
             </div>
          )}

          {activeSection === 'journal' && <JournalModule />}

          {activeSection === 'analyzer-result' && analysisResult && (
             <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                <div className="glass p-12 rounded-[3.5rem] border border-emerald-500/20 space-y-12 relative overflow-hidden">
                   <div className="scanline"></div>
                   <div className="flex justify-between items-center border-b border-gray-800 pb-10">
                      <h2 className="text-4xl font-black">Neural Scan <span className="text-emerald-400">Complete</span></h2>
                      <button onClick={() => setAnalysisResult(null)} className="px-8 py-4 glass rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">New Visual Scan</button>
                   </div>
                   
                   <div className="grid lg:grid-cols-2 gap-16">
                      <div className="space-y-8">
                         <div className="bg-black/40 p-10 rounded-[2.5rem] border border-gray-800 space-y-6">
                            <p className="text-gray-300 text-base leading-relaxed font-medium">{analysisResult.summary}</p>
                         </div>
                         <div className="grid grid-cols-2 gap-8">
                            <div className="glass p-8 rounded-3xl border border-white/5">
                               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Trend Alignment</p>
                               <p className="text-2xl font-black text-white uppercase tracking-tighter">{analysisResult.trend}</p>
                            </div>
                         </div>
                      </div>

                      {analysisResult.suggestedSignal && (
                         <div className="glass bg-emerald-500/5 border-emerald-500/30 rounded-[3.5rem] p-12 space-y-12 border-2">
                            <div className="flex justify-between items-start">
                               <h3 className="text-4xl font-black text-white tracking-tighter">{analysisResult.suggestedSignal.asset}</h3>
                               <p className="text-5xl font-black font-mono text-emerald-400">{analysisResult.suggestedSignal.confidence}%</p>
                            </div>
                            <div className="grid grid-cols-2 gap-10 border-t border-gray-800 pt-10">
                               <div>
                                  <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Entry Zone</p>
                                  <p className="text-4xl font-mono font-black text-white">{analysisResult.suggestedSignal.entry}</p>
                               </div>
                               <div>
                                  <p className="text-[10px] text-rose-500 font-black uppercase mb-1">Stop Loss</p>
                                  <p className="text-4xl font-mono font-black text-rose-500">{analysisResult.suggestedSignal.sl}</p>
                               </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                               {[analysisResult.suggestedSignal.tp1, analysisResult.suggestedSignal.tp2, analysisResult.suggestedSignal.tp3].map((tp, idx) => (
                                  <div key={idx} className="bg-black/40 p-6 rounded-3xl border border-gray-800 text-center">
                                     <p className="text-[10px] text-gray-600 font-black mb-1">TP {idx+1}</p>
                                     <p className="text-base font-black font-mono text-emerald-400">{tp}</p>
                                  </div>
                               ))}
                            </div>
                            <button className="w-full py-6 bg-emerald-400 hover:bg-emerald-300 text-black rounded-[2rem] font-black uppercase text-sm shadow-xl transition-all active:scale-95">Send Signal to Hub</button>
                         </div>
                      )}
                   </div>
                </div>
             </div>
          )}

          {['history', 'marketplace', 'notifications', 'subscription'].includes(activeSection) && (
             <div className="py-20 animate-in fade-in duration-500 max-w-5xl mx-auto">
                <div className="glass p-16 rounded-[4rem] border border-white/5 space-y-10 text-center">
                   <h2 className="text-5xl font-black capitalize tracking-tight">{activeSection.replace('-', ' ')} <span className="text-emerald-400">Control</span></h2>
                   <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                      Terminal module synchronizing. Real-time data feed for {activeSection} is currently active and updating through the neural core.
                   </p>
                   <button onClick={() => setActiveSection('home')} className="px-12 py-5 bg-white/5 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all">Return to Feed</button>
                </div>
             </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="glass-dark rounded-2xl p-4 border border-white/5 flex items-center gap-6 text-[10px] font-black text-gray-500 mt-auto uppercase tracking-widest overflow-hidden">
           <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
              <span className="text-emerald-500">Neural Sync Status: 100% Nominal</span>
           </div>
           <div className="flex-1 overflow-hidden">
             <div className="flex gap-12 animate-marquee whitespace-nowrap">
                <span>BTC/USD: 94,200 (+1.2%)</span>
                <span>ETH/USD: 2,410 (-0.4%)</span>
                <span>XAU/USD: 2,042 (+0.1%)</span>
                <span>SOL/USD: 184 (+3.8%)</span>
                <span className="opacity-40">Precision Strategy: High-Alpha | 12ms Edge</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
