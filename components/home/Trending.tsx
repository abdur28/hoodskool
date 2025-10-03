"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ProductCard, { Product } from "@/components/ProductCard";
import CrossedLink from "@/components/ui/crossed-link";

// Mock product data - replace with your actual products
const trendingProducts: Product[] = [
  {
    id: "1",
    name: "Classic Black Hoodie",
    price: 75.00,
    image: "/banner/HoodSkool_банер правка.jpg",
    hoverImage: "/banner/HoodSkool_банер 1 _resized.jpg",
    category: "Hoodies",
  },
  {
    id: "2",
    name: "Vintage T-Shirt",
    price: 45.00,
    image: "/HoodSkool_Catalog_0408202312555 1_resized.jpg",
    hoverImage: "/DSC05257 (1).jpg",
    category: "T-Shirts",
  },
  {
    id: "3",
    name: "Street Bucket Hat",
    price: 35.00,
    image: "/HoodSkool_0408202445315 - Copy.jpg",
    hoverImage: "/DSC09599.jpg",
    category: "Accessories",
  },
  {
    id: "4",
    name: "Urban Denim Jeans",
    price: 95.00,
    image: "/HoodSkool_Catalog_0408202313209_resized.jpg",
    hoverImage: "/banner/HoodSkool_банер правка.jpg",
    category: "Pants",
  },
  {
    id: "5",
    name: "Premium Leather Jacket",
    price: 185.00,
    image: "/DSC05257 (1).jpg",
    hoverImage: "/HoodSkool_Catalog_0408202312555 1_resized.jpg",
    category: "Jackets",
  },
  {
    id: "6",
    name: "Signature Hoodie",
    price: 85.00,
    image: "/banner/HoodSkool_банер 1 _resized.jpg",
    hoverImage: "/HoodSkool_0408202445315 - Copy.jpg",
    category: "Hoodies",
  },
];

export default function Trending() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative py-10 md:py-16 bg-gray-200 z-10 overflow-hidden"
    >

      <div className=" mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          style={{ opacity }}
          className="text-left mb-8 md:mb-10"
        >

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-wider mb-4"
          >
            TRENDING NOW
          </motion.h2>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-2 mb-2">
          {trendingProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <CrossedLink
            href="/clothings"
            lineColor="gold"
            lineWidth={2}
            animationDuration={0.3}
          >
            <span className="font-body text-base md:text-base font-medium text-foreground">
              View All Products
            </span>
          </CrossedLink>
        </motion.div>
      </div>
    </section>
  );
}