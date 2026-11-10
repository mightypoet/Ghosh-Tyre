import React, { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle, Send, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Enquiry } from '../types';
import {
  getProductWhatsAppUrl,
  getServiceWhatsAppUrl,
  getWhatsAppUrl,
} from '../utils/whatsapp';

export const EnquiryModal: React.FC = () => {
  const { enquiryModal, closeEnquiryModal, submitEnquiry } = useStore();
  const { isOpen, type, product, quantity: initialQty = 1, serviceName } = enquiryModal;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Kolkata');
  const [vehicleType, setVehicleType] = useState('Car');
  const [vehicleModel, setVehicleModel] = useState('');
  const [quantity, setQuantity] = useState(initialQty);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<Enquiry | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuantity(initialQty || 1);
      setSubmittedEnquiry(null);
      setError('');
      if (product && product.vehicleTypes.length > 0) {
        setVehicleType(product.vehicleTypes[0]);
      }
    }
  }, [isOpen, initialQty, product]);

  if (!isOpen) return null;

  const targetTitle =
    type === 'product' && product
      ? product.name
      : serviceName || 'Automotive Service Enquiry';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      setError('Please enter your name and mobile number.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const created = await submitEnquiry({
        type: type === 'product' ? 'product' : 'service',
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim() || 'Kolkata',
        vehicleType,
        vehicleModel: vehicleModel.trim(),
        serviceName: type === 'service' ? serviceName : undefined,
        items:
          type === 'product' && product
            ? [
                {
                  productId: product.id,
                  productName: product.name,
                  sku: product.sku,
                  brand: product.brand,
                  category: product.category,
                  quantity,
                  price: product.price,
                },
              ]
            : [],
        message:
          message.trim() ||
          `Enquiry for ${targetTitle} (${vehicleType} ${vehicleModel ? `- ${vehicleModel}` : ''})`,
      });
      setSubmittedEnquiry(created);
    } catch {
      setError('Something went wrong. Please try again or message us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl =
    type === 'product' && product
      ? getProductWhatsAppUrl(product, quantity)
      : serviceName
      ? getServiceWhatsAppUrl(serviceName)
      : getWhatsAppUrl(`Hello Ghosh Tyre Zone, I am interested in ${targetTitle}.`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1C1D24] border border-white/15 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#14151B] border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#F10D17]">
              Ghosh Tyre Zone · Direct Enquiry
            </span>
            <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide mt-0.5">
              {submittedEnquiry ? 'Enquiry Received' : 'Request Price & Availability'}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeEnquiryModal}
            className="p-2 rounded-lg text-[#B8BBC4] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedEnquiry ? (
          <div className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-wider text-[#B8BBC4]">
                Enquiry Reference Number
              </p>
              <p className="font-mono-num text-xl font-bold text-white">
                {submittedEnquiry.referenceNumber}
              </p>
              <p className="text-sm text-[#B8BBC4] max-w-md mx-auto pt-1">
                Thank you, <span className="text-white font-semibold">{submittedEnquiry.customerName}</span>.
                Our technical team at Raja Dinendra Street, Kolkata will contact you shortly with
                pricing, stock availability, and installation details.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#14151B] border border-white/10 text-left text-xs space-y-1">
              <div className="text-[#B8BBC4]">
                <span className="text-white font-semibold">Item / Service: </span>
                {targetTitle}
              </div>
              {submittedEnquiry.vehicleModel && (
                <div className="text-[#B8BBC4]">
                  <span className="text-white font-semibold">Vehicle: </span>
                  {submittedEnquiry.vehicleType} – {submittedEnquiry.vehicleModel}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Continue on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={closeEnquiryModal}
                className="py-3 px-5 rounded-lg bg-[#22232B] hover:bg-white/10 text-white text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
            {/* Auto-populated Product / Service Box */}
            <div className="p-3.5 rounded-xl bg-[#14151B] border border-white/10 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[11px] text-[#B8BBC4] block">Selected Item:</span>
                <span className="text-sm font-semibold text-white truncate block">
                  {targetTitle}
                </span>
              </div>
              {type === 'product' && (
                <div className="flex items-center gap-2 shrink-0">
                  <label className="text-xs text-[#B8BBC4]">Qty:</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-16 bg-[#1C1D24] border border-white/15 rounded-lg px-2.5 py-1.5 text-sm text-white text-center font-mono-num"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[#F10D17]/15 border border-[#F10D17] text-xs text-white">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
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
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F10D17]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#B8BBC4] mb-1">City *</label>
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
                  Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F10D17]"
                >
                  <option value="Car">Car</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Two Wheeler">Two Wheeler</option>
                  <option value="Commercial Vehicle">Commercial Vehicle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                  Vehicle Make & Model
                </label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g. Hyundai Creta / Swift"
                  className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F10D17]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                Additional Message / Tyre Size Requirement
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your tyre size, battery Ah rating, or preferred workshop visit time..."
                className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#F10D17]"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 px-5 rounded-lg bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Submit Enquiry'}</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Direct</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
