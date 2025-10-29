import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 border border-primary/20",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105 border border-red-500/20",
        outline: "glass border-2 border-primary/30 text-primary hover:bg-primary/10 hover:scale-105 shadow-md hover:shadow-lg backdrop-blur-sm",
        secondary: "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground shadow-lg hover:shadow-xl hover:scale-105 border border-secondary/20",
        ghost: "glass text-foreground hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors",
        accent: "bg-gradient-to-r from-accent to-accent/90 text-accent-foreground shadow-lg hover:shadow-xl hover:scale-105 border border-accent/20",
        gradient: "gradient-text border border-primary/20 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm"
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-md px-4 py-1.5 text-xs",
        lg: "h-12 rounded-lg px-8 py-3 text-base",
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