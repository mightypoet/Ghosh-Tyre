import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href={getWhatsAppUrl(
        'Hello Ghosh Tyre Zone, I would like to enquire about tyres, batteries, alloy wheels and workshop services in Kolkata.'
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Ghosh Tyre Zone on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white shadow-xl transition-transform duration-200 hover:scale-105"
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
        WhatsApp Us
      </span>
    </a>
  );
};
