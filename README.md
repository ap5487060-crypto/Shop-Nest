# ShopNest — Premier Shopping Discovery & Affiliate Commerce Platform

ShopNest is a modern, scalable shopping discovery and affiliate-commerce platform tailored for Indian online shoppers. It focuses on women's fashion, authentic Lucknowi chikankari kurtis, designer festive suits, and viral lifestyle products curated directly from trusted marketplace partners like **Meesho**, **Amazon**, and **Flipkart**.

---

## 🌸 Brand Identity & Social Channels

- **Brand Name**: ShopNest
- **Primary Brand Theme**: Vibrant ShopNest Pink (`#EC4899`, `#DB2777`), Clean White, and Dark Slate Charcoal typography
- **Official Instagram**: [@meeshodeals825](https://instagram.com/meeshodeals825)
- **Official Pinterest**: [@shopnest825](https://in.pinterest.com/shopnest825/)

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with custom brand tokens and Plus Jakarta Sans typography
- **Authentication**: Firebase Auth (Email/Password, Anonymous/Guest, Profile Sync)
- **Database**: Google Firebase Firestore with local cache resilience (IndexedDB/LocalStorage)
- **Affiliate Engine**: Centralized safe URL validator, click tracker, and device/UTM attribution
- **Icons & Polish**: Lucide React + Canvas Confetti

---

## ⚡ Connected Firebase Configuration

Your Firebase Project is registered and connected:
```typescript
{
  apiKey: "AIzaSyCyOaNTOLW9ik50oq8Lzk0dcVLrL01X_W0",
  authDomain: "shop-nest-c1185.firebaseapp.com",
  projectId: "shop-nest-c1185",
  storageBucket: "shop-nest-c1185.firebasestorage.app",
  messagingSenderId: "814766287917",
  appId: "1:814766287917:web:861b6052ffb1be95779ca4",
  measurementId: "G-Q3PP42Q9RJ"
}
```

### Steps to finalize in your Firebase Console:
1. **Enable Authentication**:
   - Go to [Firebase Console](https://console.firebase.google.com) → Authentication → Sign-in method.
   - Turn on **Email/Password** and **Anonymous**.
2. **Enable Firestore Database**:
   - Go to Firestore Database → Create Database in Production or Test mode.
   - In Rules tab, set:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if true;
         }
       }
     }
     ```
3. *Note*: ShopNest has built-in local cache fallback, so all browsing, products, wishlist, clicks, and admin functions run smoothly even before your console rules are published!

---

## 🛡️ Admin Portal & Founder Access

- Route: Click the **Admin** lock button in the header or bottom navigation.
- **Admin Passcode**: `Abhishek@8957` (also supports `shopnest2026`)
- **Founder Email**: `ap547060@gmail.com`
- **One-Click Founder Login**: Available directly on the Auth modal for instant access.

### Admin Features:
- **Product Management**: Add, edit, duplicate, delete products with custom image URLs and price calculations.
- **CSV Bulk Import & Export**: One-click import and export of product inventories.
- **Categories & Banners**: Manage promotional hero banners and category shortcuts.
- **Affiliate Analytics**: Live click logs showing timestamp, product, platform, device, and UTM source.
- **Customer Inquiries Inbox**: Review and resolve submissions from the Contact Us form.

---

## 🛒 Scalable Commerce Mode Transition

ShopNest supports two modes:
- `VITE_COMMERCE_MODE="affiliate"` *(Current)*: Shoppers browse curated items and click "Shop Now" to be safely directed to partner stores (Meesho, Amazon, Flipkart).
- `VITE_COMMERCE_MODE="own_store"` *(Future)*: Full cart, address management, and Razorpay payment checkout without rebuilding the platform.
