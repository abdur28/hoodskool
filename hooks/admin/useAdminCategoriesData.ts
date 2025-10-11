import { create } from "zustand";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { AdminCategoryDataStore, FetchOptions } from '@/types/admin';
import { Category } from "@/types/types";

/**
 * Utility function to format Firestore timestamps
 */
const formatFirestoreTimestamp = (timestamp: any): string => {
  if (!timestamp) return '';
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp.toDate) {
    return timestamp.toDate().toISOString();
  }
  return new Date(timestamp).toISOString();
};

/**
 * Utility function to create error messages
 */
const createErrorMessage = (error: any): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
};

/**
 * Utility function to generate slug from name
 */
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Generate a unique ID for subcategories
 */
const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Recursively find a category by ID in the tree
 */
const findCategoryInTree = (categories: Category[], categoryId: string): Category | null => {
  for (const cat of categories) {
    if (cat.id === categoryId) {
      return cat;
    }
    if (cat.subCategories && cat.subCategories.length > 0) {
      const found = findCategoryInTree(cat.subCategories, categoryId);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Recursively update a subcategory in the tree
 */
const updateCategoryInTree = (
  categories: Category[], 
  categoryId: string, 
  updateFn: (cat: Category) => Category
): Category[] => {
  return categories.map(cat => {
    if (cat.id === categoryId) {
      return updateFn(cat);
    }
    if (cat.subCategories && cat.subCategories.length > 0) {
      return {
        ...cat,
        subCategories: updateCategoryInTree(cat.subCategories, categoryId, updateFn)
      };
    }
    return cat;
  });
};

/**
 * Recursively delete a subcategory from the tree
 */
const deleteCategoryFromTree = (categories: Category[], categoryId: string): Category[] => {
  return categories
    .filter(cat => cat.id !== categoryId)
    .map(cat => {
      if (cat.subCategories && cat.subCategories.length > 0) {
        return {
          ...cat,
          subCategories: deleteCategoryFromTree(cat.subCategories, categoryId)
        };
      }
      return cat;
    });
};

/**
 * Check if slug exists at the same level
 */
const slugExistsInLevel = (categories: Category[], slug: string, excludeId?: string): boolean => {
  return categories.some(cat => cat.slug === slug && cat.id !== excludeId);
};

/**
 * Admin hook for category management with unlimited nesting support
 */
const useAdminCategoriesData = create<AdminCategoryDataStore>((set, get) => ({
  // State
  categories: [],
  
  // Loading, Error, and Pagination state
  loading: {
    users: false,
    orders: false,
    products: false,
    categories: false,
    collections: false,
    analytics: false,
    adminAction: false
  },
  error: {
    users: null,
    orders: null,
    products: null,
    categories: null,
    collections: null,
    analytics: null,
    adminAction: null
  },
  pagination: {
    users: { lastDoc: null, hasMore: false },
    orders: { lastDoc: null, hasMore: false },
    products: { lastDoc: null, hasMore: false },
    categories: { lastDoc: null, hasMore: false },
    collections: { lastDoc: null, hasMore: false },
  },
  
  // Reset methods
  resetCategories: () => set({ 
    categories: [], 
    pagination: { 
      ...get().pagination, 
      categories: { lastDoc: null, hasMore: false } 
    } 
  }),
  
  /**
   * Fetch categories with optional pagination and filtering
   */
  fetchCategories: async (options: FetchOptions = {}) => {
    set(state => ({ 
      loading: { ...state.loading, categories: true },
      error: { ...state.error, categories: null } 
    }));
    
    try {
      const {
        limit: limitCount = 50,
        startAfter: startAfterDoc,
        filters = [],
        orderByField = 'createdAt',
        orderDirection = 'desc',
      } = options;
      
      // Start building the query
      let baseQuery = query(collection(db, 'categories'));
      
      // Apply filters if any
      if (filters.length > 0) {
        filters.forEach(filter => {
          baseQuery = query(baseQuery, where(filter.field, filter.operator, filter.value));
        });
      }
      
      // Apply ordering
      let orderedQuery = query(baseQuery, orderBy(orderByField, orderDirection));
      
      // Apply pagination
      let paginatedQuery;
      if (startAfterDoc || get().pagination.categories.lastDoc) {
        const lastDoc = startAfterDoc || get().pagination.categories.lastDoc;
        paginatedQuery = query(orderedQuery, startAfter(lastDoc), limit(limitCount));
      } else {
        paginatedQuery = query(orderedQuery, limit(limitCount));
      }
      
      // Execute the query
      const snapshot = await getDocs(paginatedQuery);
      
      // Extract data
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: formatFirestoreTimestamp(doc.data().createdAt),
        updatedAt: formatFirestoreTimestamp(doc.data().updatedAt),
      } as Category));
      
      // Check if there are more results
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      
      // Update state
      set(state => ({
        categories: options.startAfter ? [...state.categories, ...categories] : categories,
        loading: { ...state.loading, categories: false },
        pagination: {
          ...state.pagination,
          categories: {
            lastDoc: lastVisible,
            hasMore: snapshot.docs.length === limitCount
          }
        }
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      set(state => ({
        loading: { ...state.loading, categories: false },
        error: { ...state.error, categories: createErrorMessage(error) }
      }));
    }
  },
  
  /**
   * Get category by ID
   */
  getCategoryById: async (categoryId: string): Promise<Category | null> => {
    try {
      const categoryDoc = await getDoc(doc(db, 'categories', categoryId));
      
      if (!categoryDoc.exists()) return null;
      
      return {
        id: categoryDoc.id,
        ...categoryDoc.data(),
        createdAt: formatFirestoreTimestamp(categoryDoc.data().createdAt),
        updatedAt: formatFirestoreTimestamp(categoryDoc.data().updatedAt),
      } as Category;
    } catch (error) {
      console.error('Error getting category by ID:', error);
      set(state => ({
        error: { ...state.error, adminAction: createErrorMessage(error) }
      }));
      return null;
    }
  },
  
  /**
   * Create new category or subcategory at any level
   */
  createCategory: async (
    data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>, 
    parentId?: string
  ): Promise<string> => {
    set(state => ({ 
      loading: { ...state.loading, adminAction: true },
      error: { ...state.error, adminAction: null } 
    }));
    
    try {
      // Generate slug if not provided
      const slug = data.slug || generateSlug(data.name);
      
      if (parentId) {
        // Creating a subcategory - need to find the root document
        const currentCategories = get().categories;
        
        // Find which root category contains the parent
        let rootCategory: Category | null = null;
        let rootId: string | null = null;
        
        for (const cat of currentCategories) {
          if (cat.id === parentId) {
            // Parent is a root category
            rootCategory = cat;
            rootId = cat.id;
            break;
          } else if (cat.subCategories) {
            // Check if parent is nested somewhere in this root
            const found = findCategoryInTree([cat], parentId);
            if (found) {
              rootCategory = cat;
              rootId = cat.id;
              break;
            }
          }
        }
        
        if (!rootCategory || !rootId) {
          throw new Error('Parent category not found');
        }
        
        // Find the parent category in the tree
        const parentCategory = rootId === parentId 
          ? rootCategory 
          : findCategoryInTree([rootCategory], parentId);
        
        if (!parentCategory) {
          throw new Error('Parent category not found');
        }
        
        // Check if subcategory slug already exists at this level
        const existingSubcategories = parentCategory.subCategories || [];
        if (slugExistsInLevel(existingSubcategories, slug)) {
          throw new Error('A subcategory with this name already exists in this category');
        }
        
        // Create new subcategory
        const newSubcategory: Category = {
          id: generateId(),
          name: data.name,
          slug,
          description: data.description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          subCategories: []
        };
        
        // Update the root category with the new subcategory
        const updatedRootCategory = updateCategoryInTree(
          [rootCategory],
          parentId,
          (cat) => ({
            ...cat,
            subCategories: [...(cat.subCategories || []), newSubcategory],
            updatedAt: new Date().toISOString()
          })
        )[0];
        
        // Save to Firestore
        const rootRef = doc(db, 'categories', rootId);
        await updateDoc(rootRef, {
          ...updatedRootCategory,
          updatedAt: serverTimestamp()
        });
        
        // Update local state
        set(state => ({
          loading: { ...state.loading, adminAction: false },
          categories: state.categories.map(cat => 
            cat.id === rootId ? updatedRootCategory : cat
          )
        }));
        
        return newSubcategory.id;
      } else {
        // Creating a top-level category
        const existingQuery = query(
          collection(db, 'categories'),
          where('slug', '==', slug)
        );
        const existingDocs = await getDocs(existingQuery);
        
        if (!existingDocs.empty) {
          throw new Error('A category with this name already exists');
        }
        
        // Create the category
        const categoryData = {
          name: data.name,
          slug,
          description: data.description || '',
          subCategories: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, 'categories'), categoryData);
        
        // Add to local state
        const newCategory: Category = {
          id: docRef.id,
          name: data.name,
          slug,
          description: data.description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          subCategories: []
        };
        
        set(state => ({
          loading: { ...state.loading, adminAction: false },
          categories: [newCategory, ...state.categories]
        }));
        
        return docRef.id;
      }
    } catch (error) {
      console.error('Error creating category:', error);
      set(state => ({
        loading: { ...state.loading, adminAction: false },
        error: { ...state.error, adminAction: createErrorMessage(error) }
      }));
      throw error;
    }
  },
  
  /**
   * Update category or subcategory at any level
   */
  updateCategory: async (
    categoryId: string, 
    data: Partial<Category>,
    parentId?: string
  ) => {
    set(state => ({ 
      loading: { ...state.loading, adminAction: true },
      error: { ...state.error, adminAction: null } 
    }));
    
    try {
      // If name is being updated, regenerate slug
      if (data.name && !data.slug) {
        data.slug = generateSlug(data.name);
      }
      
      const currentCategories = get().categories;
      
      if (parentId) {
        // Updating a subcategory
        // Find which root category contains this subcategory
        let rootCategory: Category | null = null;
        let rootId: string | null = null;
        
        for (const cat of currentCategories) {
          const found = findCategoryInTree([cat], categoryId);
          if (found) {
            rootCategory = cat;
            rootId = cat.id;
            break;
          }
        }
        
        if (!rootCategory || !rootId) {
          throw new Error('Category not found');
        }
        
        // Find the parent to check for slug conflicts
        const parentCategory = findCategoryInTree([rootCategory], parentId);
        if (!parentCategory) {
          throw new Error('Parent category not found');
        }
        
        // Check if new slug conflicts with siblings
        if (data.slug) {
          const siblings = parentCategory.subCategories || [];
          if (slugExistsInLevel(siblings, data.slug, categoryId)) {
            throw new Error('A subcategory with this name already exists in this category');
          }
        }
        
        // Update the subcategory
        const updatedRootCategory = updateCategoryInTree(
          [rootCategory],
          categoryId,
          (cat) => ({
            ...cat,
            ...data,
            updatedAt: new Date().toISOString()
          })
        )[0];
        
        // Save to Firestore
        const rootRef = doc(db, 'categories', rootId);
        await updateDoc(rootRef, {
          ...updatedRootCategory,
          updatedAt: serverTimestamp()
        });
        
        // Update local state
        set(state => ({
          loading: { ...state.loading, adminAction: false },
          categories: state.categories.map(cat =>
            cat.id === rootId ? updatedRootCategory : cat
          )
        }));
      } else {
        // Updating a top-level category
        const categoryRef = doc(db, 'categories', categoryId);
        
        // Check if new slug conflicts with other top-level categories
        if (data.slug) {
          if (slugExistsInLevel(currentCategories, data.slug, categoryId)) {
            throw new Error('A category with this name already exists');
          }
        }
        
        const updatedData = {
          ...data,
          updatedAt: serverTimestamp()
        };
        
        await updateDoc(categoryRef, updatedData);
        
        set(state => ({
          loading: { ...state.loading, adminAction: false },
          categories: state.categories.map(category =>
            category.id === categoryId
              ? { ...category, ...data, updatedAt: new Date().toISOString() }
              : category
          )
        }));
      }
    } catch (error) {
      console.error('Error updating category:', error);
      set(state => ({
        loading: { ...state.loading, adminAction: false },
        error: { ...state.error, adminAction: createErrorMessage(error) }
      }));
      throw error;
    }
  },
  
  /**
   * Delete category or subcategory at any level
   */
  deleteCategory: async (categoryId: string, parentId?: string) => {
    set(state => ({ 
      loading: { ...state.loading, adminAction: true },
      error: { ...state.error, adminAction: null } 
    }));
    
    try {
      const currentCategories = get().categories;
      
      if (parentId) {
        // Deleting a subcategory
        // Find which root category contains this subcategory
        let rootCategory: Category | null = null;
        let rootId: string | null = null;
        
        for (const cat of currentCategories) {
          const found = findCategoryInTree([cat], categoryId);
          if (found) {
            rootCategory = cat;
            rootId = cat.id;
            break;
          }
        }
        
        if (!rootCategory || !rootId) {
          throw new Error('Category not found');
        }
        
        // Remove the subcategory from the tree
        const updatedRootCategory = {
          ...rootCategory,
          subCategories: deleteCategoryFromTree(rootCategory.subCategories || [], categoryId),
          updatedAt: new Date().toISOString()
        };
        
        // Save to Firestore
        const rootRef = doc(db, 'categories', rootId);
        await updateDoc(rootRef, {
          ...updatedRootCategory,
          updatedAt: serverTimestamp()
        });
        
        // Update local state
        set(state => ({
          loading: { ...state.loading, adminAction: false },
          categories: state.categories.map(cat =>
            cat.id === rootId ? updatedRootCategory : cat
          )
        }));
      } else {
        // Deleting a top-level category
        const categoryRef = doc(db, 'categories', categoryId);
        await deleteDoc(categoryRef);
        
        set(state => ({
          loading: { ...state.loading, adminAction: false },
          categories: state.categories.filter(c => c.id !== categoryId)
        }));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      set(state => ({
        loading: { ...state.loading, adminAction: false },
        error: { ...state.error, adminAction: createErrorMessage(error) }
      }));
      throw error;
    }
  }
}));

export default useAdminCategoriesData;