
import { GoogleGenAI, Type } from "@google/genai";
import { TradingSignal, MarketSentiment, BacktestResult, AnalyzerResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateMarketSignal = async (asset: string, analysisContext?: string): Promise<TradingSignal> => {
  const prompt = `Act as an institutional AI Trading Bot. Generate an INSTANT high-precision signal for ${asset}. 
    ${analysisContext ? `Context: ${analysisContext}` : ''}
    
    CRITICAL RISK MANAGEMENT RULES:
    1. Provide TWO Stop Loss levels:
       - Stop Loss (Institutional/Real): The safe structural level where the trade is invalidated.
       - Stop Loss Aggressive (Tight): A smaller, optimized SL for lower timeframes (like 30m or 15m) that protects capital but stays outside immediate noise.
    2. Scaled Take Profits:
       - TP1: Conservative (1:1.5 RR)
       - TP2: Structural (1:3 RR)
       - TP3: Moon/Extension (1:5+ RR)
    3. If the trend is unclear, prioritize preservation of capital.
    
    Response must be extremely fast and precise.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          asset: { type: Type.STRING },
          action: { type: Type.STRING, enum: ['BUY', 'SELL'] },
          entryPrice: { type: Type.NUMBER },
          stopLoss: { type: Type.NUMBER },
          stopLossAggressive: { type: Type.NUMBER },
          takeProfit1: { type: Type.NUMBER },
          takeProfit2: { type: Type.NUMBER },
          takeProfit3: { type: Type.NUMBER },
          rationale: { type: Type.STRING },
          confidence: { type: Type.NUMBER }
        },
        required: ['asset', 'action', 'entryPrice', 'stopLoss', 'stopLossAggressive', 'takeProfit1', 'takeProfit2', 'takeProfit3', 'rationale', 'confidence']
      }
    }
  });

  const data = JSON.parse(response.text);
  return {
    ...data,
    id: `SIG-${Math.random().toString(36).substring(7).toUpperCase()}`,
    timestamp: Date.now()
  };
};

export const analyzeChartImage = async (base64Image: string): Promise<AnalyzerResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/png', data: base64Image } },
        { text: "Analyze this chart. Identify institutional liquidity and trend. Provide a signal with TWO Stop Losses: 1. Aggressive (Tight) 2. Real (Structural). If the chart looks like a lower timeframe (e.g. 30min), make the SLs significantly tighter but logically placed." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          trend: { type: Type.STRING },
          keyLevels: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedSignal: {
            type: Type.OBJECT,
            properties: {
              asset: { type: Type.STRING },
              action: { type: Type.STRING, enum: ['BUY', 'SELL'] },
              entry: { type: Type.NUMBER },
              sl: { type: Type.NUMBER },
              slAggressive: { type: Type.NUMBER },
              tp1: { type: Type.NUMBER },
              tp2: { type: Type.NUMBER },
              tp3: { type: Type.NUMBER },
              confidence: { type: Type.NUMBER }
            },
            required: ['asset', 'action', 'entry', 'sl', 'slAggressive', 'tp1', 'tp2', 'tp3', 'confidence']
          }
        },
        required: ['summary', 'trend', 'keyLevels']
      }
    }
  });
  
  return JSON.parse(response.text);
};

export const runBacktest = async (strategy: string, asset: string, timeframe: string): Promise<BacktestResult> => {
  const prompt = `Simulate a technical backtest for: "${strategy}" on "${asset}" (${timeframe}). Provide metrics and a summary.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strategyName: { type: Type.STRING },
          asset: { type: Type.STRING },
          timeframe: { type: Type.STRING },
          winRate: { type: Type.NUMBER },
          profitFactor: { type: Type.NUMBER },
          maxDrawdown: { type: Type.NUMBER },
          totalTrades: { type: Type.NUMBER },
          netProfit: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          trades: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['BUY', 'SELL'] },
                entry: { type: Type.NUMBER },
                exit: { type: Type.NUMBER },
                profit: { type: Type.NUMBER }
              },
              required: ['date', 'type', 'entry', 'exit', 'profit']
            }
          }
        },
        required: ['strategyName', 'asset', 'timeframe', 'winRate', 'profitFactor', 'maxDrawdown', 'totalTrades', 'netProfit', 'summary', 'trades']
      }
    }
  });

  return JSON.parse(response.text);
};

export const getMarketSentiment = async (query: string): Promise<MarketSentiment> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze market sentiment for ${query}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          asset: { type: Type.STRING },
          sentiment: { type: Type.STRING, enum: ['BULLISH', 'BEARISH', 'NEUTRAL'] },
          score: { type: Type.NUMBER },
          description: { type: Type.STRING }
        },
        required: ['asset', 'sentiment', 'score', 'description']
      }
    }
  });
  return JSON.parse(response.text);
};
