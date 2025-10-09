"use client";

import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FolderTree } from "lucide-react";
import { toast } from "sonner";
import useAdmin from "@/hooks/admin/useAdmin";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/types";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  parentCategory?: Category | null;
  mode: 'create' | 'edit';
}

export default function CategoryDialog({ 
  open, 
  onOpenChange, 
  category,
  parentCategory,
  mode 
}: CategoryDialogProps) {
  const { createCategory, updateCategory, loading } = useAdmin();
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    slug: ''
  });

  // Load category data when editing
  useEffect(() => {
    if (open && mode === 'edit' && category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || ''
      });
    } else if (open && mode === 'create') {
      setFormData({
        name: '',
        slug: '',
        description: ''
      });
    }
    setErrors({ name: '', slug: '' });
  }, [open, mode, category]);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const validateForm = (): boolean => {
    const newErrors = { name: '', slug: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
      isValid = false;
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSaving(true);
      
      if (mode === 'create') {
        await createCategory(formData, parentCategory?.id);
        toast.success(
          parentCategory 
            ? `Subcategory added to "${parentCategory.name}"` 
            : "Category created successfully"
        );
      } else if (mode === 'edit' && category) {
        await updateCategory(category.id, formData, parentCategory?.id);
        toast.success("Category updated successfully");
      }
      
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error(error.message || "Failed to save category");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-body">
            {mode === 'create' 
              ? (parentCategory ? 'Add Subcategory' : 'Create New Category')
              : 'Edit Category'
            }
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? (parentCategory 
                  ? `Add a subcategory under "${parentCategory.name}".`
                  : 'Add a new category to organize your products.'
                )
              : 'Update the category information below.'
            }
          </DialogDescription>
        </DialogHeader>

        {parentCategory && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <FolderTree className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Parent Category</p>
              <p className="text-xs text-muted-foreground">{parentCategory.name}</p>
            </div>
            <Badge variant="secondary">Subcategory</Badge>
          </div>
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Hoodies, T-Shirts, Accessories"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-red-500">*</span>
            </Label>
            <Input
              id="slug"
              placeholder="e.g., hoodies, t-shirts"
              value={formData.slug}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, slug: e.target.value }));
                if (errors.slug) {
                  setErrors(prev => ({ ...prev, slug: '' }));
                }
              }}
              className={errors.slug ? 'border-red-500' : ''}
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly version of the name. Auto-generated from name.
            </p>
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this category..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                description: e.target.value 
              }))}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || loading.adminAction}
          >
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {mode === 'create' 
              ? (parentCategory ? 'Add Subcategory' : 'Create Category')
              : 'Save Changes'
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}