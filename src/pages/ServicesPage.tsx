import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, MessageCircle, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductArtwork } from '../components/ProductArtwork';
import { getServiceWhatsAppUrl } from '../utils/whatsapp';

export const ServicesPage: React.FC = () => {
  const { services, products, openServiceEnquiryModal } = useStore();

  return (
    <div className="min-h-screen bg-[#14151B] pb-16">
      {/* Header */}
      <section className="bg-[#1C1D24] border-b border-white/10 py-14">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F10D17]">
            PROFESSIONAL AUTOMOTIVE WORKSHOP · KOLKATA
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white uppercase mt-2">
            OUR WHEEL CARE & AUTOMOTIVE SERVICES
          </h1>
          <p className="text-sm sm:text-base text-[#B8BBC4] max-w-2xl mt-2">
            From automated tyre installation, 3D wheel alignment, and dynamic balancing to battery
            testing, car AC servicing, Sonax ceramic coating, and sun control film installation.
          </p>
        </div>
      </section>

      {/* All 8 Service Sections */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-10">
        {services.map((service, index) => {
          const relatedProducts = products
            .filter((p) => p.categorySlug === service.relatedCategorySlug)
            .slice(0, 3);

          return (
            <section
              key={service.id}
              id={service.slug}
              className="bg-[#1C1D24] border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10 scroll-mt-24"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Service Visual */}
                <div
                  className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                >
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <ProductArtwork
                      visualType={service.visualType}
                      name={service.name}
                      className="h-64 sm:h-72 w-full"
                    />
                  </div>
                </div>

                {/* Service Details */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#B8BBC4]">
                    <span className="font-bold text-[#F10D17] uppercase tracking-wider">
                      0{index + 1}. Workshop Service
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#FACC15]" />
                      <span>Estimated Time: {service.durationEstimate}</span>
                    </span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase">
                    {service.name}
                  </h2>

                  <p className="text-sm text-[#D1D5DB] leading-relaxed">
                    {service.fullDescription}
                  </p>

                  {/* Key Benefits */}
                  <div className="space-y-2 pt-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Service Benefits & Highlights:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {service.benefits.map((benefit) => (
                        <div
                          key={benefit}
                          className="flex items-start gap-2 text-xs text-[#B8BBC4]"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#F10D17] shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related Products Strip */}
                  {relatedProducts.length > 0 && (
                    <div className="pt-3 border-t border-white/10">
                      <span className="text-[11px] uppercase tracking-wider text-[#B8BBC4] block mb-2">
                        Related Products Available at Store:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {relatedProducts.map((rp) => (
                          <Link
                            key={rp.id}
                            to={`/product/${rp.slug}`}
                            className="text-xs text-white hover:text-[#F10D17] underline underline-offset-4 mr-3"
                          >
                            {rp.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Service CTAs */}
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openServiceEnquiryModal(service.name)}
                      className="px-6 py-3 rounded-xl bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Book / Enquire Now</span>
                    </button>

                    <a
                      href={getServiceWhatsAppUrl(service.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Service Desk</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
