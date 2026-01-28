
export enum PlanType {
  FREE = 'Starter',
  PRO = 'Advanced',
  ELITE = 'Institutional'
}

export type ActionType = 'BUY' | 'SELL';

export interface TradingSignal {
  id: string;
  asset: string;
  action: ActionType;
  entryPrice: number;
  stopLoss: number;
  stopLossAggressive?: number; // Added for the dual-SL feature
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  timestamp: number;
  rationale: string;
  confidence: number;
  winRate?: number;
  pnl?: string;
  author?: string;
  age?: string;
  timeframe?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  tradesCount: number;
  profit: number;
}

export interface AnalyzerResult {
  summary: string;
  trend: string;
  keyLevels: string[];
  suggestedSignal: {
    asset: string;
    action: ActionType;
    entry: number;
    sl: number;
    slAggressive: number; // Added for the dual-SL feature
    tp1: number;
    tp2: number;
    tp3: number;
    confidence: number;
  } | null;
}

export interface MarketSentiment {
  asset: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  score: number;
  description: string;
}

export interface UserSubscription {
  plan: PlanType;
  expiresAt?: number;
}

export interface BacktestTrade {
  date: string;
  type: ActionType;
  entry: number;
  exit: number;
  profit: number;
}

export interface BacktestResult {
  strategyName: string;
  asset: string;
  timeframe: string;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  totalTrades: number;
  netProfit: number;
  summary: string;
  trades: BacktestTrade[];
}
