import React, { useState } from 'react';
import { ChevronDown, MapPin, Search, ShoppingCart } from 'lucide-react';

interface AmazonHeaderProps {
  selectedLocation: string;
  onOpenLocationModal: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onScrollToSection: (id: string) => void;
  onSearchSubmit: (query: string) => void;
}

const SEARCH_CATEGORIES = ['Electronics', 'All Departments', 'Computers', 'PC Gaming'];

const QUICK_SUGGESTIONS = [
  'Razer Viper V4 Pro Wireless',
  'Razer Gigantus V2 Mouse Pad',
  'Razer 8000Hz HyperPolling Dongle',
  'Razer Grip Tape Set',
];

export const AmazonHeader: React.FC<AmazonHeaderProps> = ({
  selectedLocation,
  onOpenLocationModal,
  cartCount,
  onOpenCart,
  onOpenOrders,
  onScrollToSection,
  onSearchSubmit,
}) => {
  const [searchCat, setSearchCat] = useState('Electronics');
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const shortLocation = selectedLocation.split(' (')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFocused(false);
    onSearchSubmit(query);
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Primary Top Bar (#131921) */}
      <div className="bg-[#131921] text-white h-[60px]">
        <div className="max-w-[1440px] mx-auto h-full px-3 sm:px-5 flex items-center justify-between gap-3 sm:gap-5">
          {/* Left: Brand + Deliver To */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col items-start leading-none py-1 px-1.5 rounded border border-transparent hover:border-white/70 transition-colors shrink-0"
              aria-label="Amazon Singapore Home"
            >
              <div className="flex items-baseline">
                <span className="text-[20px] font-bold tracking-tight text-white">amazon</span>
                <span className="text-[13px] font-semibold text-[#FF9900] ml-0.5">.sg</span>
              </div>
              <svg width="64" height="10" viewBox="0 0 64 10" fill="none" aria-hidden="true" className="-mt-0.5">
                <path
                  d="M4 2.5C18 8.5 40 8.5 55 2.5"
                  stroke="#FF9900"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                />
                <path
                  d="M52 1.2L57.5 2.2L54.2 6.8"
                  stroke="#FF9900"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <button
              type="button"
              onClick={onOpenLocationModal}
              className="hidden lg:flex items-center gap-1.5 px-2 py-1.5 rounded border border-transparent hover:border-white/70 transition-colors text-left cursor-pointer shrink-0"
            >
              <MapPin className="w-4 h-4 text-white shrink-0 mt-1" />
              <div className="leading-tight">
                <div className="text-[11px] text-[#CCCCCC]">Deliver to</div>
                <div className="text-xs font-bold text-white whitespace-nowrap">
                  {shortLocation}
                </div>
              </div>
            </button>
          </div>

          {/* Center: Integrated Search Bar */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 max-w-2xl relative hidden md:flex items-stretch h-10 rounded-md overflow-visible"
          >
            <div className="relative flex items-center bg-[#E6E6E6] hover:bg-[#D4D4D4] text-[#0F1111] rounded-l-md border-r border-[#CDCDCD]">
              <select
                aria-label="Search department"
                value={searchCat}
                onChange={(e) => setSearchCat(e.target.value)}
                className="appearance-none bg-transparent pl-3 pr-7 py-2 text-xs font-medium text-[#333333] focus:outline-none cursor-pointer h-full"
              >
                {SEARCH_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#555555] absolute right-2 pointer-events-none" />
            </div>

            <input
              type="text"
              value={query}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 160)}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Amazon.sg"
              aria-label="Search Amazon Singapore"
              className="flex-1 bg-white text-[#0F1111] px-3 text-sm placeholder:text-[#565959] focus:outline-none"
            />

            <button
              type="submit"
              aria-label="Submit search"
              className="bg-[#FEBD69] hover:bg-[#F3A847] text-[#131921] px-4 rounded-r-md flex items-center justify-center transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Quick Search Suggestions */}
            {focused && (
              <div className="absolute left-0 right-0 top-11 bg-white text-[#0F1111] rounded-md shadow-xl border border-[#D5D9D9] py-1 z-50">
                {QUICK_SUGGESTIONS.filter((s) =>
                  !query.trim() ? true : s.toLowerCase().includes(query.toLowerCase())
                ).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onMouseDown={() => {
                      setQuery(item);
                      setFocused(false);
                      onSearchSubmit(item);
                    }}
                    className="w-full text-left px-3.5 py-2 text-sm hover:bg-[#F3F3F3] flex items-center gap-2.5 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-[#565959]" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Right: Orders & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenOrders}
              className="hidden sm:flex flex-col items-start leading-tight px-2.5 py-1.5 rounded border border-transparent hover:border-white/70 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span className="text-[11px] text-[#CCCCCC]">Returns</span>
              <span className="text-xs font-bold text-white">&amp; Orders</span>
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Shopping cart with ${cartCount} items`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-transparent hover:border-white/70 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-white" />
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F08804] text-[#131921] text-[11px] font-bold font-mono tabular-nums flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <span className="text-xs font-bold text-white hidden sm:inline mt-1.5">Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slim Secondary Sub-Nav (#232F3E) */}
      <nav
        aria-label="Category navigation"
        className="bg-[#232F3E] text-white border-t border-white/10"
      >
        <div className="max-w-[1440px] mx-auto px-3 sm:px-5 h-9 flex items-center gap-5 overflow-x-auto text-[13px] font-medium">
          {[
            { label: 'Overview', id: 'top' },
            { label: 'About this item', id: 'about-item' },
            { label: 'Frequently bought together', id: 'bundle-section' },
            { label: 'From the manufacturer', id: 'manufacturer-section' },
            { label: 'Technical details', id: 'tech-specs' },
            { label: 'Customer reviews', id: 'reviews-section' },
          ].map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => onScrollToSection(link.id)}
              className="text-[#EAEAEA] hover:text-white hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};
