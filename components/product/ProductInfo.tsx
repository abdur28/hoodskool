"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import CrossedLink from "@/components/ui/crossed-link";
import VariantSelector from "@/components/product/VariantSelector";
import AddToCartSection from "@/components/product/AddToCartSection";
import ProductDetails from "@/components/product/ProductDetails";
import type { Product, ProductVariant } from "@/types/types";


export default function ProductInfo({ productAsString }: { productAsString: string }) {
  const product: Product = JSON.parse(productAsString);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  );

  // Calculate price
  const displayPrice = selectedVariant?.price || product.price;
  const discountedPrice = product.discountPercent 
    ? displayPrice - (displayPrice * product.discountPercent / 100)
    : displayPrice;

  // Parse category path for breadcrumb
  const categoryParts = product.categoryPath.split(" > ");

  return (
    <div className="px-6 lg:px-12 py-8 lg:py-12">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 text-xs text-foreground/60 mb-6"
      >
        <CrossedLink href="/" lineColor="gold">
          <span className="hover:text-foreground transition-colors">Home</span>
        </CrossedLink>
        
        {categoryParts.map((part, index) => (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="h-3 w-3" />
            {index === categoryParts.length - 1 ? (
              <span className="text-foreground/90">{part}</span>
            ) : (
              <CrossedLink href={`/clothings`} lineColor="gold">
                <span className="hover:text-foreground transition-colors">{part}</span>
              </CrossedLink>
            )}
          </div>
        ))}
        
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground/90">{product.name}</span>
      </motion.nav>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-4"
      >
        {product.isNew && (
          <span className="px-3 py-1 bg-[#F8E231] text-black text-xs font-body font-semibold uppercase tracking-wider">
            New
          </span>
        )}
        {product.discountPercent && (
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-body font-semibold uppercase tracking-wider">
            -{product.discountPercent}% Off
          </span>
        )}
        {product.isLimitedEdition && (
          <span className="px-3 py-1 bg-black text-[#F8E231] text-xs font-body font-semibold uppercase tracking-wider">
            Limited Edition
          </span>
        )}
        {product.isBestseller && (
          <span className="px-3 py-1 bg-foreground/10 text-foreground text-xs font-body font-semibold uppercase tracking-wider">
            Bestseller
          </span>
        )}
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="font-heading text-4xl lg:text-5xl tracking-wide mb-4 uppercase"
      >
        {product.name}
      </motion.h1>

      {/* Short Description */}
      {product.shortDescription && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-body text-base text-foreground/70 mb-6"
        >
          {product.shortDescription}
        </motion.p>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 border border-foreground/20 text-foreground/60 text-xs font-body rounded-sm"
            >
              #{tag}
            </span>
          ))}
        </motion.div>
      )}

      {/* Available Colors Preview */}
      {product.colors && product.colors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="font-body text-xs text-foreground/60 uppercase tracking-wider">
            Available Colors:
          </span>
          <div className="flex gap-1.5">
            {product.colors.map((color) => (
              <div
                key={color.name}
                className="w-5 h-5 rounded-full ring-1 ring-foreground/20"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Price */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-baseline gap-3">
          <span className="font-body text-3xl text-foreground">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discountPercent && (
            <span className="font-body text-xl text-foreground/40 line-through">
              ${displayPrice.toFixed(2)}
            </span>
          )}
        </div>
      </motion.div>

      {/* Divider */}
      <div className="h-px bg-foreground/10 mb-8" />

      {/* Variant Selector */}
      {product.variants && product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          colors={product.colors || []}
          sizes={product.sizes || []}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
        />
      )}

      {/* Add to Cart Section */}
      <AddToCartSection 
        product={product} 
        selectedVariant={selectedVariant}
        discountedPrice={discountedPrice}
      />

      {/* Divider */}
      <div className="h-px bg-foreground/10 my-8" />

      {/* Product Details */}
      <ProductDetails product={product} />
    </div>
  );
}