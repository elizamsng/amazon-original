import React from 'react';
import { MarketInstrument } from '../types/markets';

interface TickerBadgeProps {
  instrument: Pick<MarketInstrument, 'badgeBg' | 'badgeText' | 'badgeLabel' | 'symbol'>;
  size?: 'sm' | 'md' | 'lg';
}

export const TickerBadge: React.FC<TickerBadgeProps> = ({ instrument, size = 'md' }) => {
  const sizeClasses =
    size === 'sm'
      ? 'w-6 h-6 text-[9px]'
      : size === 'lg'
      ? 'w-10 h-10 text-xs'
      : 'w-8 h-8 text-[10px]';

  return (
    <span
      className={`${sizeClasses} rounded-full inline-flex items-center justify-center font-bold tracking-tight shrink-0 select-none`}
      style={{ backgroundColor: instrument.badgeBg, color: instrument.badgeText }}
      aria-hidden="true"
    >
      {instrument.badgeLabel}
    </span>
  );
};

interface PriceChangeTextProps {
  change: number;
  changePct: number;
  decimals?: number;
  showAbs?: boolean;
  compact?: boolean;
}

export const PriceChangeText: React.FC<PriceChangeTextProps> = ({
  change,
  changePct,
  decimals = 2,
  showAbs = true,
  compact = false,
}) => {
  const isPositive = changePct >= 0;
  const colorClass = isPositive
    ? 'text-[#089981] dark:text-[#22AB94]'
    : 'text-[#F23645] dark:text-[#F7525F]';
  const sign = isPositive ? '+' : '';
  const arrow = isPositive ? '▲' : '▼';

  return (
    <span
      className={`${colorClass} tabular-nums font-medium inline-flex items-center gap-1 whitespace-nowrap ${
        compact ? 'text-xs' : 'text-[13px]'
      }`}
    >
      <span className="text-[9px] leading-none" aria-hidden="true">
        {arrow}
      </span>
      {showAbs && (
        <span>
          {sign}
          {change.toFixed(decimals)}
        </span>
      )}
      <span>
        {showAbs ? '(' : ''}
        {sign}
        {changePct.toFixed(2)}%
        {showAbs ? ')' : ''}
      </span>
    </span>
  );
};
