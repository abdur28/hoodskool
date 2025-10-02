'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import CrossedLink from '../ui/crossed-link';

const navigationLinks = [
  { name: 'Clothings', href: '/clothings' },
  { name: 'Accessories', href: '/accessories' },
  { name: 'Candles & Matches', href: '/candles-matches' },
  { name: 'Artwork', href: '/artwork' },
  { name: 'Hoodhub', href: '/hoodhub' },
  { name: 'Contact', href: '/contact' },
];

export default function HomeNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check scroll position on mount (for page refresh)
    const checkScrollPosition = () => {
      const heroHeight = window.innerHeight * 0.9;
      setIsScrolled(window.scrollY > heroHeight);
    };

    // Check immediately on mount
    checkScrollPosition();

    // Then listen for scroll events
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.95;
      setIsScrolled(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      initial={{ backgroundColor: 'transparent' }}
      animate={{
        backgroundColor: isScrolled ? 'hsl(var(--background))' : 'transparent',
      }}
    >
      {/* Border appears when scrolled */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-foreground/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${isScrolled ? 'bg-white' : ''}`}>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Mobile Menu (only when scrolled) + Logo */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Mobile Menu - shows when scrolled */}
            <AnimatePresence>
              {isScrolled && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                      <button
                        className="md:hidden p-2 hover:bg-foreground/5 rounded-md transition-colors"
                        aria-label="Toggle menu"
                      >
                        {isOpen ? (
                          <X className="h-6 w-6" />
                        ) : (
                          <Menu className="h-6 w-6" />
                        )}
                      </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full">
                      <nav className="flex flex-col gap-6 mt-8">
                        {navigationLinks.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="font-body text-xl hover:text-foreground/60 transition-colors"
                          >
                            {link.name}
                          </Link>
                        ))}
                      </nav>
                    </SheetContent>
                  </Sheet>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/hoodskool-logo.png"
                alt="Hoodskool"
                width={150}
                height={90}
                className="h-10 md:h-14 w-auto"
              />
            </Link>
          </div>
         
          <div className="flex items-center md:block hidden">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/hoodskool-logo.png"
                alt="Hoodskool"
                width={150}
                height={90}
                className="h-10 md:h-14 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation - shows when scrolled */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div
                className="hidden md:flex items-center gap-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {navigationLinks.map((link) => (
                  <CrossedLink
                    key={link.name}
                    href={link.href}
                    lineColor="gold"
                    className="font-body text-sm transition-colors"
                  >
                    {link.name}
                  </CrossedLink>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right: Icons - always visible */}
          <div className="flex items-center gap-4">
            <button
              className="p-2 hover:bg-foreground/5 rounded-md transition-colors"
              aria-label="Search"
            >
              <Search className={`h-5 w-5 `} />
            </button>
            <Link
              href="/profile"
              className="p-2 hover:bg-foreground/5 rounded-md transition-colors"
              aria-label="Profile"
            >
              <User className={`h-5 w-5 `} />
            </Link>
            <Link
              href="/cart"
              className="p-2 hover:bg-foreground/5 rounded-md transition-colors relative"
              aria-label="Shopping cart"
            >
              <ShoppingBag className={`h-5 w-5`} />
              {/* Cart count badge */}
              <span className={`absolute -top-1 -right-1 text-xs w-5 h-5 rounded-full flex items-center justify-center bg-foreground text-background`}>
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}