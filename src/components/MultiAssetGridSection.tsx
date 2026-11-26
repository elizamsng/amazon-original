import React from 'react';
import { ArrowUpRight, Star } from 'lucide-react';
import { AssetCategory, MarketInstrument } from '../types/markets';
import { US_YIELD_CURVE, formatInstrumentPrice } from '../data/marketsData';
import { Sparkline } from './Sparkline';
import { PriceChangeText, TickerBadge } from './TickerBadge';

interface MultiAssetGridSectionProps {
  instruments: MarketInstrument[];
  onInspectInstrument: (instrument: MarketInstrument) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  focusedCategory?: AssetCategory | null;
}

const YieldCurveMiniChart: React.FC = () => {
  const width = 320;
  const height = 84;
  const padX = 18;
  const padTop = 14;
  const padBottom = 22;
  const minY = 4.1;
  const maxY = 4.65;

  const pts = US_YIELD_CURVE.map((item, idx) => {
    const x = padX + (idx / (US_YIELD_CURVE.length - 1)) * (width - padX * 2);
    const y =
      padTop + ((maxY - item.yield) / (maxY - minY)) * (height - padTop - padBottom);
    return { ...item, x, y };
  });

  const line = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  return (
    <div className="mb-3 p-2.5 rounded-md bg-[#F8FAFD] dark:bg-[#1E222D] border border-[#E0E3EB] dark:border-[#2A2E39]">
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="font-semibold text-[#131722] dark:text-[#D1D4DC]">
          U.S. Treasury Yield Curve
        </span>
        <span className="font-mono-tabular text-[#787B86]">10Y–2Y: +0.052%</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20" aria-hidden="true">
        <path
          d={line}
          fill="none"
          stroke="#2962FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map((p) => (
          <g key={p.maturity}>
            <circle cx={p.x} cy={p.y} r="2.8" fill="#2962FF" />
            <text
              x={p.x}
              y={height - 5}
              textAnchor="middle"
              className="fill-[#787B86] text-[9px] font-mono"
            >
              {p.maturity}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export const MultiAssetGridSection: React.FC<MultiAssetGridSectionProps> = ({
  instruments,
  onInspectInstrument,
  watchlist,
  onToggleWatchlist,
  focusedCategory,
}) => {
  const sections: {
    id: AssetCategory;
    anchorId: string;
    title: string;
    subtitle: string;
    extraHeader?: React.ReactNode;
  }[] = [
    {
      id: 'crypto',
      anchorId: 'crypto-section',
      title: 'Cryptocurrencies',
      subtitle: 'Total Cap $3.28T · BTC Dominance 57.1%',
    },
    {
      id: 'futures',
      anchorId: 'futures-section',
      title: 'Futures & commodities',
      subtitle: 'Energy, precious & industrial metals',
    },
    {
      id: 'forex',
      anchorId: 'forex-section',
      title: 'Forex & currencies',
      subtitle: 'U.S. Dollar Index & G10 major pairs',
    },
    {
      id: 'bonds',
      anchorId: 'bonds-section',
      title: 'Government bonds',
      subtitle: 'Sovereign benchmark yields & spreads',
    },
  ];

  return (
    <section
      aria-label="Global asset classes"
      className="py-10 border-t border-[#E0E3EB] dark:border-[#2A2E39]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((sec) => {
          const rows = instruments.filter((item) => item.category === sec.id);
          const isFocused = focusedCategory === sec.id;
          return (
            <div
              key={sec.id}
              id={sec.anchorId}
              className={`rounded-lg border bg-white dark:bg-[#131722] p-4 sm:p-5 transition-colors ${
                isFocused
                  ? 'border-[#2962FF] ring-1 ring-[#2962FF]/20'
                  : 'border-[#E0E3EB] dark:border-[#2A2E39]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 pb-3 mb-3 border-b border-[#E0E3EB] dark:border-[#2A2E39]">
                <div>
                  <h2 className="text-lg font-bold text-[#131722] dark:text-white flex items-center gap-1.5">
                    <span>{sec.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#787B86]" />
                  </h2>
                  <p className="text-xs text-[#787B86] mt-0.5">{sec.subtitle}</p>
                </div>
              </div>

              {sec.id === 'bonds' && <YieldCurveMiniChart />}

              <div className="divide-y divide-[#E0E3EB] dark:divide-[#2A2E39]">
                {rows.map((item) => {
                  const isStarred = watchlist.includes(item.symbol);
                  return (
                    <div
                      key={item.symbol}
                      onClick={() => onInspectInstrument(item)}
                      className="py-2.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFD] dark:hover:bg-[#1E222D]/60 -mx-2 px-2 rounded transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <TickerBadge instrument={item} size="sm" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-semibold text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors">
                              {item.symbol}
                            </span>
                            <span className="text-[11px] text-[#787B86]">
                              {item.exchange}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#787B86] truncate max-w-[155px] sm:max-w-[210px]">
                            {item.name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <div className="hidden sm:block">
                          <Sparkline
                            data={item.sparkline}
                            isPositive={item.changePct >= 0}
                            width={64}
                            height={22}
                          />
                        </div>

                        <div className="text-right min-w-[92px]">
                          <div className="text-[13px] font-semibold font-mono-tabular text-[#131722] dark:text-[#D1D4DC]">
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
                          aria-label={
                            isStarred
                              ? `Remove ${item.symbol} from watchlist`
                              : `Add ${item.symbol} to watchlist`
                          }
                          className={`p-1 rounded hover:bg-[#E0E3EB]/60 dark:hover:bg-[#2A2E39] transition-colors cursor-pointer ${
                            isStarred
                              ? 'text-[#2962FF] dark:text-[#5B9CF6]'
                              : 'text-[#B2B5BE] hover:text-[#434651] dark:hover:text-[#D1D4DC]'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
