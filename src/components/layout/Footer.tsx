import React from 'react';
import { 
  Instagram, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Mail, 
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { ShopNestLogo } from '../common/ShopNestLogo';
import { useStore } from '../../context/StoreContext';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { categories, setFilters } = useStore();
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Affiliate Disclosure Banner */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-pink-500/10 text-pink-400 rounded-xl mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Official Affiliate Disclosure & Buyer Trust
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 max-w-3xl leading-relaxed">
                Some links on ShopNest may be affiliate links. If you make a purchase through these links, we may earn an affiliate commission at no additional cost to you. We curate genuine bestsellers and deals from trusted partner platforms like Meesho, Amazon, and Flipkart.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('affiliate-disclosure')}
            className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1 shrink-0 underline underline-offset-4"
          >
            Read Full Disclosure <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-column footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand & Social */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-3 rounded-2xl inline-block shadow-sm">
              <ShopNestLogo size="md" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              ShopNest is India's premier fashion discovery and smart deals platform. We bring you handpicked women's kurtis, designer ethnic wear, and viral social media finds directly from trusted marketplace partners.
            </p>

            {/* Social channels */}
            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Join Our Fashion Communities
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://instagram.com/meeshodeals825"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-pink-950/40 border border-pink-500/30 text-pink-300 hover:bg-pink-900/50 hover:text-white transition-all text-xs font-medium"
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>@meeshodeals825</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <a
                  href="https://in.pinterest.com/shopnest825/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/50 hover:text-white transition-all text-xs font-medium"
                >
                  <span className="font-bold text-xs bg-rose-600 text-white rounded-full w-4 h-4 flex items-center justify-center">P</span>
                  <span>Pinterest: @shopnest825</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, categoryId: 'womens-fashion', subcategoryId: 'kurtis' }));
                    onNavigate('catalog');
                  }}
                  className="hover:text-pink-400 text-pink-300 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-pink-400" /> Kurtis & Kurti Sets
                </button>
              </li>
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, categoryId: cat.id, subcategoryId: undefined }));
                      onNavigate('catalog');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, dealsOnly: true }));
                    onNavigate('catalog');
                  }}
                  className="hover:text-amber-400 text-amber-300 transition-colors"
                >
                  ⚡ Today's Flash Deals
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Company Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Trust & Information
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About ShopNest
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('affiliate-disclosure')} className="hover:text-white transition-colors">
                  Affiliate Disclosure
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact Us & Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Deals alert */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Stay in the Loop
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Receive notifications whenever a viral kurti or mega loot deal goes live!
            </p>
            {subscribed ? (
              <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 p-2.5 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You're subscribed to ShopNest alerts!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 pl-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-xs"
                >
                  Get Deals Alerts
                </button>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center gap-1">
              <span>Partner Stores:</span>
              <span className="text-slate-400 font-medium">Meesho • Amazon • Flipkart</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Developer Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} ShopNest. All rights reserved.{' '}
            <button
              onClick={() => onNavigate('admin')}
              className="text-slate-700 hover:text-slate-500 transition-colors inline-block ml-1"
              title="Store Owner Portal"
              aria-label="Owner Login"
            >
              •
            </button>
          </p>

          {/* Dev Credit: Abhishek Prajapati */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300 font-medium bg-slate-800/90 px-4 py-2 rounded-2xl border border-pink-500/30 shadow-xs">
            <span className="text-slate-400">Developed with ❤️ by</span>
            <span className="text-white font-black tracking-wide text-sm bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Abhishek Prajapati
            </span>
            <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2.5 py-0.5 rounded-full font-extrabold border border-pink-500/30">
              Dev
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
