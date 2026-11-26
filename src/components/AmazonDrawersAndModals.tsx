import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
} from 'lucide-react';
import { GalleryImage, SINGAPORE_LOCATIONS } from '../data/razerProductData';

export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
  quantity: number;
}

export interface OrderRecord {
  orderId: string;
  date: string;
  total: number;
  paymentMethod: string;
  address: string;
  items: CartItem[];
}

/* -------------------------------------------------------------------------- */
/* 1. Singapore Location Picker Modal                                         */
/* -------------------------------------------------------------------------- */
export const LocationModal: React.FC<{
  open: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (loc: string) => void;
}> = ({ open, onClose, selected, onSelect }) => {
  const [customPostal, setCustomPostal] = useState('');

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Choose your Singapore delivery location"
    >
      <div
        className="w-full max-w-sm rounded-lg bg-white border border-[#D5D9D9] shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 bg-[#F0F2F2] border-b border-[#D5D9D9] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0F1111]">Choose your location</h2>
          <button type="button" onClick={onClose} className="p-1 text-[#565959] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <p className="text-[#565959]">
            Delivery options and next-day cutoff times vary by Singapore postal sector.
          </p>

          <div className="space-y-1.5">
            {SINGAPORE_LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  onSelect(loc);
                  onClose();
                }}
                className={`w-full text-left px-3 py-2 rounded border flex items-center gap-2 cursor-pointer ${
                  selected === loc
                    ? 'border-[#007185] bg-[#F0F8FA] font-semibold text-[#0F1111]'
                    : 'border-[#D5D9D9] hover:bg-[#F7F8F8]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#007185] shrink-0" />
                <span>{loc}</span>
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!customPostal.trim()) return;
              onSelect(`Singapore ${customPostal.trim()}`);
              setCustomPostal('');
              onClose();
            }}
            className="pt-2 border-t border-[#E7E7E7] flex gap-2"
          >
            <input
              type="text"
              maxLength={6}
              value={customPostal}
              onChange={(e) => setCustomPostal(e.target.value)}
              placeholder="Enter 6-digit SG postal code"
              className="flex-1 px-2.5 py-1.5 rounded border border-[#D5D9D9] text-xs"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded border border-[#D5D9D9] bg-[#F7F8F8] hover:bg-[#EAEDED] font-medium cursor-pointer"
            >
              Apply
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. Image Lightbox Modal                                                    */
/* -------------------------------------------------------------------------- */
export const ImageLightboxModal: React.FC<{
  open: boolean;
  onClose: () => void;
  images: GalleryImage[];
  activeIndex: number;
  onSelectIndex: (idx: number) => void;
}> = ({ open, onClose, images, activeIndex, onSelectIndex }) => {
  const [clickZoomed, setClickZoomed] = useState(false);

  if (!open) return null;
  const active = images[activeIndex] ?? images[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={() => {
        setClickZoomed(false);
        onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Product gallery lightbox"
    >
      <div
        className="w-full max-w-4xl rounded-lg bg-white overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-[#E7E7E7] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#0F1111]">
            {active.caption} · Click image to {clickZoomed ? 'reset' : 'zoom'}
          </span>
          <button
            type="button"
            onClick={() => {
              setClickZoomed(false);
              onClose();
            }}
            aria-label="Close gallery"
            className="p-1 text-[#565959] hover:text-[#0F1111] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative aspect-[4/3] max-h-[65vh] w-full bg-white flex items-center justify-center p-4 overflow-hidden">
          <img
            src={active.src}
            alt={active.alt}
            referrerPolicy="no-referrer"
            onClick={() => setClickZoomed((z) => !z)}
            style={{ transform: clickZoomed ? 'scale(1.6)' : 'scale(1)' }}
            className={`max-h-full max-w-full object-contain transition-transform duration-200 ${
              clickZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
          />

          <button
            type="button"
            onClick={() => {
              setClickZoomed(false);
              onSelectIndex((activeIndex - 1 + images.length) % images.length);
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 border border-[#D5D9D9] shadow cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setClickZoomed(false);
              onSelectIndex((activeIndex + 1) % images.length);
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 border border-[#D5D9D9] shadow cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-3 border-t border-[#E7E7E7] flex items-center justify-center gap-2 overflow-x-auto bg-[#F7F8F8]">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => {
                setClickZoomed(false);
                onSelectIndex(i);
              }}
              className={`w-14 h-11 rounded border overflow-hidden bg-white cursor-pointer ${
                i === activeIndex ? 'border-[#007185] ring-2 ring-[#007185]/30' : 'border-[#D5D9D9]'
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. Orders & Saved Items Modal                                              */
/* -------------------------------------------------------------------------- */
export const OrdersAndSavedModal: React.FC<{
  open: boolean;
  onClose: () => void;
  orders: OrderRecord[];
  isSaved: boolean;
  onRemoveSaved: () => void;
}> = ({ open, onClose, orders, isSaved, onRemoveSaved }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Your Orders and Saved Items"
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white border border-[#D5D9D9] shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3.5 bg-[#F0F2F2] border-b border-[#D5D9D9] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0F1111]">Your Orders &amp; Saved List</h2>
          <button type="button" onClick={onClose} className="p-1 text-[#565959] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          <div>
            <h3 className="font-bold text-[#0F1111] mb-2">Recent Orders</h3>
            {orders.length === 0 ? (
              <p className="text-[#565959]">
                No orders placed yet. Add items to your cart and complete checkout to view order
                receipts here.
              </p>
            ) : (
              <div className="space-y-2.5">
                {orders.map((o) => (
                  <div key={o.orderId} className="rounded border border-[#D5D9D9] p-3 space-y-1">
                    <div className="flex items-center justify-between font-bold text-[#0F1111]">
                      <span className="inline-flex items-center gap-1.5 text-[#007600]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Order #{o.orderId}
                      </span>
                      <span className="tabular-nums">S${o.total.toFixed(2)}</span>
                    </div>
                    <div className="text-[#565959]">
                      {o.date} · {o.paymentMethod} · {o.address}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E7E7E7]">
            <h3 className="font-bold text-[#0F1111] mb-2">Saved List</h3>
            {isSaved ? (
              <div className="flex items-center justify-between rounded border border-[#D5D9D9] p-3">
                <span className="font-medium text-[#0F1111]">
                  Razer Viper V4 Pro Wireless Esports Gaming Mouse (B0G5QBTC2Q)
                </span>
                <button
                  type="button"
                  onClick={onRemoveSaved}
                  className="text-[#007185] hover:underline ml-3 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <p className="text-[#565959]">No items saved to your list yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
