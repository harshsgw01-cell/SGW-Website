import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection'
import { Section3D } from '@/components/Section3D'

gsap.registerPlugin(ScrollTrigger)

const technologies = [
  { name: 'React', category: 'Frontend', color: 'from-cyan-400 to-blue-500' },
  { name: 'Next.js', category: 'Frontend', color: 'from-gray-600 to-black' },
  { name: 'Vue.js', category: 'Frontend', color: 'from-green-400 to-emerald-600' },
  { name: 'Angular', category: 'Frontend', color: 'from-red-500 to-pink-600' },
  { name: 'TypeScript', category: 'Language', color: 'from-blue-500 to-blue-700' },
  { name: 'Node.js', category: 'Backend', color: 'from-green-500 to-green-700' },
  { name: 'Python', category: 'Language', color: 'from-yellow-400 to-blue-500' },
  { name: 'Go', category: 'Language', color: 'from-cyan-400 to-cyan-600' },
  { name: 'Java', category: 'Language', color: 'from-orange-500 to-red-600' },
  { name: 'AWS', category: 'Cloud', color: 'from-orange-400 to-orange-600' },
  { name: 'Azure', category: 'Cloud', color: 'from-blue-400 to-blue-600' },
  { name: 'GCP', category: 'Cloud', color: 'from-red-400 to-yellow-500' },
  { name: 'Docker', category: 'DevOps', color: 'from-blue-400 to-blue-600' },
  { name: 'Kubernetes', category: 'DevOps', color: 'from-blue-500 to-blue-700' },
  { name: 'PostgreSQL', category: 'Database', color: 'from-blue-500 to-blue-700' },
  { name: 'MongoDB', category: 'Database', color: 'from-green-500 to-green-700' },
  { name: 'Redis', category: 'Database', color: 'from-red-500 to-red-700' },
  { name: 'GraphQL', category: 'API', color: 'from-pink-500 to-pink-700' },
  { name: 'TensorFlow', category: 'AI/ML', color: 'from-orange-400 to-orange-600' },
  { name: 'PyTorch', category: 'AI/ML', color: 'from-red-500 to-orange-600' },
]

const categories = ['All', 'Frontend', 'Backend', 'Language', 'Cloud', 'DevOps', 'Database', 'API', 'AI/ML']

export function Technologies() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef(null)
  const isInView = useInView(headerRef, { once: true, margin: '-100px' })
  const [activeCategory, setActiveCategory] = useState('All')

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const backgroundX = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  const filteredTech = activeCategory === 'All' 
    ? technologies 
    : technologies.filter(t => t.category === activeCategory)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating animation for tech cards
      gsap.to('.tech-bg-blob', {
        y: -30,
        duration: 3,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.5,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="technologies" className="relative py-24 lg:py-32 overflow-hidden">
      {/* 3D Background */}
      <Section3D variant="technologies" />

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ x: backgroundX }}
          className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[150px] tech-bg-blob"
        />
        <motion.div
          style={{ x: backgroundX }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] tech-bg-blob"
        />
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
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
              Tech Stack
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[var(--font-heading)] mb-6 text-balance"
            >
              Technologies We <span className="gradient-text">Master</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty"
            >
              We stay at the forefront of technology, leveraging the most powerful and
              reliable tools to build solutions that stand the test of time.
            </motion.p>
          </div>
        </AnimatedSection>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20'
                  : 'bg-card/80 border border-border hover:border-primary/30 text-muted-foreground hover:text-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Technology grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {filteredTech.map((tech, index) => (
            <motion.div
              key={tech.name}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              whileHover={{ y: -8, scale: 1.05 }}
              className="group relative p-6 lg:p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/30 transition-all duration-300 text-center cursor-pointer"
            >
              {/* Gradient glow on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Floating glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`} />

              <div className="relative">
                {/* Tech icon placeholder - gradient circle */}
                <motion.div
                  className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center shadow-lg`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <span className="text-white font-bold text-lg">{tech.name.charAt(0)}</span>
                </motion.div>

                {/* Tech name */}
                <h3 className="text-lg font-semibold font-[var(--font-heading)] mb-2 group-hover:text-primary transition-colors">
                  {tech.name}
                </h3>
                <span className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${tech.color} text-white opacity-80`}>
                  {tech.category}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
