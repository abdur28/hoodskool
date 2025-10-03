"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  title: string;
  description: string;
  image: string;
  href: string;
  span?: string;
}

const categories: Category[] = [
  {
    title: "JEANS",
    description: "Style and comfort meet in our collection of jeans. Discover the latest trends and perfect cuts for an impeccable look.",
    image: "/categories/jeans.jpg",
    href: "/clothings/jeans",
    span: "md:row-span-2"
  },
  {
    title: "PROMOTIONS",
    description: "Explore exclusive deals on our top products. The perfect opportunity to enrich your wardrobe with trendy pieces at affordable prices.",
    image: "/categories/promotions.jpg",
    href: "/promotions",
    span: "md:col-span-2"
  },
  {
    title: "T-SHIRTS",
    description: "Passion for fashion and comfort is reflected in every pair of sneakers. Experience style and functionality in a single step.",
    image: "/categories/tshirts.jpg",
    href: "/clothings/hood-wears/t-shirts",
  },
  {
    title: "SHIRTS",
    description: "Style and comfort meet in our collection of jeans. Discover the latest trends and perfect cuts for an impeccable look.",
    image: "/categories/shirts.jpg",
    href: "/clothings/hood-wears/shirts",
    span: "md:row-span-2"
  },
  {
    title: "SNEAKERS",
    description: "Passion for fashion and comfort is reflected in every pair of sneakers. Experience style and functionality in a single step.",
    image: "/categories/sneakers.jpg",
    href: "/accessories/sneakers",
    span: "md:col-span-2"
  },
];

export default function Categories() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 1], [0.95, 1, 1]);

  return (
    <section 
      ref={sectionRef} 
      className="relative z-20 min-h-screen bg-gray-200 rounded-t-3xl py-10 md:py-10 overflow-hidden"
    >
      <motion.div style={{ scale }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-wider mb-2">
              ELEVATING YOUR STYLE GAME
            </h2>
            <p className="font-body text-sm md:text-base text-foreground/70 max-w-3xl mx-auto  tracking-wide">
              Discover the perfect blend of comfort and trend with our exclusive collection. 
              Explore deals on jeans, sneakers, and more!
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[320px]">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-lg bg-foreground/5 ${category.span || ''}`}
              >
                <Link href={category.href} className="block w-full h-full">
                  {/* Image with overlay */}
                  <div className="relative w-full h-full overflow-hidden">
                    {/* Placeholder - replace with actual images */}
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
                      <span className="font-heading text-6xl text-foreground/10">
                        {category.title[0]}
                      </span>
                    </div>
                    
                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                      <motion.div
                        initial={false}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white mb-3 tracking-wide">
                          {category.title}
                        </h3>
                        <p className="font-body text-sm md:text-base text-white/90 leading-relaxed line-clamp-3 md:line-clamp-4">
                          {category.description}
                        </p>
                      </motion.div>
                      
                      {/* Hover arrow */}
                      <motion.div
                        className="absolute bottom-6 right-6 md:bottom-8 md:right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}