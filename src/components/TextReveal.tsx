import { motion, useInView, type Variants } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  once?: boolean
  staggerChildren?: number
  type?: 'words' | 'chars' | 'lines'
  animation?: 'slide' | 'fade' | 'blur' | 'scale' | 'wave'
}

const containerVariants: Variants = {
  hidden: {},
  visible: (custom: { staggerChildren: number; delayChildren: number }) => ({
    transition: {
      staggerChildren: custom.staggerChildren,
      delayChildren: custom.delayChildren,
    },
  }),
}

const getItemVariants = (animation: string): Variants => {
  switch (animation) {
    case 'slide':
      return {
        hidden: { 
          y: 50, 
          opacity: 0,
          rotateX: -40,
        },
        visible: { 
          y: 0, 
          opacity: 1,
          rotateX: 0,
          transition: {
            type: 'spring',
            damping: 20,
            stiffness: 100,
          },
        },
      }
    case 'fade':
      return {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { duration: 0.6 },
        },
      }
    case 'blur':
      return {
        hidden: { 
          opacity: 0, 
          filter: 'blur(10px)',
          y: 20,
        },
        visible: { 
          opacity: 1, 
          filter: 'blur(0px)',
          y: 0,
          transition: { duration: 0.5 },
        },
      }
    case 'scale':
      return {
        hidden: { 
          opacity: 0, 
          scale: 0.5,
          y: 30,
        },
        visible: { 
          opacity: 1, 
          scale: 1,
          y: 0,
          transition: {
            type: 'spring',
            damping: 15,
            stiffness: 150,
          },
        },
      }
    case 'wave':
      return {
        hidden: { 
          y: 30, 
          opacity: 0,
          rotate: 5,
        },
        visible: (i: number) => ({ 
          y: 0, 
          opacity: 1,
          rotate: 0,
          transition: {
            type: 'spring',
            damping: 12,
            stiffness: 100,
            delay: i * 0.03,
          },
        }),
      }
    default:
      return {
        hidden: { y: 50, opacity: 0 },
        visible: { 
          y: 0, 
          opacity: 1,
          transition: { duration: 0.5 },
        },
      }
  }
}

export function TextReveal({
  text,
  className,
  delay = 0,
  once = true,
  staggerChildren = 0.03,
  type = 'words',
  animation = 'slide',
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, margin: '-50px' })
  
  const items = type === 'chars' 
    ? text.split('') 
    : type === 'lines'
    ? text.split('\n')
    : text.split(' ')

  const itemVariants = getItemVariants(animation)

  return (
    <motion.span
      ref={ref}
      className={cn('inline-block', className)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      custom={{ staggerChildren, delayChildren: delay }}
      style={{ perspective: '1000px' }}
    >
      {items.map((item, index) => (
        <motion.span
          key={`${item}-${index}`}
          className={cn(
            'inline-block',
            type === 'words' && 'mr-[0.25em]',
            type === 'chars' && item === ' ' && 'w-[0.25em]',
            type === 'lines' && 'block'
          )}
          variants={itemVariants}
          custom={index}
          style={{ transformOrigin: 'center bottom' }}
        >
          {item === ' ' && type === 'chars' ? '\u00A0' : item}
        </motion.span>
      ))}
    </motion.span>
  )
}

// Animated gradient text component
interface GradientTextProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
}

export function GradientText({ children, className, animate = true }: GradientTextProps) {
  return (
    <motion.span
      className={cn(
        animate ? 'gradient-text-animated' : 'gradient-text',
        className
      )}
      style={{
        display: 'inline-block',
      }}
    >
      {children}
    </motion.span>
  )
}

// Character-by-character reveal with stagger
interface CharRevealProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
}

export function CharReveal({ text, className, delay = 0, stagger = 0.02 }: CharRevealProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  
  const chars = text.split('')

  return (
    <span ref={ref} className={cn('inline-block', className)}>
      {chars.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 150,
            delay: delay + index * stagger,
          }}
          style={{ 
            transformOrigin: 'center bottom',
            display: char === ' ' ? 'inline' : 'inline-block',
            width: char === ' ' ? '0.25em' : 'auto',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

// Line-by-line reveal
interface LineRevealProps {
  lines: string[]
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
}

export function LineReveal({ lines, className, lineClassName, delay = 0, stagger = 0.15 }: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <div ref={ref} className={className}>
      {lines.map((line, index) => (
        <div key={index} className="overflow-hidden">
          <motion.div
            className={lineClassName}
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 100,
              delay: delay + index * stagger,
            }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </div>
  )
}

// Counter animation component
interface CounterProps {
  from?: number
  to: number
  duration?: number
  delay?: number
  suffix?: string
  className?: string
}

export function Counter({ from = 0, to, duration = 2, delay = 0, suffix = '', className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay }}
      >
        {isInView && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CounterValue from={from} to={to} duration={duration} delay={delay} />
            {suffix}
          </motion.span>
        )}
      </motion.span>
    </motion.span>
  )
}

function CounterValue({ from, to, duration, delay }: { from: number; to: number; duration: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  
  return (
    <motion.span
      ref={ref}
      initial={{ textContent: String(from) }}
      animate={{ textContent: String(to) }}
      transition={{ 
        duration, 
        delay,
        ease: 'easeOut',
      }}
    >
      {to}
    </motion.span>
  )
}
