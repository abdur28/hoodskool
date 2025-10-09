"use client";

import React, { useState } from "react";
import { 
  ChevronRight, 
  ChevronDown, 
  FolderOpen, 
  Folder,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  GripVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Category } from "@/types/types";

interface CategoryTreeProps {
  categories: Category[];
  onEdit: (category: Category, parentId?: string) => void;
  onDelete: (category: Category, parentId?: string) => void;
  onAddSubcategory: (parentCategory: Category) => void;
  searchQuery?: string;
}

interface CategoryTreeItemProps {
  category: Category;
  level?: number;
  parentId?: string;
  onEdit: (category: Category, parentId?: string) => void;
  onDelete: (category: Category, parentId?: string) => void;
  onAddSubcategory: (parentCategory: Category) => void;
  searchQuery?: string;
}

function CategoryTreeItem({ 
  category, 
  level = 0, 
  parentId,
  onEdit, 
  onDelete,
  onAddSubcategory,
  searchQuery 
}: CategoryTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasSubcategories = category.subCategories && category.subCategories.length > 0;

  // Highlight search matches
  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="w-full">
      <div 
        className={cn(
          "flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors group",
          level > 0 && "ml-6"
        )}
      >
        {/* Drag Handle */}
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
        
        {/* Expand/Collapse Button */}
        {hasSubcategories ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <div className="w-6" />
        )}

        {/* Folder Icon */}
        {isExpanded && hasSubcategories ? (
          <FolderOpen className="h-4 w-4 text-blue-500" />
        ) : (
          <Folder className="h-4 w-4 text-muted-foreground" />
        )}

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">
              {highlightText(category.name)}
            </span>
            {hasSubcategories && (
              <Badge variant="secondary" className="text-xs">
                {category.subCategories!.length}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <code className="text-xs text-muted-foreground">
              {highlightText(category.slug)}
            </code>
            {level > 0 && (
              <Badge variant="outline" className="text-xs">
                Level {level + 1}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onAddSubcategory(category)}
            title="Add subcategory"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(category, parentId)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddSubcategory(category)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subcategory
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(category, parentId)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Subcategories */}
      {isExpanded && hasSubcategories && (
        <div className="ml-3 border-l-2 border-muted">
          {category.subCategories!.map((subCategory) => (
            <CategoryTreeItem
              key={subCategory.id}
              category={subCategory}
              level={level + 1}
              parentId={category.id}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSubcategory={onAddSubcategory}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryTree({ 
  categories, 
  onEdit, 
  onDelete,
  onAddSubcategory,
  searchQuery 
}: CategoryTreeProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No categories to display
      </div>
    );
  }

  // Filter categories based on search
  const filterCategories = (cats: Category[]): Category[] => {
    if (!searchQuery) return cats;

    return cats.filter(cat => {
      const matchesSearch = 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // If this category matches, include it
      if (matchesSearch) return true;

      // If any subcategory matches, include this category too
      if (cat.subCategories && cat.subCategories.length > 0) {
        const hasMatchingSubcategory = filterCategories(cat.subCategories).length > 0;
        if (hasMatchingSubcategory) return true;
      }

      return false;
    }).map(cat => ({
      ...cat,
      subCategories: cat.subCategories ? filterCategories(cat.subCategories) : []
    }));
  };

  const filteredCategories = filterCategories(categories);

  return (
    <div className="space-y-1">
      {filteredCategories.map((category) => (
        <CategoryTreeItem
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddSubcategory={onAddSubcategory}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}