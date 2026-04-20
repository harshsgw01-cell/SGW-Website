import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Github, Linkedin, Twitter, Instagram, ArrowUp, Heart } from 'lucide-react'
import { Section3D } from '@/components/Section3D'

const footerLinks = {
  services: [
    { name: 'Custom Software', href: '#services' },
    { name: 'Cloud Solutions', href: '#services' },
    { name: 'Mobile Development', href: '#services' },
    { name: 'AI & Machine Learning', href: '#services' },
    { name: 'IT Consulting', href: '#services' },
  ],
  company: [
    { name: 'About Us', href: '#about' },
    { name: 'Our Process', href: '#process' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Technologies', href: '#technologies' },
    { name: 'Careers', href: '#' },
  ],
  resources: [
    { name: 'Blog', href: '#' },
    { name: 'Case Studies', href: '#portfolio' },
    { name: 'Documentation', href: '#' },
    { name: 'Support', href: '#contact' },
    { name: 'Contact', href: '#contact' },
  ],
}

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter', gradient: 'from-blue-400 to-blue-600' },
  { icon: Linkedin, href: '#', label: 'LinkedIn', gradient: 'from-blue-500 to-blue-700' },
  { icon: Github, href: '#', label: 'GitHub', gradient: 'from-gray-600 to-gray-800' },
  { icon: Instagram, href: '#', label: 'Instagram', gradient: 'from-pink-500 to-purple-600' },
]

export function Footer() {
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: true, margin: '-100px' })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer ref={footerRef} className="relative bg-card/80 backdrop-blur-sm border-t border-border overflow-hidden">
      {/* 3D Background */}
      <Section3D variant="footer" />

      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1400px] h-[300px] bg-gradient-to-t from-primary/5 via-accent/5 to-transparent rounded-full blur-[150px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.a
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollToTop() }}
              className="inline-flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20"
                whileHover={{ rotate: 5 }}
              >
                <span className="text-white font-bold text-xl">S</span>
              </motion.div>
              <span className="text-2xl font-bold font-[var(--font-heading)] gradient-text">
                Softgoway
              </span>
            </motion.a>
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
              Empowering businesses with innovative technology solutions that drive growth
              and operational excellence. Your vision, our expertise.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${social.gradient} flex items-center justify-center shadow-lg transition-all`}
                  whileHover={{ scale: 1.1, y: -3, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="w-5 h-5 text-white" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {[
            { title: 'Services', links: footerLinks.services },
            { title: 'Company', links: footerLinks.company },
            { title: 'Resources', links: footerLinks.resources },
          ].map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * (sectionIndex + 1) }}
            >
              <h4 className="font-semibold font-[var(--font-heading)] text-lg mb-5">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + linkIndex * 0.05 }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); scrollToSection(link.href) }}
                      className="text-muted-foreground hover:text-primary transition-colors relative group"
                    >
                      {link.name}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {"© " + new Date().getFullYear() + " Softgoway Technologies Pvt. Ltd. Made with"}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </motion.span>
            in India
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors relative group">
              Privacy Policy
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors relative group">
              Terms of Service
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </a>
            <motion.button
              onClick={scrollToTop}
              className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/20"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
