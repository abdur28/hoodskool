'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import ProductCard, { Product } from '@/components/ProductCard';
import CrossedLink from '@/components/ui/crossed-link';

const mockWishlistItems: (Product & { inStock: boolean; size?: string })[] = [
  {
    id: '1',
    name: 'Classic Black Hoodie',
    price: 75.00,
    image: '/banner/HoodSkool_банер правка.jpg',
    hoverImage: '/banner/HoodSkool_банер 1 _resized.jpg',
    category: 'Hoodies',
    inStock: false,
    size: 'L',
  },
  {
    id: '2',
    name: 'Vintage T-Shirt',
    price: 45.00,
    image: '/HoodSkool_Catalog_0408202312555 1_resized.jpg',
    hoverImage: '/DSC05257 (1).jpg',
    category: 'T-Shirts',
    inStock: true,
    size: 'M',
  },
  {
    id: '3',
    name: 'Street Bucket Hat',
    price: 35.00,
    image: '/HoodSkool_0408202445315 - Copy.jpg',
    hoverImage: '/DSC09599.jpg',
    category: 'Accessories',
    inStock: false,
    size: 'One Size',
  },
  {
    id: '4',
    name: 'Urban Denim Jeans',
    price: 95.00,
    image: '/HoodSkool_Catalog_0408202313209_resized.jpg',
    hoverImage: '/banner/HoodSkool_банер правка.jpg',
    category: 'Pants',
    inStock: true,
    size: '32',
  },
  {
    id: '5',
    name: 'Premium Leather Jacket',
    price: 185.00,
    image: '/DSC05257 (1).jpg',
    hoverImage: '/HoodSkool_Catalog_0408202312555 1_resized.jpg',
    category: 'Jackets',
    inStock: true,
    size: 'L',
  },
  {
    id: '6',
    name: 'Signature Hoodie',
    price: 85.00,
    image: '/banner/HoodSkool_банер 1 _resized.jpg',
    hoverImage: '/HoodSkool_0408202445315 - Copy.jpg',
    category: 'Hoodies',
    inStock: true,
    size: 'XL',
  },
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);
  const inStockCount = wishlistItems.filter(item => item.inStock).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="font-heading text-4xl md:text-5xl tracking-wider ">
          WISHLIST
        </h1>
      </motion.div>

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <Heart className="h-16 w-16 text-foreground/20 mb-4" />
          <h2 className="font-heading text-2xl tracking-wider mb-2">
            YOUR WISHLIST IS EMPTY
          </h2>
          <p className="font-body text-sm text-foreground/60 mb-6">
            Start adding items you love to your wishlist
          </p>
          <Link
            href="/clothings"
            className="px-6 py-3 bg-black text-white hover:bg-[#F8E231] hover:text-black transition-colors rounded-md font-body text-sm font-medium"
          >
            Start Shopping
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Wishlist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-2 mb-8">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >

                {/* Product Card */}
                <ProductCard product={item} index={index} />
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-black to-gray-800 rounded-lg relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#F8E231] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F8E231] rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10">
              <h3 className="font-body font-semibold mb-1 text-white">
                Ready to purchase?
              </h3>
              <p className="font-body text-sm text-white/60">
                {inStockCount} items available in your wishlist
              </p>
            </div>
            <div className="flex gap-3 relative z-10">
              <button className="px-6 py-3 border border-white/20 hover:border-[#F8E231] transition-colors rounded-md font-body text-sm font-medium text-white hover:bg-white/10">
                Clear All
              </button>
              <button className="px-6 py-3 bg-[#F8E231] text-black hover:bg-white transition-colors rounded-md font-body text-sm font-medium flex items-center gap-2">
                Add All to Cart
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Continue Shopping */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-8"
          >
            <CrossedLink
              lineColor='gold'
              href="/clothings"
              className="flex text-sm items-center"
            >
              Continue Shopping
            </CrossedLink>
          </motion.div>
        </>
      )}
    </div>
  );
}