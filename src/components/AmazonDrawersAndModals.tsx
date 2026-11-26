import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
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
/* 1. Cart & Checkout Slide-Over Drawer                                       */
/* -------------------------------------------------------------------------- */
interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  selectedLocation: string;
  onPlaceOrder: (paymentMethod: string) => OrderRecord;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  selectedLocation,
  onPlaceOrder,
}) => {
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('PayNow (Instant SG)');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  if (!open) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record = onPlaceOrder(paymentMethod);
    setConfirmedOrder(record);
    setCheckoutMode(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
      onClick={() => {
        setConfirmedOrder(null);
        setCheckoutMode(false);
        onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      <aside
        className="w-full max-w-md h-full bg-white text-[#0F1111] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[#E7E7E7] flex items-center justify-between bg-[#F7F8F8]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#007185]" />
            <h2 className="text-base font-bold">
              {confirmedOrder
                ? 'Order Confirmed'
                : checkoutMode
                ? 'Checkout'
                : `Shopping Cart (${itemCount})`}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmedOrder(null);
              setCheckoutMode(false);
              onClose();
            }}
            aria-label="Close cart"
            className="p-1.5 rounded text-[#565959] hover:text-[#0F1111] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {confirmedOrder ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-[#007600]/30 bg-[#F2FAF2] p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#007600] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-[#007600]">
                    Order #{confirmedOrder.orderId} Confirmed
                  </h3>
                  <p className="text-xs text-[#0F1111] mt-1">
                    Preparing shipment to <span className="font-semibold">{confirmedOrder.address}</span>.
                    Estimated arrival: Tomorrow by 9 PM.
                  </p>
                </div>
              </div>

              <div className="border-t border-[#E7E7E7] pt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#565959]">Payment method</span>
                  <span className="font-medium">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#565959]">Order total (incl. GST)</span>
                  <span className="font-bold text-sm tabular-nums">
                    S${confirmedOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setConfirmedOrder(null);
                  onClose();
                }}
                className="w-full py-2.5 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-xs font-medium text-[#0F1111] cursor-pointer"
              >
                Continue shopping
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <ShoppingBag className="w-10 h-10 text-[#C7C7C7] mx-auto" />
              <p className="text-sm font-semibold">Your Amazon.sg Cart is empty</p>
              <p className="text-xs text-[#565959]">
                Add the Razer Viper V4 Pro or bundle accessories to get started.
              </p>
            </div>
          ) : checkoutMode ? (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              <div className="rounded-lg border border-[#D5D9D9] p-3.5 space-y-1">
                <div className="font-bold text-[#0F1111]">1. Delivery address</div>
                <div className="text-[#565959]">{selectedLocation}</div>
              </div>

              <div className="rounded-lg border border-[#D5D9D9] p-3.5 space-y-2.5">
                <div className="font-bold text-[#0F1111]">2. Payment method</div>
                {['PayNow (Instant SG)', 'Visa ending in 4242', 'Cash on Delivery (COD)'].map(
                  (method) => (
                    <label
                      key={method}
                      className="flex items-center gap-2.5 cursor-pointer py-1"
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="accent-[#007185]"
                      />
                      <span className="text-[#0F1111] font-medium">{method}</span>
                    </label>
                  )
                )}
                {paymentMethod.includes('Cash on Delivery') && (
                  <p className="text-[11px] text-[#565959] pl-6">
                    Pay S${subtotal.toFixed(2)} to the courier upon delivery. Free shipping applied.
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-[#D5D9D9] p-3.5 space-y-1.5">
                <div className="font-bold text-[#0F1111]">3. Order summary</div>
                <div className="flex justify-between">
                  <span className="text-[#565959]">Items ({itemCount}):</span>
                  <span className="tabular-nums">S${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#565959]">Delivery (Singapore):</span>
                  <span className="text-[#007600] font-medium">FREE</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E7E7E7] text-sm font-bold text-[#B12704]">
                  <span>Order total:</span>
                  <span className="tabular-nums">S${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md bg-[#F2FAF2] border border-[#007600]/25 px-3 py-2 text-xs text-[#007600]">
                Your order qualifies for FREE Singapore Next-Day Delivery.
              </div>

              <div className="divide-y divide-[#E7E7E7]">
                {items.map((item) => (
                  <div key={item.id} className="py-3.5 flex gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-14 object-contain rounded border border-[#E7E7E7] bg-white p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#0F1111] line-clamp-2">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#565959] mt-0.5">{item.subtitle}</div>
                      <div className="text-sm font-bold text-[#0F1111] tabular-nums mt-1">
                        S${(item.price * item.quantity).toFixed(2)}
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <div className="inline-flex items-center rounded border border-[#D5D9D9] bg-[#F0F2F2]">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, -1)}
                            aria-label="Decrease quantity"
                            className="p-1 hover:bg-[#E3E6E6] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, 1)}
                            aria-label="Increase quantity"
                            className="p-1 hover:bg-[#E3E6E6] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label="Remove item"
                          className="text-xs text-[#007185] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!confirmedOrder && items.length > 0 && (
          <div className="p-5 border-t border-[#E7E7E7] bg-[#F7F8F8] space-y-3">
            {!checkoutMode && (
              <div className="flex items-center justify-between text-sm">
                <span>
                  Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}):
                </span>
                <span className="font-bold text-base tabular-nums">S${subtotal.toFixed(2)}</span>
              </div>
            )}

            {checkoutMode ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutMode(false)}
                  className="px-4 py-2.5 rounded-full border border-[#D5D9D9] bg-white text-xs font-medium cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 py-2.5 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-xs font-bold text-[#0F1111] cursor-pointer"
                >
                  Place your order (S${subtotal.toFixed(2)})
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCheckoutMode(true)}
                className="w-full py-2.5 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[13px] font-medium text-[#0F1111] shadow-xs cursor-pointer"
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. Singapore Location Picker Modal                                         */
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
/* 3. Image Lightbox Modal                                                    */
/* -------------------------------------------------------------------------- */
export const ImageLightboxModal: React.FC<{
  open: boolean;
  onClose: () => void;
  images: GalleryImage[];
  activeIndex: number;
  onSelectIndex: (idx: number) => void;
}> = ({ open, onClose, images, activeIndex, onSelectIndex }) => {
  if (!open) return null;
  const active = images[activeIndex] ?? images[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Product gallery lightbox"
    >
      <div
        className="w-full max-w-4xl rounded-lg bg-white overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-[#E7E7E7] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#0F1111]">{active.caption}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="p-1 text-[#565959] hover:text-[#0F1111] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative aspect-[4/3] max-h-[65vh] w-full bg-white flex items-center justify-center p-4">
          <img
            src={active.src}
            alt={active.alt}
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain"
          />

          <button
            type="button"
            onClick={() => onSelectIndex((activeIndex - 1 + images.length) % images.length)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 border border-[#D5D9D9] shadow cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onSelectIndex((activeIndex + 1) % images.length)}
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
              onClick={() => onSelectIndex(i)}
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
/* 4. Orders & Saved Items Modal                                              */
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
                No orders placed yet in this session. Use Add to Cart or Buy Now to test checkout.
              </p>
            ) : (
              <div className="space-y-2.5">
                {orders.map((o) => (
                  <div key={o.orderId} className="rounded border border-[#D5D9D9] p-3 space-y-1">
                    <div className="flex justify-between font-bold text-[#0F1111]">
                      <span>Order #{o.orderId}</span>
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
