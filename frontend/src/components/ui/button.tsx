import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-display font-bold uppercase tracking-widest rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-accent-bright)] text-[var(--color-primary-dark)] hover:brightness-105 hover:-translate-y-px',
        primaryDark: 'bg-[var(--color-primary)] text-[var(--color-bg)] hover:bg-[var(--color-primary-dark)]',
        ghost: 'bg-transparent border-[1.5px] border-[rgba(244,238,222,0.4)] text-[var(--color-bg)] hover:bg-[rgba(244,238,222,0.08)]',
        ghostDark: 'bg-transparent border-[1.5px] border-[rgba(31,61,47,0.35)] text-[var(--color-primary)] hover:bg-[rgba(31,61,47,0.06)]',
      },
      size: {
        md: 'px-7 py-3.5 text-[13px]',
        sm: 'px-4 py-2 text-[11px]',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'
