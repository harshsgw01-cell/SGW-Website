import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  tiltAmount?: number
  glowIntensity?: number
  scale?: number
  perspective?: number
}

export function TiltCard({
  children,
  className,
  glowColor = 'rgba(139, 92, 246, 0.4)',
  tiltAmount = 10,
  glowIntensity = 0.4,
  scale = 1.02,
  perspective = 1000,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  // Motion values for smooth animation
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  
  // Spring config for smooth animations
  const springConfig = { stiffness: 300, damping: 30 }
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [tiltAmount, -tiltAmount]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-tiltAmount, tiltAmount]), springConfig)
  const scaleValue = useSpring(isHovered ? scale : 1, springConfig)
  
  // Glow position
  const glowX = useTransform(mouseX, [0, 1], [0, 100])
  const glowY = useTransform(mouseY, [0, 1], [0, 100])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    mouseX.set(0.5)
    mouseY.set(0.5)
  }, [mouseX, mouseY])

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale: scaleValue,
        transformStyle: 'preserve-3d',
        perspective: `${perspective}px`,
      }}
      className={cn('relative', className)}
    >
      {/* Dynamic glow effect that follows cursor */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at calc(${glowX.get()}%) calc(${glowY.get()}%), ${glowColor} 0%, transparent 60%)`,
          opacity: isHovered ? glowIntensity : 0,
        }}
      />

      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
        style={{ opacity: isHovered ? 1 : 0 }}
      >
        <motion.div
          className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${glowColor} 60deg, transparent 120deg)`,
            opacity: 0.15,
          }}
          animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
      
      {/* Border glow that intensifies on hover */}
      <motion.div
        className="absolute -inset-[1px] rounded-3xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${glowColor} 0%, transparent 40%, transparent 60%, ${glowColor} 100%)`,
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: isHovered ? 0.8 : 0,
        }}
        animate={isHovered ? {
          background: [
            `linear-gradient(0deg, ${glowColor} 0%, transparent 40%, transparent 60%, ${glowColor} 100%)`,
            `linear-gradient(90deg, ${glowColor} 0%, transparent 40%, transparent 60%, ${glowColor} 100%)`,
            `linear-gradient(180deg, ${glowColor} 0%, transparent 40%, transparent 60%, ${glowColor} 100%)`,
            `linear-gradient(270deg, ${glowColor} 0%, transparent 40%, transparent 60%, ${glowColor} 100%)`,
            `linear-gradient(360deg, ${glowColor} 0%, transparent 40%, transparent 60%, ${glowColor} 100%)`,
          ],
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />

      {/* Content with 3D depth effect */}
      <motion.div
        style={{
          transform: 'translateZ(20px)',
          transformStyle: 'preserve-3d',
        }}
        className="relative"
      >
        {children}
      </motion.div>

      {/* Shadow that responds to tilt */}
      <motion.div
        className="absolute inset-0 rounded-3xl -z-10"
        style={{
          boxShadow: isHovered
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px ${glowColor}`
            : '0 10px 20px -5px rgba(0, 0, 0, 0.1)',
          transform: 'translateZ(-20px)',
        }}
      />
    </motion.div>
  )
}

// Hover card with reveal effect
interface HoverRevealCardProps {
  children: React.ReactNode
  overlay?: React.ReactNode
  className?: string
}

export function HoverRevealCard({ children, overlay, className }: HoverRevealCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={cn('relative overflow-hidden rounded-3xl', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {overlay && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          {overlay}
        </motion.div>
      )}
    </motion.div>
  )
}
