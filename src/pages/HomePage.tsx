import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Headphones,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BUSINESS_INFO, VERIFIED_BRANDS } from '../data/initialData';
import { ProductArtwork } from '../components/ProductArtwork';
import { ProductCard } from '../components/ProductCard';
import { getWhatsAppUrl } from '../utils/whatsapp';

const HERO_SLIDES = [
  {
    id: 1,
    kicker: 'TRUSTED TYRE & BATTERY EXPERTS IN KOLKATA',
    headline: 'PREMIUM TYRES FOR EVERY JOURNEY',
    subtitle:
      'Trusted Tyre & Battery Experts in Kolkata. Discover genuine products, professional installation and complete wheel care solutions for every vehicle.',
    image: '/assets/aistudio/image_6aa2fd52.png',
    exploreLink: '/category/tyres',
  },
  {
    id: 2,
    kicker: 'HIGH-CRANKING ZERO-MAINTENANCE POWER',
    headline: 'POWER YOUR JOURNEY WITH GENUINE BATTERIES',
    subtitle:
      'Authorized range of fresh car, SUV, two-wheeler and commercial vehicle batteries with computerized alternator testing and instant fitment.',
    image: '/assets/aistudio/image_f3b889b3.png',
    exploreLink: '/category/batteries',
  },
  {
    id: 3,
    kicker: '38C RAJA DINENDRA STREET · KOLKATA',
    headline: 'COMPLETE WHEEL CARE & AUTOMOTIVE SOLUTIONS',
    subtitle:
      'Precision wheel alignment, dynamic balancing, alloy wheels, car AC servicing, sun control films and Sonax ceramic coating under one roof.',
    image: '/assets/aistudio/image_8a83cfc1.png',
    exploreLink: '/services',
  },
];

const PRODUCT_FILTER_TABS = [
  { label: 'ALL', value: 'all' },
  { label: 'AUDIO', value: 'audio' },
  { label: 'DETAILING', value: 'detailing' },
  { label: 'INTERIOR', value: 'interior' },
  { label: 'EXTERIOR', value: 'exterior' },
  { label: 'ALLOY WHEELS', value: 'alloy-wheels' },
  { label: 'PARTS', value: 'parts' },
  { label: 'BATTERIES', value: 'batteries' },
  { label: 'SERVICES', value: 'services' },
  { label: 'TYRES', value: 'tyres' },
  { label: 'TOOLS', value: 'tools' },
];

export const HomePage: React.FC = () => {
  const {
    products,
    categories,
    banners,
    services,
    openServiceEnquiryModal,
  } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [activeProductTab, setActiveProductTab] = useState('all');
  const navigate = useNavigate();

  // Automatic Hero Slider rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const homeCircleCategories = categories.filter((c) => c.featuredOnHome).slice(0, 6);
  const promoCards = banners.filter((b) => b.slot.startsWith('promo-'));
  const collectionBanners = banners.filter((b) => b.slot.startsWith('collection-'));

  const filteredProducts =
    activeProductTab === 'all'
      ? products.slice(0, 8)
      : activeProductTab === 'services'
      ? products.filter((p) => p.categorySlug === 'detailing' || p.categorySlug === 'exterior')
      : products.filter((p) => p.categorySlug === activeProductTab);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-[#14151B]">
      {/* SECTION 1: HERO BANNER SLIDER */}
      <section className="relative w-full min-h-[520px] lg:min-h-[600px] flex items-center justify-center overflow-hidden border-b border-white/10">
        {/* Background Slide Image with Measured Dark Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={slide.image}
            alt={slide.headline}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14151B] via-[#14151B]/80 to-[#14151B]/65" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/85" />
        </div>

        {/* Left / Right Slider Arrows */}
        <button
          type="button"
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
          }
          aria-label="Previous Slide"
          className="absolute left-4 sm:left-8 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-[#F10D17] border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          aria-label="Next Slide"
          className="absolute right-4 sm:right-8 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-[#F10D17] border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Hero Center Content matching Reference Screenshot */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center space-y-5">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#E2E4EA]">
            {slide.kicker}
          </p>
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white uppercase tracking-tight leading-[1.08]"
            style={{ textWrap: 'balance' }}
          >
            {slide.headline}
          </h1>
          <p className="text-sm sm:text-base text-[#D1D5DB] max-w-2xl mx-auto leading-relaxed">
            {slide.subtitle}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={slide.exploreLink}
              className="inline-flex items-center gap-3 pl-6 pr-3 py-3 rounded-full bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#F10D17]/25 transition-all"
            >
              <span>Explore Products</span>
              <span className="w-7 h-7 rounded-full bg-black/35 flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>

            <button
              type="button"
              onClick={() => openServiceEnquiryModal('General Tyre, Battery & Wheel Care Enquiry')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#1C1D24]/90 hover:bg-white/15 border border-white/25 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Enquire Now</span>
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="pt-6 flex items-center justify-center gap-2.5">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentSlide ? 'w-7 bg-[#F10D17]' : 'w-2.5 bg-white/35 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: PROMINENT PRODUCT SEARCH BAR (Exact Reference Style) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-[#1C1D24] border border-white/15 rounded-xl p-3 sm:p-4 shadow-2xl">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search tyres, batteries, wheels, accessories or products..."
                className="w-full bg-white text-[#14151B] placeholder-gray-500 rounded-lg pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F10D17]"
              />
            </div>
            <button
              type="submit"
              className="px-10 py-3 bg-[#F10D17] hover:bg-[#d10b14] text-white font-display text-sm font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shrink-0"
            >
              SEARCH
            </button>
          </form>
        </div>
      </section>

      {/* SECTION 3: SHOP BY CATEGORY (6 Circular Categories Inspired by Screenshot) */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {homeCircleCategories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.slug === 'services' ? '/services' : `/category/${cat.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full p-2 border-2 border-white/80 group-hover:border-[#F10D17] bg-[#14151B] transition-all duration-300 group-hover:scale-105 shadow-xl">
                <ProductArtwork
                  visualType={cat.visualType}
                  name={cat.name}
                  variant="circle"
                  className="w-full h-full rounded-full"
                />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-white group-hover:text-[#F10D17] tracking-wide transition-colors">
                {cat.shortName}
              </h3>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-full bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            <span>VIEW ALL CATEGORIES</span>
            <span className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center">
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* SECTION 4: PROMOTIONAL BANNERS (3 Cards: CAR AC SERVICE, TYRE SERVICE, SONAX CERAMIC COATING) */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promoCards.map((banner) => (
            <div
              key={banner.id}
              className="group relative h-56 rounded-xl overflow-hidden border border-white/15 bg-[#1C1D24] flex flex-col items-center justify-center text-center p-6"
            >
              <img
                src={banner.image}
                alt={banner.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/40" />
              <div className="relative z-10 space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-white/90 block">
                  {banner.kicker}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#FACC15] uppercase tracking-wide">
                  {banner.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-white/90">{banner.subtitle}</p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => openServiceEnquiryModal(banner.title)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F10D17] hover:bg-[#d10b14] text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span>{banner.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: OUR PRODUCTS WITH HORIZONTAL CATEGORY FILTER TABS */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Framed Section Heading inspired by Reference Screenshot */}
        <div className="flex items-center justify-center mb-8">
          <div className="hidden sm:block h-px w-24 bg-white/15" />
          <div className="px-6 py-2.5 border border-white/15 bg-[#1C1D24] rounded-md mx-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
              ★ OUR PRODUCTS ★
            </h2>
          </div>
          <div className="hidden sm:block h-px w-24 bg-white/15" />
        </div>

        {/* Horizontal Category Filter Tabs */}
        <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {PRODUCT_FILTER_TABS.map((tab) => {
            const active = activeProductTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveProductTab(tab.value)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#F10D17] text-white'
                    : 'bg-[#1C1D24] text-[#B8BBC4] hover:text-white border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-[#1C1D24] rounded-xl border border-white/10">
            <p className="text-sm text-[#B8BBC4]">
              No products currently filtered under this tab. Explore our full product catalogue.
            </p>
            <button
              type="button"
              onClick={() => setActiveProductTab('all')}
              className="mt-4 px-5 py-2 rounded-lg bg-[#F10D17] text-white text-xs font-bold uppercase"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#1C1D24] hover:bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <span>Explore Complete Product Catalogue ({products.length} Products)</span>
            <ArrowRight className="w-4 h-4 text-[#F10D17]" />
          </Link>
        </div>
      </section>

      {/* SECTION 6: SIDE-BY-SIDE PROMOTIONAL COLLECTION BANNERS */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 border-y border-white/10">
        {collectionBanners.map((col, idx) => (
          <div
            key={col.id}
            className={`relative min-h-[340px] flex items-center justify-center text-center p-8 sm:p-14 overflow-hidden ${
              idx === 0 ? 'border-b lg:border-b-0 lg:border-r border-white/10' : ''
            }`}
          >
            <img
              src={col.image}
              alt={col.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div
              className={`absolute inset-0 ${
                idx === 0
                  ? 'bg-gradient-to-br from-[#2E1035]/90 via-[#14151B]/85 to-[#14151B]/95'
                  : 'bg-gradient-to-br from-[#172554]/90 via-[#14151B]/85 to-[#14151B]/95'
              }`}
            />
            <div className="relative z-10 max-w-lg space-y-3">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white">
                {col.kicker}
              </span>
              <h3 className="font-display text-3xl sm:text-4xl font-bold text-[#FACC15] uppercase tracking-wide">
                {col.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed">{col.subtitle}</p>
              <div className="pt-3">
                <Link
                  to={col.ctaLink}
                  className="inline-flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-full bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <span>{col.ctaText}</span>
                  <span className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* SECTION 7: FEATURED BRANDS CAROUSEL */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-center mb-10">
          <div className="hidden sm:block h-px w-24 bg-white/15" />
          <div className="px-6 py-2.5 border border-white/15 bg-[#1C1D24] rounded-md mx-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
              ★ FEATURED BRANDS ★
            </h2>
          </div>
          <div className="hidden sm:block h-px w-24 bg-white/15" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {VERIFIED_BRANDS.map((brand) => (
            <Link
              key={brand.name}
              to={`/products?brand=${encodeURIComponent(brand.name)}`}
              className="group p-5 rounded-xl bg-[#1C1D24] border border-white/10 hover:border-[#F10D17]/60 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-0.5"
            >
              <span className="font-display text-xl font-bold text-white group-hover:text-[#F10D17] uppercase tracking-wider transition-colors">
                {brand.name}
              </span>
              <span className="mt-1 text-[11px] text-[#B8BBC4]">{brand.category}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 8: WHY CHOOSE US */}
      <section className="bg-[#1C1D24] border-y border-white/10 py-16">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F10D17]">
              THE GHOSH TYRE ZONE ADVANTAGE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase mt-1">
              WHY CHOOSE US
            </h2>
            <p className="text-sm text-[#B8BBC4] mt-2">
              Serving vehicle owners across Kolkata with dependable automotive products and
              precision workshop care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[#14151B] border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white uppercase">
                Genuine Products
              </h3>
              <p className="text-xs text-[#B8BBC4] leading-relaxed">
                100% genuine tyres, maintenance-free batteries, alloy wheels, and accessories from
                trusted manufacturers.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#14151B] border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white uppercase">
                Expert Technical Support
              </h3>
              <p className="text-xs text-[#B8BBC4] leading-relaxed">
                Accurate guidance on tyre load ratings, upsizing, battery Ampere-Hour capacity, and
                vehicle compatibility.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#14151B] border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white uppercase">
                Professional Installation
              </h3>
              <p className="text-xs text-[#B8BBC4] leading-relaxed">
                Automated tyre mounting, computerized dynamic balancing, and clean electrical
                fitment by trained technicians.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#14151B] border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white uppercase">
                Complete Wheel Care Solutions
              </h3>
              <p className="text-xs text-[#B8BBC4] leading-relaxed">
                From puncture repair and wheel alignment to car AC service and Sonax ceramic
                protection at one destination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: OUR SERVICES */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#F10D17]">
              WORKSHOP CAPABILITIES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase mt-1">
              OUR SERVICES
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F10D17] hover:text-white transition-colors"
          >
            <span>View Full Service Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-[#22232B] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between hover:border-white/25 transition-all"
            >
              <div>
                <ProductArtwork
                  visualType={service.visualType}
                  name={service.name}
                  className="h-44 w-full"
                />
                <div className="p-5">
                  <span className="text-[11px] text-[#B8BBC4] uppercase tracking-wider">
                    Est. Time: {service.durationEstimate}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white uppercase mt-1">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#B8BBC4] mt-2 leading-relaxed line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openServiceEnquiryModal(service.name)}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Enquire Now
                </button>
                <Link
                  to={`/services#${service.slug}`}
                  className="py-2.5 px-3 rounded-lg bg-[#14151B] hover:bg-white/10 border border-white/15 text-xs text-white font-medium"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10: CUSTOMER ENQUIRY CTA */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1C1D24] via-[#22232B] to-[#1C1D24] border border-white/15 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#F10D17]">
              <CheckCircle2 className="w-4 h-4" />
              <span>EXPERT FITMENT CONSULTATION · KOLKATA</span>
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white uppercase">
              NEED HELP CHOOSING THE RIGHT PRODUCT?
            </h2>
            <p className="text-sm sm:text-base text-[#B8BBC4]">
              Our automotive experts are here to help you find the right tyres, batteries and
              accessories for your vehicle.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>CALL NOW ({BUSINESS_INFO.phoneDisplay})</span>
            </a>

            <a
              href={getWhatsAppUrl(
                'Hello Ghosh Tyre Zone, I need expert help choosing the right product for my vehicle.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>CHAT ON WHATSAPP</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

