import React, { useState } from 'react';
import { 
  Filter, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown, 
  ChevronDown, 
  Search, 
  Sparkles, 
  RefreshCw,
  Check,
  Flame
} from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { Product, AffiliatePlatform } from '../../types';
import { useStore } from '../../context/StoreContext';

interface CatalogPageProps {
  onOpenProductDetail: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onOpenProductDetail }) => {
  const { 
    filteredProducts, 
    categories, 
    filters, 
    setFilters, 
    resetFilters 
  } = useStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);

  const currentCategory = categories.find((c) => c.id === filters.categoryId);
  const platforms: (AffiliatePlatform | 'All')[] = ['All', 'Meesho', 'Amazon', 'Flipkart'];

  const visibleProducts = filteredProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredProducts.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 12);
  };

  const activeFilterCount = [
    Boolean(filters.categoryId),
    Boolean(filters.subcategoryId),
    Boolean(filters.platform && filters.platform !== 'All'),
    Boolean(filters.dealsOnly),
    Boolean(filters.trendingOnly),
  ].filter(Boolean).length;

  const filterDrawerContent = (
    <div className="space-y-6">
      {/* Category selector */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          Categories
        </h4>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, categoryId: undefined, subcategoryId: undefined }))}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
              !filters.categoryId ? 'bg-pink-50 text-pink-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
            {!filters.categoryId && <Check className="w-3.5 h-3.5 text-pink-600" />}
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, categoryId: cat.id, subcategoryId: undefined }))}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                filters.categoryId === cat.id ? 'bg-pink-50 text-pink-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
              {filters.categoryId === cat.id && <Check className="w-3.5 h-3.5 text-pink-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory selector if Category chosen */}
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
            {currentCategory.name} Styles
          </h4>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, subcategoryId: undefined }))}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                !filters.subcategoryId ? 'text-pink-600 font-bold' : 'text-slate-600 hover:text-pink-600'
              }`}
            >
              All {currentCategory.name}
            </button>
            {currentCategory.subcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, subcategoryId: sub.id }))}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  filters.subcategoryId === sub.id ? 'text-pink-600 font-bold bg-pink-50/50' : 'text-slate-600 hover:text-pink-600'
                }`}
              >
                <span>{sub.name}</span>
                {filters.subcategoryId === sub.id && <Check className="w-3 h-3 text-pink-600" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Partner Store Platform */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          Partner Store
        </h4>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, platform: p }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                (filters.platform || 'All') === p
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Reset button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={resetFilters}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
      
      {/* Title & Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>
              {filters.searchQuery
                ? `Search results for "${filters.searchQuery}"`
                : currentCategory
                ? currentCategory.name
                : filters.dealsOnly
                ? "Today's Steal Deals & Offers"
                : filters.trendingOnly
                ? 'Trending Viral Fashion'
                : 'All Curated Products'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {visibleProducts.length} of {filteredProducts.length} verified products
          </p>
        </div>

        {/* Controls: Filter Drawer Toggle (Mobile) + Sort Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs"
          >
            <Filter className="w-4 h-4 text-pink-600" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-pink-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort:</span>
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-pink-500 cursor-pointer shadow-xs pr-8 appearance-none"
              >
                <option value="relevance">Popular & Featured</option>
                <option value="trending">Trending Viral</option>
                <option value="newest">New Arrivals</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Category Switcher: Always visible on both mobile & desktop */}
      <div className="pt-3 pb-1 overflow-x-auto scrollbar-none flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilters((prev) => ({ ...prev, categoryId: undefined, subcategoryId: undefined }))}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            !filters.categoryId
              ? 'bg-pink-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:border-pink-300'
          }`}
        >
          All Categories
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, categoryId: c.id, subcategoryId: undefined }))}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              filters.categoryId === c.id
                ? 'bg-pink-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-pink-300'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* If a category is chosen, show its subcategory styles row */}
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div className="pt-1.5 pb-2 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 uppercase tracking-wider">
            {currentCategory.name}:
          </span>
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, subcategoryId: undefined }))}
            className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              !filters.subcategoryId
                ? 'bg-pink-100 text-pink-700 font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All {currentCategory.name}
          </button>
          {currentCategory.subcategories.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, subcategoryId: s.id }))}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                filters.subcategoryId === s.id
                  ? 'bg-pink-100 text-pink-700 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Direct Partner Store Filter Buttons: Meesho, Amazon, Flipkart */}
      <div className="pt-2 pb-2 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <span>Filter Store:</span>
        </span>

        <button
          type="button"
          onClick={() => setFilters((prev) => ({ ...prev, platform: prev.platform === 'Meesho' ? 'All' : 'Meesho' }))}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center gap-1.5 border ${
            filters.platform === 'Meesho'
              ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-md shadow-fuchsia-500/20 scale-105'
              : 'bg-fuchsia-50/80 hover:bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
          <span>Meesho Deals</span>
          {filters.platform === 'Meesho' && <Check className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => setFilters((prev) => ({ ...prev, platform: prev.platform === 'Amazon' ? 'All' : 'Amazon' }))}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center gap-1.5 border ${
            filters.platform === 'Amazon'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-500/20 scale-105'
              : 'bg-amber-50/80 hover:bg-amber-100 text-amber-800 border-amber-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Amazon Deals</span>
          {filters.platform === 'Amazon' && <Check className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => setFilters((prev) => ({ ...prev, platform: prev.platform === 'Flipkart' ? 'All' : 'Flipkart' }))}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 flex items-center gap-1.5 border ${
            filters.platform === 'Flipkart'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-105'
              : 'bg-blue-50/80 hover:bg-blue-100 text-blue-700 border-blue-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>Flipkart Deals</span>
          {filters.platform === 'Flipkart' && <Check className="w-3.5 h-3.5" />}
        </button>

        {filters.platform && filters.platform !== 'All' && (
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, platform: 'All' }))}
            className="text-[11px] font-bold text-slate-500 hover:text-rose-600 underline underline-offset-2 ml-1"
          >
            Clear Store Filter
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-4">
          <span className="text-xs font-semibold text-slate-500">Active Filters:</span>
          {filters.categoryId && (
            <span className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 border border-pink-200 text-xs font-medium px-2.5 py-1 rounded-full">
              Category: {categories.find((c) => c.id === filters.categoryId)?.name}
              <button onClick={() => setFilters((prev) => ({ ...prev, categoryId: undefined, subcategoryId: undefined }))}>
                <X className="w-3 h-3 hover:text-pink-900" />
              </button>
            </span>
          )}
          {filters.platform && filters.platform !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 border border-pink-200 text-xs font-medium px-2.5 py-1 rounded-full">
              Platform: {filters.platform}
              <button onClick={() => setFilters((prev) => ({ ...prev, platform: 'All' }))}>
                <X className="w-3 h-3 hover:text-pink-900" />
              </button>
            </span>
          )}
          {filters.dealsOnly && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium px-2.5 py-1 rounded-full">
              Deals Only
              <button onClick={() => setFilters((prev) => ({ ...prev, dealsOnly: false }))}>
                <X className="w-3 h-3 hover:text-amber-900" />
              </button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs font-bold text-pink-600 hover:text-pink-700 underline underline-offset-2 ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid & Desktop Filter Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs h-fit sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-pink-600" /> Filter Discovery
            </h3>
            {activeFilterCount > 0 && (
              <button onClick={resetFilters} className="text-xs font-semibold text-pink-600 hover:text-pink-700">
                Clear
              </button>
            )}
          </div>
          {filterDrawerContent}
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 flex flex-col items-center justify-center my-8">
              <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Products Matched Your Filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
                Try searching with different keywords like "kurti", "anarkali", or selecting All Categories.
              </p>
              <button
                onClick={resetFilters}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Live Price & Stock Notice Disclaimer */}
              <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-pink-50/90 via-rose-50/70 to-amber-50/70 border border-pink-200/80 flex items-start sm:items-center gap-3 text-xs text-slate-700 shadow-2xs">
                <Sparkles className="w-4 h-4 text-pink-600 shrink-0 mt-0.5 sm:mt-0" />
                <div className="leading-relaxed">
                  <strong className="text-slate-900 font-bold">Live Market Price Notice:</strong>{' '}
                  E-commerce platforms (Meesho, Amazon, Flipkart, etc.) par discount coupons aur flash offers se prices daily update hote rehte hain. Har product ka live latest price check karne ke liye direct <strong className="text-pink-700 font-extrabold">'Shop Now'</strong> button par click karein.
                </div>
              </div>

              {/* Responsive Product Grid: 2 cols on mobile, 3 on tablet, 3-4 on desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5">
                {visibleProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onOpenDetail={onOpenProductDetail}
                  />
                ))}
              </div>

              {/* Load More Pagination */}
              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={handleLoadMore}
                    className="bg-white hover:bg-pink-50 text-slate-800 hover:text-pink-600 font-extrabold text-xs sm:text-sm py-3 px-8 rounded-2xl border border-slate-200 shadow-sm transition-all transform hover:-translate-y-0.5"
                  >
                    Load More Products ({filteredProducts.length - displayCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="w-4/5 max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-pink-600" />
                  <span className="font-extrabold text-slate-900 text-sm">Filters</span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4">
                {filterDrawerContent}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-pink-600 text-white font-bold text-xs py-3 rounded-xl shadow-md"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
