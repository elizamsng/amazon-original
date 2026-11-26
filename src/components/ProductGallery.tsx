import React, { useRef, useState } from 'react';
import { Expand, Mouse } from 'lucide-react';
import { GalleryImage } from '../data/razerProductData';

interface ProductGalleryProps {
  images: GalleryImage[];
  activeIndex: number;
  onSelectIndex: (idx: number) => void;
  onOpenLightbox: () => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  activeIndex,
  onSelectIndex,
  onOpenLightbox,
}) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [lensPos, setLensPos] = useState({ xPct: 50, yPct: 50, leftPx: 0, topPx: 0 });
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  const activeImg = images[activeIndex] ?? images[0];
  const lensW = 148;
  const lensH = 112;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    // Clamp lens inside stage bounds
    const clampedLeft = Math.max(0, Math.min(rect.width - lensW, relX - lensW / 2));
    const clampedTop = Math.max(0, Math.min(rect.height - lensH, relY - lensH / 2));

    // Normalized center for the adjacent zoom preview
    const maxOffsetX = Math.max(1, rect.width - lensW);
    const maxOffsetY = Math.max(1, rect.height - lensH);
    const xPct = (clampedLeft / maxOffsetX) * 100;
    const yPct = (clampedTop / maxOffsetY) * 100;

    setLensPos({
      xPct,
      yPct,
      leftPx: clampedLeft,
      topPx: clampedTop,
    });
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 lg:sticky lg:top-[108px]">
      {/* Thumbnail Rail */}
      <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 shrink-0">
        {images.map((img, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <button
              key={img.id}
              type="button"
              onMouseEnter={() => onSelectIndex(idx)}
              onClick={() => onSelectIndex(idx)}
              aria-label={`View ${img.caption}`}
              className={`w-16 h-14 sm:w-14 sm:h-12 rounded-md border overflow-hidden bg-white shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#007185] ring-2 ring-[#007185]/25'
                  : 'border-[#D5D9D9] hover:border-[#888C8C]'
              }`}
            >
              {failedIds[img.id] ? (
                <div className="w-full h-full flex items-center justify-center bg-[#F7F8F8] text-[#565959]">
                  <Mouse className="w-4 h-4" />
                </div>
              ) : (
                <img
                  src={img.src}
                  alt={img.alt}
                  referrerPolicy="no-referrer"
                  onError={() => setFailedIds((p) => ({ ...p, [img.id]: true }))}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Stage + Adjacent Amazon Zoom Flyout */}
      <div className="flex-1 flex flex-col relative">
        <div
          ref={stageRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          onClick={onOpenLightbox}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenLightbox();
            }
          }}
          aria-label="Roll over image to zoom in or click to expand"
          className="relative aspect-[4/3] w-full rounded-lg border border-[#E7E7E7] bg-white overflow-hidden cursor-crosshair"
        >
          {failedIds[activeImg.id] ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#F7F8F8] to-[#EAEDED] text-[#565959] p-6 text-center">
              <Mouse className="w-12 h-12 text-[#0F1111]" />
              <span className="text-sm font-medium text-[#0F1111]">{activeImg.caption}</span>
            </div>
          ) : (
            <img
              src={activeImg.src}
              alt={activeImg.alt}
              referrerPolicy="no-referrer"
              onError={() => setFailedIds((p) => ({ ...p, [activeImg.id]: true }))}
              className="w-full h-full object-contain p-2 select-none"
            />
          )}

          {/* Amazon-Style Translucent Viewfinder Lens Box (desktop hover) */}
          {isHovering && !failedIds[activeImg.id] && (
            <div
              aria-hidden="true"
              style={{
                width: `${lensW}px`,
                height: `${lensH}px`,
                transform: `translate3d(${lensPos.leftPx}px, ${lensPos.topPx}px, 0)`,
                backgroundImage:
                  'radial-gradient(rgba(0, 113, 133, 0.22) 1px, transparent 1px)',
                backgroundSize: '6px 6px',
              }}
              className="hidden lg:block absolute top-0 left-0 pointer-events-none border border-[#007185]/70 bg-[#007185]/10 shadow-xs"
            />
          )}

          {/* Mobile expand icon */}
          <span className="lg:hidden absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/90 border border-[#D5D9D9] text-[11px] font-medium text-[#0F1111] shadow-xs">
            <Expand className="w-3 h-3" />
            <span>Expand</span>
          </span>
        </div>

        {/* Adjacent Desktop Zoom Flyout Window (Amazon.sg signature zoom panel) */}
        {isHovering && !failedIds[activeImg.id] && (
          <div
            aria-hidden="true"
            className="hidden lg:block absolute left-[calc(100%+16px)] top-0 w-[520px] xl:w-[580px] h-[440px] z-30 rounded-md border border-[#D5D9D9] bg-white shadow-2xl overflow-hidden pointer-events-none"
          >
            <div
              className="w-full h-full bg-no-repeat bg-white"
              style={{
                backgroundImage: `url(${activeImg.src})`,
                backgroundSize: '235%',
                backgroundPosition: `${lensPos.xPct}% ${lensPos.yPct}%`,
              }}
            />
            <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded bg-white/90 border border-[#E7E7E7] text-[11px] text-[#565959]">
              2.35× Zoom
            </div>
          </div>
        )}

        <p className="text-xs text-[#565959] text-center mt-2.5">
          {isHovering ? 'Click image to open expanded view' : 'Roll over image to zoom in'}
        </p>
      </div>
    </div>
  );
};
