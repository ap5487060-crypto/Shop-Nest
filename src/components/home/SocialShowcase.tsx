import React from 'react';
import { Instagram, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { Product } from '../../types';

interface SocialShowcaseProps {
  products: Product[];
  onOpenProduct: (p: Product) => void;
}

export const SocialShowcase: React.FC<SocialShowcaseProps> = ({ products, onOpenProduct }) => {
  const viralPicks = products.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-2">
            <Instagram className="w-3.5 h-3.5 text-pink-600" />
            <span>As Seen On Instagram & Pinterest</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Follow Our Official Channels: @meeshodeals825
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tap on any look to get the direct verified shopping link!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com/meeshodeals825"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-bold text-xs shadow-md shadow-pink-500/20 hover:opacity-95 transition-all"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow on Instagram</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <a
            href="https://in.pinterest.com/shopnest825/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all"
          >
            <span className="font-extrabold text-xs">P</span>
            <span>Follow on Pinterest: @shopnest825</span>
          </a>
        </div>
      </div>

      {viralPicks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {viralPicks.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onOpenProduct(prod)}
              className="group relative aspect-4/5 rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-xs hover:shadow-lg transition-all"
            >
              <img
                src={prod.thumbnail || prod.images[0]}
                alt={prod.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                <span className="text-[10px] text-pink-300 font-bold flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-pink-400 text-pink-400" /> Viral Pick
                </span>
                <p className="text-xs font-bold line-clamp-1 mt-0.5">{prod.name}</p>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-[10px] text-pink-200 font-bold">{prod.affiliate_platform}</span>
                  <span className="text-[10px] bg-pink-600 px-1.5 py-0.5 rounded font-bold">Shop Now</span>
                </div>
              </div>

              {/* Top Instagram badge */}
              <div className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white/90">
                <Instagram className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="https://in.pinterest.com/shopnest825/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-3xl bg-rose-50 hover:bg-rose-100/70 border border-rose-200 transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md">
              P
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-rose-700 transition-colors">
                ShopNest Official Pinterest
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Pin boards, trending ethnic kurti ideas & loot deal collections @shopnest825
              </p>
            </div>
          </a>

          <a
            href="https://instagram.com/meeshodeals825"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-3xl bg-pink-50 hover:bg-pink-100/70 border border-pink-200 transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-pink-700 transition-colors">
                Instagram Channel @meeshodeals825
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily reels, viral outfit looks & direct marketplace shopping links
              </p>
            </div>
          </a>
        </div>
      )}
    </section>
  );
};
