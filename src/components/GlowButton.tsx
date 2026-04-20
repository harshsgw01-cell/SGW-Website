import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface GlowButtonProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  href?: string
  magnetic?: boolean
}

export function GlowButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  magnetic = true,
}: GlowButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  // Magnetic effect values
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 400 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || !buttonRef.current) return
    
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distanceX = (e.clientX - centerX) * 0.2
    const distanceY = (e.clientY - centerY) * 0.2
    
    x.set(distanceX)
    y.set(distanceY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20',
    secondary: 'bg-secondary text-secondary-foreground border border-border hover:border-primary/30',
    ghost: 'bg-transparent text-foreground hover:bg-secondary',
  }

  const Component = href ? motion.a : motion.button

  return (
    <Component
      ref={buttonRef as any}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative group inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-colors duration-300 overflow-hidden cursor-pointer',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={{
        x: xSpring,
        y: ySpring,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated border gradient for secondary */}
      {variant === 'secondary' && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent), var(--color-neon-cyan), var(--color-primary))',
            backgroundSize: '300% 300%',
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          animate={isHovered ? {
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Glow effect for primary */}
      {variant === 'primary' && (
        <>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur-xl transition-all duration-500"
            animate={{
              opacity: isHovered ? 0.8 : 0,
              scale: isHovered ? 1.2 : 1,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl" />
        </>
      )}
      
      {/* Shimmer effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-xl"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
      
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Component>
  )
}

// Magnetic wrapper for any element
interface MagneticWrapProps {
  children: React.ReactNode
  strength?: number
  className?: string
}

export function MagneticWrap({ children, strength = 0.3, className }: MagneticWrapProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 20, stiffness: 300 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distanceX = (e.clientX - centerX) * strength
    const distanceY = (e.clientY - centerY) * strength
    
    x.set(distanceX)
    y.set(distanceY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.div>
  )
}
