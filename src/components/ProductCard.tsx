import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Send } from 'lucide-react';
import { Product } from '../types';
import { ProductArtwork } from './ProductArtwork';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { openProductEnquiryModal, addToCart } = useStore();

  const specSummary = product.tyreSpecs?.width
    ? `${product.tyreSpecs.width}/${product.tyreSpecs.aspectRatio} ${product.tyreSpecs.rimDiameter} ${
        product.tyreSpecs.loadIndex || ''
      }${product.tyreSpecs.speedRating || ''}`.trim()
    : product.subCategory;

  return (
    <div className="group bg-[#22232B] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25">
      <div>
        {/* Product Studio Visual Area (65%-70% height emphasis inspired by reference screenshot) */}
        <Link to={`/product/${product.slug}`} className="block relative">
          <ProductArtwork
            visualType={product.visualType}
            brand={product.brand}
            name={product.name}
            customImage={product.images?.[0]}
            className="h-52 w-full"
          />
        </Link>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          {/* Clean Unboxed Metadata */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#B8BBC4] uppercase tracking-wider truncate">
            <span className="font-semibold text-white/90">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
            {specSummary && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num text-[#B8BBC4]">{specSummary}</span>
              </>
            )}
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug}`}
            className="block mt-1.5 text-base font-semibold text-white group-hover:text-[#F10D17] transition-colors line-clamp-2 min-h-[3rem]"
          >
            {product.name}
          </Link>

          {!compact && (
            <p className="mt-1.5 text-xs text-[#B8BBC4] line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Vehicle Compatibility & Price / Contact for Price */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
            <div className="text-xs text-[#B8BBC4] truncate">
              <span className="text-white/70">Fits: </span>
              <span>{product.vehicleTypes.join(', ')}</span>
            </div>
            <div className="shrink-0 text-right">
              {product.price !== null && product.price > 0 ? (
                <span className="font-mono-num text-sm font-bold text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              ) : (
                <span className="text-xs font-semibold text-[#FACC15]">Contact for Price</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => openProductEnquiryModal(product, 1)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#F10D17] hover:bg-[#d10b14] text-white text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enquire Now</span>
          </button>

          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-lg bg-[#14151B] hover:bg-white/10 border border-white/15 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#F10D17]" />
            <span>Add to List</span>
          </button>
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="w-full py-1.5 text-center text-xs font-medium text-[#B8BBC4] hover:text-white flex items-center justify-center gap-1 transition-colors"
        >
          <span>View Full Specifications</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
