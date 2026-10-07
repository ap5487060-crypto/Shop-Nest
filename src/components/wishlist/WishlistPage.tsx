import React from 'react';
import { Heart, Trash2, ExternalLink, ArrowRight, ShoppingBag, Sparkles, Share2 } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface WishlistPageProps {
  onOpenProductDetail: (p: Product) => void;
  onNavigateHome: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onOpenProductDetail,
  onNavigateHome,
}) => {
  const { wishlistIds, products, clearWishlist } = useStore();

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-600 fill-pink-500" />
            <span>My Saved Wishlist</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {wishlistedProducts.length > 0 && (
          <button
            onClick={clearWishlist}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 my-10 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 mb-4 animate-bounce">
            <Heart className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1.5 mb-6 leading-relaxed">
            Discover handpicked kurtis, anarkalis, festive suits, and viral deals. Tap the heart icon on any product to save it right here!
          </p>
          <button
            onClick={onNavigateHome}
            className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-2xl shadow-lg shadow-pink-500/20 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Trending Kurtis</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-6">
          {wishlistedProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenDetail={onOpenProductDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
};
