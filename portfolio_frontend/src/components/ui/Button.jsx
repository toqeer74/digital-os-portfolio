import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
        gradient: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700',
        neon: 'bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black shadow-[0_0_10px_rgba(34,211,238,0.5)] hover:shadow-[0_0_20px_rgba(34,211,238,0.8)]'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

const Button = forwardRef(({ 
  className, 
  variant, 
  size, 
  asChild = false, 
  animate = true,
  children,
  ...props 
}, ref) => {
  const Component = motion.button

  const buttonProps = {
    className: cn(buttonVariants({ variant, size, className })),
    ref,
    ...props
  }

  if (animate) {
    return (
      <Component
        {...buttonProps}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </Component>
    )
  }

  return (
    <button {...buttonProps}>
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export { Button, buttonVariants }

