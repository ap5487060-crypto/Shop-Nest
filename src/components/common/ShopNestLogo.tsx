import React from 'react';
import { useStore } from '../../context/StoreContext';

interface ShopNestLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'full' | 'emblem' | 'wordmark';
}

export const ShopNestLogo: React.FC<ShopNestLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  variant = 'full',
}) => {
  let contextLogo = '';
  try {
    const store = useStore();
    contextLogo = store?.customLogoUrl || '';
  } catch {
    // If rendered outside StoreProvider
  }

  const [customLogo, setCustomLogo] = React.useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('shopnest_custom_logo') : null;
  });

  React.useEffect(() => {
    const handleLogoUpdate = () => {
      setCustomLogo(localStorage.getItem('shopnest_custom_logo'));
    };
    window.addEventListener('shopnest_logo_changed', handleLogoUpdate);
    window.addEventListener('storage', handleLogoUpdate);
    return () => {
      window.removeEventListener('shopnest_logo_changed', handleLogoUpdate);
      window.removeEventListener('storage', handleLogoUpdate);
    };
  }, []);

  const activeLogo = contextLogo || customLogo;

  const sizeMap = {
    sm: { emblem: 'w-8 h-8', text: 'text-lg', cart: 'w-4 h-4', sub: 'text-[9px]' },
    md: { emblem: 'w-11 h-11', text: 'text-2xl', cart: 'w-5 h-5', sub: 'text-[11px]' },
    lg: { emblem: 'w-16 h-16', text: 'text-3xl', cart: 'w-6 h-6', sub: 'text-xs' },
    xl: { emblem: 'w-24 h-24', text: 'text-5xl', cart: 'w-8 h-8', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  if (activeLogo) {
    if (variant === 'emblem') {
      return (
        <div className={`inline-flex items-center ${className}`}>
          <img
            src={activeLogo}
            alt="ShopNest"
            className={`${currentSize.emblem} rounded-full object-cover shadow-xs border-2 border-pink-300 flex-shrink-0`}
          />
        </div>
      );
    }

    return (
      <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
        <img
          src={activeLogo}
          alt="ShopNest DP"
          className={`${currentSize.emblem} rounded-full object-cover shadow-xs border-2 border-pink-300 flex-shrink-0 group-hover:scale-105 transition-transform`}
        />
        <div className="flex flex-col justify-center leading-none">
          <div className={`font-extrabold tracking-tight ${currentSize.text} flex items-center`}>
            <span className="text-slate-900 font-extrabold tracking-tight">Shop</span>
            <span className="text-pink-600 font-extrabold tracking-tight drop-shadow-sm ml-0.5 relative">
              Nest
              <span className="absolute -top-1 -right-2 text-[10px] text-pink-500 animate-pulse">✦</span>
            </span>
          </div>
          
          {/* Cute Speed Cart Baseline */}
          <div className="flex items-center gap-1.5 mt-0.5 text-pink-500">
            <div className="w-4 h-[1.5px] bg-pink-400 rounded-full" />
            <svg className={currentSize.cart} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1.5" />
              <circle cx="19" cy="21" r="1.5" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.1" />
            </svg>
            <div className="w-4 h-[1.5px] bg-pink-400 rounded-full" />
          </div>

          {showTagline && (
            <span className={`text-slate-500 font-medium tracking-wide mt-1 uppercase ${currentSize.sub}`}>
              Discover Fashion You'll Love
            </span>
          )}
        </div>
      </div>
    );
  }

  // Vector emblem inspired by the uploaded ShopNest brand design
  const emblemSvg = (
    <div className={`relative ${currentSize.emblem} rounded-full p-[2px] bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-400 shadow-md shadow-pink-500/20 flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
      <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-0.5 relative overflow-hidden">
        {/* Soft pink gradient background inside circle */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50/70 via-rose-50/40 to-pink-100/80" />
        
        {/* Shopping bag & heart motifs */}
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle decorative heart */}
          <path
            d="M22 28 C22 23 26 20 30 23 C34 20 38 23 38 28 C38 34 30 40 30 40 C30 40 22 34 22 28 Z"
            fill="#F43F5E"
            opacity="0.85"
          />
          <path
            d="M78 32 C78 28 81 25 84 27 C87 25 90 28 90 32 C90 36 84 41 84 41 C84 41 78 36 78 32 Z"
            fill="#FB7185"
            opacity="0.9"
          />
          
          {/* Main shopping bag left */}
          <rect x="22" y="38" width="28" height="34" rx="4" fill="#EC4899" />
          <path d="M29 38 V31 C29 27 43 27 43 31 V38" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          {/* Mini cart icon on bag */}
          <path d="M30 50 H42 L40 60 H32 Z" fill="white" opacity="0.9" />

          {/* Main shopping bag right */}
          <rect x="50" y="44" width="26" height="30" rx="3.5" fill="#F43F5E" />
          <path d="M57 44 V37 C57 33 69 33 69 37 V44" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
          {/* Heart on right bag */}
          <path d="M60 55 C60 52 63 50 65 52 C67 50 70 52 70 55 C70 59 65 62 65 62 C65 62 60 59 60 55 Z" fill="white" />

          {/* Central stylized avatar head silhouette with subtle blush */}
          <circle cx="50" cy="30" r="12" fill="#FDE047" opacity="0.2" />
          <path
            d="M44 26 C44 20 56 20 56 26 C56 31 52 35 50 35 C48 35 44 31 44 26 Z"
            fill="#BE185D"
            opacity="0.95"
          />
          
          {/* Golden/pink sparkle accent */}
          <polygon points="76,18 78,23 83,25 78,27 76,32 74,27 69,25 74,23" fill="#FB7185" />
          
          {/* Base speed line with mini cart */}
          <line x1="20" y1="84" x2="38" y2="84" stroke="#DB2777" strokeWidth="2" strokeLinecap="round" />
          <line x1="62" y1="84" x2="80" y2="84" stroke="#DB2777" strokeWidth="2" strokeLinecap="round" />
          <rect x="42" y="80" width="16" height="8" rx="2" fill="#DB2777" />
          <circle cx="45" cy="90" r="2" fill="#DB2777" />
          <circle cx="55" cy="90" r="2" fill="#DB2777" />
        </svg>
      </div>
    </div>
  );

  if (variant === 'emblem') {
    return <div className={`inline-flex items-center ${className}`}>{emblemSvg}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {emblemSvg}
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-extrabold tracking-tight ${currentSize.text} flex items-center`}>
          <span className="text-slate-900 font-extrabold tracking-tight">Shop</span>
          <span className="text-pink-600 font-extrabold tracking-tight drop-shadow-sm ml-0.5 relative">
            Nest
            <span className="absolute -top-1 -right-2 text-[10px] text-pink-500 animate-pulse">✦</span>
          </span>
        </div>
        
        {/* Cute Speed Cart Baseline */}
        <div className="flex items-center gap-1.5 mt-0.5 text-pink-500">
          <div className="w-4 h-[1.5px] bg-pink-400 rounded-full" />
          <svg className={currentSize.cart} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1.5" />
            <circle cx="19" cy="21" r="1.5" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.1" />
          </svg>
          <div className="w-4 h-[1.5px] bg-pink-400 rounded-full" />
        </div>

        {showTagline && (
          <span className={`text-slate-500 font-medium tracking-wide mt-1 uppercase ${currentSize.sub}`}>
            Discover Fashion You'll Love
          </span>
        )}
      </div>
    </div>
  );
};
