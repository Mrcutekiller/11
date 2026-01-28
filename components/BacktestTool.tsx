
import React, { useState } from 'react';
import { runBacktest } from '../services/geminiService';
import { BacktestResult } from '../types';

const BacktestTool: React.FC = () => {
  const [strategy, setStrategy] = useState('RSI Overbought/Oversold with Trend Confirmation');
  const [asset, setAsset] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState('1H');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const handleRunTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await runBacktest(strategy, asset, timeframe);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass p-8 rounded-2xl border border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
            <i className="fas fa-flask"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold">Strategy Backtester</h2>
            <p className="text-sm text-gray-500">Validate your theories against historical market data.</p>
          </div>
        </div>

        <form onSubmit={handleRunTest} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Strategy Definition</label>
            <input 
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all"
              placeholder="E.g. MACD crossover on the 4H timeframe..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Asset</label>
            <input 
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500/50 outline-none transition-all"
              placeholder="BTC/USDT"
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-play"></i>}
              {loading ? 'Processing History...' : 'Run Simulation'}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-6 rounded-2xl border border-gray-800 flex flex-col justify-center items-center text-center">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total Win Rate</p>
              <p className="text-5xl font-black text-emerald-400 font-mono">{(result.winRate * 100).toFixed(1)}%</p>
              <div className="mt-4 w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${result.winRate * 100}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-xl border border-gray-800 text-center">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Profit Factor</p>
                <p className="text-xl font-bold text-blue-400 font-mono">{result.profitFactor}</p>
              </div>
              <div className="glass p-4 rounded-xl border border-gray-800 text-center">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Max Drawdown</p>
                <p className="text-xl font-bold text-rose-400 font-mono">{result.maxDrawdown}%</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-6 rounded-2xl border border-gray-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-file-invoice text-emerald-400"></i>
                Performance Summary
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-mono">
                {result.summary}
              </p>
            </div>

            <div className="glass rounded-2xl border border-gray-800 overflow-hidden">
               <div className="bg-gray-800/50 px-6 py-3 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="text-sm font-bold">Sample Trade History</h3>
                  <span className="text-xs text-gray-500">{result.totalTrades} Total Trades</span>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-gray-500 text-[10px] uppercase font-bold">
                      <tr className="border-b border-gray-800">
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Side</th>
                        <th className="px-6 py-4">Entry</th>
                        <th className="px-6 py-4">Exit</th>
                        <th className="px-6 py-4">Profit %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {result.trades.map((trade, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs">{trade.date}</td>
                          <td className={`px-6 py-4 font-bold text-xs ${trade.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>{trade.type}</td>
                          <td className="px-6 py-4 font-mono text-xs">{trade.entry}</td>
                          <td className="px-6 py-4 font-mono text-xs">{trade.exit}</td>
                          <td className={`px-6 py-4 font-mono text-xs font-bold ${trade.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {trade.profit > 0 ? '+' : ''}{trade.profit}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BacktestTool;
