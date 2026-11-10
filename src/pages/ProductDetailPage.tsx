import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  Minus,
  Plus,
  Send,
  ShieldCheck,
  ZoomIn,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductArtwork } from '../components/ProductArtwork';
import { ProductCard } from '../components/ProductCard';
import { getProductWhatsAppUrl } from '../utils/whatsapp';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, openProductEnquiryModal, addToCart } = useStore();

  const product = products.find((p) => p.slug === slug || p.id === slug);

  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    'description' | 'specifications' | 'compatibility' | 'additional'
  >('description');

  if (!product) {
    return (
      <div className="min-h-[60vh] bg-[#14151B] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-white uppercase">Product Not Found</h1>
        <p className="text-sm text-[#B8BBC4]">
          The requested product could not be found in our catalogue.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#F10D17] text-white text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </Link>
      </div>
    );
  }

  const galleryViews = [
    { label: 'Studio Front View', index: 0 },
    { label: 'Detailed Close-up', index: 1 },
    { label: 'Reference Photo', index: 2 },
  ];

  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categorySlug === product.categorySlug || p.brand === product.brand)
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#14151B] py-10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#B8BBC4] mb-8">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-white">
            Products
          </Link>
          <span>/</span>
          <Link to={`/category/${product.categorySlug}`} className="hover:text-white">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-white font-medium">{product.name}</span>
        </div>

        {/* Contiguous 2-Column Product Detail Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-[#1C1D24] border border-white/10 rounded-2xl p-6 sm:p-8">
          {/* LEFT SECTION: Product Gallery + Thumbnails + Zoom */}
          <div className="lg:col-span-6 space-y-4">
            <div
              onClick={() => setIsZoomed((z) => !z)}
              className="relative rounded-xl overflow-hidden border border-white/10 cursor-zoom-in group h-[340px] sm:h-[420px]"
            >
              <ProductArtwork
                visualType={product.visualType}
                brand={product.brand}
                name={product.name}
                customImage={product.images?.[0]}
                viewIndex={selectedGalleryIdx}
                className={`w-full h-full transition-transform duration-300 ${
                  isZoomed ? 'scale-125' : 'group-hover:scale-105'
                }`}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed((z) => !z);
                }}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs flex items-center gap-1.5"
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#F10D17]" />
                <span>{isZoomed ? 'Reset Zoom' : 'Click to Zoom'}</span>
              </button>
            </div>

            {/* Thumbnail Selector */}
            <div className="grid grid-cols-3 gap-3">
              {galleryViews.map((view) => (
                <button
                  key={view.index}
                  type="button"
                  onClick={() => {
                    setSelectedGalleryIdx(view.index);
                    setIsZoomed(false);
                  }}
                  className={`rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedGalleryIdx === view.index
                      ? 'border-[#F10D17]'
                      : 'border-white/10 opacity-75 hover:opacity-100'
                  }`}
                >
                  <ProductArtwork
                    visualType={product.visualType}
                    brand={product.brand}
                    name={`${product.name} - ${view.label}`}
                    customImage={product.images?.[0]}
                    viewIndex={view.index}
                    className="h-20 w-full"
                  />
                  <span className="block py-1 text-[10px] font-medium text-[#B8BBC4] bg-[#14151B]">
                    {view.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SECTION: Product Details & Enquiry Conversion Module */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Unboxed Metadata Line */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#B8BBC4] uppercase tracking-wider">
                <span className="font-bold text-white">{product.brand}</span>
                <span>·</span>
                <span>{product.category}</span>
                <span>·</span>
                <span className="font-mono-num">SKU: {product.sku}</span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white uppercase leading-tight">
                {product.name}
              </h1>

              {/* Price & Availability Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 px-4 rounded-xl bg-[#14151B] border border-white/10">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#B8BBC4] block">
                    Store Pricing
                  </span>
                  {product.price !== null && product.price > 0 ? (
                    <span className="font-mono-num text-2xl font-bold text-white">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="font-display text-xl font-bold text-[#FACC15] uppercase">
                      Contact for Price
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[11px] uppercase tracking-wider text-[#B8BBC4] block">
                    Availability Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{product.availability}</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#D1D5DB] leading-relaxed">{product.shortDescription}</p>

              {/* Key Specifications Quick Grid */}
              {product.tyreSpecs && product.tyreSpecs.width && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-[#14151B] border border-white/10 text-center">
                    <span className="text-[10px] text-[#B8BBC4] block">Width</span>
                    <span className="font-mono-num text-sm font-bold text-white">
                      {product.tyreSpecs.width} mm
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#14151B] border border-white/10 text-center">
                    <span className="text-[10px] text-[#B8BBC4] block">Profile</span>
                    <span className="font-mono-num text-sm font-bold text-white">
                      {product.tyreSpecs.aspectRatio}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#14151B] border border-white/10 text-center">
                    <span className="text-[10px] text-[#B8BBC4] block">Rim Size</span>
                    <span className="font-mono-num text-sm font-bold text-white">
                      {product.tyreSpecs.rimDiameter}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#14151B] border border-white/10 text-center">
                    <span className="text-[10px] text-[#B8BBC4] block">Load Index</span>
                    <span className="font-mono-num text-sm font-bold text-white">
                      {product.tyreSpecs.loadIndex || 'Std'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#14151B] border border-white/10 text-center">
                    <span className="text-[10px] text-[#B8BBC4] block">Speed Rating</span>
                    <span className="font-mono-num text-sm font-bold text-white">
                      {product.tyreSpecs.speedRating || 'Std'}
                    </span>
                  </div>
                </div>
              )}

              {/* Vehicle Compatibility Summary */}
              <div className="p-3.5 rounded-xl bg-[#14151B]/60 border border-white/10 text-xs space-y-1">
                <div className="text-[#B8BBC4]">
                  <strong className="text-white">Vehicle Types: </strong>
                  {product.vehicleTypes.join(' · ')}
                </div>
                <div className="text-[#B8BBC4]">
                  <strong className="text-white">Compatible Models: </strong>
                  {product.compatibleModels.join(', ')}
                </div>
              </div>
            </div>

            {/* Quantity & Primary/Secondary/WhatsApp CTAs */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#B8BBC4]">Quantity:</span>
                  <div className="flex items-center bg-[#14151B] border border-white/15 rounded-lg px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1 text-[#B8BBC4] hover:text-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-mono-num text-sm font-bold text-white px-4">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      className="p-1 text-[#B8BBC4] hover:text-white"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <span className="text-xs text-[#B8BBC4] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#F10D17]" />
                  <span>Professional installation available at our Kolkata showroom</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => openProductEnquiryModal(product, quantity)}
                  className="py-3.5 px-5 rounded-xl bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>ENQUIRE NOW</span>
                </button>

                <button
                  type="button"
                  onClick={() => addToCart(product, quantity)}
                  className="py-3.5 px-5 rounded-xl bg-[#14151B] hover:bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ClipboardList className="w-4 h-4 text-[#F10D17]" />
                  <span>ADD TO ENQUIRY CART</span>
                </button>
              </div>

              <a
                href={getProductWhatsAppUrl(product, quantity)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>CHAT ON WHATSAPP FOR INSTANT QUOTE</span>
              </a>
            </div>
          </div>
        </div>

        {/* PRODUCT INFORMATION TABS */}
        <div className="mt-10 bg-[#1C1D24] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex flex-wrap border-b border-white/10 bg-[#14151B]">
            {[
              { id: 'description', label: '1. Description' },
              { id: 'specifications', label: '2. Specifications' },
              { id: 'compatibility', label: '3. Vehicle Compatibility' },
              { id: 'additional', label: '4. Additional Information' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#1C1D24] text-[#F10D17] border-b-2 border-[#F10D17]'
                    : 'text-[#B8BBC4] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8 text-sm text-[#D1D5DB] leading-relaxed">
            {activeTab === 'description' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="font-display text-xl font-bold text-white uppercase">
                  Product Overview – {product.name}
                </h3>
                <p>{product.description}</p>
                <p>
                  Available at <strong>Ghosh Tyre Zone</strong> (38C, Raja Dinendra Street, Garpar,
                  Machuabazar, Kolkata – 700009). Every product is inspected by our technical team
                  with optional on-site fitment, wheel balancing, and alignment support.
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-2xl">
                <h3 className="font-display text-xl font-bold text-white uppercase mb-4">
                  Technical Specifications
                </h3>
                <div className="divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-2 p-3.5 bg-[#14151B]">
                    <span className="text-[#B8BBC4] font-medium">Brand</span>
                    <span className="text-white font-semibold">{product.brand}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5">
                    <span className="text-[#B8BBC4] font-medium">Product Code / SKU</span>
                    <span className="text-white font-mono-num">{product.sku}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3.5 bg-[#14151B]">
                    <span className="text-[#B8BBC4] font-medium">Category</span>
                    <span className="text-white">{product.category}</span>
                  </div>
                  {Object.entries(product.specifications || {}).map(([key, val], idx) => (
                    <div
                      key={key}
                      className={`grid grid-cols-2 p-3.5 ${idx % 2 === 1 ? 'bg-[#14151B]' : ''}`}
                    >
                      <span className="text-[#B8BBC4] font-medium">{key}</span>
                      <span className="text-white">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'compatibility' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="font-display text-xl font-bold text-white uppercase">
                  Compatible Vehicle Segments & Models
                </h3>
                <p className="text-xs text-[#B8BBC4]">
                  Suitable for the following vehicle segments and popular models:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#14151B] border border-white/10">
                    <span className="text-xs uppercase tracking-wider text-[#F10D17] font-bold block mb-2">
                      Vehicle Segments
                    </span>
                    <p className="text-white font-medium">{product.vehicleTypes.join(' · ')}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#14151B] border border-white/10">
                    <span className="text-xs uppercase tracking-wider text-[#F10D17] font-bold block mb-2">
                      Popular Compatible Vehicles
                    </span>
                    <p className="text-white font-medium">{product.compatibleModels.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'additional' && (
              <div className="space-y-3 max-w-3xl">
                <h3 className="font-display text-xl font-bold text-white uppercase">
                  Store Fitment & Enquiry Notes
                </h3>
                <p>
                  {product.additionalInfo ||
                    'Submit an enquiry or chat with us on WhatsApp with your vehicle registration year and variant for exact fitment confirmation and workshop appointment scheduling.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase mb-6">
              Related & Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
