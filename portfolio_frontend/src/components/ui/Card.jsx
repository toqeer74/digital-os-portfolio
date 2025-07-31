import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const Card = forwardRef(({ className, animate = true, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'rounded-lg border bg-card text-card-foreground shadow-sm',
    glass: 'rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl',
    gradient: 'rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-md border border-white/20 text-white shadow-xl',
    neon: 'rounded-lg bg-black/50 backdrop-blur-md border-2 border-cyan-400/50 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    elevated: 'rounded-lg bg-card text-card-foreground shadow-2xl border-0'
  }

  const Component = animate ? motion.div : 'div'
  
  const cardProps = {
    ref,
    className: cn(variants[variant], className),
    ...props
  }

  if (animate) {
    return (
      <Component
        {...cardProps}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      />
    )
  }

  return <div {...cardProps} />
})
Card.displayName = 'Card'

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

