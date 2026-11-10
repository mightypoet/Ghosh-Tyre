import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ClipboardList,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';
import { useStore } from '../context/StoreContext';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const Navbar: React.FC = () => {
  const { cart, setIsCartDrawerOpen, categories } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const totalEnquiryItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#14151B]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Original Ghosh Tyre Zone Logo */}
        <Link
          to="/"
          className="flex items-center shrink-0 focus:outline-none"
          aria-label="Ghosh Tyre Zone Home"
        >
          <img
            src={BUSINESS_INFO.logo}
            alt="Ghosh Tyre Zone Logo"
            referrerPolicy="no-referrer"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Zone 2: Center Navigation */}
        <nav className="hidden xl:flex items-center gap-5 text-[13px] font-medium text-[#E2E4EA]">
          <Link
            to="/"
            className={`py-2 transition-colors whitespace-nowrap shrink-0 ${
              isActive('/') ? 'text-[#F10D17] font-semibold' : 'hover:text-white'
            }`}
          >
            Home
          </Link>

          {/* Car Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('car')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              to="/products/car"
              className={`flex items-center gap-1 py-2 transition-colors whitespace-nowrap shrink-0 ${
                location.pathname.includes('/products/car')
                  ? 'text-[#F10D17] font-semibold'
                  : 'hover:text-white'
              }`}
            >
              <span>Car</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-75" />
            </Link>
            {activeDropdown === 'car' && (
              <div className="absolute left-0 top-full pt-1 w-56 z-50">
                <div className="bg-[#1C1D24] border border-white/10 rounded-lg shadow-2xl py-2">
                  <Link
                    to="/products/car?category=tyres"
                    className="block px-4 py-2 text-xs text-[#B8BBC4] hover:text-white hover:bg-white/5"
                  >
                    Car & SUV Tyres
                  </Link>
                  <Link
                    to="/products/car?category=batteries"
                    className="block px-4 py-2 text-xs text-[#B8BBC4] hover:text-white hover:bg-white/5"
                  >
                    Car Batteries
                  </Link>
                  <Link
                    to="/products/car?category=alloy-wheels"
                    className="block px-4 py-2 text-xs text-[#B8BBC4] hover:text-white hover:bg-white/5"
                  >
                    Alloy Wheels
                  </Link>
                  <Link
                    to="/products/car?category=audio"
                    className="block px-4 py-2 text-xs text-[#B8BBC4] hover:text-white hover:bg-white/5"
                  >
                    Car Audio & Video Systems
                  </Link>
                  <Link
                    to="/products/car?category=accessories"
                    className="block px-4 py-2 text-xs text-[#B8BBC4] hover:text-white hover:bg-white/5"
                  >
                    Car Accessories & Interior
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Two Wheelers Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('twowheeler')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              to="/products/two-wheelers"
              className={`flex items-center gap-1 py-2 transition-colors whitespace-nowrap shrink-0 ${
                location.pathname.includes('/products/two-wheelers')
                  ? 'text-[#F10D17] font-semibold'
                  : 'hover:text-white'
              }`}
            >
              <span>Two Wheelers</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-75" />
            </Link>
            {activeDropdown === 'twowheeler' && (
              <div className="absolute left-0 top-full pt-1 w-56 z-50">
                <div className="bg-[#1C1D24] border border-white/10 rounded-lg shadow-2xl py-2">
                  <Link
                    to="/products/two-wheelers?category=tyres"
                    className="block px-4 py-2 text-xs text-[#B8BBC4] hover:text-white hover:bg-white/5"
                  >
                    Motorcycle & Scooter Tyres
                  </Link>
                  <Link
                    to="/products/two-wheelers?category=batteries"
                    className="block px-4 py-2 text-xs text-[#B8BBC4] hover:text-white hover:bg-white/5"
                  >
                    Two Wheeler VRLA Batteries
                  </Link>
                  <Link
                    to="/products/two-wheelers?category=detailing"
                    className="block px-4 py-2 text-xs text-[#B8BBC4] hover:text-white hover:bg-white/5"
                  >
                    Ceramic Coating & Care
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Commercial Vehicles Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('commercial')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              to="/products/commercial-vehicles"
              className={`flex items-center gap-1 py-2 transition-colors whitespace-nowrap shrink-0 ${
                location.pathname.includes('/products/commercial-vehicles')
                  ? 'text-[#F10D17] font-semibold'
                  : 'hover:text-white'
              }`}
            >
              <span>Commercial Vehicles</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-75" />
            </Link>
            {activeDropdown === 'commercial' && (
              <div className="absolute left-0 top-full pt-1 w-60 z-50">
                <div className="bg-[#1C1D24] border border-white/10 rounded-lg shadow-2xl py-2">
                  <Link
                    to="/products/commercial-vehicles?category=tyres"
                    className="block px-4 py-2 text-xs text-[#B8BBC4] hover:text-white hover:bg-white/5"
                  >
                    LCV & Load-Rated Tyres
                  </Link>
                  <Link
                    to="/products/commercial-vehicles?category=batteries"
                    className="block px-4 py-2 text-xs text-[#B8BBC4] hover:text-white hover:bg-white/5"
                  >
                    Heavy-Duty Commercial Batteries
                  </Link>
                  <Link
                    to="/products/commercial-vehicles?category=parts"
                    className="block px-4 py-2 text-xs text-[#B8BBC4] hover:text-white hover:bg-white/5"
                  >
                    Fleet Safety & Brake Fluids
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Products Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('products')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              to="/products"
              className={`flex items-center gap-1 py-2 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/products') ? 'text-[#F10D17] font-semibold' : 'hover:text-white'
              }`}
            >
              <span>Products</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-75" />
            </Link>
            {activeDropdown === 'products' && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 w-[560px] z-50">
                <div className="bg-[#1C1D24] border border-white/10 rounded-xl shadow-2xl p-5 grid grid-cols-2 gap-3">
                  <div className="col-span-2 pb-2 mb-1 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white">
                      Explore Product Categories
                    </span>
                    <Link
                      to="/products"
                      className="text-xs text-[#F10D17] hover:underline font-medium"
                    >
                      View Full Catalogue →
                    </Link>
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="flex flex-col p-2.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span className="text-xs font-semibold text-white">{cat.name}</span>
                      <span className="text-[11px] text-[#B8BBC4] line-clamp-1 mt-0.5">
                        {cat.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/services"
            className={`py-2 transition-colors whitespace-nowrap shrink-0 ${
              isActive('/services') ? 'text-[#F10D17] font-semibold' : 'hover:text-white'
            }`}
          >
            Services
          </Link>

          <Link
            to="/about"
            className={`py-2 transition-colors whitespace-nowrap shrink-0 ${
              isActive('/about') ? 'text-[#F10D17] font-semibold' : 'hover:text-white'
            }`}
          >
            About Us
          </Link>

          <Link
            to="/blogs"
            className={`py-2 transition-colors whitespace-nowrap shrink-0 ${
              location.pathname.startsWith('/blogs')
                ? 'text-[#F10D17] font-semibold'
                : 'hover:text-white'
            }`}
          >
            Blogs
          </Link>

          <Link
            to="/contact"
            className={`py-2 transition-colors whitespace-nowrap shrink-0 ${
              isActive('/contact') ? 'text-[#F10D17] font-semibold' : 'hover:text-white'
            }`}
          >
            Contact Us
          </Link>
        </nav>

        {/* Zone 3: Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            className="p-2.5 rounded-lg bg-[#1C1D24] border border-white/10 text-[#B8BBC4] hover:text-white hover:border-white/20 transition-colors"
            aria-label="Search Products"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Enquiry Cart Button */}
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1C1D24] border border-white/10 text-white hover:border-[#F10D17]/60 transition-colors whitespace-nowrap shrink-0"
            aria-label="Open Enquiry Cart"
          >
            <ClipboardList className="w-4 h-4 text-[#F10D17]" />
            <span className="hidden sm:inline text-xs font-medium">Enquiries</span>
            <span className="font-mono-num text-xs font-bold text-[#F10D17]">
              ({totalEnquiryItems})
            </span>
          </button>

          {/* WhatsApp Button */}
          <a
            href={getWhatsAppUrl(
              'Hello Ghosh Tyre Zone, I would like to enquire about tyres, batteries and automotive services.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          {/* Phone Number matching Reference Screenshot */}
          <a
            href={`tel:${BUSINESS_INFO.phoneRaw}`}
            className="hidden lg:flex items-center gap-1.5 text-sm font-display font-bold tracking-wide text-[#F10D17] hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span className="font-mono-num">{BUSINESS_INFO.phoneDisplay}</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="xl:hidden p-2.5 rounded-lg bg-[#1C1D24] border border-white/10 text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div className="bg-[#1C1D24] border-b border-white/10 py-3 px-4">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto flex items-center gap-2"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tyres, batteries, wheels, accessories or vehicle model..."
              className="flex-1 bg-[#14151B] border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#B8BBC4]/60 focus:outline-none focus:border-[#F10D17]"
              autoFocus
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#F10D17] hover:bg-[#d00b14] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#1C1D24] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tyres, batteries, wheels..."
              className="flex-1 bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-sm text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#F10D17] text-white text-xs font-bold uppercase rounded-lg"
            >
              Go
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-[#14151B] text-white"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-[#14151B] text-white"
            >
              All Products
            </Link>
            <Link
              to="/products/car"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-[#14151B] text-white"
            >
              Car Products
            </Link>
            <Link
              to="/products/two-wheelers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-[#14151B] text-white"
            >
              Two Wheelers
            </Link>
            <Link
              to="/products/commercial-vehicles"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-[#14151B] text-white"
            >
              Commercial Vehicles
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-[#14151B] text-white"
            >
              Our Services
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-[#14151B] text-white"
            >
              About Us
            </Link>
            <Link
              to="/blogs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-[#14151B] text-white"
            >
              Automotive Blogs
            </Link>
            <Link
              to="/enquiry-cart"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-[#14151B] text-white"
            >
              Enquiry Cart ({totalEnquiryItems})
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-[#14151B] text-white"
            >
              Contact Us
            </Link>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="flex items-center gap-2 text-sm font-bold text-[#F10D17]"
            >
              <Phone className="w-4 h-4" />
              <span>{BUSINESS_INFO.phoneDisplay}</span>
            </a>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 text-xs text-[#B8BBC4] hover:text-white"
            >
              <ShieldCheck className="w-4 h-4 text-[#F10D17]" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
