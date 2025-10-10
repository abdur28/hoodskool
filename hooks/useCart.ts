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

  // Computed values (currency-agnostic)
  itemCount: number;

  // Actions
  loadCart: (userId?: string) => Promise<void>;
  addItem: (item: Omit<CartItem, 'id'>, userId?: string) => Promise<void>;
  removeItem: (cartItemId: string, userId?: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number, userId?: string) => Promise<void>;
  clearCart: (userId?: string) => Promise<void>;
  syncWithFirebase: (userId: string) => Promise<void>;
  removeDuplicates: () => void;
  
  // Internal helpers
  calculateItemCount: () => void;
}

// Helper function to remove undefined values from objects
const removeUndefined = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const result: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const cleaned = removeUndefined(value);
        if (Object.keys(cleaned).length > 0) {
          result[key] = cleaned;
        }
      } else {
        result[key] = value;
      }
    }
  }
  
  return result as Partial<T>;
};

// Helper function to compare cart items
const isSameCartItem = (item1: CartItem, item2: Omit<CartItem, 'id'>): boolean => {
  const sameProduct = item1.productId === item2.productId;
  const sameVariant = item1.variantId === item2.variantId;
  const sameColor = 
    (!item1.color && !item2.color) || 
    (item1.color?.name === item2.color?.name);
  const sameSize = item1.size === item2.size;
  
  return sameProduct && sameVariant && sameColor && sameSize;
};

// Helper function to deduplicate cart items
const deduplicateCartItems = (items: CartItem[]): CartItem[] => {
  const seen = new Map<string, CartItem>();
  
  items.forEach(item => {
    const colorKey = item.color?.name || 'no-color';
    const key = `${item.productId}-${item.variantId || 'no-variant'}-${item.size || 'no-size'}-${colorKey}`;
    const existing = seen.get(key);
    
    if (existing) {
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

      // Calculate item count (currency-agnostic)
      calculateItemCount: () => {
        const { items } = get();
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        set({ itemCount });
      },

      // Load cart from Firebase or use local storage
      loadCart: async (userId?: string) => {
        if (!userId) {
          const { items } = get();
          const deduplicatedItems = deduplicateCartItems(items);
          
          if (deduplicatedItems.length !== items.length) {
            set({ items: deduplicatedItems });
          }
          
          get().calculateItemCount();
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

          const deduplicatedItems = deduplicateCartItems(items);

          set({ 
            items: deduplicatedItems, 
            lastSynced: Date.now(),
            isLoading: false 
          });
          get().calculateItemCount();
        } catch (error) {
          console.error('Failed to load cart:', error);
          set({ isLoading: false });
        }
      },

      // Add item to cart
      addItem: async (newItem: Omit<CartItem, 'id'>, userId?: string) => {
        set({ isLoading: true });

        try {
          const sanitizedItem = removeUndefined(newItem) as Omit<CartItem, 'id'>;

          if (userId) {
            const { cartItemId, error } = await addToCartFirebase(userId, sanitizedItem);
            
            if (error) {
              console.error('Failed to add item to cart:', error);
              set({ isLoading: false });
              return;
            }

            await get().loadCart(userId);
          } else {
            const { items } = get();
            const existingIndex = items.findIndex(item => isSameCartItem(item, sanitizedItem));

            let updatedItems: CartItem[];
            
            if (existingIndex >= 0) {
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
              const tempId = `temp_${Date.now()}_${Math.random()}`;
              updatedItems = [...items, { ...sanitizedItem, id: tempId }];
            }

            set({ items: updatedItems, isLoading: false });
            get().calculateItemCount();
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
            const { error } = await removeFromCartFirebase(userId, cartItemId);
            
            if (error) {
              console.error('Failed to remove item:', error);
              set({ isLoading: false });
              return;
            }

            set(state => ({
              items: state.items.filter(item => item.id !== cartItemId),
              isLoading: false
            }));
          } else {
            set(state => ({
              items: state.items.filter(item => item.id !== cartItemId),
              isLoading: false
            }));
          }

          get().calculateItemCount();
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
            const { error } = await updateCartItemQuantity(userId, cartItemId, quantity);
            
            if (error) {
              console.error('Failed to update quantity:', error);
              set({ isLoading: false });
              return;
            }
          }

          set(state => ({
            items: state.items.map(item =>
              item.id === cartItemId
                ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
                : item
            ),
            isLoading: false
          }));

          get().calculateItemCount();
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
          const { items: firebaseItems, error: loadError } = await getCart(userId);
          
          if (loadError) {
            console.error('Failed to load Firebase cart:', loadError);
            set({ isLoading: false });
            return;
          }

          if (localItems.length === 0) {
            set({ 
              items: firebaseItems, 
              lastSynced: Date.now(),
              isLoading: false 
            });
            get().calculateItemCount();
            return;
          }

          if (firebaseItems.length === 0) {
            const { error } = await syncCart(userId, localItems);
            
            if (error) {
              console.error('Failed to sync cart:', error);
              set({ isLoading: false });
              return;
            }

            await get().loadCart(userId);
            return;
          }

          const uniqueLocalItems = localItems.filter(localItem => 
            !firebaseItems.some(firebaseItem => isSameCartItem(firebaseItem, localItem))
          );

          if (uniqueLocalItems.length > 0) {
            await syncCart(userId, uniqueLocalItems);
          }

          await get().loadCart(userId);
        } catch (error) {
          console.error('Failed to sync cart:', error);
          set({ isLoading: false });
        }
      },

      // Manual deduplication
      removeDuplicates: () => {
        const { items } = get();
        const deduplicatedItems = deduplicateCartItems(items);
        
        if (deduplicatedItems.length !== items.length) {
          console.log(`Removed ${items.length - deduplicatedItems.length} duplicate items`);
          set({ items: deduplicatedItems });
          get().calculateItemCount();
        }
      },
    }),
    {
      name: 'hoodskool-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        items: state.items,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const deduplicatedItems = deduplicateCartItems(state.items);
          if (deduplicatedItems.length !== state.items.length) {
            console.log('Removed duplicates during rehydration');
            state.items = deduplicatedItems;
          }
          state.calculateItemCount();
        }
      },
    }
  )
);

// Helper hook to get cart count
export const useCartCount = () => useCart(state => state.itemCount);

// Helper hook to check if item is in cart
export const useIsInCart = (productId: string, variantId?: string) => {
  return useCart(state => 
    state.items.some(
      item => item.productId === productId && 
              (!variantId || item.variantId === variantId)
    )
  );
};