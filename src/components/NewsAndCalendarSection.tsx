import React, { useMemo, useState } from 'react';
import { Calendar, Newspaper } from 'lucide-react';
import { ECONOMIC_EVENTS, MARKET_NEWS } from '../data/marketsData';
import { MarketNewsItem } from '../types/markets';

interface NewsAndCalendarSectionProps {
  onSelectNews: (news: MarketNewsItem) => void;
  onSelectSymbolByTicker: (symbol: string) => void;
}

export const NewsAndCalendarSection: React.FC<NewsAndCalendarSectionProps> = ({
  onSelectNews,
  onSelectSymbolByTicker,
}) => {
  const [impactFilter, setImpactFilter] = useState<'all' | 'High'>('all');

  const events = useMemo(() => {
    if (impactFilter === 'High') {
      return ECONOMIC_EVENTS.filter((e) => e.impact === 'High');
    }
    return ECONOMIC_EVENTS;
  }, [impactFilter]);

  return (
    <section
      id="calendar-section"
      aria-label="Market news and economic calendar"
      className="py-10 border-t border-[#E0E3EB] dark:border-[#2A2E39]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Market News (5 cols) */}
        <div className="lg:col-span-5 rounded-lg border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#131722] p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
            <h2 className="text-lg font-bold text-[#131722] dark:text-white flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-[#2962FF]" />
              <span>Market news</span>
            </h2>
            <span className="text-xs text-[#787B86]">Latest headlines</span>
          </div>

          <div className="divide-y divide-[#E0E3EB] dark:divide-[#2A2E39]">
            {MARKET_NEWS.map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectNews(item)}
                className="py-3.5 first:pt-1 last:pb-1 cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-[11px] text-[#787B86] mb-1">
                  <span className="font-semibold text-[#434651] dark:text-[#B2B5BE]">
                    {item.source}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{item.publishedAt}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.category}</span>
                </div>
                <h3 className="text-sm font-semibold leading-snug text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#787B86] mt-1 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
                <div
                  className="flex flex-wrap items-center gap-2 mt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.relatedSymbols.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => onSelectSymbolByTicker(sym)}
                      className="text-[11px] font-mono font-semibold text-[#2962FF] dark:text-[#5B9CF6] hover:underline cursor-pointer"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Economic Calendar (7 cols) */}
        <div className="lg:col-span-7 rounded-lg border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#131722] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
            <h2 className="text-lg font-bold text-[#131722] dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2962FF]" />
              <span>Economic calendar</span>
            </h2>

            <div className="flex items-center gap-1 bg-[#F0F3FA] dark:bg-[#1E222D] p-1 rounded-md">
              <button
                type="button"
                onClick={() => setImpactFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  impactFilter === 'all'
                    ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-xs font-semibold'
                    : 'text-[#787B86] hover:text-[#131722] dark:hover:text-[#D1D4DC]'
                }`}
              >
                All Events
              </button>
              <button
                type="button"
                onClick={() => setImpactFilter('High')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  impactFilter === 'High'
                    ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-xs font-semibold'
                    : 'text-[#787B86] hover:text-[#131722] dark:hover:text-[#D1D4DC]'
                }`}
              >
                High Impact
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E0E3EB] dark:border-[#2A2E39] text-[11px] font-medium text-[#787B86]">
                  <th className="py-2 pr-3">Time</th>
                  <th className="py-2 px-2">Ccy</th>
                  <th className="py-2 px-2">Event</th>
                  <th className="py-2 px-2 text-center">Impact</th>
                  <th className="py-2 px-2 text-right">Actual</th>
                  <th className="py-2 px-2 text-right">Forecast</th>
                  <th className="py-2 pl-2 text-right">Prior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E3EB] dark:divide-[#2A2E39] text-xs">
                {events.map((ev) => (
                  <tr
                    key={ev.id}
                    className="hover:bg-[#F8FAFD] dark:hover:bg-[#1E222D]/60 transition-colors"
                  >
                    <td className="py-2.5 pr-3 whitespace-nowrap tabular-nums">
                      <span className="font-mono text-[#131722] dark:text-[#D1D4DC]">
                        {ev.time}
                      </span>{' '}
                      <span className="text-[11px] text-[#787B86]">{ev.dateLabel}</span>
                    </td>
                    <td className="py-2.5 px-2 font-mono font-semibold text-[#131722] dark:text-white">
                      {ev.currency}
                    </td>
                    <td className="py-2.5 px-2 font-medium text-[#131722] dark:text-[#D1D4DC]">
                      {ev.event}
                    </td>
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      <span
                        className={`text-[11px] font-medium ${
                          ev.impact === 'High'
                            ? 'text-[#F23645] dark:text-[#F7525F]'
                            : ev.impact === 'Medium'
                            ? 'text-[#D97706] dark:text-[#F59E0B]'
                            : 'text-[#787B86]'
                        }`}
                      >
                        {ev.impact}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono-tabular font-semibold text-[#131722] dark:text-white">
                      {ev.actual}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono-tabular text-[#787B86]">
                      {ev.forecast}
                    </td>
                    <td className="py-2.5 pl-2 text-right font-mono-tabular text-[#787B86]">
                      {ev.previous}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
