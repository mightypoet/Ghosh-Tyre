import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Filter, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { VehicleType } from '../types';

const VEHICLE_TYPES: VehicleType[] = [
  'Car',
  'SUV',
  'Hatchback',
  'Sedan',
  'Two Wheeler',
  'Commercial Vehicle',
];

const PRODUCT_CATEGORIES = [
  { label: 'Tyres', slug: 'tyres' },
  { label: 'Batteries', slug: 'batteries' },
  { label: 'Alloy Wheels', slug: 'alloy-wheels' },
  { label: 'Accessories', slug: 'accessories' },
  { label: 'Audio & Video Systems', slug: 'audio' },
  { label: 'Detailing & Ceramic', slug: 'detailing' },
  { label: 'Interior Comfort', slug: 'interior' },
  { label: 'Exterior & Sun Film', slug: 'exterior' },
  { label: 'Parts & Fluids', slug: 'parts' },
  { label: 'Workshop Tools', slug: 'tools' },
];

export const ProductListingPage: React.FC<{ presetVehicle?: string }> = ({ presetVehicle }) => {
  const { products } = useStore();
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const queryParam = searchParams.get('q') || '';
  const brandParam = searchParams.get('brand') || '';
  const categoryQueryParam = searchParams.get('category') || '';

  const [searchText, setSearchText] = useState(queryParam);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');

  // Tyre specification filters
  const [selectedWidth, setSelectedWidth] = useState<string>('all');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('all');
  const [selectedRim, setSelectedRim] = useState<string>('all');
  const [selectedSpeedRating, setSelectedSpeedRating] = useState<string>('all');
  const [selectedLoadIndex, setSelectedLoadIndex] = useState<string>('all');

  // Price filter (when configured)
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(50000);

  // Sorting
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync URL params or route presets into active filter state
  useEffect(() => {
    setSearchText(queryParam);
  }, [queryParam]);

  useEffect(() => {
    if (presetVehicle === 'car') {
      setSelectedVehicles(['Car', 'SUV', 'Hatchback', 'Sedan']);
    } else if (presetVehicle === 'two-wheelers') {
      setSelectedVehicles(['Two Wheeler']);
    } else if (presetVehicle === 'commercial-vehicles') {
      setSelectedVehicles(['Commercial Vehicle']);
    } else {
      setSelectedVehicles([]);
    }
  }, [presetVehicle, location.pathname]);

  useEffect(() => {
    if (categorySlug) {
      setSelectedCategories([categorySlug]);
    } else if (categoryQueryParam) {
      setSelectedCategories([categoryQueryParam]);
    } else {
      setSelectedCategories([]);
    }
  }, [categorySlug, categoryQueryParam]);

  useEffect(() => {
    if (brandParam) {
      setSelectedBrands([brandParam]);
    } else {
      setSelectedBrands([]);
    }
  }, [brandParam]);

  // Extract unique brands and tyre spec values from inventory
  const allBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products]
  );

  const tyreSpecOptions = useMemo(() => {
    const widths = new Set<string>();
    const ratios = new Set<string>();
    const rims = new Set<string>();
    const speeds = new Set<string>();
    const loads = new Set<string>();

    products.forEach((p) => {
      if (p.tyreSpecs?.width) widths.add(p.tyreSpecs.width);
      if (p.tyreSpecs?.aspectRatio) ratios.add(p.tyreSpecs.aspectRatio);
      if (p.tyreSpecs?.rimDiameter) rims.add(p.tyreSpecs.rimDiameter);
      if (p.tyreSpecs?.speedRating) speeds.add(p.tyreSpecs.speedRating);
      if (p.tyreSpecs?.loadIndex) loads.add(p.tyreSpecs.loadIndex);
    });

    return {
      widths: Array.from(widths).sort(),
      ratios: Array.from(ratios).sort(),
      rims: Array.from(rims).sort(),
      speeds: Array.from(speeds).sort(),
      loads: Array.from(loads).sort(),
    };
  }, [products]);

  const hasConfiguredPrices = useMemo(
    () => products.some((p) => p.price !== null && p.price > 0),
    [products]
  );

  const toggleItem = (list: string[], setList: (v: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const resetAllFilters = () => {
    setSearchText('');
    setSelectedVehicles([]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedAvailability('all');
    setSelectedWidth('all');
    setSelectedAspectRatio('all');
    setSelectedRim('all');
    setSelectedSpeedRating('all');
    setSelectedLoadIndex('all');
    setSearchParams({});
  };

  const filteredAndSortedProducts = useMemo(() => {
    const result = products.filter((product) => {
      // Search query match
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchBrand = product.brand.toLowerCase().includes(q);
        const matchCategory = product.category.toLowerCase().includes(q);
        const matchSub = product.subCategory.toLowerCase().includes(q);
        const matchModels = product.compatibleModels.some((m) => m.toLowerCase().includes(q));
        const matchSku = product.sku.toLowerCase().includes(q);
        if (
          !matchName &&
          !matchBrand &&
          !matchCategory &&
          !matchSub &&
          !matchModels &&
          !matchSku
        ) {
          return false;
        }
      }

      // Vehicle type filter
      if (selectedVehicles.length > 0) {
        const matchesVehicle = product.vehicleTypes.some((vt) => selectedVehicles.includes(vt));
        if (!matchesVehicle) return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(product.categorySlug)) return false;
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        if (!selectedBrands.includes(product.brand)) return false;
      }

      // Availability filter
      if (selectedAvailability !== 'all') {
        if (product.availability !== selectedAvailability) return false;
      }

      // Tyre Specs filters
      if (selectedWidth !== 'all' && product.tyreSpecs?.width !== selectedWidth) return false;
      if (selectedAspectRatio !== 'all' && product.tyreSpecs?.aspectRatio !== selectedAspectRatio)
        return false;
      if (selectedRim !== 'all' && product.tyreSpecs?.rimDiameter !== selectedRim) return false;
      if (selectedSpeedRating !== 'all' && product.tyreSpecs?.speedRating !== selectedSpeedRating)
        return false;
      if (selectedLoadIndex !== 'all' && product.tyreSpecs?.loadIndex !== selectedLoadIndex)
        return false;

      // Price filter (only if prices are configured)
      if (hasConfiguredPrices && product.price !== null && product.price > maxPriceFilter) {
        return false;
      }

      return true;
    });

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'featured') {
        return Number(b.featured) - Number(a.featured);
      }
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'price-asc') {
        const pA = a.price ?? Number.MAX_SAFE_INTEGER;
        const pB = b.price ?? Number.MAX_SAFE_INTEGER;
        return pA - pB;
      }
      if (sortBy === 'price-desc') {
        const pA = a.price ?? -1;
        const pB = b.price ?? -1;
        return pB - pA;
      }
      return 0;
    });
  }, [
    products,
    searchText,
    selectedVehicles,
    selectedCategories,
    selectedBrands,
    selectedAvailability,
    selectedWidth,
    selectedAspectRatio,
    selectedRim,
    selectedSpeedRating,
    selectedLoadIndex,
    hasConfiguredPrices,
    maxPriceFilter,
    sortBy,
  ]);

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith('/search')) {
      return queryParam ? `Search Results for "${queryParam}"` : 'Search Products';
    }
    if (presetVehicle === 'car') return 'Car & SUV Tyres, Batteries & Accessories';
    if (presetVehicle === 'two-wheelers') return 'Two Wheeler Tyres & VRLA Batteries';
    if (presetVehicle === 'commercial-vehicles')
      return 'Commercial Vehicle Tyres, Batteries & Parts';
    if (categorySlug) {
      const found = PRODUCT_CATEGORIES.find((c) => c.slug === categorySlug);
      return found ? `${found.label} Catalogue` : 'Product Catalogue';
    }
    return 'All Automotive Products';
  }, [location.pathname, queryParam, presetVehicle, categorySlug]);

  const FilterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#F10D17]" />
          <span className="font-display text-base font-bold uppercase tracking-wider text-white">
            Filter Catalogue
          </span>
        </div>
        <button
          type="button"
          onClick={resetAllFilters}
          className="inline-flex items-center gap-1 text-xs text-[#B8BBC4] hover:text-[#F10D17] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Vehicle Type */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
          1. Vehicle Type
        </h4>
        <div className="space-y-2">
          {VEHICLE_TYPES.map((vt) => (
            <label
              key={vt}
              className="flex items-center gap-2.5 text-xs text-[#B8BBC4] hover:text-white cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedVehicles.includes(vt)}
                onChange={() => toggleItem(selectedVehicles, setSelectedVehicles, vt)}
                className="rounded border-white/20 bg-[#14151B] text-[#F10D17] focus:ring-[#F10D17]"
              />
              <span>{vt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Product Category */}
      <div className="pt-4 border-t border-white/10">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
          2. Product Category
        </h4>
        <div className="space-y-2">
          {PRODUCT_CATEGORIES.map((cat) => (
            <label
              key={cat.slug}
              className="flex items-center gap-2.5 text-xs text-[#B8BBC4] hover:text-white cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => toggleItem(selectedCategories, setSelectedCategories, cat.slug)}
                className="rounded border-white/20 bg-[#14151B] text-[#F10D17] focus:ring-[#F10D17]"
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Brand */}
      <div className="pt-4 border-t border-white/10">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
          3. Brand
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {allBrands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2.5 text-xs text-[#B8BBC4] hover:text-white cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleItem(selectedBrands, setSelectedBrands, brand)}
                className="rounded border-white/20 bg-[#14151B] text-[#F10D17] focus:ring-[#F10D17]"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Tyre Specifications */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
          4. Tyre Specifications
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] text-[#B8BBC4] mb-1">Width (mm)</label>
            <select
              value={selectedWidth}
              onChange={(e) => setSelectedWidth(e.target.value)}
              className="w-full bg-[#14151B] border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white"
            >
              <option value="all">All</option>
              {tyreSpecOptions.widths.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-[#B8BBC4] mb-1">Aspect Ratio</label>
            <select
              value={selectedAspectRatio}
              onChange={(e) => setSelectedAspectRatio(e.target.value)}
              className="w-full bg-[#14151B] border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white"
            >
              <option value="all">All</option>
              {tyreSpecOptions.ratios.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-[#B8BBC4] mb-1">Rim Diameter</label>
            <select
              value={selectedRim}
              onChange={(e) => setSelectedRim(e.target.value)}
              className="w-full bg-[#14151B] border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white"
            >
              <option value="all">All</option>
              {tyreSpecOptions.rims.map((rim) => (
                <option key={rim} value={rim}>
                  {rim}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-[#B8BBC4] mb-1">Speed Rating</label>
            <select
              value={selectedSpeedRating}
              onChange={(e) => setSelectedSpeedRating(e.target.value)}
              className="w-full bg-[#14151B] border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white"
            >
              <option value="all">All</option>
              {tyreSpecOptions.speeds.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-[#B8BBC4] mb-1">Load Index</label>
          <select
            value={selectedLoadIndex}
            onChange={(e) => setSelectedLoadIndex(e.target.value)}
            className="w-full bg-[#14151B] border border-white/15 rounded-lg px-2 py-1.5 text-xs text-white"
          >
            <option value="all">All Load Indices</option>
            {tyreSpecOptions.loads.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. Availability */}
      <div className="pt-4 border-t border-white/10">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
          5. Availability
        </h4>
        <select
          value={selectedAvailability}
          onChange={(e) => setSelectedAvailability(e.target.value)}
          className="w-full bg-[#14151B] border border-white/15 rounded-lg px-3 py-2 text-xs text-white"
        >
          <option value="all">All Availability</option>
          <option value="In Stock">In Stock</option>
          <option value="Available on Order">Available on Order</option>
        </select>
      </div>

      {/* 6. Price Range (Displayed when product pricing is configured) */}
      {hasConfiguredPrices && (
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              6. Max Price
            </h4>
            <span className="font-mono-num text-xs text-[#FACC15]">
              Up to ₹{maxPriceFilter.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min={500}
            max={50000}
            step={500}
            value={maxPriceFilter}
            onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
            className="w-full accent-[#F10D17]"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#14151B] pb-16">
      {/* Page Banner */}
      <div className="bg-[#1C1D24] border-b border-white/10 py-10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-[#B8BBC4] mb-2">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">{pageTitle}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            {pageTitle}
          </h1>
          <p className="text-sm text-[#B8BBC4] mt-1.5 max-w-2xl">
            Browse genuine tyres, batteries, alloy wheels, and automotive accessories at Ghosh Tyre
            Zone, Kolkata. Add items to your enquiry list for exact vehicle compatibility and store
            pricing.
          </p>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Toolbar: Search Input + Mobile Filter Button + Sort Dropdown */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-[#1C1D24] border border-white/10 p-4 rounded-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#B8BBC4] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Filter by product name, brand, tyre size, or car model (e.g. Creta, Swift, 195/55)..."
              className="w-full bg-[#14151B] border border-white/15 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#B8BBC4]/60 focus:outline-none focus:border-[#F10D17]"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#14151B] border border-white/15 text-xs font-semibold text-white"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#F10D17]" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#B8BBC4] whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#14151B] border border-white/15 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#F10D17]"
              >
                <option value="featured">Featured Products</option>
                <option value="latest">Latest Products</option>
                <option value="alphabetical">Alphabetical (A–Z)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 bg-[#1C1D24] border border-white/10 rounded-xl p-5 sticky top-24">
            {FilterPanel}
          </aside>

          {/* Right Product Grid */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-4 text-xs text-[#B8BBC4]">
              <span>
                Showing <strong className="text-white font-mono-num">{filteredAndSortedProducts.length}</strong>{' '}
                products
              </span>
              {(selectedVehicles.length > 0 ||
                selectedCategories.length > 0 ||
                selectedBrands.length > 0 ||
                searchText) && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[#F10D17] hover:underline font-medium cursor-pointer"
                >
                  Clear All Active Filters
                </button>
              )}
            </div>

            {filteredAndSortedProducts.length === 0 ? (
              <div className="bg-[#1C1D24] border border-white/10 rounded-xl p-12 text-center space-y-4">
                <p className="text-lg font-semibold text-white">
                  No matching products found for your selected filters
                </p>
                <p className="text-xs text-[#B8BBC4] max-w-md mx-auto">
                  Try clearing some filters or contact our Kolkata showroom directly for specific
                  tyre sizes and battery models.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 rounded-lg bg-[#F10D17] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex bg-black/80 backdrop-blur-xs">
          <div className="bg-[#1C1D24] w-full max-w-xs h-full p-5 overflow-y-auto border-r border-white/10">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <span className="font-display text-lg font-bold text-white uppercase">
                Filter Products
              </span>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-[#B8BBC4] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {FilterPanel}
            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-lg bg-[#F10D17] text-white text-xs font-bold uppercase tracking-wider"
              >
                Apply Filters ({filteredAndSortedProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
