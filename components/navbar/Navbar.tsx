'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Search, User, ShoppingBag } from 'lucide-react';
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-foreground/10">
      <div className="mx-auto bg-white px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Mobile Menu + Logo - Mobile */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 hover:bg-foreground/5 rounded-md transition-colors"
                  aria-label="Toggle menu"
                >
                  {isOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
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

            {/* Logo - Mobile */}
            <Link href="/" className="flex items-center">
              <Image
                src="/hoodskool-logo.png"
                alt="Hoodskool"
                width={150}
                height={90}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Left: Logo - Desktop */}
          <div className="hidden md:flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/hoodskool-logo.png"
                alt="Hoodskool"
                width={150}
                height={90}
                className="h-14 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
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
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-4">
            <button
              className="p-2 hover:bg-foreground/5 rounded-md transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/profile"
              className="p-2 hover:bg-foreground/5 rounded-md transition-colors"
              aria-label="Profile"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/cart"
              className="p-2 hover:bg-foreground/5 rounded-md transition-colors relative"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {/* Cart count badge */}
              <span className="absolute -top-1 -right-1 bg-foreground text-background text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}