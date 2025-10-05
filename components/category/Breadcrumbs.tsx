"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="px-6 py-4 bg-white">
      <ol className="flex items-center gap-2 text-sm font-body max-w-[1400px] mx-auto">
        <li>
          <Link 
            href="/" 
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <motion.li 
            key={item.href}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-3 w-3 text-foreground/40" />
            {index === items.length - 1 ? (
              <span className="text-foreground font-medium">{item.label}</span>
            ) : (
              <Link 
                href={item.href}
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </motion.li>
        ))}
      </ol>
    </nav>
  );
}