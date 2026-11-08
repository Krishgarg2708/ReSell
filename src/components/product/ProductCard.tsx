import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, CheckCircle2, MapPin, Tag } from 'lucide-react';
import { Product } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface ProductCardProps {
  product: Product;
  onMakeOffer?: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onMakeOffer, className = '' }) => {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist, addToCart } = useAppStore();
  const wishlisted = isWishlisted(product.id);

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleOfferClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onMakeOffer) {
      onMakeOffer(product);
    } else {
      navigate(`/products/${product.id}#offer`);
    }
  };

  return (
    <div
      className={`group relative flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${className}`}
    >
      {/* Image Container */}
      <Link to={`/products/${product.id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.coverImage || product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/src/assets/images/resell_hero_marketplace_1794130051291.jpg';
          }}
        />

        {/* Condition Tag */}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wider rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-800 dark:text-slate-200 shadow-xs">
            {product.condition}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all backdrop-blur-xs ${
            wishlisted
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-900 shadow-xs'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Status Overlay if Sold */}
        {product.status === 'Sold' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center">
            <span className="px-3 py-1 bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-md">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Category & Location */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              {product.sellerCity}
            </span>
          </div>

          {/* Title */}
          <Link to={`/products/${product.id}`} className="block mt-1.5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold tabular-nums text-slate-900 dark:text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {discountPercent > 0 && (
                <>
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {discountPercent}% off
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Seller Trust Bar & Action Buttons */}
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                {product.sellerName.replace(' (Demo Seller)', '')}
              </span>
              {product.isSellerVerified && (
                <span title="Verified Seller">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {product.isNegotiable && product.status !== 'Sold' && (
                <button
                  onClick={handleOfferClick}
                  className="px-2 py-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded transition-colors flex items-center gap-1"
                  title="Make an offer"
                >
                  <Tag className="w-3 h-3" />
                  Offer
                </button>
              )}
              {product.status !== 'Sold' && (
                <button
                  onClick={handleQuickAdd}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
