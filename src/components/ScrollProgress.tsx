import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const [progress, setProgress] = useState(0)
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const opacity = useTransform(scrollYProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0])
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1])

  // Track progress for percentage display
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setProgress(Math.round(latest * 100))
  })

  return (
    <>
      {/* Main progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left"
        style={{ scaleX, opacity }}
      >
        <div className="h-full w-full bg-gradient-to-r from-primary via-accent to-neon-cyan" />
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-neon-cyan blur-md opacity-70" />
        {/* Animated shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Progress percentage indicator */}
      <motion.div
        className="fixed top-20 right-4 z-[99] hidden lg:flex flex-col items-center gap-2"
        style={{ opacity: indicatorOpacity }}
      >
        {/* Percentage circle */}
        <motion.div
          className="relative w-14 h-14 rounded-full glass border border-border/50 flex items-center justify-center overflow-hidden"
          whileHover={{ scale: 1.1 }}
        >
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="2"
            />
            <motion.circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                pathLength: scrollYProgress,
              }}
              strokeDasharray="150.8"
              strokeDashoffset="0"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="50%" stopColor="var(--color-accent)" />
                <stop offset="100%" stopColor="var(--color-neon-cyan)" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Percentage text */}
          <span className="relative text-sm font-bold gradient-text">
            {progress}
          </span>
        </motion.div>

        {/* Scroll to top button */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 rounded-full glass border border-border/50 flex items-center justify-center hover:border-primary/30 transition-colors group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1]) }}
          aria-label="Scroll to top"
        >
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-muted-foreground group-hover:text-primary transition-colors"
          >
            <motion.path
              d="M8 12V4M8 4L4 8M8 4L12 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.button>
      </motion.div>
    </>
  )
}
