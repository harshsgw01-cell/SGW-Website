import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Scene3D } from '@/components/Scene3D'
import { GlowButton } from '@/components/GlowButton'
import { TextReveal, GradientText } from '@/components/TextReveal'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '50+', label: 'Happy Clients' },
  { value: '8+', label: 'Years Experience' },
  { value: '99%', label: 'Client Satisfaction' },
]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef(null)
  const isHeadlineInView = useInView(headlineRef, { once: true })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 300])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating elements animation
      gsap.to('.floating-element', {
        y: -20,
        duration: 2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.3,
      })

      // Stats counter animation
      if (statsRef.current) {
        const statValues = statsRef.current.querySelectorAll('.stat-value')
        statValues.forEach((stat) => {
          const value = stat.getAttribute('data-value')
          if (value) {
            const numValue = parseInt(value.replace(/\D/g, ''))
            gsap.fromTo(
              stat,
              { textContent: '0' },
              {
                textContent: numValue,
                duration: 2,
                ease: 'power2.out',
                snap: { textContent: 1 },
                scrollTrigger: {
                  trigger: stat,
                  start: 'top 80%',
                },
              }
            )
          }
        })
      }

      // Parallax background blobs
      gsap.to('.hero-blob', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <Scene3D />

      {/* Animated gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/30 to-background z-10" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] floating-element hero-blob" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] floating-element hero-blob" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 to-transparent rounded-full" />
        
        {/* Additional glow effects */}
        <motion.div 
          className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-neon-cyan/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--color-foreground) 1px, transparent 1px),
                           linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        ref={textRef}
        style={{ y, opacity, scale }}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-primary/20 mb-8 backdrop-blur-xl glow-primary"
        >
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Innovating the Future of Technology
          </span>
        </motion.div>

        {/* Main heading with enhanced text reveal */}
        <div ref={headlineRef} className="mb-8">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-[var(--font-heading)] leading-[1.1]"
            style={{ perspective: '1000px' }}
          >
            <motion.span
              className="block text-balance overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <TextReveal 
                text="Transform Your Vision Into" 
                type="words"
                animation="slide"
                delay={0.3}
                staggerChildren={0.05}
              />
            </motion.span>
            <motion.span
              className="block mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <GradientText className="text-balance inline-block text-glow" animate>
                <TextReveal 
                  text="Digital Excellence" 
                  type="chars"
                  animation="wave"
                  delay={0.8}
                  staggerChildren={0.03}
                />
              </GradientText>
            </motion.span>
          </motion.h1>
        </div>

        {/* Subtitle with fade animation */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={isHeadlineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 text-pretty leading-relaxed"
        >
          Softgoway Technologies delivers cutting-edge IT solutions that empower businesses
          to thrive in the digital age. From custom software to cloud infrastructure, we build
          the future you envision.
        </motion.p>

        {/* CTA Buttons with enhanced hover effects */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isHeadlineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <GlowButton
            variant="primary"
            size="lg"
            onClick={scrollToContact}
            className="group min-w-[200px] btn-glow"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </GlowButton>

          <GlowButton
            variant="secondary"
            size="lg"
            onClick={scrollToServices}
            className="min-w-[200px] glass"
          >
            Explore Services
          </GlowButton>
        </motion.div>

        {/* Stats with enhanced animations */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 60 }}
          animate={isHeadlineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={isHeadlineInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: 1.8 + index * 0.1,
                type: 'spring',
                stiffness: 100,
              }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div 
                className="relative p-4 rounded-2xl glass-card border border-border/50 hover:border-primary/30 transition-all card-lift"
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="stat-value text-4xl sm:text-5xl font-bold gradient-text-animated font-[var(--font-heading)]"
                  data-value={stat.value}
                  initial={{ scale: 0.5 }}
                  animate={isHeadlineInView ? { scale: 1 } : {}}
                  transition={{ delay: 2 + index * 0.1, type: 'spring', stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator with enhanced animation */}
        <motion.button
          onClick={scrollToAbout}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
        >
          <motion.span 
            className="text-sm font-medium tracking-wider uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll to explore
          </motion.span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="p-2 rounded-full glass border border-border/50 group-hover:border-primary/30 group-hover:glow-primary"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </motion.div>
    </section>
  )
}
