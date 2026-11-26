import React, { useMemo, useState } from 'react';
import { MessageSquare, Rocket } from 'lucide-react';
import { CommunityIdea } from '../types/markets';
import { COMMUNITY_IDEAS } from '../data/marketsData';

interface CommunityIdeasSectionProps {
  onSelectIdea: (idea: CommunityIdea) => void;
  boostedIds: string[];
  onToggleBoost: (id: string) => void;
}

type IdeaFilter = 'editors' | 'popular' | 'Stocks' | 'Crypto' | 'Forex' | 'Futures';

export const IdeaChartThumbnail: React.FC<{
  preset: CommunityIdea['chartPreset'];
  direction: CommunityIdea['direction'];
  symbol: string;
}> = ({ preset, direction, symbol }) => {
  const isLong = direction === 'Long';
  const accent = isLong ? '#089981' : '#F23645';

  // Different authentic technical patterns per preset
  const candlesByPreset: Record<
    CommunityIdea['chartPreset'],
    { x: number; o: number; h: number; l: number; c: number }[]
  > = {
    flag: [
      { x: 24, o: 96, h: 82, l: 100, c: 84 },
      { x: 42, o: 84, h: 66, l: 88, c: 70 },
      { x: 60, o: 70, h: 52, l: 74, c: 56 },
      { x: 78, o: 56, h: 48, l: 64, c: 61 },
      { x: 96, o: 61, h: 54, l: 68, c: 65 },
      { x: 114, o: 65, h: 58, l: 72, c: 60 },
      { x: 132, o: 60, h: 52, l: 65, c: 55 },
      { x: 150, o: 55, h: 40, l: 58, c: 42 },
      { x: 168, o: 42, h: 30, l: 45, c: 33 },
    ],
    breakout: [
      { x: 24, o: 94, h: 86, l: 98, c: 88 },
      { x: 42, o: 88, h: 78, l: 92, c: 80 },
      { x: 60, o: 80, h: 74, l: 86, c: 83 },
      { x: 78, o: 83, h: 76, l: 94, c: 90 },
      { x: 96, o: 90, h: 74, l: 95, c: 76 },
      { x: 114, o: 76, h: 64, l: 79, c: 66 },
      { x: 132, o: 66, h: 56, l: 70, c: 59 },
      { x: 150, o: 59, h: 44, l: 61, c: 46 },
      { x: 168, o: 46, h: 32, l: 48, c: 36 },
    ],
    wedge: [
      { x: 24, o: 88, h: 74, l: 92, c: 78 },
      { x: 42, o: 78, h: 66, l: 82, c: 70 },
      { x: 60, o: 70, h: 62, l: 78, c: 74 },
      { x: 78, o: 74, h: 64, l: 76, c: 67 },
      { x: 96, o: 67, h: 61, l: 72, c: 69 },
      { x: 114, o: 69, h: 59, l: 71, c: 61 },
      { x: 132, o: 61, h: 53, l: 64, c: 55 },
      { x: 150, o: 55, h: 42, l: 57, c: 45 },
      { x: 168, o: 45, h: 32, l: 47, c: 35 },
    ],
    reversal: [
      { x: 24, o: 46, h: 42, l: 60, c: 58 },
      { x: 42, o: 58, h: 55, l: 78, c: 74 },
      { x: 60, o: 74, h: 70, l: 92, c: 88 },
      { x: 78, o: 88, h: 76, l: 90, c: 79 },
      { x: 96, o: 79, h: 77, l: 94, c: 90 },
      { x: 114, o: 90, h: 74, l: 92, c: 76 },
      { x: 132, o: 76, h: 62, l: 78, c: 65 },
      { x: 150, o: 65, h: 50, l: 68, c: 54 },
      { x: 168, o: 54, h: 40, l: 56, c: 43 },
    ],
    channel: [
      { x: 24, o: 92, h: 80, l: 96, c: 82 },
      { x: 42, o: 82, h: 70, l: 85, c: 72 },
      { x: 60, o: 72, h: 66, l: 82, c: 79 },
      { x: 78, o: 79, h: 68, l: 84, c: 70 },
      { x: 96, o: 70, h: 58, l: 73, c: 61 },
      { x: 114, o: 61, h: 56, l: 72, c: 68 },
      { x: 132, o: 68, h: 54, l: 70, c: 56 },
      { x: 150, o: 56, h: 42, l: 58, c: 45 },
      { x: 168, o: 45, h: 34, l: 48, c: 37 },
    ],
    pullback: [
      { x: 24, o: 42, h: 36, l: 52, c: 49 },
      { x: 42, o: 49, h: 45, l: 64, c: 60 },
      { x: 60, o: 60, h: 52, l: 63, c: 54 },
      { x: 78, o: 54, h: 46, l: 58, c: 50 },
      { x: 96, o: 50, h: 48, l: 70, c: 67 },
      { x: 114, o: 67, h: 63, l: 80, c: 76 },
      { x: 132, o: 76, h: 72, l: 90, c: 86 },
      { x: 150, o: 86, h: 80, l: 96, c: 93 },
      { x: 168, o: 93, h: 89, l: 106, c: 102 },
    ],
  };

  const bars = candlesByPreset[preset];

  return (
    <svg
      viewBox="0 0 280 128"
      className="w-full h-36 bg-[#F8FAFD] dark:bg-[#1E222D] rounded-md border border-[#E0E3EB] dark:border-[#2A2E39]"
      aria-hidden="true"
    >
      {/* Subtle technical grid */}
      <line x1="0" y1="32" x2="280" y2="32" className="stroke-[#E0E3EB] dark:stroke-[#2A2E39]" strokeWidth="0.7" />
      <line x1="0" y1="64" x2="280" y2="64" className="stroke-[#E0E3EB] dark:stroke-[#2A2E39]" strokeWidth="0.7" />
      <line x1="0" y1="96" x2="280" y2="96" className="stroke-[#E0E3EB] dark:stroke-[#2A2E39]" strokeWidth="0.7" />

      {/* Target / Stop Projection Box */}
      <rect
        x="184"
        y={isLong ? 20 : 62}
        width="76"
        height={isLong ? 42 : 44}
        fill={accent}
        opacity="0.11"
        rx="2"
      />
      <rect
        x="184"
        y={isLong ? 62 : 40}
        width="76"
        height={isLong ? 22 : 22}
        fill={isLong ? '#F23645' : '#089981'}
        opacity="0.09"
        rx="2"
      />

      {/* Trendline */}
      <line
        x1="18"
        y1={isLong ? 102 : 36}
        x2="180"
        y2={isLong ? 50 : 88}
        stroke="#2962FF"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />

      {/* Moving average curve */}
      <path
        d={
          isLong
            ? 'M 14 104 Q 95 82 178 44'
            : 'M 14 40 Q 95 62 178 96'
        }
        fill="none"
        stroke="#F59E0B"
        strokeWidth="1.3"
        opacity="0.85"
      />

      {/* Candlesticks */}
      {bars.map((b, i) => {
        const up = b.c < b.o; // lower y = higher price
        const color = up ? '#089981' : '#F23645';
        const top = Math.min(b.o, b.c);
        const h = Math.max(3, Math.abs(b.o - b.c));
        return (
          <g key={i}>
            <line x1={b.x} y1={b.h} x2={b.x} y2={b.l} stroke={color} strokeWidth="1.2" />
            <rect x={b.x - 4} y={top} width="8" height={h} fill={color} rx="1" />
          </g>
        );
      })}

      {/* Forecast arrow */}
      <path
        d={
          isLong
            ? 'M 176 36 L 210 42 L 248 22'
            : 'M 176 100 L 212 92 L 248 108'
        }
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="248" cy={isLong ? 22 : 108} r="3" fill={accent} />

      {/* Clean SVG Chart Corner Label */}
      <text
        x="10"
        y="18"
        className="fill-[#787B86] text-[9.5px] font-mono font-semibold"
      >
        {symbol} · {direction.toUpperCase()}
      </text>
    </svg>
  );
};

export const CommunityIdeasSection: React.FC<CommunityIdeasSectionProps> = ({
  onSelectIdea,
  boostedIds,
  onToggleBoost,
}) => {
  const [filter, setFilter] = useState<IdeaFilter>('editors');

  const ideas = useMemo(() => {
    if (filter === 'editors') {
      return [...COMMUNITY_IDEAS].sort(
        (a, b) => Number(b.editorsPick) - Number(a.editorsPick)
      );
    }
    if (filter === 'popular') {
      return [...COMMUNITY_IDEAS].sort((a, b) => b.boosts - a.boosts);
    }
    return COMMUNITY_IDEAS.filter((idea) => idea.category === filter);
  }, [filter]);

  return (
    <section
      id="community-ideas"
      aria-labelledby="community-ideas-heading"
      className="py-10 border-t border-[#E0E3EB] dark:border-[#2A2E39]"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
        <div>
          <h2
            id="community-ideas-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#131722] dark:text-white"
          >
            Community ideas
          </h2>
          <p className="text-xs text-[#787B86] mt-1">
            Technical setups and trade theses published by market analysts
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#F0F3FA] dark:bg-[#1E222D] p-1 rounded-lg overflow-x-auto">
          {(
            [
              { id: 'editors', label: "Editors' Picks" },
              { id: 'popular', label: 'Popular' },
              { id: 'Stocks', label: 'Stocks' },
              { id: 'Crypto', label: 'Crypto' },
              { id: 'Forex', label: 'Forex' },
              { id: 'Futures', label: 'Futures' },
            ] as { id: IdeaFilter; label: string }[]
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
      </div>

      {/* 3-Column Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ideas.map((idea) => {
          const isBoosted = boostedIds.includes(idea.id);
          const boostCount = idea.boosts + (isBoosted ? 1 : 0);
          return (
            <article
              key={idea.id}
              onClick={() => onSelectIdea(idea)}
              className="rounded-lg border border-[#E0E3EB] dark:border-[#2A2E39] bg-white dark:bg-[#131722] p-4 flex flex-col justify-between gap-3 hover:border-[#2962FF]/60 transition-colors cursor-pointer group"
            >
              <div>
                <IdeaChartThumbnail
                  preset={idea.chartPreset}
                  direction={idea.direction}
                  symbol={idea.symbol}
                />

                {/* Unboxed Metadata Line */}
                <div className="flex items-center gap-2 text-[11px] text-[#787B86] mt-3">
                  <span className="font-mono font-semibold text-[#131722] dark:text-[#D1D4DC]">
                    {idea.symbol}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{idea.timeframe}</span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={
                      idea.direction === 'Long'
                        ? 'text-[#089981] dark:text-[#22AB94] font-semibold'
                        : 'text-[#F23645] dark:text-[#F7525F] font-semibold'
                    }
                  >
                    {idea.direction}
                  </span>
                  {idea.editorsPick && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#2962FF] dark:text-[#5B9CF6] font-medium">
                        Editors&apos; pick
                      </span>
                    </>
                  )}
                </div>

                <h3 className="text-[15px] font-bold leading-snug text-[#131722] dark:text-white group-hover:text-[#2962FF] transition-colors mt-1.5 line-clamp-2">
                  {idea.title}
                </h3>

                <p className="text-xs text-[#434651] dark:text-[#B2B5BE] leading-relaxed mt-1.5 line-clamp-2">
                  {idea.summary}
                </p>
              </div>

              {/* Footer: Author & Actions */}
              <div className="pt-3 border-t border-[#E0E3EB] dark:border-[#2A2E39] flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-[#F0F3FA] dark:bg-[#2A2E39] text-[#131722] dark:text-white text-[10px] font-bold inline-flex items-center justify-center shrink-0">
                    {idea.author.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="truncate text-[11px] text-[#787B86]">
                    <span className="font-medium text-[#131722] dark:text-[#D1D4DC]">
                      {idea.author}
                    </span>{' '}
                    · {idea.publishedAt}
                  </div>
                </div>

                <div
                  className="flex items-center gap-2 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#787B86] tabular-nums">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {idea.comments}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleBoost(idea.id)}
                    aria-label={`Boost idea by ${idea.author}`}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium tabular-nums transition-colors cursor-pointer ${
                      isBoosted
                        ? 'bg-[#2962FF]/15 text-[#2962FF] dark:text-[#5B9CF6]'
                        : 'bg-[#F0F3FA] dark:bg-[#1E222D] text-[#434651] dark:text-[#B2B5BE] hover:text-[#2962FF]'
                    }`}
                  >
                    <Rocket className="w-3 h-3" />
                    <span>{boostCount}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
