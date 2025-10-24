import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-[#14b8a6] focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-[#14b8a6] text-white hover:bg-[#5eead4] shadow-sm",
        primary: "bg-[#14b8a6] text-white hover:bg-[#5eead4] shadow-sm",
        secondary: "border-2 border-[#14b8a6] text-[#14b8a6] bg-transparent hover:bg-[#14b8a6] hover:text-white",
        destructive: "bg-[#ef4444] text-white hover:bg-[#dc2626] shadow-sm",
        ghost: "bg-transparent text-[#94a3b8] hover:bg-[#334155] hover:text-[#e2e8f0]",
        outline: "border border-[#475569] bg-transparent text-[#e2e8f0] hover:bg-[#1e293b] hover:border-[#14b8a6]",
        link: "bg-transparent text-[#14b8a6] hover:text-[#5eead4] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 px-4 py-2 text-sm",
        md: "h-12 px-6 py-3 text-base",
        lg: "h-14 px-8 py-4 text-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-label={loading ? "Loading" : undefined}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin text-current" aria-hidden="true" />}
        {children}
      </Comp>
    )
  },
)

Button.displayName = "Button"

export { Button, buttonVariants }
