import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      setInstalled(true);
      return;
    }

    // Check if user previously dismissed in this session
    const dismissed = sessionStorage.getItem('shopnest_pwa_dismissed');
    if (dismissed) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    // Also register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Safe fallback
      });
    }

    // On iOS Safari, show prompt after 4 seconds
    let iosTimer: any;
    if (isIosDevice && !isStandalone) {
      iosTimer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        alert("iOS par install karne ke liye: Niche Safari me Share button (⬆) dabayein aur 'Add to Home Screen' select karein!");
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
        setShowPrompt(false);
      }
    } catch {
      // Safe fallback
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('shopnest_pwa_dismissed', 'true');
  };

  if (!showPrompt || installed) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-4 rounded-3xl shadow-2xl border border-pink-500/40 flex items-center justify-between gap-3">
        
        {/* App Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 p-0.5 shrink-0 flex items-center justify-center shadow-md shadow-pink-500/30">
          <div className="w-full h-full rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-extrabold text-xs sm:text-sm text-white truncate">
              Install ShopNest App
            </h4>
            <span className="text-[9px] bg-pink-500/30 text-pink-300 px-1.5 py-0.2 rounded-full font-bold">
              Fast
            </span>
          </div>
          <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
            {isIOS ? 'Safari Share (⬆) -> Add to Home Screen' : 'Phone me App ki tarah save karein (No Play Store)'}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-extrabold text-xs py-2 px-3.5 rounded-xl shadow-md shadow-pink-500/20 flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
