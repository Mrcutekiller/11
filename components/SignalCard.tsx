
import React from 'react';
import { TradingSignal } from '../types';

interface SignalCardProps {
  signal: TradingSignal;
}

const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  const isBuy = signal.action === 'BUY';

  return (
    <div className={`glass p-8 rounded-[2.5rem] border ${isBuy ? 'border-emerald-500/10' : 'border-rose-500/10'} space-y-6 hover:translate-y-[-8px] transition-all duration-500 group shadow-2xl relative overflow-hidden flex flex-col h-full`}>
      {/* Dynamic Action Indicator Glow */}
      <div className={`absolute top-0 left-0 w-2 h-full ${isBuy ? 'bg-emerald-500 shadow-[0_0_20px_#10b981]' : 'bg-rose-500 shadow-[0_0_20px_#f43f5e]'}`}></div>
      
      {/* Premium Watermark */}
      <div className={`absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${isBuy ? 'text-emerald-500' : 'text-rose-500'}`}>
        <i className={`fas ${isBuy ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-[120px]`}></i>
      </div>

      {/* Header Info */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 ${isBuy ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'} group-hover:scale-110`}>
            <i className={`fas ${isBuy ? 'fa-arrow-up-long' : 'fa-arrow-down-long'}`}></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">{signal.asset}</h3>
              <span className={`text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg ${isBuy ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'}`}>
                {signal.action}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Neural AI Model X</p>
          </div>
        </div>
        <div className="text-right">
           <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Conf.</p>
           <p className={`text-lg font-black ${isBuy ? 'text-emerald-400' : 'text-rose-400'}`}>{signal.confidence}%</p>
        </div>
      </div>

      {/* Entry and Dual SL Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-white/5 pb-4">
          <div>
             <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Signal Entry</p>
             <p className="text-3xl font-black font-mono text-white tracking-tighter">{signal.entryPrice.toLocaleString()}</p>
          </div>
          <div className="text-right space-y-1">
             <div>
                <p className="text-[9px] text-rose-500 font-black uppercase tracking-widest leading-none">Aggressive SL</p>
                <p className="text-base font-black font-mono text-rose-400">{signal.stopLossAggressive?.toLocaleString()}</p>
             </div>
             <div>
                <p className="text-[9px] text-rose-700 font-black uppercase tracking-widest leading-none">Structural SL</p>
                <p className="text-sm font-bold font-mono text-rose-600 opacity-60">{signal.stopLoss.toLocaleString()}</p>
             </div>
          </div>
        </div>

        {/* TP Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'TP 1', val: signal.takeProfit1, color: isBuy ? 'emerald' : 'rose' },
            { label: 'TP 2', val: signal.takeProfit2, color: isBuy ? 'emerald' : 'rose' },
            { label: 'TP 3', val: signal.takeProfit3, color: 'blue' }
          ].map((tp, i) => (
            <div key={i} className={`bg-black/40 border border-white/5 rounded-2xl p-4 text-center group-hover:border-${tp.color}-500/20 transition-all`}>
              <p className="text-[9px] text-gray-600 font-black uppercase mb-1 tracking-widest">{tp.label}</p>
              <p className={`text-sm font-black font-mono text-${tp.color}-400`}>{tp.val.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rationale Section */}
      <div className="flex-1 bg-black/60 p-5 rounded-[2rem] border border-white/5 space-y-3">
        <div className="flex items-center gap-2">
           <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isBuy ? 'bg-emerald-400' : 'bg-rose-500'}`}></div>
           <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Logic Stream</p>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed font-medium line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
          {signal.rationale}
        </p>
      </div>

      {/* Footer Metrics */}
      <div className="flex items-center justify-between pt-2">
         <div className="flex gap-6">
            <div>
               <p className="text-[9px] text-gray-600 font-black uppercase mb-0.5">Yield</p>
               <p className={`text-sm font-black font-mono ${isBuy ? 'text-emerald-400' : 'text-rose-400'}`}>{signal.pnl || '+$1,450'}</p>
            </div>
            <div>
               <p className="text-[9px] text-gray-600 font-black uppercase mb-0.5">Model Score</p>
               <p className="text-sm font-black text-blue-400 font-mono">{signal.winRate || 92}%</p>
            </div>
         </div>
         <button className={`w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg ${isBuy ? 'bg-emerald-400 text-black' : 'bg-rose-500 text-white'}`}>
            <i className="fas fa-play text-xs"></i>
         </button>
      </div>
    </div>
  );
};

export default SignalCard;
