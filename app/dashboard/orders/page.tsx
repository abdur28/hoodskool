'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, XCircle, ChevronDown, Eye } from 'lucide-react';
import Image from 'next/image';

const mockOrders = [
  {
    id: '#HS-001',
    date: '2025-10-05',
    status: 'delivered',
    total: '$185.00',
    items: [
      {
        name: 'Classic Black Hoodie',
        price: 75.00,
        quantity: 1,
        size: 'L',
        image: '/banner/HoodSkool_банер правка.jpg',
      },
      {
        name: 'Premium Leather Jacket',
        price: 110.00,
        quantity: 1,
        size: 'L',
        image: '/DSC05257 (1).jpg',
      },
    ],
    shipping: {
      address: '123 Street Name, City, State 12345',
      method: 'Standard Shipping',
      tracking: 'TRK123456789',
    },
  },
  {
    id: '#HS-002',
    date: '2025-10-03',
    status: 'shipped',
    total: '$95.00',
    items: [
      {
        name: 'Urban Denim Jeans',
        price: 95.00,
        quantity: 1,
        size: '32',
        image: '/HoodSkool_Catalog_0408202313209_resized.jpg',
      },
    ],
    shipping: {
      address: '123 Street Name, City, State 12345',
      method: 'Express Shipping',
      tracking: 'TRK987654321',
    },
  },
  {
    id: '#HS-003',
    date: '2025-09-28',
    status: 'delivered',
    total: '$145.00',
    items: [
      {
        name: 'Vintage T-Shirt',
        price: 45.00,
        quantity: 2,
        size: 'M',
        image: '/HoodSkool_Catalog_0408202312555 1_resized.jpg',
      },
      {
        name: 'Street Bucket Hat',
        price: 35.00,
        quantity: 1,
        size: 'One Size',
        image: '/HoodSkool_0408202445315 - Copy.jpg',
      },
    ],
    shipping: {
      address: '123 Street Name, City, State 12345',
      method: 'Standard Shipping',
      tracking: 'TRK456789123',
    },
  },
];

const statusConfig = {
  delivered: {
    color: 'bg-green-500/10 text-green-700',
    icon: CheckCircle,
    label: 'Delivered',
  },
  shipped: {
    color: 'bg-blue-500/10 text-blue-700',
    icon: Truck,
    label: 'Shipped',
  },
  processing: {
    color: 'bg-yellow-500/10 text-yellow-700',
    icon: Package,
    label: 'Processing',
  },
  cancelled: {
    color: 'bg-red-500/10 text-red-700',
    icon: XCircle,
    label: 'Cancelled',
  },
};

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = filterStatus === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === filterStatus);

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
          ORDERS
        </h1>
        <p className="font-body text-sm text-foreground/60">
          View and track your order history
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-2 mb-6 overflow-x-auto"
      >
        {['all', 'delivered', 'shipped', 'processing', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-md font-body text-sm font-medium whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-black text-white'
                : 'bg-white border border-foreground/10 hover:border-[#F8E231]'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order, index) => {
          const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
          const isExpanded = expandedOrder === order.id;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-white border border-foreground/10 rounded-lg overflow-hidden"
            >
              {/* Order Header */}
              <button
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-foreground/5 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 bg-foreground/5 rounded-md">
                    <StatusIcon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-body font-semibold">
                        Order {order.id}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusConfig[order.status as keyof typeof statusConfig].color}`}>
                        {statusConfig[order.status as keyof typeof statusConfig].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-foreground/60">
                      <span>{new Date(order.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{order.items.length} items</span>
                      <span>•</span>
                      <span className="font-semibold">{order.total}</span>
                    </div>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* Order Details */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-foreground/10"
                >
                  {/* Items */}
                  <div className="p-6 space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-foreground/5 rounded-md overflow-hidden flex-shrink-0">
                          <div className="w-full h-full flex items-center justify-center text-foreground/20 text-xs">
                            IMAGE
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-body font-semibold text-sm mb-1">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-foreground/60">
                            <span>Size: {item.size}</span>
                            <span>•</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-body font-semibold text-sm">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info */}
                  <div className="p-6 bg-foreground/5 border-t border-foreground/10">
                    <h4 className="font-body font-semibold text-sm mb-3">
                      Shipping Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-foreground/60">
                        <span className="font-medium text-foreground">Address:</span>{' '}
                        {order.shipping.address}
                      </p>
                      <p className="text-foreground/60">
                        <span className="font-medium text-foreground">Method:</span>{' '}
                        {order.shipping.method}
                      </p>
                      {order.shipping.tracking && (
                        <p className="text-foreground/60">
                          <span className="font-medium text-foreground">Tracking:</span>{' '}
                          {order.shipping.tracking}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 border-t border-foreground/10 flex gap-3">
                    <button className="px-4 py-2 border border-foreground/20 hover:border-[#F8E231] transition-colors rounded-md font-body text-sm font-medium flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                    {order.status === 'delivered' && (
                      <button className="px-4 py-2 bg-black text-white hover:bg-[#F8E231] hover:text-black transition-colors rounded-md font-body text-sm font-medium">
                        Buy Again
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button className="px-4 py-2 bg-black text-white hover:bg-[#F8E231] hover:text-black transition-colors rounded-md font-body text-sm font-medium">
                        Track Package
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <Package className="h-16 w-16 text-foreground/20 mb-4" />
          <h2 className="font-heading text-2xl tracking-wider mb-2">
            NO ORDERS FOUND
          </h2>
          <p className="font-body text-sm text-foreground/60">
            No orders match the selected filter
          </p>
        </motion.div>
      )}
    </div>
  );
}