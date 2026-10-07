import React from 'react';
import { ShieldCheck, Info, CheckCircle2, HeartHandshake } from 'lucide-react';
import { ShopNestLogo } from '../common/ShopNestLogo';

export const AffiliateDisclosurePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-50 rounded-2xl text-pink-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Affiliate Disclosure
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent, honest, and compliant with consumer protection guidelines
            </p>
          </div>
        </div>

        <div className="p-4 bg-pink-50/70 border border-pink-200 rounded-2xl text-xs sm:text-sm text-pink-900 leading-relaxed font-medium">
          "Some links on ShopNest may be affiliate links. If you make a purchase through these links, we may earn an affiliate commission at no additional cost to you."
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">1. How ShopNest Operates</h2>
          <p>
            ShopNest is a fashion discovery and curation platform designed to help shoppers discover trending women's fashion, authentic Lucknowi chikankari kurtis, festive wear, and viral lifestyle products. We do not manufacture or store physical inventory; instead, we partner with reputable e-commerce marketplaces including Meesho, Amazon, and Flipkart.
          </p>

          <h2 className="text-base font-bold text-slate-900">2. No Extra Cost to You</h2>
          <p>
            When you click on a "Shop Now" button on ShopNest and complete a purchase on a partner website, our platform may receive a small referral commission. Crucially, <strong>this never increases the price you pay</strong>. You always pay the exact same or even lower promotional rate offered by the merchant.
          </p>

          <h2 className="text-base font-bold text-slate-900">3. Editorial Independence & Genuine Curation</h2>
          <p>
            Our product selection is driven purely by quality, customer ratings (typically 4.2 stars and above), fabric integrity, and fair value. We do not fabricate fake reviews, false price discounts, or misleading stock counts.
          </p>

          <h2 className="text-base font-bold text-slate-900">4. Partner Order Fulfillment & Support</h2>
          <p>
            All physical packaging, shipping, cash on delivery (COD) transactions, returns, and exchanges are handled directly by the partner store (e.g., Meesho, Amazon, or Flipkart) in accordance with their respective buyer protection policies.
          </p>

          <h2 className="text-base font-bold text-slate-900">5. Social Media Disclosure</h2>
          <p>
            On our official channels, including Instagram (<strong>@meeshodeals825</strong>) and Pinterest (<a href="https://in.pinterest.com/shopnest825/" target="_blank" rel="noopener noreferrer" className="font-bold text-pink-600 hover:underline">@shopnest825</a>), we also share curated links. The same transparent affiliate relationships apply across all our social media presences.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Last Updated: October 2026</span>
          <span className="font-semibold text-slate-700">ShopNest Compliance Team</span>
        </div>
      </div>
    </div>
  );
};
