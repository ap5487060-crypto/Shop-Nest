import React from 'react';
import { 
  User, 
  Heart, 
  ShoppingBag, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  LogOut, 
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

interface AccountPageProps {
  onNavigate: (view: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { user, userProfile, isAdmin, logout } = useAuth();
  const { wishlistIds, products, affiliateClicks } = useStore();

  const isOwner = Boolean(
    isAdmin ||
    userProfile?.role === 'super_admin' ||
    userProfile?.role === 'admin' ||
    userProfile?.email?.toLowerCase() === 'ap547060@gmail.com' ||
    userProfile?.email?.toLowerCase() === 'vijayprajapati3332@gmail.com' ||
    user?.email?.toLowerCase() === 'ap547060@gmail.com' ||
    user?.email?.toLowerCase() === 'vijayprajapati3332@gmail.com'
  );

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      {/* Prominent Admin Access Banner if logged in as Owner/Admin */}
      {isOwner && (
        <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white p-6 sm:p-7 rounded-3xl shadow-xl shadow-pink-600/15 mb-8 border border-white/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 animate-in fade-in">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-pink-100">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" /> Store Owner & Admin Access Active
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              ShopNest Admin Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-pink-100 max-w-xl">
              Aapka owner account login hai! Product add karne, photo upload, affiliate link lagane aur catalog manage karne ke liye dashboard khole:
            </p>
          </div>
          <button
            onClick={() => onNavigate('admin')}
            className="w-full md:w-auto px-6 py-3.5 bg-white text-pink-700 hover:bg-pink-50 hover:shadow-2xl font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-all transform active:scale-95 shadow-lg whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Open Admin Dashboard</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Profile card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-400 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-pink-500/20">
            {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {userProfile?.displayName || 'ShopNest Shopper'}
              </h1>
              {isOwner && (
                <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold border border-pink-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Store Owner
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {userProfile?.email || user?.email || 'Logged in as Guest Shopper'}
            </p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified ShopNest Account</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isOwner && (
            <button
              onClick={() => onNavigate('admin')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          )}

          <button
            onClick={() => {
              logout();
              onNavigate('home');
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Account stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Wishlist Summary Card */}
        <div 
          onClick={() => onNavigate('wishlist')}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-pink-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-pink-50 rounded-2xl text-pink-600 group-hover:bg-pink-100 transition-colors">
              <Heart className="w-6 h-6 fill-pink-500" />
            </div>
            <span className="text-2xl font-black text-slate-900">{wishlistIds.length}</span>
          </div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-pink-600 transition-colors">
            Saved In Wishlist
          </h3>
          <p className="text-xs text-slate-500 mt-1">Tap to browse and shop your saved items</p>
        </div>

        {/* Affiliate Clicks / Browsed Deals */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
              <ExternalLink className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900">{affiliateClicks.length}</span>
          </div>
          <h3 className="font-bold text-sm text-slate-900">
            Deals Clicked
          </h3>
          <p className="text-xs text-slate-500 mt-1">Partner links visited from ShopNest</p>
        </div>

        {/* Platform Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <h3 className="font-bold text-sm text-slate-900">
            Shopping Discovery Tier
          </h3>
          <p className="text-xs text-slate-500 mt-1">Free VIP Access to Meesho & Amazon Loot Deals</p>
        </div>
      </div>

      {/* Recent Clicked Partner Deals */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Recently Viewed Partner Deals</span>
        </h3>

        {affiliateClicks.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            You haven't clicked any partner store links yet. Discover trending kurtis on the homepage!
          </p>
        ) : (
          <div className="space-y-2">
            {affiliateClicks.slice(0, 5).map((click) => (
              <div
                key={click.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">{click.product_name}</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Platform: <span className="font-semibold text-pink-600">{click.affiliate_platform}</span> • {new Date(click.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <a
                  href={click.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-white hover:bg-pink-50 text-pink-600 border border-slate-200 rounded-xl font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Revisit Store</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
