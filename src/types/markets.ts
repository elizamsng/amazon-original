export type AssetCategory =
  | 'indices'
  | 'stocks'
  | 'crypto'
  | 'futures'
  | 'forex'
  | 'bonds';

export type Timeframe = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y' | 'ALL';

export type ChartStyle = 'area' | 'candles';

export interface OhlcPoint {
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketInstrument {
  symbol: string;
  name: string;
  exchange: string;
  category: AssetCategory;
  price: number;
  change: number;
  changePct: number;
  prevClose: number;
  dayLow: number;
  dayHigh: number;
  week52Low: number;
  week52High: number;
  volume: string;
  marketCap?: string;
  peRatio?: string;
  divYield?: string;
  sector?: string;
  unit?: string;
  decimals: number;
  badgeBg: string;
  badgeText: string;
  badgeLabel: string;
  sparkline: number[];
  region?: 'US' | 'World';
}

export interface SectorPerformance {
  name: string;
  changePct: number;
  marketCapWeight: string;
  topMover: string;
  topMoverPct: number;
}

export interface CommunityIdea {
  id: string;
  title: string;
  symbol: string;
  exchange: string;
  category: 'Stocks' | 'Crypto' | 'Forex' | 'Futures';
  direction: 'Long' | 'Short';
  timeframe: string;
  author: string;
  authorBadge?: 'PRO' | 'MOD';
  publishedAt: string;
  summary: string;
  fullThesis: string[];
  entryPrice: string;
  targetPrice: string;
  stopLoss: string;
  boosts: number;
  comments: number;
  editorsPick: boolean;
  chartPreset: 'breakout' | 'wedge' | 'channel' | 'reversal' | 'pullback' | 'flag';
}

export interface MarketNewsItem {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  category: string;
  relatedSymbols: string[];
  summary: string;
  body: string[];
}

export interface EconomicEvent {
  id: string;
  time: string;
  dateLabel: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY';
  event: string;
  impact: 'High' | 'Medium' | 'Low';
  actual: string;
  forecast: string;
  previous: string;
}
