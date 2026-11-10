import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F1015] border-t border-white/10 text-[#B8BBC4] relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand & Description */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img
                src={BUSINESS_INFO.logo}
                alt="Ghosh Tyre Zone Logo"
                referrerPolicy="no-referrer"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <h3 className="font-display text-lg font-bold text-white tracking-wide uppercase">
              About Ghosh Tyre Zone
            </h3>
            <p className="text-sm leading-relaxed text-[#B8BBC4]">
              Ghosh Tyre Zone is a trusted tyre, battery and automotive accessories retailer in
              Kolkata, offering genuine products, professional installation and comprehensive wheel
              care solutions for all types of vehicles.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={getWhatsAppUrl(
                  'Hello Ghosh Tyre Zone, I am visiting your website and would like to enquire about your products.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links & Categories */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-display text-base font-bold text-white uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-white transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-white transition-colors">
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link to="/blogs" className="hover:text-white transition-colors">
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link to="/enquiry-cart" className="hover:text-white transition-colors">
                    My Enquiries
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-display text-base font-bold text-white uppercase tracking-wider mb-4">
                Categories
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/category/tyres" className="hover:text-white transition-colors">
                    Tyres
                  </Link>
                </li>
                <li>
                  <Link to="/category/batteries" className="hover:text-white transition-colors">
                    Batteries
                  </Link>
                </li>
                <li>
                  <Link to="/category/alloy-wheels" className="hover:text-white transition-colors">
                    Alloy Wheels
                  </Link>
                </li>
                <li>
                  <Link to="/category/audio" className="hover:text-white transition-colors">
                    Audio & Video
                  </Link>
                </li>
                <li>
                  <Link to="/category/accessories" className="hover:text-white transition-colors">
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link to="/category/detailing" className="hover:text-white transition-colors">
                    Detailing & Care
                  </Link>
                </li>
                <li>
                  <Link to="/category/parts" className="hover:text-white transition-colors">
                    Parts & Fluids
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Col 3: Our Services */}
          <div>
            <h4 className="font-display text-base font-bold text-white uppercase tracking-wider mb-4">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/services#tyre-sales-installation"
                  className="hover:text-white transition-colors"
                >
                  Tyre Sales & Fitting
                </Link>
              </li>
              <li>
                <Link to="/services#wheel-alignment" className="hover:text-white transition-colors">
                  Wheel Alignment
                </Link>
              </li>
              <li>
                <Link to="/services#wheel-balancing" className="hover:text-white transition-colors">
                  Wheel Balancing
                </Link>
              </li>
              <li>
                <Link
                  to="/services#battery-testing-replacement"
                  className="hover:text-white transition-colors"
                >
                  Battery Testing & Replacement
                </Link>
              </li>
              <li>
                <Link to="/services#puncture-repair" className="hover:text-white transition-colors">
                  Puncture Repair
                </Link>
              </li>
              <li>
                <Link
                  to="/services#car-ac-servicing"
                  className="hover:text-white transition-colors"
                >
                  Car AC Servicing
                </Link>
              </li>
              <li>
                <Link to="/services#ceramic-coating" className="hover:text-white transition-colors">
                  Sonax Ceramic Coating
                </Link>
              </li>
              <li>
                <Link
                  to="/services#sun-control-film-installation"
                  className="hover:text-white transition-colors"
                >
                  Sun Control Film Installation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h4 className="font-display text-base font-bold text-white uppercase tracking-wider mb-4">
              Contact Info
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F10D17] shrink-0 mt-1" />
                <div>
                  <span className="block font-semibold text-white">Address:</span>
                  <span>{BUSINESS_INFO.address}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#F10D17] shrink-0 mt-1" />
                <div>
                  <span className="block font-semibold text-white">Phone:</span>
                  <a
                    href={`tel:${BUSINESS_INFO.phoneRaw}`}
                    className="hover:text-white font-mono-num"
                  >
                    {BUSINESS_INFO.phoneDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#F10D17] shrink-0 mt-1" />
                <div>
                  <span className="block font-semibold text-white">Email ID:</span>
                  <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-white">
                    {BUSINESS_INFO.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#F10D17] shrink-0 mt-1" />
                <div>
                  <span className="block font-semibold text-white">Workshop Hours:</span>
                  <span>{BUSINESS_INFO.hours}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Admin Link */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B8BBC4]">
          <p>© 2026. Ghosh Tyre Zone. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/products/car" className="hover:text-white transition-colors">
              Car Tyres Kolkata
            </Link>
            <Link to="/category/batteries" className="hover:text-white transition-colors">
              Battery Shop Kolkata
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-[#B8BBC4] hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F10D17]" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
