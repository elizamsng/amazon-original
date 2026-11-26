import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Minus, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { CartItem, OrderRecord } from './AmazonDrawersAndModals';

/* -------------------------------------------------------------------------- */
/* 1. Persistent Right-Rail Mini Cart & Added Confirmation Bar on PDP         */
/* -------------------------------------------------------------------------- */
interface PersistentCartRailProps {
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onGoToCartPage: () => void;
  onProceedToCheckout: () => void;
}

export const PersistentCartRail: React.FC<PersistentCartRailProps> = ({
  items,
  onUpdateQty,
  onRemoveItem,
  onGoToCartPage,
  onProceedToCheckout,
}) => {
  if (items.length === 0) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section
      aria-label="Persistent shopping cart summary"
      className="rounded-lg border border-[#D5D9D9] bg-[#F7F8F8] p-4 space-y-3"
    >
      <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-2.5">
        <div>
          <div className="text-xs font-bold text-[#0F1111]">Cart Subtotal</div>
          <div className="text-lg font-bold text-[#B12704] tabular-nums">
            S${subtotal.toFixed(2)}
          </div>
        </div>
        <span className="text-xs text-[#565959] tabular-nums">
          {count} {count === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2.5 bg-white p-2 rounded border border-[#E7E7E7]"
          >
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-11 h-10 object-contain rounded border border-[#F0F2F2] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-[#0F1111] line-clamp-1">
                {item.title}
              </div>
              <div className="text-xs font-bold text-[#0F1111] tabular-nums mt-0.5">
                S${(item.price * item.quantity).toFixed(2)}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="inline-flex items-center rounded border border-[#D5D9D9] bg-[#F0F2F2]">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, -1)}
                    aria-label="Decrease quantity"
                    className="p-0.5 hover:bg-[#E3E6E6] cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2 text-[11px] font-semibold tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, 1)}
                    aria-label="Increase quantity"
                    className="p-0.5 hover:bg-[#E3E6E6] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  aria-label={`Delete ${item.title}`}
                  className="text-[11px] text-[#007185] hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onProceedToCheckout}
          className="w-full py-2 px-3 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-xs font-medium text-[#0F1111] shadow-xs cursor-pointer"
        >
          Proceed to checkout ({count})
        </button>
        <button
          type="button"
          onClick={onGoToCartPage}
          className="w-full py-1.5 px-3 rounded-full border border-[#D5D9D9] bg-white hover:bg-[#F0F2F2] text-xs font-medium text-[#0F1111] cursor-pointer"
        >
          Go to Cart
        </button>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. Full In-Page Amazon.sg Shopping Cart & Checkout View                     */
/* -------------------------------------------------------------------------- */
interface CartPageViewProps {
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  selectedLocation: string;
  onBackToProduct: () => void;
  onPlaceOrder: (paymentMethod: string) => OrderRecord;
  initialCheckoutOpen?: boolean;
}

export const CartPageView: React.FC<CartPageViewProps> = ({
  items,
  onUpdateQty,
  onRemoveItem,
  selectedLocation,
  onBackToProduct,
  onPlaceOrder,
  initialCheckoutOpen = false,
}) => {
  const [showCheckout, setShowCheckout] = useState(initialCheckoutOpen);
  const [paymentMethod, setPaymentMethod] = useState('PayNow (Instant SG)');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const record = onPlaceOrder(paymentMethod);
    setConfirmedOrder(record);
    setShowCheckout(false);
  };

  return (
    <div className="bg-[#EAEDED] min-h-[calc(100vh-96px)] py-6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 space-y-4">
        <button
          type="button"
          onClick={onBackToProduct}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Razer Viper V4 Pro Wireless</span>
        </button>

        {confirmedOrder ? (
          <div className="bg-white rounded-md border border-[#D5D9D9] p-6 max-w-2xl space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#007600] shrink-0 mt-0.5" />
              <div>
                <h1 className="text-xl font-bold text-[#007600]">
                  Order #{confirmedOrder.orderId} Confirmed — Preparing Shipment
                </h1>
                <p className="text-sm text-[#0F1111] mt-1">
                  Delivering Tomorrow to{' '}
                  <span className="font-semibold">{confirmedOrder.address}</span>
                </p>
              </div>
            </div>

            <div className="border-t border-[#E7E7E7] pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#565959]">Payment method:</span>
                <span className="font-medium">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565959]">Total paid (incl. GST):</span>
                <span className="font-bold text-[#B12704] tabular-nums">
                  S${confirmedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onBackToProduct}
              className="px-5 py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-xs font-medium text-[#0F1111] cursor-pointer"
            >
              Continue shopping on Amazon.sg
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Main Cart List or Checkout Form */}
            <div className="lg:col-span-9 bg-white rounded-md border border-[#D5D9D9] p-5 sm:p-6">
              <div className="flex items-baseline justify-between border-b border-[#E7E7E7] pb-3 mb-4">
                <h1 className="text-2xl font-medium text-[#0F1111]">
                  {showCheckout ? 'Checkout' : 'Shopping Cart'}
                </h1>
                {!showCheckout && items.length > 0 && (
                  <span className="text-xs text-[#565959] hidden sm:inline">Price</span>
                )}
              </div>

              {items.length === 0 ? (
                <div className="py-12 space-y-3">
                  <p className="text-base font-semibold text-[#0F1111]">
                    Your Amazon Cart is empty.
                  </p>
                  <p className="text-xs text-[#565959]">
                    Return to the Razer Viper V4 Pro product page to add items to your persistent
                    cart.
                  </p>
                  <button
                    type="button"
                    onClick={onBackToProduct}
                    className="px-4 py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-xs font-medium text-[#0F1111] cursor-pointer"
                  >
                    Shop Razer Viper V4 Pro
                  </button>
                </div>
              ) : showCheckout ? (
                <form id="page-checkout-form" onSubmit={handleConfirmOrder} className="space-y-5">
                  <div className="border-b border-[#E7E7E7] pb-4 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 text-sm">
                    <span className="font-bold text-[#0F1111]">1. Delivery address</span>
                    <div>
                      <div className="font-medium text-[#0F1111]">{selectedLocation}</div>
                      <div className="text-xs text-[#007600] mt-0.5">
                        FREE Next-Day Delivery applied
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-[#E7E7E7] pb-4 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 text-sm">
                    <span className="font-bold text-[#0F1111]">2. Payment method</span>
                    <div className="space-y-2">
                      {[
                        'PayNow (Instant SG)',
                        'Visa ending in 4242',
                        'Cash on Delivery (COD)',
                      ].map((m) => (
                        <label key={m} className="flex items-center gap-2.5 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="cart-payment"
                            checked={paymentMethod === m}
                            onChange={() => setPaymentMethod(m)}
                            className="accent-[#007185]"
                          />
                          <span className="font-medium text-[#0F1111]">{m}</span>
                        </label>
                      ))}
                      {paymentMethod.includes('Cash on Delivery') && (
                        <p className="text-xs text-[#565959] pl-6">
                          Total payable to courier on arrival: S${subtotal.toFixed(2)} (Free
                          shipping threshold met).
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="px-4 py-2 rounded-full border border-[#D5D9D9] bg-white hover:bg-[#F7F8F8] text-xs font-medium cursor-pointer"
                    >
                      Back to Cart
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-xs font-bold text-[#0F1111] cursor-pointer"
                    >
                      Place your order (S${subtotal.toFixed(2)})
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="divide-y divide-[#E7E7E7]">
                    {items.map((item) => (
                      <div key={item.id} className="py-4 flex flex-col sm:flex-row gap-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-32 h-24 object-contain rounded border border-[#E7E7E7] bg-white p-1.5 shrink-0"
                        />

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-4">
                            <h2 className="text-base font-medium text-[#0F1111] leading-snug">
                              {item.title}
                            </h2>
                            <span className="text-base font-bold text-[#0F1111] tabular-nums shrink-0">
                              S${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>

                          <p className="text-xs text-[#007600] font-medium">In Stock</p>
                          <p className="text-xs text-[#565959]">{item.subtitle}</p>
                          <p className="text-xs text-[#565959]">
                            Eligible for FREE Delivery &amp; 30-day Returns
                          </p>

                          <div className="flex flex-wrap items-center gap-4 pt-2">
                            <div className="inline-flex items-center rounded-md border border-[#D5D9D9] bg-[#F0F2F2]">
                              <button
                                type="button"
                                onClick={() => onUpdateQty(item.id, -1)}
                                aria-label="Decrease quantity"
                                className="px-2 py-1 hover:bg-[#E3E6E6] cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-xs font-semibold tabular-nums">
                                Qty: {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQty(item.id, 1)}
                                aria-label="Increase quantity"
                                className="px-2 py-1 hover:bg-[#E3E6E6] cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              className="text-xs text-[#007185] hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#E7E7E7] text-right text-base">
                    Subtotal ({count} {count === 1 ? 'item' : 'items'}):{' '}
                    <span className="font-bold tabular-nums">S${subtotal.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Right: Persistent Cart Summary Box */}
            {items.length > 0 && (
              <aside className="lg:col-span-3 bg-white rounded-md border border-[#D5D9D9] p-5 space-y-3.5">
                <div className="flex items-start gap-2 text-xs text-[#007600]">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Your order qualifies for FREE Singapore Delivery.</span>
                </div>

                <div className="text-base text-[#0F1111]">
                  Subtotal ({count} {count === 1 ? 'item' : 'items'}):{' '}
                  <span className="font-bold tabular-nums">S${subtotal.toFixed(2)}</span>
                </div>

                {!showCheckout && (
                  <button
                    type="button"
                    onClick={() => setShowCheckout(true)}
                    className="w-full py-2.5 px-4 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-xs font-medium text-[#0F1111] shadow-xs cursor-pointer"
                  >
                    Proceed to checkout
                  </button>
                )}
              </aside>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
