"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Package, DollarSign } from "lucide-react";
import { ProductVariant } from "@/types/admin";
import { Color } from "@/types/types";

interface VariantManagerProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  defaultPrice: number;
  availableSizes: string[];
  availableColors: Color[];
}

export default function VariantManager({
  variants,
  onChange,
  defaultPrice,
  availableSizes,
  availableColors,
}: VariantManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [formData, setFormData] = useState<Partial<ProductVariant>>({
    size: "",
    color: undefined,
    sku: "",
    price: undefined,
    stockCount: 0,
    inStock: true,
  });

  const generateVariantId = () => {
    return `variant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateVariantSKU = (size?: string, color?: Color) => {
    const parts = [];
    if (size) parts.push(size.toUpperCase());
    if (color) parts.push(color.name.toUpperCase().replace(/\s+/g, ""));
    return parts.join("-") + "-" + Date.now().toString().slice(-4);
  };

  const openAddDialog = () => {
    setEditingVariant(null);
    setFormData({
      size: "",
      color: undefined,
      sku: "",
      price: undefined,
      stockCount: 0,
      inStock: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setFormData({
      size: variant.size || "",
      color: variant.color || undefined,
      sku: variant.sku,
      price: variant.price,
      stockCount: variant.stockCount,
      inStock: variant.inStock,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    // Validation
    if (!formData.size && !formData.color) {
      alert("Please select at least a size or color");
      return;
    }

    const variantData: ProductVariant = {
      id: editingVariant?.id || generateVariantId(),
      size: formData.size || undefined,
      color: formData.color || undefined,
      sku: formData.sku || generateVariantSKU(formData.size, formData.color),
      price: formData.price || undefined,
      stockCount: formData.stockCount || 0,
      inStock: formData.inStock ?? true,
    };

    if (editingVariant) {
      // Update existing variant
      onChange(variants.map(v => v.id === editingVariant.id ? variantData : v));
    } else {
      // Add new variant
      onChange([...variants, variantData]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (variantId: string) => {
    if (confirm("Are you sure you want to delete this variant?")) {
      onChange(variants.filter(v => v.id !== variantId));
    }
  };

  const getVariantLabel = (variant: ProductVariant) => {
    const parts = [];
    if (variant.size) parts.push(variant.size);
    if (variant.color) parts.push(variant.color.name);
    return parts.join(" / ") || "Variant";
  };

  const getVariantPrice = (variant: ProductVariant) => {
    return variant.price || defaultPrice;
  };

  const handleColorChange = (colorName: string) => {
    if (colorName === "none") {
      setFormData(prev => ({ ...prev, color: undefined }));
    } else {
      const selectedColor = availableColors.find(c => c.name === colorName);
      setFormData(prev => ({ ...prev, color: selectedColor }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Product Variants</CardTitle>
            <CardDescription>
              Manage different variations of this product (size, color, etc.)
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} type="button" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingVariant ? "Edit Variant" : "Add New Variant"}
                </DialogTitle>
                <DialogDescription>
                  {editingVariant 
                    ? "Update the variant details below"
                    : "Create a new product variant with specific attributes"
                  }
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Select
                      value={formData.size || "none"}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, size: value === "none" ? "" : value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {availableSizes.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Select
                      value={formData.color?.name || "none"}
                      onValueChange={handleColorChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color">
                          {formData.color ? (
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full border border-foreground/20"
                                style={{ backgroundColor: formData.color.hex }}
                              />
                              <span>{formData.color.name}</span>
                            </div>
                          ) : (
                            "Select color"
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {availableColors.map(color => (
                          <SelectItem key={color.name} value={color.name}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full border border-foreground/20"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span>{color.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="Auto-generated if empty"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (Optional)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price || ""}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        price: e.target.value ? parseFloat(e.target.value) : undefined 
                      }))}
                      placeholder={`${defaultPrice.toFixed(2)} (default)`}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use default price of ${defaultPrice.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockCount">Stock Count</Label>
                  <Input
                    id="stockCount"
                    type="number"
                    min="0"
                    value={formData.stockCount}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stockCount: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>In Stock</Label>
                    <p className="text-xs text-muted-foreground">
                      Available for purchase
                    </p>
                  </div>
                  <Switch
                    checked={formData.inStock}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inStock: checked }))}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingVariant ? "Update Variant" : "Add Variant"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {variants.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">No variants yet</p>
            <p className="text-xs text-muted-foreground mb-4">
              Add variants to offer different sizes, colors, or options
            </p>
            <Button type="button" onClick={openAddDialog} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add First Variant
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {variant.color && (
                      <div 
                        className="w-5 h-5 rounded-full border-2 border-foreground/20 shadow-sm flex-shrink-0"
                        style={{ backgroundColor: variant.color.hex }}
                        title={variant.color.name}
                      />
                    )}
                    <span className="font-medium">{getVariantLabel(variant)}</span>
                    {!variant.inStock && (
                      <Badge variant="destructive" className="text-xs">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>SKU: {variant.sku}</span>
                    <span>•</span>
                    <span className="font-medium text-foreground">
                      ${getVariantPrice(variant).toFixed(2)}
                      {!variant.price && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (default)
                        </span>
                      )}
                    </span>
                    <span>•</span>
                    <span>Stock: {variant.stockCount}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => openEditDialog(variant)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(variant.id)}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {variants.length > 0 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <strong>{variants.length}</strong> variant{variants.length !== 1 ? "s" : ""} •{" "}
            <strong>{variants.reduce((sum, v) => sum + v.stockCount, 0)}</strong> total units
          </div>
        )}
      </CardContent>
    </Card>
  );
}