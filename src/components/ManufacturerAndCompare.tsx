import React, { useState } from 'react';
import { BatteryCharging, CheckSquare, Cpu, Feather, Plus, Square, Zap } from 'lucide-react';
import {
  BUNDLE_ADDONS,
  COMPARE_MODELS,
  PRODUCT_IMAGES,
  ProductVariant,
  TECHNICAL_SPECS,
} from '../data/razerProductData';

interface ManufacturerAndCompareProps {
  selectedVariant: ProductVariant;
  onAddBundleToCart: (addonIds: string[]) => void;
}

export const ManufacturerAndCompare: React.FC<ManufacturerAndCompareProps> = ({
  selectedVariant,
  onAddBundleToCart,
}) => {
  const [checkedAddons, setCheckedAddons] = useState<string[]>(['addon-pad']);

  const toggleAddon = (id: string) => {
    setCheckedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addonTotal = BUNDLE_ADDONS.filter((a) => checkedAddons.includes(a.id)).reduce(
    (sum, item) => sum + item.price,
    0
  );
  const bundleTotal = selectedVariant.price + addonTotal;

  return (
    <div className="space-y-10 mt-10 pt-8 border-t border-[#E7E7E7]">
      {/* Frequently Bought Together */}
      <section id="bundle-section" aria-labelledby="bundle-heading">
        <h2 id="bundle-heading" className="text-lg font-bold text-[#0F1111] mb-4">
          Frequently bought together
        </h2>

        <div className="rounded-lg border border-[#D5D9D9] bg-white p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-4 flex-1">
            {/* Visual Strip */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-24 h-20 rounded border border-[#E7E7E7] bg-white p-1.5 flex items-center justify-center">
                <img
                  src={selectedVariant.heroImage}
                  alt={selectedVariant.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              {BUNDLE_ADDONS.map((addon) => {
                const active = checkedAddons.includes(addon.id);
                return (
                  <React.Fragment key={addon.id}>
                    <Plus className="w-4 h-4 text-[#565959]" />
                    <div
                      className={`w-24 h-20 rounded border bg-white p-1.5 flex items-center justify-center transition-opacity ${
                        active ? 'border-[#E7E7E7] opacity-100' : 'border-dashed border-[#D5D9D9] opacity-40'
                      }`}
                    >
                      <img
                        src={addon.image}
                        alt={addon.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-xs"
                      />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 text-[13px]">
              <div className="flex items-center gap-2 text-[#0F1111]">
                <CheckSquare className="w-4 h-4 text-[#007185] shrink-0" />
                <span>
                  <span className="font-semibold">This item:</span> Razer Viper V4 Pro Wireless (
                  {selectedVariant.name})
                </span>
                <span className="font-semibold tabular-nums ml-auto sm:ml-2">
                  S${selectedVariant.price.toFixed(2)}
                </span>
              </div>

              {BUNDLE_ADDONS.map((addon) => {
                const checked = checkedAddons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className="w-full text-left flex items-center gap-2 text-[#0F1111] hover:text-[#007185] cursor-pointer"
                  >
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-[#007185] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-[#888C8C] shrink-0" />
                    )}
                    <span>{addon.title}</span>
                    <span className="font-semibold tabular-nums ml-auto sm:ml-2">
                      S${addon.price.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full lg:w-64 shrink-0 border-t lg:border-t-0 lg:border-l border-[#E7E7E7] pt-4 lg:pt-0 lg:pl-6 space-y-2.5">
            <div className="text-xs text-[#565959]">
              Total price ({1 + checkedAddons.length}{' '}
              {checkedAddons.length === 0 ? 'item' : 'items'}):
            </div>
            <div className="text-xl font-bold text-[#B12704] tabular-nums">
              S${bundleTotal.toFixed(2)}
            </div>
            <button
              type="button"
              onClick={() => onAddBundleToCart(checkedAddons)}
              className="w-full py-2 px-4 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-xs font-medium text-[#0F1111] shadow-xs transition-colors cursor-pointer"
            >
              Add {1 + checkedAddons.length === 1 ? 'item' : `all ${1 + checkedAddons.length}`} to Cart
            </button>
          </div>
        </div>
      </section>

      {/* From the Manufacturer (A+ Editorial Content) */}
      <section id="manufacturer-section" aria-labelledby="manufacturer-heading" className="space-y-6">
        <h2 id="manufacturer-heading" className="text-lg font-bold text-[#0F1111]">
          From the manufacturer
        </h2>

        {/* Hero Feature Banner */}
        <div className="relative rounded-xl overflow-hidden bg-[#0D1117] text-white">
          <div className="aspect-[16/9] max-h-[420px] w-full relative">
            <img
              src={PRODUCT_IMAGES.aplusBanner}
              alt="Razer Viper V4 Pro competitive esports desk showcase"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#44D62C] mb-1.5">
                For the Pro
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
                49g Ultralight Precision. Zero Compromises.
              </h3>
              <p className="text-sm text-[#E5E7EB] mt-2 leading-relaxed">
                Refined alongside Tier-1 FPS professionals, the Viper V4 Pro combines a sub-50g
                symmetrical shell with true 8,000Hz HyperPolling wireless and up to 180 hours of
                endurance.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Engineering Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Feather,
              title: '49g Ultralight Form',
              desc: 'Structural weight reduction without honeycomb cutouts for locked-in grip confidence.',
            },
            {
              icon: Cpu,
              title: 'Focus Pro 50K Gen-3',
              desc: '50,000 DPI, 930 IPS tracking, and Frame Sync for 99.8% resolution accuracy.',
            },
            {
              icon: Zap,
              title: 'True 8,000Hz Wireless',
              desc: 'Included HyperPolling Gen-2 dongle slashes wireless click & motion latency.',
            },
            {
              icon: BatteryCharging,
              title: '180-Hour Battery',
              desc: 'Play weeks between charges at 1,000Hz or 45 hours straight at full 8,000Hz.',
            },
          ].map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-lg border border-[#E7E7E7] bg-[#F9FAFA] p-4 space-y-2"
              >
                <Icon className="w-5 h-5 text-[#007185]" />
                <h3 className="text-sm font-bold text-[#0F1111]">{pillar.title}</h3>
                <p className="text-xs text-[#565959] leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Compare Viper Lineup Table */}
        <div className="pt-2">
          <h3 className="text-base font-bold text-[#0F1111] mb-3">
            Compare with similar Razer Viper models
          </h3>
          <div className="overflow-x-auto rounded-lg border border-[#D5D9D9]">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[#E7E7E7] bg-[#F7F8F8]">
                  <th className="p-3.5 w-44 font-semibold text-[#565959]">Specification</th>
                  {COMPARE_MODELS.map((m) => (
                    <th
                      key={m.name}
                      className={`p-3.5 min-w-[180px] align-top ${
                        m.highlight ? 'bg-[#F0F8FA]' : ''
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        <img
                          src={m.image}
                          alt={m.name}
                          referrerPolicy="no-referrer"
                          className="w-24 h-16 object-contain bg-white rounded border border-[#E7E7E7] p-1"
                        />
                        <span className="font-bold text-[#0F1111]">
                          {m.name}
                          {m.highlight && (
                            <span className="block text-[11px] font-medium text-[#007185]">
                              This item
                            </span>
                          )}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E7E7]">
                {[
                  { label: 'Price', key: 'price' as const },
                  { label: 'Weight', key: 'weight' as const },
                  { label: 'Optical Sensor', key: 'sensor' as const },
                  { label: 'Max Polling Rate', key: 'polling' as const },
                  { label: 'Battery Life', key: 'battery' as const },
                  { label: 'Switch Tech', key: 'switches' as const },
                ].map((row) => (
                  <tr key={row.label}>
                    <td className="p-3 font-semibold text-[#565959] bg-[#FAFAFA]">
                      {row.label}
                    </td>
                    {COMPARE_MODELS.map((m) => (
                      <td
                        key={`${row.label}-${m.name}`}
                        className={`p-3 tabular-nums text-[#0F1111] ${
                          m.highlight ? 'bg-[#F0F8FA]/60 font-medium' : ''
                        }`}
                      >
                        {m[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Product Information / Technical Details */}
      <section id="tech-specs" aria-labelledby="tech-specs-heading" className="pt-2">
        <h2 id="tech-specs-heading" className="text-lg font-bold text-[#0F1111] mb-3">
          Product information &amp; technical details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 border border-[#D5D9D9] rounded-lg overflow-hidden text-[13px]">
          {TECHNICAL_SPECS.map((spec) => (
            <div
              key={spec.label}
              className="grid grid-cols-[170px_1fr] border-b border-[#E7E7E7] last:border-b-0"
            >
              <div className="px-3.5 py-2.5 bg-[#F3F3F3] font-medium text-[#565959] border-r border-[#E7E7E7]">
                {spec.label}
              </div>
              <div className="px-3.5 py-2.5 bg-white text-[#0F1111]">{spec.value}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
