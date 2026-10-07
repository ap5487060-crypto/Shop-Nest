import React from 'react';
import { HeroCarousel } from './HeroCarousel';
import { CategoryHighlights } from './CategoryHighlights';
import { DealsBanner } from './DealsBanner';
import { WhyShopNest } from './WhyShopNest';
import { SocialShowcase } from './SocialShowcase';
import { ProductCard } from '../product/ProductCard';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ArrowRight, Flame, Heart, ShoppingBag, Clock } from 'lucide-react';

interface HomePageProps {
  onOpenProductDetail: (product: Product) => void;
  onNavigateCatalog: (catId?: string, subId?: string) => void;
  onNavigateDeals: (maxPrice?: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenProductDetail,
  onNavigateCatalog,
  onNavigateDeals,
}) => {
  const { products, recentlyViewedIds, setFilters } = useStore();

  // Curated lists
  const trendingKurtis = products
    .filter((p) => p.category_id === 'womens-fashion' && p.trending)
    .slice(0, 8);

  const kurtiSetsAndSuits = products
    .filter((p) => p.subcategory_id === 'kurti-sets' || p.subcategory_id === 'suits' || p.subcategory_id === 'sarees')
    .slice(0, 4);

  const recentlyViewedProducts = products.filter((p) => recentlyViewedIds.includes(p.id)).slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-10 pb-12 animate-in fade-in">
      {/* 1. Hero Carousel */}
      <HeroCarousel onNavigateCatalog={onNavigateCatalog} />

      {/* 2. Style Categories Shortcut Circles */}
      <CategoryHighlights onSelectCategory={onNavigateCatalog} />

      {/* 3. Official Price & Live Partner Deals Disclaimer */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 rounded-2xl p-4 sm:p-5 border border-pink-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-pink-600 to-rose-500 text-white rounded-xl shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Direct Partner Pricing & Live Offers
                </h4>
                <span className="text-[10px] font-bold bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full">
                  Verified Store Links
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed">
                Marketplaces (Meesho, Amazon, Flipkart) par coupons aur deals ke karan live price update hota rehta hai. Real-time best discounted price aur size availability dekhne ke liye kisi bhi item ke <strong>"Shop Now"</strong> button par tap karein.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trending Women's Fashion & Top Kurtis */}
      {products.length === 0 ? (
        <section className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-pink-100 shadow-xs space-y-4">
            <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Fresh Ethnic Looks Arriving Shortly!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              We are currently updating our curated Meesho loot deals and festive ethnic collections. Stay tuned or follow our official social channels!
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <a
                href="#admin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
              >
                <span>Open Admin Portal to Add Products</span>
              </a>
              <a
                href="https://in.pinterest.com/shopnest825/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all"
              >
                <span>Follow on Pinterest (@shopnest825)</span>
              </a>
              <a
                href="https://instagram.com/meeshodeals825"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs border border-pink-200 transition-all"
              >
                <span>Follow on Instagram (@meeshodeals825)</span>
              </a>
            </div>
          </div>
        </section>
      ) : (
        <>
          {trendingKurtis.length > 0 && (
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                    <span>Handpicked Collection</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Trending Kurtis & Ethnic Bestsellers
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Top-selling pure cotton, chikankari, and flared anarkalis from Meesho & Amazon
                  </p>
                </div>

                <button
                  onClick={() => onNavigateCatalog('womens-fashion', 'kurtis')}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-3.5 py-2 rounded-xl transition-colors"
                >
                  <span>View All Kurtis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 2-col mobile, 3-col tablet, 4-col desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {trendingKurtis.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onOpenDetail={onOpenProductDetail}
                  />
                ))}
              </div>

              <div className="mt-6 text-center sm:hidden">
                <button
                  onClick={() => onNavigateCatalog('womens-fashion', 'kurtis')}
                  className="w-full bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs py-2.5 rounded-xl border border-pink-200"
                >
                  Explore All Trending Kurtis →
                </button>
              </div>
            </section>
          )}

          {/* 5. Festive Suits, Kurti Sets & Sarees */}
          {kurtiSetsAndSuits.length > 0 && (
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
              <div className="bg-gradient-to-r from-pink-50/50 via-rose-50/30 to-amber-50/40 rounded-3xl p-5 sm:p-8 border border-pink-100">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                      <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Festive & Wedding Season
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                      Designer Kurti Sets & Organza Sarees
                    </h2>
                  </div>
                  <button
                    onClick={() => onNavigateCatalog('womens-fashion', 'kurti-sets')}
                    className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1"
                  >
                    <span>See More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                  {kurtiSetsAndSuits.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onOpenDetail={onOpenProductDetail}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Curated Products Section (Guaranteed display of user products) */}
          {trendingKurtis.length === 0 && kurtiSetsAndSuits.length === 0 && products.length > 0 && (
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                    <span>Curated Collection</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Latest Deals & Handpicked Products
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified partner store picks from Meesho, Amazon & Flipkart
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onOpenDetail={onOpenProductDetail}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* 7. Recently Viewed (if available) */}
      {recentlyViewedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
            <Clock className="w-4 h-4 text-slate-400" />
            <h2 className="text-base font-extrabold text-slate-800">
              Recently Viewed By You
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
            {recentlyViewedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onOpenDetail={onOpenProductDetail}
              />
            ))}
          </div>
        </section>
      )}

      {/* 8. Trust Highlights: Why ShopNest */}
      <WhyShopNest />

      {/* 9. Social Media Integration Showcase */}
      <SocialShowcase products={products} onOpenProduct={onOpenProductDetail} />
    </div>
  );
};
