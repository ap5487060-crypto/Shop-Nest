import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Category, 
  Banner, 
  AffiliateClick, 
  CartItem, 
  ContactMessage, 
  FilterOptions,
  AffiliatePlatform,
  CommerceMode
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BANNERS } from '../data/seedData';
import { db, firebaseConfig } from '../lib/firebase';
import { collection, addDoc, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  wishlistIds: string[];
  recentlyViewedIds: string[];
  cart: CartItem[];
  affiliateClicks: AffiliateClick[];
  contactMessages: ContactMessage[];
  commerceMode: CommerceMode;
  setCommerceMode: (mode: CommerceMode) => void;

  // Filter & Search
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  filteredProducts: Product[];
  searchSuggestions: string[];

  // Wishlist actions
  toggleWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Recently Viewed
  recordProductView: (productId: string) => void;

  // Cart (Future-Ready)
  addToCart: (product: Product, quantity?: number, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;

  // Custom Logo Upload
  customLogoUrl: string;
  updateCustomLogo: (url: string) => void;

  // Affiliate Click Tracking & Safe Redirect
  trackAndRedirectAffiliate: (product: Product, platform?: AffiliatePlatform, customUtm?: Record<string, string>) => void;

  // Admin Management Actions
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<string>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  duplicateProduct: (id: string) => Promise<void>;
  bulkDeleteProducts: (ids: string[]) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: Product['status']) => Promise<void>;
  importProductsFromCsv: (newProducts: Partial<Product>[]) => Promise<{ imported: number; errors: string[] }>;
  resetToDefaultSeed: () => void;
  clearAllProducts: () => Promise<void>;
  reportPriceChange: (productId: string) => Promise<void>;
  bulkUpdatePrices: (productIds: string[], adjustmentType: 'percentage' | 'fixed', value: number) => Promise<void>;

  // Category Admin Actions
  addCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Banner Admin Actions
  addBanner: (banner: Omit<Banner, 'id'>) => Promise<void>;
  updateBanner: (id: string, updates: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;

  // Contact System
  submitContactMessage: (name: string, email: string, subject: string, message: string) => Promise<void>;
  updateContactStatus: (id: string, status: 'new' | 'read' | 'resolved') => void;

  // Status & Sync info
  firestoreSyncStatus: 'synced' | 'local_cache' | 'syncing';
  testFirestoreConnection: () => Promise<{ success: boolean; message: string; latencyMs?: number }>;
  pushAllToFirestore: () => Promise<{ success: boolean; message: string; count: number }>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_FILTERS: FilterOptions = {
  searchQuery: '',
  categoryId: undefined,
  subcategoryId: undefined,
  brand: undefined,
  platform: 'All',
  rating: 0,
  featuredOnly: false,
  trendingOnly: false,
  dealsOnly: false,
  sortBy: 'relevance',
};

// Allowed affiliate domains for safe redirect validation
const ALLOWED_AFFILIATE_DOMAINS = [
  'meesho.com',
  'amazon.in',
  'amazon.com',
  'flipkart.com',
  'myntra.com',
  'ajio.com',
  'tatacliq.com',
  'nykaa.com',
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper to get permanently deleted product IDs
  const getDeletedProductIds = (): string[] => {
    try {
      const saved = localStorage.getItem('shopnest_deleted_product_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Products state with local storage fallback
  const [products, setProducts] = useState<Product[]>(() => {
    const deletedIds = getDeletedProductIds();
    const saved = localStorage.getItem('shopnest_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Keep only custom products added by the user themselves and not in deleted blacklist
          const userOnly = parsed.filter(
            (p: any) =>
              !deletedIds.includes(p.id) &&
              (p.is_user_added || (p.id.startsWith('sn-prod-') && p.id.length > 15))
          );
          return userOnly;
        }
      } catch { /* ignore */ }
    }
    return [];
  });

  // Categories state
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('shopnest_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_CATEGORIES;
  });

  // Banners state
  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('shopnest_banners');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_BANNERS;
  });

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('shopnest_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Recently Viewed state
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('shopnest_recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('shopnest_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Affiliate Clicks state
  const [affiliateClicks, setAffiliateClicks] = useState<AffiliateClick[]>(() => {
    const saved = localStorage.getItem('shopnest_affiliate_clicks');
    return saved ? JSON.parse(saved) : [];
  });

  // Contact Messages state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('shopnest_contact_messages');
    return saved ? JSON.parse(saved) : [];
  });

  // Commerce Mode ('affiliate' | 'own_store')
  const [commerceMode, setCommerceMode] = useState<CommerceMode>(() => {
    return (import.meta.env.VITE_COMMERCE_MODE as CommerceMode) || 'affiliate';
  });

  // Custom Store Logo (uploaded by admin/owner)
  const [customLogoUrl, setCustomLogoUrl] = useState<string>(() => {
    return localStorage.getItem('shopnest_custom_logo') || '';
  });

  const updateCustomLogo = (url: string) => {
    setCustomLogoUrl(url);
    if (url) {
      localStorage.setItem('shopnest_custom_logo', url);
    } else {
      localStorage.removeItem('shopnest_custom_logo');
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('shopnest_logo_changed'));
    }
  };

  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [firestoreSyncStatus, setFirestoreSyncStatus] = useState<'synced' | 'local_cache' | 'syncing'>('local_cache');

  // Sync to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('shopnest_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('shopnest_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('shopnest_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('shopnest_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('shopnest_recently_viewed', JSON.stringify(recentlyViewedIds));
  }, [recentlyViewedIds]);

  useEffect(() => {
    localStorage.setItem('shopnest_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shopnest_affiliate_clicks', JSON.stringify(affiliateClicks));
  }, [affiliateClicks]);

  useEffect(() => {
    localStorage.setItem('shopnest_contact_messages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  // Attempt background sync with Firestore if collections exist
  useEffect(() => {
    let isMounted = true;
    const fetchFirestoreData = async () => {
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        if (!prodSnap.empty && isMounted) {
          const deletedIds = getDeletedProductIds();
          const remoteProducts: Product[] = [];
          prodSnap.forEach((doc) => remoteProducts.push({ id: doc.id, ...(doc.data() as Omit<Product, 'id'>) }));
          // Filter out any products that were deleted by admin
          const validRemote = remoteProducts.filter((p) => !deletedIds.includes(p.id));
          if (validRemote.length > 0) {
            setProducts(validRemote);
          }
          setFirestoreSyncStatus('synced');
        }
      } catch {
        // If Firestore is empty or rules haven't been published in console yet, keep local state smoothly
        if (isMounted) setFirestoreSyncStatus('local_cache');
      }
    };
    fetchFirestoreData();
    return () => { isMounted = false; };
  }, []);

  // Filter and Search logic
  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      if (p.status !== 'published') return false;

      // Search Query
      if (filters.searchQuery?.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const inName = p.name.toLowerCase().includes(query);
        const inBrand = (p.brand || '').toLowerCase().includes(query);
        const inTags = p.tags.some((t) => t.toLowerCase().includes(query));
        const inKeywords = p.keywords.some((k) => k.toLowerCase().includes(query));
        const inDesc = p.short_description.toLowerCase().includes(query);
        if (!inName && !inBrand && !inTags && !inKeywords && !inDesc) {
          return false;
        }
      }

      // Category
      if (filters.categoryId && p.category_id !== filters.categoryId) {
        return false;
      }

      // Subcategory
      if (filters.subcategoryId && p.subcategory_id !== filters.subcategoryId) {
        return false;
      }

      // Platform
      if (filters.platform && filters.platform !== 'All') {
        if (p.affiliate_platform !== filters.platform) return false;
      }

      // Rating
      if (filters.rating && filters.rating > 0) {
        if (p.rating < filters.rating) return false;
      }

      // Flags
      if (filters.featuredOnly && !p.featured) return false;
      if (filters.trendingOnly && !p.trending) return false;
      if (filters.dealsOnly && !p.deal) return false;

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'rating_desc':
          return b.rating - a.rating;
        case 'trending':
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.review_count - a.review_count;
        case 'relevance':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }, [products, filters]);

  // Search suggestions auto-aggregation
  const searchSuggestions = React.useMemo(() => {
    const list = new Set<string>();
    products.forEach((p) => {
      p.tags.forEach((t) => list.add(t));
      if (p.brand) list.add(p.brand);
      list.add(p.name.split(' ').slice(0, 3).join(' '));
    });
    return Array.from(list).slice(0, 8);
  }, [products]);

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  // Wishlist actions
  const toggleWishlist = (productId: string): boolean => {
    let isAdded = false;
    setWishlistIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        isAdded = true;
        return [...prev, productId];
      }
    });
    return isAdded;
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);
  const clearWishlist = () => setWishlistIds([]);

  // Recently Viewed
  const recordProductView = (productId: string) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 12);
    });
  };

  // Cart actions: Each product is saved once in the bag (never multiplying quantity on multiple clicks)
  const addToCart = (product: Product, _quantity = 1, size?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev;
      }
      return [...prev, { productId: product.id, product, quantity: 1, selectedSize: size || 'M', addedAt: new Date().toISOString() }];
    });
  };

  const isInCart = (productId: string) => cart.some((c) => c.productId === productId);

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Safe Affiliate Redirect & Tracking
  const trackAndRedirectAffiliate = (
    product: Product, 
    platform?: AffiliatePlatform, 
    customUtm?: Record<string, string>
  ) => {
    const targetPlatform = platform || product.affiliate_platform || 'Meesho';
    let targetUrl = product.affiliate_url;

    // Check alternate affiliate links if platform specified
    if (platform && product.alternate_affiliate_links) {
      const match = product.alternate_affiliate_links.find((l) => l.platform === platform);
      if (match?.url) {
        targetUrl = match.url;
      }
    }

    // Determine device type
    const width = window.innerWidth;
    const deviceType: 'mobile' | 'tablet' | 'desktop' =
      width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';

    // Build tracking record
    const clickRecord: AffiliateClick = {
      id: 'clk-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      product_id: product.id,
      product_name: product.name,
      session_id: sessionStorage.getItem('shopnest_session_id') || ('sess-' + Date.now()),
      affiliate_platform: targetPlatform,
      affiliate_url: targetUrl,
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'direct',
      utm_source: customUtm?.utm_source || 'shopnest',
      utm_medium: customUtm?.utm_medium || 'affiliate_link',
      utm_campaign: customUtm?.utm_campaign || 'shopnest_discovery',
      device_type: deviceType,
      page_url: window.location.href,
    };

    // Save locally
    setAffiliateClicks((prev) => [clickRecord, ...prev].slice(0, 500));

    // Try saving to Firestore
    try {
      addDoc(collection(db, 'affiliate_clicks'), clickRecord).catch(() => {});
    } catch {
      // Ignored if permissions not open yet
    }

    // Ensure URL has protocol and open immediately for any platform
    let safeUrl = (targetUrl || product.affiliate_url || '').trim();
    if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://')) {
      safeUrl = 'https://' + safeUrl;
    }

    try {
      const parsed = new URL(safeUrl);
      if (!parsed.searchParams.has('utm_source')) {
        parsed.searchParams.set('utm_source', 'shopnest');
      }
      safeUrl = parsed.toString();
    } catch {
      // Keep direct url if URL parser fails
    }

    // Immediately open the destination affiliate link in a new window/tab
    window.open(safeUrl, '_blank', 'noopener,noreferrer');
  };

  // Product Admin Actions
  const addProduct = async (prodData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
    const newId = 'sn-prod-' + Date.now();
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...prodData,
      id: newId,
      created_at: now,
      updated_at: now,
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Firestore sync attempt
    try {
      await setDoc(doc(db, 'products', newId), newProduct);
    } catch {
      // Keep local
    }
    return newId;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const now = new Date().toISOString();
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updated_at: now } : p))
    );

    try {
      await setDoc(doc(db, 'products', id), { ...updates, updated_at: now }, { merge: true });
    } catch {
      // Keep local
    }
  };

  const deleteProduct = async (id: string) => {
    // 1. Remove from state immediately
    setProducts((prev) => prev.filter((p) => p.id !== id));

    // 2. Remove from cart, wishlist, recently viewed
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    setWishlistIds((prev) => prev.filter((wishId) => wishId !== id));
    setRecentlyViewedIds((prev) => prev.filter((recId) => recId !== id));

    // 3. Update localStorage shopnest_products directly
    try {
      const saved = localStorage.getItem('shopnest_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          localStorage.setItem('shopnest_products', JSON.stringify(parsed.filter((p: any) => p.id !== id)));
        }
      }
    } catch { /* ignore */ }

    // 4. Save to deleted IDs blacklist so it NEVER resurfaces
    try {
      const deletedIds = getDeletedProductIds();
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('shopnest_deleted_product_ids', JSON.stringify(deletedIds));
      }
    } catch { /* ignore */ }

    // 5. Delete from Firestore
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.warn('Firestore product delete notice:', err);
    }
  };

  const duplicateProduct = async (id: string) => {
    const existing = products.find((p) => p.id === id);
    if (!existing) return;

    const duplicated: Product = {
      ...existing,
      id: 'sn-prod-' + Date.now(),
      name: `${existing.name} (Copy)`,
      slug: `${existing.slug}-copy-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProducts((prev) => [duplicated, ...prev]);
  };

  const bulkDeleteProducts = async (ids: string[]) => {
    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
    setCart((prev) => prev.filter((item) => !ids.includes(item.product.id)));
    setWishlistIds((prev) => prev.filter((wishId) => !ids.includes(wishId)));

    try {
      const saved = localStorage.getItem('shopnest_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          localStorage.setItem('shopnest_products', JSON.stringify(parsed.filter((p: any) => !ids.includes(p.id))));
        }
      }
    } catch { /* ignore */ }

    try {
      const deletedIds = getDeletedProductIds();
      ids.forEach((id) => {
        if (!deletedIds.includes(id)) deletedIds.push(id);
      });
      localStorage.setItem('shopnest_deleted_product_ids', JSON.stringify(deletedIds));
    } catch { /* ignore */ }

    for (const id of ids) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch { /* ignore */ }
    }
  };

  const bulkUpdateStatus = async (ids: string[], status: Product['status']) => {
    setProducts((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, status, updated_at: new Date().toISOString() } : p))
    );
  };

  const reportPriceChange = async (productId: string) => {
    const now = new Date().toISOString();
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              price_reported_diff: (p.price_reported_diff || 0) + 1,
              updated_at: now
            }
          : p
      )
    );
    try {
      const existing = products.find((p) => p.id === productId);
      const nextCount = (existing?.price_reported_diff || 0) + 1;
      await setDoc(doc(db, 'products', productId), { price_reported_diff: nextCount }, { merge: true });
    } catch {
      // safe fallback
    }
  };

  const bulkUpdatePrices = async (productIds: string[], adjustmentType: 'percentage' | 'fixed', value: number) => {
    const now = new Date().toISOString();
    setProducts((prev) =>
      prev.map((p) => {
        if (!productIds.includes(p.id)) return p;
        const currentPrice = p.price || 0;
        let newPrice = currentPrice;
        if (adjustmentType === 'fixed') {
          newPrice = Math.max(1, Math.round(currentPrice + value));
        } else {
          newPrice = Math.max(1, Math.round(currentPrice * (1 + value / 100)));
        }
        const origPrice = p.original_price || 0;
        const original = origPrice > newPrice ? origPrice : Math.round(newPrice * 1.5);
        const discount = original > 0 ? Math.round(((original - newPrice) / original) * 100) : 0;
        return {
          ...p,
          price: newPrice,
          original_price: original,
          discount_percentage: discount,
          price_verified_at: now,
          updated_at: now,
        };
      })
    );
  };

  const importProductsFromCsv = async (newItems: Partial<Product>[]): Promise<{ imported: number; errors: string[] }> => {
    const errors: string[] = [];
    const validToAdd: Product[] = [];

    newItems.forEach((item, index) => {
      if (!item.name) {
        errors.push(`Row ${index + 1}: Missing product name`);
        return;
      }
      const price = Number(item.price) || 499;
      const original_price = Number(item.original_price) || price * 2;
      const discount = Math.round(((original_price - price) / original_price) * 100);

      const prod: Product = {
        id: 'sn-prod-' + Date.now() + '-' + index,
        name: item.name,
        slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        short_description: item.short_description || item.name,
        full_description: item.full_description || item.short_description || item.name,
        category_id: item.category_id || 'womens-fashion',
        subcategory_id: item.subcategory_id || 'kurtis',
        brand: item.brand || 'ShopNest Curated',
        price,
        original_price,
        discount_percentage: discount > 0 ? discount : 50,
        currency: 'INR',
        images: item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop&q=80'],
        thumbnail: item.thumbnail || (item.images?.[0] ?? 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80'),
        affiliate_url: item.affiliate_url || 'https://www.meesho.com',
        affiliate_platform: (item.affiliate_platform as AffiliatePlatform) || 'Meesho',
        tags: item.tags || ['Ethnic', 'Trending'],
        keywords: item.keywords || ['kurti', 'online shopping'],
        rating: item.rating || 4.5,
        review_count: item.review_count || 120,
        availability: true,
        stock_status: 'in_stock',
        featured: Boolean(item.featured),
        trending: Boolean(item.trending),
        new_arrival: true,
        best_seller: false,
        deal: true,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      validToAdd.push(prod);
    });

    if (validToAdd.length > 0) {
      setProducts((prev) => [...validToAdd, ...prev]);
    }

    return { imported: validToAdd.length, errors };
  };

  const resetToDefaultSeed = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setBanners(INITIAL_BANNERS);
    localStorage.removeItem('shopnest_products');
    localStorage.removeItem('shopnest_categories');
    localStorage.removeItem('shopnest_banners');
  };

  const clearAllProducts = async () => {
    setProducts([]);
    localStorage.setItem('shopnest_products', JSON.stringify([]));
    try {
      const prodSnap = await getDocs(collection(db, 'products'));
      for (const d of prodSnap.docs) {
        await deleteDoc(doc(db, 'products', d.id));
      }
    } catch {
      // Keep local
    }
  };

  // Category Admin Actions
  const addCategory = async (catData: Omit<Category, 'id'>) => {
    const id = catData.slug || 'cat-' + Date.now();
    const newCat: Category = { ...catData, id };
    setCategories((prev) => [...prev, newCat]);
    try {
      await setDoc(doc(db, 'categories', id), newCat);
    } catch {
      // Keep local
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Banner Admin Actions
  const addBanner = async (bannerData: Omit<Banner, 'id'>) => {
    const id = 'banner-' + Date.now();
    const newBanner: Banner = { ...bannerData, id };
    setBanners((prev) => [...prev, newBanner]);
  };

  const updateBanner = async (id: string, updates: Partial<Banner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBanner = async (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  // Contact System
  const submitContactMessage = async (name: string, email: string, subject: string, message: string) => {
    const newMsg: ContactMessage = {
      id: 'msg-' + Date.now(),
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    setContactMessages((prev) => [newMsg, ...prev]);
    try {
      await addDoc(collection(db, 'contacts'), newMsg);
    } catch {
      // Keep local
    }
  };

  const updateContactStatus = (id: string, status: 'new' | 'read' | 'resolved') => {
    setContactMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const testFirestoreConnection = async (): Promise<{ success: boolean; message: string; latencyMs?: number }> => {
    const startTime = Date.now();
    try {
      setFirestoreSyncStatus('syncing');
      const pingDocRef = doc(db, '_health_check', 'connection_test');
      await setDoc(pingDocRef, {
        app: 'ShopNest',
        projectId: firebaseConfig.projectId,
        testedAt: new Date().toISOString(),
        status: 'healthy'
      });
      const latencyMs = Date.now() - startTime;
      setFirestoreSyncStatus('synced');
      return {
        success: true,
        message: `Connected successfully to Firebase project '${firebaseConfig.projectId}'! Response time: ${latencyMs}ms`,
        latencyMs
      };
    } catch (err: any) {
      setFirestoreSyncStatus('local_cache');
      return {
        success: false,
        message: err.message || 'Could not write to Firestore. Please ensure Firestore is created and rules allow write.'
      };
    }
  };

  const pushAllToFirestore = async (): Promise<{ success: boolean; message: string; count: number }> => {
    try {
      setFirestoreSyncStatus('syncing');
      let count = 0;
      for (const prod of products) {
        await setDoc(doc(db, 'products', prod.id), prod, { merge: true });
        count++;
      }
      for (const cat of categories) {
        await setDoc(doc(db, 'categories', cat.id), cat, { merge: true });
      }
      setFirestoreSyncStatus('synced');
      return {
        success: true,
        message: `Successfully synchronized ${count} products & ${categories.length} categories to your live Firebase database!`,
        count
      };
    } catch (err: any) {
      setFirestoreSyncStatus('local_cache');
      return {
        success: false,
        message: `Failed to push products: ${err.message}`,
        count: 0
      };
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        banners,
        wishlistIds,
        recentlyViewedIds,
        cart,
        affiliateClicks,
        contactMessages,
        commerceMode,
        setCommerceMode,

        filters,
        setFilters,
        resetFilters,
        filteredProducts,
        searchSuggestions,

        toggleWishlist,
        isInWishlist,
        clearWishlist,

        recordProductView,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isInCart,
        cartTotal,
        cartCount,

        customLogoUrl,
        updateCustomLogo,

        trackAndRedirectAffiliate,

        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        bulkDeleteProducts,
        bulkUpdateStatus,
        importProductsFromCsv,
        resetToDefaultSeed,
        clearAllProducts,
        reportPriceChange,
        bulkUpdatePrices,

        addCategory,
        updateCategory,
        deleteCategory,

        addBanner,
        updateBanner,
        deleteBanner,

        submitContactMessage,
        updateContactStatus,

        firestoreSyncStatus,
        testFirestoreConnection,
        pushAllToFirestore,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
