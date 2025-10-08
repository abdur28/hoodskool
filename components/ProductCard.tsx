"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import CrossedLink from "@/components/ui/crossed-link";
import { useCart, useIsInCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard, useIsInWishlist } from "@/hooks/useDashboard";
import type { CartItem, Product } from "@/types/types";
import { Skeleton } from "./ui/skeleton";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const addItem = useCart(state => state.addItem);
  const isInCart = useIsInCart(product.id);
  
  // Wishlist functionality
  const toggleWishlist = useDashboard(state => state.toggleWishlist);
  const isLiked = useIsInWishlist(product.id);

  const discountedPrice = product.discountPercent 
    ? product.price - (product.price * product.discountPercent / 100)
    : product.price;

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!user) {
      // Redirect to login with return URL
      router.push(`/auth/login?redirect=${pathname}`);
      return;
    }

    setIsTogglingWishlist(true);

    try {
      await toggleWishlist(product.id, user.uid);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    } finally {
      // Small delay for visual feedback
      setTimeout(() => setIsTogglingWishlist(false), 300);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    
    if (!product.inStock || isAdding) return;

    setIsAdding(true);

    try {
      // Get the primary image
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      
      // Get the first variant if available
      const firstVariant = product.variants?.[0];
      
      // Create cart item - only include defined values
      const cartItem: Omit<CartItem, 'id'> = {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: discountedPrice,
        quantity: 1,
        image: primaryImage?.secureUrl || '/placeholder-product.jpg',
        sku: product.sku,
        inStock: product.inStock,
        maxQuantity: product.totalStock,
      };

      // Only add variant fields if they exist
      if (firstVariant) {
        if (firstVariant.id) cartItem.variantId = firstVariant.id;
        if (firstVariant.size) cartItem.size = firstVariant.size;
        if (firstVariant.color) cartItem.color = firstVariant.color;
      }

      await addItem(cartItem, user?.uid);
      
      // Show success feedback
      setTimeout(() => setIsAdding(false), 1000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setIsAdding(false);
    }
  };

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const hoverImage = product.images[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative mb-4 md:mb-8"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[2/3] bg-foreground/5 rounded-xs overflow-hidden mb-4">
        {/* Primary Image */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{ opacity: isHovered && hoverImage ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {primaryImage ? (
            <Image
              src={primaryImage.secureUrl}
              alt={primaryImage.altText || product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
              <span className="text-foreground/40 text-sm">No Image</span>
            </div>
          )}
        </motion.div>

        {/* Hover Image */}
        {hoverImage && (
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={hoverImage.secureUrl}
              alt={hoverImage.altText || `${product.name} alternate view`}
              fill
              className="object-cover"
            />
          </motion.div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isNew && (
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="px-3 py-1 bg-[#F8E231] text-black text-xs font-body font-semibold uppercase tracking-wider"
            >
              New
            </motion.span>
          )}
          {product.discountPercent && (
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="px-3 py-1 bg-red-500 text-white text-xs font-body font-semibold uppercase tracking-wider"
            >
              -{product.discountPercent}%
            </motion.span>
          )}
          {product.isLimitedEdition && (
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="px-3 py-1 bg-black text-[#F8E231] text-xs font-body font-semibold uppercase tracking-wider"
            >
              Limited
            </motion.span>
          )}
        </div>

        {/* Quick Actions - Wishlist Heart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-3 right-3 flex flex-col gap-2 z-20"
        >
          <motion.button
            onClick={handleToggleLike}
            disabled={isTogglingWishlist}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-full transition-all shadow-lg ${
              isLiked 
                ? 'bg-[#F8E231] text-black' 
                : 'bg-white text-black hover:bg-[#F8E231]'
            } ${isTogglingWishlist ? 'opacity-50 cursor-wait' : ''}`}
          >
            <Heart 
              className={`h-4 w-4 transition-all ${
                isLiked ? 'fill-current' : ''
              }`} 
            />
          </motion.button>
        </motion.div>

        {/* Add to Cart Button */}
        {product.inStock && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 100, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 p-4 justify-end flex"
          >
            <button 
              onClick={handleAddToCart}
              disabled={isAdding || isInCart}
              className={`w-1/2 py-3 font-body text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                isInCart
                  ? 'bg-green-500 text-white cursor-default'
                  : isAdding
                  ? 'bg-black/50 text-white cursor-wait'
                  : 'bg-black text-white hover:bg-[#F8E231] hover:text-black'
              }`}
            >
              {isAdding ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Adding...
                </>
              ) : isInCart ? (
                <>
                  <Check className="h-4 w-4" />
                  In Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 z-10 bg-black/60 rounded-xs flex items-center justify-center">
            <div className="text-center">
              <div className="px-4 py-2 bg-red-500/30 text-white text-sm font-body font-semibold uppercase tracking-wider mb-2">
                Out of Stock
              </div>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/20 pointer-events-none"
        />
      </div>

      {/* Product Info */}
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          {/* Category */}
          <p className="text-[10px] text-foreground/60 font-body uppercase tracking-wider">
            {product.category}
          </p>

          {/* Product Name */}
          <CrossedLink
            href={`/product/${product.slug}`}
            lineColor="gold"
          >
            <h3 className="font-body text-sm font-medium text-foreground truncate">
              {product.name}
            </h3>
          </CrossedLink>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 ml-2">
          {product.discountPercent ? (
            <>
              <span className="font-body text-base font-semibold text-foreground">
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="font-body text-xs text-foreground/40 line-through">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-body text-base font-semibold text-foreground">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export const ProductCardSkeleton = () => {
  return (
    <div className="group relative mb-4 md:mb-8">
      <Skeleton className="relative aspect-[2/3] rounded-xs mb-4" />
      <Skeleton className="h-3 w-1/2 mb-1" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
};