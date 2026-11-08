import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Tag, 
  ShoppingBag, 
  AlertTriangle,
  ArrowRight,
  Shield,
  Star,
  Camera,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { OfferModal } from '../../components/product/OfferModal';
import { ReportModal } from '../../components/product/ReportModal';
import { ProductCard } from '../../components/product/ProductCard';
import { ThreeInspectionStudio, ModelType } from '../../components/three/ThreeInspectionStudio';
import { ProductViewer as ThreeDProductViewer } from '../../components/three/3DProductViewer';
import { ARViewerModal } from '../../components/ar/ARViewerModal';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { 
    products, 
    sellers, 
    isWishlisted, 
    toggleWishlist, 
    addToCart, 
    recordView,
    createOrOpenConversation 
  } = useAppStore();

  const product = products.find((p) => p.id === productId);
  const seller = sellers.find((s) => s.id === product?.sellerId);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewFormat, setViewFormat] = useState<'photos' | '3d'>('photos');
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const getModelTypeForCategory = (cat: string): ModelType => {
    if (cat.includes('Smartphone')) return 'phone';
    if (cat.includes('Photography') || cat.includes('Camera')) return 'camera';
    if (cat.includes('Watch') || cat.includes('Collectible')) return 'watch';
    if (cat.includes('Furniture')) return 'chair';
    if (cat.includes('Electronics') || cat.includes('Audio')) return 'headphones';
    return 'phone';
  };

  const modelType = getModelTypeForCategory(product?.category || '');

  useEffect(() => {
    if (productId) {
      recordView(productId);
      setActiveImageIndex(0);
      setViewFormat('photos');
      window.scrollTo(0, 0);
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product Listing Not Found</h2>
        <p className="text-xs text-slate-500">The listing may have been sold or removed by the seller.</p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.status === 'Active')
    .slice(0, 3);

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  const handleContactSeller = () => {
    const convId = createOrOpenConversation(product.id, product.sellerId);
    navigate(`/customer/messages?convId=${convId}`);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const conditionExplanations = {
    'Brand New': 'Original factory sealed or untouched packaging with all accessories intact.',
    'Like New': 'Pristine cosmetic state. No visible scratches or signs of wear.',
    'Excellent': 'Gently used with minimal imperceptible micro-marks. Mechanically 100% sound.',
    'Good': 'Minor cosmetic signs of normal usage (bezel scuffs, light surface wear). Fully functional.',
    'Fair': 'Noticeable cosmetic wear, but fully operational and tested.',
  };

  const allImages = product.images.length > 0 ? product.images : [product.coverImage];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link>
        <span>/</span>
        <Link to={`/explore?cat=${encodeURIComponent(product.category)}`} className="hover:text-slate-900 dark:hover:text-white">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main 2-Column Split: Image Gallery (Left) + Purchase Module (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery or Interactive 3D Model */}
        <div className="lg:col-span-7 space-y-4">
          {/* Format Selector: High-Res Photos vs Interactive 3D Model vs AR */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewFormat('photos')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  viewFormat === 'photos'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Photos ({allImages.length})
              </button>
              <button
                onClick={() => setViewFormat('3d')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  viewFormat === '3d'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                3D PBR Studio
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Augmented Reality Button */}
              <button
                onClick={() => setIsAROpen(true)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow-sm transition-all flex items-center gap-1.5 group"
                title="Project 3D model in your physical room with AR camera"
              >
                <Camera className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>View in AR Space</span>
                <span className="hidden sm:inline-block text-[10px] font-medium bg-white/20 px-1.5 py-0.2 rounded-md">
                  WebXR
                </span>
              </button>

              <Link
                to={`/3d-studio?model=${modelType}`}
                className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:underline flex items-center gap-1"
              >
                Advanced Studio
              </Link>
            </div>
          </div>

          {viewFormat === '3d' ? (
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-950">
              <ThreeDProductViewer 
                modelType={modelType} 
                onOpenAR={() => setIsAROpen(true)} 
                height="460px"
              />
            </div>
          ) : (
            <>
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm">
                <img
                  src={allImages[activeImageIndex] || allImages[0]}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/src/assets/images/resell_hero_marketplace_1794130051291.jpg';
                  }}
                />

                {/* Condition badge over main photo */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-xs font-bold text-slate-800 dark:text-slate-200 shadow-md">
                    {product.condition}
                  </span>
                </div>

                {/* Sold tag */}
                {product.status === 'Sold' && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                    <span className="px-5 py-2 bg-red-600 text-white font-bold text-sm tracking-widest uppercase rounded-lg">
                      Listing Sold
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-blue-600 ring-2 ring-blue-500/30'
                          : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Technical Specifications Section */}
          <div className="pt-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Specifications & Diagnostics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(product.specs || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-500 dark:text-slate-400">{key}</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{product.brand} · {product.category}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    title="Share link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      wishlisted ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {copiedShare && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  Link copied to clipboard!
                </p>
              )}

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                {product.title}
              </h1>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-slate-400 line-through tabular-nums">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Inclusive of standard platform escrow guarantee · Delivery options available
              </p>
            </div>

            {/* Condition explainer card */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Verified Condition: {product.condition}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {conditionExplanations[product.condition]}
              </p>
            </div>

            {/* Action Buttons */}
            {product.status === 'Active' ? (
              <div className="space-y-2.5">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Buy Now at ₹{product.price.toLocaleString('en-IN')}
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  {product.isNegotiable && (
                    <button
                      onClick={() => setIsOfferOpen(true)}
                      className="py-2.5 px-3 rounded-xl font-semibold text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Tag className="w-4 h-4" />
                      Make an Offer
                    </button>
                  )}

                  <button
                    onClick={handleContactSeller}
                    className={`py-2.5 px-3 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 ${
                      !product.isNegotiable ? 'col-span-2' : ''
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat with Seller
                  </button>
                </div>

                {/* Mobile / Spatial AR Quick Launch Banner */}
                <button
                  type="button"
                  onClick={() => setIsAROpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-teal-300 dark:border-teal-800/80 bg-teal-50/60 dark:bg-teal-950/30 hover:bg-teal-100/60 dark:hover:bg-teal-900/40 text-teal-800 dark:text-teal-200 transition-colors flex items-center justify-between text-xs font-semibold group"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                      <Camera className="w-3.5 h-3.5" />
                    </span>
                    <span>View in your room (AR Camera)</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-200/80 dark:bg-teal-900/80 text-teal-900 dark:text-teal-200">
                    Try Now
                  </span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-center text-xs font-medium text-slate-500">
                This item has been purchased and is no longer available.
              </div>
            )}

            {/* Seller Snapshot Card */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Listed By Seller
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={seller?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={product.sellerName}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {product.sellerName}
                    </span>
                    {product.isSellerVerified && (
                      <span title="Identity Verified">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {product.sellerRating}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {product.sellerCity}
                    </span>
                  </div>
                </div>
              </div>

              {seller && (
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-500 dark:text-slate-400">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="block text-slate-400">Response Rate</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{seller.responseRate}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="block text-slate-400">Completed Sales</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{seller.completedSales} orders</span>
                  </div>
                </div>
              )}
            </div>

            {/* Safety notice & report */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                Verified Handover Protection
              </span>
              <button
                onClick={() => setIsReportOpen(true)}
                className="hover:text-rose-500 transition-colors flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" />
                Report Listing
              </button>
            </div>
          </div>

          {/* Product Description */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Seller Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            {product.features && product.features.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Key Features & Highlights
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Recommended Products */}
      {similarProducts.length > 0 && (
        <section className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Similar Listings in {product.category}
            </h2>
            <Link
              to={`/explore?cat=${encodeURIComponent(product.category)}`}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              See More
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onMakeOffer={() => {
                  navigate(`/products/${p.id}`);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Offer Modal */}
      <OfferModal
        product={product}
        isOpen={isOfferOpen}
        onClose={() => setIsOfferOpen(false)}
      />

      {/* Report Modal */}
      <ReportModal
        targetType="listing"
        targetId={product.id}
        targetTitle={product.title}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* AR Live Camera / WebXR Projection Modal */}
      <ARViewerModal
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
        modelType={modelType}
        productTitle={product.title}
      />
    </div>
  );
};
