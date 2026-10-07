import React from 'react';
import { X, Trash2, ShoppingBag, ExternalLink, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateCatalog: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onNavigateCatalog }) => {
  const { 
    cart, 
    cartTotal, 
    cartCount, 
    removeFromCart, 
    updateCartQuantity, 
    commerceMode, 
    trackAndRedirectAffiliate 
  } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-pink-600" />
            <h2 className="font-extrabold text-slate-900 text-base">Shopping Bag ({cartCount})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Mode notice */}
          <div className="p-3 bg-pink-50/70 border border-pink-100 rounded-2xl flex items-start gap-2.5 text-xs text-slate-700">
            <Info className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-slate-900">Affiliate Discovery Mode:</span>{' '}
              Items saved in your bag can be ordered directly from verified marketplace partners at the lowest online price.
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Your shopping bag is empty</h3>
              <p className="text-xs text-slate-500 mt-1 mb-5 max-w-xs">
                Explore handpicked designer kurtis and trending ethnic deals.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNavigateCatalog();
                }}
                className="bg-pink-600 text-white font-bold text-xs py-2.5 px-6 rounded-xl hover:bg-pink-700 transition-colors shadow-xs"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.productId}
                className="p-3 rounded-2xl border border-slate-200/80 bg-white flex gap-3 shadow-xs"
              >
                <div className="w-18 h-22 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={item.product.thumbnail || item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{item.product.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Partner: <span className="font-semibold text-pink-600">{item.product.affiliate_platform}</span>
                      {item.selectedSize && <span className="ml-2 font-medium">Size: {item.selectedSize}</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                      Live Deal on {item.product.affiliate_platform}
                    </span>

                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                      1 Item Saved
                    </span>
                  </div>

                  <button
                    onClick={() => trackAndRedirectAffiliate(item.product)}
                    className="mt-2 text-[11px] font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 underline underline-offset-2"
                  >
                    <span>Order on {item.product.affiliate_platform}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout strip */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Total Items in Bag:</span>
              <span className="font-extrabold text-sm text-pink-600">
                {cartCount} Selected
              </span>
            </div>

            <button
              onClick={() => {
                // Open first item on partner store
                if (cart[0]) {
                  trackAndRedirectAffiliate(cart[0].product);
                }
              }}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-extrabold text-sm py-3 rounded-2xl shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>Shop on Partner Store</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Fulfilled securely by official marketplace partners</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
