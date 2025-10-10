"use client";

import { useState, useEffect } from "react";
import { Users, Filter, Check, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/types/types";
import { RecipientFilter } from "@/hooks/admin/useAdminMailer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EmailRecipientSelectorProps {
  users: UserProfile[];
  selectedUsers: UserProfile[];
  loading: boolean;
  onFilterChange: (filter: RecipientFilter) => void;
  onSelectionChange: (users: UserProfile[]) => void;
}

export default function EmailRecipientSelector({
  users,
  selectedUsers,
  loading,
  onFilterChange,
  onSelectionChange
}: EmailRecipientSelectorProps) {
  const [filters, setFilters] = useState<RecipientFilter>({
    emailOptIn: true,
    role: 'user'
  });

  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSelectAll = () => {
    if (selectAll) {
      onSelectionChange([]);
    } else {
      onSelectionChange(users);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectUser = (user: UserProfile) => {
    const isSelected = selectedUsers.some(u => u.uid === user.uid);
    if (isSelected) {
      onSelectionChange(selectedUsers.filter(u => u.uid !== user.uid));
    } else {
      onSelectionChange([...selectedUsers, user]);
    }
  };

  const clearFilters = () => {
    setFilters({
      emailOptIn: true,
      role: 'user'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-heading text-xl flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Recipients
            </CardTitle>
            <CardDescription>
              {selectedUsers.length} of {users.length} users selected
            </CardDescription>
          </div>
          {selectedUsers.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectionChange([])}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Selection
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              Reset
            </Button>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emailOptIn"
                checked={filters.emailOptIn || false}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, emailOptIn: checked as boolean })
                }
              />
              <Label htmlFor="emailOptIn" className="text-sm font-normal cursor-pointer">
                Email opt-in only
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasOrders"
                checked={filters.hasOrders || false}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, hasOrders: checked as boolean })
                }
              />
              <Label htmlFor="hasOrders" className="text-sm font-normal cursor-pointer">
                Has placed orders
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="customersOnly"
                checked={filters.role === 'user'}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, role: checked ? 'user' : undefined })
                }
              />
              <Label htmlFor="customersOnly" className="text-sm font-normal cursor-pointer">
                Customers only (exclude admins)
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading users...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No users match the current filters</p>
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Clear Filters
            </Button>
          </div>
        )}

        {/* User List */}
        {!loading && users.length > 0 && (
          <>
            <div className="flex items-center justify-between py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectAll ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Select All ({users.length})
                  </>
                )}
              </Button>
              <Badge variant="secondary">
                {selectedUsers.length} selected
              </Badge>
            </div>

            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-2">
                {users.map((user) => {
                  const isSelected = selectedUsers.some(u => u.uid === user.uid);
                  return (
                    <div
                      key={user.uid}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
                        isSelected ? 'border-[#F8E231] bg-accent' : 'border-muted'
                      }`}
                      onClick={() => handleSelectUser(user)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSelectUser(user)}
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL} />
                        <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.displayName || 'Unnamed User'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      {user.emailVerified && (
                        <Badge variant="outline" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
}