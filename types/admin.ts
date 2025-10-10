import { UserProfile, Order, Product, ProductImage, ProductVariant, Collection, BannerImage, Category } from './types';

// ============ ADMIN STORE TYPES ============

export interface AdminLoadingState {
  users: boolean;
  orders: boolean;
  products: boolean;
  categories: boolean;
  collections: boolean;
  analytics: boolean;
  adminAction: boolean;
}

export interface AdminErrorState {
  users: string | null;
  orders: string | null;
  products: string | null;
  categories: string | null;
  collections: string | null;
  analytics: string | null;
  adminAction: string | null;
}

export interface PaginationState {
  lastDoc: any;
  hasMore: boolean;
}

export interface AdminPaginationState {
  users: PaginationState;
  orders: PaginationState;
  products: PaginationState;
  categories: PaginationState;
  collections: PaginationState;
}

// ============ FETCH OPTIONS ============

export interface FilterOption {
  field: string;
  operator: any; // Firestore operators
  value: any;
}

export interface FetchOptions {
  limit?: number;
  startAfter?: any;
  filters?: FilterOption[];
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
}

// ============ ADMIN USER DATA STORE ============

export interface AdminUserDataStore {
  // State
  users: UserProfile[];
  
  // Loading & Error states
  loading: AdminLoadingState;
  error: AdminErrorState;
  pagination: AdminPaginationState;
  
  // Methods
  fetchUsers: (options?: FetchOptions) => Promise<void>;
  getUserById: (userId: string) => Promise<UserProfile | null>;
  updateUser: (userId: string, data: Partial<UserProfile>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  toggleUserStatus: (userId: string, status: 'active' | 'inactive') => Promise<void>;
  assignUserRole: (userId: string, role: 'user' | 'admin') => Promise<void>;
  resetUsers: () => void;
}

// ============ ADMIN CATEGORY DATA STORE ============

export interface AdminCategoryDataStore {
  // State
  categories: Category[];
  
  // Loading & Error states
  loading: AdminLoadingState;
  error: AdminErrorState;
  pagination: AdminPaginationState;
  
  // Methods
  fetchCategories: (options?: FetchOptions) => Promise<void>;
  getCategoryById: (categoryId: string) => Promise<Category | null>;
  createCategory: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>, parentId?: string) => Promise<string>;
  updateCategory: (categoryId: string, data: Partial<Category>, parentId?: string) => Promise<void>;
  deleteCategory: (categoryId: string, parentId?: string) => Promise<void>;
  resetCategories: () => void;
}

// ============ ADMIN COLLECTION DATA STORE ============

export interface AdminCollectionDataStore {
  // State
  collections: Collection[];
  
  // Loading & Error states
  loading: AdminLoadingState;
  error: AdminErrorState;
  pagination: AdminPaginationState;
  
  // Methods
  fetchCollections: (options?: FetchOptions) => Promise<void>;
  getCollectionById: (collectionId: string) => Promise<Collection | null>;
  createCollection: (data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateCollection: (collectionId: string, data: Partial<Collection>) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;
  uploadBannerImage: (file: File) => Promise<BannerImage>;
  deleteBannerImage: (publicId: string) => Promise<void>;
  resetCollections: () => void;
}

// ============ ADMIN PRODUCT DATA STORE ============

export interface AdminProductDataStore {
  // State
  products: Product[];
  
  // Loading & Error states
  loading: AdminLoadingState;
  error: AdminErrorState;
  pagination: AdminPaginationState;
  
  // Methods
  fetchProducts: (options?: FetchOptions) => Promise<void>;
  getProductById: (productId: string) => Promise<Product | null>;
  createProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProduct: (productId: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  uploadProductImages: (files: File[]) => Promise<ProductImage[]>;
  deleteProductImage: (publicId: string) => Promise<void>;
  resetProducts: () => void;
}

// ============ ADMIN ANALYTICS ============

export interface AdminAnalytics {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  
  newUsersThisMonth: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  
  averageOrderValue: number;
  conversionRate: number;
  
  topProducts: Array<{
    productId: string;
    name: string;
    salesCount: number;
    revenue: number;
  }>;
  
  recentOrders: Order[];
}

// Add these types to your existing types/admin.ts file

// ============ ADMIN MAILER TYPES ============

export interface EmailRecipient {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  preferences?: {
    emailNotifications?: {
      promotions?: boolean;
      newArrivals?: boolean;
      newsletter?: boolean;
    };
  };
  createdAt: string;
}

export interface EmailCampaign {
  id: string;
  type: 'promotion' | 'new_arrivals' | 'newsletter' | 'custom';
  subject: string;
  recipients: string[]; // User IDs or emails
  recipientCount: number;
  successCount: number;
  failedCount: number;
  status: 'draft' | 'sending' | 'sent' | 'failed';
  content?: string;
  promoData?: {
    title: string;
    description: string;
    discountCode?: string;
    discountPercent?: number;
    expiryDate?: string;
  };
  newsletterData?: {
    headline: string;
    content: string;
    imageUrl?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
  createdAt: string;
  sentAt?: string;
}

export interface EmailStats {
  totalUsers: number;
  totalOptedIn: number;
  promotionsOptedIn: number;
  newArrivalsOptedIn: number;
  newsletterOptedIn: number;
  totalCampaigns: number;
  campaignsThisMonth: number;
  emailsSentTotal: number;
  emailsSentThisMonth: number;
}

// ============ ADMIN MAILER DATA STORE ============

export interface AdminMailerDataStore {
  // State
  emailRecipients: EmailRecipient[];
  emailCampaigns: EmailCampaign[];
  emailStats: EmailStats | null;
  
  // Loading & Error states
  loading: AdminLoadingState;
  error: AdminErrorState;
  
  // Methods
  fetchEmailRecipients: (emailType?: 'promotions' | 'newArrivals' | 'newsletter') => Promise<void>;
  fetchEmailCampaigns: (options?: FetchOptions) => Promise<void>;
  fetchEmailStats: () => Promise<void>;
  sendPromotionEmail: (data: {
    recipients: string[];
    promoData: {
      title: string;
      description: string;
      discountCode?: string;
      discountPercent?: number;
      expiryDate?: string;
    };
  }) => Promise<{ successCount: number; failedCount: number; results: any[] }>;
  sendNewArrivalsEmail: (data: {
    recipients: string[];
    productIds: string[];
  }) => Promise<{ successCount: number; failedCount: number; results: any[] }>;
  sendNewsletterEmail: (data: {
    recipients: string[];
    newsletterData: {
      subject: string;
      headline: string;
      content: string;
      imageUrl?: string;
      ctaText?: string;
      ctaUrl?: string;
    };
  }) => Promise<{ successCount: number; failedCount: number; results: any[] }>;
  resetMailer: () => void;
}

// Update AdminStore interface to include mailer
export interface AdminStore extends 
  AdminUserDataStore, 
  AdminCategoryDataStore, 
  AdminCollectionDataStore, 
  AdminProductDataStore,
  AdminMailerDataStore {
  // Global methods
  resetErrors: () => void;
}

// ============ ADMIN STORE ============

export interface AdminStore extends AdminUserDataStore, AdminCategoryDataStore, AdminCollectionDataStore, AdminProductDataStore {
  // Global methods
  resetErrors: () => void;
}

// Re-export types for convenience
export type { Product, ProductImage, ProductVariant, Collection, BannerImage };