import React, { useEffect, useMemo, useState } from 'react';
import { Rocket, Search, Star, Trash2, X } from 'lucide-react';
import {
  ChartStyle,
  CommunityIdea,
  MarketInstrument,
  MarketNewsItem,
  Timeframe,
} from '../types/markets';
import { formatInstrumentPrice } from '../data/marketsData';
import { InteractiveMarketChart } from './InteractiveMarketChart';
import { IdeaChartThumbnail } from './CommunityIdeasSection';
import { PriceChangeText, TickerBadge } from './TickerBadge';

/* -------------------------------------------------------------------------- */
/* 1. Symbol Superchart Modal                                                 */
/* -------------------------------------------------------------------------- */
interface SymbolChartModalProps {
  instrument: MarketInstrument | null;
  onClose: () => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
}

export const SymbolChartModal: React.FC<SymbolChartModalProps> = ({
  instrument,
  onClose,
  watchlist,
  onToggleWatchlist,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('candles');

  if (!instrument) return null;
  const isStarred = watchlist.includes(instrument.symbol);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${instrument.name} interactive chart`}
    >
      <div
        className="w-full max-w-5xl rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#131722] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="px-5 py-4 border-b border-[#E0E3EB] dark:border-[#2A2E39] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TickerBadge instrument={instrument} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#131722] dark:text-white">
                  {instrument.name}
                </h2>
                <span className="text-xs font-mono text-[#787B86]">
                  {instrument.exchange}:{instrument.symbol}
                </span>
              </div>
              <div className="flex items-baseline gap-3 mt-0.5">
                <span className="text-xl font-bold font-mono-tabular text-[#131722] dark:text-white">
                  {formatInstrumentPrice(instrument.price, instrument.decimals, instrument.unit)}
                </span>
                <PriceChangeText
                  change={instrument.change}
                  changePct={instrument.changePct}
                  decimals={instrument.decimals}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleWatchlist(instrument.symbol)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                isStarred
                  ? 'bg-[#2962FF]/10 border-[#2962FF]/40 text-[#2962FF] dark:text-[#5B9CF6]'
                  : 'border-[#E0E3EB] dark:border-[#2A2E39] text-[#434651] dark:text-[#D1D4DC] hover:border-[#2962FF]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-current' : ''}`} />
              <span>{isStarred ? 'Watching' : 'Add to Watchlist'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chart modal"
              className="p-2 rounded-md text-[#787B86] hover:text-[#131722] dark:hover:text-white hover:bg-[#F0F3FA] dark:hover:bg-[#1E222D] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chart Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          <InteractiveMarketChart
            instrument={instrument}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            chartStyle={chartStyle}
            onChartStyleChange={setChartStyle}
            height={360}
            compactHeader
          />

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-4 border-t border-[#E0E3EB] dark:border-[#2A2E39] text-xs">
            <div>
              <div className="text-[#787B86]">Prev Close</div>
              <div className="font-mono-tabular font-semibold text-[#131722] dark:text-white mt-0.5">
                {formatInstrumentPrice(instrument.prevClose, instrument.decimals, instrument.unit)}
              </div>
            </div>
            <div>
              <div className="text-[#787B86]">Day Range</div>
              <div className="font-mono-tabular font-semibold text-[#131722] dark:text-white mt-0.5">
                {formatInstrumentPrice(instrument.dayLow, instrument.decimals)} –{' '}
                {formatInstrumentPrice(instrument.dayHigh, instrument.decimals)}
              </div>
            </div>
            <div>
              <div className="text-[#787B86]">52W Range</div>
              <div className="font-mono-tabular font-semibold text-[#131722] dark:text-white mt-0.5">
                {formatInstrumentPrice(instrument.week52Low, instrument.decimals)} –{' '}
                {formatInstrumentPrice(instrument.week52High, instrument.decimals)}
              </div>
            </div>
            <div>
              <div className="text-[#787B86]">Volume</div>
              <div className="font-mono-tabular font-semibold text-[#131722] dark:text-white mt-0.5">
                {instrument.volume}
              </div>
            </div>
            {instrument.marketCap && (
              <div>
                <div className="text-[#787B86]">Market Cap</div>
                <div className="font-mono-tabular font-semibold text-[#131722] dark:text-white mt-0.5">
                  {instrument.marketCap}
                </div>
              </div>
            )}
            {instrument.peRatio && (
              <div>
                <div className="text-[#787B86]">P/E Ratio</div>
                <div className="font-mono-tabular font-semibold text-[#131722] dark:text-white mt-0.5">
                  {instrument.peRatio}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. Community Idea Detail Modal                                             */
/* -------------------------------------------------------------------------- */
interface IdeaDetailModalProps {
  idea: CommunityIdea | null;
  onClose: () => void;
  isBoosted: boolean;
  onToggleBoost: (id: string) => void;
  onOpenTicker: (symbol: string) => void;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  idea,
  onClose,
  isBoosted,
  onToggleBoost,
  onOpenTicker,
}) => {
  if (!idea) return null;
  const boostTotal = idea.boosts + (isBoosted ? 1 : 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={idea.title}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#131722] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[#E0E3EB] dark:border-[#2A2E39] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#787B86]">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTicker(idea.symbol);
              }}
              className="font-mono font-semibold text-[#2962FF] dark:text-[#5B9CF6] hover:underline cursor-pointer"
            >
              {idea.exchange}:{idea.symbol}
            </button>
            <span aria-hidden="true">·</span>
            <span>{idea.timeframe}</span>
            <span aria-hidden="true">·</span>
            <span
              className={
                idea.direction === 'Long'
                  ? 'text-[#089981] font-semibold'
                  : 'text-[#F23645] font-semibold'
              }
            >
              {idea.direction} Idea
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close idea modal"
            className="p-1.5 rounded-md text-[#787B86] hover:text-[#131722] dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <h2 className="text-xl font-bold text-[#131722] dark:text-white leading-snug">
            {idea.title}
          </h2>

          <div className="text-xs text-[#787B86]">
            By <span className="font-semibold text-[#131722] dark:text-[#D1D4DC]">{idea.author}</span> ·{' '}
            {idea.publishedAt}
          </div>

          <IdeaChartThumbnail
            preset={idea.chartPreset}
            direction={idea.direction}
            symbol={idea.symbol}
          />

          {/* Trade Setup Levels */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-lg bg-[#F8FAFD] dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39] text-xs">
            <div>
              <div className="text-[#787B86]">Entry Zone</div>
              <div className="font-mono-tabular font-semibold text-[#131722] dark:text-white mt-0.5">
                {idea.entryPrice}
              </div>
            </div>
            <div>
              <div className="text-[#787B86]">Target</div>
              <div className="font-mono-tabular font-semibold text-[#089981] dark:text-[#22AB94] mt-0.5">
                {idea.targetPrice}
              </div>
            </div>
            <div>
              <div className="text-[#787B86]">Invalidation / Stop</div>
              <div className="font-mono-tabular font-semibold text-[#F23645] dark:text-[#F7525F] mt-0.5">
                {idea.stopLoss}
              </div>
            </div>
          </div>

          <div className="space-y-2.5 text-sm text-[#434651] dark:text-[#B2B5BE] leading-relaxed">
            {idea.fullThesis.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-[#E0E3EB] dark:border-[#2A2E39] flex items-center justify-between">
          <button
            type="button"
            onClick={() => onToggleBoost(idea.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              isBoosted
                ? 'bg-[#2962FF] text-white'
                : 'bg-[#F0F3FA] dark:bg-[#1E222D] text-[#131722] dark:text-white hover:bg-[#2962FF]/15 hover:text-[#2962FF]'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>{isBoosted ? 'Boosted' : 'Boost idea'}</span>
            <span className="font-mono-tabular">({boostTotal})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenTicker(idea.symbol);
            }}
            className="text-xs font-semibold text-[#2962FF] dark:text-[#5B9CF6] hover:underline cursor-pointer"
          >
            Inspect {idea.symbol} chart →
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. News Reader Modal                                                       */
/* -------------------------------------------------------------------------- */
interface NewsReaderModalProps {
  news: MarketNewsItem | null;
  onClose: () => void;
  onOpenTicker: (symbol: string) => void;
}

export const NewsReaderModal: React.FC<NewsReaderModalProps> = ({
  news,
  onClose,
  onOpenTicker,
}) => {
  if (!news) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={news.title}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#131722] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[#E0E3EB] dark:border-[#2A2E39] flex items-center justify-between">
          <div className="text-xs text-[#787B86]">
            <span className="font-semibold text-[#131722] dark:text-[#D1D4DC]">{news.source}</span> ·{' '}
            {news.publishedAt} · {news.category}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close news story"
            className="p-1.5 rounded-md text-[#787B86] hover:text-[#131722] dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <h2 className="text-xl font-bold text-[#131722] dark:text-white leading-snug">
            {news.title}
          </h2>
          <p className="text-sm font-medium text-[#434651] dark:text-[#D1D4DC]">
            {news.summary}
          </p>
          <div className="space-y-3 text-sm text-[#434651] dark:text-[#B2B5BE] leading-relaxed">
            {news.body.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E0E3EB] dark:border-[#2A2E39] flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#787B86]">Related symbols:</span>
            {news.relatedSymbols.map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTicker(sym);
                }}
                className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-[#F0F3FA] dark:bg-[#1E222D] text-[#2962FF] dark:text-[#5B9CF6] hover:bg-[#2962FF]/15 transition-colors cursor-pointer"
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. Watchlist Slide-Over Drawer                                             */
/* -------------------------------------------------------------------------- */
interface WatchlistDrawerProps {
  open: boolean;
  onClose: () => void;
  instruments: MarketInstrument[];
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onInspectInstrument: (instrument: MarketInstrument) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  open,
  onClose,
  instruments,
  watchlist,
  onToggleWatchlist,
  onInspectInstrument,
}) => {
  if (!open) return null;

  const watchedItems = instruments.filter((item) => watchlist.includes(item.symbol));

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Personal Watchlist"
    >
      <aside
        className="w-full max-w-sm h-full bg-white dark:bg-[#131722] border-l border-[#E0E3EB] dark:border-[#2A2E39] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[#E0E3EB] dark:border-[#2A2E39] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#131722] dark:text-white">
              Watchlist
            </h2>
            <p className="text-xs text-[#787B86]">{watchedItems.length} tracked symbols</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close watchlist"
            className="p-1.5 rounded-md text-[#787B86] hover:text-[#131722] dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {watchedItems.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Star className="w-8 h-8 text-[#B2B5BE] mx-auto" />
              <p className="text-sm font-medium text-[#131722] dark:text-white">
                Your watchlist is empty
              </p>
              <p className="text-xs text-[#787B86] max-w-[220px] mx-auto">
                Click the star icon next to any index, stock, crypto, or currency pair to track it here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E0E3EB] dark:divide-[#2A2E39]">
              {watchedItems.map((item) => (
                <div
                  key={item.symbol}
                  onClick={() => {
                    onClose();
                    onInspectInstrument(item);
                  }}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-[#F8FAFD] dark:hover:bg-[#1E222D] -mx-2 px-2 rounded cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <TickerBadge instrument={item} size="sm" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[#131722] dark:text-white group-hover:text-[#2962FF]">
                        {item.symbol}
                      </div>
                      <div className="text-[11px] text-[#787B86] truncate">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-right">
                      <div className="text-[13px] font-mono-tabular font-semibold text-[#131722] dark:text-white">
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(item.symbol);
                      }}
                      aria-label={`Remove ${item.symbol} from watchlist`}
                      className="p-1 text-[#787B86] hover:text-[#F23645] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. Symbol Search Command Modal (⌘K)                                        */
/* -------------------------------------------------------------------------- */
interface SearchPaletteModalProps {
  open: boolean;
  onClose: () => void;
  instruments: MarketInstrument[];
  onSelectInstrument: (instrument: MarketInstrument) => void;
}

export const SearchPaletteModal: React.FC<SearchPaletteModalProps> = ({
  open,
  onClose,
  instruments,
  onSelectInstrument,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return instruments.slice(0, 12);
    return instruments.filter(
      (item) =>
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.exchange.toLowerCase().includes(q)
    );
  }, [instruments, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/55 backdrop-blur-xs p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Symbol search"
    >
      <div
        className="w-full max-w-lg rounded-xl border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#131722] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
          <Search className="w-4 h-4 text-[#787B86] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, crypto, futures, or bond..."
            className="w-full bg-transparent text-sm text-[#131722] dark:text-white placeholder:text-[#787B86] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1 text-[#787B86] hover:text-[#131722] dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-[#E0E3EB] dark:divide-[#2A2E39]">
          {matches.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#787B86]">
              No matching market symbols found for "{query}"
            </div>
          ) : (
            matches.map((item) => (
              <button
                key={item.symbol}
                type="button"
                onClick={() => {
                  onClose();
                  onSelectInstrument(item);
                }}
                className="w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFD] dark:hover:bg-[#1E222D] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <TickerBadge instrument={item} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#131722] dark:text-white">
                        {item.symbol}
                      </span>
                      <span className="text-[11px] text-[#787B86] uppercase">
                        {item.category} · {item.exchange}
                      </span>
                    </div>
                    <div className="text-xs text-[#787B86] truncate">{item.name}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[13px] font-mono-tabular font-semibold text-[#131722] dark:text-white">
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
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
