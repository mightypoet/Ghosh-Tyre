import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  Minus,
  Plus,
  Send,
  Trash2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Enquiry } from '../types';
import { getCartWhatsAppUrl } from '../utils/whatsapp';

export const EnquiryCartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, submitEnquiry } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Kolkata');
  const [vehicleType, setVehicleType] = useState('Car');
  const [vehicleModel, setVehicleModel] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedEnquiry, setConfirmedEnquiry] = useState<Enquiry | null>(null);
  const [error, setError] = useState('');

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName.trim() || !phone.trim()) {
      setError('Please enter your name and mobile number.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const created = await submitEnquiry({
        type: 'cart',
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim() || 'Kolkata',
        vehicleType,
        vehicleModel: vehicleModel.trim(),
        items: [...cart],
        message: message.trim() || `Multi-product enquiry (${cart.length} products)`,
      });
      setConfirmedEnquiry(created);
      clearCart();
    } catch {
      setError('Unable to submit enquiry right now. Please try again or use WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedEnquiry) {
    return (
      <div className="min-h-[75vh] bg-[#14151B] py-16 px-4">
        <div className="max-w-2xl mx-auto bg-[#1C1D24] border border-white/15 rounded-2xl p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F10D17]">
              ENQUIRY CONFIRMED
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase">
              Thank You for Your Enquiry
            </h1>
            <p className="text-sm text-[#B8BBC4] max-w-lg mx-auto">
              Your multi-product enquiry has been registered with our Kolkata team. We will verify
              compatibility and contact you with pricing and installation slots.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#14151B] border border-white/10 space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#B8BBC4] block">
              Enquiry Reference Number
            </span>
            <span className="font-mono-num text-2xl font-bold text-[#FACC15]">
              {confirmedEnquiry.referenceNumber}
            </span>
            <div className="pt-3 border-t border-white/10 text-left text-xs text-[#B8BBC4] space-y-1">
              <p>
                <strong className="text-white">Customer:</strong> {confirmedEnquiry.customerName} (
                {confirmedEnquiry.phone})
              </p>
              <p>
                <strong className="text-white">Vehicle:</strong> {confirmedEnquiry.vehicleType}{' '}
                {confirmedEnquiry.vehicleModel ? `– ${confirmedEnquiry.vehicleModel}` : ''}
              </p>
              <p>
                <strong className="text-white">Products Requested:</strong>{' '}
                {confirmedEnquiry.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={getCartWhatsAppUrl(
                confirmedEnquiry.items,
                confirmedEnquiry.customerName,
                `${confirmedEnquiry.vehicleType} ${confirmedEnquiry.vehicleModel || ''}`,
                confirmedEnquiry.referenceNumber
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Continue Conversation on WhatsApp</span>
            </a>

            <Link
              to="/products"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#22232B] hover:bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-wider"
            >
              Continue Browsing Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#14151B] pb-16">
      <div className="bg-[#1C1D24] border-b border-white/10 py-10">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase">
            Enquiry Cart / My Enquiries
          </h1>
          <p className="text-sm text-[#B8BBC4] mt-1.5">
            Review your selected products and submit a combined enquiry for price, availability, and
            vehicle compatibility verification. No online payment required.
          </p>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {cart.length === 0 ? (
          <div className="bg-[#1C1D24] border border-white/10 rounded-2xl p-12 text-center space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-white/5 text-[#F10D17] flex items-center justify-center mx-auto">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white uppercase">
              Your Enquiry Cart is Empty
            </h2>
            <p className="text-sm text-[#B8BBC4]">
              Explore our tyres, batteries, alloy wheels, and automotive accessories to add items to
              your enquiry list.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider"
              >
                <span>Explore Product Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Selected Products List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h2 className="font-display text-xl font-bold text-white uppercase">
                  Selected Products ({totalItems} Items)
                </h2>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-[#B8BBC4] hover:text-[#F10D17] transition-colors cursor-pointer"
                >
                  Clear All Items
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="p-5 rounded-xl bg-[#1C1D24] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#B8BBC4] uppercase">
                      <span className="text-white font-semibold">{item.brand}</span>
                      <span>·</span>
                      <span>{item.category}</span>
                      <span>·</span>
                      <span className="font-mono-num">SKU: {item.sku}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white">{item.productName}</h3>
                    <p className="text-xs font-semibold text-[#FACC15]">
                      {item.price
                        ? `₹${item.price.toLocaleString('en-IN')}`
                        : 'Contact for Price & Fitment Quote'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="flex items-center bg-[#14151B] border border-white/15 rounded-lg px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="p-1 text-[#B8BBC4] hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono-num text-sm font-bold text-white px-3">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        className="p-1 text-[#B8BBC4] hover:text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="p-2 rounded-lg bg-[#14151B] text-[#B8BBC4] hover:text-[#F10D17] border border-white/10"
                      aria-label="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Combined Enquiry Submission Form */}
            <div className="lg:col-span-5 bg-[#1C1D24] border border-white/15 rounded-2xl p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold text-white uppercase mb-1">
                Submit Combined Enquiry
              </h2>
              <p className="text-xs text-[#B8BBC4] mb-6">
                Fill in your contact and vehicle details below. Our team will share exact pricing
                and availability.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-[#F10D17]/20 border border-[#F10D17] text-xs text-white">
                  {error}
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F10D17]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                      Mobile Number *
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                      Vehicle Type
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white"
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
                      Vehicle Model
                    </label>
                    <input
                      type="text"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder="e.g. Honda City / Creta"
                      className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2.5 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#B8BBC4] mb-1">
                    Additional Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mention tyre size, old battery exchange, or preferred workshop installation date..."
                    className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3.5 py-2 text-sm text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-5 rounded-xl bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Enquiry...' : 'SUBMIT ENQUIRY'}</span>
                </button>

                <a
                  href={getCartWhatsAppUrl(
                    cart,
                    customerName,
                    `${vehicleType} ${vehicleModel}`.trim()
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enquire via WhatsApp</span>
                </a>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
