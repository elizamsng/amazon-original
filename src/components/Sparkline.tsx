import React, { useId } from 'react';

interface SparklineProps {
  data: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  isPositive,
  width = 84,
  height = 28,
  className = '',
}) => {
  const gradId = useId();
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padY = 3;

  const coords = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = padY + ((max - val) / range) * (height - padY * 2);
    return { x, y };
  });

  const linePath = coords
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
  const strokeColor = isPositive ? '#089981' : '#F23645';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.22" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
