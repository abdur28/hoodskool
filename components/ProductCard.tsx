"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import CrossedLink from "@/components/ui/crossed-link";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  hoverImage?: string; // Second image for hover effect
  category: string;
  isNew?: boolean;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

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
          animate={{ opacity: isHovered && product.hoverImage ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Hover Image - Only if hoverImage exists */}
        {product.hoverImage && (
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={product.hoverImage}
              alt={`${product.name} alternate view`}
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
          {product.discount && (
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="px-3 py-1 bg-red-500 text-white text-xs font-body font-semibold uppercase tracking-wider"
            >
              -{product.discount}%
            </motion.span>
          )}
        </div>

        {/* Quick Actions - Appear on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-3 right-3 flex flex-col gap-2 z-10"
        >
          
        </motion.div>

        {/* Add to Cart Button - Appears on Hover */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 100, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 p-4 justify-end flex "
        >
          <button className="w-1/2 py-3 bg-black text-white font-body text-sm font-medium hover:bg-[#F8E231] hover:text-black transition-all flex items-center justify-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </button>
        </motion.div>

        {/* Overlay on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/20 pointer-events-none"
        />
      </div>

      {/* Product Info */}
      <div className="flex items-center justify-between">
        <div>
         {/* Category */}
        <p className="text-[10px] text-foreground/60 font-body uppercase tracking-wider">
          {product.category}
        </p>

        {/* Product Name */}
        <CrossedLink
          href={`/product/${product.id}`}
          lineColor="gold"
        >
          <h3 className="font-body text-sm font-medium text-foreground">
            {product.name}
          </h3>
        </CrossedLink>

        </div>
        {/* Price */}
        <div className="flex items-center gap-2">
          {product.discount ? (
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