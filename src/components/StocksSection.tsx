import React, { useMemo, useState } from 'react';
import { ArrowDownUp, Search, Star } from 'lucide-react';
import { MarketInstrument } from '../types/markets';
import { SECTOR_PERFORMANCE, formatInstrumentPrice } from '../data/marketsData';
import { Sparkline } from './Sparkline';
import { PriceChangeText, TickerBadge } from './TickerBadge';

interface StocksSectionProps {
  instruments: MarketInstrument[];
  onInspectInstrument: (instrument: MarketInstrument) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
}

type StockFilter = 'all' | 'gainers' | 'losers' | 'active' | 'world';
type SortField = 'symbol' | 'price' | 'changePct' | 'peRatio';

export const StocksSection: React.FC<StocksSectionProps> = ({
  instruments,
  onInspectInstrument,
  watchlist,
  onToggleWatchlist,
}) => {
  const [filter, setFilter] = useState<StockFilter>('all');
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('changePct');
  const [sortAsc, setSortAsc] = useState(false);

  const stocks = useMemo(
    () => instruments.filter((item) => item.category === 'stocks'),
    [instruments]
  );

  const filteredStocks = useMemo(() => {
    let list = [...stocks];

    if (filter === 'gainers') {
      list = list.filter((s) => s.changePct > 0).sort((a, b) => b.changePct - a.changePct);
    } else if (filter === 'losers') {
      list = list.filter((s) => s.changePct < 0).sort((a, b) => a.changePct - b.changePct);
    } else if (filter === 'active') {
      list = list.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
    } else if (filter === 'world') {
      list = list.filter((s) => s.region === 'World');
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          (s.sector?.toLowerCase().includes(q) ?? false)
      );
    }

    if (filter === 'all' || filter === 'world') {
      list.sort((a, b) => {
        let cmp = 0;
        if (sortField === 'symbol') cmp = a.symbol.localeCompare(b.symbol);
        else if (sortField === 'price') cmp = a.price - b.price;
        else if (sortField === 'changePct') cmp = a.changePct - b.changePct;
        else if (sortField === 'peRatio')
          cmp = (parseFloat(a.peRatio || '0') || 0) - (parseFloat(b.peRatio || '0') || 0);
        return sortAsc ? cmp : -cmp;
      });
    }

    return list;
  }, [stocks, filter, query, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const maxSectorAbs = useMemo(
    () => Math.max(...SECTOR_PERFORMANCE.map((s) => Math.abs(s.changePct)), 1.5),
    []
  );

  return (
    <section
      id="stocks-section"
      aria-labelledby="stocks-heading"
      className="py-10 border-t border-[#E0E3EB] dark:border-[#2A2E39]"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
        <div>
          <h2
            id="stocks-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#131722] dark:text-white"
          >
            Stocks &amp; sector movers
          </h2>
          <p className="text-xs text-[#787B86] mt-1">
            Real-time U.S. and global equity screener · Click any row to inspect full chart
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segmented Filter */}
          <div className="flex items-center gap-1 bg-[#F0F3FA] dark:bg-[#1E222D] p-1 rounded-lg overflow-x-auto">
            {(
              [
                { id: 'all', label: 'All Equities' },
                { id: 'gainers', label: 'Top Gainers' },
                { id: 'losers', label: 'Top Losers' },
                { id: 'active', label: 'Most Active' },
                { id: 'world', label: 'World' },
              ] as { id: StockFilter; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-xs font-semibold'
                    : 'text-[#787B86] hover:text-[#131722] dark:hover:text-[#D1D4DC]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Inline Stock Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#787B86] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter ticker or sector..."
              aria-label="Filter stocks by ticker or sector"
              className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#131722] text-[#131722] dark:text-white placeholder:text-[#787B86] focus:outline-none focus:border-[#2962FF] w-44"
            />
          </div>
        </div>
      </div>

      {/* Main Split: 8-col Equity Table + 4-col Sector Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Equity Screener Table */}
        <div className="lg:col-span-8 rounded-lg border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#131722] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E0E3EB] dark:border-[#2A2E39] bg-[#F8FAFD] dark:bg-[#1E222D] text-[11px] font-medium text-[#787B86]">
                  <th className="py-2.5 pl-4 pr-2">
                    <button
                      type="button"
                      onClick={() => handleSort('symbol')}
                      className="inline-flex items-center gap-1 hover:text-[#131722] dark:hover:text-white cursor-pointer"
                    >
                      <span>Ticker</span>
                      <ArrowDownUp className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('price')}
                      className="inline-flex items-center justify-end gap-1 hover:text-[#131722] dark:hover:text-white cursor-pointer"
                    >
                      <span>Price</span>
                      <ArrowDownUp className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('changePct')}
                      className="inline-flex items-center justify-end gap-1 hover:text-[#131722] dark:hover:text-white cursor-pointer"
                    >
                      <span>Change %</span>
                      <ArrowDownUp className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-2 text-right hidden sm:table-cell">Volume</th>
                  <th className="py-2.5 px-2 text-right hidden md:table-cell">Mkt Cap</th>
                  <th className="py-2.5 px-2 text-right hidden xl:table-cell">
                    <button
                      type="button"
                      onClick={() => handleSort('peRatio')}
                      className="inline-flex items-center justify-end gap-1 hover:text-[#131722] dark:hover:text-white cursor-pointer"
                    >
                      <span>P/E</span>
                      <ArrowDownUp className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-2.5 px-2 text-right hidden sm:table-cell">7D Trend</th>
                  <th className="py-2.5 pl-2 pr-3 text-right w-9">
                    <span className="sr-only">Watchlist</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E3EB] dark:divide-[#2A2E39] text-[13px]">
                {filteredStocks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-xs text-[#787B86]">
                      No equities match "{query}". Clear the search filter to view all stocks.
                    </td>
                  </tr>
                ) : (
                  filteredStocks.map((stock) => {
                    const isStarred = watchlist.includes(stock.symbol);
                    return (
                      <tr
                        key={stock.symbol}
                        onClick={() => onInspectInstrument(stock)}
                        className="hover:bg-[#F8FAFD] dark:hover:bg-[#1E222D]/70 transition-colors cursor-pointer group"
                      >
                        <td className="py-2.5 pl-4 pr-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <TickerBadge instrument={stock} size="sm" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors">
                                  {stock.symbol}
                                </span>
                                <span className="text-[11px] text-[#787B86]">
                                  {stock.exchange}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#787B86] truncate max-w-[160px] sm:max-w-[210px]">
                                {stock.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono-tabular font-medium text-[#131722] dark:text-[#D1D4DC]">
                          {formatInstrumentPrice(stock.price, stock.decimals)}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <PriceChangeText
                            change={stock.change}
                            changePct={stock.changePct}
                            decimals={stock.decimals}
                            showAbs={false}
                          />
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono-tabular text-xs text-[#787B86] hidden sm:table-cell">
                          {stock.volume}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono-tabular text-xs text-[#434651] dark:text-[#B2B5BE] hidden md:table-cell">
                          {stock.marketCap}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono-tabular text-xs text-[#787B86] hidden xl:table-cell">
                          {stock.peRatio}
                        </td>
                        <td className="py-2.5 px-2 hidden sm:table-cell">
                          <div className="flex justify-end">
                            <Sparkline
                              data={stock.sparkline}
                              isPositive={stock.changePct >= 0}
                              width={68}
                              height={22}
                            />
                          </div>
                        </td>
                        <td
                          className="py-2.5 pl-2 pr-3 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => onToggleWatchlist(stock.symbol)}
                            aria-label={
                              isStarred
                                ? `Remove ${stock.symbol} from watchlist`
                                : `Add ${stock.symbol} to watchlist`
                            }
                            className={`p-1 rounded hover:bg-[#E0E3EB]/60 dark:hover:bg-[#2A2E39] transition-colors cursor-pointer ${
                              isStarred
                                ? 'text-[#2962FF] dark:text-[#5B9CF6]'
                                : 'text-[#B2B5BE] hover:text-[#434651] dark:hover:text-[#D1D4DC]'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-current' : ''}`} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector Performance Breakdown */}
        <div className="lg:col-span-4 rounded-lg border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#131722] p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
            <h3 className="text-sm font-bold text-[#131722] dark:text-white">
              S&amp;P 500 Sectors
            </h3>
            <span className="text-[11px] text-[#787B86]">1D Performance</span>
          </div>

          <div className="space-y-3">
            {SECTOR_PERFORMANCE.map((sector) => {
              const isPos = sector.changePct >= 0;
              const barPct = Math.min(100, (Math.abs(sector.changePct) / maxSectorAbs) * 100);
              return (
                <div key={sector.name} className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-[#131722] dark:text-[#D1D4DC] truncate">
                      {sector.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0 tabular-nums">
                      <span className="text-[11px] text-[#787B86]">
                        {sector.topMover}
                      </span>
                      <span
                        className={`font-mono-tabular font-semibold ${
                          isPos
                            ? 'text-[#089981] dark:text-[#22AB94]'
                            : 'text-[#F23645] dark:text-[#F7525F]'
                        }`}
                      >
                        {isPos ? '▲ +' : '▼ '}
                        {sector.changePct.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#F0F3FA] dark:bg-[#1E222D] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isPos ? 'bg-[#089981]' : 'bg-[#F23645]'
                      }`}
                      style={{ width: `${Math.max(6, barPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
