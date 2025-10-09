import { UserProfile, Order, Category } from './types';

// ============ ADMIN STORE TYPES ============

export interface AdminLoadingState {
  users: boolean;
  orders: boolean;
  products: boolean;
  categories: boolean;
  analytics: boolean;
  adminAction: boolean;
}

export interface AdminErrorState {
  users: string | null;
  orders: string | null;
  products: string | null;
  categories: string | null;
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

// ============ ADMIN STORE ============

export interface AdminStore extends AdminUserDataStore, AdminCategoryDataStore {
  // Global methods
  resetErrors: () => void;
}