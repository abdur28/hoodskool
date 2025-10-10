"use client";

import { Mail, Sparkles, Megaphone, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { EmailTemplateType } from "@/hooks/admin/useAdminMailer";

interface EmailTemplateSelectorProps {
  value: EmailTemplateType | null;
  onChange: (type: EmailTemplateType) => void;
}

const templates: Array<{
  type: EmailTemplateType;
  icon: typeof Mail;
  title: string;
  description: string;
  color: string;
}> = [
  {
    type: 'new_arrivals',
    icon: Sparkles,
    title: 'New Arrivals',
    description: 'Showcase fresh drops and new products to your customers',
    color: 'text-blue-500'
  },
  {
    type: 'promotions',
    icon: Megaphone,
    title: 'Promotions & Sales',
    description: 'Send discount codes and promotional offers to boost sales',
    color: 'text-red-500'
  },
  {
    type: 'newsletter',
    icon: Mail,
    title: 'Custom Newsletter',
    description: 'Create custom content newsletters for your subscribers',
    color: 'text-purple-500'
  },
  {
    type: 'wishlist_alert',
    icon: Heart,
    title: 'Wishlist Alerts',
    description: 'Notify users when wishlist items are back in stock',
    color: 'text-pink-500'
  }
];

export default function EmailTemplateSelector({ value, onChange }: EmailTemplateSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-xl">Select Email Template</CardTitle>
        <CardDescription>
          Choose the type of email campaign you want to send
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value || ''} onValueChange={(val) => onChange(val as EmailTemplateType)}>
          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <div key={template.type} className="relative">
                  <RadioGroupItem
                    value={template.type}
                    id={template.type}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={template.type}
                    className="flex flex-col items-start gap-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#F8E231] peer-data-[state=checked]:bg-accent cursor-pointer transition-all"
                  >
                    <Icon className={`h-6 w-6 ${template.color}`} />
                    <div className="space-y-1">
                      <p className="font-medium font-body leading-none">
                        {template.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
