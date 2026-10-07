import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Flame } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HeroCarouselProps {
  onNavigateCatalog: (categorySlug?: string, subSlug?: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onNavigateCatalog }) => {
  const { banners } = useStore();
  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-6">
      <div className="relative h-[320px] sm:h-[400px] md:h-[460px] rounded-3xl overflow-hidden shadow-xl border border-pink-100 bg-slate-900 group">
        
        {/* Banner background image */}
        <div className="absolute inset-0">
          <img
            src={currentBanner.image}
            alt={currentBanner.title}
            className="w-full h-full object-cover object-center transition-all duration-700 transform scale-105"
          />
          {/* Subtle gradient overlay for high text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent md:hidden" />
        </div>

        {/* Banner Content */}
        <div className="relative h-full flex flex-col justify-center max-w-xl p-6 sm:p-10 md:p-14 z-10 text-white">
          {currentBanner.badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/30 border border-pink-400/40 backdrop-blur-md text-pink-200 text-xs font-bold w-fit mb-3 animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span>{currentBanner.badge}</span>
            </div>
          )}

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight sm:leading-none text-white drop-shadow-sm font-sans">
            {currentBanner.title}
          </h2>

          <p className="mt-3 text-xs sm:text-base text-slate-200 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow-xs max-w-md">
            {currentBanner.subtitle}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => onNavigateCatalog('womens-fashion', 'kurtis')}
              className="bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 hover:from-pink-500 hover:to-rose-400 text-white font-extrabold text-xs sm:text-sm py-3 px-6 rounded-2xl shadow-lg shadow-pink-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>{currentBanner.cta_text || 'Explore Trending Kurtis'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateCatalog(undefined, undefined)}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors hidden sm:flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              All Deals
            </button>
          </div>
        </div>

        {/* Carousel controls */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20"
              aria-label="Previous banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20"
              aria-label="Next banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === idx ? 'w-6 bg-pink-500' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
