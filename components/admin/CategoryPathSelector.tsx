"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronDown, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Category } from "@/types/types";

interface CategoryPathSelectorProps {
  categories: Category[];
  value?: string;
  onChange: (path: string) => void;
  placeholder?: string;
}

// Build flat list of all categories with their paths
function flattenCategories(categories: Category[], parentPath: string = ''): Array<{ path: string; label: string; level: number }> {
  const result: Array<{ path: string; label: string; level: number }> = [];
  
  categories.forEach(category => {
    const currentPath = parentPath ? `${parentPath} > ${category.name}` : category.name;
    const level = parentPath.split(' > ').filter(Boolean).length;
    
    result.push({
      path: currentPath,
      label: category.name,
      level
    });
    
    if (category.subCategories && category.subCategories.length > 0) {
      result.push(...flattenCategories(category.subCategories, currentPath));
    }
  });
  
  return result;
}

export default function CategoryPathSelector({
  categories,
  value,
  onChange,
  placeholder = "Select category..."
}: CategoryPathSelectorProps) {
  const [open, setOpen] = useState(false);
  const [flatCategories, setFlatCategories] = useState<Array<{ path: string; label: string; level: number }>>([]);

  useEffect(() => {
    setFlatCategories(flattenCategories(categories));
  }, [categories]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2 truncate">
            <FolderTree className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {value || placeholder}
            </span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {flatCategories.map((category) => (
              <CommandItem
                key={category.path}
                value={category.path}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
                className={cn(
                  "cursor-pointer",
                  category.level > 0 && `pl-${4 + category.level * 4}`
                )}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === category.path ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className={cn(
                  "truncate",
                  category.level === 0 && "font-medium"
                )}>
                  {category.label}
                </span>
                {category.level > 0 && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    Level {category.level + 1}
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}