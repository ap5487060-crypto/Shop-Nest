import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  ExternalLink, 
  BarChart3, 
  Package, 
  Layers, 
  Image, 
  Mail, 
  Database, 
  Download, 
  Upload, 
  Check, 
  X, 
  Search, 
  Filter, 
  Flame, 
  Eye, 
  Sparkles,
  RefreshCw,
  LogOut,
  AlertCircle,
  Camera,
  UploadCloud,
  Link as LinkIcon,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Product, Category, Banner, AffiliatePlatform } from '../../types';
import { ShopNestLogo } from '../common/ShopNestLogo';
import { firebaseConfig } from '../../lib/firebase';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const { 
    user,
    isAdmin, 
    adminPasscodeVerified, 
    verifyAdminPasscode, 
    lockAdmin, 
    userProfile,
    login 
  } = useAuth();

  const isOwner = Boolean(
    isAdmin ||
    adminPasscodeVerified ||
    userProfile?.role === 'super_admin' ||
    userProfile?.role === 'admin' ||
    userProfile?.email?.toLowerCase() === 'ap547060@gmail.com' ||
    userProfile?.email?.toLowerCase() === 'vijayprajapati3332@gmail.com' ||
    user?.email?.toLowerCase() === 'ap547060@gmail.com' ||
    user?.email?.toLowerCase() === 'vijayprajapati3332@gmail.com'
  );

  const { 
    products, 
    categories, 
    banners, 
    affiliateClicks, 
    contactMessages, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    duplicateProduct,
    bulkDeleteProducts,
    bulkUpdateStatus,
    importProductsFromCsv,
    resetToDefaultSeed,
    clearAllProducts,
    addCategory,
    deleteCategory,
    addBanner,
    deleteBanner,
    updateContactStatus,
    firestoreSyncStatus,
    testFirestoreConnection,
    pushAllToFirestore,
    customLogoUrl,
    updateCustomLogo
  } = useStore();

  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'branding' | 'categories' | 'banners' | 'clicks' | 'contacts' | 'firebase'>('overview');

  // Logo upload state
  const [tempLogoUrl, setTempLogoUrl] = useState<string>(customLogoUrl || '');
  const [logoInputMode, setLogoInputMode] = useState<'upload' | 'url'>('upload');
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoSavedSuccess, setLogoSavedSuccess] = useState(false);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/png');
          setTempLogoUrl(compressed);
        } else {
          setTempLogoUrl(src);
        }
        setLogoUploading(false);
      };
      img.onerror = () => {
        setTempLogoUrl(src);
        setLogoUploading(false);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveLogo = () => {
    updateCustomLogo(tempLogoUrl);
    setLogoSavedSuccess(true);
    setTimeout(() => setLogoSavedSuccess(false), 3000);
  };

  const handleResetLogo = () => {
    updateCustomLogo('');
    setTempLogoUrl('');
    setLogoSavedSuccess(true);
    setTimeout(() => setLogoSavedSuccess(false), 3000);
  };

  // Firestore test & sync state
  const [dbTestLoading, setDbTestLoading] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [dbPushLoading, setDbPushLoading] = useState(false);
  const [dbPushResult, setDbPushResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);

  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Bulk actions state
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('All');
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Safe In-App Delete Confirmation States (replaces blocked window.confirm)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLinkId(id);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    const id = productToDelete.id;
    const name = productToDelete.name;
    try {
      await deleteProduct(id);
      setActionNotice(`"${name}" successfully delete ho gaya!`);
      setTimeout(() => setActionNotice(null), 3500);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    const id = categoryToDelete.id;
    const name = categoryToDelete.name;
    deleteCategory(id);
    setCategoryToDelete(null);
    setActionNotice(`Category "${name}" successfully delete ho gayi.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleConfirmDeleteBanner = async () => {
    if (!bannerToDelete) return;
    const id = bannerToDelete.id;
    deleteBanner(id);
    setBannerToDelete(null);
    setActionNotice('Banner successfully delete ho gaya.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleAddSampleRealProduct = async () => {
    try {
      await addProduct({
        name: 'Lucknowi Chikankari Hand Embroidered Georgette Kurti Set',
        slug: 'lucknowi-chikankari-georgette-kurti-set-' + Date.now().toString().slice(-4),
        brand: 'ShopNest Curated',
        price: 499,
        original_price: 1299,
        discount_percentage: 62,
        currency: 'INR',
        category_id: 'womens-fashion',
        subcategory_id: 'kurtis',
        affiliate_platform: 'Meesho',
        affiliate_url: 'https://www.meesho.com',
        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'],
        thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
        price_verified_at: new Date().toISOString(),
        short_description: 'Pure Lucknowi Chikankari delicate hand embroidery on premium soft Georgette with matching inner.',
        full_description: 'Pure Lucknowi Chikankari delicate hand embroidery on premium soft Georgette with matching inner. Elegant pastel pink shade suitable for office, festive and casual outings.',
        deal: true,
        trending: true,
        featured: true,
        new_arrival: true,
        best_seller: true,
        status: 'published',
        rating: 4.8,
        review_count: 240,
        tags: ['Meesho', 'Chikankari', 'Kurtis', 'Ethnic'],
        keywords: ['kurti', 'chikankari', 'meesho', 'pink kurti'],
        availability: true,
        stock_status: 'in_stock',
      });
      setActionNotice('Real Meesho Kurti live database me add ho gayi! Vercel par turant dikh rahi hai.');
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      setActionNotice('Error: ' + (err.message || 'Could not add product'));
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  // CSV Import modal state
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [csvResult, setCsvResult] = useState<{ imported: number; errors: string[] } | null>(null);

  // Passcode gate for unauthorized users
  if (!isOwner) {
    const handleVerify = async (e: React.FormEvent) => {
      e.preventDefault();
      const valid = verifyAdminPasscode(passcode);
      if (valid) {
        setPasscodeError(false);
        return;
      }
      // If entered as password, try login with founder email ap547060@gmail.com
      try {
        await login('ap547060@gmail.com', passcode);
        setPasscodeError(false);
      } catch {
        setPasscodeError(true);
      }
    };

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-pink-100 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">ShopNest Owner Portal</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Authorized store owner only. Enter your password (<span className="font-semibold text-slate-700">Abhishek@8957</span>) to proceed.
          </p>

          {passcodeError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Access denied. Invalid owner password.</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="password"
              placeholder="Enter owner password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-center font-bold tracking-widest text-slate-900 focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all"
            >
              Unlock Admin Suite
            </button>
          </form>

          <button
            onClick={onBackToStore}
            className="mt-4 text-xs font-semibold text-slate-500 hover:text-pink-600"
          >
            ← Return to Store
          </button>
        </div>
      </div>
    );
  }

  // Filter products for admin table
  const displayedProducts = products.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !(p.brand || '').toLowerCase().includes(q)) return false;
    }
    if (filterPlatform !== 'All' && p.affiliate_platform !== filterPlatform) return false;
    return true;
  });

  // Calculate quick metrics
  const totalClicks = affiliateClicks.length;
  const meeshoClicks = affiliateClicks.filter((c) => c.affiliate_platform === 'Meesho').length;
  const amazonClicks = affiliateClicks.filter((c) => c.affiliate_platform === 'Amazon').length;
  const flipkartClicks = affiliateClicks.filter((c) => c.affiliate_platform === 'Flipkart').length;

  const handleExportCsv = () => {
    const headers = ['name', 'brand', 'category_id', 'affiliate_platform', 'affiliate_url', 'rating', 'review_count', 'status'];
    const rows = products.map((p) => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.brand}"`,
      p.category_id,
      p.affiliate_platform,
      `"${p.affiliate_url}"`,
      p.rating,
      p.review_count,
      p.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shopnest-products-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProcessCsvImport = async () => {
    if (!csvText.trim()) return;
    const lines = csvText.trim().split('\n');
    const headerLine = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const items: Partial<Product>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      if (row.length < 2) continue;
      const obj: any = {};
      headerLine.forEach((header, idx) => {
        obj[header] = row[idx]?.replace(/^"|"$/g, '').trim();
      });
      items.push(obj);
    }

    const res = await importProductsFromCsv(items);
    setCsvResult(res);
    setCsvText('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Admin Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShopNestLogo size="sm" />
            <span className="hidden sm:inline bg-pink-100 text-pink-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-pink-200">
              Admin Suite
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onBackToStore}
              className="text-xs font-bold text-slate-700 hover:text-pink-600 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-pink-300 transition-colors"
            >
              View Live Store
            </button>

            <button
              onClick={lockAdmin}
              className="text-xs font-semibold text-rose-600 hover:bg-rose-50 p-2 rounded-xl"
              title="Lock Admin Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'branding', label: 'Upload Store Logo', icon: Camera },
            { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
            { id: 'banners', label: `Hero Banners (${banners.length})`, icon: Image },
            { id: 'clicks', label: `Affiliate Clicks (${affiliateClicks.length})`, icon: ExternalLink },
            { id: 'contacts', label: `Messages (${contactMessages.length})`, icon: Mail },
            { id: 'firebase', label: 'Firebase Config', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* 4 Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>TOTAL PRODUCTS</span>
                  <Package className="w-4 h-4 text-pink-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">{products.length}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  {products.filter((p) => p.status === 'published').length} Published & Live
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>AFFILIATE CLICKS</span>
                  <ExternalLink className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">{totalClicks}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Tracked with safe redirects
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>MEESHO CLICKS</span>
                  <Sparkles className="w-4 h-4 text-fuchsia-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">{meeshoClicks}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Primary partner store
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span>FIREBASE STATUS</span>
                  <Database className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-bold text-emerald-700 capitalize">
                  {firestoreSyncStatus === 'synced' ? 'Online Synced' : 'Ready / Active'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Project: {firebaseConfig.projectId}
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-3xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
              <div>
                <h3 className="font-extrabold text-lg">Manage & Scale ShopNest Catalog</h3>
                <p className="text-xs text-pink-100 mt-0.5">
                  Add new kurtis, update prices, or import bulk CSV files anytime.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductModalOpen(true);
                  }}
                  className="bg-white text-pink-700 hover:bg-pink-50 font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
                <button
                  onClick={() => setActiveTab('branding')}
                  className="bg-white/20 hover:bg-white/30 border border-white/20 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Upload Logo</span>
                </button>
                <button
                  onClick={() => setCsvModalOpen(true)}
                  className="bg-black/20 hover:bg-black/30 border border-white/20 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>CSV Import</span>
                </button>
              </div>
            </div>

            {/* Top Clicked Products */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-pink-600" />
                <span>Featured Catalog Overview</span>
              </h3>
              <div className="divide-y divide-slate-100">
                {products.slice(0, 5).map((prod) => (
                  <div key={prod.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                        <img src={prod.thumbnail} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{prod.name}</h4>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {prod.affiliate_platform} • Verified Partner Link
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-lg">
                      Live Deal
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS TABLE */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Product Control Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pl-9 text-xs focus:outline-none focus:border-pink-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <select
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="All">All Platforms</option>
                  <option value="Meesho">Meesho</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Flipkart">Flipkart</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={handleExportCsv}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => setCsvModalOpen(true)}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import CSV</span>
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Product Photo & Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Platform</th>
                      <th className="p-4">Affiliate Store Link</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3 max-w-sm">
                            <div className="w-10 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                              <img src={p.thumbnail} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                              <p className="text-[11px] text-pink-600 font-medium">{p.brand || 'ShopNest'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 capitalize">{p.category_id.replace('-', ' ')}</td>
                        <td className="p-4">
                          <span className="font-bold text-pink-700 bg-pink-50 border border-pink-200 px-2.5 py-1 rounded-lg text-xs">
                            {p.affiliate_platform}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <a
                              href={p.affiliate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-pink-50 text-slate-700 hover:text-pink-700 font-semibold text-xs transition-colors"
                              title={p.affiliate_url}
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                              <span className="max-w-[100px] truncate">Open Link</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => handleCopyLink(p.affiliate_url, p.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50 text-slate-700 hover:text-pink-600 font-bold text-xs transition-all"
                              title="Copy Affiliate Link"
                            >
                              {copiedLinkId === p.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-600">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            p.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-pink-600 rounded-lg hover:bg-pink-50"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => duplicateProduct(p.id)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setProductToDelete(p)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {displayedProducts.length === 0 && (
                  <div className="text-center py-12 px-4 space-y-3">
                    <Package className="w-10 h-10 text-slate-300 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-700">Catalog is completely clean</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Sabhi purane demo products delete ho chuke hain. Apna product add karne ke liye "+ Add Real Product" par click karein. Photo upload karein aur apna affiliate link dalein!
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          setEditingProduct(null);
                          setProductModalOpen(true);
                        }}
                        className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-500/20 transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Add Real Product</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleAddSampleRealProduct}
                        className="px-4 py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Sparkles className="w-4 h-4 text-pink-600" />
                        <span>Add Real Meesho Deal (1-Click Test)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: STORE LOGO & BRANDING */}
        {activeTab === 'branding' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
            {logoSavedSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Store DP & Logo Firebase cloud database me permanently save ho gaya hai! Vercel live website (https://shop-nest-kappa-eight.vercel.app/) aur sabhi devices par turant live dikh raha hai.</span>
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-pink-600" />
                    <span>Store Logo Upload Section</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Apna official store logo upload karein. Ye logo Header aur Footer me turant update ho jayega aur permanently save rahega.
                  </p>
                </div>
              </div>

              {/* Mode switch: Upload file or URL */}
              <div className="flex bg-slate-100 p-1 rounded-2xl w-fit text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLogoInputMode('upload')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    logoInputMode === 'upload' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Photo Upload (Gallery / Files)
                </button>
                <button
                  type="button"
                  onClick={() => setLogoInputMode('url')}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    logoInputMode === 'url' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Logo Image Web URL
                </button>
              </div>

              {/* Upload Input Area */}
              {logoInputMode === 'upload' ? (
                <div>
                  <label
                    htmlFor="admin-logo-upload-input"
                    className="border-2 border-dashed border-pink-300 hover:border-pink-500 bg-pink-50/30 hover:bg-pink-50/60 rounded-3xl p-8 text-center cursor-pointer flex flex-col items-center justify-center transition-all group"
                  >
                    <UploadCloud className="w-10 h-10 text-pink-600 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-extrabold text-slate-900">
                      {logoUploading ? 'Logo process ho raha hai...' : 'Click to Upload Store Logo from Device'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      PNG (transparent recommended), JPG, SVG, ya WEBP format
                    </span>
                    <input
                      id="admin-logo-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Logo Image Link</label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://example.com/my-store-logo.png"
                      value={tempLogoUrl}
                      onChange={(e) => setTempLogoUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 pl-9 text-xs focus:outline-none focus:border-pink-500"
                    />
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>
              )}

              {/* Live Preview Cards */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Live Logo Preview
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Light Background Preview (Header) */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center min-h-[120px] text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Header Preview (Light)
                    </span>
                    {tempLogoUrl ? (
                      <img src={tempLogoUrl} alt="Logo Preview" className="h-10 max-w-[200px] object-contain" />
                    ) : (
                      <ShopNestLogo size="md" />
                    )}
                  </div>

                  {/* Dark Background Preview (Footer) */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xs flex flex-col items-center justify-center min-h-[120px] text-center text-white">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Footer Preview (Dark)
                    </span>
                    {tempLogoUrl ? (
                      <img src={tempLogoUrl} alt="Logo Preview" className="h-10 max-w-[200px] object-contain" />
                    ) : (
                      <div className="bg-white p-2 rounded-xl">
                        <ShopNestLogo size="sm" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Logo Permanently Fixed & Protected</span>
                </div>

                <button
                  type="button"
                  onClick={handleSaveLogo}
                  disabled={!tempLogoUrl}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    tempLogoUrl
                      ? 'bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white shadow-md shadow-pink-500/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Lock & Save Logo Permanently</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((c) => (
                <div key={c.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-full h-32 rounded-2xl overflow-hidden bg-slate-100 mb-4">
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900">{c.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{c.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.subcategories.map((s) => (
                        <span key={s.id} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Order: {c.order}</span>
                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(c)}
                      className="text-rose-600 hover:text-rose-700 font-bold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HERO BANNERS */}
        {activeTab === 'banners' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((b) => (
                <div key={b.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs">
                  <div className="relative h-44 bg-slate-900">
                    <img src={b.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end text-white">
                      <span className="text-[10px] bg-pink-600 px-2 py-0.5 rounded-full w-fit font-bold">{b.badge}</span>
                      <h4 className="font-extrabold text-sm mt-1">{b.title}</h4>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{b.subtitle}</span>
                    <button
                      type="button"
                      onClick={() => setBannerToDelete(b)}
                      className="text-xs text-rose-600 font-bold hover:text-rose-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AFFILIATE CLICKS */}
        {activeTab === 'clicks' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-pink-600" />
              <span>Affiliate Click Logs ({affiliateClicks.length})</span>
            </h3>

            {affiliateClicks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No affiliate clicks recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-100">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Product</th>
                      <th className="p-3">Platform</th>
                      <th className="p-3">UTM Source</th>
                      <th className="p-3">Device</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {affiliateClicks.slice(0, 30).map((c) => (
                      <tr key={c.id}>
                        <td className="p-3 font-mono text-[11px] text-slate-400">
                          {new Date(c.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3 font-bold text-slate-800">{c.product_name}</td>
                        <td className="p-3">
                          <span className="font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md">
                            {c.affiliate_platform}
                          </span>
                        </td>
                        <td className="p-3">{c.utm_source || 'shopnest'}</td>
                        <td className="p-3 capitalize">{c.device_type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: CONTACT INBOX */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-pink-600" />
              <span>Customer Inquiries & Feedback ({contactMessages.length})</span>
            </h3>

            {contactMessages.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No customer messages received yet.</p>
            ) : (
              <div className="space-y-3">
                {contactMessages.map((m) => (
                  <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{m.name}</span>{' '}
                        <span className="text-slate-500 font-normal">({m.email})</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{new Date(m.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">{m.subject}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{m.message}</p>
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateContactStatus(m.id, 'resolved')}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                          m.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {m.status === 'resolved' ? 'Resolved ✓' : 'Mark Resolved'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: FIREBASE CONFIG INSPECTOR */}
        {activeTab === 'firebase' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Connected Firebase Configuration</h3>
                <p className="text-xs text-slate-500">
                  ShopNest is registered and connected to project <span className="font-bold text-slate-800">{firebaseConfig.projectId}</span>.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto space-y-1">
              <div>projectId: "{firebaseConfig.projectId}"</div>
              <div>authDomain: "{firebaseConfig.authDomain}"</div>
              <div>storageBucket: "{firebaseConfig.storageBucket}"</div>
              <div>messagingSenderId: "{firebaseConfig.messagingSenderId}"</div>
              <div>appId: "{firebaseConfig.appId}"</div>
              {firebaseConfig.measurementId && <div>measurementId: "{firebaseConfig.measurementId}"</div>}
            </div>

            {/* Interactive Live Connection Testing & Sync */}
            <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <span>Live Database Sync & Test Engine</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      firestoreSyncStatus === 'synced'
                        ? 'bg-emerald-100 text-emerald-800'
                        : firestoreSyncStatus === 'syncing'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {firestoreSyncStatus === 'synced' ? '● Connected to Cloud' : firestoreSyncStatus === 'syncing' ? 'Connecting...' : '○ Local Cache Ready'}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Test connection with your Firebase Firestore or push all 20+ products into your cloud collections.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={dbTestLoading}
                    onClick={async () => {
                      setDbTestLoading(true);
                      setDbTestResult(null);
                      const res = await testFirestoreConnection();
                      setDbTestResult(res);
                      setDbTestLoading(false);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${dbTestLoading ? 'animate-spin' : ''}`} />
                    <span>{dbTestLoading ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={dbPushLoading}
                    onClick={async () => {
                      setDbPushLoading(true);
                      setDbPushResult(null);
                      const res = await pushAllToFirestore();
                      setDbPushResult(res);
                      setDbPushLoading(false);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <Upload className={`w-3.5 h-3.5 ${dbPushLoading ? 'animate-spin' : ''}`} />
                    <span>{dbPushLoading ? 'Syncing...' : 'Push Products to Firestore'}</span>
                  </button>
                </div>
              </div>

              {dbTestResult && (
                <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  dbTestResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {dbTestResult.success ? <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                  <span>{dbTestResult.message}</span>
                </div>
              )}

              {dbPushResult && (
                <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  dbPushResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {dbPushResult.success ? <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                  <span>{dbPushResult.message}</span>
                </div>
              )}
            </div>

            {/* Clear instructions */}
            <div className="p-4 bg-pink-50 border border-pink-200 rounded-2xl text-xs space-y-2 text-slate-700">
              <h4 className="font-bold text-pink-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-600" />
                Firebase Setup Guide:
              </h4>
              <p>
                Aapne Firestore aur Authentication console me enable kar diya hai. Ab aap upar diye gaye <strong>"Test Connection"</strong> button se connection verify kar sakte hain aur <strong>"Push Products to Firestore"</strong> click karke saara data apne cloud database me bhej sakte hain!
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>
                  <strong>Authentication:</strong> Email/Password and Anonymous active.
                </li>
                <li>
                  <strong>Firestore:</strong> Collections (<code className="bg-white px-1 py-0.5 rounded">products</code>, <code className="bg-white px-1 py-0.5 rounded">categories</code>, <code className="bg-white px-1 py-0.5 rounded">affiliate_clicks</code>) live.
                </li>
                <li>
                  <strong>Local Fallback Active:</strong> Even if offline or network delays occur, ShopNest keeps data synchronized locally.
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* ACTION NOTICE TOAST */}
      {actionNotice && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-200" />
            <span>{actionNotice}</span>
          </div>
        </div>
      )}

      {/* SAFE IN-APP PRODUCT DELETE MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-extrabold text-slate-900">Delete Product?</h3>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left">
                <div className="w-12 h-14 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                  <img src={productToDelete.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-slate-900 line-clamp-1">{productToDelete.name}</p>
                  <p className="text-[11px] text-pink-600 font-semibold">{productToDelete.affiliate_platform}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Ye product website aur database se turant permanent delete ho jayega.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDeleteProduct}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-colors shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAFE IN-APP CATEGORY DELETE MODAL */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-100 space-y-4 animate-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Delete Category?</h3>
            <p className="text-xs text-slate-600">
              Kya aap <span className="font-bold text-slate-900">"{categoryToDelete.name}"</span> category ko delete karna chahte hain?
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAFE IN-APP BANNER DELETE MODAL */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-100 space-y-4 animate-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Delete Banner?</h3>
            <p className="text-xs text-slate-600">
              Kya aap <span className="font-bold text-slate-900">"{bannerToDelete.title}"</span> banner ko remove karna chahte hain?
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBannerToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBanner}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT ADD / EDIT MODAL */}
      {productModalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={async (prodData) => {
            if (editingProduct) {
              await updateProduct(editingProduct.id, prodData);
            } else {
              await addProduct(prodData);
            }
            setProductModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* CSV IMPORT MODAL */}
      {csvModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">Bulk Product CSV Import</h3>
              <button onClick={() => setCsvModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Paste CSV text with columns: <code className="bg-slate-100 px-1 py-0.5 rounded">name, price, original_price, affiliate_platform, affiliate_url</code>
            </p>

            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={`name,price,original_price,affiliate_platform,affiliate_url\nFloral Anarkali Kurti,599,1499,Meesho,https://www.meesho.com`}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-xs focus:outline-none focus:border-pink-500"
            />

            {csvResult && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl">
                Successfully imported {csvResult.imported} products!
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCsvModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={handleProcessCsvImport}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-pink-600 text-white hover:bg-pink-700"
              >
                Import Rows
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component: Product Form Modal
interface ProductFormModalProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, categories, onClose, onSave }) => {
  const [name, setName] = useState(product?.name || '');
  const [brand, setBrand] = useState(product?.brand || 'ShopNest Curated');
  const [categoryId, setCategoryId] = useState(product?.category_id || 'womens-fashion');
  const [subcategoryId, setSubcategoryId] = useState(product?.subcategory_id || 'kurtis');
  
  // Platform selection (presets or custom)
  const defaultPlatform = product?.affiliate_platform || 'Meesho';
  const isPresetPlatform = ['Meesho', 'Amazon', 'Flipkart', 'Shopsy', 'Myntra', 'Ajio', 'EarnKaro'].includes(defaultPlatform);
  const [platformSelect, setPlatformSelect] = useState<string>(isPresetPlatform ? defaultPlatform : 'Custom');
  const [customPlatform, setCustomPlatform] = useState<string>(!isPresetPlatform ? defaultPlatform : '');

  const [affiliateUrl, setAffiliateUrl] = useState(product?.affiliate_url || '');

  // Image upload vs URL mode
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState(product?.thumbnail || '');
  const [imageUploading, setImageUploading] = useState(false);

  const [shortDesc, setShortDesc] = useState(product?.short_description || '');
  const [fullDesc, setFullDesc] = useState(product?.full_description || '');
  const [deal, setDeal] = useState(product?.deal ?? true);
  const [trending, setTrending] = useState(product?.trending ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? true);
  const [formError, setFormError] = useState<string | null>(null);

  // Selected category subcategories
  const currentCatObj = categories.find((c) => c.id === categoryId);

  // Handle direct file upload from device with light compression
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          setImageUrl(compressed);
        } else {
          setImageUrl(src);
        }
        setImageUploading(false);
      };
      img.onerror = () => {
        setImageUrl(src);
        setImageUploading(false);
      };
      img.src = src;
    };
    reader.onerror = () => {
      setImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setFormError('Please upload a product photo or provide an image URL.');
      return;
    }
    setFormError(null);

    const finalPlatform = platformSelect === 'Custom' ? (customPlatform.trim() || 'Partner Store') : platformSelect;
    let cleanAffiliateUrl = affiliateUrl.trim();
    if (cleanAffiliateUrl && !cleanAffiliateUrl.startsWith('http://') && !cleanAffiliateUrl.startsWith('https://')) {
      cleanAffiliateUrl = 'https://' + cleanAffiliateUrl;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await onSave({
      name,
      slug: slug || `prod-${Date.now()}`,
      brand: brand || 'ShopNest',
      price: 0,
      original_price: 0,
      discount_percentage: 0,
      currency: 'INR',
      category_id: categoryId,
      subcategory_id: subcategoryId,
      affiliate_platform: finalPlatform,
      affiliate_url: cleanAffiliateUrl || 'https://www.meesho.com',
      images: [imageUrl],
      thumbnail: imageUrl,
      price_verified_at: new Date().toISOString(),
      short_description: shortDesc || name,
      full_description: fullDesc || shortDesc || name,
      deal,
      trending,
      featured,
      new_arrival: true,
      best_seller: false,
      status: 'published',
      rating: product?.rating || 4.7,
      review_count: product?.review_count || 120,
      tags: [finalPlatform, 'Shopping', 'Deals'],
      keywords: [name.toLowerCase(), finalPlatform.toLowerCase()],
      availability: true,
      stock_status: 'in_stock',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              {product ? 'Edit Product' : 'Add New Real Product'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Photo upload aur kisi bhi platform ka affiliate link add karein
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Product Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pure Cotton Chikankari Straight Kurti"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Live Partner Deal Notice (No Price Required) */}
          <div className="p-3 bg-pink-50/70 border border-pink-200/80 rounded-2xl flex items-center gap-2.5 text-xs text-pink-900">
            <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
            <span className="leading-snug">
              <strong>Price daalne ki koi zaroorat nahi hai:</strong> Customer jab 'Shop Now' dabayega, use direct partner store ({platformSelect === 'Custom' ? 'partner link' : platformSelect}) par live discounted price mil jayega.
            </span>
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  const firstSub = categories.find((c) => c.id === e.target.value)?.subcategories?.[0]?.id;
                  if (firstSub) setSubcategoryId(firstSub);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subcategory</label>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
              >
                {currentCatObj?.subcategories?.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                )) || <option value="general">General</option>}
              </select>
            </div>
          </div>

          {/* Platform & Custom Platform Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Partner Platform</label>
              <select
                value={platformSelect}
                onChange={(e) => setPlatformSelect(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
              >
                <option value="Meesho">Meesho</option>
                <option value="Amazon">Amazon</option>
                <option value="Flipkart">Flipkart</option>
                <option value="Shopsy">Shopsy</option>
                <option value="EarnKaro">EarnKaro</option>
                <option value="Myntra">Myntra</option>
                <option value="Ajio">Ajio</option>
                <option value="Custom">Custom / Other Platform</option>
              </select>
            </div>

            {platformSelect === 'Custom' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Custom Platform Name</label>
                <input
                  type="text"
                  placeholder="e.g. Telegram / Shopsy / Brand Store"
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-pink-500"
                />
              </div>
            )}
          </div>

          {/* Affiliate URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Affiliate / Product Buying Link <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="https://www.meesho.com/... or https://amzn.to/... or any affiliate URL"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-pink-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              ✦ Aap chahe kisi bhi platform ka link add karein — customer "Shop Now" click karte hi turant ye link open ho jayega.
            </p>
          </div>

          {/* PRODUCT IMAGE: PHOTO UPLOAD + URL TABS */}
          <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-pink-600" />
                <span>Product Photo (Upload ya URL dono available)</span>
              </label>

              {/* Toggle Mode */}
              <div className="flex bg-white rounded-xl p-0.5 border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    imageMode === 'upload' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Photo Upload
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    imageMode === 'url' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {imageMode === 'upload' ? (
              <div>
                <label
                  htmlFor="product-file-input"
                  className="border-2 border-dashed border-pink-300 hover:border-pink-500 bg-white rounded-2xl p-5 text-center cursor-pointer flex flex-col items-center justify-center transition-colors group"
                >
                  <UploadCloud className="w-8 h-8 text-pink-500 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-800">
                    {imageUploading ? 'Processing Photo...' : 'Click to Upload Photo from Gallery / Device'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Phone photo, camera, screenshot, ya computer file (JPG, PNG, WEBP)
                  </span>
                  <input
                    id="product-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="Paste image web link (https://...)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 pl-8 text-xs focus:outline-none focus:border-pink-500"
                  />
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>
            )}

            {/* Live Image Preview */}
            {imageUrl && (
              <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200 mt-2">
                <div className="w-14 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Photo Ready</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {imageUrl.startsWith('data:') ? 'Uploaded directly from your device' : imageUrl}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-lg hover:bg-rose-50"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="Fabric details, size info, or key features..."
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Badges Toggle */}
          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input type="checkbox" checked={deal} onChange={(e) => setDeal(e.target.checked)} className="accent-pink-600" />
              <span>Mark as Loot Deal</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input type="checkbox" checked={trending} onChange={(e) => setTrending(e.target.checked)} className="accent-pink-600" />
              <span>Mark as Trending</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-pink-600" />
              <span>Show on Homepage</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white shadow-md shadow-pink-500/20 transition-all"
            >
              Save & Publish Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
