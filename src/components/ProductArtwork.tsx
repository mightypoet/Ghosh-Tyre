import React, { useState } from 'react';
import { Product } from '../types';

interface ProductArtworkProps {
  visualType: Product['visualType'] | string;
  brand?: string;
  name?: string;
  customImage?: string;
  variant?: 'card' | 'detail' | 'thumb' | 'circle';
  viewIndex?: number;
  className?: string;
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  visualType,
  brand = '',
  name = '',
  customImage,
  variant = 'card',
  viewIndex = 0,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  // If the admin added a custom uploaded URL (not one of the default composite banners) or user is viewing secondary gallery photo
  const isCustomUpload =
    customImage &&
    !customImage.includes('/assets/aistudio/image_f3b889b3.png') &&
    !customImage.includes('/assets/aistudio/image_6aa2fd52.png') &&
    !customImage.includes('/assets/aistudio/image_8a83cfc1.png');

  if ((isCustomUpload || viewIndex === 2) && customImage && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-[#DCDFE6] flex items-center justify-center ${className}`}>
        <img
          src={customImage}
          alt={name || 'Ghosh Tyre Zone Product'}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  // Studio backdrop matching the reference screenshot's clean light metallic studio stage (#D8DBE2)
  const bgClass =
    variant === 'circle'
      ? 'bg-gradient-to-b from-[#E2E5EC] to-[#C8CDD8]'
      : 'bg-gradient-to-b from-[#DFE2E9] via-[#D5D8E0] to-[#C9CDD6]';

  return (
    <div
      className={`relative overflow-hidden ${bgClass} flex items-center justify-center select-none ${className}`}
      role="img"
      aria-label={name || `${brand} ${visualType}`}
    >
      {/* Subtle studio floor shadow */}
      <div className="absolute bottom-3 w-3/4 h-4 bg-black/15 rounded-full blur-md pointer-events-none" />

      {/* Render bespoke high-detail automotive SVG studio artwork by product type */}
      {visualType === 'speaker' && (
        <svg viewBox="0 0 260 180" className="w-4/5 h-4/5 drop-shadow-md">
          {/* Left Speaker (Yellow Kevlar Cone inspired by Ghosh Tyre Zone screenshot) */}
          <g transform={viewIndex === 1 ? 'translate(45, 5) scale(1.1)' : 'translate(12, 18)'}>
            <circle cx="68" cy="72" r="56" fill="#181920" stroke="#2E303E" strokeWidth="4" />
            <circle cx="68" cy="72" r="48" fill="#101116" stroke="#44475A" strokeWidth="1.5" strokeDasharray="6 4" />
            <circle cx="68" cy="72" r="39" fill="#EAB308" stroke="#CA8A04" strokeWidth="3" />
            <circle cx="68" cy="72" r="28" fill="none" stroke="#FEF08A" strokeWidth="1" opacity="0.6" />
            <circle cx="68" cy="72" r="16" fill="#181920" stroke="#3F3F46" strokeWidth="2" />
            <rect x="44" y="67" width="48" height="10" rx="3" fill="#27272A" stroke="#52525B" strokeWidth="1" />
            <circle cx="68" cy="72" r="4" fill="#F10D17" />
          </g>
          {/* Right Speaker */}
          {viewIndex !== 1 && (
            <g transform="translate(115, 22)">
              <circle cx="68" cy="70" r="54" fill="#181920" stroke="#2E303E" strokeWidth="4" />
              <circle cx="68" cy="70" r="46" fill="#101116" stroke="#44475A" strokeWidth="1.5" strokeDasharray="6 4" />
              <circle cx="68" cy="70" r="37" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" />
              <circle cx="68" cy="70" r="15" fill="#181920" stroke="#3F3F46" strokeWidth="2" />
              <rect x="46" y="65" width="44" height="10" rx="3" fill="#27272A" />
              <circle cx="68" cy="70" r="4" fill="#F10D17" />
            </g>
          )}
        </svg>
      )}

      {(visualType === 'video-system' || visualType === 'audio') && (
        <svg viewBox="0 0 260 180" className="w-4/5 h-4/5 drop-shadow-md">
          {/* Touchscreen In-Dash Infotainment Unit matching screenshot */}
          <rect x="38" y="24" width="184" height="114" rx="8" fill="#14151B" stroke="#2E3240" strokeWidth="3" />
          <rect x="48" y="32" width="164" height="94" rx="4" fill="#0F172A" />
          {/* Screen UI */}
          <rect x="48" y="32" width="164" height="16" fill="#1E293B" />
          <text x="56" y="43" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">
            10:11 AM · BT AUDIO
          </text>
          {/* Navigation & Media widgets */}
          <rect x="56" y="54" width="72" height="64" rx="4" fill="#1E293B" stroke="#334155" strokeWidth="1" />
          <circle cx="92" cy="80" r="18" fill="none" stroke="#38BDF8" strokeWidth="2.5" />
          <path d="M92 68 L98 86 L92 82 L86 86 Z" fill="#F10D17" />
          <rect x="134" y="54" width="70" height="30" rx="4" fill="#1E293B" />
          <text x="142" y="72" fill="#E2E8F0" fontSize="8" fontWeight="bold">
            EQUALIZER HD
          </text>
          <rect x="134" y="88" width="70" height="30" rx="4" fill="#0284C7" />
          <text x="142" y="106" fill="#FFFFFF" fontSize="8" fontWeight="bold">
            REAR CAM READY
          </text>
          {/* Lower DIN chassis */}
          <rect x="52" y="138" width="156" height="20" rx="3" fill="#1F2028" stroke="#383A47" strokeWidth="1.5" />
          <circle cx="68" cy="148" r="5" fill="#F10D17" />
          <rect x="84" y="145" width="90" height="6" rx="2" fill="#111217" />
        </svg>
      )}

      {(visualType === 'tyre-car' ||
        visualType === 'tyre-suv' ||
        visualType === 'tyre-moto' ||
        visualType === 'tyre-truck' ||
        visualType === 'tyres') && (
        <svg viewBox="0 0 260 190" className="w-4/5 h-4/5 drop-shadow-lg">
          {/* Standing Tread Tyre on Left */}
          <g transform="translate(36, 16)">
            <rect x="0" y="6" width="54" height="148" rx="14" fill="#1B1C22" stroke="#111216" strokeWidth="2" />
            {/* Tread Grooves */}
            {[22, 42, 62, 82, 102, 122, 140].map((y) => (
              <g key={y}>
                <line x1="6" y1={y} x2="22" y2={y - 6} stroke="#383B47" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="48" y1={y} x2="32" y2={y - 6} stroke="#383B47" strokeWidth="3.5" strokeLinecap="round" />
              </g>
            ))}
            <line x1="23" y1="10" x2="23" y2="150" stroke="#0D0E12" strokeWidth="3" />
            <line x1="31" y1="10" x2="31" y2="150" stroke="#0D0E12" strokeWidth="3" />
          </g>
          {/* Angled Front Tyre with Alloy Rim on Right */}
          <g transform="translate(82, 18)">
            <circle cx="78" cy="78" r="72" fill="#181920" stroke="#2B2D38" strokeWidth="4" />
            <circle cx="78" cy="78" r="61" fill="none" stroke="#2F323E" strokeWidth="2" strokeDasharray="10 5" />
            <circle cx="78" cy="78" r="46" fill="#23252F" stroke="#9CA3AF" strokeWidth="3" />
            {/* 5 Twin Spokes */}
            {[0, 72, 144, 216, 288].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 78 78)`}>
                <path d="M73 34 L76 78 L82 78 L85 34 Z" fill="#D1D5DB" />
              </g>
            ))}
            <circle cx="78" cy="78" r="14" fill="#14151B" stroke="#F10D17" strokeWidth="2.5" />
            <text
              x="78"
              y="26"
              textAnchor="middle"
              fill="#9CA3AF"
              fontSize="7.5"
              fontWeight="bold"
              letterSpacing="1.5"
            >
              {(brand || 'RADIAL TUBELESS').toUpperCase().slice(0, 14)}
            </text>
          </g>
        </svg>
      )}

      {(visualType === 'battery-car' || visualType === 'battery-moto' || visualType === 'batteries') && (
        <svg viewBox="0 0 260 180" className="w-4/5 h-4/5 drop-shadow-lg">
          {/* Automotive Battery Box */}
          <g transform="translate(48, 26)">
            {/* Terminals */}
            <rect x="22" y="4" width="14" height="12" rx="2" fill="#EF4444" />
            <rect x="128" y="4" width="14" height="12" rx="2" fill="#3B82F6" />
            {/* Top Cover */}
            <rect
              x="6"
              y="14"
              width="152"
              height="18"
              rx="3"
              fill={brand.toLowerCase().includes('amaron') ? '#15803D' : '#B91C1C'}
            />
            {/* Main Casing */}
            <rect
              x="10"
              y="30"
              width="144"
              height="96"
              rx="4"
              fill={
                brand.toLowerCase().includes('amaron')
                  ? '#16A34A'
                  : brand.toLowerCase().includes('exide')
                  ? '#DC2626'
                  : '#1D4ED8'
              }
            />
            {/* Front Label */}
            <rect x="24" y="46" width="116" height="62" rx="4" fill="#FFFFFF" />
            <text
              x="82"
              y="72"
              textAnchor="middle"
              fill="#111827"
              fontSize="16"
              fontWeight="900"
              fontFamily="Oswald, sans-serif"
            >
              {(brand || 'HEAVY DUTY').toUpperCase()}
            </text>
            <rect x="42" y="80" width="80" height="16" rx="2" fill="#14151B" />
            <text x="82" y="91" textAnchor="middle" fill="#FACC15" fontSize="8" fontWeight="bold">
              ZERO MAINTENANCE
            </text>
          </g>
        </svg>
      )}

      {(visualType === 'alloy-wheel' || visualType === 'wheels') && (
        <svg viewBox="0 0 240 190" className="w-4/5 h-4/5 drop-shadow-xl">
          <g transform="translate(25, 5)">
            <circle cx="95" cy="90" r="76" fill="#14151B" stroke="#D1D5DB" strokeWidth="5" />
            <circle cx="95" cy="90" r="68" fill="#1F212B" stroke="#4B5563" strokeWidth="2" />
            {/* Multi-spoke diamond-cut geometry */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <g key={angle} transform={`rotate(${angle} 95 90)`}>
                <polygon points="89,22 95,84 101,22 97,20 93,20" fill="#E5E7EB" />
                <polygon points="95,84 103,24 108,27 98,84" fill="#6B7280" />
              </g>
            ))}
            <circle cx="95" cy="90" r="20" fill="#111217" stroke="#9CA3AF" strokeWidth="2" />
            {/* 5 Lug Nuts */}
            {[0, 72, 144, 216, 288].map((a) => (
              <circle
                key={a}
                cx={95 + 12 * Math.cos((a * Math.PI) / 180)}
                cy={90 + 12 * Math.sin((a * Math.PI) / 180)}
                r="2.5"
                fill="#D1D5DB"
              />
            ))}
            <circle cx="95" cy="90" r="6" fill="#F10D17" />
          </g>
        </svg>
      )}

      {(visualType === 'sun-film' ||
        visualType === 'ceramic-coating' ||
        visualType === 'detailing' ||
        visualType === 'exterior' ||
        visualType === 'services') && (
        <svg viewBox="0 0 260 180" className="w-4/5 h-4/5 drop-shadow-md">
          {/* Sleek Car Profile + Protection Shield */}
          <path
            d="M36 118 L58 82 L114 74 L172 78 L216 102 L224 122 L36 122 Z"
            fill="#181920"
            stroke="#F10D17"
            strokeWidth="2.5"
          />
          <path d="M66 84 L112 78 L160 82 L182 98 L60 98 Z" fill="#0284C7" opacity="0.65" />
          <circle cx="72" cy="122" r="18" fill="#111216" stroke="#D1D5DB" strokeWidth="3" />
          <circle cx="184" cy="122" r="18" fill="#111216" stroke="#D1D5DB" strokeWidth="3" />
          {/* Ceramic / UV Bottle */}
          <rect x="180" y="34" width="38" height="72" rx="5" fill="#14151B" stroke="#FACC15" strokeWidth="2" />
          <rect x="191" y="22" width="16" height="12" fill="#F10D17" />
          <text x="199" y="68" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">
            SONAX
          </text>
          <text x="199" y="80" textAnchor="middle" fill="#FACC15" fontSize="6.5" fontWeight="bold">
            PRO CARE
          </text>
        </svg>
      )}

      {(visualType === 'brake-fluid' ||
        visualType === 'converter' ||
        visualType === 'armrest' ||
        visualType === 'camera' ||
        visualType === 'organizer' ||
        visualType === 'air-freshener' ||
        visualType === 'buzzer' ||
        visualType === 'tool' ||
        visualType === 'accessories' ||
        visualType === 'parts' ||
        visualType === 'interior' ||
        visualType === 'tools') && (
        <svg viewBox="0 0 260 180" className="w-4/5 h-4/5 drop-shadow-md">
          {/* Precision Hardware / Brake Disc + Fluid Canister + Camera Module */}
          <circle cx="90" cy="94" r="52" fill="#9CA3AF" stroke="#4B5563" strokeWidth="3" />
          <circle cx="90" cy="94" r="24" fill="#374151" stroke="#D1D5DB" strokeWidth="2" />
          {/* Brake Caliper in Racing Red */}
          <path d="M115 52 C140 62, 145 96, 130 116 L112 106 C120 92, 118 70, 104 62 Z" fill="#F10D17" />
          {/* Accessory / Fluid Canister */}
          <rect x="142" y="44" width="66" height="96" rx="8" fill="#181920" stroke="#383B47" strokeWidth="2.5" />
          <rect x="150" y="58" width="50" height="44" rx="4" fill="#FACC15" />
          <text x="175" y="78" textAnchor="middle" fill="#14151B" fontSize="9" fontWeight="900">
            GENUINE
          </text>
          <text x="175" y="92" textAnchor="middle" fill="#14151B" fontSize="7.5" fontWeight="bold">
            AUTO CARE
          </text>
          <circle cx="175" cy="120" r="10" fill="#F10D17" />
        </svg>
      )}
    </div>
  );
};
