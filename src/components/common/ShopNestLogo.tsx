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
    return typeof window !== 'undefined'
      ? (localStorage.getItem('shopnest_custom_logo') || '/shopnest-logo.jpg')
      : '/shopnest-logo.jpg';
  });

  React.useEffect(() => {
    const handleLogoUpdate = () => {
      setCustomLogo(localStorage.getItem('shopnest_custom_logo') || '/shopnest-logo.jpg');
    };
    window.addEventListener('shopnest_logo_changed', handleLogoUpdate);
    window.addEventListener('storage', handleLogoUpdate);
    return () => {
      window.removeEventListener('shopnest_logo_changed', handleLogoUpdate);
      window.removeEventListener('storage', handleLogoUpdate);
    };
  }, []);

  const [imgLoadError, setImgLoadError] = React.useState(false);
  const activeLogo = contextLogo || customLogo || '/shopnest-logo.jpg';

  const sizeMap = {
    sm: { emblem: 'w-8 h-8', text: 'text-lg', cart: 'w-4 h-4', sub: 'text-[9px]' },
    md: { emblem: 'w-11 h-11', text: 'text-2xl', cart: 'w-5 h-5', sub: 'text-[11px]' },
    lg: { emblem: 'w-16 h-16', text: 'text-3xl', cart: 'w-6 h-6', sub: 'text-xs' },
    xl: { emblem: 'w-24 h-24', text: 'text-5xl', cart: 'w-8 h-8', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // The permanent logo image uploaded by the user
  const effectiveSrc = imgLoadError ? '/shopnest-logo.jpeg' : (activeLogo || '/shopnest-logo.jpg');

  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src={effectiveSrc}
          alt="ShopNest"
          onError={() => setImgLoadError(true)}
          className={`${currentSize.emblem} rounded-xl object-contain p-0.5 bg-white border border-pink-200/90 shadow-xs flex-shrink-0`}
        />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <div className={`font-extrabold tracking-tight ${currentSize.text} flex items-center`}>
          <span className="text-slate-900 font-extrabold tracking-tight">Shop</span>
          <span className="text-pink-600 font-extrabold tracking-tight drop-shadow-sm ml-0.5 relative">
            Nest
            <span className="absolute -top-1 -right-2 text-[10px] text-pink-500 animate-pulse">✦</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <img
        src={effectiveSrc}
        alt="ShopNest Logo"
        onError={() => setImgLoadError(true)}
        className={`${currentSize.emblem} rounded-xl object-contain p-0.5 bg-white border border-pink-200/90 shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform`}
      />
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-extrabold tracking-tight ${currentSize.text} flex items-center`}>
          <span className="text-slate-900 font-extrabold tracking-tight">Shop</span>
          <span className="text-pink-600 font-extrabold tracking-tight drop-shadow-sm ml-0.5 relative">
            Nest
            <span className="absolute -top-1 -right-2 text-[10px] text-pink-500 animate-pulse">✦</span>
          </span>
        </div>
        
        {/* Speed Cart Baseline */}
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
