import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, Zap, Compass, CheckCircle } from 'lucide-react';

export const WhyShopNest: React.FC = () => {
  const points = [
    {
      icon: <Sparkles className="w-6 h-6 text-pink-600" />,
      title: '100% Curated Finds',
      description: 'We manually review viral trends and real customer feedback so you only get products with proven quality.',
    },
    {
      icon: <Zap className="w-6 h-6 text-rose-600" />,
      title: 'Direct Manufacturer Deals',
      description: 'Discover manufacturer and wholesaler rates directly on Meesho, Amazon, and Flipkart without unnecessary retail markups.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: 'Genuine Verified Links',
      description: 'Every product link is vetted for safety. Complete buyer protection, Cash on Delivery (COD), and return guarantees from partner stores.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-pink-600" />,
      title: 'Instagram & Pinterest Viral',
      description: 'Never wonder where that influencer outfit came from. We source the exact product codes shared on @meeshodeals825.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-b from-pink-50/60 to-white border border-pink-100 rounded-3xl p-6 sm:p-10 lg:p-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
            Smart Shopping Redefined
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Why Millions Discover on ShopNest?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            We solve the endless scrolling problem by surfacing only the highest-rated ethnic wear and trending finds at unbeatable prices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((p, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="p-3 bg-pink-50 rounded-2xl w-fit mb-4">
                  {p.icon}
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {p.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-pink-600 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>ShopNest Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
