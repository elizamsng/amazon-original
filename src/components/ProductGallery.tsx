import React, { useState } from 'react';
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
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  const activeImg = images[activeIndex] ?? images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
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

      {/* Main Stage */}
      <div className="flex-1 flex flex-col">
        <div
          onMouseEnter={() => setZoomActive(true)}
          onMouseLeave={() => setZoomActive(false)}
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
          aria-label="Open full-size image gallery"
          className="relative aspect-[4/3] w-full rounded-lg border border-[#E7E7E7] bg-white overflow-hidden cursor-zoom-in group"
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
              style={{
                transformOrigin: zoomOrigin,
                transform: zoomActive ? 'scale(1.55)' : 'scale(1)',
              }}
              className="w-full h-full object-contain p-2 transition-transform duration-150 ease-out"
            />
          )}

          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/90 border border-[#D5D9D9] text-[11px] font-medium text-[#0F1111] shadow-xs">
            <Expand className="w-3 h-3" />
            <span>Click to expand</span>
          </span>
        </div>

        <p className="text-xs text-[#565959] text-center mt-2.5">
          {activeImg.caption}
        </p>
      </div>
    </div>
  );
};
