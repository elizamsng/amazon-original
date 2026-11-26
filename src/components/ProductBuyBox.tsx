import React from 'react';
import { Bookmark, Check, Lock, MapPin, RotateCcw, ShieldCheck } from 'lucide-react';
import { ProductBundleOption, ProductVariant } from '../data/razerProductData';

interface ProductBuyBoxProps {
  variant: ProductVariant;
  styleOption: ProductBundleOption;
  quantity: number;
  onQuantityChange: (q: number) => void;
  locationLabel: string;
  onOpenLocationModal: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isSaved: boolean;
  onToggleSaved: () => void;
  justAdded: boolean;
}

export const ProductBuyBox: React.FC<ProductBuyBoxProps> = ({
  variant,
  styleOption,
  quantity,
  onQuantityChange,
  locationLabel,
  onOpenLocationModal,
  onAddToCart,
  onBuyNow,
  isSaved,
  onToggleSaved,
  justAdded,
}) => {
  const unitPrice = variant.price + styleOption.priceDelta;
  const totalPrice = unitPrice * quantity;
  const whole = Math.floor(totalPrice);
  const cents = Math.round((totalPrice - whole) * 100)
    .toString()
    .padStart(2, '0');

  const shortLocation = locationLabel.split(' (')[0];

  return (
    <aside
      aria-label="Purchase options"
      className="rounded-lg border border-[#D5D9D9] bg-white p-5 lg:sticky lg:top-[108px] space-y-3.5"
    >
      {/* Price */}
      <div>
        <div className="flex items-start gap-0.5 text-[#0F1111] tabular-nums">
          <span className="text-xs font-medium mt-1">S$</span>
          <span className="text-[28px] font-semibold leading-none">{whole}</span>
          <span className="text-xs font-medium mt-1">{cents}</span>
        </div>
        <p className="text-xs text-[#565959] mt-1">
          Inclusive of 9% GST · <span className="text-[#007185]">FREE Returns</span>
        </p>
      </div>

      {/* Delivery Promise */}
      <div className="text-[13px] leading-snug text-[#0F1111] space-y-1.5">
        <p>
          <span className="font-semibold">FREE delivery Tomorrow</span> on eligible orders. Order
          within <span className="text-[#007600] font-medium">5 hrs 18 mins</span>
        </p>

        <button
          type="button"
          onClick={onOpenLocationModal}
          className="inline-flex items-center gap-1.5 text-xs text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>Deliver to {shortLocation}</span>
        </button>
      </div>

      {/* Stock State */}
      <div
        className={`text-[17px] font-medium ${
          variant.id === 'carbon' ? 'text-[#B12704]' : 'text-[#007600]'
        }`}
      >
        {variant.stockNote}
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <label htmlFor="pdp-quantity" className="text-xs text-[#0F1111] font-medium">
          Quantity:
        </label>
        <select
          id="pdp-quantity"
          value={quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          className="rounded-md border border-[#D5D9D9] bg-[#F0F2F2] hover:bg-[#E3E6E6] px-2.5 py-1.5 text-xs font-medium text-[#0F1111] shadow-xs focus:outline-none focus:border-[#007185] cursor-pointer"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onAddToCart}
          className="w-full py-2.5 px-4 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] border border-[#FCD200] text-[13px] font-medium text-[#0F1111] shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 text-[#007600]" />
              <span>Added to Cart</span>
            </>
          ) : (
            <span>Add to Cart</span>
          )}
        </button>

        <button
          type="button"
          onClick={onBuyNow}
          className="w-full py-2.5 px-4 rounded-full bg-[#FFA41C] hover:bg-[#FA8900] border border-[#FF8F00] text-[13px] font-medium text-[#0F1111] shadow-xs transition-colors cursor-pointer"
        >
          Buy Now
        </button>
      </div>

      {/* Seller / Fulfillment Metadata */}
      <div className="pt-2 border-t border-[#E7E7E7] text-xs space-y-1.5 text-[#565959]">
        <div className="grid grid-cols-[88px_1fr] gap-2">
          <span>Ships from</span>
          <span className="text-[#0F1111] font-medium">Amazon.sg</span>
        </div>
        <div className="grid grid-cols-[88px_1fr] gap-2">
          <span>Sold by</span>
          <span className="text-[#007185] font-medium">Razer Official Store</span>
        </div>
        <div className="grid grid-cols-[88px_1fr] gap-2">
          <span>Returns</span>
          <span className="text-[#007185] inline-flex items-center gap-1">
            <RotateCcw className="w-3 h-3 shrink-0" />
            30-day Returnable
          </span>
        </div>
        <div className="grid grid-cols-[88px_1fr] gap-2">
          <span>Warranty</span>
          <span className="text-[#0F1111] inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#007600] shrink-0" />
            2-Year Local Razer Warranty
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-[#007185] pt-1">
        <Lock className="w-3.5 h-3.5 text-[#565959]" />
        <span>Secure transaction</span>
      </div>

      {/* Save to List */}
      <div className="pt-2 border-t border-[#E7E7E7]">
        <button
          type="button"
          onClick={onToggleSaved}
          className="w-full py-2 px-3 rounded-md border border-[#D5D9D9] bg-white hover:bg-[#F7F8F8] text-xs font-medium text-[#0F1111] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Bookmark
            className={`w-3.5 h-3.5 ${
              isSaved ? 'fill-[#007185] text-[#007185]' : 'text-[#565959]'
            }`}
          />
          <span>{isSaved ? 'Saved in Your List' : 'Add to List'}</span>
        </button>
      </div>
    </aside>
  );
};
