import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  getCart, 
  addToCart as addToCartFirebase,
  updateCartItemQuantity,
  removeFromCart as removeFromCartFirebase,
  clearCart as clearCartFirebase,
  syncCart
} from '@/lib/products';
import type { CartItem } from '@/types/types';

interface CartState {
  // State
  items: CartItem[];
  isLoading: boolean;
  lastSynced: number | null;

  // Computed values
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;

  // Actions
  loadCart: (userId?: string) => Promise<void>;
  addItem: (item: Omit<CartItem, 'id'>, userId?: string) => Promise<void>;
  removeItem: (cartItemId: string, userId?: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number, userId?: string) => Promise<void>;
  clearCart: (userId?: string) => Promise<void>;
  syncWithFirebase: (userId: string) => Promise<void>;
  removeDuplicates: () => void; // Manual deduplication
  
  // Internal helpers
  calculateTotals: () => void;
}

const TAX_RATE = 0.08; // 8% tax
const FREE_SHIPPING_THRESHOLD = 100;
const STANDARD_SHIPPING = 10;

// Helper function to remove undefined values from objects (Firestore doesn't allow undefined)
const removeUndefined = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;
};

// Helper function to deduplicate cart items
const deduplicateCartItems = (items: CartItem[]): CartItem[] => {
  const seen = new Map<string, CartItem>();
  
  items.forEach(item => {
    const key = `${item.productId}-${item.variantId || 'no-variant'}`;
    const existing = seen.get(key);
    
    if (existing) {
      // Merge quantities if duplicate found
      seen.set(key, {
        ...existing,
        quantity: Math.min(
          existing.quantity + item.quantity,
          item.maxQuantity
        )
      });
    } else {
      seen.set(key, item);
    }
  });
  
  return Array.from(seen.values());
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isLoading: false,
      lastSynced: null,
      itemCount: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,

      // Calculate totals
      calculateTotals: () => {
        const { items } = get();
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * TAX_RATE;
        const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
        const total = subtotal + tax + shipping;
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

        set({ subtotal, tax, shipping, total, itemCount });
      },

      // Load cart from Firebase or use local storage
      loadCart: async (userId?: string) => {
        if (!userId) {
          // Guest user - use items from localStorage (already loaded by persist)
          const { items } = get();
          const deduplicatedItems = deduplicateCartItems(items);
          
          // Update with deduplicated items if there were duplicates
          if (deduplicatedItems.length !== items.length) {
            set({ items: deduplicatedItems });
          }
          
          get().calculateTotals();
          return;
        }

        set({ isLoading: true });
        try {
          const { items, error } = await getCart(userId);
          
          if (error) {
            console.error('Failed to load cart:', error);
            set({ isLoading: false });
            return;
          }

          // Deduplicate items from Firebase (just in case)
          const deduplicatedItems = deduplicateCartItems(items);

          set({ 
            items: deduplicatedItems, 
            lastSynced: Date.now(),
            isLoading: false 
          });
          get().calculateTotals();
        } catch (error) {
          console.error('Failed to load cart:', error);
          set({ isLoading: false });
        }
      },

      // Add item to cart
      addItem: async (newItem: Omit<CartItem, 'id'>, userId?: string) => {
        set({ isLoading: true });

        try {
          // Remove undefined values before sending to Firestore
          const sanitizedItem = removeUndefined(newItem) as Omit<CartItem, 'id'>;

          if (userId) {
            // Authenticated user - add to Firebase
            const { cartItemId, error } = await addToCartFirebase(userId, sanitizedItem);
            
            if (error) {
              console.error('Failed to add item to cart:', error);
              set({ isLoading: false });
              return;
            }

            // Reload cart from Firebase to get updated state
            await get().loadCart(userId);
          } else {
            // Guest user - update local storage
            const { items } = get();
            
            // Check if item already exists (same product + variant)
            const existingIndex = items.findIndex(
              item => 
                item.productId === sanitizedItem.productId && 
                item.variantId === sanitizedItem.variantId
            );

            let updatedItems: CartItem[];
            
            if (existingIndex >= 0) {
              // Update existing item quantity
              const existingItem = items[existingIndex];
              const newQuantity = Math.min(
                existingItem.quantity + sanitizedItem.quantity,
                sanitizedItem.maxQuantity
              );
              
              updatedItems = items.map((item, index) =>
                index === existingIndex
                  ? { ...item, quantity: newQuantity }
                  : item
              );
            } else {
              // Add new item with temporary ID
              const tempId = `temp_${Date.now()}_${Math.random()}`;
              updatedItems = [...items, { ...sanitizedItem, id: tempId }];
            }

            set({ items: updatedItems, isLoading: false });
            get().calculateTotals();
          }
        } catch (error) {
          console.error('Failed to add item:', error);
          set({ isLoading: false });
        }
      },

      // Remove item from cart
      removeItem: async (cartItemId: string, userId?: string) => {
        set({ isLoading: true });

        try {
          if (userId) {
            // Authenticated user - remove from Firebase
            const { error } = await removeFromCartFirebase(userId, cartItemId);
            
            if (error) {
              console.error('Failed to remove item:', error);
              set({ isLoading: false });
              return;
            }

            // Update local state
            set(state => ({
              items: state.items.filter(item => item.id !== cartItemId),
              isLoading: false
            }));
          } else {
            // Guest user - remove from local storage
            set(state => ({
              items: state.items.filter(item => item.id !== cartItemId),
              isLoading: false
            }));
          }

          get().calculateTotals();
        } catch (error) {
          console.error('Failed to remove item:', error);
          set({ isLoading: false });
        }
      },

      // Update item quantity
      updateQuantity: async (cartItemId: string, quantity: number, userId?: string) => {
        if (quantity < 1) {
          await get().removeItem(cartItemId, userId);
          return;
        }

        set({ isLoading: true });

        try {
          if (userId) {
            // Authenticated user - update in Firebase
            const { error } = await updateCartItemQuantity(userId, cartItemId, quantity);
            
            if (error) {
              console.error('Failed to update quantity:', error);
              set({ isLoading: false });
              return;
            }
          }

          // Update local state
          set(state => ({
            items: state.items.map(item =>
              item.id === cartItemId
                ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
                : item
            ),
            isLoading: false
          }));

          get().calculateTotals();
        } catch (error) {
          console.error('Failed to update quantity:', error);
          set({ isLoading: false });
        }
      },

      // Clear entire cart
      clearCart: async (userId?: string) => {
        set({ isLoading: true });

        try {
          if (userId) {
            const { error } = await clearCartFirebase(userId);
            
            if (error) {
              console.error('Failed to clear cart:', error);
              set({ isLoading: false });
              return;
            }
          }

          set({ 
            items: [], 
            isLoading: false,
            itemCount: 0,
            subtotal: 0,
            tax: 0,
            shipping: 0,
            total: 0
          });
        } catch (error) {
          console.error('Failed to clear cart:', error);
          set({ isLoading: false });
        }
      },

      // Sync local cart with Firebase when user logs in
      syncWithFirebase: async (userId: string) => {
        const { items: localItems } = get();
        
        set({ isLoading: true });

        try {
          // First, get existing cart from Firebase
          const { items: firebaseItems, error: loadError } = await getCart(userId);
          
          if (loadError) {
            console.error('Failed to load Firebase cart:', loadError);
            set({ isLoading: false });
            return;
          }

          // If no local items, just use Firebase items
          if (localItems.length === 0) {
            set({ 
              items: firebaseItems, 
              lastSynced: Date.now(),
              isLoading: false 
            });
            get().calculateTotals();
            return;
          }

          // If Firebase cart is empty, sync local items to Firebase
          if (firebaseItems.length === 0) {
            const { error } = await syncCart(userId, localItems);
            
            if (error) {
              console.error('Failed to sync cart:', error);
              set({ isLoading: false });
              return;
            }

            // Reload to get proper IDs from Firebase
            await get().loadCart(userId);
            return;
          }

          // Both have items - merge them intelligently
          // Filter out local items that are already in Firebase cart
          const uniqueLocalItems = localItems.filter(localItem => 
            !firebaseItems.some(firebaseItem => 
              firebaseItem.productId === localItem.productId &&
              firebaseItem.variantId === localItem.variantId
            )
          );

          // Only sync items that don't already exist
          if (uniqueLocalItems.length > 0) {
            await syncCart(userId, uniqueLocalItems);
          }

          // Reload the complete cart from Firebase
          await get().loadCart(userId);
        } catch (error) {
          console.error('Failed to sync cart:', error);
          set({ isLoading: false });
        }
      },

      // Manual deduplication - call this if duplicates are detected
      removeDuplicates: () => {
        const { items } = get();
        const deduplicatedItems = deduplicateCartItems(items);
        
        if (deduplicatedItems.length !== items.length) {
          console.log(`Removed ${items.length - deduplicatedItems.length} duplicate items`);
          set({ items: deduplicatedItems });
          get().calculateTotals();
        }
      },
    }),
    {
      name: 'hoodskool-cart',
      storage: createJSONStorage(() => localStorage),
      // Only persist items for guest users
      partialize: (state) => ({ 
        items: state.items,
      }),
      // Deduplicate items when rehydrating from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          const deduplicatedItems = deduplicateCartItems(state.items);
          if (deduplicatedItems.length !== state.items.length) {
            console.log('Removed duplicates during rehydration');
            state.items = deduplicatedItems;
          }
          state.calculateTotals();
        }
      },
    }
  )
);

// Helper hook to get just the cart count (for navbar badge)
export const useCartCount = () => useCart(state => state.itemCount);

// Helper hook to check if item is in cart
export const useIsInCart = (productId: string, variantId?: string) => {
  return useCart(state => 
    state.items.some(
      item => item.productId === productId && item.variantId === variantId
    )
  );
};