import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Target, Eye, Award, Users, Lightbulb, Shield } from 'lucide-react'
import { TiltCard } from '@/components/TiltCard'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection'
import { Section3D } from '@/components/Section3D'

gsap.registerPlugin(ScrollTrigger)

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description: 'We embrace cutting-edge technologies and creative solutions to solve complex challenges.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Client Partnership',
    description: 'We build lasting relationships, treating every client as a valued partner in success.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'We deliver excellence through rigorous testing and attention to every detail.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Award,
    title: 'Proven Excellence',
    description: 'Our track record speaks volumes with consistent delivery of outstanding results.',
    gradient: 'from-purple-500 to-pink-500',
  },
]

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef(null)
  const isInView = useInView(headerRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax for decorative elements
      gsap.to('.about-parallax-slow', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      gsap.to('.about-parallax-fast', {
        yPercent: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="relative py-24 lg:py-32 overflow-hidden">
      {/* 3D Background */}
      <Section3D variant="about" />

      {/* Background elements with parallax */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] about-parallax-slow"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] about-parallax-fast"
        />
      </div>

      {/* Decorative grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--color-foreground) 1px, transparent 1px)`,
          backgroundSize: '100% 80px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-20">
          <div ref={headerRef}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block px-5 py-2 text-sm font-medium text-primary bg-primary/10 rounded-full mb-6 border border-primary/20"
            >
              About Us
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[var(--font-heading)] mb-6 text-balance"
            >
              Pioneering Digital{' '}
              <span className="gradient-text">Transformation</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto text-pretty leading-relaxed"
            >
              Softgoway Technologies is a premier IT consulting and software development company,
              dedicated to empowering businesses with innovative technology solutions that drive growth
              and operational excellence.
            </motion.p>
          </div>
        </AnimatedSection>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-8 mb-24">
          <AnimatedSection direction="left" delay={0.2}>
            <TiltCard glowColor="rgba(139, 92, 246, 0.3)">
              <div className="group relative p-8 lg:p-10 rounded-3xl bg-card/80 backdrop-blur-sm border border-border overflow-hidden transition-all duration-500 hover:border-primary/30 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -right-20 -top-20 w-60 h-60 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-8 shadow-lg shadow-primary/20"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Target className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl lg:text-3xl font-bold font-[var(--font-heading)] mb-6">
                    Our Mission
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    To deliver transformative technology solutions that accelerate business growth,
                    enhance operational efficiency, and create lasting value for our clients through
                    innovation, expertise, and unwavering commitment to excellence.
                  </p>
                </div>
              </div>
            </TiltCard>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.3}>
            <TiltCard glowColor="rgba(168, 85, 247, 0.3)">
              <div className="group relative p-8 lg:p-10 rounded-3xl bg-card/80 backdrop-blur-sm border border-border overflow-hidden transition-all duration-500 hover:border-accent/30 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-8 shadow-lg shadow-accent/20"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <Eye className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl lg:text-3xl font-bold font-[var(--font-heading)] mb-6">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    To be the global leader in digital transformation, recognized for our innovative
                    solutions, exceptional talent, and the meaningful impact we create for businesses
                    and communities worldwide.
                  </p>
                </div>
              </div>
            </TiltCard>
          </AnimatedSection>
        </div>

        {/* Values */}
        <AnimatedSection delay={0.4}>
          <h3 className="text-2xl lg:text-3xl font-bold font-[var(--font-heading)] text-center mb-12">
            Why Choose <span className="gradient-text">Softgoway</span>
          </h3>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
          {values.map((value) => (
            <StaggerItem key={value.title}>
              <motion.div
                className="group relative p-6 lg:p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/20 transition-all duration-500 h-full"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <motion.div
                  className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <value.icon className="w-7 h-7 text-white" />
                </motion.div>
                
                <h4 className="relative text-lg font-bold font-[var(--font-heading)] mb-3 group-hover:text-primary transition-colors">
                  {value.title}
                </h4>
                <p className="relative text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
