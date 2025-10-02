import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import CrossedLink from '@/components/ui/crossed-link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock cart data - replace with your actual cart state
const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Black Hoodie',
    price: 75.00,
    quantity: 1,
    image: '/placeholder-product.jpg',
    size: 'L',
    color: 'Black',
  },
  {
    id: '2',
    name: 'Bucket Hat',
    price: 35.00,
    quantity: 2,
    image: '/placeholder-product.jpg',
    color: 'Navy',
  },
];

export default function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-3 right-3 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] md:right-4 md:inset-y-4 md:max-w-md bg-background z-50 overflow-hidden rounded-lg shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="font-heading text-lg tracking-wider">
                  CART ({cartItems.length})
                </h2>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 -mr-2 hover:bg-foreground/5 rounded-md transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartItems.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-16 w-16 text-foreground/20 mb-4" />
                  <h3 className="font-heading text-xl mb-2">Your cart is empty</h3>
                  <p className="text-sm text-foreground/60 mb-6">
                    Add some items to get started
                  </p>
                  <Link
                    href="/clothings"
                    className="inline-block px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md font-body text-sm"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                // Cart Items List
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 pb-6 border-b border-foreground/10 last:border-0"
                    >
                      {/* Product Image */}
                      <div className="relative w-24 h-24 bg-foreground/5 rounded-md overflow-hidden flex-shrink-0">
                        <div className="w-full h-full flex items-center justify-center text-foreground/20 text-xs">
                          IMAGE
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-body font-medium text-sm mb-1 truncate">
                              {item.name}
                            </h3>
                            {item.size && (
                              <p className="text-xs text-foreground/60">Size: {item.size}</p>
                            )}
                            {item.color && (
                              <p className="text-xs text-foreground/60">Color: {item.color}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 hover:bg-foreground/5 rounded transition-colors ml-2"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4 text-foreground/60" />
                          </button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 border border-foreground/20 rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-2 hover:bg-foreground/5 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-body text-sm w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-2 hover:bg-foreground/5 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-body font-semibold text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Totals and Checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-foreground/10 bg-background">
                {/* Subtotal and Shipping */}
                <div className="px-6 py-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60">Subtotal</span>
                    <span className="font-body font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60">Shipping</span>
                    <span className="font-body font-medium">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal < 100 && (
                    <p className="text-xs text-foreground/60 pt-1">
                      Free shipping on orders over $100
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
                    <span className="font-heading text-base">TOTAL</span>
                    <span className="font-heading text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 pb-6 space-y-3">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="block w-full py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md font-body text-sm text-center font-medium"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/clothings"
                    onClick={onClose}
                    className="block w-full py-3 border border-foreground/20 hover:bg-foreground/5 transition-colors rounded-md font-body text-sm text-center"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}