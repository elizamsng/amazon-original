import React, { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { AssetCategory, ChartStyle, MarketInstrument, Timeframe } from '../types/markets';
import { formatInstrumentPrice } from '../data/marketsData';
import { InteractiveMarketChart } from './InteractiveMarketChart';
import { Sparkline } from './Sparkline';
import { PriceChangeText, TickerBadge } from './TickerBadge';

interface MarketSummarySectionProps {
  instruments: MarketInstrument[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  onOpenFullChart: (instrument: MarketInstrument) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
}

const SUMMARY_TABS: { id: AssetCategory; label: string }[] = [
  { id: 'indices', label: 'Indices' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'futures', label: 'Futures' },
  { id: 'forex', label: 'Forex' },
  { id: 'bonds', label: 'Bonds' },
];

export const MarketSummarySection: React.FC<MarketSummarySectionProps> = ({
  instruments,
  selectedSymbol,
  onSelectSymbol,
  onOpenFullChart,
  watchlist,
  onToggleWatchlist,
}) => {
  const [summaryCategory, setSummaryCategory] = useState<AssetCategory>('indices');
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('area');

  const categoryCards = useMemo(() => {
    return instruments.filter((item) => item.category === summaryCategory).slice(0, 5);
  }, [instruments, summaryCategory]);

  const activeInstrument = useMemo(() => {
    const found = instruments.find((item) => item.symbol === selectedSymbol);
    if (found && found.category === summaryCategory) return found;
    return categoryCards[0] ?? instruments[0];
  }, [instruments, selectedSymbol, summaryCategory, categoryCards]);

  const handleCategorySwitch = (cat: AssetCategory) => {
    setSummaryCategory(cat);
    const first = instruments.find((item) => item.category === cat);
    if (first) onSelectSymbol(first.symbol);
  };

  const isStarred = watchlist.includes(activeInstrument.symbol);

  return (
    <section aria-labelledby="market-summary-heading" className="pt-6 pb-10">
      {/* Section Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#787B86] mb-1.5">
            <span>Markets</span>
            <span aria-hidden="true">/</span>
            <span>Global Overview</span>
          </div>
          <h1
            id="market-summary-heading"
            className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#131722] dark:text-white"
          >
            Market summary
          </h1>
        </div>

        {/* Asset Class Tabs */}
        <div className="flex items-center gap-1 bg-[#F0F3FA] dark:bg-[#1E222D] p-1 rounded-lg overflow-x-auto">
          {SUMMARY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleCategorySwitch(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                summaryCategory === tab.id
                  ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-xs font-semibold'
                  : 'text-[#787B86] hover:text-[#131722] dark:hover:text-[#D1D4DC]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Benchmark Ticker Strip (5 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        {categoryCards.map((item) => {
          const isActive = item.symbol === activeInstrument.symbol;
          const isPositive = item.changePct >= 0;
          return (
            <button
              key={item.symbol}
              type="button"
              onClick={() => onSelectSymbol(item.symbol)}
              className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                isActive
                  ? 'bg-[#F0F3FA] dark:bg-[#1E222D] border-[#2962FF] ring-1 ring-[#2962FF]/20'
                  : 'bg-white dark:bg-[#131722] border-[#E0E3EB] dark:border-[#2A2E39] hover:border-[#B2B5BE] dark:hover:border-[#434651]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <TickerBadge instrument={item} size="sm" />
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[#131722] dark:text-white truncate">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[#787B86] font-mono">
                      {item.symbol} · {item.exchange}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between gap-2">
                <div>
                  <div className="text-[15px] font-semibold font-mono-tabular text-[#131722] dark:text-white">
                    {formatInstrumentPrice(item.price, item.decimals, item.unit)}
                  </div>
                  <PriceChangeText
                    change={item.change}
                    changePct={item.changePct}
                    decimals={item.decimals}
                    showAbs={false}
                    compact
                  />
                </div>
                <Sparkline data={item.sparkline} isPositive={isPositive} width={72} height={26} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chart Container */}
      <div className="rounded-lg border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#131722] p-4 sm:p-5">
        {/* Selected Instrument Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
          <div className="flex items-center gap-3">
            <TickerBadge instrument={activeInstrument} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#131722] dark:text-white">
                  {activeInstrument.name}
                </h2>
                <span className="text-xs font-mono text-[#787B86]">
                  {activeInstrument.exchange}:{activeInstrument.symbol}
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-3 mt-0.5">
                <span className="text-2xl font-bold font-mono-tabular text-[#131722] dark:text-white">
                  {formatInstrumentPrice(
                    activeInstrument.price,
                    activeInstrument.decimals,
                    activeInstrument.unit
                  )}
                </span>
                <PriceChangeText
                  change={activeInstrument.change}
                  changePct={activeInstrument.changePct}
                  decimals={activeInstrument.decimals}
                />
                {activeInstrument.unit && activeInstrument.unit !== '%' && (
                  <span className="text-xs text-[#787B86]">{activeInstrument.unit}</span>
                )}
              </div>
            </div>
          </div>

          {/* Key Benchmark Metrics & Watchlist */}
          <div className="flex flex-wrap items-center gap-5">
            <div className="hidden xl:flex items-center gap-5 text-xs tabular-nums">
              <div>
                <div className="text-[#787B86]">Prev Close</div>
                <div className="font-mono-tabular font-semibold text-[#131722] dark:text-[#D1D4DC]">
                  {formatInstrumentPrice(
                    activeInstrument.prevClose,
                    activeInstrument.decimals,
                    activeInstrument.unit
                  )}
                </div>
              </div>
              <div>
                <div className="text-[#787B86]">Day Range</div>
                <div className="font-mono-tabular font-semibold text-[#131722] dark:text-[#D1D4DC]">
                  {formatInstrumentPrice(activeInstrument.dayLow, activeInstrument.decimals)} –{' '}
                  {formatInstrumentPrice(activeInstrument.dayHigh, activeInstrument.decimals)}
                </div>
              </div>
              <div>
                <div className="text-[#787B86]">52W Range</div>
                <div className="font-mono-tabular font-semibold text-[#131722] dark:text-[#D1D4DC]">
                  {formatInstrumentPrice(activeInstrument.week52Low, activeInstrument.decimals)} –{' '}
                  {formatInstrumentPrice(activeInstrument.week52High, activeInstrument.decimals)}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggleWatchlist(activeInstrument.symbol)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isStarred
                  ? 'bg-[#2962FF]/10 border-[#2962FF]/40 text-[#2962FF] dark:text-[#5B9CF6]'
                  : 'bg-white dark:bg-[#1E222D] border-[#E0E3EB] dark:border-[#2A2E39] text-[#434651] dark:text-[#D1D4DC] hover:border-[#2962FF]/50'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${isStarred ? 'fill-current' : ''}`}
              />
              <span>{isStarred ? 'In Watchlist' : 'Watch'}</span>
            </button>
          </div>
        </div>

        <InteractiveMarketChart
          instrument={activeInstrument}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          chartStyle={chartStyle}
          onChartStyleChange={setChartStyle}
          onOpenFullChart={() => onOpenFullChart(activeInstrument)}
        />
      </div>
    </section>
  );
};
