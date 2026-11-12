import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BUSINESS_INFO, VERIFIED_BRANDS } from '../data/initialData';
import { ProductCard } from '../components/ProductCard';
import { BookCallButton } from '../components/ui/book-a-call-button';
import { cn } from '../lib/utils';

const PRIMARY_OPERATIONS = [
  {
    id: 1,
    tag: 'Primary Operation 01 · Multi-Brand Tyres',
    title: 'Genuine Passenger & Commercial Tyres',
    sentence:
      'Authorized Kolkata dealer for Michelin, Bridgestone, Yokohama, CEAT, MRF & Apollo offering genuine tyres with automated rim-safe mounting, dynamic balancing, and nitrogen inflation.',
    image: '/assets/aistudio/image_6aa2fd52.png',
    actionText: 'Explore Tyres',
    actionLink: '/products/car?category=tyres',
    secondaryText: 'Enquire Pricing',
  },
  {
    id: 2,
    tag: 'Primary Operation 02 · Automotive Batteries',
    title: 'Certified Battery Sales & Health Testing',
    sentence:
      'Authorized dealership for Amaron and Exide maintenance-free batteries featuring free computerized cranking health diagnostics, alternator testing, and instant doorstep or workshop fitment.',
    image: '/assets/aistudio/image_f3b889b3.png',
    actionText: 'View Batteries',
    actionLink: '/category/batteries',
    secondaryText: 'Check Battery Health',
  },
  {
    id: 3,
    tag: 'Primary Operation 03 · 3D Wheel Alignment',
    title: 'Precision 3D Laser Wheel Alignment',
    sentence:
      'Multi-camera computerized 3D laser alignment and high-speed dynamic wheel balancing at 38C Raja Dinendra Street to eliminate steering pull, prevent vibration, and maximize tyre lifespan.',
    image: '/assets/aistudio/image_8a83cfc1.png',
    actionText: 'Book Alignment',
    actionLink: '/services',
    secondaryText: 'Explore Services',
  },
];

const BRAND_CARD_IMAGES: Record<string, string> = {
  Michelin: '/assets/aistudio/image_86fa9fc9.png',
  Bridgestone: '/assets/aistudio/image_7e716995.png',
  Goodyear: '/assets/aistudio/image_ce1587b8.png',
  Apollo: '/assets/aistudio/image_ee93d504.png',
  CEAT: '/assets/aistudio/image_3e0e705f.png',
  MRF: '/assets/aistudio/image_5b1e3202.png',
  'JK Tyre': '/assets/aistudio/image_4d9b69d2.png',
  Exide: '/assets/aistudio/PngItem_3582603_0aeb6400.png',
};

const QUICK_CATEGORY_CARDS = [
  {
    title: 'Car & SUV Tyres',
    desc: 'High-grip tubeless tyres from Michelin, Bridgestone, Yokohama & CEAT.',
    path: '/products/car?category=tyres',
    tag: 'Car / SUV',
  },
  {
    title: 'Two-Wheeler Tyres',
    desc: 'Commuter, sport & cruiser tyres from MRF, CEAT & Michelin.',
    path: '/products/two-wheelers?category=tyres',
    tag: 'Bike / Scooter',
  },
  {
    title: 'Automotive Batteries',
    desc: 'Maintenance-free Amaron & Exide batteries with on-spot digital testing.',
    path: '/category/batteries',
    tag: '4-Wheeler & 2-Wheeler',
  },
  {
    title: 'Alloy Wheels & Care',
    desc: 'Precision PCD alloys, ceramic coatings, car AC & detailing.',
    path: '/category/alloy-wheels',
    tag: 'Custom Alloys',
  },
];

const FILTER_TABS = [
  { label: 'All Products', value: 'all' },
  { label: 'Tyres', value: 'tyres' },
  { label: 'Batteries', value: 'batteries' },
  { label: 'Alloy Wheels', value: 'alloy-wheels' },
  { label: 'Accessories', value: 'accessories' },
];

export const HomePage: React.FC = () => {
  const { products, openServiceEnquiryModal } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  // Automatic rotation between the 3 images every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % PRIMARY_OPERATIONS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % PRIMARY_OPERATIONS.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + PRIMARY_OPERATIONS.length) % PRIMARY_OPERATIONS.length);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const filteredProducts =
    activeTab === 'all'
      ? products.slice(0, 8)
      : products.filter((p) => p.categorySlug === activeTab).slice(0, 8);

  const currentOperation = PRIMARY_OPERATIONS[activeSlide];

  return (
    <div className="min-h-screen bg-[#14151B] text-white">
      {/* 1. HERO SECTION: 3-Image Interactive Primary Operations Showcase */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#1A1C24] via-[#14151B] to-[#14151B]">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#F10D17]/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {/* Top Location & Dealer Kicker */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-6 border-b border-white/10 mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#B8BBC4]">
              <MapPin className="w-4 h-4 text-[#F10D17]" />
              <span className="font-semibold text-white">38C Raja Dinendra Street, Garpar, Kolkata 700009</span>
              <span className="hidden md:inline text-white/30">|</span>
              <span className="hidden md:inline text-[#B8BBC4]">Near Rajabazar / Machuabazar</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F10D17]/15 border border-[#F10D17]/30 text-[#F10D17] text-[11px] font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Authorized Multi-Brand Hub</span>
              </span>
            </div>
          </div>

          {/* MAIN 3-IMAGE INTERACTIVE SHOWCASE */}
          <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#1C1D24] shadow-2xl">
            {/* The Active Operation Image with Dark Scrim */}
            <div className="relative min-h-[420px] sm:min-h-[460px] lg:min-h-[480px] flex items-center">
              <img
                src={currentOperation.image}
                alt={currentOperation.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#14151B] via-[#14151B]/90 to-[#14151B]/60 lg:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14151B] via-transparent to-black/40" />

              {/* Clickable Previous & Next Image Arrows */}
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label="Previous Primary Operation Image"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#14151B]/80 hover:bg-[#F10D17] border border-white/20 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next Primary Operation Image"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#14151B]/80 hover:bg-[#F10D17] border border-white/20 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl hover:scale-105"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Information Content: Primary Operation Details with Only One Sentence */}
              <div className="relative z-10 max-w-2xl px-8 sm:px-14 lg:px-16 py-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F10D17]/20 border border-[#F10D17]/40 text-[#F10D17] text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#F10D17]" />
                  <span>{currentOperation.tag}</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-white tracking-tight leading-[1.1]">
                  {currentOperation.title}
                </h1>

                {/* Single Concise Sentence */}
                <p className="text-sm sm:text-base text-[#D1D5DB] leading-relaxed max-w-xl">
                  {currentOperation.sentence}
                </p>

                {/* Interactive CTA Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    to={currentOperation.actionLink}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F10D17] hover:bg-[#d00b14] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#F10D17]/30"
                  >
                    <span>{currentOperation.actionText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => openServiceEnquiryModal(currentOperation.title)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span>{currentOperation.secondaryText}</span>
                  </button>
                </div>
              </div>

              {/* Clickable Dots to Change the Sequence Navigation */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 bg-[#14151B]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-xl">
                {PRIMARY_OPERATIONS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={cn(
                      'h-2.5 rounded-full transition-all duration-300 cursor-pointer',
                      idx === activeSlide
                        ? 'w-7 bg-[#F10D17] shadow-md shadow-[#F10D17]/50'
                        : 'w-2.5 bg-white/40 hover:bg-white/70'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Product Search Bar directly below the 3-image showcase */}
          <div className="mt-6 max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#B8BBC4] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search tyre size (e.g. 185/65 R15, 205/55 R16), car model, or battery..."
                  className="w-full bg-[#1C1D24] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-[#B8BBC4]/60 focus:outline-none focus:border-[#F10D17] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#F10D17] hover:bg-[#d00b14] text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-lg shadow-[#F10D17]/25"
              >
                Search Products
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. CURATED CATEGORIES: Tidy 4-card grid */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#F10D17]">
              Explore by Vehicle
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#B8BBC4] hover:text-white transition-colors"
          >
            <span>Full Catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {QUICK_CATEGORY_CARDS.map((card) => (
            <Link
              key={card.title}
              to={card.path}
              className="group relative rounded-xl overflow-hidden bg-[#1C1D24] border border-white/10 hover:border-[#F10D17]/50 transition-all flex flex-col justify-between p-5 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#B8BBC4] mb-3">
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[11px] font-medium text-[#F10D17]">
                    {card.tag}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#B8BBC4] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="font-display text-lg font-bold text-white uppercase group-hover:text-[#F10D17] transition-colors">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-xs text-[#B8BBC4] leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-white">
                <span>View Products</span>
                <span className="text-[#F10D17] text-sm">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS: Tidy & Clean product display */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#F10D17]">
              Popular in Kolkata
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white mt-1">
              Featured Tyres & Batteries
            </h2>
          </div>

          {/* Clean Segmented Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#1C1D24] rounded-lg border border-white/10 overflow-x-auto no-scrollbar">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.value
                    ? 'bg-[#F10D17] text-white shadow-sm'
                    : 'text-[#B8BBC4] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1C1D24] hover:bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <span>Explore All {products.length} Products</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F10D17]" />
          </Link>
        </div>
      </section>

      {/* 4. WORKSHOP SERVICES: High-Value Wheel Care */}
      <section className="bg-[#181920] border-y border-white/10 py-16 my-8">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F10D17]">
              Professional Workshop Services
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white mt-1">
              Precision Wheel Care & Maintenance
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#B8BBC4]">
              Equipped with computerized Italian tyre changers, digital wheel balancers, and multi-camera 3D wheel alignment systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#14151B] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold uppercase text-white">
                  3D Laser Wheel Alignment
                </h3>
                <p className="mt-2 text-xs text-[#B8BBC4] leading-relaxed">
                  Corrects vehicle pulling, steering off-center, and irregular tyre feathering. Crucial for Kolkata road conditions every 5,000 km.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openServiceEnquiryModal('3D Wheel Alignment')}
                className="mt-6 w-full py-2.5 rounded-lg bg-white/5 hover:bg-[#F10D17] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Book Alignment
              </button>
            </div>

            <div className="p-6 rounded-xl bg-[#14151B] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center mb-4">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold uppercase text-white">
                  Dynamic Wheel Balancing
                </h3>
                <p className="mt-2 text-xs text-[#B8BBC4] leading-relaxed">
                  Eliminates high-speed steering wheel vibrations and ensures even tyre wear using computerized lead-free adhesive counterweights.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openServiceEnquiryModal('Wheel Balancing')}
                className="mt-6 w-full py-2.5 rounded-lg bg-white/5 hover:bg-[#F10D17] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Book Balancing
              </button>
            </div>

            <div className="p-6 rounded-xl bg-[#14151B] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold uppercase text-white">
                  Battery Testing & Fitment
                </h3>
                <p className="mt-2 text-xs text-[#B8BBC4] leading-relaxed">
                  Digital conductance tester evaluates cold-cranking amps (CCA) and alternator charging health. Free fitment and old battery exchange.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openServiceEnquiryModal('Battery Test & Replacement')}
                className="mt-6 w-full py-2.5 rounded-lg bg-white/5 hover:bg-[#F10D17] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Enquire Battery
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AUTHORIZED BRANDS: Clean & Quiet */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-[#B8BBC4] mb-6">
          Authorized Dealer for India&apos;s Leading Brands
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {VERIFIED_BRANDS.slice(0, 8).map((b) => (
            <Link
              key={b.name}
              to={`/products?brand=${encodeURIComponent(b.name)}`}
              className="relative overflow-hidden p-3 rounded-lg bg-[#1C1D24] border border-white/10 hover:border-white/20 text-center transition-colors group flex flex-col justify-center items-center min-h-[72px]"
            >
              {BRAND_CARD_IMAGES[b.name] && (
                <img
                  src={BRAND_CARD_IMAGES[b.name]}
                  alt={`${b.name} ${b.category}`}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-30 pointer-events-none group-hover:scale-110 transition-transform duration-300"
                />
              )}
              <span className="relative z-10 font-display text-sm font-bold uppercase text-white group-hover:text-[#F10D17] transition-colors block">
                {b.name}
              </span>
              <span className="relative z-10 text-[10px] text-[#B8BBC4] block mt-0.5">{b.category}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. LOCATION & STORE INFO: Concise, High-Value Local SEO */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl bg-[#1C1D24] border border-white/10 p-8 sm:p-10 lg:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F10D17]">
              <Sparkles className="w-4 h-4" />
              <span>Visit Our Authorized Kolkata Store</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-white tracking-wide leading-tight">
              38C, Raja Dinendra Street, Garpar, Kolkata 700009
            </h3>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-[#D1D5DB] pt-1">
              <span className="flex items-center gap-2 text-white font-medium">
                <Clock className="w-4 h-4 text-[#F10D17]" />
                <span>Monday – Sunday: 9:30 AM – 8:30 PM</span>
              </span>
              <span className="hidden sm:inline text-white/20">·</span>
              <span className="flex items-center gap-2 text-[#B8BBC4]">
                <MapPin className="w-4 h-4 text-[#F10D17]" />
                <span>Near Rajabazar / Machuabazar</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#B8BBC4] leading-relaxed max-w-xl pt-1">
              Comprehensive tyre fitting, computerized 3D laser alignment, dynamic balancing, nitrogen inflation, and genuine battery installations while you wait.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <BookCallButton
              onClick={() => openServiceEnquiryModal('Consultation Call with Ghosh Tyre Zone Expert')}
              className="px-6 py-3 text-xs sm:text-sm"
            />
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent('Ghosh Tyre Zone, 38C Raja Dinendra Street, Kolkata 700009')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#F10D17]" />
              <span>Directions</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
