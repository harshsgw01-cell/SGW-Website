import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink, Github } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedSection } from '@/components/AnimatedSection'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    title: 'FinTech Dashboard',
    description: 'Real-time financial analytics platform with advanced data visualization and AI-powered insights.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Healthcare Platform',
    description: 'HIPAA-compliant telehealth solution connecting patients with healthcare providers globally.',
    tags: ['Next.js', 'GraphQL', 'MongoDB', 'WebRTC'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'E-commerce Suite',
    description: 'Scalable multi-vendor marketplace with real-time inventory and intelligent recommendations.',
    tags: ['Vue.js', 'Python', 'Redis', 'Kubernetes'],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'AI Content Studio',
    description: 'Machine learning-powered content creation platform for marketing teams and agencies.',
    tags: ['React', 'Python', 'TensorFlow', 'GCP'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Logistics Hub',
    description: 'End-to-end supply chain management system with real-time tracking and route optimization.',
    tags: ['Angular', 'Go', 'PostgreSQL', 'Azure'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    title: 'EdTech Platform',
    description: 'Interactive learning management system with adaptive curriculum and progress analytics.',
    tags: ['React', 'Node.js', 'MongoDB', 'AWS'],
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop',
    gradient: 'from-indigo-500 to-purple-500',
  },
]

function ProjectCard({ project, index, progress }: { project: (typeof projects)[0]; index: number; progress: number }) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Calculate card-specific progress for staggered animations
  const cardStart = index / projects.length
  const cardEnd = (index + 1) / projects.length
  const cardProgress = Math.max(0, Math.min(1, (progress - cardStart) / (cardEnd - cardStart)))
  
  // Scale and opacity based on progress
  const scale = 0.8 + cardProgress * 0.2
  const opacity = 0.5 + cardProgress * 0.5

  return (
    <motion.div
      className="flex-none w-[380px] lg:w-[450px] h-[520px] lg:h-[580px] portfolio-card"
      style={{
        transform: `scale(${scale})`,
        opacity: opacity,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="group relative h-full rounded-3xl bg-card/90 backdrop-blur-sm border border-border overflow-hidden card-lift"
        whileHover={{ y: -10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Image */}
        <div className="relative h-56 lg:h-64 overflow-hidden">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          />
          <div className={cn('absolute inset-0 bg-gradient-to-t', project.gradient, 'opacity-50')} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Overlay buttons */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 rounded-full bg-white/90 text-black shadow-lg backdrop-blur-sm glow-primary"
            >
              <ExternalLink className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 rounded-full bg-white/90 text-black shadow-lg backdrop-blur-sm glow-accent"
            >
              <Github className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Floating badge */}
          <motion.div
            className={cn(
              'absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r shadow-lg',
              project.gradient
            )}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Featured Project
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          <h3 className="text-xl lg:text-2xl font-bold font-[var(--font-heading)] mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm lg:text-base mb-6 leading-relaxed line-clamp-3">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <motion.span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary/80 text-muted-foreground border border-border/50 hover:border-primary/30 hover:bg-primary/10 hover:text-primary transition-all cursor-default"
                whileHover={{ scale: 1.05 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Glow effect */}
        <motion.div
          className={cn(
            'absolute -inset-1 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none rounded-3xl blur-2xl',
            'bg-gradient-to-r',
            project.gradient
          )}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
        />
      </motion.div>
    </motion.div>
  )
}

export function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef(null)
  const isInView = useInView(headerRef, { once: true, margin: '-100px' })
  const [scrollProgress, setScrollProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const backgroundX = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  // Horizontal scroll with GSAP ScrollTrigger
  useLayoutEffect(() => {
    const section = sectionRef.current
    const trigger = triggerRef.current
    const scrollContainer = scrollContainerRef.current
    
    if (!section || !trigger || !scrollContainer) return

    const cards = scrollContainer.querySelectorAll('.portfolio-card')
    const totalWidth = scrollContainer.scrollWidth - window.innerWidth + 200

    const ctx = gsap.context(() => {
      // Main horizontal scroll animation
      const horizontalScroll = gsap.to(scrollContainer, {
        x: () => -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            setScrollProgress(self.progress)
          },
        },
      })

      // Individual card animations
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0.5,
            scale: 0.85,
            rotateY: 15,
          },
          {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalScroll,
              start: 'left 80%',
              end: 'left 20%',
              scrub: true,
            },
          }
        )
      })

      // Background animation
      gsap.to('.portfolio-bg', {
        xPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="portfolio" className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ x: backgroundX }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-full blur-[200px] portfolio-bg"
        />
      </div>

      {/* Header section - outside pinned area */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32 pb-12">
        <AnimatedSection className="text-center">
          <div ref={headerRef}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block px-5 py-2 text-sm font-medium text-primary bg-primary/10 rounded-full mb-6 border border-primary/20"
            >
              Our Work
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[var(--font-heading)] mb-6 text-balance"
            >
              Featured <span className="gradient-text-animated">Projects</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty"
            >
              Explore our portfolio of successful projects that have helped businesses
              transform their operations and achieve remarkable growth.
            </motion.p>
          </div>
        </AnimatedSection>
      </div>

      {/* Horizontal Scroll Trigger Area */}
      <div ref={triggerRef} className="relative min-h-screen">
        {/* Progress indicator */}
        <div className="fixed top-1/2 right-8 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-2">
          {projects.map((_, index) => (
            <motion.div
              key={index}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                scrollProgress >= index / projects.length && scrollProgress <= (index + 1) / projects.length
                  ? 'w-2 h-8 bg-gradient-to-b from-primary to-accent'
                  : 'bg-border'
              )}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollProgress < 0.1 ? 1 : 0 }}
          className="absolute top-8 left-1/2 -translate-x-1/2 text-muted-foreground text-sm flex items-center gap-2"
        >
          <span>Scroll to explore</span>
          <motion.span
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.div>

        {/* Horizontal scroll container */}
        <div className="h-screen flex items-center overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex gap-8 pl-[10vw] pr-[20vw] will-change-transform"
            style={{ perspective: '1000px' }}
          >
            {projects.map((project, index) => (
              <ProjectCard 
                key={project.title} 
                project={project} 
                index={index}
                progress={scrollProgress}
              />
            ))}
            
            {/* End card - CTA */}
            <motion.div className="flex-none w-[380px] lg:w-[450px] h-[520px] lg:h-[580px] flex items-center justify-center portfolio-card">
              <div className="text-center glass-card rounded-3xl p-12 border-gradient">
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg glow-primary"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <span className="text-3xl font-bold text-white">+</span>
                </motion.div>
                <h3 className="text-2xl font-bold font-[var(--font-heading)] mb-4">
                  Have a Project in Mind?
                </h3>
                <p className="text-muted-foreground mb-8">
                  {"Let's discuss how we can bring your vision to life."}
                </p>
                <motion.button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg btn-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start a Conversation
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom spacer for scroll continuation */}
      <div className="h-24" />
    </section>
  )
}
