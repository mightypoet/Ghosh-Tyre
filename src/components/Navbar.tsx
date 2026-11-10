import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bike,
  BookOpen,
  Car,
  ChevronRight,
  Home,
  Info,
  Mail,
  Menu,
  MessageCircle,
  Package,
  Phone,
  Search,
  ShieldCheck,
  Truck,
  Wrench,
  X,
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';
import { useStore } from '../context/StoreContext';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { Dock, DockIcon, DockItem, DockLabel } from './ui/dock';
import { cn } from '../lib/utils';

export const Navbar: React.FC = () => {
  const { cart, categories } = useStore();
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

  const navItems = [
    {
      id: 'home',
      title: 'Home',
      path: '/',
      icon: Home,
      isActive: location.pathname === '/',
    },
    {
      id: 'car',
      title: 'Car Products',
      path: '/products/car',
      icon: Car,
      isActive: location.pathname.startsWith('/products/car'),
      subcategories: [
        { name: 'Car & SUV Tyres', path: '/products/car?category=tyres' },
        { name: 'Car Batteries', path: '/products/car?category=batteries' },
        { name: 'Alloy Wheels', path: '/products/car?category=alloy-wheels' },
        { name: 'Car Audio Systems', path: '/products/car?category=audio' },
        { name: 'Car Accessories', path: '/products/car?category=accessories' },
      ],
    },
    {
      id: 'twowheeler',
      title: 'Two Wheelers',
      path: '/products/two-wheelers',
      icon: Bike,
      isActive: location.pathname.startsWith('/products/two-wheelers'),
      subcategories: [
        { name: 'Motorcycle & Scooter Tyres', path: '/products/two-wheelers?category=tyres' },
        { name: 'Two Wheeler Batteries', path: '/products/two-wheelers?category=batteries' },
        { name: 'Ceramic Coating & Care', path: '/products/two-wheelers?category=detailing' },
      ],
    },
    {
      id: 'commercial',
      title: 'Commercial Vehicles',
      path: '/products/commercial-vehicles',
      icon: Truck,
      isActive: location.pathname.startsWith('/products/commercial-vehicles'),
      subcategories: [
        { name: 'LCV & Heavy Tyres', path: '/products/commercial-vehicles?category=tyres' },
        { name: 'Commercial Batteries', path: '/products/commercial-vehicles?category=batteries' },
        { name: 'Fleet Safety & Fluids', path: '/products/commercial-vehicles?category=parts' },
      ],
    },
    {
      id: 'products',
      title: 'All Products',
      path: '/products',
      icon: Package,
      isActive:
        location.pathname === '/products' || location.pathname.startsWith('/category/'),
      subcategories: categories.slice(0, 6).map((c) => ({
        name: c.name,
        path: `/category/${c.slug}`,
      })),
    },
    {
      id: 'services',
      title: 'Workshop Services',
      path: '/services',
      icon: Wrench,
      isActive: location.pathname.startsWith('/services'),
    },
    {
      id: 'about',
      title: 'About Ghosh Tyre Zone',
      path: '/about',
      icon: Info,
      isActive: location.pathname.startsWith('/about'),
    },
    {
      id: 'blogs',
      title: 'Automotive Blogs',
      path: '/blogs',
      icon: BookOpen,
      isActive: location.pathname.startsWith('/blogs'),
    },
    {
      id: 'contact',
      title: 'Contact Us',
      path: '/contact',
      icon: Mail,
      isActive: location.pathname.startsWith('/contact'),
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#14151B]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Logo */}
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

        {/* Zone 2: Static Dock Navbar with Icons and Controlled Micro-Bounce */}
        <nav
          className="hidden lg:flex items-center relative"
          aria-label="Main Navigation Dock"
        >
          <Dock
            panelHeight={48}
            staticLayout={true}
            className="bg-[#1C1D24]/90 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-2xl items-center shadow-xl shadow-black/50 gap-3 sm:gap-3.5"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="relative flex items-center justify-center"
                  onMouseEnter={() => {
                    if (item.subcategories && item.subcategories.length > 0) {
                      setActiveDropdown(item.id);
                    }
                  }}
                  onMouseLeave={() => {
                    setActiveDropdown(null);
                  }}
                >
                  <DockItem
                    onClick={() => navigate(item.path)}
                    aria-label={item.title}
                    className={cn(
                      'w-10 h-10 aspect-square rounded-xl transition-colors duration-150 cursor-pointer flex items-center justify-center',
                      item.isActive
                        ? 'bg-[#F10D17] text-white shadow-md shadow-[#F10D17]/40 ring-1 ring-[#F10D17]/80'
                        : 'bg-white/5 text-[#B8BBC4] hover:text-white hover:bg-white/15'
                    )}
                  >
                    <DockLabel>{item.title}</DockLabel>
                    <DockIcon>
                      <Icon className="h-5 w-5" />
                    </DockIcon>
                  </DockItem>

                  {/* Submenu on hover if item has subcategories */}
                  {item.subcategories && activeDropdown === item.id && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 z-50 py-2 bg-[#1C1D24] border border-white/10 rounded-xl shadow-2xl backdrop-blur-lg"
                      onMouseEnter={() => setActiveDropdown(item.id)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="px-3 py-1.5 border-b border-white/10 text-[10px] uppercase font-bold tracking-wider text-[#F10D17]">
                        {item.title}
                      </div>
                      {item.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between px-3.5 py-2 text-xs text-[#B8BBC4] hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <span>{sub.name}</span>
                          <ChevronRight className="w-3 h-3 opacity-60" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </Dock>
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

          {/* Phone Number */}
          <a
            href={`tel:${BUSINESS_INFO.phoneRaw}`}
            className="hidden xl:flex items-center gap-1.5 text-sm font-display font-bold tracking-wide text-[#F10D17] hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span className="font-mono-num">{BUSINESS_INFO.phoneDisplay}</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2.5 rounded-lg bg-[#1C1D24] border border-white/10 text-white"
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

      {/* Mobile Navigation Drawer with Icon Tiles */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1C1D24] border-b border-white/10 px-4 pt-4 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
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

          {/* Icon-centric navigation grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center group',
                    item.isActive
                      ? 'bg-[#F10D17] border-[#F10D17] text-white shadow-lg shadow-[#F10D17]/30'
                      : 'bg-[#14151B] border-white/10 text-[#B8BBC4] hover:text-white hover:border-white/20'
                  )}
                >
                  <div
                    className={cn(
                      'p-2 rounded-lg mb-1.5 transition-colors',
                      item.isActive
                        ? 'bg-black/20 text-white'
                        : 'bg-white/5 text-[#B8BBC4] group-hover:text-white group-hover:bg-white/10'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium leading-tight">
                    {item.title}
                  </span>
                </Link>
              );
            })}
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
