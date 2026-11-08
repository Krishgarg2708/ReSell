import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Tag, 
  TrendingUp, 
  HelpCircle, 
  ChevronDown,
  ShoppingBag,
  Star
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CATEGORIES } from '../../data/categories';
import { ProductCard } from '../../components/product/ProductCard';
import { OfferModal } from '../../components/product/OfferModal';
import { Product } from '../../types';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, sellers } = useAppStore();
  const [selectedOfferProduct, setSelectedOfferProduct] = useState<Product | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const featuredProducts = products.filter((p) => p.featured && p.status === 'Active').slice(0, 6);
  const trendingProducts = products.filter((p) => p.trending && p.status === 'Active').slice(0, 4);
  const verifiedSellers = sellers.filter((s) => s.isVerified && s.id !== 'seller-demo').slice(0, 4);

  const faqs = [
    {
      q: 'How does ReSell ensure seller and product authenticity?',
      a: 'All verified sellers on ReSell authenticate their identity using government-issued Aadhaar, PAN, or Passport records. Listings in high-value categories (smartphones, cameras, luxury timepieces) include diagnostic battery reports, serial checks, and high-resolution multi-angle photography.',
    },
    {
      q: 'Can I negotiate prices with sellers?',
      a: 'Yes! Sellers can mark their listings as negotiable. You can propose an offer with a single click, counteroffer within the in-app chat, and lock in agreed prices securely before completing payment.',
    },
    {
      q: 'How does payment and handover work?',
      a: 'ReSell supports both verified doorstep courier delivery (with live tracking numbers via partner couriers) and convenient in-person handovers with local pickup options in major metro cities.',
    },
    {
      q: 'What is the fee for selling an item?',
      a: 'Listing your items on ReSell is 100% free for individual sellers. There are no upfront fees or listing expiration charges.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900/60">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>India’s Premium Second-Hand Marketplace</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] text-balance">
                Find Something Great. Give Something a Second Life.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Discover pre-owned smartphones, MacBooks, Leica optics, designer fashion, and ergonomic furniture from verified owners. Shop smarter with transparent price negotiations and verified handovers.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/explore')}
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  Explore Products
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/3d-studio')}
                  className="px-5 py-3.5 rounded-xl font-semibold text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  3D Inspection Studio
                </button>
                <button
                  onClick={() => navigate('/seller/add-product')}
                  className="px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-xs"
                >
                  Sell Your Item
                </button>
              </div>

              {/* Quantitative Proof Adjacency */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                    60+
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Verified Listings
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                    ₹4.2L+
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Buyer Savings
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                    4.9/5
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Seller Satisfaction
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 aspect-[16/10] lg:aspect-[4/3] bg-slate-100 dark:bg-slate-800 group">
                <img
                  src="/src/assets/images/resell_hero_marketplace_1794130051291.jpg"
                  alt="Curated second-hand marketplace products"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Floating Micro-Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 dark:border-slate-800 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/10 dark:bg-blue-400/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Aadhaar Verified Peer Sellers</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero middlemen · Direct offers</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    Avg -45% Off
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Popular Categories</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Browse quality pre-owned goods across top departments</p>
          </div>
          <Link
            to="/categories"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            All 12 Categories
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              to={`/explore?cat=${encodeURIComponent(cat.name)}`}
              className="group p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all flex flex-col items-center text-center space-y-2.5"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                  {cat.itemCount} listings
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Listings</h2>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                Inspected & Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Top curated items with verified battery health, optical clarity, or structural certificates
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View All ({products.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onMakeOffer={(p) => setSelectedOfferProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 4. TRENDING DEALS BANNER & GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 mb-8 overflow-hidden relative shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-300">
              <TrendingUp className="w-4 h-4" />
              Highest Value Drops
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Up to 65% off original retail on flagship tech & cameras
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every item has passed our community verified checklist. Make a direct price offer or buy instantly with full delivery tracking.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onMakeOffer={(p) => setSelectedOfferProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 5. VERIFIED SELLERS HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Meet Top Verified Sellers</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Experienced second-hand curators with authenticated identities and 4.8+ ratings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {verifiedSellers.map((seller) => (
            <div
              key={seller.id}
              className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {seller.name}
                    </h4>
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{seller.city}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {seller.bio}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {seller.rating} ({seller.reviewCount})
                </span>
                <span className="tabular-nums">{seller.completedSales} sales</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="bg-slate-100/60 dark:bg-slate-900/40 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              How ReSell Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Designed to make peer-to-peer commerce as seamless and secure as ordering brand new
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Discover or Make an Offer
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Browse pre-owned electronics, furniture, or cameras with transparent specs. Propose an offer to negotiate directly with the seller in real-time.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Instant Chat & Agreement
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Discuss specs, request extra snapshots, and agree on counteroffers inside encrypted in-app conversations.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Tracked Handover & Protection
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose doorstep courier delivery with live milestone tracking or arrange in-person pickup with verified receipt handovers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Everything you need to know about ReSell
          </h2>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4"
              >
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Offer Modal */}
      <OfferModal
        product={selectedOfferProduct}
        isOpen={Boolean(selectedOfferProduct)}
        onClose={() => setSelectedOfferProduct(null)}
      />
    </div>
  );
};
