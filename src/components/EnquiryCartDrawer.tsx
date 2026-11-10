import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ClipboardList, Minus, Plus, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getCartWhatsAppUrl } from '../utils/whatsapp';

export const EnquiryCartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
  } = useStore();
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs">
      <div className="bg-[#1C1D24] border-l border-white/10 w-full max-w-md h-full flex flex-col justify-between shadow-2xl">
        {/* Drawer Header */}
        <div className="px-6 py-5 bg-[#14151B] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ClipboardList className="w-5 h-5 text-[#F10D17]" />
            <div>
              <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide">
                My Enquiry List ({totalItems})
              </h3>
              <p className="text-xs text-[#B8BBC4]">
                Add multiple products and submit a combined enquiry
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-2 rounded-lg text-[#B8BBC4] hover:text-white hover:bg-white/10"
            aria-label="Close Enquiry Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto text-[#B8BBC4]">
                <ClipboardList className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-white">Your Enquiry List is Empty</p>
                <p className="text-xs text-[#B8BBC4] max-w-xs mx-auto">
                  Browse our tyres, batteries, alloy wheels, and accessories to add products for
                  price and compatibility verification.
                </p>
              </div>
              <Link
                to="/products"
                onClick={() => setIsCartDrawerOpen(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#F10D17] text-white text-xs font-bold uppercase tracking-wider"
              >
                <span>Browse Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.productId}
                className="p-4 rounded-xl bg-[#22232B] border border-white/10 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-[#B8BBC4] uppercase tracking-wider">
                      {item.brand} · {item.category}
                    </span>
                    <h4 className="text-sm font-semibold text-white mt-0.5">{item.productName}</h4>
                    <span className="text-[11px] font-mono-num text-[#B8BBC4]">
                      SKU: {item.sku}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1.5 text-[#B8BBC4] hover:text-[#F10D17] transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 bg-[#14151B] border border-white/15 rounded-lg px-2 py-1">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      className="p-1 text-[#B8BBC4] hover:text-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono-num text-xs font-bold text-white px-2">
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

                  <span className="text-xs font-semibold text-[#FACC15]">
                    {item.price ? `₹${item.price.toLocaleString('en-IN')}` : 'Contact for Price'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-[#14151B] border-t border-white/10 space-y-3">
            <button
              type="button"
              onClick={() => {
                setIsCartDrawerOpen(false);
                navigate('/enquiry-cart');
              }}
              className="w-full py-3 px-4 rounded-lg bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Proceed to Submit Enquiry ({totalItems} Items)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={getCartWhatsAppUrl(cart)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Send Enquiry List via WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
