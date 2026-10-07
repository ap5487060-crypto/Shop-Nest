import React from 'react';
import { Sparkles, Heart, Compass, ShieldCheck, Instagram } from 'lucide-react';
import { ShopNestLogo } from '../common/ShopNestLogo';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8">
        
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-block">
            <ShopNestLogo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            About ShopNest
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Your trusted destination for handpicked Indian fashion, viral ethnic looks, and genuine online shopping deals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-100">
            <h3 className="font-bold text-sm text-pink-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-600" />
              Our Story
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ShopNest was born from a simple realization: millions of Indian online shoppers spend hours scrolling through thousands of repetitive listings trying to find true quality. We built ShopNest as a dedicated discovery hub focusing on premium kurtis, graceful festive wear, and trending lifestyle finds.
            </p>
          </div>

          <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
            <h3 className="font-bold text-sm text-rose-900 mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600" />
              Our Promise
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never promote poor-quality products for mere commission. Every piece featured in our collections has passed rigorous customer feedback checks, authentic fabric criteria, and reliable partner store backing with return options.
            </p>
          </div>
        </div>

        {/* Channels */}
        <div className="p-6 bg-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-extrabold text-sm">Follow ShopNest On Social Media</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Daily lookbooks, kurti unboxings, and flash coupon drops on Instagram @meeshodeals825
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/meeshodeals825"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-2 shrink-0 transition-all"
            >
              <Instagram className="w-4 h-4" />
              <span>@meeshodeals825</span>
            </a>
            <a
              href="https://in.pinterest.com/shopnest825/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shrink-0 transition-all"
            >
              <span className="font-extrabold text-xs">P</span>
              <span>@shopnest825</span>
            </a>
          </div>
        </div>

        {/* Creator / Developer Credit */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Developer & Creator</h4>
            <p className="text-xs text-slate-600 mt-0.5">ShopNest has been crafted, designed & developed by Abhishek Prajapati.</p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-pink-600 text-white font-extrabold text-xs shadow-xs">
            Abhishek Prajapati (Dev)
          </span>
        </div>
      </div>
    </div>
  );
};
