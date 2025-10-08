'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, ShoppingBag, Heart, Package, TrendingUp } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function PreferencesPage() {
  const [emailNotifications, setEmailNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newArrivals: false,
    wishlistAlerts: true,
    newsletter: true,
  });

  const [pushNotifications, setPushNotifications] = useState({
    orderStatus: true,
    promotions: false,
    restockAlerts: true,
  });

  const [emailFrequency, setEmailFrequency] = useState('daily');
  const [currency, setCurrency] = useState('usd');
  const [language, setLanguage] = useState('en');

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
          PREFERENCES
        </h1>
        <p className="font-body text-sm text-foreground/60">
          Customize your shopping experience
        </p>
      </motion.div>

      {/* Email Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 p-6 bg-white border border-foreground/10 rounded-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-foreground/5 rounded-md">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-body font-semibold">Email Notifications</h2>
            <p className="font-body text-sm text-foreground/60">
              Manage your email preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: 'orderUpdates', label: 'Order Updates', description: 'Get updates about your order status' },
            { key: 'promotions', label: 'Promotions & Offers', description: 'Exclusive deals and discount codes' },
            { key: 'newArrivals', label: 'New Arrivals', description: 'Be first to know about new products' },
            { key: 'wishlistAlerts', label: 'Wishlist Alerts', description: 'Price drops and restock notifications' },
            { key: 'newsletter', label: 'Newsletter', description: 'Monthly newsletter with style tips' },
          ].map((item) => (
            <div key={item.key} className="flex items-start gap-3 p-3 hover:bg-foreground/5 rounded-md transition-colors">
              <Checkbox
                id={item.key}
                checked={emailNotifications[item.key as keyof typeof emailNotifications]}
                onCheckedChange={(checked) => 
                  setEmailNotifications(prev => ({ ...prev, [item.key]: checked }))
                }
                className="mt-1"
              />
              <Label htmlFor={item.key} className="flex-1 cursor-pointer">
                <div>
                  <p className="font-body font-medium text-sm">{item.label}</p>
                  <p className="font-body text-xs text-foreground/60">{item.description}</p>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Push Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6 p-6 bg-white border border-foreground/10 rounded-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-foreground/5 rounded-md">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-body font-semibold">Push Notifications</h2>
            <p className="font-body text-sm text-foreground/60">
              Browser and mobile notifications
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: 'orderStatus', label: 'Order Status', description: 'Real-time order tracking updates' },
            { key: 'promotions', label: 'Flash Sales', description: 'Limited time offers and sales' },
            { key: 'restockAlerts', label: 'Restock Alerts', description: 'When wishlist items are back' },
          ].map((item) => (
            <div key={item.key} className="flex items-start gap-3 p-3 hover:bg-foreground/5 rounded-md transition-colors">
              <Checkbox
                id={`push-${item.key}`}
                checked={pushNotifications[item.key as keyof typeof pushNotifications]}
                onCheckedChange={(checked) => 
                  setPushNotifications(prev => ({ ...prev, [item.key]: checked }))
                }
                className="mt-1"
              />
              <Label htmlFor={`push-${item.key}`} className="flex-1 cursor-pointer">
                <div>
                  <p className="font-body font-medium text-sm">{item.label}</p>
                  <p className="font-body text-xs text-foreground/60">{item.description}</p>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Email Frequency */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6 p-6 bg-white border border-foreground/10 rounded-lg"
      >
        <h2 className="font-body font-semibold mb-4">Email Frequency</h2>
        <RadioGroup value={emailFrequency} onValueChange={setEmailFrequency}>
          <div className="space-y-3">
            {[
              { value: 'realtime', label: 'Real-time', description: 'Get emails as soon as something happens' },
              { value: 'daily', label: 'Daily Digest', description: 'One email per day with all updates' },
              { value: 'weekly', label: 'Weekly Summary', description: 'Weekly roundup of activity' },
            ].map((option) => (
              <div key={option.value} className="flex items-start gap-3 p-3 hover:bg-foreground/5 rounded-md transition-colors">
                <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-body font-medium text-sm">{option.label}</p>
                    <p className="font-body text-xs text-foreground/60">{option.description}</p>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </motion.div>

      {/* Regional Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-6 p-6 bg-white border border-foreground/10 rounded-lg"
      >
        <h2 className="font-body font-semibold mb-4">Regional Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-sm font-medium mb-2">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 border border-foreground/20 rounded-md focus:border-[#F8E231] focus:outline-none transition-colors"
            >
              <option value="usd">USD - US Dollar</option>
              <option value="eur">EUR - Euro</option>
              <option value="gbp">GBP - British Pound</option>
              <option value="jpy">JPY - Japanese Yen</option>
            </select>
          </div>
          <div>
            <label className="block font-body text-sm font-medium mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 border border-foreground/20 rounded-md focus:border-[#F8E231] focus:outline-none transition-colors"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex justify-end"
      >
        <button className="px-6 py-3 bg-black text-white hover:bg-[#F8E231] hover:text-black transition-colors rounded-md font-body text-sm font-medium">
          Save Preferences
        </button>
      </motion.div>
    </div>
  );
}