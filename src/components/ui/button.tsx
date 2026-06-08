import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary: TravelEZ gradient (pink-400 → pink-500)
        default: "bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:from-pink-500 hover:to-pink-600 shadow-sm hover:shadow-md rounded-full",
        
        // Secondary: Pink border with soft background
        secondary:
          "border-2 border-pink-300 text-pink-600 bg-white hover:bg-pink-50 shadow-sm rounded-full",
        
        // Ghost: Minimal style for icon/text buttons
        ghost: "text-pink-600 hover:bg-pink-50 rounded-full",
        
        // Outline: Neutral border, can be tinted
        outline:
          "border-2 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-pink-200 rounded-full",
        
        // Destructive: Red with proper styling
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md rounded-full",
        
        // Link: Simple underlined text
        link: "text-pink-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-8 text-base font-semibold",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

