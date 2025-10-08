'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Trash2, Check, Star } from 'lucide-react';

const mockPaymentMethods = [
  {
    id: '1',
    type: 'visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2026',
    cardholderName: 'John Doe',
    isPrimary: true,
  },
  {
    id: '2',
    type: 'mastercard',
    last4: '8888',
    expiryMonth: '06',
    expiryYear: '2027',
    cardholderName: 'John Doe',
    isPrimary: false,
  },
];

const cardTypeColors = {
  visa: 'from-blue-500 to-blue-700',
  mastercard: 'from-orange-500 to-red-600',
  amex: 'from-green-500 to-emerald-700',
  discover: 'from-purple-500 to-indigo-700',
};

export default function PaymentPage() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [showAddCard, setShowAddCard] = useState(false);

  const removeCard = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
  };

  const setPrimary = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isPrimary: method.id === id,
      }))
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="font-heading text-4xl md:text-5xl tracking-wider mb-2">
          PAYMENT METHODS
        </h1>
        <p className="font-body text-sm text-foreground/60">
          Manage your saved payment methods
        </p>
      </motion.div>

      {/* Add Card Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onClick={() => setShowAddCard(!showAddCard)}
        className="w-full mb-6 p-6 border-2 border-dashed border-foreground/20 hover:border-[#F8E231] rounded-lg transition-colors flex items-center justify-center gap-2 group"
      >
        <Plus className="h-5 w-5 group-hover:text-[#F8E231] transition-colors" />
        <span className="font-body font-medium group-hover:text-[#F8E231] transition-colors">
          Add New Payment Method
        </span>
      </motion.button>

      {/* Add Card Form */}
      {showAddCard && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-6 bg-white border border-foreground/10 rounded-lg"
        >
          <h2 className="font-body font-semibold mb-4">Add New Card</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-body text-sm font-medium mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-foreground/20 rounded-md focus:border-[#F8E231] focus:outline-none transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm font-medium mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-foreground/20 rounded-md focus:border-[#F8E231] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 border border-foreground/20 rounded-md focus:border-[#F8E231] focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block font-body text-sm font-medium mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-foreground/20 rounded-md focus:border-[#F8E231] focus:outline-none transition-colors"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddCard(false)}
                className="flex-1 px-4 py-3 border border-foreground/20 hover:border-[#F8E231] transition-colors rounded-md font-body text-sm font-medium"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-3 bg-black text-white hover:bg-[#F8E231] hover:text-black transition-colors rounded-md font-body text-sm font-medium">
                Add Card
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.map((method, index) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="relative"
          >
            {/* Card Display */}
            <div className={`relative p-6 rounded-lg bg-gradient-to-br ${cardTypeColors[method.type as keyof typeof cardTypeColors]} text-white overflow-hidden group`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>

              {/* Card Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-80 mb-1">
                      {method.type}
                    </p>
                    <p className="text-2xl font-mono tracking-wider">
                      •••• •••• •••• {method.last4}
                    </p>
                  </div>
                  {method.isPrimary && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-md">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs font-medium">Primary</span>
                    </div>
                  )}
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-80 mb-1">
                      Cardholder
                    </p>
                    <p className="font-medium">{method.cardholderName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider opacity-80 mb-1">
                      Expires
                    </p>
                    <p className="font-medium">
                      {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => removeCard(method.id)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-red-500 rounded-md transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="mt-3 flex gap-3">
              {!method.isPrimary && (
                <button
                  onClick={() => setPrimary(method.id)}
                  className="flex items-center gap-2 px-4 py-2 border border-foreground/20 hover:border-[#F8E231] transition-colors rounded-md font-body text-sm"
                >
                  <Star className="h-4 w-4" />
                  Set as Primary
                </button>
              )}
              <button className="px-4 py-2 border border-foreground/20 hover:border-[#F8E231] transition-colors rounded-md font-body text-sm">
                Edit
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-8 p-6 bg-foreground/5 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-500/10 rounded-md">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-body font-semibold mb-1">Secure Payment Processing</h3>
            <p className="font-body text-sm text-foreground/60">
              Your payment information is encrypted and securely stored. We never store your full card details on our servers.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}