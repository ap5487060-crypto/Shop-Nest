import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight, Zap, Sparkles } from 'lucide-react';

interface DealsBannerProps {
  onNavigateDeals: (maxPrice?: number) => void;
}

export const DealsBanner: React.FC<DealsBannerProps> = ({ onNavigateDeals }) => {
  // 24-hour countdown simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format2 = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
      <div className="relative rounded-3xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 p-6 sm:p-8 text-white shadow-xl overflow-hidden">
        
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-pink-900/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
              <span>Today's Mega Loot Drop</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Trending Kurtis & Viral Loot Deals
            </h3>

            <p className="text-xs sm:text-sm text-pink-100 leading-relaxed">
              Curated viral pieces with top customer reviews. Verified direct discounts on Meesho & Amazon before stock runs out!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Countdown timer */}
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md p-2 px-3 rounded-2xl border border-white/20">
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="text-[10px] uppercase font-bold text-slate-300 mr-1">Ends in:</span>
              <div className="flex items-center gap-1 text-sm font-black font-mono">
                <span className="bg-black/50 px-2 py-0.5 rounded-md text-white">{format2(timeLeft.hours)}</span>
                <span>:</span>
                <span className="bg-black/50 px-2 py-0.5 rounded-md text-white">{format2(timeLeft.minutes)}</span>
                <span>:</span>
                <span className="bg-black/50 px-2 py-0.5 rounded-md text-white">{format2(timeLeft.seconds)}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => onNavigateDeals()}
              className="bg-white text-pink-700 hover:bg-pink-50 font-extrabold text-xs sm:text-sm py-3 px-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap"
            >
              <span>Explore Top Deals</span>
              <ArrowRight className="w-4 h-4 text-pink-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
