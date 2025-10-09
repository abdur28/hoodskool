"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Product, ProductImage } from "@/types/admin";
import useAdmin from "@/hooks/admin/useAdmin";
import CategoryPathSelector from "./CategoryPathSelector";
import CollectionSelector from "./CollectionSelector";
import ImageUpload from "./ImageUpload";

interface ProductFormProps {
  product?: Product | null;
  mode: "create" | "edit";
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const { 
    createProduct, 
    updateProduct, 
    categories, 
    collections,
    fetchCategories, 
    fetchCollections,
    loading 
  } = useAdmin();
  
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    shortDescription: product?.shortDescription || "",
    price: product?.price || 0,
    compareAtPrice: product?.compareAtPrice || 0,
    categoryPath: product?.categoryPath || "",
    collectionSlug: product?.collectionSlug || "",
    sku: product?.sku || "",
    inStock: product?.inStock ?? true,
    totalStock: product?.totalStock || 0,
    lowStockAlert: product?.lowStockAlert || 10,
    tags: product?.tags || [],
    colors: product?.colors || [],
    sizes: product?.sizes || [],
    materials: product?.materials || [],
    isNew: product?.isNew || false,
    isFeatured: product?.isFeatured || false,
    isBestseller: product?.isBestseller || false,
    isLimitedEdition: product?.isLimitedEdition || false,
    metaTitle: product?.metaTitle || "",
    metaDescription: product?.metaDescription || "",
    careInstructions: product?.careInstructions || "",
    sizeGuide: product?.sizeGuide || "",
  });
  
  const [images, setImages] = useState<ProductImage[]>(product?.images || []);
  const [tagInput, setTagInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [materialInput, setMaterialInput] = useState("");

  // Load categories and collections
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories({ limit: 100, orderByField: 'name', orderDirection: 'asc' });
    }
    if (collections.length === 0) {
      fetchCollections({ limit: 100, orderByField: 'name', orderDirection: 'asc' });
    }
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (mode === "create" && formData.name && !formData.slug) {
      const slug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, mode]);

  // Auto-generate SKU from name
  useEffect(() => {
    if (mode === "create" && formData.name && !formData.sku) {
      const sku = formData.name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .substring(0, 10) + "-" + Date.now().toString().slice(-4);
      setFormData(prev => ({ ...prev, sku }));
    }
  }, [formData.name, mode]);

  // Calculate discount percentage
  const discountPercent = formData.compareAtPrice && formData.price
    ? Math.round(((formData.compareAtPrice - formData.price) / formData.compareAtPrice) * 100)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.categoryPath) {
      toast.error("Please select a category");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }
    if (formData.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    setIsSaving(true);
    try {
      const productData = {
        ...formData,
        images,
        discountPercent: discountPercent > 0 ? discountPercent : undefined,
      };

      if (mode === "create") {
        await createProduct(productData);
        toast.success("Product created successfully!");
        router.push("/admin/products");
      } else if (product) {
        await updateProduct(product.id, productData);
        toast.success("Product updated successfully!");
        router.push("/admin/products");
      }
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const addColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData(prev => ({ ...prev, colors: [...prev.colors, colorInput.trim()] }));
      setColorInput("");
    }
  };

  const removeColor = (color: string) => {
    setFormData(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }));
  };

  const addSize = () => {
    if (sizeInput.trim() && !formData.sizes.includes(sizeInput.trim())) {
      setFormData(prev => ({ ...prev, sizes: [...prev.sizes, sizeInput.trim()] }));
      setSizeInput("");
    }
  };

  const removeSize = (size: string) => {
    setFormData(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== size) }));
  };

  const addMaterial = () => {
    if (materialInput.trim() && !formData.materials.includes(materialInput.trim())) {
      setFormData(prev => ({ ...prev, materials: [...prev.materials, materialInput.trim()] }));
      setMaterialInput("");
    }
  };

  const removeMaterial = (material: string) => {
    setFormData(prev => ({ ...prev, materials: prev.materials.filter(m => m !== material) }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-body">
              {mode === "create" ? "Create New Product" : "Edit Product"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create" 
                ? "Add a new product to your catalog"
                : "Update product information"
              }
            </p>
          </div>
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {mode === "create" ? "Create Product" : "Save Changes"}
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Oversized Hoodie - Black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="oversized-hoodie-black"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="HOOD-001"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief one-line description"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed product description..."
                  rows={6}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images *</CardTitle>
              <CardDescription>Upload and manage product images</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload images={images} onChange={setImages} maxImages={10} />
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set product pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">Compare at Price ($)</Label>
                  <Input
                    id="compareAtPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, compareAtPrice: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              {discountPercent > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    💰 <strong>{discountPercent}% off</strong> - Customers save ${(formData.compareAtPrice - formData.price).toFixed(2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Stock management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>In Stock</Label>
                  <p className="text-sm text-muted-foreground">Product is available for purchase</p>
                </div>
                <Switch
                  checked={formData.inStock}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inStock: checked }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalStock">Total Stock</Label>
                  <Input
                    id="totalStock"
                    type="number"
                    min="0"
                    value={formData.totalStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalStock: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowStockAlert">Low Stock Alert</Label>
                  <Input
                    id="lowStockAlert"
                    type="number"
                    min="0"
                    value={formData.lowStockAlert}
                    onChange={(e) => setFormData(prev => ({ ...prev, lowStockAlert: parseInt(e.target.value) || 10 }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Attributes */}
          <Card>
            <CardHeader>
              <CardTitle>Product Attributes</CardTitle>
              <CardDescription>Tags, colors, sizes, and materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Colors */}
              <div className="space-y-2">
                <Label>Colors</Label>
                <div className="flex gap-2">
                  <Input
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                    placeholder="Add color..."
                  />
                  <Button type="button" onClick={addColor} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.colors.map(color => (
                    <Badge key={color} variant="secondary" className="gap-1">
                      {color}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeColor(color)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Sizes */}
              <div className="space-y-2">
                <Label>Sizes</Label>
                <div className="flex gap-2">
                  <Input
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                    placeholder="Add size..."
                  />
                  <Button type="button" onClick={addSize} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.sizes.map(size => (
                    <Badge key={size} variant="secondary" className="gap-1">
                      {size}
                      <Button type="button" variant={"ghost"} onClick={() => removeSize(size)}>
                        <X className="h-3 w-3 cursor-pointer"  />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Materials */}
              <div className="space-y-2">
                <Label>Materials</Label>
                <div className="flex gap-2">
                  <Input
                    value={materialInput}
                    onChange={(e) => setMaterialInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
                    placeholder="Add material..."
                  />
                  <Button type="button" onClick={addMaterial} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.materials.map(material => (
                    <Badge key={material} variant="secondary" className="gap-1">
                      {material}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeMaterial(material)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO & Meta</CardTitle>
              <CardDescription>Search engine optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="SEO title for search engines"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="SEO description for search engines"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Care instructions and guides</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="careInstructions">Care Instructions</Label>
                <Textarea
                  id="careInstructions"
                  value={formData.careInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, careInstructions: e.target.value }))}
                  placeholder="How to care for this product..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sizeGuide">Size Guide URL</Label>
                <Input
                  id="sizeGuide"
                  value={formData.sizeGuide}
                  onChange={(e) => setFormData(prev => ({ ...prev, sizeGuide: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>Category and collection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <CategoryPathSelector
                  categories={categories}
                  value={formData.categoryPath}
                  onChange={(path) => setFormData(prev => ({ ...prev, categoryPath: path }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Collection</Label>
                <CollectionSelector
                  collections={collections}
                  value={formData.collectionSlug}
                  onChange={(slug) => setFormData(prev => ({ ...prev, collectionSlug: slug }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Status */}
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
              <CardDescription>Feature flags and badges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>New Arrival</Label>
                <Switch
                  checked={formData.isNew}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isNew: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Featured</Label>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Bestseller</Label>
                <Switch
                  checked={formData.isBestseller}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isBestseller: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Limited Edition</Label>
                <Switch
                  checked={formData.isLimitedEdition}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isLimitedEdition: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}