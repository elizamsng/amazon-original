import React, { useId, useMemo, useRef, useState } from 'react';
import { BarChart2, Maximize2, TrendingUp } from 'lucide-react';
import { ChartStyle, MarketInstrument, Timeframe } from '../types/markets';
import { formatInstrumentPrice, generateChartSeries } from '../data/marketsData';

interface InteractiveMarketChartProps {
  instrument: MarketInstrument;
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  chartStyle: ChartStyle;
  onChartStyleChange: (style: ChartStyle) => void;
  onOpenFullChart?: () => void;
  height?: number;
  compactHeader?: boolean;
}

const TIMEFRAMES: Timeframe[] = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'ALL'];

export const InteractiveMarketChart: React.FC<InteractiveMarketChartProps> = ({
  instrument,
  timeframe,
  onTimeframeChange,
  chartStyle,
  onChartStyleChange,
  onOpenFullChart,
  height = 310,
  compactHeader = false,
}) => {
  const gradId = useId();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const series = useMemo(
    () => generateChartSeries(instrument, timeframe),
    [instrument, timeframe]
  );

  const width = 920;
  const padLeft = 10;
  const padRight = 76;
  const padTop = 18;
  const padBottom = 34;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const { minVal, maxVal } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const pt of series) {
      const lo = chartStyle === 'candles' ? pt.low : pt.close;
      const hi = chartStyle === 'candles' ? pt.high : pt.close;
      if (lo < min) min = lo;
      if (hi > max) max = hi;
    }
    if (timeframe === '1D') {
      min = Math.min(min, instrument.prevClose);
      max = Math.max(max, instrument.prevClose);
    }
    const pad = (max - min || 1) * 0.1;
    return { minVal: min - pad, maxVal: max + pad };
  }, [series, chartStyle, timeframe, instrument.prevClose]);

  const toX = (idx: number) =>
    padLeft + (idx / Math.max(1, series.length - 1)) * plotW;

  const toY = (val: number) =>
    padTop + ((maxVal - val) / Math.max(1e-9, maxVal - minVal)) * plotH;

  const firstClose = series[0]?.close ?? instrument.prevClose;
  const lastClose = series[series.length - 1]?.close ?? instrument.price;
  const periodPositive =
    timeframe === '1D'
      ? instrument.changePct >= 0
      : lastClose >= firstClose;

  const lineColor = periodPositive ? '#089981' : '#F23645';

  const linePath = series
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(pt.close).toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L ${toX(series.length - 1).toFixed(1)} ${(
    padTop + plotH
  ).toFixed(1)} L ${toX(0).toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`;

  // Horizontal price grid ticks
  const yTicks = useMemo(() => {
    const steps = 4;
    const arr: number[] = [];
    for (let i = 0; i <= steps; i++) {
      arr.push(minVal + ((maxVal - minVal) * i) / steps);
    }
    return arr;
  }, [minVal, maxVal]);

  // Bottom X-axis labels (5 evenly spaced labels)
  const xTicks = useMemo(() => {
    const idxs = [0, 0.25, 0.5, 0.75, 0.98].map((r) =>
      Math.min(series.length - 1, Math.round(r * (series.length - 1)))
    );
    return Array.from(new Set(idxs));
  }, [series]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * width;
    const clamped = Math.max(padLeft, Math.min(padLeft + plotW, relX));
    const idx = Math.round(((clamped - padLeft) / plotW) * (series.length - 1));
    setHoverIdx(Math.max(0, Math.min(series.length - 1, idx)));
  };

  const activePoint = hoverIdx !== null ? series[hoverIdx] : null;
  const activeDeltaPct = activePoint
    ? ((activePoint.close - (timeframe === '1D' ? instrument.prevClose : firstClose)) /
        (timeframe === '1D' ? instrument.prevClose : firstClose)) *
      100
    : null;

  const candleWidth = Math.max(3, Math.min(11, (plotW / series.length) * 0.62));
  const prevCloseY = toY(instrument.prevClose);

  return (
    <div className="flex flex-col">
      {/* Chart Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
        <div className="flex items-center gap-1 bg-[#F0F3FA] dark:bg-[#1E222D] p-1 rounded-md">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => onTimeframeChange(tf)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                timeframe === tf
                  ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-xs'
                  : 'text-[#787B86] hover:text-[#131722] dark:hover:text-[#D1D4DC]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#F0F3FA] dark:bg-[#1E222D] p-1 rounded-md">
            <button
              type="button"
              onClick={() => onChartStyleChange('area')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                chartStyle === 'area'
                  ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-xs'
                  : 'text-[#787B86] hover:text-[#131722] dark:hover:text-[#D1D4DC]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Area</span>
            </button>
            <button
              type="button"
              onClick={() => onChartStyleChange('candles')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                chartStyle === 'candles'
                  ? 'bg-white dark:bg-[#2A2E39] text-[#131722] dark:text-white shadow-xs'
                  : 'text-[#787B86] hover:text-[#131722] dark:hover:text-[#D1D4DC]'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Candles</span>
            </button>
          </div>

          {onOpenFullChart && !compactHeader && (
            <button
              type="button"
              onClick={onOpenFullChart}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[#E0E3EB] dark:border-[#2A2E39] text-[#131722] dark:text-[#D1D4DC] hover:bg-[#F0F3FA] dark:hover:bg-[#1E222D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full chart</span>
            </button>
          )}
        </div>
      </div>

      {/* Hover OHLC Readout Bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mb-2 min-h-[20px] tabular-nums">
        {activePoint ? (
          <>
            <span className="font-semibold text-[#131722] dark:text-white">
              {activePoint.label}
            </span>
            <span className="text-[#787B86]">
              O{' '}
              <span className="font-mono-tabular text-[#131722] dark:text-[#D1D4DC]">
                {formatInstrumentPrice(activePoint.open, instrument.decimals, instrument.unit)}
              </span>
            </span>
            <span className="text-[#787B86]">
              H{' '}
              <span className="font-mono-tabular text-[#131722] dark:text-[#D1D4DC]">
                {formatInstrumentPrice(activePoint.high, instrument.decimals, instrument.unit)}
              </span>
            </span>
            <span className="text-[#787B86]">
              L{' '}
              <span className="font-mono-tabular text-[#131722] dark:text-[#D1D4DC]">
                {formatInstrumentPrice(activePoint.low, instrument.decimals, instrument.unit)}
              </span>
            </span>
            <span className="text-[#787B86]">
              C{' '}
              <span className="font-mono-tabular font-semibold text-[#131722] dark:text-[#D1D4DC]">
                {formatInstrumentPrice(activePoint.close, instrument.decimals, instrument.unit)}
              </span>
            </span>
            {activeDeltaPct !== null && (
              <span
                className={`font-mono-tabular font-medium ${
                  activeDeltaPct >= 0
                    ? 'text-[#089981] dark:text-[#22AB94]'
                    : 'text-[#F23645] dark:text-[#F7525F]'
                }`}
              >
                {activeDeltaPct >= 0 ? '+' : ''}
                {activeDeltaPct.toFixed(2)}%
              </span>
            )}
          </>
        ) : (
          <span className="text-[#787B86]">
            Hover over chart to inspect {instrument.symbol} {timeframe} price action
          </span>
        )}
      </div>

      {/* SVG Plot Canvas */}
      <div className="relative w-full select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIdx(null)}
          role="img"
          aria-label={`${instrument.name} ${timeframe} price chart`}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.24" />
              <stop offset="85%" stopColor={lineColor} stopOpacity="0.02" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines + Right Y-Axis Labels */}
          {yTicks.map((val, idx) => {
            const y = toY(val);
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={padLeft + plotW}
                  y2={y}
                  className="stroke-[#E0E3EB] dark:stroke-[#2A2E39]"
                  strokeWidth="1"
                />
                <text
                  x={padLeft + plotW + 8}
                  y={y + 3.5}
                  className="fill-[#787B86] text-[10.5px] font-mono tabular-nums"
                >
                  {formatInstrumentPrice(val, instrument.decimals, instrument.unit)}
                </text>
              </g>
            );
          })}

          {/* Previous Close Baseline on 1D */}
          {timeframe === '1D' && prevCloseY >= padTop && prevCloseY <= padTop + plotH && (
            <line
              x1={padLeft}
              y1={prevCloseY}
              x2={padLeft + plotW}
              y2={prevCloseY}
              stroke="#787B86"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.7"
            />
          )}

          {/* Subtle Bottom Volume Bars */}
          {series.map((pt, i) => {
            const barH = (pt.volume / 220) * (plotH * 0.16);
            const x = toX(i) - candleWidth / 2;
            const y = padTop + plotH - barH;
            const up = pt.close >= pt.open;
            return (
              <rect
                key={`vol-${i}`}
                x={x}
                y={y}
                width={candleWidth}
                height={barH}
                fill={up ? '#089981' : '#F23645'}
                opacity="0.14"
                rx="1"
              />
            );
          })}

          {/* Main Area or Candlestick Plot */}
          {chartStyle === 'area' ? (
            <>
              <path d={areaPath} fill={`url(#${gradId})`} />
              <path
                d={linePath}
                fill="none"
                stroke={lineColor}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </>
          ) : (
            series.map((pt, i) => {
              const cx = toX(i);
              const isUp = pt.close >= pt.open;
              const col = isUp ? '#089981' : '#F23645';
              const yHigh = toY(pt.high);
              const yLow = toY(pt.low);
              const yOpen = toY(pt.open);
              const yClose = toY(pt.close);
              const bodyTop = Math.min(yOpen, yClose);
              const bodyH = Math.max(1.8, Math.abs(yClose - yOpen));
              return (
                <g key={`c-${i}`}>
                  <line x1={cx} y1={yHigh} x2={cx} y2={yLow} stroke={col} strokeWidth="1.2" />
                  <rect
                    x={cx - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyH}
                    fill={col}
                    rx="1"
                  />
                </g>
              );
            })
          )}

          {/* Current Price Tag on Right Axis */}
          {(() => {
            const cy = toY(lastClose);
            return (
              <g>
                <rect
                  x={padLeft + plotW + 2}
                  y={cy - 10}
                  width={72}
                  height={20}
                  rx="3"
                  fill={lineColor}
                />
                <text
                  x={padLeft + plotW + 8}
                  y={cy + 3.5}
                  fill="#FFFFFF"
                  className="text-[10.5px] font-semibold font-mono tabular-nums"
                >
                  {formatInstrumentPrice(lastClose, instrument.decimals, instrument.unit)}
                </text>
              </g>
            );
          })()}

          {/* Bottom Time Labels */}
          {xTicks.map((idx) => (
            <text
              key={`xt-${idx}`}
              x={toX(idx)}
              y={height - 10}
              textAnchor={idx === 0 ? 'start' : idx > series.length - 4 ? 'end' : 'middle'}
              className="fill-[#787B86] text-[10.5px]"
            >
              {series[idx]?.label}
            </text>
          ))}

          {/* Interactive Hover Crosshair */}
          {hoverIdx !== null && activePoint && (
            <g>
              <line
                x1={toX(hoverIdx)}
                y1={padTop}
                x2={toX(hoverIdx)}
                y2={padTop + plotH}
                stroke="#787B86"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1={padLeft}
                y1={toY(activePoint.close)}
                x2={padLeft + plotW}
                y2={toY(activePoint.close)}
                stroke="#787B86"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={toX(hoverIdx)}
                cy={toY(activePoint.close)}
                r="4.5"
                fill={lineColor}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
