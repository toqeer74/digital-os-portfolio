import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        glass: 'border-white/20 bg-white/10 backdrop-blur-md text-white',
        gradient: 'border-transparent bg-gradient-to-r from-blue-500 to-purple-600 text-white',
        neon: 'border-cyan-400 bg-transparent text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]',
        tech: 'border-green-400/50 bg-green-400/10 text-green-400',
        category: 'border-orange-400/50 bg-orange-400/10 text-orange-400'
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Badge = forwardRef(({ 
  className, 
  variant, 
  animate = true,
  children,
  ...props 
}, ref) => {
  const Component = animate ? motion.div : 'div'
  
  const badgeProps = {
    className: cn(badgeVariants({ variant }), className),
    ref,
    ...props
  }

  if (animate) {
    return (
      <Component
        {...badgeProps}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </Component>
    )
  }

  return <div {...badgeProps}>{children}</div>
})

Badge.displayName = 'Badge'

export { Badge, badgeVariants }

