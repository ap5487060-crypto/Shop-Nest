import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-50 rounded-2xl text-pink-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-500">Effective Date: October 2026</p>
          </div>
        </div>

        <p>
          Welcome to ShopNest ("we", "our", or "us"). We value your privacy and are committed to protecting your personal information. This Privacy Policy describes how we collect, store, and process data when you visit ShopNest.
        </p>

        <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
        <p>
          We collect basic information you provide directly, such as when you create an account (name and email), save products to your wishlist, or submit inquiries via our contact form. We also collect anonymous aggregate analytics (such as browser type, referring pages, and clicked affiliate product URLs) to improve our catalog discovery.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. Affiliate Tracking & Cookies</h2>
        <p>
          When you click on outbound partner shopping links (such as Meesho, Amazon, or Flipkart), partner tracking tags and cookies may be utilized by those third parties to track referrals and verify legitimate purchases. These cookies are subject to the privacy policies of the respective merchants.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Data Security & Storage</h2>
        <p>
          We store data securely using industry-standard cloud encryption with Google Firebase services. We do not sell or trade your personal information to third parties for marketing purposes.
        </p>

        <h2 className="text-base font-bold text-slate-900">4. Contact Information</h2>
        <p>
          If you have questions about your privacy rights or wish to delete your account, reach out to us at <strong>privacy@shopnest.in</strong>.
        </p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-50 rounded-2xl text-pink-600">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Terms of Service</h1>
            <p className="text-xs text-slate-500">Effective Date: October 2026</p>
          </div>
        </div>

        <p>
          By accessing and browsing ShopNest, you agree to comply with and be bound by these Terms of Service.
        </p>

        <h2 className="text-base font-bold text-slate-900">1. Product Information & Pricing</h2>
        <p>
          ShopNest strives to provide accurate product specifications, pricing, and discount details. However, product prices, stock availability, and promotional coupons on partner platforms (Meesho, Amazon, Flipkart) are managed by third-party sellers and can fluctuate. The price displayed on the partner merchant website at checkout is the final binding price.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. External Links & Merchant Purchases</h2>
        <p>
          Transactions conducted on partner stores are governed solely by those partner merchants' terms, refund rules, and shipping guidelines. ShopNest is not liable for merchant disputes, delivery delays, or inventory discrepancies.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Intellectual Property</h2>
        <p>
          The ShopNest brand name, circular logo badge, and proprietary website layout are protected intellectual property. Third-party brand names and logos belong to their respective proprietors.
        </p>
      </div>
    </div>
  );
};
