'use client';

import { motion } from 'framer-motion';
import { Package, Heart, CreditCard, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import CrossedLink from '@/components/ui/crossed-link';

const stats = [
  {
    name: 'Total Orders',
    value: '12',
    icon: Package,
    change: '+2 this month',
    changeType: 'positive',
    href: '/dashboard/orders',
  },
  {
    name: 'Wishlist Items',
    value: '8',
    icon: Heart,
    change: '3 in stock',
    changeType: 'neutral',
    href: '/dashboard/wishlist',
  },
  {
    name: 'Payment Methods',
    value: '2',
    icon: CreditCard,
    change: '1 primary',
    changeType: 'neutral',
    href: '/dashboard/payment',
  },
  {
    name: 'Total Spent',
    value: '$1,247',
    icon: TrendingUp,
    change: '+$180 this month',
    changeType: 'positive',
    href: '/dashboard/orders',
  },
];

const recentOrders = [
  {
    id: '#HS-001',
    date: '2025-10-05',
    status: 'delivered',
    total: '$185.00',
    items: 2,
    image: '/banner/HoodSkool_банер правка.jpg',
  },
  {
    id: '#HS-002',
    date: '2025-10-03',
    status: 'shipped',
    total: '$95.00',
    items: 1,
    image: '/HoodSkool_Catalog_0408202312555 1_resized.jpg',
  },
  {
    id: '#HS-003',
    date: '2025-09-28',
    status: 'delivered',
    total: '$145.00',
    items: 3,
    image: '/DSC05257 (1).jpg',
  },
];

const statusColors = {
  delivered: 'bg-green-500/10 text-green-700',
  shipped: 'bg-blue-500/10 text-blue-700',
  processing: 'bg-yellow-500/10 text-yellow-700',
  cancelled: 'bg-red-500/10 text-red-700',
};

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="font-heading text-4xl md:text-5xl tracking-wider mb-2">
          DASHBOARD
        </h1>
        <p className="font-body text-sm text-foreground/60">
          Welcome back! Here's your account overview.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={stat.href}
                className="block p-6 bg-white border border-foreground/10 rounded-lg hover:border-[#F8E231] transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-foreground/5 rounded-md group-hover:bg-[#F8E231] transition-colors">
                    <Icon className="h-5 w-5 text-foreground/60 group-hover:text-black transition-colors" />
                  </div>
                  <span className="text-xs font-body text-foreground/40">
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="font-heading text-3xl tracking-wider mb-1">
                    {stat.value}
                  </p>
                  <p className="font-body text-sm text-foreground/60">
                    {stat.name}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white border border-foreground/10 rounded-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl tracking-wider">
            RECENT ORDERS
          </h2>
          <CrossedLink href="/dashboard/orders" lineColor="gold">
            <span className="font-body text-sm text-foreground/60">
              View All
            </span>
          </CrossedLink>
        </div>

        <div className="space-y-4">
          {recentOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-4 p-4 border border-foreground/10 rounded-lg hover:border-[#F8E231] transition-colors"
            >
              {/* Image */}
              <div className="relative w-16 h-16 bg-foreground/5 rounded-md overflow-hidden flex-shrink-0">
                <div className="w-full h-full flex items-center justify-center text-foreground/20 text-xs">
                  IMAGE
                </div>
              </div>

              {/* Order Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-body font-semibold text-sm">
                    Order {order.id}
                  </h3>
                  <span className="font-body font-semibold text-sm">
                    {order.total}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-foreground/60">
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{order.items} items</span>
                  <span className={`px-2 py-0.5 rounded-full ${statusColors[order.status as keyof typeof statusColors]}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <ArrowRight className="h-5 w-5 text-foreground/40 flex-shrink-0" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className="font-heading text-2xl tracking-wider mb-4">
          QUICK ACTIONS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/clothings"
            className="p-6 bg-black text-white rounded-lg hover:bg-[#F8E231] hover:text-black transition-colors group"
          >
            <h3 className="font-body font-semibold mb-2">Continue Shopping</h3>
            <p className="font-body text-sm opacity-80">
              Browse our latest collection
            </p>
            <ArrowRight className="h-5 w-5 mt-4" />
          </Link>

          <Link
            href="/dashboard/wishlist"
            className="p-6 border border-foreground/10 rounded-lg hover:border-[#F8E231] transition-colors group"
          >
            <h3 className="font-body font-semibold mb-2">View Wishlist</h3>
            <p className="font-body text-sm text-foreground/60">
              8 items waiting for you
            </p>
            <Heart className="h-5 w-5 mt-4 text-foreground/60 group-hover:text-[#F8E231]" />
          </Link>

          <Link
            href="/dashboard/orders"
            className="p-6 border border-foreground/10 rounded-lg hover:border-[#F8E231] transition-colors group"
          >
            <h3 className="font-body font-semibold mb-2">Track Orders</h3>
            <p className="font-body text-sm text-foreground/60">
              1 order in transit
            </p>
            <Package className="h-5 w-5 mt-4 text-foreground/60 group-hover:text-[#F8E231]" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}