export interface ProductVariant {
  id: 'black' | 'white' | 'carbon';
  name: string;
  weight: string;
  price: number;
  listPrice: number;
  swatchColor: string;
  heroImage: string;
  stockNote: string;
}

export interface ProductBundleOption {
  id: 'mouse-only' | 'strider-bundle';
  label: string;
  priceDelta: number;
  sublabel: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  variantFilter?: 'black' | 'white' | 'carbon';
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  title: string;
  date: string;
  variant: string;
  verified: boolean;
  body: string;
  helpfulCount: number;
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
  author: string;
  date: string;
  votes: number;
}

export interface BundleAddon {
  id: string;
  title: string;
  price: number;
  image: string;
  rating: number;
}

export const PRODUCT_IMAGES = {
  blackHero: '/src/assets/images/viper_black_hero_1795665480392.jpg',
  whiteHero: '/src/assets/images/viper_white_hero_1795665480108.jpg',
  sideProfile: '/src/assets/images/viper_side_profile_1795665480572.jpg',
  dongleKit: '/src/assets/images/viper_dongle_kit_1795665481625.jpg',
  aplusBanner: '/src/assets/images/viper_aplus_banner_1795665482140.jpg',
};

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'img-black-hero',
    src: PRODUCT_IMAGES.blackHero,
    alt: 'Razer Viper V4 Pro Wireless Esports Gaming Mouse in Matte Black front three-quarter view',
    caption: 'Matte Black — 49g Ultralight Symmetrical Chassis',
    variantFilter: 'black',
  },
  {
    id: 'img-white-hero',
    src: PRODUCT_IMAGES.whiteHero,
    alt: 'Razer Viper V4 Pro Wireless Esports Gaming Mouse in Matte White front three-quarter view',
    caption: 'Matte White — Smooth-Touch Esports Coating',
    variantFilter: 'white',
  },
  {
    id: 'img-side',
    src: PRODUCT_IMAGES.sideProfile,
    alt: 'Razer Viper V4 Pro low-profile symmetrical side curvature and dual thumb buttons',
    caption: 'Ergonomic Low-Profile Hump & Tactile Side Switches',
  },
  {
    id: 'img-kit',
    src: PRODUCT_IMAGES.dongleKit,
    alt: 'Razer Viper V4 Pro included 8000Hz HyperPolling Wireless Dongle and braided USB-C cable',
    caption: 'In the Box: Mouse, 8K HyperPolling Dongle & Speedflex USB-C Cable',
  },
  {
    id: 'img-desk',
    src: PRODUCT_IMAGES.aplusBanner,
    alt: 'Razer Viper V4 Pro on competitive gaming desk setup',
    caption: 'Tournament-Grade Precision on Micro-Weave Surfaces',
  },
];

export const PRODUCT_VARIANTS: ProductVariant[] = [
  {
    id: 'black',
    name: 'Black',
    weight: '49g',
    price: 199.0,
    listPrice: 239.0,
    swatchColor: '#18181B',
    heroImage: PRODUCT_IMAGES.blackHero,
    stockNote: 'In Stock',
  },
  {
    id: 'white',
    name: 'White',
    weight: '50g',
    price: 209.0,
    listPrice: 239.0,
    swatchColor: '#F4F4F5',
    heroImage: PRODUCT_IMAGES.whiteHero,
    stockNote: 'In Stock',
  },
  {
    id: 'carbon',
    name: 'Carbon Fiber Edition',
    weight: '45g',
    price: 349.0,
    listPrice: 369.0,
    swatchColor: '#3F3F46',
    heroImage: PRODUCT_IMAGES.sideProfile,
    stockNote: 'Only 4 left in stock',
  },
];

export const STYLE_OPTIONS: ProductBundleOption[] = [
  {
    id: 'mouse-only',
    label: 'Mouse + 8K HyperPolling Dongle',
    priceDelta: 0,
    sublabel: 'Standard retail package',
  },
  {
    id: 'strider-bundle',
    label: 'With Razer Gigantus V2 Mat',
    priceDelta: 39.0,
    sublabel: 'Includes Large micro-weave pad',
  },
];

export const ABOUT_BULLETS: string[] = [
  '49g Ultra-Lightweight Symmetrical Design: Engineered in collaboration with world-class esports pros for effortless micro-adjustments and zero-drag flicks across long tournament sessions.',
  'Razer Focus Pro 50K Optical Sensor Gen-3: Delivers best-in-class precision up to 50,000 DPI, 930 IPS tracking speed, and 90G acceleration with intelligent Frame Sync across glass and cloth surfaces.',
  'True 8,000Hz HyperPolling Wireless Gen-2: Experience ultra-low click and motion latency with the included HyperPolling Wireless Dongle—no separate receiver upgrade required.',
  'Razer Optical Mouse Switches Gen-4 & Optical Scroll Wheel: Rated for 100 million crisp tactile clicks with zero double-click debounce delay and consistent, notch-accurate scrolling.',
  'Up to 180 Hours of Battery Life: Play up to 180 hours at 1,000Hz polling (or up to 45 hours at 8,000Hz) with rapid USB-C Speedflex charging.',
];

export const TECHNICAL_SPECS: { label: string; value: string }[] = [
  { label: 'Brand', value: 'Razer' },
  { label: 'Model Name', value: 'Viper V4 Pro Wireless' },
  { label: 'ASIN', value: 'B0G5QBTC2Q' },
  { label: 'Sensor', value: 'Razer Focus Pro 50K Optical Sensor Gen-3' },
  { label: 'Max Sensitivity (DPI)', value: '50,000 DPI' },
  { label: 'Max Speed / Acceleration', value: '930 IPS / 90 G' },
  { label: 'Polling Rate', value: 'Up to True 8,000 Hz (Wired & Wireless)' },
  { label: 'Switch Type', value: 'Razer Optical Mouse Switches Gen-4 (100M clicks)' },
  { label: 'Scroll Wheel', value: 'Optical Scroll Wheel Encoder' },
  { label: 'Connectivity', value: 'Razer HyperSpeed Wireless Gen-2 / USB Type-C' },
  { label: 'Battery Life', value: 'Up to 180 hrs (1,000 Hz) / 45 hrs (8,000 Hz)' },
  { label: 'Dimensions', value: '127.1 mm × 63.9 mm × 39.9 mm' },
  { label: 'Programmable Buttons', value: '6' },
  { label: 'Included Accessories', value: '8K HyperPolling Dongle, Speedflex USB-C Cable, Grip Tape' },
];

export const COMPARE_MODELS = [
  {
    name: 'Razer Viper V4 Pro',
    highlight: true,
    price: 'S$199.00',
    weight: '49 g',
    sensor: 'Focus Pro 50K Gen-3',
    polling: '8,000 Hz Wireless',
    battery: 'Up to 180 hours',
    switches: 'Optical Gen-4',
    image: PRODUCT_IMAGES.blackHero,
  },
  {
    name: 'Razer Viper V3 Pro',
    highlight: false,
    price: 'S$219.00',
    weight: '54 g',
    sensor: 'Focus Pro 35K Gen-2',
    polling: '8,000 Hz Wireless',
    battery: 'Up to 95 hours',
    switches: 'Optical Gen-3',
    image: PRODUCT_IMAGES.whiteHero,
  },
  {
    name: 'Razer Viper V3 HyperSpeed',
    highlight: false,
    price: 'S$99.00',
    weight: '82 g (with AA)',
    sensor: 'Focus Pro 30K',
    polling: '1,000 Hz (8K ready)',
    battery: 'Up to 280 hours (AA)',
    switches: 'Mechanical Gen-2',
    image: PRODUCT_IMAGES.sideProfile,
  },
];

export const BUNDLE_ADDONS: BundleAddon[] = [
  {
    id: 'addon-pad',
    title: 'Razer Gigantus V2 Cloth Gaming Mouse Pad (Large)',
    price: 39.0,
    image: PRODUCT_IMAGES.aplusBanner,
    rating: 4.7,
  },
  {
    id: 'addon-grips',
    title: 'Razer Universal Anti-Slip Mouse Grip Tape Set',
    price: 16.9,
    image: PRODUCT_IMAGES.dongleKit,
    rating: 4.6,
  },
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Marcus Tan',
    rating: 5,
    title: '49g weight + 180h battery is unbeatable for Valorant & CS2',
    date: 'Reviewed in Singapore on 18 November 2026',
    variant: 'Colour: Black | Style: Mouse + 8K HyperPolling Dongle',
    verified: true,
    body: 'Upgraded from the Viper V3 Pro and immediately noticed the lighter shell balance and crisper Gen-4 clicks. The optical scroll wheel feels super defined during bunny hops, and battery easily lasts me two full weeks at 2,000Hz polling. Arrived next morning with Amazon Prime Singapore.',
    helpfulCount: 42,
  },
  {
    id: 'rev-2',
    author: 'Cheryl Lim',
    rating: 5,
    title: 'Coating grips nicely even in humid Singapore weather',
    date: 'Reviewed in Singapore on 12 November 2026',
    variant: 'Colour: White | Style: Mouse + 8K HyperPolling Dongle',
    verified: true,
    body: 'Picked up the White edition and the smooth matte coating stays grippy without needing extra tape. Tracking on my glass pad with the Focus Pro 50K sensor is rock solid with zero spin-outs.',
    helpfulCount: 19,
  },
  {
    id: 'rev-3',
    author: 'Daniel Ng',
    rating: 4,
    title: 'Incredible wireless latency, just note battery drops at 8K Hz',
    date: 'Reviewed in Singapore on 4 November 2026',
    variant: 'Colour: Black | Style: Mouse + 8K HyperPolling Dongle',
    verified: true,
    body: 'At 1,000Hz or 2,000Hz the battery lasts forever. When running full 8,000Hz in competitive matches I recharge roughly every 4 days, which takes under an hour over USB-C. Best symmetrical shape on the market right now.',
    helpfulCount: 11,
  },
  {
    id: 'rev-4',
    author: 'Arjun Nair',
    rating: 5,
    title: 'Zero pre-travel on main clicks and huge PTFE skates',
    date: 'Reviewed in Singapore on 29 October 2026',
    variant: 'Colour: Black | Style: With Razer Gigantus V2 Mat',
    verified: true,
    body: 'Out of the box the skates glide effortlessly and the included 8K dongle pairs automatically. No flex or creaking anywhere on the 49g shell.',
    helpfulCount: 7,
  },
];

export const INITIAL_QA: QAItem[] = [
  {
    id: 'qa-1',
    question: 'Does the Razer 8,000Hz HyperPolling Wireless Dongle come inside the box?',
    answer: 'Yes, the Razer HyperPolling Wireless Dongle and braided USB Type-C Speedflex cable are included inside the retail box—you do not need to buy a separate dongle.',
    author: 'Razer Official SG',
    date: '15 November 2026',
    votes: 28,
  },
  {
    id: 'qa-2',
    question: 'What is the real weight difference between the Black and White colourways?',
    answer: 'The Black edition weighs approximately 49g, while the White edition weighs approximately 50g due to the smooth-touch white finish layer.',
    author: 'AmazonSG Tech Desk',
    date: '10 November 2026',
    votes: 16,
  },
  {
    id: 'qa-3',
    question: 'Can I save DPI and polling rate profiles without running Razer Synapse in the background?',
    answer: 'Yes. Configure your DPI stages, lift-off distance, and polling rate once in Synapse (or via web config), save them to onboard memory, and close the software.',
    author: 'Kenji W.',
    date: '2 November 2026',
    votes: 9,
  },
];

export const SINGAPORE_LOCATIONS = [
  'Singapore 018956 (Marina Bay)',
  'Singapore 238801 (Orchard)',
  'Singapore 529510 (Tampines)',
  'Singapore 608526 (Jurong East)',
  'Singapore 138577 (One-North)',
];
