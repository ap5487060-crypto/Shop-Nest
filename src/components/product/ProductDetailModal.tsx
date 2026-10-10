import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ExternalLink, 
  Star, 
  Share2, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Check, 
  Copy, 
  ChevronRight,
  ShoppingBag,
  Info
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import confetti from 'canvas-confetti';
import { shareProductToWhatsApp } from '../../lib/shareUtils';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectProduct,
}) => {
  const { 
    isInWishlist, 
    toggleWishlist, 
    trackAndRedirectAffiliate, 
    products, 
    addToCart,
    recordProductView,
    reportPriceChange,
    isInCart
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [priceReported, setPriceReported] = useState(false);

  React.useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setPriceReported(false);
      recordProductView(product.id);
    }
  }, [product?.id]);

  if (!product) return null;

  const isWish = isInWishlist(product.id);
  const isSavedInBag = isInCart(product.id);
  const images = product.images?.length > 0 ? product.images : [product.thumbnail];

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  const handleWishlist = (e: React.MouseEvent) => {
    const added = toggleWishlist(product.id);
    if (added) {
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          colors: ['#EC4899', '#DB2777', '#F43F5E'],
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const handleShare = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shop-nest-kappa-eight.vercel.app';
    const productPageUrl = `${origin}/?product=${product.id}`;
    const directBuyUrl = product.affiliate_url || productPageUrl;
    const photoUrl = product.thumbnail || images[0] || '';

    const photoLine = photoUrl && !photoUrl.startsWith('data:') ? `\n📸 *Photo:*\n${photoUrl}\n` : '';
    const text = `🌸 *${product.name}* on ShopNest (${product.affiliate_platform})${photoLine}\n👉 Buy Now: ${directBuyUrl}\n🔗 Product Page: ${productPageUrl}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `ShopNest: ${product.name}`,
          text,
          url: productPageUrl,
        });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(productPageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleWhatsAppShare = async () => {
    await shareProductToWhatsApp(product);
  };

  const handlePinterestPin = () => {
    const shareUrl = `${window.location.origin}/#prod-${product.id}`;
    const media = images[0];
    const desc = `${product.name} - ShopNest Fashion`;
    window.open(
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(media)}&description=${encodeURIComponent(desc)}`,
      '_blank'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-pink-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-slate-100 text-slate-700 shadow-md transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main modal content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 lg:p-8">
          
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-3">
            {/* Main Stage Image */}
            <div className="relative aspect-square sm:aspect-4/5 w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 flex items-center justify-center p-3">
              <img
                src={images[activeImageIndex] || product.thumbnail}
                alt={product.name}
                className="max-h-full max-w-full object-contain transition-all duration-300"
              />

              {/* Deal Tag */}
              {product.deal && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> HOT DEAL
                </div>
              )}

              {/* Platform badge */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-pink-700 border border-pink-100 shadow-xs">
                Partner Store: {product.affiliate_platform}
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-pink-600 ring-2 ring-pink-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information & CTAs */}
          <div className="flex flex-col justify-between space-y-5">
            <div>
              {/* Brand & Partner */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-bold text-pink-600 uppercase tracking-wider text-xs">
                  {product.brand || 'ShopNest'}
                </span>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {product.affiliate_platform}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h1>

              {/* Live Deal Badge & Disclaimer */}
              <div className="mt-4 p-4 bg-gradient-to-r from-pink-50/80 via-rose-50/50 to-amber-50/60 rounded-2xl border border-pink-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-600 text-white font-extrabold text-xs shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" /> Live Deal on {product.affiliate_platform}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">Verified Partner Store</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pt-1">
                  <strong className="text-slate-900">Price & Discount Notice:</strong> E-commerce stores par flash deals aur coupons ke karan prices change hote rehte hain. Aaj ka live discounted price aur size availability dekhne ke liye direct partner store par open karein.
                </p>
              </div>

              {/* Sizes Selector */}
              <div className="mt-4">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Size
                </div>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                        selectedSize === size
                          ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20'
                          : 'border border-slate-200 text-slate-700 hover:border-pink-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Affiliate Platform Guarantee Note */}
              <div className="mt-4 p-3 bg-pink-50/60 rounded-2xl border border-pink-100 flex items-start gap-2.5 text-xs text-slate-700">
                <Info className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-slate-900">Verified Marketplace Link:</span>{' '}
                  This item is fulfilled directly through our official partner{' '}
                  <span className="font-bold text-pink-700">{product.affiliate_platform}</span> with Cash on Delivery (COD), easy returns, and customer support.
                </div>
              </div>

              {/* Action Buttons: Primary Shop Now + Wishlist + Cart */}
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => trackAndRedirectAffiliate(product)}
                  className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 hover:from-pink-700 hover:to-rose-600 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
                >
                  <span>Shop on {product.affiliate_platform} at Best Price</span>
                  <ExternalLink className="w-4 h-4" />
                </button>

                {/* Alternate links if available */}
                {product.alternate_affiliate_links && product.alternate_affiliate_links.length > 0 && (
                  <div className="flex gap-2">
                    {product.alternate_affiliate_links.map((alt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => trackAndRedirectAffiliate(product, alt.platform)}
                        className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:border-pink-300 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Check on {alt.platform}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleWishlist}
                    className={`flex-1 py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
                      isWish
                        ? 'border-pink-500 bg-pink-50 text-pink-600'
                        : 'border-slate-200 hover:border-pink-300 text-slate-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWish ? 'fill-pink-500 text-pink-500' : ''}`} />
                    <span>{isWish ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addToCart(product, 1, selectedSize)}
                    className={`flex-1 py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
                      isSavedInBag
                        ? 'border-pink-500 bg-pink-50 text-pink-600'
                        : 'border-slate-200 hover:border-pink-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {isSavedInBag ? <Check className="w-4 h-4 text-pink-600" /> : <ShoppingBag className="w-4 h-4" />}
                    <span>{isSavedInBag ? 'Saved in Bag' : 'Save to Bag'}</span>
                  </button>
                </div>
              </div>

              {/* Social Sharing strip */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5" /> Share Deal:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium transition-colors"
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={handlePinterestPin}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-medium transition-colors"
                  >
                    Pinterest
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                    title="Copy Link"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Specifications & Highlights Accordion */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Product Overview
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {product.full_description || product.short_description}
                </p>
              </div>

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Key Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="bg-slate-50 p-2 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">{key}</span>
                        <span className="font-semibold text-slate-800">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products Recommendation */}
        {relatedProducts.length > 0 && (
          <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/70 border-t border-slate-100 rounded-b-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-600" />
                More You'll Love in This Category
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="bg-white rounded-2xl p-2.5 border border-slate-200 hover:border-pink-300 shadow-xs cursor-pointer group transition-all"
                >
                  <div className="aspect-3/4 w-full rounded-xl overflow-hidden bg-slate-100 mb-2">
                    <img
                      src={rel.thumbnail || rel.images[0]}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-pink-600">
                    {rel.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span className="font-bold text-[11px] text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md">
                      {rel.affiliate_platform}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-0.5">
                      View Deal →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
