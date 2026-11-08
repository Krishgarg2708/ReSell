import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Grid, 
  List, 
  X, 
  RotateCcw, 
  CheckCircle2, 
  Tag, 
  Sparkles 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ProductCard } from '../../components/product/ProductCard';
import { OfferModal } from '../../components/product/OfferModal';
import { CATEGORIES } from '../../data/categories';
import { Product, ProductCondition } from '../../types';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useAppStore();

  const [selectedOfferProduct, setSelectedOfferProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state from URL or defaults
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('cat') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedConditions, setSelectedConditions] = useState<ProductCondition[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [negotiableOnly, setNegotiableOnly] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'popular' | 'best-deals'>('recent');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Sync category or query param if changed externally
  React.useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (queryParam) setSearchQuery(queryParam);
  }, [categoryParam, queryParam]);

  // Unique cities from products
  const cities = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.sellerCity) set.add(p.sellerCity);
    });
    return Array.from(set).sort();
  }, [products]);

  // Conditions list
  const conditions: ProductCondition[] = ['Brand New', 'Like New', 'Excellent', 'Good', 'Fair'];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesSeller = p.sellerName.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand && !matchesCategory && !matchesSeller && !matchesDesc) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && p.category !== selectedCategory) {
        return false;
      }

      // Condition filter
      if (selectedConditions.length > 0 && !selectedConditions.includes(p.condition)) {
        return false;
      }

      // Price filter
      if (minPrice && p.price < Number(minPrice)) {
        return false;
      }
      if (maxPrice && p.price > Number(maxPrice)) {
        return false;
      }

      // Verified seller filter
      if (verifiedOnly && !p.isSellerVerified) {
        return false;
      }

      // Negotiable only
      if (negotiableOnly && !p.isNegotiable) {
        return false;
      }

      // City filter
      if (selectedCity && p.sellerCity !== selectedCity) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'best-deals') {
        const discountA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const discountB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return discountB - discountA;
      }
      // default: recent
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, searchQuery, selectedCategory, selectedConditions, minPrice, maxPrice, verifiedOnly, negotiableOnly, selectedCity, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleConditionToggle = (cond: ProductCondition) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedConditions([]);
    setMinPrice('');
    setMaxPrice('');
    setVerifiedOnly(false);
    setNegotiableOnly(false);
    setSelectedCity('');
    setSortBy('recent');
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedCategory ||
    selectedConditions.length > 0 ||
    minPrice ||
    maxPrice ||
    verifiedOnly ||
    negotiableOnly ||
    selectedCity
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search & Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by product, brand (Apple, Sony), model, or seller..."
            className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View mode & Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 justify-between md:justify-end">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters {hasActiveFilters && '(Active)'}
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs font-medium rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="recent">Recently Listed</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="best-deals">Best Deals (% Off)</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-medium">Active Filters:</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedConditions.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {c}
              <button onClick={() => handleConditionToggle(c)}><X className="w-3 h-3" /></button>
            </span>
          ))}
          {selectedCity && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              City: {selectedCity}
              <button onClick={() => setSelectedCity('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {verifiedOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
              Verified Sellers Only
              <button onClick={() => setVerifiedOnly(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {negotiableOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium">
              Negotiable Only
              <button onClick={() => setNegotiableOnly(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              ₹{minPrice || 0} - ₹{maxPrice || '∞'}
              <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={handleClearAll}
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline ml-1 font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        </div>
      )}

      {/* Main Content: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block space-y-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              Filter Catalog
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="text-xs text-slate-500 hover:text-rose-600"
              >
                Reset
              </button>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="">All Categories ({products.length})</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name} ({products.filter((p) => p.category === cat.name).length})
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Condition
            </label>
            <div className="space-y-1.5">
              {conditions.map((cond) => {
                const checked = selectedConditions.includes(cond);
                const count = products.filter((p) => p.condition === cond).length;
                return (
                  <label
                    key={cond}
                    className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer py-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleConditionToggle(cond)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{cond}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 tabular-nums">({count})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Price Range (₹)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none tabular-nums"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none tabular-nums"
              />
            </div>
          </div>

          {/* City / Hub */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Location / City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="">All Metro Hubs</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => {
                  setVerifiedOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                Verified Sellers Only
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={negotiableOnly}
                onChange={(e) => {
                  setNegotiableOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center gap-1 font-medium">
                <Tag className="w-3.5 h-3.5 text-purple-600" />
                Price Negotiable Only
              </span>
            </label>
          </div>
        </aside>

        {/* Products Results Area */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing <strong className="text-slate-900 dark:text-white tabular-nums">{filteredProducts.length}</strong> items
            </span>
          </div>

          {paginatedProducts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No matching products found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                We couldn't find items matching your search criteria. Try removing filters or searching for terms like "MacBook", "iPhone", or "Sony".
              </p>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 rounded-xl hover:bg-blue-100 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onMakeOffer={(p) => setSelectedOfferProduct(p)}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
                >
                  <img
                    src={product.coverImage || product.images[0]}
                    alt={product.title}
                    className="w-full sm:w-44 aspect-[4/3] rounded-lg object-cover shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/resell_hero_marketplace_1794130051291.jpg';
                    }}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{product.category}</span>
                        <span>·</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{product.condition}</span>
                        <span>·</span>
                        <span>{product.sellerCity}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                        {product.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-slate-400 line-through tabular-nums">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {product.isNegotiable && (
                          <button
                            onClick={() => setSelectedOfferProduct(product)}
                            className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                          >
                            Make Offer
                          </button>
                        )}
                        <a
                          href={`/products/${product.id}`}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Offer Modal */}
      <OfferModal
        product={selectedOfferProduct}
        isOpen={Boolean(selectedOfferProduct)}
        onClose={() => setSelectedOfferProduct(null)}
      />
    </div>
  );
};
