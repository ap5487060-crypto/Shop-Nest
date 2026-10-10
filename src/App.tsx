import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { HomePage } from './components/home/HomePage';
import { CatalogPage } from './components/catalog/CatalogPage';
import { WishlistPage } from './components/wishlist/WishlistPage';
import { AccountPage } from './components/account/AccountPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AffiliateDisclosurePage } from './components/pages/AffiliateDisclosurePage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { PrivacyPolicyPage, TermsPage } from './components/pages/LegalPages';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { AuthModal } from './components/account/AuthModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';
import { Product } from './types';
import { db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

function ShopNestApp() {
  const { products, setFilters } = useStore();

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Deep linking for shared product URLs (?product=... or #prod-sn-prod-01) and admin #admin
  useEffect(() => {
    const handleLocation = () => {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(window.location.search);
      if (hash === '#admin' || urlParams.get('admin') === 'true' || urlParams.get('admin') === 'login') {
        setCurrentView('admin');
        return;
      }

      const prodIdFromQuery = urlParams.get('product') || urlParams.get('prod');
      const prodIdFromHash = hash && hash.startsWith('#prod-') ? hash.replace('#prod-', '') : null;
      const targetProdId = prodIdFromQuery || prodIdFromHash;

      if (targetProdId) {
        if (products.length > 0) {
          const found = products.find((p) => p.id === targetProdId || p.slug === targetProdId);
          if (found) {
            setSelectedProduct(found);
            return;
          }
        }
        // If not in state yet (cold load from WhatsApp share), fetch directly from Firestore
        getDoc(doc(db, 'products', targetProdId))
          .then((snap) => {
            if (snap.exists()) {
              setSelectedProduct({ id: snap.id, ...(snap.data() as Omit<Product, 'id'>) });
            }
          })
          .catch((err) => {
            console.warn('Error fetching deep-linked product:', err);
          });
      }
    };
    handleLocation();
    window.addEventListener('hashchange', handleLocation);
    window.addEventListener('popstate', handleLocation);
    return () => {
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('popstate', handleLocation);
    };
  }, [products]);

  // Handle navigation
  const handleNavigate = (view: string, _param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'home') {
      setFilters((prev) => ({
        ...prev,
        categoryId: undefined,
        subcategoryId: undefined,
        dealsOnly: false,
        trendingOnly: false,
        searchQuery: '',
      }));
    }
    setCurrentView(view);
  };

  const handleNavigateCatalogWithCategory = (catId?: string, subId?: string) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: catId,
      subcategoryId: subId,
      dealsOnly: false,
      trendingOnly: false,
      searchQuery: '',
    }));
    handleNavigate('catalog');
  };

  const handleNavigateDeals = () => {
    setFilters((prev) => ({
      ...prev,
      dealsOnly: true,
      categoryId: undefined,
      subcategoryId: undefined,
    }));
    handleNavigate('catalog');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* If in admin view, show admin dashboard directly */}
      {currentView === 'admin' ? (
        <AdminDashboard onBackToStore={() => handleNavigate('home')} />
      ) : (
        <>
          {/* Header */}
          <Header
            currentView={currentView}
            onNavigate={handleNavigate}
            onOpenAuth={() => setAuthModalOpen(true)}
            onOpenCart={() => setCartDrawerOpen(true)}
          />

          {/* Main content body */}
          <main className="flex-1">
            {currentView === 'home' && (
              <HomePage
                onOpenProductDetail={(prod) => setSelectedProduct(prod)}
                onNavigateCatalog={handleNavigateCatalogWithCategory}
                onNavigateDeals={handleNavigateDeals}
              />
            )}

            {currentView === 'catalog' && (
              <CatalogPage
                onOpenProductDetail={(prod) => setSelectedProduct(prod)}
              />
            )}

            {currentView === 'wishlist' && (
              <WishlistPage
                onOpenProductDetail={(prod) => setSelectedProduct(prod)}
                onNavigateHome={() => handleNavigate('home')}
              />
            )}

            {currentView === 'account' && (
              <AccountPage onNavigate={handleNavigate} />
            )}

            {currentView === 'affiliate-disclosure' && (
              <AffiliateDisclosurePage />
            )}

            {currentView === 'about' && (
              <AboutPage />
            )}

            {currentView === 'contact' && (
              <ContactPage />
            )}

            {currentView === 'privacy' && (
              <PrivacyPolicyPage />
            )}

            {currentView === 'terms' && (
              <TermsPage />
            )}
          </main>

          {/* Footer */}
          <Footer onNavigate={handleNavigate} />

          {/* Mobile bottom navigation bar */}
          <MobileBottomNav
            currentView={currentView}
            onNavigate={handleNavigate}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        </>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
          if (typeof window !== 'undefined') {
            if (window.location.hash.startsWith('#prod-') || window.location.search.includes('product=') || window.location.search.includes('prod=')) {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }
        }}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* User Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onNavigateCatalog={() => handleNavigate('catalog')}
      />

      {/* PWA Install Prompt Banner */}
      <PwaInstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <ShopNestApp />
      </StoreProvider>
    </AuthProvider>
  );
}
