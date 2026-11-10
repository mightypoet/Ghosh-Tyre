import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  Clock,
  Compass,
  Headphones,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Target,
  Wrench,
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';
import { useStore } from '../context/StoreContext';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const AboutPage: React.FC = () => {
  const { categories, services } = useStore();

  return (
    <div className="min-h-screen bg-[#14151B] pb-16">
      {/* Hero Header */}
      <section className="relative bg-[#1C1D24] border-b border-white/10 py-16 overflow-hidden">
        <img
          src="/assets/aistudio/image_6aa2fd52.png"
          alt="About Ghosh Tyre Zone Kolkata"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14151B] via-[#14151B]/80 to-transparent" />
        <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F10D17]">
            KOLKATA’S TRUSTED AUTOMOTIVE PARTNER
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase mt-2">
            ABOUT GHOSH TYRE ZONE
          </h1>
          <p className="text-base sm:text-lg text-[#D1D5DB] max-w-3xl mt-4 leading-relaxed">
            Ghosh Tyre Zone is a trusted tyre and battery retailer in Kolkata, West Bengal,
            committed to delivering quality automotive products and reliable wheel care solutions.
          </p>
        </div>
      </section>

      {/* Company Introduction & Workshop Overview */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F10D17]">
              WHO WE ARE
            </span>
            <h2 className="font-display text-3xl font-bold text-white uppercase">
              Genuine Automotive Products & Comprehensive Wheel Care Under One Roof
            </h2>
            <p className="text-sm text-[#B8BBC4] leading-relaxed">
              Located at <strong>38C, Raja Dinendra Street, Garpar, Machuabazar, Kolkata – 700009</strong>,
              Ghosh Tyre Zone serves private car owners, SUV enthusiasts, two-wheeler riders, and
              commercial vehicle operators across Kolkata.
            </p>
            <p className="text-sm text-[#B8BBC4] leading-relaxed">
              Finding the right tyre size, load index, or battery Ampere-Hour rating is critical for
              road safety and vehicle longevity. Our experienced technicians combine genuine brand
              inventory with modern workshop equipment—including automated tyre changers,
              computerized wheel balancers, precision alignment systems, car AC servicing units, and
              Sonax ceramic detailing care.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#1C1D24] border border-white/10">
                <span className="font-display text-2xl font-bold text-white">10+ Brands</span>
                <p className="text-xs text-[#B8BBC4] mt-1">
                  Michelin, Bridgestone, Apollo, MRF, CEAT, Exide, Amaron & Sonax
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#1C1D24] border border-white/10">
                <span className="font-display text-2xl font-bold text-white">8 Core Services</span>
                <p className="text-xs text-[#B8BBC4] mt-1">
                  Alignment, Balancing, Tyre Fitting, Battery Check, AC & Detailing
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <img
              src="/assets/aistudio/image_f3b889b3.png"
              alt="Genuine Tyres and Batteries at Ghosh Tyre Zone"
              referrerPolicy="no-referrer"
              className="rounded-2xl border border-white/10 w-full h-64 object-cover"
            />
            <img
              src="/assets/aistudio/image_8a83cfc1.png"
              alt="Precision Alloy Wheels Showcase"
              referrerPolicy="no-referrer"
              className="rounded-2xl border border-white/10 w-full h-64 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[#1C1D24] border-y border-white/10 py-14">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-[#14151B] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white uppercase">OUR MISSION</h2>
            <p className="text-sm sm:text-base text-[#D1D5DB] leading-relaxed">
              "To provide customers with genuine automotive products, professional technical
              expertise and dependable service that ensures safety, performance and customer
              satisfaction."
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#14151B] border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white uppercase">OUR VISION</h2>
            <p className="text-sm sm:text-base text-[#D1D5DB] leading-relaxed">
              "To become Kolkata's most trusted destination for comprehensive wheel care, tyre
              solutions and automotive accessories."
            </p>
          </div>
        </div>
      </section>

      {/* Product Categories & Technical Services */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase mb-6">
            Our Product Categories & Expertise
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="p-5 rounded-xl bg-[#1C1D24] border border-white/10 hover:border-[#F10D17]/60 transition-colors"
              >
                <h3 className="font-display text-lg font-bold text-white uppercase">{cat.name}</h3>
                <p className="text-xs text-[#B8BBC4] mt-1.5 leading-relaxed">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase mb-6">
            Technical Workshop Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((srv) => (
              <Link
                key={srv.id}
                to={`/services#${srv.slug}`}
                className="p-4 rounded-xl bg-[#1C1D24] border border-white/10 hover:border-white/25 flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-[#F10D17] shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-semibold text-white">{srv.name}</h4>
                  <p className="text-xs text-[#B8BBC4] mt-1 line-clamp-2">
                    {srv.shortDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {[
            {
              icon: ShieldCheck,
              title: 'Genuine Products',
              desc: 'Authentic tyres, batteries, alloy wheels, and accessories.',
            },
            {
              icon: Headphones,
              title: 'Expert Technical Support',
              desc: 'Honest guidance on tyre sizing, load index, and battery capacity.',
            },
            {
              icon: Wrench,
              title: 'Professional Installation',
              desc: 'Modern rim-safe mounting, balancing, and clean accessory wiring.',
            },
            {
              icon: Award,
              title: 'Complete Wheel Care',
              desc: 'End-to-end maintenance for cars, two-wheelers, and commercial fleets.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl bg-[#1C1D24] border border-white/10 space-y-2.5"
            >
              <item.icon className="w-6 h-6 text-[#F10D17]" />
              <h3 className="font-display text-lg font-bold text-white uppercase">{item.title}</h3>
              <p className="text-xs text-[#B8BBC4] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Store Location & Contact Card */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-[#1C1D24] border border-white/15 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F10D17]">
              VISIT OUR KOLKATA SHOWROOM & WORKSHOP
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase">
              GHOSH TYRE ZONE
            </h3>
            <div className="space-y-1.5 text-sm text-[#B8BBC4]">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F10D17] shrink-0" />
                <span>{BUSINESS_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F10D17] shrink-0" />
                <span>{BUSINESS_INFO.hours}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider"
            >
              <Phone className="w-4 h-4" />
              <span>Call {BUSINESS_INFO.phoneDisplay}</span>
            </a>
            <a
              href={getWhatsAppUrl('Hello Ghosh Tyre Zone, I would like to visit your Kolkata store.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Directions</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
