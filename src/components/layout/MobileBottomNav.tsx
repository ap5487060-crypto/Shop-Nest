import React from 'react';
import { Home, Search, Grid, Heart, User, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
}) => {
  const { wishlistIds } = useStore();
  const { user, userProfile, isAdmin } = useAuth();

  const isOwner = Boolean(
    isAdmin ||
    userProfile?.role === 'super_admin' ||
    userProfile?.role === 'admin' ||
    userProfile?.email?.toLowerCase() === 'ap547060@gmail.com' ||
    userProfile?.email?.toLowerCase() === 'vijayprajapati3332@gmail.com' ||
    user?.email?.toLowerCase() === 'ap547060@gmail.com' ||
    user?.email?.toLowerCase() === 'vijayprajapati3332@gmail.com'
  );

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            currentView === 'home'
              ? 'text-pink-600 font-bold scale-105'
              : 'text-slate-500 hover:text-pink-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Categories / Explore */}
        <button
          onClick={() => onNavigate('catalog')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            currentView === 'catalog'
              ? 'text-pink-600 font-bold scale-105'
              : 'text-slate-500 hover:text-pink-600'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Categories</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => onNavigate('wishlist')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl relative transition-all ${
            currentView === 'wishlist'
              ? 'text-pink-600 font-bold scale-105'
              : 'text-slate-500 hover:text-pink-600'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${wishlistIds.length > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-pink-600 text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Wishlist</span>
        </button>

        {/* Account */}
        <button
          onClick={() => (user ? onNavigate('account') : onOpenAuth())}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            currentView === 'account'
              ? 'text-pink-600 font-bold scale-105'
              : 'text-slate-500 hover:text-pink-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{user ? 'Account' : 'Login'}</span>
        </button>

        {/* Admin Tab (Only visible to Store Owner/Admin) */}
        {isOwner && (
          <button
            onClick={() => onNavigate('admin')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              currentView === 'admin'
                ? 'text-pink-600 font-black scale-105'
                : 'text-amber-700 font-bold hover:text-pink-600'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-pink-600" />
            <span className="text-[10px] mt-0.5 font-bold">Admin</span>
          </button>
        )}
      </div>
    </div>
  );
};
