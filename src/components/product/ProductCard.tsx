import React, { useState } from 'react';
import { 
  Heart, 
  ExternalLink, 
  Star, 
  Share2, 
  Sparkles, 
  Check, 
  ShoppingBag,
  Eye
} from 'lucide-react';
import { Product, AffiliatePlatform } from '../../types';
import { useStore } from '../../context/StoreContext';
import confetti from 'canvas-confetti';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const { 
    isInWishlist, 
    toggleWishlist, 
    trackAndRedirectAffiliate,
    commerceMode,
    addToCart,
    isInCart
  } = useStore();

  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isWish = isInWishlist(product.id);
  const isSavedInBag = isInCart(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    if (added) {
      try {
        confetti({
          particleCount: 25,
          spread: 40,
          origin: {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
          },
          colors: ['#EC4899', '#F43F5E', '#FDA4AF'],
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const handleShopNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackAndRedirectAffiliate(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shopnest.vercel.app';
    const shareUrl = `${origin}/#prod-${product.id}`;

    // Clean message with isolated deal link on its own line for WhatsApp OpenGraph preview card unfurling
    const text = `🌸 *${product.name}*\n🏷️ *Store:* ${product.affiliate_platform}\n✨ *Handpicked Fashion Deal on ShopNest*\n\n👉 *View Deal & Buy Now:*\n${shareUrl}`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

    // Open synchronously inside the click handler to guarantee popup blockers NEVER block it
    const win = window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (!win) {
      // Direct anchor click fallback for mobile WebViews & sandboxes
      const link = document.createElement('a');
      link.href = waUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shopnest.vercel.app';
    const shareUrl = `${origin}/#prod-${product.id}`;

    // Web Share API (native sheet on Android, iOS, and macOS)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `ShopNest: ${product.name}`,
          text: `🌸 Check out ${product.name} on ShopNest (${product.affiliate_platform})!`,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  // Platform badge colors
  const platformStyles: Record<string, { bg: string; text: string; label: string }> = {
    Meesho: { bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200', text: 'text-fuchsia-700', label: 'Meesho' },
    Amazon: { bg: 'bg-amber-50 text-amber-800 border-amber-200', text: 'text-amber-800', label: 'Amazon' },
    Flipkart: { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'text-blue-700', label: 'Flipkart' },
    Myntra: { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'text-rose-700', label: 'Myntra' },
    Ajio: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'text-emerald-700', label: 'Ajio' },
    Shopsy: { bg: 'bg-yellow-50 text-yellow-800 border-yellow-200', text: 'text-yellow-800', label: 'Shopsy' },
    EarnKaro: { bg: 'bg-cyan-50 text-cyan-800 border-cyan-200', text: 'text-cyan-800', label: 'EarnKaro' },
    Other: { bg: 'bg-slate-50 text-slate-700 border-slate-200', text: 'text-slate-700', label: 'Partner Store' },
  };

  const currentPlatformStyle = platformStyles[product.affiliate_platform] || {
    bg: 'bg-pink-50 text-pink-700 border-pink-200',
    text: 'text-pink-700',
    label: product.affiliate_platform || 'Partner Store',
  };

  return (
    <div
      onClick={() => onOpenDetail(product)}
      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-pink-300 shadow-xs hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image Thumbnail Container: Compact & fully contained */}
      <div className="relative h-40 sm:h-48 w-full bg-slate-50 overflow-hidden flex items-center justify-center p-2">
        {/* Placeholder skeleton before load */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-pink-50 to-slate-100 animate-pulse" />
        )}

        <img
          src={product.thumbnail || product.images[0]}
          alt={product.image_alt_text || product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Top Badges: Deal tag if marked */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.deal && (
            <span className="bg-pink-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> DEAL
            </span>
          )}
        </div>

        {/* Top Right: Wishlist & Share buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={handleWishlistClick}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all transform active:scale-90 ${
              isWish
                ? 'bg-white text-pink-600 shadow-md'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-pink-600 shadow-xs'
            }`}
            title={isWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-pink-500 text-pink-500' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-pink-600 backdrop-blur-md shadow-xs opacity-0 group-hover:opacity-100 transition-all hidden sm:flex"
            title="Share product link"
            aria-label="Share"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Platform tag pill on bottom left of image */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md bg-white/95 shadow-xs ${currentPlatformStyle.text}`}>
            {currentPlatformStyle.label}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Brand row (clean, no rating) */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-pink-600 uppercase tracking-wider text-[10px] truncate max-w-[150px]">
              {product.brand || 'ShopNest'}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </div>

        <div>
          {/* Action CTA: "Shop Now" + 1-Click WhatsApp + Single-save Bag Button */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShopNow}
              className="flex-1 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 hover:from-pink-700 hover:to-rose-600 text-white font-extrabold text-xs py-2 px-2.5 rounded-xl shadow-xs shadow-pink-500/20 flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
            >
              <span>Shop Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* 1-Click WhatsApp Share */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="p-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors shrink-0"
              title="Share on WhatsApp"
              aria-label="Share on WhatsApp"
            >
              <svg className="w-4 h-4 fill-emerald-600" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={handleQuickAdd}
              className={`p-2 rounded-xl border transition-colors ${
                isSavedInBag
                  ? 'border-pink-500 bg-pink-50 text-pink-600'
                  : 'border-slate-200 hover:border-pink-300 hover:bg-pink-50 text-slate-600 hover:text-pink-600'
              }`}
              title={isSavedInBag ? 'Saved in Bag' : 'Save to Bag'}
              aria-label="Save to Bag"
            >
              {isSavedInBag ? <Check className="w-4 h-4 text-pink-600" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
