import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Code2,
  Cloud,
  Smartphone,
  Brain,
  Shield,
  Database,
  Globe,
  Palette,
  BarChart3,
  Cog,
  X,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TiltCard } from '@/components/TiltCard'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection'
import { Section3D } from '@/components/Section3D'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: Code2,
    title: 'Custom Software Development',
    description: 'Tailored software solutions designed to meet your unique business requirements.',
    features: ['Enterprise Applications', 'Web Platforms', 'API Development', 'Legacy Modernization'],
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59, 130, 246, 0.4)',
  },
  {
    icon: Cloud,
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and migration services for modern businesses.',
    features: ['AWS / Azure / GCP', 'Cloud Migration', 'DevOps & CI/CD', 'Infrastructure as Code'],
    gradient: 'from-purple-500 to-pink-500',
    glow: 'rgba(168, 85, 247, 0.4)',
  },
  {
    icon: Smartphone,
    title: 'Mobile Development',
    description: 'Native and cross-platform mobile applications that engage users.',
    features: ['iOS Development', 'Android Development', 'React Native', 'Flutter Apps'],
    gradient: 'from-orange-500 to-red-500',
    glow: 'rgba(249, 115, 22, 0.4)',
  },
  {
    icon: Brain,
    title: 'AI & Machine Learning',
    description: 'Intelligent solutions powered by cutting-edge AI and ML technologies.',
    features: ['Predictive Analytics', 'Natural Language Processing', 'Computer Vision', 'AI Chatbots'],
    gradient: 'from-green-500 to-emerald-500',
    glow: 'rgba(34, 197, 94, 0.4)',
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    description: 'Comprehensive security solutions to protect your digital assets.',
    features: ['Security Audits', 'Penetration Testing', 'Compliance', 'Threat Monitoring'],
    gradient: 'from-red-500 to-orange-500',
    glow: 'rgba(239, 68, 68, 0.4)',
  },
  {
    icon: Database,
    title: 'Data Engineering',
    description: 'Build robust data pipelines and analytics infrastructure.',
    features: ['Data Warehousing', 'ETL Pipelines', 'Big Data Solutions', 'Real-time Analytics'],
    gradient: 'from-indigo-500 to-purple-500',
    glow: 'rgba(99, 102, 241, 0.4)',
  },
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Modern, responsive web applications and e-commerce platforms.',
    features: ['React / Next.js', 'E-commerce', 'Progressive Web Apps', 'Headless CMS'],
    gradient: 'from-cyan-500 to-blue-500',
    glow: 'rgba(6, 182, 212, 0.4)',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'User-centered design that creates memorable digital experiences.',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    gradient: 'from-pink-500 to-rose-500',
    glow: 'rgba(236, 72, 153, 0.4)',
  },
  {
    icon: BarChart3,
    title: 'Business Intelligence',
    description: 'Transform data into actionable insights for better decisions.',
    features: ['Dashboard Development', 'KPI Tracking', 'Data Visualization', 'Reporting Solutions'],
    gradient: 'from-amber-500 to-orange-500',
    glow: 'rgba(245, 158, 11, 0.4)',
  },
  {
    icon: Cog,
    title: 'IT Consulting',
    description: 'Strategic technology guidance to drive your digital transformation.',
    features: ['Digital Strategy', 'Technology Assessment', 'Process Optimization', 'IT Roadmapping'],
    gradient: 'from-slate-400 to-zinc-500',
    glow: 'rgba(148, 163, 184, 0.4)',
  },
]

function ServiceCard({
  service,
  onClick,
}: {
  service: (typeof services)[0]
  onClick: () => void
}) {
  return (
    <TiltCard glowColor={service.glow} className="h-full">
      <motion.div
        onClick={onClick}
        className="group relative h-full p-6 lg:p-8 rounded-3xl bg-card/80 backdrop-blur-sm border border-border overflow-hidden cursor-pointer transition-all duration-500 hover:border-primary/30"
        whileHover={{ y: -5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Gradient background on hover */}
        <div
          className={cn(
            'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br',
            service.gradient
          )}
        />

        {/* Animated background shapes */}
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-2xl group-hover:scale-150 transition-transform duration-700" />

        {/* Icon */}
        <motion.div
          className={cn(
            'relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br shadow-lg',
            service.gradient
          )}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <service.icon className="w-8 h-8 text-white" />
        </motion.div>

        {/* Content */}
        <h3 className="relative text-xl font-bold font-[var(--font-heading)] mb-3 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="relative text-muted-foreground mb-6 line-clamp-2">{service.description}</p>

        {/* Features preview */}
        <div className="relative flex flex-wrap gap-2 mb-4">
          {service.features.slice(0, 2).map((feature) => (
            <span
              key={feature}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary/80 text-muted-foreground border border-border/50"
            >
              {feature}
            </span>
          ))}
          {service.features.length > 2 && (
            <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              +{service.features.length - 2} more
            </span>
          )}
        </div>

        {/* Hover indicator */}
        <div className="relative flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
          <span>Learn more</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>
    </TiltCard>
  )
}

function ServiceModal({
  service,
  onClose,
}: {
  service: (typeof services)[0]
  onClose: () => void
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-card rounded-3xl border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className={cn('p-8 bg-gradient-to-br', service.gradient)}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6"
          >
            <service.icon className="w-10 h-10 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white font-[var(--font-heading)]">
            {service.title}
          </h3>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">{service.description}</p>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            What We Offer
          </h4>
          <ul className="space-y-4">
            {service.features.map((feature, index) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div
                  className={cn('w-2 h-2 rounded-full bg-gradient-to-r', service.gradient)}
                />
                <span className="text-foreground">{feature}</span>
              </motion.li>
            ))}
          </ul>
          <motion.button
            onClick={() => {
              onClose()
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className={cn(
              'mt-8 w-full py-4 rounded-xl font-semibold text-white text-center flex items-center justify-center gap-2 bg-gradient-to-r group',
              service.gradient
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef(null)
  const isInView = useInView(headerRef, { once: true, margin: '-100px' })
  const [selectedService, setSelectedService] = useState<(typeof services)[0] | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating background animation
      gsap.to('.services-bg-blob', {
        y: -30,
        duration: 4,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 1,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* 3D Background */}
      <Section3D variant="services" />

      {/* Background patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] services-bg-blob" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] services-bg-blob" />
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <div ref={headerRef}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block px-5 py-2 text-sm font-medium text-primary bg-primary/10 rounded-full mb-6 border border-primary/20"
            >
              Our Services
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[var(--font-heading)] mb-6 text-balance"
            >
              Comprehensive IT{' '}
              <span className="gradient-text">Solutions</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty"
            >
              From concept to deployment, we offer end-to-end technology services designed to
              accelerate your digital transformation and drive measurable results.
            </motion.p>
          </div>
        </AnimatedSection>

        <StaggerContainer
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          staggerDelay={0.08}
        >
          {services.map((service) => (
            <StaggerItem key={service.title}>
              <ServiceCard service={service} onClick={() => setSelectedService(service)} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
