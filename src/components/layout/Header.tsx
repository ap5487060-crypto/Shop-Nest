import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  Flame, 
  Instagram, 
  Sparkles,
  ExternalLink,
  ChevronDown,
  Lock,
  LogOut
} from 'lucide-react';
import { ShopNestLogo } from '../common/ShopNestLogo';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenCart: () => void;
  onNavigate: (view: string, param?: string) => void;
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenCart,
  onNavigate,
  currentView,
}) => {
  const { 
    wishlistIds, 
    cartCount, 
    categories, 
    filters, 
    setFilters, 
    searchSuggestions, 
    commerceMode 
  } = useStore();
  const { user, userProfile, isAdmin, logout } = useAuth();

  const isOwner = Boolean(
    isAdmin ||
    userProfile?.role === 'super_admin' ||
    userProfile?.role === 'admin' ||
    userProfile?.email?.toLowerCase() === 'ap547060@gmail.com' ||
    userProfile?.email?.toLowerCase() === 'vijayprajapati3332@gmail.com' ||
    user?.email?.toLowerCase() === 'ap547060@gmail.com' ||
    user?.email?.toLowerCase() === 'vijayprajapati3332@gmail.com'
  );

  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close search suggestions when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFocused(false);
    onNavigate('catalog');
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: suggestion }));
    setSearchFocused(false);
    onNavigate('catalog');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-pink-100 shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 text-white text-xs py-1.5 px-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
              Trending
            </span>
            <span className="font-medium tracking-wide">
              ✦ Handpicked Kurtis & Festive Styles at Direct Partner Prices!
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs">
            {/* Social handles */}
            <a
              href="https://instagram.com/meeshodeals825"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-pink-100 transition-colors"
              title="Follow ShopNest on Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@meeshodeals825</span>
            </a>
            <span className="text-white/40">|</span>
            <a
              href="https://in.pinterest.com/shopnest825/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-pink-100 transition-colors"
              title="ShopNest on Pinterest (@shopnest825)"
            >
              <span className="font-bold text-[11px]">P</span>
              <span>Pinterest: @shopnest825</span>
            </a>
            <span className="text-white/40">|</span>
            <span className="flex items-center gap-1 text-pink-100 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Partners
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-6">
          
          {/* Mobile hamburger button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-slate-700 hover:text-pink-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo brandmark */}
          <div 
            onClick={() => onNavigate('home')} 
            className="cursor-pointer group flex-shrink-0"
          >
            <ShopNestLogo size="md" />
          </div>

          {/* Desktop Search Bar with live autocomplete */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search Kurtis, Anarkalis, Suits, Sarees, Dresses..."
                  value={filters.searchQuery || ''}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-pink-300 focus:border-pink-500 rounded-full py-2.5 pl-11 pr-24 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all shadow-inner"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />

                {filters.searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                    className="absolute right-20 text-xs text-slate-400 hover:text-slate-600 p-1"
                  >
                    Clear
                  </button>
                ) : null}

                <button
                  type="submit"
                  className="absolute right-1.5 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-medium text-xs px-4 py-1.5 rounded-full shadow-xs transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Search Dropdown / Autocomplete suggestions */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-pink-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Popular Searches</span>
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['Cotton Kurti', 'Nayra Cut Suit', 'Chikankari Set', 'Anarkali', 'Organza Saree', 'Short Kurti'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSelectSuggestion(tag)}
                      className="px-3 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs rounded-full font-medium transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {searchSuggestions.length > 0 && (
                  <>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Matching Tags & Products
                    </div>
                    <div className="space-y-1">
                      {searchSuggestions.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSuggestion(item)}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-xs text-slate-700 rounded-lg flex items-center justify-between transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Search className="w-3.5 h-3.5 text-slate-400" />
                            {item}
                          </span>
                          <span className="text-[10px] text-slate-400">Search in ShopNest</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Header Controls: Categories, Deals, Wishlist, Cart, Account */}
          <div className="flex items-center gap-1 sm:gap-3">
            
            {/* Deals CTA button */}
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, dealsOnly: true, categoryId: undefined }));
                onNavigate('catalog');
              }}
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 transition-colors"
            >
              <Flame className="w-4 h-4 text-pink-600 fill-pink-500 animate-pulse" />
              <span>Deals & Steals</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-2.5 rounded-full text-slate-700 hover:text-pink-600 hover:bg-pink-50/70 transition-colors"
              title="My Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistIds.length > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 bg-pink-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-scale">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Cart Button (Future-ready) */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full text-slate-700 hover:text-pink-600 hover:bg-pink-50/70 transition-colors"
              title="Shopping Cart & Saved Bags"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-slate-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Admin Menu */}
            <div ref={userMenuRef} className="relative flex items-center gap-2">
              {isOwner && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:shadow-md hover:scale-105 transition-all shadow-xs"
                  title="Open Admin Dashboard"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-200" />
                  <span>Admin Panel</span>
                </button>
              )}

              {user || userProfile ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2 sm:pr-3 rounded-full border border-pink-200 bg-pink-50/50 hover:bg-pink-100/50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-600 to-rose-400 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {userProfile?.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 shadow-xs shadow-pink-500/20 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* Account Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-pink-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{userProfile?.displayName || 'ShopNest Shopper'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{userProfile?.email || 'Guest User'}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('account');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-pink-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Profile & Saved
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('wishlist');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-pink-50 flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4 text-slate-400" />
                      Wishlist ({wishlistIds.length})
                    </button>

                    {isOwner && (
                      <button
                        onClick={() => {
                          onNavigate('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-pink-600" />
                        Admin Dashboard (Abhishek)
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu and categories */}
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search Kurtis, Anarkalis, Suits..."
              value={filters.searchQuery || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-20 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 top-1 bg-pink-600 text-white text-[11px] font-bold px-3 py-1 rounded-full"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Subcategory Bar / Horizontal Navigation: Visible on all devices */}
      <div className="bg-white border-t border-b border-slate-100 block overflow-x-auto scrollbar-none shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center gap-4 sm:gap-6 text-xs font-semibold py-2 sm:py-2.5 whitespace-nowrap">
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, categoryId: undefined, subcategoryId: undefined }));
              onNavigate('catalog');
            }}
            className={`transition-colors py-1 ${
              !filters.categoryId ? 'text-pink-600 font-extrabold border-b-2 border-pink-600' : 'text-slate-700 hover:text-pink-600'
            }`}
          >
            All Categories
          </button>

          {/* Quick link to Women's Kurtis */}
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, categoryId: 'womens-fashion', subcategoryId: 'kurtis' }));
              onNavigate('catalog');
            }}
            className={`flex items-center gap-1 transition-colors py-1 ${
              filters.categoryId === 'womens-fashion' && filters.subcategoryId === 'kurtis'
                ? 'text-pink-600 font-extrabold border-b-2 border-pink-600'
                : 'text-pink-600 font-bold hover:text-pink-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Kurtis & Sets
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setFilters((prev) => ({ ...prev, categoryId: cat.id, subcategoryId: undefined }));
                onNavigate('catalog');
              }}
              className={`transition-colors py-1 ${
                filters.categoryId === cat.id && !filters.subcategoryId
                  ? 'text-pink-600 font-extrabold border-b-2 border-pink-600'
                  : 'text-slate-600 hover:text-pink-600'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, trendingOnly: true }));
              onNavigate('catalog');
            }}
            className="text-slate-700 hover:text-pink-600 font-bold text-amber-600 ml-auto flex items-center gap-1 py-1"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Trending Finds
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <ShopNestLogo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Shop Categories
                </div>
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, categoryId: 'womens-fashion', subcategoryId: 'kurtis' }));
                    setMobileMenuOpen(false);
                    onNavigate('catalog');
                  }}
                  className="w-full text-left font-bold text-pink-600 text-sm py-2 flex items-center justify-between"
                >
                  <span>✨ Kurtis & Kurti Sets</span>
                  <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">Top Pick</span>
                </button>

                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, categoryId: c.id, subcategoryId: undefined }));
                      setMobileMenuOpen(false);
                      onNavigate('catalog');
                    }}
                    className="w-full text-left text-slate-700 hover:text-pink-600 text-sm py-2 border-b border-slate-50"
                  >
                    {c.name}
                  </button>
                ))}

                <div className="pt-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Links
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('wishlist');
                  }}
                  className="w-full text-left text-slate-700 text-sm py-2 flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 text-pink-500" />
                  Wishlist ({wishlistIds.length})
                </button>
                {isOwner && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('admin');
                    }}
                    className="w-full text-left text-pink-600 font-bold text-sm py-2 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Dashboard (Abhishek)
                  </button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="text-[11px] text-slate-500">
                Follow our official deals:
              </div>
              <div className="flex gap-2">
                <a
                  href="https://instagram.com/meeshodeals825"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 rounded-lg bg-pink-50 text-pink-700 font-medium text-xs flex items-center justify-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  Instagram
                </a>
                <a
                  href="https://in.pinterest.com/shopnest825/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5"
                >
                  <span className="font-extrabold text-[11px] bg-rose-600 text-white rounded-full w-4 h-4 flex items-center justify-center">P</span>
                  <span>Pinterest</span>
                </a>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
