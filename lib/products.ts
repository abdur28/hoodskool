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
  increment,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase/config';
import type { Product, CartItem, ProductFilters, PaginationParams } from '@/types/types';

// ============ HELPER FUNCTIONS ============

/**
 * Remove undefined values from objects (Firestore doesn't accept undefined)
 */
const removeUndefined = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const result: any = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  });
  return result as Partial<T>;
};

// ============ PRODUCT OPERATIONS ============

/**
 * Get all products with optional filtering
 */
export async function getProducts(
  filters?: ProductFilters,
  pagination?: PaginationParams
) {
  try {
    const productsRef = collection(db, 'products');
    let q = query(productsRef);

    // Apply filters
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters?.subCategory) {
      q = query(q, where('subCategory', '==', filters.subCategory));
    }
    if (filters?.itemType) {
      q = query(q, where('itemType', '==', filters.itemType));
    }
    if (filters?.collection) {
      q = query(q, where('collection', '==', filters.collection));
    }
    if (filters?.inStock !== undefined) {
      q = query(q, where('inStock', '==', filters.inStock));
    }
    if (filters?.isNew) {
      q = query(q, where('isNew', '==', true));
    }
    if (filters?.isFeatured) {
      q = query(q, where('isFeatured', '==', true));
    }
    if (filters?.isBestseller) {
      q = query(q, where('isBestseller', '==', true));
    }

    // Apply ordering
    if (pagination?.orderBy) {
      q = query(q, orderBy(pagination.orderBy, pagination.orderDirection || 'desc'));
    } else {
      q = query(q, orderBy('createdAt', 'desc'));
    }

    // Apply pagination
    if (pagination?.limit) {
      q = query(q, limit(pagination.limit));
    }
    if (pagination?.startAfter) {
      q = query(q, startAfter(pagination.startAfter));
    }

    const snapshot = await getDocs(q);
    let products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    // Client-side filtering for complex queries
    if (filters?.minPrice !== undefined) {
      products = products.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters?.colors && filters.colors.length > 0) {
      products = products.filter((p) =>
        filters.colors!.some((color) => p.colors.includes(color))
      );
    }
    if (filters?.sizes && filters.sizes.length > 0) {
      products = products.filter((p) =>
        filters.sizes!.some((size) => p.sizes.includes(size))
      );
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    return { products, error: null, lastDoc: snapshot.docs[snapshot.docs.length - 1] };
  } catch (error: any) {
    console.error('Get products error:', error);
    return { products: [], error: error.message, lastDoc: null };
  }
}

/**
 * Get single product by ID
 */
export async function getProduct(productId: string) {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Increment view count
      await updateDoc(docRef, {
        viewCount: increment(1),
      });

      return {
        product: { id: docSnap.id, ...docSnap.data() } as Product,
        error: null,
      };
    }

    return { product: null, error: 'Product not found' };
  } catch (error: any) {
    console.error('Get product error:', error);
    return { product: null, error: error.message };
  }
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string) {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];

      // Increment view count
      await updateDoc(docSnap.ref, {
        viewCount: increment(1),
      });

      return {
        product: { id: docSnap.id, ...docSnap.data() } as Product,
        error: null,
      };
    }

    return { product: null, error: 'Product not found' };
  } catch (error: any) {
    console.error('Get product by slug error:', error);
    return { product: null, error: error.message };
  }
}

/**
 * Get products by ids
 */
export async function getProductsByIds(productIds: string[]) {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('__name__', 'in', productIds));
  const snapshot = await getDocs(q);

  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

  return { products, error: null };
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limitCount: number = 6) {
  return getProducts({ isFeatured: true }, { limit: limitCount });
}

/**
 * Get new arrivals
 */
export async function getNewArrivals(limitCount: number = 8) {
  return getProducts({ isNew: true }, { limit: limitCount, orderBy: 'createdAt' });
}

/**
 * Get bestsellers
 */
export async function getBestsellers(limitCount: number = 8) {
  return getProducts(
    { isBestseller: true },
    { limit: limitCount, orderBy: 'salesCount' }
  );
}

export async function getCollections(collectionName: string) {
  return getProducts({ collection: collectionName });
}

// ============ CART OPERATIONS ============

/**
 * Get user's cart
 */
export async function getCart(userId: string) {
  try {
    const cartRef = collection(db, 'users', userId, 'cart');
    const snapshot = await getDocs(cartRef);

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CartItem[];

    return { items, error: null };
  } catch (error: any) {
    console.error('Get cart error:', error);
    return { items: [], error: error.message };
  }
}

/**
 * Add item to cart
 */
export async function addToCart(userId: string, item: Omit<CartItem, 'id'>) {
  try {
    const cartRef = collection(db, 'users', userId, 'cart');

    // Remove undefined values before sending to Firestore
    const sanitizedItem = removeUndefined(item);

    // Check if item already exists
    const q = query(
      cartRef,
      where('productId', '==', sanitizedItem.productId),
      where('variantId', '==', sanitizedItem.variantId || null)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Update quantity if item exists
      const existingDoc = snapshot.docs[0];
      const existingItem = existingDoc.data() as CartItem;
      const newQuantity = Math.min(
        existingItem.quantity + (sanitizedItem.quantity || 1),
        sanitizedItem.maxQuantity || 999
      );

      await updateDoc(existingDoc.ref, {
        quantity: newQuantity,
      });

      return { cartItemId: existingDoc.id, error: null };
    } else {
      // Add new item
      const docRef = await addDoc(cartRef, sanitizedItem);
      return { cartItemId: docRef.id, error: null };
    }
  } catch (error: any) {
    console.error('Add to cart error:', error);
    return { cartItemId: null, error: error.message };
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(
  userId: string,
  cartItemId: string,
  quantity: number
) {
  try {
    const cartItemRef = doc(db, 'users', userId, 'cart', cartItemId);
    await updateDoc(cartItemRef, { quantity });
    return { error: null };
  } catch (error: any) {
    console.error('Update cart item error:', error);
    return { error: error.message };
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(userId: string, cartItemId: string) {
  try {
    await deleteDoc(doc(db, 'users', userId, 'cart', cartItemId));
    return { error: null };
  } catch (error: any) {
    console.error('Remove from cart error:', error);
    return { error: error.message };
  }
}

/**
 * Clear entire cart
 */
export async function clearCart(userId: string) {
  try {
    const cartRef = collection(db, 'users', userId, 'cart');
    const snapshot = await getDocs(cartRef);

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return { error: null };
  } catch (error: any) {
    console.error('Clear cart error:', error);
    return { error: error.message };
  }
}

/**
 * Sync cart from localStorage to Firebase
 */
export async function syncCart(userId: string, localCartItems: CartItem[]) {
  try {
    const batch = writeBatch(db);
    const cartRef = collection(db, 'users', userId, 'cart');

    for (const item of localCartItems) {
      const { id, ...itemData } = item;
      
      // Remove undefined values
      const sanitizedData = removeUndefined(itemData);
      
      const docRef = doc(cartRef);
      batch.set(docRef, sanitizedData);
    }

    await batch.commit();
    return { error: null };
  } catch (error: any) {
    console.error('Sync cart error:', error);
    return { error: error.message };
  }
}

// ============ WISHLIST OPERATIONS ============

/**
 * Add to wishlist
 */
export async function addToWishlist(userId: string, productId: string) {
  try {
    const wishlistRef = collection(db, 'users', userId, 'wishlist');
    await addDoc(wishlistRef, {
      productId,
      addedAt: serverTimestamp(),
    });
    return { error: null };
  } catch (error: any) {
    console.error('Add to wishlist error:', error);
    return { error: error.message };
  }
}

/**
 * Remove from wishlist
 */
export async function removeFromWishlist(userId: string, productId: string) {
  try {
    const wishlistRef = collection(db, 'users', userId, 'wishlist');
    const q = query(wishlistRef, where('productId', '==', productId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      await deleteDoc(snapshot.docs[0].ref);
    }

    return { error: null };
  } catch (error: any) {
    console.error('Remove from wishlist error:', error);
    return { error: error.message };
  }
}

/**
 * Get wishlist
 */
export async function getWishlist(userId: string) {
  try {
    const wishlistRef = collection(db, 'users', userId, 'wishlist');
    const snapshot = await getDocs(wishlistRef);

    const productIds = snapshot.docs.map((doc) => doc.data().productId);

    // Get full product details
    if (productIds.length === 0) {
      return { products: [], error: null };
    }

    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('__name__', 'in', productIds));
    const productsSnapshot = await getDocs(q);

    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    return { products, error: null };
  } catch (error: any) {
    console.error('Get wishlist error:', error);
    return { products: [], error: error.message };
  }
}