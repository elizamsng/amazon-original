import React from 'react';
import { Star } from 'lucide-react';
import {
  ABOUT_BULLETS,
  ProductBundleOption,
  ProductVariant,
} from '../data/razerProductData';

interface ProductInfoCenterProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
  styleOptions: ProductBundleOption[];
  selectedStyle: ProductBundleOption;
  onSelectStyle: (opt: ProductBundleOption) => void;
  onJumpToReviews: () => void;
  onJumpToManufacturer: () => void;
}

export const StarRatingRow: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({
  rating,
  size = 'md',
}) => {
  const iconCls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${iconCls} ${
            n <= Math.round(rating)
              ? 'fill-[#DE7921] text-[#DE7921]'
              : 'fill-[#E7E7E7] text-[#C7C7C7]'
          }`}
        />
      ))}
    </div>
  );
};

export const ProductInfoCenter: React.FC<ProductInfoCenterProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
  styleOptions,
  selectedStyle,
  onSelectStyle,
  onJumpToReviews,
  onJumpToManufacturer,
}) => {
  const effectivePrice = selectedVariant.price + selectedStyle.priceDelta;
  const effectiveList = selectedVariant.listPrice + selectedStyle.priceDelta;
  const discountPct = Math.round(((effectiveList - effectivePrice) / effectiveList) * 100);
  const monthlyInstalment = (effectivePrice / 6).toFixed(2);

  return (
    <div className="space-y-4">
      {/* Store Link & Title */}
      <div className="border-b border-[#E7E7E7] pb-3.5">
        <button
          type="button"
          onClick={onJumpToManufacturer}
          className="text-xs font-medium text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
        >
          Visit the Razer Store
        </button>

        <h1 className="text-xl sm:text-[23px] font-medium leading-snug text-[#0F1111] mt-1">
          Razer Viper V4 Pro Wireless Esports Gaming Mouse: {selectedVariant.weight} Ultralight
          Symmetrical Design - Focus Pro 50K Optical Sensor Gen-3 - 8000Hz HyperPolling Wireless
          Gen-2 - Optical Switches Gen-4 - Up to 180 Hr Battery - {selectedVariant.name}
        </h1>

        {/* Rating & Purchase Volume */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs">
          <button
            type="button"
            onClick={onJumpToReviews}
            className="inline-flex items-center gap-1.5 hover:underline text-[#007185] cursor-pointer"
          >
            <span className="font-semibold text-[#0F1111] tabular-nums">4.8</span>
            <StarRatingRow rating={4.8} />
            <span className="tabular-nums">1,428 ratings</span>
          </button>
          <span className="text-[#D5D9D9]" aria-hidden="true">
            |
          </span>
          <span className="text-[#565959]">400+ bought in past month</span>
        </div>
      </div>

      {/* Pricing Block */}
      <div className="border-b border-[#E7E7E7] pb-4 space-y-1.5">
        <div className="flex items-baseline gap-2.5 tabular-nums">
          <span className="text-2xl font-light text-[#CC0C39]">-{discountPct}%</span>
          <span className="text-[28px] font-semibold text-[#0F1111] leading-none">
            <span className="text-xs align-top font-medium mr-0.5">S$</span>
            {effectivePrice.toFixed(2)}
          </span>
        </div>

        <div className="text-xs text-[#565959] tabular-nums">
          List Price:{' '}
          <span className="line-through">S${effectiveList.toFixed(2)}</span>
        </div>

        <p className="text-xs text-[#0F1111]">
          <span className="font-medium">0% Instalment Plan:</span> Pay{' '}
          <span className="font-semibold tabular-nums">S${monthlyInstalment}/month</span> for 6
          months with eligible Singapore credit cards.
        </p>
      </div>

      {/* Variant Pickers */}
      <div className="border-b border-[#E7E7E7] pb-4 space-y-4">
        {/* Colour Variant */}
        <div>
          <div className="text-xs text-[#565959] mb-2">
            Colour Name:{' '}
            <span className="font-bold text-[#0F1111]">
              {selectedVariant.name} ({selectedVariant.weight})
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {variants.map((v) => {
              const active = v.id === selectedVariant.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onSelectVariant(v)}
                  className={`flex items-center gap-2.5 p-2 rounded-md border text-left transition-all cursor-pointer ${
                    active
                      ? 'border-[#007185] bg-[#F0F8FA] ring-1 ring-[#007185]'
                      : 'border-[#D5D9D9] bg-white hover:bg-[#F7F8F8]'
                  }`}
                >
                  <img
                    src={v.heroImage}
                    alt={v.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-8 object-cover rounded border border-[#E7E7E7] bg-white shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#0F1111] truncate">
                      {v.name}
                    </div>
                    <div className="text-[11px] text-[#565959] tabular-nums">
                      S${(v.price + selectedStyle.priceDelta).toFixed(2)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Style / Bundle Option */}
        <div>
          <div className="text-xs text-[#565959] mb-2">
            Style: <span className="font-bold text-[#0F1111]">{selectedStyle.label}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {styleOptions.map((opt) => {
              const active = opt.id === selectedStyle.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectStyle(opt)}
                  className={`p-2.5 rounded-md border text-left transition-all cursor-pointer ${
                    active
                      ? 'border-[#007185] bg-[#F0F8FA] ring-1 ring-[#007185]'
                      : 'border-[#D5D9D9] bg-white hover:bg-[#F7F8F8]'
                  }`}
                >
                  <div className="text-xs font-semibold text-[#0F1111]">{opt.label}</div>
                  <div className="text-[11px] text-[#565959] mt-0.5 tabular-nums">
                    {opt.sublabel} · S${(selectedVariant.price + opt.priceDelta).toFixed(2)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Specs Overview */}
      <div className="border-b border-[#E7E7E7] pb-4 grid grid-cols-[140px_1fr] gap-y-2 text-[13px]">
        <span className="font-semibold text-[#0F1111]">Brand</span>
        <span className="text-[#0F1111]">Razer</span>

        <span className="font-semibold text-[#0F1111]">Colour</span>
        <span className="text-[#0F1111]">{selectedVariant.name}</span>

        <span className="font-semibold text-[#0F1111]">Connectivity</span>
        <span className="text-[#0F1111]">Razer HyperSpeed Wireless Gen-2, USB-C</span>

        <span className="font-semibold text-[#0F1111]">Special feature</span>
        <span className="text-[#0F1111]">
          {selectedVariant.weight} Ultralight, True 8,000Hz Wireless, Optical Scroll Wheel
        </span>

        <span className="font-semibold text-[#0F1111]">Movement detection</span>
        <span className="text-[#0F1111]">Focus Pro 50K Optical Sensor Gen-3</span>
      </div>

      {/* About This Item */}
      <div id="about-item" className="pt-1">
        <h2 className="text-base font-bold text-[#0F1111] mb-2.5">About this item</h2>
        <ul className="list-disc pl-5 space-y-2 text-[13.5px] leading-relaxed text-[#0F1111]">
          {ABOUT_BULLETS.map((bullet, idx) => {
            const [head, ...rest] = bullet.split(': ');
            return (
              <li key={idx}>
                <span className="font-semibold">{head}:</span> {rest.join(': ')}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
