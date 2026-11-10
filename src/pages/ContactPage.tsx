import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialData';
import { useStore } from '../context/StoreContext';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const ContactPage: React.FC = () => {
  const { submitEnquiry } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Kolkata');
  const [state, setState] = useState('West Bengal');
  const [pincode, setPincode] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !city.trim() || !message.trim()) {
      setError('Please fill in all required fields (Name, Phone, City, and Message).');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const created = await submitEnquiry({
        type: 'contact',
        customerName: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        items: [],
        message: message.trim(),
      });
      setSubmittedRef(created.referenceNumber);
      setName('');
      setEmail('');
      setPhone('');
      setPincode('');
      setMessage('');
    } catch {
      setError('Could not send your enquiry right now. Please call us or chat on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#14151B] pb-16">
      {/* Page Header */}
      <section className="bg-[#1C1D24] border-b border-white/10 py-14">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F10D17]">
            VISIT OR REACH OUR SHOWROOM
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white uppercase mt-2">
            CONTACT GHOSH TYRE ZONE
          </h1>
          <p className="text-sm sm:text-base text-[#B8BBC4] max-w-2xl mt-2">
            Have a question about tyre sizes, battery replacement, wheel alignment, or accessories?
            Reach out to our Kolkata showroom directly.
          </p>
        </div>
      </section>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Store Details & Direct CTAs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1C1D24] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F10D17]">
                  OFFICIAL SHOWROOM & WORKSHOP
                </span>
                <h2 className="font-display text-2xl font-bold text-white uppercase mt-1">
                  {BUSINESS_INFO.name}
                </h2>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Store Address</span>
                    <span className="text-[#B8BBC4] leading-relaxed">{BUSINESS_INFO.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Phone Number</span>
                    <a
                      href={`tel:${BUSINESS_INFO.phoneRaw}`}
                      className="font-mono-num text-[#FACC15] hover:underline font-semibold"
                    >
                      {BUSINESS_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Email Address</span>
                    <a
                      href={`mailto:${BUSINESS_INFO.email}`}
                      className="text-[#B8BBC4] hover:text-white"
                    >
                      {BUSINESS_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#F10D17]/15 text-[#F10D17] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Business Hours</span>
                    <span className="text-[#B8BBC4]">{BUSINESS_INFO.hours}</span>
                  </div>
                </div>
              </div>

              {/* Click-to-Call & WhatsApp Buttons */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="py-3 px-4 rounded-xl bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Click to Call</span>
                </a>

                <a
                  href={getWhatsAppUrl(
                    'Hello Ghosh Tyre Zone, I am contacting you from your website Contact Us page.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Embedded Google Maps Integration */}
            <div className="bg-[#1C1D24] border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Google Maps Location · Garpar, Machuabazar
                </span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=38C+Raja+Dinendra+Street+Garpar+Machuabazar+Kolkata+700009"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#F10D17] hover:underline font-medium"
                >
                  Open in Google Maps →
                </a>
              </div>
              <iframe
                title="Ghosh Tyre Zone Location Map"
                src="https://maps.google.com/maps?q=38C%20Raja%20Dinendra%20Street%20Garpar%20Machuabazar%20Kolkata%20700009&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-72 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Business Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#1C1D24] border border-white/10 rounded-2xl p-6 sm:p-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F10D17]">
                SEND US A MESSAGE
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase mt-1 mb-2">
                BUSINESS & CUSTOMER ENQUIRY FORM
              </h2>
              <p className="text-xs text-[#B8BBC4] mb-6">
                Complete the form below and our automotive specialists will get back to you
                promptly.
              </p>

              {submittedRef && (
                <div className="mb-6 p-5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">
                      Enquiry Submitted Successfully (Ref: {submittedRef})
                    </h4>
                    <p className="text-xs text-[#D1D5DB]">
                      Thank you for reaching out to Ghosh Tyre Zone. Our team will contact you
                      shortly.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-[#F10D17]/20 border border-[#F10D17] text-xs text-white">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F10D17]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F10D17]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98300 XXXXX"
                      className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F10D17]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Kolkata"
                      className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F10D17]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="West Bengal"
                      className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F10D17]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="700009"
                      className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F10D17]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                    Your Message / Vehicle Enquiry *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your vehicle model, tyre size, battery requirement, or service booking..."
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F10D17]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Enquiry...' : 'SEND ENQUIRY'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
