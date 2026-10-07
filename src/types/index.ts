export type CommerceMode = 'affiliate' | 'own_store';

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'customer';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type ProductStatus = 'published' | 'draft' | 'archived';

export type AffiliatePlatform = 'Meesho' | 'Amazon' | 'Flipkart' | 'Myntra' | 'Ajio' | 'Shopsy' | 'EarnKaro' | 'Other' | (string & {});

export interface AffiliateLinkOption {
  platform: AffiliatePlatform;
  url: string;
  price?: number;
  label?: string;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  category_id: string;
  subcategory_id: string;
  brand?: string;
  price?: number;
  original_price?: number;
  discount_percentage?: number;
  currency?: string;
  images: string[];
  thumbnail: string;
  affiliate_url: string;
  affiliate_platform: AffiliatePlatform;
  affiliate_product_id?: string;
  alternate_affiliate_links?: AffiliateLinkOption[];
  sku?: string;
  tags: string[];
  keywords: string[];
  rating: number;
  review_count: number;
  availability: boolean;
  stock_status: StockStatus;
  featured: boolean;
  trending: boolean;
  new_arrival: boolean;
  best_seller: boolean;
  deal: boolean;
  status: ProductStatus;
  price_prefix?: string;
  price_note?: string;
  price_verified_at?: string;
  price_reported_diff?: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  image_alt_text?: string;
  specifications?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  banner_image?: string;
  order: number;
  is_active: boolean;
  seo_title?: string;
  seo_description?: string;
  subcategories: Subcategory[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  image: string;
  cta_text: string;
  cta_url: string;
  start_date?: string;
  end_date?: string;
  active: boolean;
  priority: number;
  text_color?: 'dark' | 'light';
}

export interface AffiliateClick {
  id: string;
  product_id: string;
  product_name: string;
  user_id?: string;
  session_id: string;
  affiliate_platform: AffiliatePlatform;
  affiliate_url: string;
  timestamp: string;
  referrer: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  page_url: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  phoneNumber?: string | null;
  role: UserRole;
  createdAt: string;
  lastLoginAt: string;
}

export interface FilterOptions {
  searchQuery?: string;
  categoryId?: string;
  subcategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  brand?: string;
  platform?: AffiliatePlatform | 'All';
  rating?: number;
  featuredOnly?: boolean;
  trendingOnly?: boolean;
  dealsOnly?: boolean;
  sortBy: 'relevance' | 'newest' | 'rating_desc' | 'trending';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'resolved';
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  entityType: 'product' | 'category' | 'banner' | 'settings';
  entityId: string;
  timestamp: string;
  details?: string;
}
