import { create } from 'zustand';
import { 
  addToWishlist as addToWishlistFirebase,
  removeFromWishlist as removeFromWishlistFirebase,
  getWishlist as getWishlistFirebase
} from '@/lib/products';
import type { Product } from '@/types/types';

interface DashboardState {
  // Wishlist state
  wishlist: string[]; // Array of product IDs
  wishlistProducts: Product[];
  isLoadingWishlist: boolean;

  // Wishlist actions
  loadWishlist: (userId: string) => Promise<void>;
  toggleWishlist: (productId: string, userId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Future: Can add more dashboard features here
  // - Order history
  // - User preferences
  // - etc.
}

export const useDashboard = create<DashboardState>((set, get) => ({
  // Initial state
  wishlist: [],
  wishlistProducts: [],
  isLoadingWishlist: false,

  // Load user's wishlist from Firebase
  loadWishlist: async (userId: string) => {
    set({ isLoadingWishlist: true });
    
    try {
      const { products, error } = await getWishlistFirebase(userId);
      
      if (error) {
        console.error('Failed to load wishlist:', error);
        set({ isLoadingWishlist: false });
        return;
      }

      const productIds = products.map(p => p.id);
      
      set({ 
        wishlistProducts: products,
        wishlist: productIds,
        isLoadingWishlist: false 
      });
    } catch (error) {
      console.error('Load wishlist error:', error);
      set({ isLoadingWishlist: false });
    }
  },

  // Toggle product in wishlist
  toggleWishlist: async (productId: string, userId: string) => {
    const { wishlist } = get();
    const isCurrentlyInWishlist = wishlist.includes(productId);

    // Optimistically update UI
    if (isCurrentlyInWishlist) {
      set({ 
        wishlist: wishlist.filter(id => id !== productId),
        wishlistProducts: get().wishlistProducts.filter(p => p.id !== productId)
      });
    } else {
      set({ 
        wishlist: [...wishlist, productId] 
      });
    }

    try {
      if (isCurrentlyInWishlist) {
        // Remove from wishlist
        const { error } = await removeFromWishlistFirebase(userId, productId);
        
        if (error) {
          // Revert on error
          set({ 
            wishlist: [...wishlist, productId] 
          });
          console.error('Failed to remove from wishlist:', error);
          return false;
        }
        
        return false; // Now not in wishlist
      } else {
        // Add to wishlist
        const { error } = await addToWishlistFirebase(userId, productId);
        
        if (error) {
          // Revert on error
          set({ 
            wishlist: wishlist.filter(id => id !== productId) 
          });
          console.error('Failed to add to wishlist:', error);
          return false;
        }
        
        return true; // Now in wishlist
      }
    } catch (error) {
      console.error('Toggle wishlist error:', error);
      // Revert to original state
      set({ wishlist });
      return isCurrentlyInWishlist;
    }
  },

  // Check if product is in wishlist
  isInWishlist: (productId: string) => {
    return get().wishlist.includes(productId);
  },

  // Clear wishlist (e.g., on logout)
  clearWishlist: () => {
    set({ 
      wishlist: [],
      wishlistProducts: [],
      isLoadingWishlist: false 
    });
  },
}));

// Helper hook to check if specific product is in wishlist
export const useIsInWishlist = (productId: string) => {
  return useDashboard(state => state.isInWishlist(productId));
};

// Helper hook to get wishlist count
export const useWishlistCount = () => {
  return useDashboard(state => state.wishlist.length);
};