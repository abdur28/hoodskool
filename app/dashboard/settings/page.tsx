'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, MapPin, Shield, Trash2, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          SETTINGS
        </h1>
        <p className="font-body text-sm text-foreground/60">
          Manage your account settings and security
        </p>
      </motion.div>

      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 p-6 bg-white border border-foreground/10 rounded-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-foreground/5 rounded-md">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-body font-semibold">Profile Information</h2>
            <p className="font-body text-sm text-foreground/60">
              Update your personal details
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="mb-2">First Name</Label>
              <Input id="firstName" defaultValue="John" />
            </div>
            <div>
              <Label htmlFor="lastName" className="mb-2">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" />
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="mb-2">Email Address</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
          <div>
            <Label htmlFor="phone" className="mb-2">Phone Number</Label>
            <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
          </div>
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-black text-white hover:bg-[#F8E231] hover:text-black transition-colors rounded-md font-body text-sm font-medium">
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>

      {/* Shipping Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6 p-6 bg-white border border-foreground/10 rounded-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-foreground/5 rounded-md">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-body font-semibold">Default Shipping Address</h2>
            <p className="font-body text-sm text-foreground/60">
              Your primary delivery address
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="address" className="mb-2">Street Address</Label>
            <Input id="address" defaultValue="123 Street Name" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="mb-2">City</Label>
              <Input id="city" defaultValue="New York" />
            </div>
            <div>
              <Label htmlFor="state" className="mb-2">State/Province</Label>
              <Input id="state" defaultValue="NY" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode" className="mb-2">ZIP/Postal Code</Label>
              <Input id="zipCode" defaultValue="10001" />
            </div>
            <div>
              <Label htmlFor="country" className="mb-2">Country</Label>
              <Input id="country" defaultValue="United States" />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-black text-white hover:bg-[#F8E231] hover:text-black transition-colors rounded-md font-body text-sm font-medium">
              Save Address
            </button>
          </div>
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6 p-6 bg-white border border-foreground/10 rounded-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-foreground/5 rounded-md">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-body font-semibold">Change Password</h2>
            <p className="font-body text-sm text-foreground/60">
              Update your account password
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="mb-2">Current Password</Label>
            <div className="relative">
              <Input 
                id="currentPassword" 
                type={showPassword ? 'text' : 'password'} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="newPassword" className="mb-2">New Password</Label>
            <div className="relative">
              <Input 
                id="newPassword" 
                type={showNewPassword ? 'text' : 'password'} 
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="mb-2">Confirm New Password</Label>
            <div className="relative">
              <Input 
                id="confirmPassword" 
                type={showConfirmPassword ? 'text' : 'password'} 
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-black text-white hover:bg-[#F8E231] hover:text-black transition-colors rounded-md font-body text-sm font-medium">
              Update Password
            </button>
          </div>
        </div>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-6 p-6 bg-white border border-foreground/10 rounded-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-foreground/5 rounded-md">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-body font-semibold">Privacy & Security</h2>
            <p className="font-body text-sm text-foreground/60">
              Manage your data and security settings
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full p-4 border border-foreground/10 hover:border-[#F8E231] rounded-md text-left transition-colors group">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body font-medium text-sm">Two-Factor Authentication</p>
                <p className="font-body text-xs text-foreground/60">Add an extra layer of security</p>
              </div>
              <span className="px-3 py-1 bg-foreground/5 group-hover:bg-[#F8E231] rounded-md text-xs font-medium transition-colors">
                Enable
              </span>
            </div>
          </button>

          <button className="w-full p-4 border border-foreground/10 hover:border-[#F8E231] rounded-md text-left transition-colors group">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body font-medium text-sm">Download Your Data</p>
                <p className="font-body text-xs text-foreground/60">Export all your account data</p>
              </div>
              <span className="px-3 py-1 bg-foreground/5 group-hover:bg-[#F8E231] rounded-md text-xs font-medium transition-colors">
                Download
              </span>
            </div>
          </button>

          <button className="w-full p-4 border border-foreground/10 hover:border-[#F8E231] rounded-md text-left transition-colors group">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body font-medium text-sm">Login Activity</p>
                <p className="font-body text-xs text-foreground/60">View recent login sessions</p>
              </div>
              <span className="px-3 py-1 bg-foreground/5 group-hover:bg-[#F8E231] rounded-md text-xs font-medium transition-colors">
                View
              </span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="p-6 bg-red-50 border border-red-200 rounded-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-md">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="font-body font-semibold text-red-900">Danger Zone</h2>
            <p className="font-body text-sm text-red-700">
              Irreversible actions
            </p>
          </div>
        </div>

        <button className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-md font-body text-sm font-medium">
          Delete Account
        </button>
      </motion.div>
    </div>
  );
}