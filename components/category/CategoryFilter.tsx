"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterSection {
  title: string;
  key: string;
  options: FilterOption[];
  type: "checkbox" | "radio" | "range";
}

const filterSections: FilterSection[] = [
  {
    title: "Category",
    key: "category",
    type: "checkbox",
    options: [
      { label: "T-Shirts", value: "t-shirts", count: 45 },
      { label: "Hoodies", value: "hoodies", count: 32 },
      { label: "Shirts", value: "shirts", count: 28 },
      { label: "Pants", value: "pants", count: 36 },
      { label: "Jackets", value: "jackets", count: 24 },
    ],
  },
  {
    title: "Size",
    key: "size",
    type: "checkbox",
    options: [
      { label: "XS", value: "xs" },
      { label: "S", value: "s" },
      { label: "M", value: "m" },
      { label: "L", value: "l" },
      { label: "XL", value: "xl" },
      { label: "XXL", value: "xxl" },
    ],
  },
  {
    title: "Color",
    key: "color",
    type: "checkbox",
    options: [
      { label: "Black", value: "black" },
      { label: "White", value: "white" },
      { label: "Gray", value: "gray" },
      { label: "Navy", value: "navy" },
      { label: "Gold", value: "gold" },
    ],
  },
  {
    title: "Price",
    key: "price",
    type: "range",
    options: [
      { label: "Under $50", value: "0-50" },
      { label: "$50 - $100", value: "50-100" },
      { label: "$100 - $150", value: "100-150" },
      { label: "Over $150", value: "150+" },
    ],
  },
];

export default function CategoryFilter({ 
  onFilter 
}: { 
  onFilter: (filters: any) => void;
}) {
  const [openSections, setOpenSections] = useState<string[]>(["category"]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const toggleSection = (key: string) => {
    setOpenSections(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const handleFilterChange = (sectionKey: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[sectionKey] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      const newFilters = {
        ...prev,
        [sectionKey]: updated,
      };
      
      onFilter(newFilters);
      return newFilters;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-2xl tracking-wider mb-6">FILTER BY</h3>
      </div>

      {filterSections.map((section) => (
        <div key={section.key} className="border-b border-foreground/10 pb-4">
          <button
            onClick={() => toggleSection(section.key)}
            className="w-full flex items-center justify-between py-2 text-left hover:text-foreground/60 transition-colors"
          >
            <span className="font-body text-sm font-medium">
              {section.title}
            </span>
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                openSections.includes(section.key) && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence>
            {openSections.includes(section.key) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-2">
                  {section.type === "checkbox" && section.options.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center justify-between py-1.5 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={selectedFilters[section.key]?.includes(option.value)}
                            onChange={() => handleFilterChange(section.key, option.value)}
                            className="sr-only"
                          />
                          <div className={cn(
                            "w-4 h-4 border rounded-sm transition-colors",
                            selectedFilters[section.key]?.includes(option.value)
                              ? "bg-black border-black"
                              : "border-foreground/40 group-hover:border-foreground"
                          )}>
                            {selectedFilters[section.key]?.includes(option.value) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                        </div>
                        <span className="font-body text-sm text-foreground/80 group-hover:text-foreground">
                          {option.label}
                        </span>
                      </div>
                      {option.count && (
                        <span className="font-body text-xs text-foreground/40">
                          ({option.count})
                        </span>
                      )}
                    </label>
                  ))}

                  {section.type === "range" && (
                    <div className="space-y-2">
                      {section.options.map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 py-1.5 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name={section.key}
                            checked={selectedFilters[section.key]?.[0] === option.value}
                            onChange={() => setSelectedFilters(prev => ({
                              ...prev,
                              [section.key]: [option.value]
                            }))}
                            className="w-4 h-4 text-black focus:ring-black"
                          />
                          <span className="font-body text-sm text-foreground/80 group-hover:text-foreground">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Clear Filters */}
      {Object.keys(selectedFilters).length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            setSelectedFilters({});
            onFilter({});
          }}
          className="w-full py-2 border border-foreground/20 hover:bg-black hover:text-white transition-all font-body text-sm"
        >
          Clear All Filters
        </motion.button>
      )}
    </div>
  );
}