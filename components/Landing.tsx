
import React, { useEffect, useState, useRef } from 'react';

const Landing: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  // Changed type to HTMLElement to support diverse tags like P, H2, and Div
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.1 });

    revealRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const features = [
    { icon: 'fa-brain', text: 'Institutional AI models for deep market structure analysis' },
    { icon: 'fa-eye', text: 'Computer vision engine that identifies signals from chart images' },
    { icon: 'fa-tower-broadcast', text: 'Real-time precision signal streams for Telegram & Discord' },
    { icon: 'fa-chart-network', text: 'Global network of verified AI signal providers' },
    { icon: 'fa-shield-halved', text: 'Advanced risk-modeling with SL and multi-target TP logic' }
  ];

  return (
    <div className="relative pt-40 overflow-hidden bg-[#030712]">
      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: all 1s cubic-bezier(0.22, 1, 0.36, 1); }
        .reveal-active { opacity: 1; transform: translateY(0); }
        .stagger-1 { transition-delay: 100ms; }
        .stagger-2 { transition-delay: 200ms; }
        .stagger-3 { transition-delay: 300ms; }
      `}</style>

      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(#10b981 0.5px, transparent 0.5px)`, 
          backgroundSize: '40px 40px' 
        }}
      ></div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-start px-4 text-center">
        <div className="max-w-4xl z-10 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tighter leading-[1.05]">
            The future of Trading <br />
            <span className="text-emerald-400 animate-pulse-slow">powered by AI</span>
          </h1>
          
          {/* Fix: Wrap ref assignment in braces to return void */}
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed reveal" ref={el => { revealRefs.current[0] = el; }}>
            Eliminate human bias with institutional-grade trading AI. Get precision signals, <br className="hidden md:block" />
            real-time technical analysis, and automated market intelligence.
          </p>
          
          {/* Fix: Wrap ref assignment in braces to return void */}
          <div className="flex items-center justify-center max-w-lg mx-auto bg-gray-900/40 rounded-2xl p-1.5 border border-gray-800 reveal stagger-1" ref={el => { revealRefs.current[1] = el; }}>
            <input 
              type="email" 
              placeholder="Your Email" 
              className="bg-transparent border-none focus:ring-0 text-sm px-6 flex-1 text-white placeholder-gray-600"
            />
            <button 
              onClick={onGetStarted}
              className="bg-emerald-400 hover:bg-emerald-300 text-black px-8 py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              Get Started •
            </button>
          </div>

          {/* Fix: Wrap ref assignment in braces to return void */}
          <div className="flex items-center justify-center gap-3 pt-4 reveal stagger-2" ref={el => { revealRefs.current[2] = el; }}>
             <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl flex items-center gap-2">
                <span className="text-xs font-black text-white italic">BYB<span className="text-emerald-400">I</span>T</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Official partner</span>
             </div>
          </div>
        </div>

        {/* Dynamic Wave SVG */}
        <div className="absolute bottom-0 left-0 w-full opacity-50 pointer-events-none">
          <svg viewBox="0 0 1440 320" className="w-full">
            <path 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="2"
              d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,213.3C672,224,768,192,864,160C960,128,1056,96,1152,106.7C1248,117,1344,171,1392,197.3L1440,224"
              className="path-animate"
            />
          </svg>
        </div>
      </section>

      {/* Identify & Predict Section */}
      <section className="py-32 px-4 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        {/* Fix: Wrap ref assignment in braces to return void */}
        <div className="space-y-8 reveal" ref={el => { revealRefs.current[3] = el; }}>
          <h2 className="text-5xl font-black tracking-tight leading-tight">
            Identify, predict, <br /> and scale <br /> your market edge <br /> with vision AI <br /> 
            <span className="text-gray-500">no manual analysis required</span>
          </h2>
        </div>
        
        <div className="space-y-6">
          {features.map((f, i) => (
            <div 
              key={i} 
              className={`flex items-center gap-6 p-4 hover:bg-white/5 rounded-2xl transition-all group reveal stagger-${(i % 3) + 1}`}
              /* Fix: Wrap ref assignment in braces to return void */
              ref={el => { revealRefs.current[4 + i] = el; }}
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <i className={`fas ${f.icon} text-base`}></i>
              </div>
              <p className="text-gray-400 font-bold text-sm tracking-tight group-hover:text-white transition-colors">{f.text}</p>
            </div>
          ))}
          
          {/* Fix: Wrap ref assignment in braces to return void */}
          <div className="mt-12 glass p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-6 relative overflow-hidden group reveal" ref={el => { revealRefs.current[10] = el; }}>
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 text-4xl shadow-inner">
               <i className="fas fa-microchip"></i>
            </div>
            <p className="text-sm font-bold text-gray-400 max-w-[200px]">Deploy custom neural models and earn from institutional signal sharing</p>
          </div>
        </div>
      </section>

      {/* Intelligence Capabilities Section */}
      <section className="py-32 bg-black/20 text-center">
        {/* Fix: Wrap ref assignment in braces to return void */}
        <h2 className="text-6xl font-black mb-12 reveal" ref={el => { revealRefs.current[11] = el; }}>Intelligence</h2>
        
        <div className="max-w-4xl mx-auto space-y-12 text-left px-4">
          {[
            { num: '01', title: 'Institutional Computer Vision', desc: 'Our computer vision engine scans chart screenshots to identify high-probability setups, volume gaps, and institutional liquidity zones with unmatched precision.' },
            { num: '02', title: 'Live Neural Signal Channels', desc: 'Sync your portfolio with verified AI analysis streams. Get instant notifications for entry, SL, and triple-take-profit targets across all major assets.' },
            { num: '03', title: 'Proprietary Alpha Models', desc: 'Access exclusive AI models trained on decades of market data, optimized for low-latency detection of trend reversals and breakout patterns.' }
          ].map((item, i) => (
            /* Fix: Wrap ref assignment in braces to return void */
            <div key={i} className="flex flex-col md:flex-row gap-8 items-start p-10 glass rounded-[2.5rem] border border-white/5 hover:border-emerald-500/20 transition-all group reveal" ref={el => { revealRefs.current[12 + i] = el; }}>
              <span className="text-4xl font-black text-gray-700 group-hover:text-emerald-500 transition-colors">{item.num}</span>
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-black max-w-xs">{item.title}</h3>
              </div>
              <p className="flex-1 text-gray-500 font-medium text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Performing AI Streams */}
      <section className="py-32 px-4">
        {/* Fix: Wrap ref assignment in braces to return void */}
        <div className="max-w-7xl mx-auto text-center space-y-16 glass p-16 rounded-[3rem] border border-white/5 relative overflow-hidden reveal" ref={el => { revealRefs.current[15] = el; }}>
           <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full"></div>
           
           <div className="space-y-4 relative z-10">
             <h2 className="text-5xl font-black">Top Performing <span className="text-emerald-400">AI Signal Streams</span></h2>
             <p className="text-gray-500 max-w-xl mx-auto font-medium">Follow the most accurate neural models in the ecosystem. Real-time accuracy verified on the public ledger.</p>
           </div>

           <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {[
                { name: 'AlphaVision', pair: 'SOLUSD', pnl: '+$1,450.50', win: '88%', trades: 456, age: '12 Days', rank: '#1' },
                { name: 'NeuralScalp', pair: 'BTCUSD', pnl: '+$932.80', win: '75%', trades: 298, age: '8 Days', rank: '#2' },
                { name: 'TrendLogic', pair: 'ETHUSD', pnl: '+$828.40', win: '71%', trades: 124, age: '15 Days', rank: '#3' }
              ].map((stream, i) => (
                /* Fix: Wrap ref assignment in braces to return void */
                <div key={i} className={`bg-gray-900/40 p-8 rounded-[2rem] border border-gray-800 text-left space-y-6 hover:translate-y-[-8px] transition-all duration-500 group reveal stagger-${i+1}`} ref={el => { revealRefs.current[16 + i] = el; }}>
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                            <i className="fas fa-user-robot text-gray-600 text-2xl"></i>
                         </div>
                         <div>
                            <p className="font-black text-sm">{stream.name}</p>
                            <div className="flex gap-1 mt-1">
                               <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-sm font-black italic">BYBIT</span>
                               <span className="text-[8px] px-1.5 py-0.5 bg-gray-800 text-gray-500 rounded-sm font-bold uppercase tracking-widest">{stream.pair}</span>
                            </div>
                         </div>
                      </div>
                      <span className="text-amber-500 font-black italic tracking-tighter">{stream.rank}</span>
                   </div>

                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Total PNL</p>
                         <p className="text-2xl font-black text-emerald-400">{stream.pnl}</p>
                      </div>
                      <div className="w-16 h-8 bg-emerald-500/5 rounded border border-emerald-500/10">
                         <svg viewBox="0 0 100 40" className="w-full h-full">
                            <path d="M0,35 Q20,30 40,32 T80,10 T100,5" fill="none" stroke="#10b981" strokeWidth="2" />
                         </svg>
                      </div>
                   </div>

                   <button className="w-full py-4 bg-emerald-400 group-hover:bg-emerald-300 text-black rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                      Sync Signals
                   </button>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;