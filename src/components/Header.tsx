import React from 'react';
import { Bookmark, Moon, Search, Sun } from 'lucide-react';

export type MarketSectionTab =
  | 'overview'
  | 'stocks'
  | 'crypto'
  | 'futures'
  | 'forex'
  | 'bonds'
  | 'calendar';

interface HeaderProps {
  activeTab: MarketSectionTab;
  onSelectTab: (tab: MarketSectionTab) => void;
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  onOpenSuperchart: () => void;
  watchlistCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

const SUB_TABS: { id: MarketSectionTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'futures', label: 'Futures' },
  { id: 'forex', label: 'Forex' },
  { id: 'bonds', label: 'Bonds' },
  { id: 'calendar', label: 'Calendar' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  onOpenWatchlist,
  onOpenSuperchart,
  watchlistCount,
  isDark,
  onToggleTheme,
}) => {
  return (
    <>
      {/* Top Bar: Strict 3-Zone Contract */}
      <header className="sticky top-0 z-40 h-14 bg-white/95 dark:bg-[#131722]/95 backdrop-blur-sm border-b border-[#E0E3EB] dark:border-[#2A2E39]">
        <div className="max-w-[1360px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2.5 text-[17px] font-bold tracking-tight text-[#131722] dark:text-white whitespace-nowrap shrink-0"
          >
            <svg
              width="26"
              height="18"
              viewBox="0 0 36 24"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <path d="M0 0H14V6H6V24H0V0Z" fill="currentColor" />
              <circle cx="20" cy="4" r="3.5" fill="currentColor" />
              <path d="M16 10H23L15 24H8L16 10Z" fill="#2962FF" />
              <path d="M25 10H33L25 24H17L25 10Z" fill="currentColor" />
            </svg>
            <span>TradingView</span>
          </a>

          {/* Zone 2: 5 Concise Single-Line Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#434651] dark:text-[#B2B5BE]"
          >
            <button
              type="button"
              onClick={() => onSelectTab('overview')}
              className={`hover:text-[#131722] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-[#2962FF] dark:text-[#5B9CF6] font-semibold'
                  : ''
              }`}
            >
              Markets
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('stocks')}
              className={`hover:text-[#131722] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'stocks'
                  ? 'text-[#2962FF] dark:text-[#5B9CF6] font-semibold'
                  : ''
              }`}
            >
              Stocks
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('crypto')}
              className={`hover:text-[#131722] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'crypto'
                  ? 'text-[#2962FF] dark:text-[#5B9CF6] font-semibold'
                  : ''
              }`}
            >
              Crypto
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('futures')}
              className={`hover:text-[#131722] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'futures'
                  ? 'text-[#2962FF] dark:text-[#5B9CF6] font-semibold'
                  : ''
              }`}
            >
              Futures
            </button>
            <a
              href="#community-ideas"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('community-ideas');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#131722] dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Community
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenSuperchart}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#2962FF] hover:bg-[#1E53E5] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Supercharts
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Markets Sub-Navigation & Utility Bar */}
      <div className="bg-[#F8FAFD] dark:bg-[#1E222D] border-b border-[#E0E3EB] dark:border-[#2A2E39]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Asset Class Sub-Nav */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {SUB_TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#2962FF]/10 text-[#2962FF] dark:bg-[#2962FF]/20 dark:text-[#5B9CF6] font-semibold'
                      : 'text-[#434651] dark:text-[#B2B5BE] hover:bg-[#E0E3EB]/60 dark:hover:bg-[#2A2E39] hover:text-[#131722] dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Workspace Controls: Search, Watchlist, Theme */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenSearch}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-[#787B86] bg-white dark:bg-[#131722] border border-[#E0E3EB] dark:border-[#2A2E39] rounded-md hover:border-[#2962FF]/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search markets...</span>
              <span className="sm:hidden">Search</span>
              <kbd className="hidden md:inline font-mono text-[10px] text-[#787B86] pl-1">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={onOpenWatchlist}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#131722] dark:text-[#D1D4DC] bg-white dark:bg-[#131722] border border-[#E0E3EB] dark:border-[#2A2E39] rounded-md hover:border-[#2962FF]/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#2962FF]" />
              <span>Watchlist</span>
              <span className="font-mono tabular-nums text-[#787B86]">
                {watchlistCount}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white dark:bg-[#131722] border border-[#E0E3EB] dark:border-[#2A2E39] text-[#434651] dark:text-[#B2B5BE] hover:text-[#131722] dark:hover:text-white transition-colors shrink-0 cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
