"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight, Filter, X, Grid3x3, Grid2x2, LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProductCard, { Product } from "@/components/ProductCard";
import CategoryFilter from "./CategoryFilter";
import CategorySort from "./CategorySort";
import Breadcrumbs from "./Breadcrumbs";
import { cn } from "@/lib/utils";

interface CategoryPageProps {
  title: string;
  description?: string;
  suggestions?: string[];
  products: Product[];
  categories?: string[];
  currentCategory?: string;
  breadcrumbs?: { label: string; href: string }[];
}

export default function CategoryPage({
  title,
  description,
  suggestions = [],
  products,
  categories = [],
  currentCategory,
  breadcrumbs = [],
}: CategoryPageProps) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridView, setGridView] = useState<2 | 3 | 4>(3);
  const [sortBy, setSortBy] = useState("featured");
  
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const handleFilter = (filters: any) => {
    // Implement filtering logic here
    console.log("Filters applied:", filters);
  };

  const handleSort = (sortValue: string) => {
    setSortBy(sortValue);
    // Implement sorting logic here
    let sorted = [...filteredProducts];
    switch(sortValue) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Sort by date if you have it
        break;
      default:
        sorted = products;
    }
    setFilteredProducts(sorted);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Parallax */}
      <section
        ref={heroRef}
        className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-black"
      >
        {/* Parallax Background */}
        <motion.div
          style={{ y, scale }}
          className="absolute inset-0"
        >
          <Image
            src="/banner/HoodSkool_банер 1 _resized.jpg"
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity }}
          className="relative h-full flex items-center justify-center text-center px-6"
        >
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-body text-xs tracking-[0.3em] text-[#F8E231] mb-2 uppercase"
            >
              Collection
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-5xl md:text-6xl lg:text-7xl tracking-wider text-white mb-4"
            >
              {title.toUpperCase()}
            </motion.h1>
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-body text-sm md:text-base text-white/80 max-w-2xl mx-auto"
              >
                {description}
              </motion.p>
            )}
          </div>
        </motion.div>
      </section>

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Categories Bar */}
      {categories.length > 0 && (
        <CategoryBar 
          categories={categories} 
          currentCategory={currentCategory}
        />
      )}

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto">
        <div className="flex">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden fixed bottom-6 right-6 z-40 p-4 bg-black text-white rounded-full shadow-2xl"
          >
            <Filter className="h-5 w-5" />
          </button>

          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block w-64 p-6 sticky top-20 h-fit">
            <CategoryFilter onFilter={handleFilter} />
          </aside>

          {/* Products Section */}
          <main className="flex-1 p-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8">
              <p className="font-body text-sm text-foreground/60">
                {filteredProducts.length} Products
              </p>
              
              <div className="flex items-center gap-4">
                {/* Grid View Toggle */}
                <div className="hidden md:flex items-center gap-1 p-1 bg-foreground/5 rounded-md">
                  <button
                    onClick={() => setGridView(2)}
                    className={cn(
                      "p-2 rounded transition-colors",
                      gridView === 2 ? "bg-black text-white" : "hover:bg-foreground/10"
                    )}
                  >
                    <Grid2x2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setGridView(3)}
                    className={cn(
                      "p-2 rounded transition-colors",
                      gridView === 3 ? "bg-black text-white" : "hover:bg-foreground/10"
                    )}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setGridView(4)}
                    className={cn(
                      "p-2 rounded transition-colors",
                      gridView === 4 ? "bg-black text-white" : "hover:bg-foreground/10"
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <CategorySort value={sortBy} onChange={handleSort} />
              </div>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <p className="font-body text-xs text-foreground/60 mb-3">
                  SUGGESTED SEARCHES
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-4 py-2 border border-foreground/20 rounded-full hover:bg-[#F8E231] hover:text-black hover:border-[#F8E231] transition-all font-body text-sm"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Products Grid */}
            <div className={cn(
              "grid gap-2 md:gap-2",
              gridView === 2 && "grid-cols-1 sm:grid-cols-2",
              gridView === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
              gridView === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            )}>
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index}
                />
              ))}
            </div>

            {/* Load More */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <button className="px-8 py-3 bg-black text-white hover:bg-[#F8E231] hover:text-black transition-all font-body text-sm font-medium">
                Load More Products
              </button>
            </motion.div>
          </main>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        onFilter={handleFilter}
      />
    </div>
  );
}

// Category Bar Component
function CategoryBar({ 
  categories, 
  currentCategory 
}: { 
  categories: string[]; 
  currentCategory?: string;
}) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <div className="bg-foreground/5 overflow-x-auto">
      <div className="flex">
        {categories.map((category, index) => (
          <motion.div
            key={category}
            className="relative flex-1"
            onMouseEnter={() => setHoveredCategory(category)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Link
              href={`/clothings/${category.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                "block py-4 px-6 text-center font-body text-sm transition-all relative overflow-hidden",
                currentCategory === category ? "bg-black text-white" : "hover:bg-foreground/10"
              )}
            >
              <motion.div
                className="absolute inset-0 bg-[#F8E231]"
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: hoveredCategory === category ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ originX: 0 }}
              />
              <span className={cn(
                "relative z-10 transition-colors",
                hoveredCategory === category && "text-black"
              )}>
                {category}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Mobile Filter Sheet
function MobileFilterSheet({ 
  isOpen, 
  onClose, 
  onFilter 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onFilter: (filters: any) => void;
}) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="fixed inset-y-0 right-0 w-full sm:w-96 bg-background z-50 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl tracking-wider">FILTERS</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-foreground/5 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <CategoryFilter onFilter={onFilter} />
      </div>
    </motion.div>
  );
}