import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Default: Primary pink
        default:
          "border-transparent bg-pink-500 text-white hover:bg-pink-600 shadow-sm",
        
        // Secondary: Light gray neutral
        secondary:
          "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100",
        
        // Destructive: Red
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600",
        
        // Outline: Border only
        outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
        
        // === TravelEZ Semantic Variants ===
        
        // Location: Sky blue for destinations/cities
        location:
          "border border-sky-100 bg-sky-50 text-sky-600 hover:bg-sky-100",
        
        // Style: Pink for travel styles
        style:
          "border border-pink-100 bg-pink-50 text-pink-600 hover:bg-pink-100",
        
        // Status variants
        success:
          "border border-green-100 bg-green-50 text-green-600 hover:bg-green-100",
        warning:
          "border border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100",
        draft:
          "border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

