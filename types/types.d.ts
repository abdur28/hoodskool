import { Timestamp } from 'firebase/firestore';

// ============ USER TYPES ============

export type UserRole = 'user' | 'admin';
export type SignInMethod = 'email' | 'google';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  
  // Role
  role: UserRole;
  
  // Sign-in method
  signInMethod: SignInMethod;
  
  // Additional fields
  emailVerified: boolean;
  
  // Optional address
  address?: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  preferences?: UserPreferences;
  
  // Relations (stored as arrays of IDs)
  orders: string[];
  wishlistItems: string[];
  
  // Preferences
  emailOptIn?: boolean;

  status?: 'active' | 'inactive';
  
  // Timestamps
  createdAt: any;
  updatedAt: any;
}

export interface EmailNotifications {
  orderUpdates: boolean;
  promotions: boolean;
  newArrivals: boolean;
  wishlistAlerts: boolean;
  newsletter: boolean;
}

export interface UserPreferences {
  emailNotifications: EmailNotifications;
  currency: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============ PRODUCT TYPES ============

export interface ProductImage {
  id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  altText: string;
  order: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  sku: string;
  price?: number;
  stockCount: number;
  inStock: boolean;
  imagePublicIds?: string[];
  weight?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  
  price: number;
  compareAtPrice?: number;
  discountPercent?: number;
  
  itemType?: string;
  categoryPath: string;
  collectionSlug?: string;
  
  images: ProductImage[];
  variants?: ProductVariant[];
  
  sku: string;
  inStock: boolean;
  totalStock: number;
  lowStockAlert?: number;
  
  tags: string[];
  colors: string[];
  sizes: string[];
  materials?: string[];
  
  details?: {
    [key: string]: string | number | boolean;
  };
  
  isNew?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isLimitedEdition?: boolean;
  
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  
  careInstructions?: string;
  sizeGuide?: string;
  
  viewCount?: number;
  salesCount?: number;
  
  createdAt: any;
  updatedAt: any;
  publishedAt?: any;
}

export  interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: any;
  updatedAt: any;
  subCategories?: Category[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  bannerImage?: BannerImage;
  createdAt: any;
  updatedAt: any;
}

export interface BannerImage {
  id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  altText: string;
}


// ============ CART TYPES ============

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  
  size?: string;
  color?: string;
  sku: string;
  
  inStock: boolean;
  maxQuantity: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

// ============ ORDER TYPES ============

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

export type DeliveryType = 'inStore' | 'delivery';

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  
  deliveryType: DeliveryType;
  
  items: OrderItem[];
  
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  
  shippingAddress?: Address;
  
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  paymentMethod?: string;
  paymentIntentId?: string;
  
  trackingNumber?: string;
  carrier?: string;
  
  customerNotes?: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  paidAt?: Timestamp;
  shippedAt?: Timestamp;
  deliveredAt?: Timestamp;
  pickedUpAt?: Timestamp;
}

// ============ WISHLIST TYPES ============

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: Timestamp;
}

// ============ FILTER & QUERY TYPES ============

export interface ProductFilters {
  category?: string;
  subCategory?: string;
  itemType?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  inStock?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  search?: string;
}

export interface PaginationParams {
  limit?: number;
  startAfter?: any;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// ============ CLOUDINARY TYPES ============

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
}