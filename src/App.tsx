import { useCallback, useEffect, useState } from 'react';
import {
  BUNDLE_ADDONS,
  GALLERY_IMAGES,
  PRODUCT_VARIANTS,
  ProductBundleOption,
  ProductVariant,
  SINGAPORE_LOCATIONS,
  STYLE_OPTIONS,
} from './data/razerProductData';
import { AmazonHeader } from './components/AmazonHeader';
import { ProductGallery } from './components/ProductGallery';
import { ProductInfoCenter } from './components/ProductInfoCenter';
import { ProductBuyBox } from './components/ProductBuyBox';
import { ManufacturerAndCompare } from './components/ManufacturerAndCompare';
import { ReviewsAndQASection } from './components/ReviewsAndQASection';
import {
  CartDrawer,
  CartItem,
  ImageLightboxModal,
  LocationModal,
  OrderRecord,
  OrdersAndSavedModal,
} from './components/AmazonDrawersAndModals';

export default function App() {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(PRODUCT_VARIANTS[0]);
  const [selectedStyle, setSelectedStyle] = useState<ProductBundleOption>(STYLE_OPTIONS[0]);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedLocation, setSelectedLocation] = useState<string>(SINGAPORE_LOCATIONS[0]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(false);

  // Ensure light theme canvas on document root
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Keyboard navigation for Lightbox & Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
        setIsLocationOpen(false);
        setIsLightboxOpen(false);
        setIsOrdersOpen(false);
      } else if (isLightboxOpen && e.key === 'ArrowRight') {
        setActiveImageIdx((i) => (i + 1) % GALLERY_IMAGES.length);
      } else if (isLightboxOpen && e.key === 'ArrowLeft') {
        setActiveImageIdx((i) => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLightboxOpen]);

  const handleSelectVariant = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant);
    const matchingIdx = GALLERY_IMAGES.findIndex((img) => img.variantFilter === variant.id);
    if (matchingIdx !== -1) {
      setActiveImageIdx(matchingIdx);
    } else if (variant.id === 'carbon') {
      setActiveImageIdx(2);
    }
  }, []);

  const addItemToCart = useCallback(
    (newItem: CartItem) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === newItem.id);
        if (existing) {
          return prev.map((i) =>
            i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
          );
        }
        return [...prev, newItem];
      });
    },
    []
  );

  const handleAddMainToCart = useCallback(
    (openDrawer = false) => {
      const unitPrice = selectedVariant.price + selectedStyle.priceDelta;
      addItemToCart({
        id: `viper-${selectedVariant.id}-${selectedStyle.id}`,
        title: `Razer Viper V4 Pro Wireless Esports Gaming Mouse (${selectedVariant.name})`,
        subtitle: selectedStyle.label,
        price: unitPrice,
        image: selectedVariant.heroImage,
        quantity,
      });
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
      if (openDrawer) setIsCartOpen(true);
    },
    [selectedVariant, selectedStyle, quantity, addItemToCart]
  );

  const handleAddBundleToCart = useCallback(
    (addonIds: string[]) => {
      addItemToCart({
        id: `viper-${selectedVariant.id}-mouse-only`,
        title: `Razer Viper V4 Pro Wireless Esports Gaming Mouse (${selectedVariant.name})`,
        subtitle: 'Standard retail package',
        price: selectedVariant.price,
        image: selectedVariant.heroImage,
        quantity: 1,
      });

      addonIds.forEach((id) => {
        const addon = BUNDLE_ADDONS.find((a) => a.id === id);
        if (addon) {
          addItemToCart({
            id: addon.id,
            title: addon.title,
            subtitle: 'Bundle accessory',
            price: addon.price,
            image: addon.image,
            quantity: 1,
          });
        }
      });
      setIsCartOpen(true);
    },
    [selectedVariant, addItemToCart]
  );

  const handleUpdateQty = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handlePlaceOrder = useCallback(
    (paymentMethod: string): OrderRecord => {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const record: OrderRecord = {
        orderId: `SG-${Math.floor(100 + Math.random() * 899)}-${Math.floor(
          10000 + Math.random() * 89999
        )}`,
        date: '25 November 2026',
        total,
        paymentMethod,
        address: selectedLocation,
        items: [...cart],
      };
      setOrders((prev) => [record, ...prev]);
      setCart([]);
      return record;
    },
    [cart, selectedLocation]
  );

  const scrollToSection = useCallback((id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSearchSubmit = useCallback(
    (q: string) => {
      const low = q.toLowerCase();
      if (low.includes('mat') || low.includes('gigantus') || low.includes('grip')) {
        scrollToSection('bundle-section');
      } else if (low.includes('dongle') || low.includes('8000')) {
        setActiveImageIdx(3);
        scrollToSection('top');
      } else {
        scrollToSection('top');
      }
    },
    [scrollToSection]
  );

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unitPrice = selectedVariant.price + selectedStyle.priceDelta;

  return (
    <div id="top" className="min-h-screen flex flex-col bg-white text-[#0F1111]">
      <AmazonHeader
        selectedLocation={selectedLocation}
        onOpenLocationModal={() => setIsLocationOpen(true)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onScrollToSection={scrollToSection}
        onSearchSubmit={handleSearchSubmit}
      />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 pt-3 pb-24 lg:pb-14">
        {/* Category Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#565959] mb-4 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => scrollToSection('top')}
            className="hover:underline hover:text-[#C7511F] cursor-pointer"
          >
            Electronics
          </button>
          <span aria-hidden="true">›</span>
          <button
            type="button"
            onClick={() => scrollToSection('tech-specs')}
            className="hover:underline hover:text-[#C7511F] cursor-pointer"
          >
            Computers &amp; Accessories
          </button>
          <span aria-hidden="true">›</span>
          <button
            type="button"
            onClick={() => scrollToSection('manufacturer-section')}
            className="hover:underline hover:text-[#C7511F] cursor-pointer"
          >
            Mice
          </button>
          <span aria-hidden="true">›</span>
          <span className="text-[#0F1111] font-medium">Gaming Mice</span>
        </nav>

        {/* Main 3-Column PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          {/* Left: Sticky Image Gallery (5 cols) */}
          <div className="lg:col-span-5">
            <ProductGallery
              images={GALLERY_IMAGES}
              activeIndex={activeImageIdx}
              onSelectIndex={setActiveImageIdx}
              onOpenLightbox={() => setIsLightboxOpen(true)}
            />
          </div>

          {/* Center: Product Title, Variants, Specs & Bullets (4 cols) */}
          <div className="lg:col-span-4">
            <ProductInfoCenter
              variants={PRODUCT_VARIANTS}
              selectedVariant={selectedVariant}
              onSelectVariant={handleSelectVariant}
              styleOptions={STYLE_OPTIONS}
              selectedStyle={selectedStyle}
              onSelectStyle={setSelectedStyle}
              onJumpToReviews={() => scrollToSection('reviews-section')}
              onJumpToManufacturer={() => scrollToSection('manufacturer-section')}
            />
          </div>

          {/* Right: Contiguous Sticky Buy Box (3 cols) */}
          <div className="lg:col-span-3">
            <ProductBuyBox
              variant={selectedVariant}
              styleOption={selectedStyle}
              quantity={quantity}
              onQuantityChange={setQuantity}
              locationLabel={selectedLocation}
              onOpenLocationModal={() => setIsLocationOpen(true)}
              onAddToCart={() => handleAddMainToCart(true)}
              onBuyNow={() => handleAddMainToCart(true)}
              isSaved={isSaved}
              onToggleSaved={() => setIsSaved((prev) => !prev)}
              justAdded={justAdded}
            />
          </div>
        </div>

        {/* Frequently Bought Together, A+ Content, Compare & Technical Details */}
        <ManufacturerAndCompare
          selectedVariant={selectedVariant}
          onAddBundleToCart={handleAddBundleToCart}
        />

        {/* Customer Q&A & Reviews */}
        <ReviewsAndQASection />
      </main>

      {/* Mobile Sticky Bottom Bar (<= 15% viewport height) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#D5D9D9] px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="text-base font-bold text-[#0F1111] tabular-nums">
            S${(unitPrice * quantity).toFixed(2)}
          </div>
          <div className="text-[11px] text-[#007600] font-medium">FREE Tomorrow Delivery</div>
        </div>
        <button
          type="button"
          onClick={() => handleAddMainToCart(true)}
          className="px-5 py-2.5 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-xs font-semibold text-[#0F1111] whitespace-nowrap cursor-pointer"
        >
          Add to Cart
        </button>
      </div>

      {/* Amazon.sg Footer */}
      <footer className="bg-[#232F3E] text-white mt-auto">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-full py-3 bg-[#37475A] hover:bg-[#485769] text-xs font-medium text-white transition-colors cursor-pointer"
        >
          Back to top
        </button>

        <div className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#CCCCCC] border-t border-white/10">
          <div className="flex items-center gap-4">
            <span className="font-bold text-white text-sm">amazon.sg</span>
            <span>Singapore · English · SGD (S$)</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => setIsLocationOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Singapore Delivery
            </button>
            <button
              type="button"
              onClick={() => setIsOrdersOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Returns &amp; Orders
            </button>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="hover:underline cursor-pointer"
            >
              Shopping Cart ({totalCartCount})
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Drawers & Modals */}
      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        selectedLocation={selectedLocation}
        onPlaceOrder={handlePlaceOrder}
      />

      <LocationModal
        open={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        selected={selectedLocation}
        onSelect={setSelectedLocation}
      />

      <ImageLightboxModal
        open={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={GALLERY_IMAGES}
        activeIndex={activeImageIdx}
        onSelectIndex={setActiveImageIdx}
      />

      <OrdersAndSavedModal
        open={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        isSaved={isSaved}
        onRemoveSaved={() => setIsSaved(false)}
      />
    </div>
  );
}
